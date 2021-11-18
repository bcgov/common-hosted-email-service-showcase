<template>
  <v-container class="pa-0 my-10">
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
      outlined
      dense
      class="tbl-search mb-5"
    />
    <v-data-table
      class="tbl"
      :headers="headers"
      :items="tableData"
      :search="search"
      :loading="tableLoading"
      sort-by="createdTS"
      sort-desc
    >
      <template #[`item.tag`]="{ item }">
        <span>{{ item.tag ? item.tag : '-'}}</span>
      </template>

      <template #[`item.delayTS`]="{ item }">
        <span>{{ humanDateTime(item.delayTS) }}</span>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              @click="promoteMessage(item.msgId)"
              color="primary"
              :disabled="isTerminalState(item.status)"
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>send</v-icon>
            </v-btn>
          </template>
          <span>Promote (Send Now)</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              @click="cancelMessage(item.msgId)"
              color="error"
              :disabled="isTerminalState(item.status)"
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>cancel</v-icon>
            </v-btn>
          </template>
          <span>Cancel Scheduled Send</span>
        </v-tooltip>
      </template>

      <template v-slot:[`footer.prepend`]>
        <v-btn color="primary" small class="ma-2" @click="populateTable">
          <v-icon small class="mr-1">refresh</v-icon><span>Refresh</span>
        </v-btn>
        <v-btn v-if="tableData.length" color="primary" small class="ma-2" @click="clearTable">
          <v-icon small class="mr-1">clear</v-icon><span>Clear</span>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { format } from 'date-fns';
import { mapActions, mapGetters } from 'vuex';
import { mapFields } from 'vuex-map-fields';

import chesService from '@/services/chesService';
import { TerminalStates } from '@/utils/constants';

export default {
  name: 'HistoryTable',
  data: () => ({
    error: false,
    search: '',
    headers: [
      { text: 'Transaction ID', align: 'start', value: 'txId' },
      { text: 'Message ID', align: 'start', value: 'msgId' },
      { text: 'Tag', align: 'start', value: 'tag' },
      { text: 'Status', align: 'start', value: 'status' },
      { text: 'Delayed', align: 'start', value: 'delayTS', width: 150 },
      { text: 'Actions', align: 'start', value: 'actions', width: 120, filterable: false, sortable: false }
    ],
  }),

  computed: {
    ...mapGetters('ches', ['txIds']),
    ...mapFields('ches', ['tableData', 'tableLoading'])
  },

  methods: {
    ...mapActions('alert', ['clearAlert', 'showAlert']),
    ...mapActions('ches', ['clearTable', 'populateTable']),


    async cancelMessage(msgId) {
      try {
        // wait for OK status from CHES api
        await chesService.cancel(msgId);
        // update store with latest table data
        this.populateTable();
        // show success alert
        this.showAlert({
          type: 'success',
          text: `<strong>Your message has been successfully cancelled.<br />Message ID: </strong> ${msgId}`,
        });
      } catch (e) {
        this.error = true;
        // show error alert
        this.showAlert({
          type: 'error',
          text: e,
        });
      }
      window.scrollTo(0, 0);
    },

    isTerminalState(status) {
      return TerminalStates.includes(status);
    },

    async promoteMessage(msgId) {
      try {
        // wait for OK status from CHES api (does not mean message has been promoted yet)
        await chesService.promote(msgId);
        this.populateTable();
        // show success alert
        this.showAlert({
          type: 'success',
          text: `<strong>Your message has been successfully promoted.<br />Message ID: </strong> ${msgId}`,
        });
      } catch (e) {
        this.error = true;
        // show error alert
        this.showAlert({
          type: 'error',
          text: e,
        });
      }
      window.scrollTo(0, 0);
    },

    humanDateTime(timestamp) {
      // date-fns docs: https://date-fns.org/v2.21.1/docs/Getting-Started
      return timestamp ? format(new Date(timestamp), 'yyyy-MM-dd HH:mm') : '-';
    },
  },

  mounted() {
    this.clearAlert();
    // get each message's status details in ches vuex module
    this.populateTable();
  },
};
</script>

<style scoped>
.tbl-search {
  width: 100%;
  max-width: 30em;
  float: right;
}
.tbl {
  clear: both;
}
</style>
