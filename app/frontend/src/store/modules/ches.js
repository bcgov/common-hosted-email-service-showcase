/**
 * ches module
 */
export default {
  namespaced: true,

  state: {
    emailAlert: false,
    // transactions in users current session
    txs: [],
    // history table data
    tableData: []
  },

  getters: {
    emailAlert: state => state.emailAlert,
    txs: state => state.txs,
    tableData: state => state.tableData
  },

  mutations: {
    ADD_TX(state, tx) {
      state.txs.push(tx);
    },

    showAlert(state, emailAlert){
      if(emailAlert){
        state.emailAlert = {
          type: emailAlert.type,
          text: emailAlert.text
        };
      } else{
        state.emailAlert = false;
      }
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
