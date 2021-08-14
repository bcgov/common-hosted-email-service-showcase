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
      <template #[`item.tag`]="{ item }">
        <span>{{ item.tag ? item.tag : '-'}}</span>
      </template>

      <template #[`item.delayTS`]="{ item }">
        <span>{{ humanDateTime(item.delayTS) }}</span>
      </template>

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
import { format } from 'date-fns';
import { mapActions, mapGetters } from 'vuex';

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
      { text: 'Delayed', align: 'start', value: 'delayTS', width: 150 },
      // TODO: implement promote and cancel actions
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
    ...mapActions('ches', ['addTableData', 'populateTable']),

    cancelMessage(msgId) {
      console.log('cancelMessage', msgId); // eslint-disable-line no-console
    },

    isTerminalState(status) {
      return ['completed', 'cancelled'].includes(status);
    },

    promoteMessage(msgId) {
      console.log('promoteMessage', msgId); // eslint-disable-line no-console
    },

    humanDateTime(timestamp){
      // date-fns docs: https://date-fns.org/v2.21.1/docs/Getting-Started
      return timestamp ? format(new Date(timestamp), 'yyyy-MM-dd HH:mm') : '-';
    }
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


