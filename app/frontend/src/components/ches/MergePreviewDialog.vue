<template>
  <v-dialog
    :max-width="800"
    persistent
    v-bind:value="show"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
  >
    <v-card>
      <div class="dialog-body">
        <v-card-title class primary-title>
          Mail Merge Preview
        </v-card-title>
        <v-card-text>

        </v-card-text>
      </div>
      <v-card-actions class="justify-center">
        <v-btn
          color="primary"
          @click="previewPrevious()"
        >
          <span>Previous</span>
        </v-btn>

        <v-btn
          color="primary"
          @click="previewNext()"
        >
          <span>Next</span>
        </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'MergePreviewDialog',
  methods: {
    closeDialog() {
      this.$emit('close-dialog');
    },
  },
  props: {
    show: {
      default: false,
      type: Boolean
    },
  }
};
</script>

<style scoped>
</style>
