/**
 * alert module
 */
export default {
  namespaced: true,

  state: {
    alert: false,
  },

  getters: {
    alert: state => state.alert,
  },

  mutations: {
    SET_ALERT(state, alert) {
      state.alert = alert ? alert : false;
    }
  },

  actions: {
    clearAlert({ commit }) {
      commit('SET_ALERT', false);
    },

    showAlert({ commit }, alert) {
      commit('SET_ALERT', alert);
    }
  }
};
