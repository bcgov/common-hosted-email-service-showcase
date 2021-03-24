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

export default {
  name: 'email',
  data: () => ({
    error: false,
    emailData: '',
    loading: false
  }),
  methods: {
    async sendEmail() {
      this.error = false;
      this.loading = true;
      try {
        const response = await chesService.email();

        console.log(response);

        this.emailData = response;
      } catch (e) {
        this.error = true;
        this.emailData = e;
      }
      this.loading = false;
    }
  }
};
</script>



