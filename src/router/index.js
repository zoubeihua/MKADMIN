import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
import util from '@/libs/util.js'
import layoutHeaderAside from '@/layout/header-aside'
// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)
import api from '@/api'
// 路由数据
import routes from './routes'
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return VueRouterPush.call(this,location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return VueRouterReplace.call(this,location).catch(err => err)
}
let permissionMenu,permissionRouter,buttonAccss = []
Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes
})
//标记是否已经拉取权限信息
let isFetchPermissionInfo = false
let fetchPermissionInfo = async () => {
  // console.log("获取菜单：" + store.state.d2admin.routers.isfechpermissioninfo)
  function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
    const accessedRouters = asyncRouterMap.filter(route => {
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
					    console.log('路由组件不存在');
					    console.log(e.message);
					  }
				   
				  }
				}
				if (route.children && route.children.length) {
				  route.children = filterAsyncRouter(route.children)
				}
				return true
			}
     
    })
		console.log("asyncRouterMap_filter")
		console.log(accessedRouters)
    return accessedRouters
  }
  try {
    let userInfo = await store.dispatch('d2admin/db/get',{
      dbName: 'sys',
      path: 'user.info',
      defaultValue: {},
      user: true
    },{ root: true })
	function getperms(data){
		let list = [];
		data.forEach(item => {
			if(item.buttonpermissions.length){
				item.buttonpermissions.forEach(key => {
					list.push(key.perms);
				})
			}
		})
		return list;
	};
    let userPermissionInfo = await api.MENU_ALL({ userid: userInfo.userid,tag: 0 });//获取路由和菜单数据
		let result = await api.MENU_ALL({userid: userInfo.userid,tag:0,hospitalid:userInfo.hospitalid,appid:userInfo.accessid});
		if(result.code == 0){
			let menuDataList = result.dataMenu;
			permissionMenu = result.dataMenu;
		 await store.dispatch('d2admin/user/set', { ...userInfo, menuDataList}, { root: true })
		 store.commit('d2admin/permission/permissionsSet', getperms(result.dataButton), { root: true })
		}
    buttonAccss = userPermissionInfo.dataButtonAccess
    // permissionRouter = filterAsyncRouter([...userPermissionInfo.dataRoute, ...testProject])
    permissionRouter = filterAsyncRouter([...userPermissionInfo.dataRoute])

    //动态添加路由
	router.addRoutes(permissionRouter);
	// console.log("路由数据：", permissionRouter)
	await store.dispatch('d2admin/routers/routerSet',permissionRouter,{ root: true })
	await store.dispatch('d2admin/routers/accessSet',buttonAccss,{ root: true })
	// 处理路由 得到每一级的路由设置
	store.commit('d2admin/page/init',[...permissionRouter])
	// 设置侧栏菜单
	store.commit('d2admin/menu/asideSet',[...permissionMenu])
	// 设置顶栏菜单
	// store.commit('d2admin/menu/headerSet', [...permissionMenu])
	// 初始化菜单搜索功能
	store.commit('d2admin/search/init',permissionMenu)
	// 加载上次退出时的多页列表
	store.dispatch('d2admin/page/openedLoad',null,{ root: true })
  
  } catch (err) {
    console.log(err)
  }
  await Promise.resolve()
}
/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to,from,next) => {
  await store.dispatch('d2admin/menu/setMenuData',to.meta,{ root: true })
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set',false)
  const token = util.cookies.get('token') //首页验证权限
  const auth = util.cookies.get('auth')// 应用选择权限
  if (to.matched.some(r => r.meta.auth)) {

    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
    if (token && token !== 'undefined') {
      //拉取权限信息
      if (!isFetchPermissionInfo) {
        await fetchPermissionInfo();
        isFetchPermissionInfo = true;
        next(to.path,true)
      } else {
        next()
      }
    } else {
      // 将当前预计打开的页面完整地址临时存储 登录后继续跳转
      // 这个 cookie(redirect) 会在登录后自动删除
      util.cookies.set('redirect',to.fullPath)
      // 没有登录的时候跳转到登录界面
      next({
        name: 'login'
      })
      NProgress.done()
    }
  } else {
    if (token && token !== 'undefined') {
      // 将当前预计打开的页面完整地址临时存储 登录后继续跳转
      // 这个 cookie(redirect) 会在登录后自动删除
      util.cookies.set('redirect',to.fullPath)
      //拉取权限信息
      if (!isFetchPermissionInfo) {
        await fetchPermissionInfo();
        isFetchPermissionInfo = true;
        next(to.path,true)
      } else {
        if(from.name == 'index'){
          if (token && token !== 'undefined') {
            next(from.path,true);
            NProgress.done()
          }else{
            next()
          }
        }else{
          next()
        }
      }
    }else{
      if(from.name == 'application'){
        if (auth && auth !== 'undefined') {
          next(from.path,true);
          NProgress.done()
        } else {
          next()
        }
      }else{
        next()
      }
    }
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('d2admin/page/open',to)
  // 更改标题
  util.title(to.meta.title)
})

export default router