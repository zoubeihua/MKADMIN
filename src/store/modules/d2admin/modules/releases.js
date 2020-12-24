import util from '@/libs/util.js'
import packageJson from '../../../../../package.json'
export default {
  namespaced: true,
  mutations: {
    /**
     * @description 显示版本信息
     * @param {Object} state state
     */
    versionShow () {
      util.log.capsule(`${packageJson.name}`, `v${process.env.VUE_APP_VERSION}`)
    }
  }
}
