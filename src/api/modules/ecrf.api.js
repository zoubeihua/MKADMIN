export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
//    /**
//     * @description 获取CRFID
//     * @param {Object} query 参数
//    */
//     CRFID_Get(query = {}){
//         return request({
//             url: 'CRFID_Get',
//             method: 'get',
//             params: query
//         })
//     },
   /**
    * @description 新增评分项
    * @param {Object} crfid crifid
    * @param {Array} scoreoptions 所有评分数据
   */
  ScoreOptions_Add({crfid,scoreoptions}){
    return request({
        url: '/Publics/CRFScoreOptions/ScoreOptions_Add',
        method: 'post',
        data:{crfid,scoreoptions}
    })
  },
    /**
    * @description 通过CRFID获取评分项
    * @param {Object} crfid crifid
   */
    ScoreOptions_Get(crfid){
        return request({
            url: '/Publics/CRFScoreOptions/ScoreOptions_Get',
            method: 'get',
            params:crfid
        })
    }
})