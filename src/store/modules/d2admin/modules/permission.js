import { uniqueId, keys } from 'lodash'
// import utils from '@/utils'
import utils from "@/libs/util.js";
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)
import router, { createRoutesInLayout, routesOutLayout, resetRouter } from '@/router'
import layoutHeaderAside from '@/layout/header-aside'
import api from '@/api'
  /**
   * 给菜单数据补充上 path 字段
   * https://github.com/d2-projects/d2-admin/issues/209
   * @param {Array} menu 原始的菜单数据
   */
  function supplementPath (menu) {
    return menu.map(e => ({
      ...e,
      path: e.path || uniqueId('d2-menu-empty-'),
      ...e.children ? {
        children: e.children.length &&  e.children.length > 0 ? supplementPath(e.children) : undefined
      } : {}
    }))
  }
  /**
   * @description 检查一个菜单是否有子菜单
   * @param {Object} item 接口返回菜单中的一项原始数据
   */
  function hasRouteChildren (item = {}, keyname = 'children') {
    return utils.helper.hasChildren(item, keyname)
    //  && item[keyname].reduce((count, menu) => menu.haschildren == 1 ? ++count : count, 0) > 0
  }
  /**
   * @description 从接口返回的数据中计算出菜单
   * @param {Array} menuSource 接口返回的原始菜单数据
   */
  function getMenus (menuSource) {
  	const menus = menuSource.filter(item => {
      if (item.target != 'button') {
        if (item.children && item.children.length) {
          item.children = getMenus(item.children)
        }
        return true
      }
    })
    return menus
  }
  /**
   * @description 从接口返回的数据中计算出路由
   * @param {Array} menuSource 接口返回的原始菜单数据
   */
  function getRoutes (menuSource) {
    const accessedRouters =  menuSource.filter(route => {
      route.meta.auth = route.meta.auth == 'true' ? true : false;
      route.meta.cache = route.meta.cache == 'true' ? true : false;
      if(route.target != 'button'){
        if (route.component) {
				  if (route.component === 'layoutHeaderAside') { //Layout组件特殊处理
				    route.component = layoutHeaderAside
				  } else {
					  try {
					    route.component = _import(route.component)
					  } catch (e) {
					    //TODO handle the exception
					    route.component = _import('system/error/404')
              utils.log.capsule('菜单', '文件不存在', 'danger')
              utils.log.danger(e.message)
					  }
				  }
				}
        if (route.children && route.children.length) {
				  route.children = getRoutes(route.children)
				}
        return true
        
      // try {
      //   return {
      //     ...route,
      //     component: route.component === 'layoutHeaderAside' ? layoutHeaderAside :  _import(route.component),
      //     ...meta ? {
      //       auth:route.meta.auth == 'true' ? true : false,
      //       cache:route.meta.cache == 'true' ? true : false
      //     }:{},
      //     ...e.children ? {
      //       children: e.children.length &&  e.children.length > 0 ? getRoutes(e.children) : []
      //     } : {}
      //    }
      // } catch (error) {
      //   utils.log.capsule('菜单', '文件不存在', 'danger')
      //   utils.log.danger(e.message)
      //   return {
      //     ...route,
      //     component: route.component === 'layoutHeaderAside' ? layoutHeaderAside :  _import('system/error/404'),
      //     ...meta ? {
      //       auth:route.meta.auth == 'true' ? true : false,
      //       cache:route.meta.cache == 'true' ? true : false
      //     }:{},
      //     ...e.children ? {
      //       children: e.children.length &&  e.children.length > 0 ? getRoutes(e.children) : []
      //     } : {}
      //    }
       
      // }
      }
    })
    // console.log("asyncRouterMap_filter")
		// console.log(accessedRouters)
    return accessedRouters
  }
  /**
   * @description 从接口返回的数据中计算出权限列表
   * @param {Array} menuSource 接口返回的原始菜单数据
   */
  function getPermissions (menuSource) {
    let list = [];
    if(menuSource.length){
      menuSource.forEach(item => {
        if(item.buttonpermissions.length){
          item.buttonpermissions.forEach(key => {
            list.push(key.perms);
          })
        }
      })
    }
		return list;
  }
  export default  {
    namespaced: true,
    state: {
      // 是否已经加载
      isLoaded: false,
      // 用户权限
      permissions: []
    },
    actions: {
      /**
       * @description 加载用户菜单
       * @param {Object} vuex context
       * @param {Object} payload focus {Boolean} 强制重新加载动态路由 此项有值的时候加载状态校验跳过
       * @param {Object} payload to {String} 动态路由加载完成后跳转的页面
       * @param {Object} payload data {Array} 手动设置数据源 用来人工模拟权限数据或者重置权限设置 此项有值的时候登陆状态校验跳过
       */
      async load ({ state, rootState, commit, dispatch }, { focus = false, to = '', data }) {
        // 取消请求 - 没有登录
        if (!data && !rootState.d2admin.user.info.userid) return
        // 取消请求 - 已经加载过动态路由
        if (!focus && state.isLoaded) return
        // 获取接口原始数据
        const source = data || await api.MENU_ALL({userid: rootState.d2admin.user.info.userid,tag: 0})
        // [ 权限 ] 计算权限列表
        state.permissions = getPermissions(source.dataButton)
        // [ 菜单 ] 计算菜单
        const menus = supplementPath(getMenus(source.dataMenu))
        // [ 菜单 ] 设置顶栏菜单
        // commit('d2admin/menu/headerSet', menus, { root: true })
        // [ 菜单 ] 设置侧边栏菜单
        commit('d2admin/menu/asideSet', menus, { root: true })
        // [ 路由 ] 计算路由
        const routes = createRoutesInLayout(getRoutes(source.dataRoute)).concat(routesOutLayout)
        // [ 路由 ] 重新设置路由
        resetRouter(routes)
        // [ 路由 ] 重新设置多标签页池
        commit('d2admin/page/init', routes, { root: true })
        // [ 标签页 ] 重新计算多标签页数据
        dispatch('d2admin/page/openedLoad', { filter: true }, { root: true })
        // [ 搜索 ] 初始化搜索数据
        commit('d2admin/search/init', menus, { root: true })
        // [ 路由 ] 重新访问
        if (to) router.replace(to)
        // 标记已经加载过动态路由
        commit('isLoadedSet', true)
      },
      /**
       * @description 验证是是否包含权限
       * @param {Object} state state
       * @param {Object} payload {Array|String} need 需要的数据
       * @param {Object} payload {Boolean} all 是否需要全部包含
       */
      has ({ state }, { need = '', all = false } = {}) {
        return utils.helper[all ? 'allIn' : 'oneOf'](state.permissions, need)
      }
    },
    mutations: {
      /**
       * @description 设置动态路由加载状态
       * @param {Object} state state
       * @param {Boolean} value 是否已经加载动态路由
       */
      isLoadedSet (state, value) {
        state.isLoaded = value
      }
    }
  }