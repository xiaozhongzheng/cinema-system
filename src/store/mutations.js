
export const mutations = {
  setToken(state, token) {
    state.token = token
  },
  setRoleId(state, roleId) {
    state.roleId = +roleId
  },
  setUserId(state, userId) {
    state.userId = userId
  },
  setUserInfo(state, userInfo) {
      state.userInfo = userInfo
  },
  clearData(state) {
    // 清空数据
    state.token = null
    state.roleId = null
    state.userId = null
    state.userInfo = {}
    // sessionStorage.clear()
  }
}
