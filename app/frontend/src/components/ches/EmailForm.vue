<template>
  <v-container class="pa-0 mt-10">
    <v-form
      ref="emailForm"
      :disabled="emailFormDisabled"
      v-model="emailFormValid"
      lazy-validation
    >
      <v-row>
        <v-col cols="12" md="6" class="disabled-input-container">
          <label>Sender</label>
          <v-text-field
            v-model="userName"
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
              v-model="email.recipients"
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
            v-model="email.cc"
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
            v-model="email.bcc"
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
        <v-col cols="12" md="4">
          <label>Priority</label>
          <v-select
            v-model="email.priority"
            :items="emailPriorityOptions"
            item-text="text"
            item-value="value"
            placeholder="000-000-0000"
            hide-details="auto"
            outlined
            dense
          ></v-select>
        </v-col>

        <!-- delay field -->
        <v-col cols="12" md="4">
          <v-menu
            v-model="delayMenu"
            data-test="menu-form-startDate"
            :close-on-content-click="true"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <label>Delay Until (optional)</label>
              <v-text-field
                v-model="email.delay"
                placeholder="yyyy-mm-dd"
                append-icon="event"
                v-on:click:append="delayMenu = true"
                readonly
                v-on="on"
                dense
                outlined
                hide-details="auto"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="email.delay"
              @input="delayMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>

        <!-- Tag field -->
        <v-col cols="12" md="4">
          <label>Tag (optional)</label>
          <v-text-field
            v-model="email.tag"
            hide-details="auto"
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="12">
          <label>Subject (optional)</label>
          <v-text-field
            v-model="email.subject"
            hide-details="auto"
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="12" class="pb-0">
          <div class="d-flex">
            <label class="mt-1">Body</label>
            <v-radio-group
              v-model="email.bodyFormat"
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
        <v-col cols="12" md="12">
          <v-textarea
            v-model="email.body"
            :rules="bodyRequiredRule"
            hide-details="auto"
            outlined
            dense
            value="Enter your email body here."
            class="mb-3"
          ></v-textarea>
        </v-col>
      </v-row>

      <label>Attachments (optional)</label>
      <Upload @filesUploaded="processAttachments($event)" class="my-3 py-3" />

      <v-row justify="center" class="my-10">
        <v-col md="4">
          <v-btn width="100%" large color="primary" @click="send">
            <span>Send</span>
          </v-btn>
        </v-col>
        <v-col md="4">
          <v-btn width="100%" large outlined @click="cancelSend">
            <span>Cancel</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import chesService from '@/services/chesService';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import Upload from '@/components/ches/Upload';

export default {
  name: 'EmailForm',
  components: {
    Upload
  },
  data: () => ({
    // email fields
    email: {
      attachments: [],
      bcc: [],
      body: '',
      bodyFormat: 'html',
      cc: [],
      delay: '2021-04-15',
      priority: 'normal',
      recipients: [],
      subject: 'CHES test email',
      tag: '',
    },
    // for display helpers
    error: false,
    loading: false,
    emailFormDisabled: false,
    alert: false,
    showCcBcc: false,
    emailPriorityOptions: [
      { text: 'Normal', value: 'normal' },
      { text: 'High', value: 'high' },
      { text: 'Low', value: 'low' },
    ],
    delayMenu: false,

    uploadDialog:true,

    sendResult: '',
    // validation
    emailFormValid: false,
    // at least one email required in combobox
    emailRequiredRule: [
      (v) => {
        if(v.length < 1){
          return 'A Recipient E-mail is required';
        }
        else{
          return true;
        }
      }
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

    bodyRequiredRule: [v => !!v || 'Email Body is required'],

  }),

  computed: {
    ...mapGetters('auth', ['userName']),
    // ...mapGetters('ches', ['']),
  },

  methods: {
    ...mapActions('ches', ['addTx']),
    ...mapMutations('ches', ['showAlert']),

    async send() {
      if (this.$refs.emailForm.validate()) {
        // form setup
        this.error = false;
        this.loading = true;

        // if cc/bcc is hidden clear vlaues
        if (!this.showCcBcc) {
          this.email.cc = this.email.bcc = [];
        }

        try {
          // call ches service
          const email = {
            attachments: this.email.attachments,
            bcc: this.email.bcc,
            body: this.email.body,
            bodyType: this.email.bodyFormat,
            cc: this.email.cc,
            delayTS: 0,
            from: this.userName,
            priority: this.email.priority,
            subject: this.email.subject,
            tag: this.email.tag,
            to: this.email.recipients,
          };

          const response = await chesService.email(email);

          // show success alert
          this.alert = {
            type: 'success',
            text: '<p><strong>Your email has been successfully sent.<br />Transaction ID:</strong>' + response.txId +  ' <strong>Message ID:</strong>' +  response.messages[0].msgId + '</p>'
          };

          this.showAlert(this.alert);

          this.sendResult = response;

          // update store
          await this.addTx(response);
        } catch (e) {
          this.error = true;
          this.sendResult = e;
        }
        this.loading = false;
      }
      // else form isnt valid
      else {
        window.scrollTo(0, 0);
      }
    },

    async processAttachments(files){
      const attachments = await Promise.all(files.map(file => {
        const content = this.toBase64(file);
        return {
          content: content,
          contentType: file.type,
          filename: file.name,
          encoding: 'base64'
        };
      }));
      console.log('attachments', attachments);
      this.email.attachments = attachments;
    },

    async toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = () => resolve(btoa(reader.result));
        reader.onerror = error => reject(error);
      });
    },

    // download message response in in csv format
    // downloadMsg(response){
    //   try {
    //     if (response && response.data) {
    //       const blob = new Blob([response.data], {
    //         type: response.headers['content-type'],
    //       });
    //       const url = window.URL.createObjectURL(blob);
    //       const a = document.createElement('a');
    //       a.href = url;
    //       a.download = 'msg';
    //       a.style.display = 'none';
    //       a.classList.add('hiddenDownloadTextElement');
    //       document.body.appendChild(a);
    //       a.click();
    //       document.body.removeChild(a);
    //     } else {
    //       throw new Error('No data in response from exportSubmissions call');
    //     }
    //   }
    //   catch (error){
    //     console.log('error!');
    //   }
    // },

    clickHandler () {
      this.$emit('click');
    },

    cancelSend() {
      console.log('cancelSend'); // eslint-disable-line no-console
    },
  },

  mounted: function () {
    this.emailSent = true;

    // add alert content to store to show in another component
    this.showAlert(this.alert);
  },
};
</script>

<style scoped>
.disabled-input-container >>> .v-input {
  background-color: #f2f2f2;
  color: blue;
}
/* select text was getting cut off at the bottom */
.v-select >>> .v-select__selections {
  line-height: 22px;
}
/* make radio buttons inline */
.v-input--radio-group >>> .v-input--radio-group__input {
  flex-direction: row !important;
}
.v-input--radio-group >>> .v-input--radio-group__input > div {
  margin-bottom: 0 !important;
  margin-left: 2rem;
}
</style>
