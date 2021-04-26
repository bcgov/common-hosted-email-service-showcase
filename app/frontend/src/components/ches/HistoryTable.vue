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
    >
      <!-- <template #[`item.actions`]="{ item }">
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
      </template> -->
    </v-data-table>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import chesService from '@/services/chesService';

export default {
  name: 'HistoryTable',
  data: () => ({
    error: false,
    loading: false,
    search: '',
    headers: [
      { text: 'Transaction ID', align: 'start', value: 'txId' },
      { text: 'Message ID', align: 'start', value: 'msgId' },
      { text: 'Tag', align: 'start', value: 'tag' },
      { text: 'Status', align: 'start', value: 'status' },
      { text: 'Delayed', align: 'start', value: 'delayTS' },
      // {
      //   text: 'Actions',
      //   align: 'end',
      //   value: 'actions',
      //   filterable: false,
      //   sortable: false,
      // },
    ],
  }),

  computed: {
    ...mapGetters('ches', ['txIds', 'tableData']),
  },

  methods: {
    ...mapActions('alert', ['showAlert', 'clearAlert']),
    ...mapActions('ches', ['addTableData']),

    cancelMessage(msgId) {
      console.log('cancelMessage', msgId); // eslint-disable-line no-console
    },

    isTerminalState(status) {
      return ['completed', 'cancelled'].includes(status);
    },

    // get status details for each message in tansactions in store
    populateTable() {
      this.error = false;
      this.loading = true;

      try {
        // TODO: Move this logic into vuex - do this BEFORE adding in remove/promote logic
        // for each email transaction in store, get full status of messages
        this.txIds.forEach(async (tx) => {
          // if transaction isnt already in 'this.tableData' (vuex tableData property)
          if (!this.tableData.find((o) => o.txId === tx.txId)) {
            // get status details from CHES and add to tableData
            const { data } = await chesService.getStatusByTransactionId(
              tx.txId
            );
            this.addTableData(...data);
          }
        });
      } catch (e) {
        this.error = true;
        this.showAlert({
          type: 'error',
          text: e,
        });
      }
      this.loading = false;
    },

    promoteMessage(msgId) {
      console.log('promoteMessage', msgId); // eslint-disable-line no-console
    },
  },

  mounted() {
    this.clearAlert();
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


