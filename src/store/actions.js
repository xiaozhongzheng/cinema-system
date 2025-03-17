import { login, getUserInfo, logout } from '@/api/common'

export const actions = {
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
}
