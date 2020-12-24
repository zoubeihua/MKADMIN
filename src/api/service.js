import { Message } from 'element-ui'
import VXETable from 'vxe-table'
import axios from 'axios'
import Adapter from 'axios-mock-adapter'
import _ from 'lodash'
import qs from 'qs'
import util from '@/libs/util'
import store from '@/store'
/**
 * @description 记录和显示错误
 * @param {Error} error 错误对象
 */
function handleError(error) {
  // 添加到日志
  store.dispatch('d2admin/log/push',{
    message: '数据请求异常',
    type: 'danger',
    meta: {
      error
    }
  })
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
    console.log(error)
  }
  // 显示提示
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
}
//内存中正在请求的数量
let loadingNum = 0;
function startLoading() {
  if (loadingNum == 0) {
    VXETable.modal.message({ message: '加载中...', status: 'loading',id: 'loading',duration:-1,lockView:true })
  }
  //请求数量加1
  loadingNum++;
}
function endLoading() {
  //请求数量减1
  loadingNum--
  if (loadingNum <= 0) {
    VXETable.modal.close("loading")
  }
}
//删除空对象
function removeEmptyObjects(obj) {
  let _newPar = {};
  for (let key in obj) {
    /**
     * 如果对象属性的值不为空,就保存该属性
     * 这里我做了限制,如果属性的值为0,保存该属性。如果属性的值全部是空格,属于为空。
     */
    if (
      (obj[key] === 0 || obj[key]) &&
      obj[key].toString().replace(/(^\s*)|(\s*$)/g,"") !== ""
    ) {
      //记录属性
      _newPar[key] = obj[key];
    }
  }
  //返回对象
  return _newPar;
}
//fixedData参数获取
function getFixedData() {
  const data = store.state.d2admin;
  const userinfo = data.user.info;
  const menuinfo = data.menu.menuData;
  let sendData = {
    userid: userinfo.userid || '-1', //用户ID
    userno: userinfo.userno || '', //用户工号
    username: userinfo.username || userinfo.name || '', //用户名称
    hospitalcode: userinfo.hospitalcode || '', //院区id
    hospitalname: userinfo.hospitalname || '', //院区名称
    appid: userinfo.appid || '', //应用id
    appname: userinfo.appname || '', //应用名称
    menuid: menuinfo.menuid || '', //菜单id
    menuname: menuinfo.title || '', //菜单名称
    ipaddr: '', //IP地址
  };
  return sendData;
};

/**
 * @description 创建请求实例
 */
function createService() {
  // 创建一个 axios 实例
  const service = axios.create()
  // 请求拦截
  service.interceptors.request.use(
    config => {
      startLoading()
      const data = store.state.d2admin;
      const userinfo = data.user.info;
      config.headers['Authorization'] = userinfo.accessToken;
      let fixeddata = getFixedData();
      if (config.method == 'post') {
        config.data = {
          ...config.data,
          fixeddata
        }
      } else if (config.method == 'get') {
        config.params = {
          ...config.params
        }
        config.paramsSerializer = function (params) {
          let paramsdata = removeEmptyObjects(params);
          return qs.stringify(paramsdata,{ arrayFormat: 'repeat' })
        }
      }

      return config
    },
    error => {
      // 发送失败
      console.log(error)
      endLoading();
      return Promise.reject(error)
    }
  )
  // 响应拦截
  service.interceptors.response.use(
    response => {
      endLoading();
      // http 状态码 200 情况
      // 根据 前后端约定的 response.data.code 判断接口是否请求成功
      // 例如 接口返回数据为
      // {
      //   code: 0,
      //   msg: 'success',
      //   data: {
      //     list: [],
      //     count: 0
      //   }
      // }
      // 此时
      // response.data.code :
      // 0
      // response.data.msg :
      // 'success'
      // response.data.data : (在调用接口)
      // {
      //   list: [],
      //   count: 0
      // }
      // 默认约定 code 为 0 时代表成功
      // 你也可以不使用这种方法，改为在下面的 http 错误拦截器里做处理
      const dataAxios = response.data.result
      const { code,msg,result } = response.data
      // 没有 code 视为非项目接口不作处理
      if (code === undefined) {
        return dataAxios
      }

      // 有 code 判断为项目接口请求
      switch (code) {
        // 返回响应内容
        case 0: return { code,msg,result,...dataAxios }
        // 例如在 code 401 情况下退回到登录页面
        case 1:
          Message({
            message: msg,
            type: 'error',
            duration: 5 * 1000
          })
          return { code,msg,...dataAxios }
        case -1:
          Message({
            type: "error",
            message: msg
          })
          return { code,msg,...dataAxios }
        case 15:
          // [ 示例 ] code === 0 代表没有错误
          return { code,msg,...dataAxios }
        case 1000:
          // [ 示例 ] 其它和后台约定的 code : ${response.config.url}
          store.dispatch('d2admin/account/logout',{},{ root: true })
          // errorCreate(`${msg}`, code)
          return { code,msg,...dataAxios }
        // 根据需要添加其它判断 // 显示提示
        default: 
          Message({
            type: "error",
            message: msg
          })
        // throw new Error(`${response.data.msg}: ${response.config.url}`)
        break
      }
    },
    error => {
      endLoading();
      const status = _.get(error,'response.status')
      switch (status) {
        case 400: error.message = '请求错误'; break
        case 401: error.message = '未授权，请登录'; break
        case 403: error.message = '拒绝访问'; break
        case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
        case 408: error.message = '请求超时'; break
        case 500: error.message = '服务器内部错误'; break
        case 501: error.message = '服务未实现'; break
        case 502: error.message = '网关错误'; break
        case 503: error.message = '服务不可用'; break
        case 504: error.message = '网关超时'; break
        case 505: error.message = 'HTTP版本不受支持'; break
        default: break
      }
      handleError(error)
      throw error
    }
  )
  return service
}

function stringify(data) {
  return qs.stringify(data,{ allowDots: true,encode: false })
}

/**
 * @description 创建请求方法
 * @param {Object} service axios 实例
 */
function createRequest(service) {
  return function (config) {
    const token = util.cookies.get('token')
    const configDefault = {
      headers: {
        Authorization: token,
        'Content-Type': _.get(config,'headers.Content-Type','application/json')
      },
      timeout: 300000,
      baseURL: process.env.VUE_APP_API,
      data: {}
    }
    const option = Object.assign(configDefault,config)
    // // 处理 get 请求的参数
    // // 请根据实际需要修改
    // if (!_.isEmpty(option.params)) {
    //   option.url = option.url + '?' + stringify(option.params)
    //   option.params = {}
    // }
    // // 当需要以 form 形式发送时 处理发送的数据
    // // 请根据实际需要修改
    // if (!_.isEmpty(option.data) && option.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    //   option.data = stringify(option.data)
    // }
    return service(option)
  }
}

// 用于真实网络请求的实例和请求方法
export const service = createService()
export const request = createRequest(service)

// 用于模拟网络请求的实例和请求方法
export const serviceForMock = createService()
export const requestForMock = createRequest(serviceForMock)

// 网络请求数据模拟工具
export const mock = new Adapter(serviceForMock)
