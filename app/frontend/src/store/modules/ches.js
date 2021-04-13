/**
 * ches module
 */
export default {
  namespaced: true,

  state: {
    // transactions in users current session
    txs: [],
    // history table data
    tableData: []
  },

  getters: {
    txs: state => state.txs,
    tableData: state => state.tableData
  },

  mutations: {
    ADD_TX(state, tx) {
      state.txs.push(tx);
    }
  },

  actions: {

    // update state.txs with transaction from current user session
    async addTx({ commit }, tx) {
      try {
        commit('ADD_TX', tx);
      } catch {
        console.log('addTx error');
      }
    }

  }
};
