<template>
  <v-container class="pa-0 mt-10">
    <v-form ref="form" :disabled="formDisabled" lazy-validation>
      <v-row>
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
        <v-col cols="12" md="6">
          <label>Recipients</label>
          <div class="d-flex flex-row">
            <v-combobox
              v-model="form.recipients"
              v-bind:rules="emailRequiredRule.concat(emailArrayRules)"
              clearable
              hint="Add one or more valid email addresses"
              multiple
              small-chips
              deletable-chips
              :delimiters="[' ', ',', ';']"
              outlined
              dense
              hide-details="auto"
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      Press <kbd>enter</kbd> or <kbd>,</kbd> or
                      <kbd>space</kbd> to add multiple email addresses
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-combobox>

            <v-btn
              outlined
              class="ml-5 mt-1 float-right"
              color="primary"
              @click="showCcBcc = !showCcBcc"
            >
              <span>CC / BCC</span>
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="showCcBcc">
        <v-col cols="12" md="6">
          <label>CC</label>
          <v-combobox
            v-model="form.cc"
            :rules="emailArrayRules"
            clearable
            hint="Add one or more valid email addresses"
            multiple
            small-chips
            deletable-chips
            :delimiters="[' ', ',', ';']"
            outlined
            dense
            hide-details="auto"
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    Press <kbd>enter</kbd> or <kbd>,</kbd> or
                    <kbd>space</kbd> to add multiple email addresses
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>
        </v-col>
        <v-col cols="12" md="6">
          <label>BCC</label>
          <v-combobox
            v-model="form.bcc"
            :rules="emailArrayRules"
            clearable
            hint="Add one or more valid email addresses"
            multiple
            small-chips
            deletable-chips
            :delimiters="[' ', ',', ';']"
            outlined
            dense
            hide-details="auto"
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    Press <kbd>enter</kbd> or <kbd>,</kbd> or
                    <kbd>space</kbd> to add multiple email addresses
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>
        </v-col>
      </v-row>

      <v-row>
        <!-- delay -->
        <v-col cols="12" md="4" class="dateTimePicker-wrapper">
          <label>Delay Until (optional)</label>
          <v-datetime-picker
            :text-field-props="{
              dense: true,
              outlined: true,
              'hide-details': 'auto',
            }"
            v-model="form.datetime"
          ></v-datetime-picker>
        </v-col>

        <!-- priority -->
        <v-col cols="12" md="4">
          <label>Priority</label>
          <v-select
            v-model="form.priority"
            :items="emailPriorityOptions"
            item-text="text"
            item-value="value"
            placeholder="000-000-0000"
            hide-details="auto"
            outlined
            dense
          ></v-select>
        </v-col>

        <!-- tag -->
        <v-col cols="12" md="4">
          <label>Tag (optional)</label>
          <v-text-field
            v-model="form.tag"
            hide-details="auto"
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <!-- subject -->
        <v-col cols="12" md="12">
          <label>Subject</label>
          <v-text-field
            v-model="form.subject"
            :rules="[v => !!v || 'Subject is required']"
            hide-details="auto"
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <!-- body format -->
        <v-col cols="12" md="12" class="pb-0">
          <div class="d-flex">
            <label class="mt-1">Body</label>
            <v-radio-group
              v-model="form.bodyFormat"
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
          <v-textarea
            v-if="form.bodyFormat === 'text'"
            v-model="form.body"
            :rules="bodyRequiredRule"
            hide-details="auto"
            outlined
            dense
            value="Enter your email body here."
            class="mb-3"
          ></v-textarea>
          <Ckeditor
            v-else
            v-model="form.body"
            :value.sync="form.body"
          ></Ckeditor>
        </v-col>
      </v-row>

      <v-row>
        <!-- Attachments -->
        <v-col cols="12" md="12">
          <label>Attachments (optional)</label>
          <Upload
            @filesUploaded="processAttachments($event)"
            :fileCount="form.attachments.length"
            class="my-3 py-3"
          />
        </v-col>
      </v-row>

      <v-row justify="center" class="my-10">
        <v-col md="4">
          <v-btn width="100%" large outlined @click="reloadForm">
            <span>Cancel</span>
          </v-btn>
        </v-col>
        <v-col md="4">
          <v-btn width="100%" large color="primary" @click="send()">
            <span>Send</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

import chesService from '@/services/chesService';

import * as Utils from '@/utils/utils';
import { Regex } from '../../utils/constants';

import DatetimePicker from '@/components/vuetify/DatetimePicker';
import Upload from '@/components/ches/Upload';
import Ckeditor from '@/components/ches/Ckeditor';

export default {
  name: 'EmailForm',
  components: {
    Upload,
    'v-datetime-picker': DatetimePicker,
    Ckeditor,
  },
  data: () => ({
    // form data fields
    form: {
      attachments: [],
      bcc: [],
      body: '',
      bodyFormat: 'text',
      cc: [],
      datetime: null,
      priority: 'normal',
      recipients: [],
      subject: '',
      tag: '',
    },
    // for display helpers
    formDisabled: false,
    showCcBcc: false,
    emailPriorityOptions: [
      { text: 'Normal', value: 'normal' },
      { text: 'High', value: 'high' },
      { text: 'Low', value: 'low' },
    ],

    // --- form validation rules --
    // at least one email required in combobox
    emailRequiredRule: [
      (v) => v.length > 0 || 'Please enter at least 1 email address',
    ],
    // emails in combobox must be valid
    emailArrayRules: [
      (v) =>
        v.every((item) => new RegExp(Regex.EMAIL).test(item)) ||
        'Please enter all valid email addresses',
    ],
    bodyRequiredRule: [(v) => !!v || 'Email Body is required'],
  }),

  computed: {
    // get current users email from auth vuex module
    currentUserEmail() {
      return this.$store.getters['auth/email'];
    },
  },

  methods: {
    ...mapActions('alert', ['showAlert', 'clearAlert']),
    ...mapActions('ches', ['addTransaction']),

    // ---- send email ----
    async send() {
      if (this.$refs.form.validate()) {
        try {
          // create email object
          const email = {
            attachments: this.form.attachments,
            bcc: this.showCcBcc ? this.form.bcc : [],
            body: this.form.body ,
            bodyType: this.form.bodyFormat,
            cc: this.showCcBcc ? this.form.cc : [],
            delayTS:
              this.form.datetime !== null
                ? new Date(this.form.datetime).getTime()
                : 0,
            from: this.currentUserEmail,
            priority: this.form.priority,
            subject: this.form.subject,
            tag: this.form.tag,
            to: this.form.recipients,
          };
          // send email with ches service
          const { data } = await chesService.email(email);
          // show success alert
          this.showAlert({
            type: 'success',
            text:
              `<strong>Your email has been successfully sent.<br />Transaction ID: </strong>${data.txId} <strong>Message ID: </strong> ${data.messages[0].msgId}`,
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

    async processAttachments(files) {
      const attachments = await Promise.all(
        files.map((file) => Utils.convertFileToAttachment(file))
      );
      this.form.attachments = attachments;
    },

    reloadForm() {
      this.$refs.form.resetValidation();

      this.form = {
        attachments: [],
        bcc: [],
        body: '',
        bodyFormat: 'text',
        cc: [],
        datetime: null,
        priority: 'normal',
        recipients: [],
        subject: '',
        tag: '',
      };
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
/* inline labels */
.flex-label {
  width: 6rem;
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
/* give wysiwyg editor a min height */
.bodyDiv ::v-deep .ck-editor__editable {
  min-height:180px;
}
</style>
