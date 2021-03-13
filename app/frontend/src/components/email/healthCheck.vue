<template>
  <v-container class="text-center">
    <v-btn @click="healthCheck" color="primary" large :loading="loading">
      <v-icon left>mdi-plus</v-icon>
      <span>health check</span>
    </v-btn>

    <BaseDialog :show="showDialog" @close-dialog="showDialog = false">
      <template v-slot:icon>
        <v-icon v-if="!error" large color="success">info</v-icon>
        <v-icon v-else large color="error">warning</v-icon>
      </template>
      <template v-slot:text>
        <p>{{ healthData }}</p>
      </template>
    </BaseDialog>

  </v-container>
</template>

<script>
import chesService from '@/services/chesService';

export default {
  name: 'healthCheck',
  data: () => ({
    error: false,
    healthData: '',
    loading: false,
    showDialog: false
  }),
  methods: {
    async healthCheck() {
      this.error = false;
      this.loading = true;
      try {
        const response = await chesService.healthCheck();
        this.healthData = response.data;
      } catch (e) {
        this.error = true;
        this.healthData = e;
      }
      this.loading = false;
      this.showDialog = true;
    }
  }
};
</script>



