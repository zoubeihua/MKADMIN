import menuMixin from './mixin/menu'
import { elMenuItem, elSubmenu } from './libs/util.menu'

export default {
  name: 'mk-menu',
  mixins: [
    menuMixin
  ],
  props:{
    list:{
      type:Array,
      default: () =>[]
    },
    backgroundColor:{
      type:String,
      default: () => '#ffffff'
    },
    activeTextColor:{
      type:String,
      default: () => '#409EFF'
    },
    textColor:{
      type:String,
      default: () => '#303133'
    },
    defaultActive:{
      type:String,
      default:() => ""
    }
  },
  render (createElement) {
    return createElement('div', { attrs: { class: '' } }, [
      createElement('el-menu', {
        props: { collapse:  false, uniqueOpened: true, textColor:this.textColor,defaultActive:this.defaultActive, activeTextColor:this.activeTextColor, backgroundColor:this.backgroundColor },
        ref: 'menu',
        on: { select: this.handleMenuSelect }
      }, this.list.map(menu => (menu.children === undefined ? elMenuItem : elSubmenu).call(this, createElement, menu))),
      ...this.list.length === 0  ? [
        createElement('div', { attrs: { class: 'd2-layout-header-aside-menu-empty', flex: 'dir:top main:center cross:center' } }, [
          createElement('d2-icon', { props: { name: 'inbox' } }),
          createElement('span', {}, '暂无菜单')
        ])
      ] : []
    ])
  },
  data () {
    return {
      asideHeight: 300,
    }
  },
  computed: {

  },
  watch: {
    // 折叠和展开菜单的时候销毁 better scroll
    asideCollapse (val) {

    }
  },
  mounted () {

  },
  beforeDestroy () {

  },
  methods: {

  }
}
