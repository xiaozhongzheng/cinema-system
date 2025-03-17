export const getters = {
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
}
