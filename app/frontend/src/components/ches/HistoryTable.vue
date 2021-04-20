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
import { mapGetters } from 'vuex';
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
    ...mapGetters('ches', ['txs', 'tableData']),
  },

  methods: {

    // get status details for each message in tansactions in store
    async populateTable() {
      this.error = false;
      this.loading = true;

      try {

        // for each email transaction in store, get full status of messages
        for (let tx of this.txs) {
          // if transaction isnt already in 'this.tableData' (vuex tableData property)
          if((this.tableData.find(o => o.txId === tx.txId)) === undefined){
            // get status details from CJES and add to tableData
            const response = await chesService.getStatusByTransactionId(tx.txId);
            this.tableData.push(...response);
          }
        }
      } catch (e) {
        this.error = true;
        this.tableData = e;
      }
      this.loading = false;
    },
  },

  mounted: function() {
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


