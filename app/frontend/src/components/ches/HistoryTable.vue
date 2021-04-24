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
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="tableData"
      :search="search"
      class="tbl"
    ></v-data-table>
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
      { text: 'Transaction ID', value: 'txId' },
      { text: 'Message ID', value: 'msgId' },
      { text: 'Tag', value: 'tag' },
      { text: 'Status', value: 'status' },
      { text: 'Delayed until', value: 'delayTS' },
      { text: 'Cancel', value: 'cancel' },
    ],
  }),

  computed: {
    ...mapGetters('ches', ['txIds', 'tableData']),
  },

  methods: {
    ...mapActions('alert', ['showAlert', 'clearAlert']),
    ...mapActions('ches', ['addTableData']),

    // get status details for each message in tansactions in store
    populateTable() {
      this.error = false;
      this.loading = true;

      try {
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


