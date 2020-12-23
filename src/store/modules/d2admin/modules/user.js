import util from '@/libs/util.js'
export default {
  namespaced: true,
  state: {
    // 用户登录状态
    isLogged: !!util.cookies.get('token'),
    // 用户信息
    info: {}
  },
  actions: {
    /**
     * @description 设置用户数据
     * @param {Object} context
     * @param {*} info info
     */
    async set ({ state, dispatch }, info) {
      // store 赋值
      state.info = info
      // 持久化
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'user.info',
        value: info,
        user: true
      }, { root: true })
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} context
     */
    async load ({ state, dispatch }) {
      // store 赋值
      state.info = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'user.info',
        defaultValue: {},
        user: true
      }, { root: true })
    }
  },
  mutations: {
    /**
     * @description 设置用户登陆状态
     * @param {Object} state state
     * @param {Boolean} value 是否登录
     */
    isLoggedSet (state, value) {
      state.isLogged = value
    }
  }
}
