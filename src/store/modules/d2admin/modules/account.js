import { Message,MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
import api from '@/api'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload username {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    login({ dispatch },{
      username = '',
      password = '',
      verifycode = '',
      verifycodekey = ''
    } = {}) {
      return new Promise(async (resolve,reject) => {

        const res = await api.SYS_USER_LOGIN({
          loginname: username,
          password,
          verifycode,
          verifycodekey
        })
        if (res.code == 0) {
          let userData = res.data;
          let dataStandardDic = res.dataStandardDic;
          let names = { name: userData.name }
          let accessToken = res.accessToken;
          let refreshToken = res.refreshToken;
          // 设置 cookie 一定要存 uuid 和 token 两个 cookie
          // 整个系统依赖这两个数据进行校验和存储
          // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
          // token 代表用户当前登录状态 建议在网络请求中携带 token
          // 如有必要 token 需要定时更新，默认保存一天
          util.cookies.set("uuid",userData.userid);
          util.cookies.set('auth',userData.userid);
          // util.cookies.set('token', userData.USERID)
        let resPortal = await api.SYS_Portal_Info_Get({
            userid:userData.userid,
            orgid:userData.orgid
          })
          let orgname = '';
          if(resPortal.code == 0){
            if(resPortal.data.length){
              orgname = resPortal.data[0].orgname;
            }
          }
          userData.orgname = orgname;
          // 设置 vuex 用户信息
          await dispatch('d2admin/user/set',{ ...userData,...names,dataStandardDic,accessToken,refreshToken },{ root: true })
          // 用户登录后从持久化数据加载一系列的设置
          await dispatch('load')
          resolve({ ...userData,...names,dataStandardDic })
        } else {
          reject(res)
        }
      })

    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout({ commit,dispatch },{ confirm = false } = {}) {
      /**
       * @description 注销
       */
      async function logout() {
        // 删除cookie
        util.cookies.remove('token')
        util.cookies.remove('uuid')
        util.cookies.remove('auth')
        // 清空 vuex 用户信息
        await dispatch('d2admin/user/set',{},{ root: true })
        await dispatch('d2admin/page/closeAll',null,{ root: true })
        // 跳转路由
        // 跳转路由
        router.push({ name: 'login' })
      }
      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set',true,{ root: true })
        MessageBox.confirm('确定要注销当前用户吗','注销用户',{ type: 'warning' })
          .then(() => {
            commit('d2admin/gray/set',false,{ root: true })
            logout()
          })
          .catch(() => {
            commit('d2admin/gray/set',false,{ root: true })
            Message({ message: '取消注销操作' })
          })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    async load({ dispatch }) {
      // 加载用户名
      await dispatch('d2admin/user/load',null,{ root: true })
      // 加载主题
      await dispatch('d2admin/theme/load',null,{ root: true })
      // 加载页面过渡效果设置
      await dispatch('d2admin/transition/load',null,{ root: true })
      // 持久化数据加载上次退出时的多页列表
      await dispatch('d2admin/page/openedLoad',null,{ root: true })
      // 持久化数据加载侧边栏配置
      await dispatch('d2admin/menu/asideLoad',null,{ root: true })
      // 持久化数据加载全局尺寸
      await dispatch('d2admin/size/load',null,{ root: true })
      // 持久化数据加载颜色设置
      await dispatch('d2admin/color/load',null,{ root: true })

      // DB -> store 加载科研状态
      await dispatch('d2admin/ecrf/load',null,{ root: true })
      // DB -> store 加载新闻ID
      await dispatch('d2admin/news/load',null,{ root: true })
    }
  }
}
