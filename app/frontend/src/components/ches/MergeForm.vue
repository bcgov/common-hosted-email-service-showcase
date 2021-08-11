<template>
  <v-form ref="form" lazy-validation>
    <v-container class="pa-0 mt-10">
      <v-row>
        <!-- sender -->
        <v-col cols="12" md="6" class="disabled-input-container">
          <label>Sender</label>
          <v-text-field
            v-model="currentUserEmail"
            hide-details="auto"
            readonly
            outlined
            dense
          ></v-text-field>
        </v-col>
        <!-- priority -->
        <v-col cols="12" md="6">
          <label>Priority</label>
          <v-select
            v-model="priority"
            :items="emailPriorityOptions"
            item-text="text"
            item-value="value"
            hide-details="auto"
            outlined
            dense
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <!-- subject -->
        <v-col cols="12" md="12">
          <label>Subject</label>
          <v-text-field
            v-model="subject"
            :rules="[(v) => !!v || 'Subject is required']"
            hide-details="auto"
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <!-- contextsType -->
        <v-col class="pb-0 col-md-8">
          <div class="d-flex">
            <label class="flex-label">Contexts</label>
            <v-radio-group
              v-model="contextsType"
              class="mt-0 ml-5 d-flex"
              hide-details="auto"
            >
              <v-radio class="" label="Excel" value="xlsx"></v-radio>
              <v-radio class="" label="JSON" value="json"></v-radio>
            </v-radio-group>
          </div>
        </v-col>
        <!-- delete xlsx contexts -->
        <v-col class="pb-0 col-md-4 text-sm-right">
          <span v-if="contextsType === 'xlsx' && excelParsed">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  class="mx-1"
                  color="red"
                  @click="showDeleteContextsExcelDialog = true"
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
              </template>
              <span>Delete Contexts from Excel file upload</span>
            </v-tooltip>
          </span>
          <BaseDialog
            :show="showDeleteContextsExcelDialog"
            type="CONTINUE"
            @close-dialog="showDeleteContextsExcelDialog = false"
            @continue-dialog="deleteContextsExcel"
          >
            <template #title>Confirm Deletion</template>
            <template #text>
              Are you sure you wish to delete the contexts you added from an
              Excel file?
            </template>
            <template #button-text-continue>
              <span>Delete</span>
            </template>
          </BaseDialog>
        </v-col>
      </v-row>

      <!-- Contexts -->
      <!-- Excel -->
      <v-row v-show="contextsType === 'xlsx'">
        <v-col cols="12" md="12">
          <UploadContexts />
        </v-col>
      </v-row>

      <!-- JSON -->
      <v-row v-show="contextsType === 'json'">
        <v-col cols="12" md="12">
          <!--
          :class="bodyHtmlErrors.length > 0 ? 'errorBorder json-textarea' : 'json-textarea'"
          -->
          <v-textarea
            label="An array of message objects that each contain email recipient(s) and 'contexts' (eg: 'name') to insert into your mail merge template."
            v-model="contexts"
            :rules="[(v) => !!v || 'A JSON array containing Contexts data is required']"
            class="json-textarea"
            hint="Upload the sample Contexts files in Excel format found on the 'About' tab"
            outlined
            dense
          ></v-textarea>

        </v-col>
      </v-row>

      <v-row>
        <!-- body -->
        <v-col cols="12" md="12">
          <v-tabs vertical class="merge-tabs">
            <v-tab> Body</v-tab>
            <v-tab v-if="contextVariables.length">Variables </v-tab>

            <v-tab-item>
              <!-- body format -->
              <div class="d-flex mt-1 mb-3">
                <v-radio-group
                  v-model="bodyType"
                  class="mt-0 ml-2 d-flex"
                  hide-details="auto"
                >
                  <v-radio class="" label="Plain Text" value="text"></v-radio>
                  <v-radio class="" label="HTML" value="html"></v-radio>
                </v-radio-group>
              </div>

              <!-- text -->
              <v-textarea
                v-if="bodyType === 'text'"
                v-model="bodyText"
                :rules="bodyTextRequiredRule"
                outlined
                dense
                class="mb-3"
              ></v-textarea>
              <!-- html -->
              <div v-else>
                <Ckeditor
                  v-model="bodyHtml"
                  :value.sync="bodyHtml"
                  :class="bodyHtmlErrors.length > 0 ? 'errorBorder' : ''"
                ></Ckeditor>
                <VMessages :value="bodyHtmlErrors" color="error" class="ma-2" />
              </div>
            </v-tab-item>

            <v-tab-item>
              <v-simple-table dense class="contexts-table mt-2">
                <template v-slot:default>
                  <tbody>
                    <tr
                      v-for="variable in contextVariables"
                      :key="contextVariables.indexOf(variable)"
                    >
                      <td>
                        {{ variable }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>

      <v-row>
        <!-- Attachments -->
        <v-col cols="12" md="12" class="pt-0">
          <label>Attachments (optional)</label>
          <Upload
            @filesUploaded="processAttachments($event)"
            :fileCount="attachments.length"
            class="my-3 py-3"
          />
        </v-col>
      </v-row>

      <v-row justify="center" class="my-10">
        <!-- cancel button -->
        <v-col md="4">
          <v-btn width="100%" large outlined @click="reloadForm">
            <span>Cancel</span>
          </v-btn>
        </v-col>
        <!-- preview button -->
        <v-col md="4">
          <v-btn
            width="100%"
            large
            outlined
            @click="loadPreview()">
            <span>Preview</span>
          </v-btn>
          <MergePreviewDialog
            :show="showPreviewDialog"
            @close-dialog="showPreviewDialog = false"
          >
          </MergePreviewDialog>
        </v-col>
        <!-- Send button -->
        <v-col md="4">
          <v-btn width="100%" large color="primary" @click="send()">
            <span>Send</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex';
import { mapFields } from 'vuex-map-fields';

import chesService from '@/services/chesService';

import * as Utils from '@/utils/utils';

import Upload from '@/components/ches/Upload';
import UploadContexts from '@/components/ches/UploadContexts';
import Ckeditor from '@/components/ches/Ckeditor';
import MergePreviewDialog from '@/components/ches/MergePreviewDialog';

export default {
  name: 'MergeForm',
  components: {
    Upload,
    UploadContexts,
    Ckeditor,
    MergePreviewDialog,
  },

  data: () => ({

    emailPriorityOptions: [
      { text: 'Normal', value: 'normal' },
      { text: 'High', value: 'high' },
      { text: 'Low', value: 'low' },
    ],

    showDeleteContextsExcelDialog: false,
    showPreviewDialog: false,

    // validation
    bodyTextRequiredRule: [(v) => !!v || 'Email Body is required'],
    bodyHtmlErrors: [],
  }),

  computed: {
    // get form data from vuex
    ...mapFields('ches', [
      'mergeForm.attachments',
      'mergeForm.bodyHtml',
      'mergeForm.bodyText',
      'mergeForm.bodyType',
      'mergeForm.priority',
      'mergeForm.recipients',
      'mergeForm.subject',
      'mergeForm.contextsType',
      'mergeForm.excelParsed',
      'mergeForm.excel',
      'mergeForm.contexts',
      'mergeForm.contextVariables',
      'mergeForm',

      // mergePreview data
      'mergePreview',
    ]),

    // get current users email from vuex
    currentUserEmail() {
      return this.$store.getters['auth/email'];
    },
  },

  watch: {
    // show validation message if bodyHtml is empty
    bodyHtml: function () {
      this.validateHtmlBody();
    }
  },

  methods: {
    // ches actions in vuex
    ...mapActions('ches', ['addTransaction']),
    // alert actions in vuex
    ...mapActions('alert', ['showAlert', 'clearAlert']),

    // TODO: Show mail merge preview modal
    // ---- Preview ----
    async loadPreview() {
      // if form is valid
      if (this.validateForm()) {
        try {
          // create new object with all fields
          const formData = {
            attachments: this.attachments,
            bodyType: this.bodyType,
            body: this.bodyType == 'text' ? this.bodyText : this.bodyHtml,
            from: this.currentUserEmail,
            subject: this.subject,
            priority: this.priority,
            contexts: Utils.getContextsObject(this.contexts),
          };
          // get preview data returned from CHES api
          const { data } = await chesService.mergePreview(formData);
          if (data && data.length > 0) {
            // build 'mergePreview' data object here
            this.mergePreview = data;
            // show in modal
            this.showPreviewDialog = true;
          }
        } catch (e) {
          this.error = true;
          // show error alert
          this.showAlert({
            type: 'error',
            text: e,
          });
        }
      }
      // else form has validation error
      else {
        this.scrollToError();
      }
    },

    // ---- Send Mail Merge ----
    async send() {
      if (this.validateForm()) {
        try {
          // create new object with all fields
          const email = {
            attachments: this.attachments,
            bodyType: this.bodyType,
            body: this.bodyType === 'html' ? this.bodyHtml : this.bodyText,
            contexts: Utils.getContextsObject(this.contexts),
            from: this.currentUserEmail,
            priority: this.priority,
            subject: this.subject,
          };
          // send email with ches service
          const { data } = await chesService.merge(email);

          // show success alert
          this.showAlert({
            type: 'success',
            text: `<strong>Your Mail Merge has been successfully sent.<br />Transaction ID: </strong>${data.txId}`,
          });
          // add emails to history table
          this.addTransaction(data);
          // reset form
          this.reloadForm();
        } catch (e) {
          this.error = true;
          // show error alert
          this.showAlert({
            type: 'error',
            text: e,
          });
        }
      }
      // else form has validation error
      else {
        this.scrollToError();
      }
    },

    // remove contexts from Excel file
    deleteContextsExcel() {
      // clear props
      this.contextVariables = [];
      this.contexts = '';
      this.excelParsed = false;
      // close dialog
      this.showDeleteContextsExcelDialog = false;
    },

    // Attachments
    async processAttachments(files) {
      const attachments = await Promise.all(
        files.map((file) => Utils.convertFileToAttachment(file))
      );
      this.attachments = attachments;
    },

    // reset form
    reloadForm() {
      this.$refs.form.resetValidation();
      this.bodyHtmlErrors = [];

      // reset store:
      this.mergeForm = {
        ...this.mergeForm,
        ...{
          attachments: [],
          bodyHtml: '',
          bodyText: '',
          bodyType: 'html',
          priority: 'normal',
          recipients: [],
          subject: '',
          contextsType: 'xlsx',
          excelParsed: false,
          excel: {
            cols: [],
            data: [],
            headers: [],
          },
          contexts: '',
          contextVariables: [],
        },
      };
      window.scrollTo(0, 0);
    },

    async scrollToError(){
      await new Promise((r) => setTimeout(r, 50));
      const el = document.querySelector(
        '.v-messages.error--text:first-of-type'
      );
      el.scrollIntoView(true);
      window.scrollBy(0, -80);
    },

    validateHtmlBody(){
      if (this.bodyType === 'html' && this.bodyHtml === '') {
        this.bodyHtmlErrors = ['Email Body is required'];
        return false;
      }
      else{
        this.bodyHtmlErrors = [];
        return true;
      }
    },

    validateForm() {
      // make JSON contexts element visible to show error if empty
      if(this.contexts == '') this.contextsType = 'json';

      // if vuetify rules pass
      if (this.$refs.form.validate()
      // and bodyHtml is valid
        && this.validateHtmlBody()) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.clearAlert();
  },
};
</script>

<style scoped lang="scss">
.disabled-input-container ::v-deep .v-input {
  background-color: #f2f2f2;
}
/* select text was getting cut off at the bottom */
.v-select ::v-deep .v-select__selections {
  line-height: 22px;
}
/* inline labels */
.flex-label {
  width: 7rem;
  margin-top: 6px;
}
/* make radio buttons inline */
.v-input--radio-group ::v-deep .v-input--radio-group__input {
  flex-direction: row !important;
  & > div {
    margin-bottom: 0 !important;
    &:not(:first-child) {
      margin-left: 2rem;
    }
  }
}
.json-textarea ::v-deep textarea {
  font-size: 85%;
  line-height: 1.2;
  font-family: courier;
  padding: 1rem 0;
}
/* style excel stuff */
.contexts-table {
  border: 1px solid grey;
}
/* give wysiwyg editor a min height */
.bodyDiv ::v-deep .ck-editor__editable {
  min-height: 125px;
}
/* un-style variables/body tabs */
.merge-tabs ::v-deep {
  .v-tabs-slider-wrapper {
    display: none;
  }
  .v-tabs-bar{
    margin-right: 1rem;
  }
  .v-tab {
    width: 7rem;
    border-bottom: 2px solid gray;

    padding: 0;
    justify-content: start;
    text-transform: none;
    color: black;
    &:hover,
    &::before,
    &::after {
      background: none;
    }
    &.v-tab--active {
      font-size: 14px;
    }
    & > span {
      display: none;
    }
  }
}
/*invalid input field border */
.errorBorder {
  border: 1px solid red;
}
</style>
