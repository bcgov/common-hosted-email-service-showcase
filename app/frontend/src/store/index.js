import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import alert from '@/store/modules/alert';
import ches from '@/store/modules/ches';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { alert, ches },
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
