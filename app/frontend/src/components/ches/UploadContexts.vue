<template>
  <div>
    <div v-if="excelParsed">
      <v-simple-table dense class="contexts-table">
        <template v-slot:default>
          <thead>
            <th
              v-for="header in excel.headers[0]"
              :key="header"
              class="text-left"
            >
              {{ header }}
            </th>
          </thead>
          <tbody>
            <tr v-for="row in excel.data" :key="excel.data.indexOf(row)">
              <td v-for="val in row" :key="val" class="text-left truncate pl-0">
                {{ val }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>

    <div
      v-if="!excelParsed"
      ref="dropZone"
      @drop.prevent="addExcelFile($event)"
      @click="fileInputBrowse()"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
      :class="['drop-zone', { 'grey lighten-2': dragover }]"
    >
      <v-container>
        <v-row
          class="d-flex flex-column"
          dense
          align="center"
          justify="center"
        >
          <p class="pt-5">
            Drag &amp; Drop your Excel file here, or click to Browse.
          </p>
        </v-row>
      </v-container>

      <v-file-input
        class="d-none"
        @change="fileInputChange($event)"
        ref="fileInput"
        label="File input"
      ></v-file-input>
    </div>
  </div>
</template>

<script>
/**
 * This component handles the UI for adding an Excel file of contexts for the mail merge.
 * The Excel file is parsed and the contexts within it
 * are added to the vuex store ('mergeForm.contexts' property)
 * The contexts are also displayed to the user in a table
 */

import XLSX from 'xlsx';
import moment from 'moment';
import { mapActions } from 'vuex';
import { mapFields } from 'vuex-map-fields';

import { Contexts, Formats } from '@/utils/constants';
import * as Utils from '@/utils/utils';

export default {
  name: 'UploadContexts',

  data() {
    return {
      dragover: false,
    };
  },

  computed: {
    ...mapFields('ches', [
      'mergeForm.excelParsed',
      'mergeForm.excel',
      'mergeForm.contexts',
      'mergeForm.contextsType',
      'mergeForm.contextVariables',
    ]),
  },

  methods: {
    ...mapActions('alert', ['showAlert', 'clearAlert']),

    addExcelFile(e) {
      this.dragover = false;

      const file = e.dataTransfer.file;
      // validate Excel file
      if (!this.validateFile(file)) {
        // show error alert
        this.alert = {
          type: 'warning',
          text: 'Context file size cannot excede 20MB',
        };
        this.showAlert(this.alert);
      }
      // else attachments are valid
      else {
        // parse file
        this.parseFile(file, this.addContextsToStore);
        // make file data avalable in parent component
        this.$emit('fileUploaded', file);
        // show table of contexts
        this.excelParsed = true;

        this.clearAlert();
      }
    },

    parseFile(file, cb) {
      // this will suppress a console warning about moment deprecating a default fallback on non ISO/RFC2822 date formats
      // we will just force it to use the new Date constructor.
      moment.createFromInputFallback = function (config) {
        config._d = new Date(config._i);
      };

      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;

      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result;

        const wb = XLSX.read(bstr, {
          type: rABS ? 'binary' : 'array',
          cellDates: true,
          dateNF: Formats.EXCEL_PARSE_FORMAT,
        });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });

        let excel = { cols: [], headers: [], data: [] };
        excel.cols = this.make_cols(ws['!ref']);

        const headers = this.sanitizeHeaders(data[0]);
        excel.headers = [headers];
        // actual data is rows 2 onward
        excel.data = data.slice(1);

        let contexts = [];

        excel.data.forEach((d) => {
          let r = {
            to: [],
            cc: [],
            bcc: [],
            tag: undefined,
            delayTS: undefined,
            delayTSDisplay: undefined,
            context: {},
          };
          let fields = excel.cols;
          fields.forEach((f) => {
            let fieldName = excel.headers[0][f.key];
            switch (fieldName.toLowerCase()) {
              case 'to':
                r.to = Utils.getAddresses(d[f.key]);
                break;
              case 'cc':
                r.cc = Utils.getAddresses(d[f.key]);
                break;
              case 'bcc':
                r.bcc = Utils.getAddresses(d[f.key]);
                break;
              case 'tag':
                r.tag = d[f.key];
                break;
              case 'delayts':
                r.delayTS = this.parseDelayTs(d[f.key]);
                // for display in the table, format it nicely (not unix milliseconds...)
                d[f.key] = r.delayTS
                  ? moment(d[f.key]).format(Formats.CONTEXTS_TS_FORMAT)
                  : undefined;
                break;
              default:
                this.handleDefault(r.context, d, fieldName, f.key);
                // for display in the table, return the value from the context (altered for date or timestamp)
                d[f.key] = r.context[fieldName];
            }
          });
          if (this.validateContext(r)) contexts.push(r);
        });

        let formContexts = JSON.stringify(contexts, null, 2);
        const contextVariables = this.contextsToVariables(formContexts);

        cb({
          excel: excel,
          contexts: formContexts,
          contextVariables: contextVariables,
        });
      };

      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
    },

    // add fields to store
    addContextsToStore(data) {
      let { excel, contexts, contextVariables } = data;
      this.excel = excel;
      this.contexts = contexts;
      this.contextsType = 'xlsx';
      this.contextVariables = contextVariables;
    },

    make_cols(refstr) {
      let o = [],
        C = XLSX.utils.decode_range(refstr).e.c + 1;
      for (var i = 0; i < C; ++i)
        o[i] = { name: XLSX.utils.encode_col(i), key: i };
      return o;
    },

    sanitizeHeaders(headers) {
      let result = [];
      headers.forEach((c) => {
        let h = this.makeHeaderUnique(result, Utils.toCamelCase(c));
        result.push(h);
      });
      return result;
    },

    makeHeaderUnique(existing, original, val = original, count = 0) {
      if ('' === original) {
        original = val = 'var';
      }
      if (existing.includes(val)) {
        count++;
        return this.makeHeaderUnique(
          existing,
          original,
          `${original}${count}`,
          count
        );
      } else {
        return val;
      }
    },
    // turn contexts into nunjucks variables
    contextsToVariables(contexts) {
      let result = [];
      if (contexts) {
        try {
          let objs = [];
          if (typeof contexts === 'string' || contexts instanceof String) {
            objs = JSON.parse(contexts.trim());
          } else {
            objs = contexts;
          }
          result = Object.keys(objs[0].context).map((k) => `{{${k}}}`);
        } catch (e) {
          result = [];
        }
      }
      return result;
    },

    handleDefault(context, data, fieldName, key) {
      const value = data[key];
      // use relaxed mode to determine if date (would fail with 0:00 on strict)
      const isDate =
        moment(value, Formats.MOMENT_PARSE_FORMAT).format() !== 'Invalid date';
      // be strict when determining if timestamp - we want valid h:mm
      const isTimestamp =
        moment(value, Formats.MOMENT_PARSE_FORMAT, true).format() !==
        'Invalid date';
      const isTimestampField =
        isTimestamp && fieldName.toLowerCase().endsWith('ts');
      if (isTimestampField) {
        const ts = moment(value);
        context[fieldName] =
          ts.format(Formats.CONTEXTS_TS_FORMAT) !== 'Invalid date'
            ? ts.format(Formats.CONTEXTS_TS_FORMAT)
            : value;
      } else if (isDate) {
        const dt = moment(value);
        context[fieldName] =
          dt.format(Formats.CONTEXTS_DT_FORMAT) !== 'Invalid date'
            ? dt.format(Formats.CONTEXTS_DT_FORMAT)
            : value;
      } else {
        context[fieldName] = value;
      }
    },

    parseDelayTs(value) {
      // eslint-disable-next-line no-console
      console.log(
        `parseDelayTs value=${value}, isTimestamp? ${moment(
          value,
          Formats.MOMENT_PARSE_FORMAT,
          true
        ).format()}`
      );
      if (
        moment(value, Formats.MOMENT_PARSE_FORMAT, true).format() !==
        'Invalid date'
      ) {
        //return the utc integer value of the timestamp
        return moment(value).utc().valueOf();
      }
      // no good, return undefined so API doesn't process it.
      return undefined;
    },

    validateContext(obj) {
      try {
        return obj && obj.to && Array.isArray(obj.to) && obj.to.length > 0;
      } catch (e) {
        return false;
      }
    },

    validateContexts(contexts) {
      let result = Array.isArray(contexts) && contexts.length > 0;
      if (result) {
        contexts.forEach((c) => {
          if (!this.validateContext(c)) {
            result = false;
          }
        });
      }
      return result;
    },

    fileInputBrowse() {
      this.$refs.fileInput.$refs.input.click();
    },

    fileInputChange(e) {
      var dropObj = {
        dataTransfer: {
          file: e,
        },
      };
      this.addExcelFile(dropObj);
    },

    validateFile(file) {
      // check size limit
      const fileSize = !file ? 0 : file.size;
      return fileSize <= Contexts.FILE_SIZE_LIMIT ? true : false;
    },
  },
};
</script>

<style scoped>
.drop-zone {
  border: 3px dashed #606060;
  border-radius: 0.5rem;
}
.truncate {
  max-width: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* style excel stuff */
.contexts-table{
  border: 1px solid grey;
  padding: 10px;
}

</style>
