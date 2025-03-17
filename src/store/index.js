import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import {state} from './state'
import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules:{},
  plugins: [
    createPersistedState({
      // 将vuex的状态使用sessionStorage存储
      storage: window.localStorage
    })
  ]
})
