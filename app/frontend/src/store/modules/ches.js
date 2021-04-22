/**
 * ches module
 */
export default {
  namespaced: true,

  state: {
    // List of known transaction ids
    txIds: [],
    // History table data
    tableData: []
  },

  getters: {
    txIds: state => state.txIds,
    tableData: state => state.tableData
  },

  mutations: {
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
    }
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
    }
  }
};
