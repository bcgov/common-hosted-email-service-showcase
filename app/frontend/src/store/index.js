import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import alert from '@/store/modules/alert';
import ches from '@/store/modules/ches';

Vue.use(Vuex);

const plugins = [
  createPersistedState({
    paths: ['ches'],
    storage: localStorage
  })
];

if (process.env.NODE_ENV !== 'production') {
  plugins.push(Vuex.createLogger());
}

export default new Vuex.Store({
  modules: { alert, ches },
  plugins: plugins,
  state: {},
  mutations: {},
  actions: {}
});
