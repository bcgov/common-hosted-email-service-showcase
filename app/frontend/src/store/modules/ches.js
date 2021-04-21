/**
 * ches module
 */
export default {
  namespaced: true,

  state: {
    alert: false,
    // transactions in users current session
    txs: [],
    // history table data
    tableData: []
  },

  getters: {
    alert: state => state.alert,
    txs: state => state.txs,
    tableData: state => state.tableData
  },

  mutations: {
    ADD_TX(state, tx) {
      state.txs.push(tx);
    },

    showAlert(state, alert){
      if(alert){
        state.alert = alert;
      } else{
        state.alert = false;
      }
    }

  },

  actions: {

    // update state.txs with transaction from current user session
    async addTx({ commit }, tx) {
      try {
        commit('ADD_TX', tx);
      } catch {
        console.log('addTx error'); // eslint-disable-line no-console
      }
    }

  }
};
