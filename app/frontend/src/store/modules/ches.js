import { getField, updateField } from 'vuex-map-fields';

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
    mergeForm : {
      attachments: [],
      body: '',
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

    // merge form
    // ADD_CONTEXTS(state, data) {
    //   console.log('store', state, data);
    //   state.mergeForm = data;
    // },
    // UPDATE_CONTEXTS_TYPE(state, data) {
    //   state.mergeForm.contextsType = data;
    // }

  },

  actions: {
    addTransaction({ commit }, txId) {
      commit('ADD_TXID', txId);
    },

    addTableData({ commit }, data) {
      commit('ADD_TABLEDATA', data);
    },

    clearHistory({ commit }) {
      commit('CLEAR_TXID');
    },

    // merge form
    // updateMergeForm({ commit }, data){
    //   commit('UPDATE_MERGE_FORM', data);
    // }
    // addContexts({ commit }, data){
    //   commit('ADD_CONTEXTS', data);
    // },
    // updateContextsType({ commit }, data){
    //   commit('UPDATE_CONTEXTS_TYPE', data);
    // }
  }
};
