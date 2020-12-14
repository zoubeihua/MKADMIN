export default {
  namespaced: true,
  state: {
    //科研ID
    RESEARCHID: '',
    //是否crf模板库页面
    iscrftemplatepage: false,
    // ecrf
    wgeCRFData: [],
    //储存项目流程节点对应的表单信息 formMaintenance
    formMaintenanceItem: {},
    //评分关联的控件选项
    rateOptions: [],
    crfid: '',//CRFID标识

  },
  actions: {
    /**
  * @description 设置是否crf模板库页面
  * @param {Object} state state
  * @param {Object} flag  状态
  */
    iscrftemplatepageSet({ state,dispatch },flag) {
      return new Promise(async resolve => {
        state.iscrftemplatepage = flag;
        await dispatch('d2admin/db/set',{
          dbName: 'sys',
          path: 'ecrf.iscrftemplatepage',
          value: state.iscrftemplatepage,
          user: true
        },{ root: true })
        resolve()
      })
    },
    /**
   * @description 设置项目流程节点对应的表单信息数据
   * @param {Object} state state
   * @param {Object} formMaintenanceItem 单个表单信息
   */
  formMaintenanceItemSet({ state,dispatch },formMaintenanceItem) {
      return new Promise(async resolve => {
        state.formMaintenanceItem = formMaintenanceItem;
        state.crfid = formMaintenanceItem.crfid;
        await dispatch('d2admin/db/set',{
          dbName: 'sys',
          path: 'ecrf.formMaintenanceItem',
          value: state.formMaintenanceItem,
          user: true
        },{ root: true })
        resolve()
      })
    },
    /**
   * @description 设置表单设计器数据
   * @param {Object} state state
   * @param {Object} rateOptions ecrf setting
   */
    wgeCRFDataSet({ state,dispatch },wgeCRFData) {
      return new Promise(async resolve => {
        // store 赋值
        state.wgeCRFData = wgeCRFData
        // 持久化
        await dispatch('d2admin/db/set',{
          dbName: 'sys',
          path: 'ecrf.wgeCRFData',
          value: state.wgeCRFData,
          user: true
        },{ root: true })
        // end
        resolve()
      })
    },
    /**
   * @description 设置评分关联控件数据
   * @param {Object} state state
   * @param {Array} rateOptions ecrf setting
   */
    rateOptionsSet({ state,dispatch },rateOptions) {
      return new Promise(async resolve => {
        // store 赋值
        state.rateOptions = rateOptions || [];
        // 持久化
        await dispatch('d2admin/db/set',{
          dbName: 'sys',
          path: 'ecrf.rateOptions',
          value: state.rateOptions,
          user: true
        },{ root: true })
        resolve()
      })
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} context
     */
    load({ state,dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.iscrftemplatepage = await dispatch('d2admin/db/get',{
          dbName: 'sys',
          path: 'ecrf.iscrftemplatepage',
          defaultValue: false,
          user: true
        },{ root: true })
        state.formMaintenanceItem = await dispatch('d2admin/db/get',{
          dbName: 'sys',
          path: 'ecrf.formMaintenanceItem',
          defaultValue: {},
          user: true
        },{ root: true })
        // store 赋值评分
        state.rateOptions = await dispatch('d2admin/db/get',{
          dbName: 'sys',
          path: 'ecrf.rateOptions',
          defaultValue:[],
          user: true
        },{ root: true })
        state.crfid = state.formMaintenanceItem.crfid
        resolve()
      })
    }
  },
  mutations: {

  }
}
