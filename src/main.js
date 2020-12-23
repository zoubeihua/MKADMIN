// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'

// [ 可选组件 ] 区域划分
import SplitPane from 'vue-splitpane'
//表格导出
import pluginExport from '@d2-projects/vue-table-export'
//表格导入
import pluginImport from '@d2-projects/vue-table-import'
// store
import store from '@/store/index'

// 菜单和路由设置
import router from '@/router'

import dataStandardDic from '@/minxins/dataStandardDic'
import pageStatus from "@/minxins/pagestatus.js";
import util from "@/minxins/util.js";
import './permission'
// 核心插件
Vue.use(d2Admin)
Vue.use(pluginExport)
Vue.use(pluginImport)

Vue.mixin(dataStandardDic);
Vue.mixin(pageStatus);
Vue.mixin(util);
Vue.component('SplitPane', SplitPane)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created () {
    // 处理路由 得到每一级的路由设置
    // this.$store.commit('d2admin/page/init', constantRoutes)
    // 设置顶栏菜单
    // this.$store.commit('d2admin/menu/headerSet', menuHeader)
    // 初始化菜单搜索功能
    // this.$store.commit('d2admin/search/init', menuHeader)
  },
  mounted () {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  },
  watch: {
    // 检测路由变化切换侧边栏内容
    // '$route.matched': {
    //   handler (matched) {
    //     if (matched.length > 0) {
    //       const _side = menuAside.filter(menu => menu.path === matched[0].path)
    //       this.$store.commit('d2admin/menu/asideSet', _side.length > 0 ? _side[0].children : [])
    //     }
    //   },
    //   immediate: true
    // }
  }
}).$mount('#app')
