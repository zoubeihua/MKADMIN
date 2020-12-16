// Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//VXE-Table
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'



// flex 布局库
import 'flex.css'
// 组件
import '@/components'
// svg 图标
import '@/assets/svg-icons'
// 国际化
import i18n from '@/i18n.js'

// 功能插件
import pluginApi from '@/plugin/api'
import pluginError from '@/plugin/error'
import pluginLog from '@/plugin/log'
import pluginOpen from '@/plugin/open'
import '@/assets/style/font-awesome-4.7.0/css/font-awesome.min.css'
import '@c/mk-form-making/FormMaking.css'
import { MakingForm, GenerateForm} from '@c/mk-form-making/FormMaking.umd.js'
import FormMaking from '@/components/mkmakingform/index'
import mkImgPreview from '@/components/mk-form/mk-img-preview/index'
import pluginPermission from '@/plugin/permission'
export default {
  async install (Vue, options) {
    // 设置为 false 以阻止 vue 在启动时生成生产提示
    // https://cn.vuejs.org/v2/api/#productionTip
     //VXE-Table
     Vue.use(VXETable)
    Vue.config.productionTip = false
    // 当前环境
    Vue.prototype.$env = process.env.NODE_ENV
    // 当前的 baseUrl
    Vue.prototype.$baseUrl = process.env.BASE_URL
    // 当前版本
    Vue.prototype.$version = process.env.VUE_APP_VERSION
    // 构建时间
    Vue.prototype.$buildTime = process.env.VUE_APP_BUILD_TIME
    //"Mk666";//重置默认密码
    Vue.prototype.DefaultPassWord = "ED3360DF1F3EB3710F0073609CD778AC";
    //资源路径
    Vue.prototype.publicUrl = '/Images'; 
    //是否启用本地驱动程序拍照
    Vue.prototype.isLocalDrive = true;
    //调用本地拍照地址
    Vue.prototype.capImgURL = 'http://127.0.0.1:8055/CaptureImage';
    //VXE模态窗口
    Vue.prototype.$XModal = VXETable.modal
    // Element
    Vue.use(ElementUI, {
      i18n: (key, value) => i18n.t(key, value)
    })
   
    // 插件
    Vue.use(pluginApi)
    Vue.use(pluginError)
    Vue.use(pluginLog)
    Vue.use(pluginOpen)

    Vue.use(FormMaking)
    Vue.use(mkImgPreview)
    
    Vue.use(pluginPermission)

    Vue.component('mk-making-form', MakingForm)
    Vue.component('mk-generate-form', GenerateForm)
  }
}
