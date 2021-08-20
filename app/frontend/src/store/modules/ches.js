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

    ADD_TABLEDATA(state, data) {
      state.tableData.push(data);
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

    addTableData({ commit }, data) {
      commit('ADD_TABLEDATA', data);
    },
    // commit,
    populateTable({ commit, state }) {
      try {
        // for each existing tx in txIds array
        state.txIds.forEach(async (tx) => {
          // if tableData doesnt contain an object with txId = tx.txId
          if (!state.tableData.find((o) => o.txId === tx.txId)) {
            // for each of the messages in tx
            tx.messages.forEach(async (message) => {
              // get details from CHES and add to tableData
              const { data } = await chesService.getStatusByMessageId(
                message.msgId
              );
              commit('ADD_TABLEDATA', ...data);
            });
          }
        });

      } catch (e) {
        // this.error = true;
        // this.showAlert({
        //   type: 'error',
        //   text: e,
        // });
      }
    },

    clearHistory({ commit }) {
      commit('CLEAR_TXID');
    },
  }
};
