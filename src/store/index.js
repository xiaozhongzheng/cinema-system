import Vue from 'vue'
import Vuex from 'vuex'
import { login, getUserInfo, logout } from '@/api/common'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    roleId: localStorage.getItem('roleId'),
    userId: localStorage.getItem('userId'),
    userInfo: {}
  },
  getters: {
    token(state) {
      return state.token
    },
    roleId(state) {
      return state.roleId
    },
    userId(state) {
      return state.userId // ?.是使用可选链运算符，作用是当userInfo为空时也不会报错
    },
    username(state) {
      return state.userInfo?.username
    },
    userInfo(state) {
      return state.userInfo
    },
  },
  mutations: {
    setToken(state, token) {
      localStorage.setItem('token', token)
      state.token = token
    },
    setRoleId(state, roleId) {
      localStorage.setItem('roleId', roleId)
      state.roleId = roleId
    },
    setUserId(state, userId) {
      localStorage.setItem('userId', userId)
      state.userId = userId
    },
    setUserInfo(state, userInfo) {
        state.userInfo = userInfo
    },
    clearData(state) {
      // 清空数据
      localStorage.clear();
      state.token = null
      state.roleId = null
      state.userId = null
      state.userInfo = {}
    }
  },
  actions: {
    async login(context, data) {
      const {id, roleId, token } = await login(data)
      context.commit('setToken', token)
      context.commit('setUserId', id)
      context.commit('setRoleId', roleId)
    },
    async getUserInfoByRoleId(context, roleId) {
      const userInfo = await getUserInfo(roleId);
      context.commit('setUserInfo', userInfo)
    },
    async logout(context, data) {
      await logout(data)
      context.commit('clearData')
    },
  },
  modules: {

  }
})
