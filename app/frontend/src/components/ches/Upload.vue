<template>
  <div
    @drop.prevent="onDrop($event)"
    @dragover.prevent="dragover = true"
    @dragenter.prevent="dragover = true"
    @dragleave.prevent="dragover = false"
    :class="['drop-zone', { 'grey lighten-2': dragover }]"
  >
    <v-row class="d-flex flex-column" dense align="center" justify="center">
      <p class="">Drag &amp; Drop your file(s) here, or click to Browse.</p>
    </v-row>

    <v-list
      v-if="uploadedFiles.length > 0"
      :items="uploadedFiles"
      item-key="name"
    >
      <template #[`item.name`]="{ item }">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.name }}
              <span class="ml-3 text--secondary"> {{ item.size }} bytes</span>
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn @click.stop="removeFile(item.name)" icon>
              <v-icon> mdi-close-circle </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>

      </template>
    </v-list>

  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'Upload',

  props: {},

  data() {
    return {
      dragover: false,
      uploadedFiles: [],
      todoItems: [
        { text: 'a', isComplete: true },
        { text: 'b', isComplete: true },
        { text: 'c', isComplete: true },
      ],
    };
  },

  methods: {
    ...mapMutations('ches', ['showAlert']),

    onDrop(e) {
      this.dragover = false;

      // If there are already uploaded files remove them
      if (this.uploadedFiles.length > 0) this.uploadedFiles = [];

      // // If user has uploaded multiple files but the component is not multiple throw error
      // if (!this.multiple && e.dataTransfer.files.length > 1) {
      //   // show error alert
      //   this.alert = {
      //     type: 'error',
      //     text: '<p>Only one file can be uploaded at a time</p>',
      //   };
      //   this.showAlert(this.alert);
      //   window.scrollTo(0, 0);
      // }
      // Add each file to the array of uploaded files
      // else {
      e.dataTransfer.files.forEach((element) =>
        this.uploadedFiles.push(element)
      );
      // Send uploaded files to parent component
      this.$emit('filesUploaded', this.uploadedFiles);
      // }
    },

    removeFile(fileName) {
      // get index of file
      const index = this.uploadedFiles.findIndex(
        (file) => file.name === fileName
      );
      // if file is uploaded files remove it
      if (index > -1) this.uploadedFiles.splice(index, 1);
    },

    // submit() {
    //   // If there aren't any files to be uploaded throw error
    //   if (!this.uploadedFiles.length > 0) {
    //     this.$store.dispatch('addNotification', {
    //       message: 'There are no files to upload',
    //       colour: 'error',
    //     });
    //   } else {
    //     // Send uploaded files to parent component
    //     this.$emit('filesUploaded', this.uploadedFiles);
    //   }
    // },

    // handleAttachments(files, attachmentsMaxSize, acceptedFiles) {
    //   let dropWarning = '';

    //   const attachmentsSize = files.length === 0 ? 0 : files.map(f => f.size).reduce((a, b) => a + b);
    //   let attachmentsSizeAvailable = attachmentsMaxSize - attachmentsSize;

    //   // accept smaller files first...
    //   const acceptedFilesSortedBySize = acceptedFiles.sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
    //   acceptedFilesSortedBySize.forEach((value) => {
    //     if (-1 === files.findIndex((f) => {
    //       return f.name === value.name && f.lastModified === value.lastModified && f.size === value.size;
    //     })) {
    //       if (attachmentsSizeAvailable - value.size > 0) {
    //         attachmentsSizeAvailable = attachmentsSizeAvailable - value.size;
    //         files.push(value);
    //       } else {
    //         dropWarning = `Attachments are limited to ${bytes.format(attachmentsMaxSize)} bytes in total size.`;
    //       }
    //     }
    //   });
    //   return dropWarning;
    // }
  },
};
</script>

<style scoped>
.drop-zone {
  border: 3px dashed #606060;
  border-radius: 0.5rem;
}
</style>
