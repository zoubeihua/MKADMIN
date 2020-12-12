export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
    /**
   * @description 菜单列表
   * @description 获取所有菜单的层级关系
   */
  MENU_ALL (query = {}) {
    return request({
      url: '/Publics/Common/Menu_Get',
      method: 'get',
      params: query
    })
  },
})