// import Vue from 'vue';
import { getField, updateField } from 'vuex-map-fields';
import chesService from '@/services/chesService';

/**
 * ches module
 */
export default {
  namespaced: true,

  state: {
    // List of known transaction ids
    txIds: [],
    // History table data
    tableData: [],
    tableLoading: true,

    // merge form
    mergeForm: {
      attachments: [],
      bodyHtml: '',
      bodyText: '',
      bodyType: 'html',
      priority: 'normal',
      recipients: [],
      subject: '',
      contextsType: 'xlsx',
      excelParsed: false,
      excel: {
        cols: [],
        data: [],
        headers: []
      },
      contexts: '',
      contextVariables: [],
    },

    mergePreview: [],
    // eof merge form

  },

  getters: {
    getField, // vuex-map-fields
    txIds: state => state.txIds,
    tableData: state => state.tableData,
    // merge form
    mergeForm: state => state.mergeForm,
  },

  mutations: {
    updateField, // vuex-map-fields

    ADD_TXID(state, txId) {
      state.txIds.push(txId);
    },

    UPDATE_TABLEDATA(state, data) {
      // if message already in table..
      const index = state.tableData.findIndex((message) => message.msgId === data.msgId);
      if(index > -1 ) {
        // remove existing message from table
        state.tableData.splice(index, 1);
      }
      // add message to table
      state.tableData.push(data);
    },

    UPDATE_TABLELOADING(state, loading) {
      state.tableLoading = loading;
    },

    CLEAR_TXID(state) {
      state.txIds = [];
    },

    CLEAR_TABLEDATA(state) {
      state.tableData = [];
    },
  },

  actions: {
    addTransaction({ commit }, txId) {
      commit('ADD_TXID', txId);
    },

    // populates history table each time the component is mounted
    async populateTable({ commit, state, dispatch }) {

      commit('UPDATE_TABLELOADING', true);

      // for each of the transactions that exists in local storage
      state.txIds.forEach( (tx) => {
        // for each of the messages in tx
        tx.messages.forEach(async (message) => {
          // if existing tableData doesnt contain this transaction, and the message in this row of table has a status that is not 'completed' or 'cancelled'
          if (!state.tableData.find((o) => (o.txId === tx.txId && (o.status === 'completed' || o.status === 'cancelled')))) {

            try {
              // get details for that message (status, smpt response, etc) from CHES and update tableData
              // note: this call tyo CHES api returns an array containing a single object
              const { data } = await chesService.getStatusByMessageId(
                message.msgId
              );

              // update message/transaction data in table
              commit('UPDATE_TABLEDATA', data[0]);
            }
            // if problem getting data from CHES api show error alert
            catch (e) {
              dispatch('alert/showAlert', {
                type: 'error',
                text: e,
              }, { root: true });
            }
          }
        });
      });

      commit('UPDATE_TABLELOADING', false);
    },

    clearTable({ commit }) {
      commit('CLEAR_TXID');
      commit('CLEAR_TABLEDATA');
    },
  }
};
