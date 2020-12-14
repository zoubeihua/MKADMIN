export default {
    methods: {
        //会员服务申请状态
        GetApplyStatusType(STATUS) {
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
        },
        //input 价格格式化
        projectAmounts(num) {
            if (isNaN(parseFloat(num))) {
                return 0.0;
            } else if (num === 0) {
                return 0.0;
            } else {
                return num ?
                    (isNaN(parseFloat(num.toString().replace(/,/g, ""))) ?
                        1 :
                        parseFloat(num.toString().replace(/,/g, ""))
                    )
                    .toFixed(2)
                    .toString()
                    .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
                        return $1 + ",";
                    }) :
                    "";
            }
        },
        //停用启用状态;
        GetOpenAndStoptatusType(STATUS) {
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
        },
        //有效无效状态
        GetvalidStatusType(STATUS) {
            //1:有效 0:无效
            var type = "";
            if (STATUS == "1") {
                //
                type = "success";
            } else {
                //
                type = "danger";
            }
            return type;
        },
        //给权限分类加颜色;
        GetAccessType(ACCESSTYPE) {
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
        },
        GetStatusDispaly(STATUS) {
            // 状态 0：新建 1：审核通过 2：审核不通过 3:发布 99：删除
            var type = "";
            if (STATUS == "0") {
                type = "info";
            } else if (STATUS == "1") {
                type = "primary";
            } else if (STATUS == "2") {
                type = "danger";
            } else if (STATUS == "3") {
                type = "success";
            } else {
                type = "warning";
            }
            return type;
        },
        // 发布的状态
        GetEvaluateDisplay(STATUS) {
            // 状态 0：未发布 1：已发布 2：未执行 3:执行中 4: 执行完毕
            var type = "";
            if (STATUS == "0") {
                type = "info";
            } else if (STATUS == "1") {
                type = "primary";
            } else if (STATUS == "2") {
                type = "warning";
            } else if (STATUS == "3") {
                type = "danger";
            } else if (STATUS == "4") {
                type = "success";
            } else {
                type = "info"
            }
            return type;
        },
        GetCouponDisplay(STATUS) {
            // 状态  0暂存 1：提交 2：拒绝 3：审核 4：上架 5：下架 99： 删除
            var type = "";
            if (STATUS === "0") {
                type = "info";
            } else if (STATUS == "1") {
                type = "";
            } else if (STATUS == "2") {
                type = "success";
            } else if (STATUS == "3") {
                type = "primary";
            } else if (STATUS == "4") {
                type = "success";
            } else if (STATUS == "5") {
                type = "warning";
            } else if (STATUS == "6") {
                type = "danger"
            }
            return type;
        },
        //
        GetTaskDisplay(STATUS) {
            // 状态 0：待访 1：已访 2：失访 3:停止
            var type = "";
            if (STATUS == "0") {
                type = "primary";
            } else if (STATUS == "1") {
                type = "success";
            } else if (STATUS == "2") {
                type = "warning";
            } else if (STATUS == "3") {
                type = "danger";
            } else if (STATUS == "4") {
                type = "success";
            } else {
                type = "info"
            }
            return type;
        },
        // handleCurrentChange() {
        // },
        // getTabelClass({ row, rowIndex }) {
        // },
    }
}