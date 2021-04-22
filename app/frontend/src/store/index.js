import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import ches from '@/store/modules/ches.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { ches },
  plugins: [
    Vuex.createLogger(),
    createPersistedState({
      paths: ['ches'],
      storage: localStorage
    })
  ],
  state: {},
  mutations: {},
  actions: {}
});
