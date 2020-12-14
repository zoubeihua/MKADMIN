import api from '@/api'
import { Message } from "element-ui";

//获取字典字段进行过滤
export async function GetStatus(status) {
  var filterArrStatus = [];
  let resData = await api.Request(
    "dic_standardcode_Get",
    "GET",
    { codetype: status }
  );
  for (var index in resData.data) {
    filterArrStatus.push({
      text: resData.data[index].BZNAME,
      value: resData.data[index].BZNAME
    });
  }
  return filterArrStatus;
}

// 按钮权限
export async function PostButtonLimit(obj) {
  await api.Request(
    "ButtonAccess_Add",
    "post",
    { ButtonAccessArr: obj }
  );
}

//密码重置
export async function ResetPassword(LOGINUID) {
  if (LOGINUID == "") {
    Message({
      type: "warning",
      message: "请选择账户重置密码"
    });
    return;
  }
  await api
    .Request(
      "ResetPassword",
      "post",
      { LOGINUID: LOGINUID }
    )
    .then(res => {
      console.log(res);
      Message({
        type: "success",
        message: res.msg
      });
    });
}

//停用启用状态;
export function GetOpenAndStoptatusType(STATUS) {
  console.log(STATUS)
  //0：停用 1：启用 99删除
  var type = "";
  if (STATUS == "1") {
    type = "success";
  } else if (STATUS == "0") {
    type = "warning";
  } else {
    type = "danger";
  }

  return type;
}

//给权限分类加颜色;
export function GetAccessType(ACCESSTYPE) {
  // ACCESSTYPE 权限类型，-1：应用权限  0：系统预设 1：菜单权限 2：功能权限
  var type = "";
  if (ACCESSTYPE == "-1") {
    //1：应用权限
    type = "danger";
  } else if (ACCESSTYPE == "0") {
    //0：系统预设
    type = "warning";
  } else if (ACCESSTYPE == "1") {
    type = "success";
    //1：菜单权限
  } else {
    type = "primary";
    //2：功能权限
  }
  return type;
}
export function GetApplyStatusType(STATUS) {
  //状态 -1(默认) 为不根据状态查询  0：申请 1：安排计划 2：执行完成 3：入帐完成 9：申请取消 99：确认取消
  var type = "";
  if (STATUS == "0") {
    type = "";
  } else if (STATUS == "1") {
    type = "warning";
  } else if (STATUS == "2" || STATUS == "3") {
    type = "success";
  } else if (STATUS == "99" || STATUS == "9") {
    type = "danger";
  }
  return type;
}