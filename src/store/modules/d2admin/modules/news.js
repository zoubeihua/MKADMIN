export default {
    namespaced: true,
    state:{
        NEWSID:null,//咨询新闻ID
    },
    actions:{
        /**
       * @description 储存点击的新闻列表ID
       * @param {Object} state state
       * @param {Object} NEWSID  ID
       */
      NewsIdSet({state,dispatch},NEWSID){
        return new Promise(async resolve => {
            state.NEWSID = NEWSID;
            await dispatch('d2admin/db/set',{
                dbName: 'sys',
                path: 'news.NEWSID',
                value: state.NEWSID,
                user: true
            },{ root: true })
            resolve()
        })
      },
      load({state,dispatch}){
          return new Promise(async resolve => {
              state.NEWSID = await dispatch('d2admin/db/get',{
                  dbName:'sys',
                  path: 'news.NEWSID',
                  value:null,
                  user:true
              },{root: true})
              resolve()
          })
      }
    }
}