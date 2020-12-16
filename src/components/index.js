import Vue from 'vue'

import d2Container from './d2-container'
import d2ContainerFrame from './d2-container-frame'
import d2LinkBtn from './d2-link-btn'
import mkPage from './mk-form/mk-page'
import mkSelect from './mk-form/mk-select'
import MkSelectTable from './mk-form/mk-select-table'
import MkTabsCrf from './mk-form/mk-tabs-crf'
import mkMemberSelect from './mk-form/mk-member-select'
import mkMemberSelectTable from './mk-form/mk-member-select-table'
import mkIntro from './mk-custom-components/mk-intro/index.js' 
import MkGrid from '@/components/mk-grid'
// 注意 有些组件使用异步加载会有影响
Vue.component('d2-container', d2Container)
Vue.component('d2-container-frame', d2ContainerFrame)
Vue.component('d2-link-btn', d2LinkBtn)
Vue.component('d2-count-up', () => import('./d2-count-up'))
Vue.component('d2-highlight', () => import('./d2-highlight'))
Vue.component('d2-icon', () => import('./d2-icon'))
Vue.component('d2-icon-svg', () => import('./d2-icon-svg/index.vue'))
Vue.component('d2-icon-select', () => import('./d2-icon-select/index.vue'))
Vue.component('d2-icon-svg-select', () => import('./d2-icon-svg-select/index.vue'))
Vue.component('d2-markdown', () => import('./d2-markdown'))
Vue.component('d2-mde', () => import('./d2-mde'))
Vue.component('d2-module-index-banner', () => import('./d2-module-index-banner'))
Vue.component('d2-module-index-menu', () => import('./d2-module-index-menu'))
Vue.component('d2-quill', () => import('./d2-quill'))
Vue.component('d2-scrollbar', () => import('./d2-scrollbar'))
Vue.component('d2-ueditor', () => import('./d2-ueditor'))

//自定义
Vue.component('mkPage', mkPage)
Vue.component('mkIntro', mkIntro)
Vue.component('mkSelect', mkSelect)
Vue.component('MkSelectTable', MkSelectTable)
Vue.component('MkTabsCrf', MkTabsCrf)
Vue.component('mkMemberSelect', mkMemberSelect)
Vue.component('mkMemberSelectTable', mkMemberSelectTable)
Vue.component('mkEmpty', () => import('./mk-form/mk-empty/index.vue'))
Vue.component('MkGrid', MkGrid)
