<template>
  <v-container class="text-center">
    <v-btn @click="sendEmail" color="primary" large :loading="loading">
      <v-icon left>mail_outline</v-icon>
      <span>Send Email</span>
    </v-btn>
    <p class="mt-5">{{ emailData }}</p>
  </v-container>
</template>

<script>
import chesService from '@/services/chesService';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'TestEmail',
  data: () => ({
    error: false,
    emailData: '',
    loading: false
  }),

  computed: {
    ...mapGetters('ches', ['emails']),
  },

  methods: {
    ...mapActions('ches', ['addTx']),

    async sendEmail() {
      this.error = false;
      this.loading = true;
      try {
        // call ches service
        const email = {
          bodyType: 'html',
          body: '<h1>Welcome to Common Services</h1><p>Sent by <a href="https://bcgov.github.io/common-hosted-email-service/">CHES</a></p>',
          delayTS: 0,
          from: 'abc@gov.bc.ca',
          subject: 'CHES Email Message',
          to: ['xyz@gov.bc.ca'],
          tag: 'email_123'
        };
        const response = await chesService.email(email);
        // show in component
        this.emailData = response;

        // update store
        await this.addTx(response);
      } catch (e) {
        this.error = true;
        this.emailData = e;
      }
      this.loading = false;
    }
  }
};
</script>
