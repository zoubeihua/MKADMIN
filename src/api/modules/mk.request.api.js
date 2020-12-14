export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
     /**
     * @description 公共请求
     * @param {String} url 登录携带的信息
     * @param {String} method 请求方式 GET POST
     * @param {Object} param 请求参数
     */
    Request (url, method, param) {
      if (method.toLowerCase() == 'post') {
    return request({
      url: url,
      method: method,
      data: param
    })
  } else {
    return request({
      url: url,
      method: method,
      params: param,
    })
  }
  }
})
  