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
// import routes from './routes'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return VueRouterPush.call(this,location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return VueRouterReplace.call(this,location).catch(err => err)
}

Vue.use(VueRouter)

/**
 * @description 创建在 layout 中显示的路由设置
 * @param {Array} routes 动态路由设置
 */
export function createRoutesInLayout(routes = []) {
  return [{
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          title: '首页',
          auth: true
        },
        component: _import('system/index')
      },
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
        // 刷新页面 必须保留
        {
          path: 'refresh',
          name: 'refresh',
          hidden: true,
          component: _import('system/function/refresh')
        },
        // 页面重定向 必须保留
        {
          path: 'redirect/:route*',
          name: 'redirect',
          hidden: true,
          component: _import('system/function/redirect')
        }
    ]
  },
  ...routes
]
}

// 在 layout 之外显示的路由
export const routesOutLayout = [
  // 登录
  {
    path: '/login',
    meta: {
      title: '登录'
    },
    name: 'login',
    component: _import('system/login')
  },
  {
    path: '/activeH5/:eventid/:hospitalid/:crfid/',
    name: 'activeH5',
    component: _import('system/activeH5/index')
  },{
    path: '/activeCampH5/:eventid/:hospitalid/:crfid/',
    name: 'activeH5',
    component: _import('system/activeH5/camp')
  },
  {
    path: '/application',
    name: 'application',
    component: _import('system/ApplicationView/index')
  },
  {
    path: '/designer',
    name: 'designer',
    component: _import('system/designer/index')
  },
  { path: '*',name: '404',component: _import('system/error/404') }
]
// 默认的路由
export const constantRoutes = createRoutesInLayout().concat(routesOutLayout)

/**
 * @description 创建路由
 * @param {Array} routes 路由设置
 */
const createRouter = (routes = []) => new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

// 导出路由 在 main.js 里使用
const router = createRouter(constantRoutes)

/**
 * @description 重新设置路由
 * @param {Array} routes 额外追加的路由
 */
export function resetRouter(routes = []) {
  router.matcher = createRouter(routes).matcher
}


// // 导出路由 在 main.js 里使用
// const router = new VueRouter({
//   routes
// })

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to,from,next) => {
  // 进度条
  NProgress.start()
 
  try {
    const token = util.cookies.get('token') //首页验证权限
    const auth = util.cookies.get('auth')// 应用选择权限
    // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
    // await store.dispatch('d2admin/page/isLoaded')
    // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
    await store.dispatch('d2admin/size/isLoaded')
    // 关闭搜索面板
    store.commit('d2admin/search/set',false)
    // 加载动态路由 内部已经做了对登录状态和是否已经加载动态路由的判断
    await store.dispatch('d2admin/permission/load',{ to: to.fullPath })
    // 验证当前路由所有的匹配中是否需要有登录验证的
    if (to.matched.some(r => r.meta.auth)) {
      // 这里暂时将cookie里是否存有token作为验证是否登录的条件
      // 请根据自身业务需要修改
      const token = util.cookies.get('token')
      if (token && token !== 'undefined') {
        next()
      } else {
        // 没有登录的时候跳转到登录界面
        // 携带上登陆成功之后需要跳转的页面完整路径
        util.cookies.set('redirect',to.fullPath)
        next({
          name: 'login',
          query: {
            redirect: to.fullPath
          }
        })
        // https://github.com/d2-projects/d2-admin/issues/138
      
      }
    } else {
      if (token && token !== 'undefined') {
        // 将当前预计打开的页面完整地址临时存储 登录后继续跳转
        // 这个 cookie(redirect) 会在登录后自动删除
        util.cookies.set('redirect',to.fullPath)
          if(from.name == 'index'){
            if (token && token !== 'undefined') {
              next(from.path,true);
            }else{
              next()
            }
          }else{
            next()
          }
      }else{
        if(from.name == 'application'){
          if (auth && auth !== 'undefined') {
            next(from.path,true);
          } else {
            next()
          }
        }else{
          next()
        }
      }
    }
  } catch (error) {
    next(false)
  }
  NProgress.done()
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
