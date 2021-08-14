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
        <v-spacer />
        <v-icon color="primary" class="float-right ma-3" @click="closeDialog">close</v-icon>
        <v-card-title class primary-title> Mail Merge Preview </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <label>Sender</label>
                <v-text-field
                  v-model="mergePreview[mergePreviewIndex].from"
                  hide-details="auto"
                  readonly
                  outlined
                  dense
                />
              </v-col>

              <v-col cols="12" md="6">
                <label>Recipients</label>
                <v-text-field
                  :value="formatAsList(mergePreview[mergePreviewIndex].to)"
                  hide-details="auto"
                  readonly
                  outlined
                  dense
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <label>CC</label>
                <v-text-field
                  :value="formatAsList(mergePreview[mergePreviewIndex].cc)"
                  hide-details="auto"
                  readonly
                  outlined
                  dense
                />
              </v-col>

              <v-col cols="12" md="6">
                <label>BCC</label>
                <v-text-field
                  :value="formatAsList(mergePreview[mergePreviewIndex].bcc)"
                  hide-details="auto"
                  readonly
                  outlined
                  dense
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <label>Subject</label>
                <v-text-field
                  v-model="mergePreview[mergePreviewIndex].subject"
                  hide-details="auto"
                  outlined
                  readonly
                  dense
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <label>Body</label>
                <v-textarea
                  v-if="mergePreview[mergePreviewIndex].bodyType === 'text'"
                  v-model="mergePreview[mergePreviewIndex].body"
                  hide-details="auto"
                  readonly
                  outlined
                  dense
                  auto-grow
                />
                <div
                  v-else
                  class="bodyPreviewDiv"
                  v-html="mergePreview[mergePreviewIndex].body"
                ></div>
              </v-col>
            </v-row>

            <v-row
              v-if="mergePreview[mergePreviewIndex].attachments.lenghth > 0"
            >
              <v-col cols="12" md="12">
                <label>Attachments</label>
                <ul>
                  <li
                    v-for="item in mergePreview[mergePreviewIndex].attachments"
                    :key="item.filename"
                  >
                    {{ item.filename }}
                  </li>
                </ul>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </div>
      <v-card-actions class="pb-10 justify-center">
        <v-btn color="primary" @click="previewPrevious()" :disabled="previousDisabled">
          <span>Previous</span>
        </v-btn>
        <v-btn color="primary" @click="previewNext()" :disabled="nextDisabled">
          <span>Next</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapFields } from 'vuex-map-fields';

export default {
  name: 'MergePreviewDialog',

  props: {
    show: {
      default: false,
      type: Boolean,
    },
  },

  data: () => ({
    mergePreviewIndex: 0,
  }),

  computed: {
    ...mapFields('ches', ['mergePreview']),

    nextDisabled() {
      return this.mergePreviewIndex === this.mergePreview.length - 1;
    },

    previousDisabled() {
      return this.mergePreviewIndex === 0;
    },

  },

  methods: {
    closeDialog() {
      this.$emit('close-dialog');
    },

    formatAsList(arr) {
      return arr.join(', ');
    },

    previewPrevious() {
      this.mergePreviewIndex--;
    },

    previewNext() {
      this.mergePreviewIndex++;
    },
  },

};
</script>

<style scoped>
.bodyPreviewDiv {
  border: 1px solid #696969;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  overflow: auto;
}
</style>
