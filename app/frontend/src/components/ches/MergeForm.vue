<template>
  <v-form ref="form" :disabled="formDisabled" lazy-validation>
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
            placeholder="000-000-0000"
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
            <label class="mt-1">Contexts</label>
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
      <v-row v-if="contextsType === 'xlsx'">
        <v-col cols="12" md="12">
          <UploadContexts
            @contextsFileUploaded="onContextsFileUploaded"
            class=""
          />
        </v-col>
      </v-row>

      <!-- JSON -->
      <v-row v-if="contextsType === 'json'">
        <v-col cols="12" md="12">
          <v-textarea
            label="Contexts to insert into your mail merge template"
            v-model="contexts"
            class="json-textarea"
            hint="Enter your context data in JSON format"
            outlined
            dense
          ></v-textarea>
        </v-col>
      </v-row>

      <v-row>
        <!-- body format -->
        <v-col cols="12" md="12" class="pb-0">
          <div class="d-flex">
            <label class="mt-1">Body Format</label>
            <v-radio-group
              v-model="bodyType"
              class="mt-0 ml-5 d-flex"
              hide-details="auto"
            >
              <v-radio class="" label="Plain Text" value="text"></v-radio>
              <v-radio class="" label="HTML" value="html"></v-radio>
            </v-radio-group>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <!-- body -->
        <v-col cols="12" md="12" class="bodyDiv">
          <v-tabs vertical>
            <v-tab> Body </v-tab>
            <v-tab> Variables </v-tab>

            <v-tab-item>
              <v-textarea
                v-if="bodyType === 'text'"
                v-model="body"
                :rules="bodyRequiredRule"
                hide-details="auto"
                outlined
                dense
                class="mb-3"
              ></v-textarea>
              <ckeditor
                v-else
                :editor="editor"
                v-model="body"
                :config="editorConfig"
              ></ckeditor>
            </v-tab-item>

            <v-tab-item>
              <v-simple-table dense striped>
                <template v-slot:default>
                  <tbody>
                    <tr
                      v-for="variable in contextVariables" :key="contextVariables.indexOf(variable)"
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
        <v-col cols="12" md="12">
          <label>Attachments (optional)</label>
          <Upload
            @filesUploaded="processAttachments($event)"
            :fileCount="attachments.length"
            class="my-3 py-3"
          />
        </v-col>
      </v-row>

      <v-row justify="center" class="my-10">
        <v-col md="4">
          <v-btn width="100%" large color="primary" @click="send()">
            <span>Send</span>
          </v-btn>
        </v-col>
        <v-col md="4">
          <v-btn width="100%" large outlined @click="reloadForm">
            <span>Cancel</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex';
import { mapFields } from 'vuex-map-fields';

import CKEditor from '@ckeditor/ckeditor5-vue2';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import SourceEditing from '@ckeditor/ckeditor5-source-editing';

import chesService from '@/services/chesService';
import Upload from '@/components/ches/Upload';
import UploadContexts from '@/components/ches/UploadContexts';

export default {
  name: 'MergeForm',
  components: {
    Upload,
    UploadContexts,
    ckeditor: CKEditor.component
  },

  data: () => ({
    showDeleteContextsExcelDialog: false,

    formDisabled: false,
    emailPriorityOptions: [
      { text: 'Normal', value: 'normal' },
      { text: 'High', value: 'high' },
      { text: 'Low', value: 'low' },
    ],
    // ckeditor
    editor: ClassicEditor,
    editorConfig: {
      toolbar: {
        items: [
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          'blockQuote',
        ],
      },
    },

    // validation
    bodyRequiredRule: [(v) => !!v || 'Email Body is required'],
  }),

  computed: {
    // get form data from vuex
    // ...mapGetters('ches', ['mergeForm']),
    ...mapFields('ches', [
      'mergeForm.attachments',
      'mergeForm.body',
      'mergeForm.bodyType',
      'mergeForm.priority',
      'mergeForm.recipients',
      'mergeForm.subject',
      'mergeForm.contextsType',
      'mergeForm.excelParsed',
      'mergeForm.excel',
      'mergeForm.contexts',
      'mergeForm.contextVariables',
    ]),

    // get current users email from vuex
    currentUserEmail() {
      return this.$store.getters['auth/email'];
    },
  },

  methods: {
    // ches actions in vuex
    ...mapActions('ches', ['addTransaction']),
    // alert actions in vuex
    ...mapActions('alert', ['showAlert', 'clearAlert']),

    // send email(s)
    async send() {
      if (this.$refs.form.validate()) {
        try {
          // create email object
          const email = {
            attachments: this.attachments,
            body: this.body,
            bodyType: this.bodyType,
            contextsType: this.contextsType,
            from: this.currentUserEmail,
            priority: this.priority,
            subject: this.subject,
            to: this.recipients,
          };

          // send email with ches service
          const { data } = await chesService.email(email);

          // show success alert
          this.showAlert({
            type: 'success',
            text: `<strong>Your email has been successfully sent.<br />Transaction ID: </strong>${data.txId} <strong>Message ID: </strong> ${data.messages[0].msgId}`,
          });

          // update store
          this.addTransaction(data);
          this.reloadForm();
        } catch (e) {
          this.error = true;
          // show error alert
          this.showAlert({
            type: 'error',
            text: e,
          });
        }
      } else {
        // else form has validation error
        window.scrollTo(0, 0);
      }
    },

    onContextsFileUploaded(value) {
      alert('ooo');

      if (value) this.excelParsed = true;
    },

    // remove contexts from Excel file
    deleteContextsExcel() {
      // clear props
      this.contexts = '';
      this.excelParsed = false;
      // close dialog
      this.showDeleteContextsExcelDialog = false;
    },

    // handle email attachments
    async processAttachments(files) {
      const attachments = await Promise.all(
        files.map((file) => this.convertFileToAttachment(file))
      );
      this.attachments = attachments;
    },

    async convertFileToAttachment(file) {
      const content = await this.fileToBase64(file);
      return {
        content: content,
        contentType: file.type,
        filename: file.name,
        encoding: 'base64',
      };
    },

    async fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.replace(/^.*,/, ''));
        reader.onerror = (error) => reject(error);
      });
    },

    // reset form
    reloadForm() {
      this.$refs.form.resetValidation();

      // reset store:
      // this.mergeForm = {
      //   ...this.mergeForm,
      //   ...{
      //     attachments: [],
      //     body: '',
      //     bodyType: 'text',
      //     priority: 'normal',
      //     recipients: [],
      //     subject: '',
      //   },
      // };

      window.scrollTo(0, 0);
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
/* make radio buttons inline */
.v-input--radio-group ::v-deep .v-input--radio-group__input {
  flex-direction: row !important;
}
.v-input--radio-group ::v-deep .v-input--radio-group__input > div {
  margin-bottom: 0 !important;
  margin-left: 2rem;
}
.json-textarea ::v-deep textarea {
  font-size: 85%;
  line-height: 1.2;
  font-family: courier;
  padding: 1rem 0;
}
/* give wysiwyg editor a min height */
.bodyDiv ::v-deep .ck-editor__editable {
  min-height: 180px;
}
</style>
