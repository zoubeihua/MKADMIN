export default {
    namespaced: true,
    state: {
        // 路由数据
        routers: [],
        isfechpermissioninfo: false //标记是否已经拉取权限信息
    },
    actions: {
        /**
       * @description 设置路由
       * @param {Object} state state
       * @param {Array} routers routers setting
       */
        routerSet({ state, dispatch }, routers) {
            return new Promise(async resolve => {
                // store 赋值
                state.routers = routers
                // 持久化
                await dispatch('d2admin/db/set', {
                    dbName: 'sys',
                    path: 'router.routers',
                    value: state.routers,
                    user: true
                }, { root: true })
                // end
                resolve()
            })
        },
        /**
        * @description 从数据库取用户数据
        * @param {Object} context
        */
        load({ state, dispatch }) {
            return new Promise(async resolve => {
                // store 赋值
                state.routers = await dispatch('d2admin/db/get', {
                    dbName: 'sys',
                    path: 'router.routers',
                    defaultValue: {},
                    user: true
                }, { root: true })
                // end
                resolve()
            })
        },
        /**
       * @description 按钮权限
       * @param {Object} state state
       * @param {Array} buttonAccess array
       */
        accessSet({ state, dispatch }, buttonAccess) {
            return new Promise(async resolve => {
                // store 赋值
                state.buttonAccess = buttonAccess
                // 持久化
                await dispatch('d2admin/db/set', {
                    dbName: 'sys',
                    path: 'router.access',
                    value: state.buttonAccess,
                    user: true
                }, { root: true })
                // end
                resolve()
            })
        }
    },

    mutations: {
        /**
         * @description 设置用户拉取路由标识
         * @param {Object} state state
         * @param {Boolean} flag true已经获取路由 false 未获取路由 setting
         */
        isfechpermissionSet(state, flag) {
            state.isfechpermissioninfo = flag
            console.log('isfechpermissioninfo：' + state.isfechpermissioninfo)
        }
    }
}
