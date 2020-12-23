export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 登录
   * @param {Object} data 登录携带的信息
   */
  SYS_USER_LOGIN (data = {}) {
    return request({
      url: '/Publics/Common/UserLogin',
      method: 'post',
      data
    })
  },
  SYS_Portal_Info_Get(query = {}){
    return request({
      url: '/Publics/MemberManage/Portal/PortalGetPortalInfoByUserID_get',
      method: 'get',
      params: query
    })
  }
})
