<template>
  <div class="text-center">

    <v-btn @click="healthCheck(true)" v-if="!error" color="success" rounded :loading="loading">
      <v-icon left>check</v-icon>
      <span>API health</span>
    </v-btn>

    <v-btn @click="healthCheck(true)" v-else small color="error" rounded :loading="loading">
      <v-icon left>error</v-icon>
      <span>API error</span>
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

  </div>
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

  mounted: function() {
    this.healthCheck();
  },

  methods: {

    async healthCheck(showDialog = false) {
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
      this.showDialog = showDialog;
    }
  }

};
</script>



