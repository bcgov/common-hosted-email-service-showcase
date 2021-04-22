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
              class="ml-5 mt-1float-right"
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
            dense
            outlined
            hide-details="auto"
            v-model="form.delay"
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
          <label>Subject (optional)</label>
          <v-text-field
            v-model="form.subject"
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
              <v-radio class="" label="Plain Text" value="txt"></v-radio>
              <v-radio class="" label="HTML" value="html"></v-radio>
            </v-radio-group>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <!-- body -->
        <v-col cols="12" md="12">
          <v-textarea
            v-model="form.body"
            :rules="bodyRequiredRule"
            hide-details="auto"
            outlined
            dense
            value="Enter your email body here."
            class="mb-3"
          ></v-textarea>
        </v-col>
      </v-row>

      <!-- Attachments -->
      <label>Attachments (optional)</label>
      <Upload
        @filesUploaded="processAttachments($event)"
        :fileCount="form.attachments.length"
        class="my-3 py-3"
      />

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
    </v-form>
  </v-container>
</template>

<script>
import chesService from '@/services/chesService';
import { mapActions } from 'vuex';
import Upload from './Upload';

export default {
  name: 'EmailForm',
  components: {
    Upload,
  },
  data: () => ({
    // form fields
    form: {
      attachments: [],
      bcc: [],
      body: '',
      bodyFormat: 'txt',
      cc: [],
      delay: null,
      priority: 'normal',
      recipients: [],
      subject: '',
      tag: '',
    },
    // for display helpers
    formDisabled: false,
    alert: false,
    showCcBcc: false,
    emailPriorityOptions: [
      { text: 'Normal', value: 'normal' },
      { text: 'High', value: 'high' },
      { text: 'Low', value: 'low' },
    ],
    delayMenu: false,
    // at least one email required in combobox
    emailRequiredRule: [
      (v) => {
        if (v.length < 1) {
          return 'A Recipient E-mail is required';
        } else {
          return true;
        }
      },
    ],
    // emails in combobox must be valid
    emailArrayRules: [
      (v) => {
        for (let i = 0; i < v.length; i++) {
          if (
            !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(
              v[i]
            )
          )
            return 'Please check your email address format';
        }
        return true;
      },
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
    ...mapActions('alert', ['showAlert']),
    ...mapActions('ches', ['addTransaction']),

    async send() {
      if (this.$refs.form.validate()) {
        try {
          // create email object
          const email = {
            attachments: this.form.attachments,
            bcc: this.showCcBcc ? this.form.bcc : [],
            body: this.form.body,
            bodyType: this.form.bodyFormat,
            cc: this.showCcBcc ? this.form.cc : [],
            delayTS: 0,
            from: this.currentUserEmail,
            priority: this.form.priority,
            subject:
              this.form.subject !== ''
                ? this.form.subject
                : 'Email from CHES-SHowcase',
            tag: this.form.tag,
            to: this.form.recipients,
          };
          // send email with ches service
          const response = await chesService.email(email);

          // show success alert
          this.showAlert({
            type: 'success',
            text:
              `<strong>Your email has been successfully sent.<br />Transaction ID: </strong>${response.txId} <strong>Message ID: </strong> ${response.messages[0].msgId}`,
          });

          // update store
          this.addTransaction(response);
          this.reloadForm();
        } catch (e) {
          this.error = true;
          // show error alert
          this.showAlert({
            type: 'error',
            text: e,
          });
        }
      } else { // else form has validation error
        window.scrollTo(0, 0);
      }
    },

    async processAttachments(files) {
      const attachments = await Promise.all(
        files.map((file) => this.convertFileToAttachment(file))
      );
      this.form.attachments = attachments;
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

    reloadForm() {
      this.$refs.form.resetValidation();
      this.form = {
        attachments: [],
        bcc: [],
        body: '',
        bodyFormat: 'txt',
        cc: [],
        delay: null,
        priority: 'normal',
        recipients: [],
        subject: '',
        tag: '',
      };

      const el = document.querySelector('.dateTimePicker-wrapper');
      const input = (el.querySelector('input').value = '');
      if (input) input.value = '';

      window.scrollTo(0, 0);
    },
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
/* make datetimepicker look ike other fields :( */
.dateTimePicker-wrapper ::v-deep .v-input {
  padding-top: 0;
  margin-top: 0;
  input {
    border: 1px solid #606060 !important;
    border-radius: 3px;
    padding: 1.2rem 0.7rem;
  }
  .v-input__slot::before {
    display: none;
  }
  .v-text-field__details {
    display: none;
  }
  :after {
    display: none;
  }
}
</style>
