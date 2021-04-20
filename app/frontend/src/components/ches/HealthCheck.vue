<template>
  <div class="text-center">

    <v-btn @click="healthCheck(true)" v-if="!error" color="success" rounded :loading="loading">
      <v-icon left>check</v-icon>
      <span>health</span>
    </v-btn>

    <v-btn @click="healthCheck(true)" v-else small color="error" rounded :loading="loading">
      <v-icon left>error</v-icon>
      <span>error</span>
    </v-btn>

    <BaseDialog :show="showDialog" @close-dialog="showDialog = false">
      <template v-slot:icon>
        <v-icon v-if="!error" large color="success">check_circle</v-icon>
        <v-icon v-else large color="error">warning</v-icon>
      </template>
      <template v-slot:text>
        <pre>{{ healthData }}</pre>
      </template>
    </BaseDialog>

  </div>
</template>

<script>
import chesService from '@/services/chesService';

export default {
  name: 'HealthCheck',
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
<style scoped>
pre {
 white-space: pre-wrap;       /* css-3 */
 white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
 white-space: -pre-wrap;      /* Opera 4-6 */
 white-space: -o-pre-wrap;    /* Opera 7 */
 word-wrap: break-word;       /* Internet Explorer 5.5+ */
}
</style>



