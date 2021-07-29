<template>
  <div
    ref="dropZone"
    @drop.prevent="addFiles($event)"
    @click="fileInputBrowse()"
    @dragover.prevent="dragover = true"
    @dragenter.prevent="dragover = true"
    @dragleave.prevent="dragover = false"
    :class="['drop-zone', { 'grey lighten-2': dragover }]"
  >
    <v-container>
      <v-row
        v-if="files.length < 1"
        class="d-flex flex-column"
        dense
        align="center"
        justify="center"
      >
        <p class="">Drag &amp; Drop your file(s) here, or click to Browse.</p>
      </v-row>

      <div v-if="files.length > 0">
        <v-row v-for="file in files" v-bind:key="file.name">
          <slot name="file" v-bind:file="file">
            <v-col sm="10">
              <v-icon>article</v-icon>
              {{ file.name }}
              <span class="text--secondary">({{ file.size }} bytes)</span>
            </v-col>
            <v-col sm="2">
              <v-btn
                @click.stop="removeFile(file.name)"
                icon
                class="float-right"
              >
                <v-icon> mdi-close-circle </v-icon>
              </v-btn>
            </v-col>
          </slot>
        </v-row>
      </div>
    </v-container>

    <v-file-input
      class="d-none"
      @change="fileInputChange($event)"
      ref="fileInput"
      multiple
      label="File input"
    ></v-file-input>
  </div>
</template>

<script>

/**
 * This component handles the UI for the email attachments.
 * It shows the user a drag/drop message and then lists the files added.
 * The attached files are added to a 'files' array and then emitted
 * to the parent form component, where the data is added to the form POST.
 */

import { mapActions } from 'vuex';
import { Attachments } from '@/utils/constants';

export default {
  name: 'Upload',
  // clear upload div ('files' array) if parent form is reset
  props: [
    'fileCount'
  ],

  watch: {
    fileCount(newVal, oldVal) {
      console.log('Prop changed: ', newVal, ' | was: ', oldVal); // eslint-disable-line no-console
      if(newVal == 0) {
        this.files = [];
      }
    }
  },

  data() {
    return {
      dragover: false,
      files: [],
    };
  },

  methods: {
    ...mapActions('alert', ['showAlert', 'clearAlert']),

    addFiles(e) {
      this.dragover = false;
      // remove any files already added
      if (this.files.length > 0) this.files = [];
      // add to 'files' array
      e.dataTransfer.files.forEach((element) => this.files.push(element));

      // validate attachments
      if (!this.validateAttachments(this.files)) {
        // show error alert
        this.alert = {
          type: 'warning',
          text: 'Total Attachment size cannot excede 20MB',
        };
        this.showAlert(this.alert);
      }
      // else attachments are valid
      else {
        // Send uploaded files to parent component
        this.$emit('filesUploaded', this.files);
        this.clearAlert();
      }
    },

    fileInputBrowse() {
      this.$refs.fileInput.$refs.input.click();
    },

    fileInputChange(e) {
      var dropObj = {
        dataTransfer: {
          files: e,
        },
      };
      this.addFiles(dropObj);
    },

    removeFile(fileName) {
      // get index of file
      const index = this.files.findIndex((file) => file.name === fileName);
      // if file was added, remove it
      if (index > -1) this.files.splice(index, 1);
      // re-send uploaded files to parent component
      this.$emit('filesUploaded', this.files);
    },

    validateAttachments(files) {
      // check size limit
      const attachmentsSize =
        files.length === 0
          ? 0
          : files.map((f) => f.size).reduce((a, b) => a + b);
      return (attachmentsSize <= Attachments.ATTACHMENT_SIZE_LIMIT) ? true : false;
    },
  },
};
</script>

<style scoped>
.drop-zone {
  border: 3px dashed #606060;
  border-radius: 0.5rem;
}
</style>
