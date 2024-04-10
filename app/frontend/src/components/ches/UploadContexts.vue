<template>
  <div>
    <div v-if="excelParsed">
      <v-simple-table dense class="contexts-table">
        <template v-slot:default>
          <thead>
            <th
              v-for="header in excel.headers[0]"
              :key="header"
              class="text-left pa-2"
            >
              {{ header }}
            </th>
          </thead>
          <tbody>
            <tr v-for="row in excel.data" :key="excel.data.indexOf(row)">
              <td v-for="val in row" :key="val" class="text-left truncate pa-2">
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
          <p class="pt-5 mb-1">
            Drag &amp; Drop your Excel file here, or click to Browse.
          </p>
          <p class="">
            A sample Excel file containing contexts is available to download on the <router-link :to="{ name: 'MergeAbout'}" >About</router-link> tab.
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

import * as XLSX from 'xlsx';
import { format, parse, isValid } from 'date-fns';

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
      const file = e.dataTransfer.files[0];
      // validate Excel file
      if (this.validateFile(file)) {
        // parse file
        this.parseFile(file, this.addContextsToStore);
        // make file data avalable in parent component
        this.$emit('fileUploaded', file);
        // show table of contexts
        this.excelParsed = true;

        this.clearAlert();
      }
      // else attachments are valid
      else {
        // show error alert
        this.alert = {
          type: 'warning',
          text: 'Context file size cannot excede 20MB',
        };
        this.showAlert(this.alert);
      }
    },

    parseFile(file, cb) {
      const reader = new FileReader();
      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, {
          type: reader.readAsBinaryString ? 'binary' : 'array',
          cellDates: true,
          dateNF: Formats.EXCEL_PARSE_FORMAT,
        });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });

        const excel = { cols: [], headers: [], data: [] };
        excel.cols = this.make_cols(ws['!ref']);

        const headers = this.sanitizeHeaders(data[0]);
        excel.headers = [headers];
        // actual data is rows 2 onward
        excel.data = data.slice(1);

        let contextsArray = [];
        excel.data.forEach((element) => {
          let message = {
            to: [],
            cc: [],
            bcc: [],
            tag: undefined,
            delayTS: undefined,
            delayTSDisplay: undefined,
            context: {},
          };
          excel.cols.forEach((col) => {
            let fieldName = excel.headers[0][col.key];
            switch (fieldName.toLowerCase()) {
              case 'to':
                message.to = Utils.getAddresses(element[col.key]);
                break;
              case 'cc':
                message.cc = Utils.getAddresses(element[col.key]);
                break;
              case 'bcc':
                message.bcc = Utils.getAddresses(element[col.key]);
                break;
              case 'tag':
                message.tag = element[col.key];
                break;
              case 'delayts':
                message.delayTS = this.parseDelayTs(element[col.key]);
                // for display in the table, format it nicely (not unix milliseconds...)
                element[col.key] = message.delayTS
                  ? format( parse(element[col.key], Formats.TEST_DT_FORMAT, new Date()), Formats.CONTEXTS_TS_FORMAT)
                  : undefined;
                break;
              default:
                this.handleDefault(message.context, element, fieldName, col.key);
                // for display in the table, return the value from the context (altered for date or timestamp)
                element[col.key] = message.context[fieldName];
            }
          });
          if (Utils.validateContext(message)) contextsArray.push(message);
        });

        let contextsJson = JSON.stringify(contextsArray, null, 2);
        const contextVariables = Utils.contextsToVariables(contextsJson);

        cb({
          excel: excel,
          contexts: contextsJson,
          contextVariables: contextVariables,
        });
      };

      if (reader.readAsBinaryString) reader.readAsBinaryString(file);
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
      let value = original;
      if (original === '') {
        value = 'val';
      }
      if (existing.includes(val)) {
        count++;
        return this.makeHeaderUnique(
          existing,
          value,
          `${value}${count}`,
          count
        );
      } else {
        return value;
      }
    },

    // process as a custom context unless field looks like a date or timestamp
    handleDefault(context, data, fieldName, key) {
      const value = data[key];
      const isDate = isValid(parse(value, Formats.TEST_DT_FORMAT, new Date()));
      const isTimestamp = isValid(parse(value, Formats.TEST_DT_FORMAT, new Date())) && fieldName.toLowerCase().endsWith('ts');
      const dateObj = parse(value, Formats.TEST_DT_FORMAT, new Date());
      if (isTimestamp) {
        context[fieldName] =
          format(dateObj, Formats.CONTEXTS_TS_FORMAT) !== 'Invalid Date'
            ? format(dateObj, Formats.CONTEXTS_TS_FORMAT)
            : value;
      } else if (isDate) {
        context[fieldName] =
          format(dateObj, Formats.CONTEXTS_DT_FORMAT) !== 'Invalid Date'
            ? format(dateObj, Formats.CONTEXTS_DT_FORMAT)
            : value;
      }  else {
        context[fieldName] = value;
      }
    },

    parseDelayTs(value) {
      const dateObj = parse(value, Formats.TEST_DT_FORMAT, new Date());
      if (isValid(dateObj, Formats.TEST_DT_FORMAT, true)) {
        //return the utc integer value of the timestamp
        return dateObj.getTime();
      }
      // no good, return undefined so API doesn't process it.
      return undefined;
    },

    fileInputBrowse() {
      this.$refs.fileInput.$refs.input.click();
    },

    fileInputChange(e) {
      var dropObj = {
        dataTransfer: {
          files: {
            0: e
          },
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

<style lang="scss" scoped>
.drop-zone {
  border: 3px dashed #606060;
  border-radius: 0.5rem;
}
.truncate {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* style excel stuff */
.contexts-table{
  display: flex;
  border: 1px solid grey;
  thead {
    background: rgb(211, 211, 211);
  }
}
</style>
