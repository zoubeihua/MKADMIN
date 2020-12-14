<template>
  <el-container>
    <el-table
      :data="paymentTableData"
      style="width:100%"
      highlight-current-row
      stripe
      height="100%"
    >
      <el-table-column show-overflow-tooltip align="center" label="缴纳时间" prop>
        <template slot-scope="scope">
          <div>{{dateFormat(scope.row.actualdate)}}</div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="会员等级" prop="levelid_display" />
      <el-table-column show-overflow-tooltip align="center" label="会费标准" prop />
      <el-table-column show-overflow-tooltip align="center" label="实缴金额" prop="actualfee" :formatter="projectAmountsTabel" />
      <el-table-column show-overflow-tooltip align="center" label="支付方式" width="200">
        <template slot-scope="scope">
          <div>
            <el-tag
              style="margin-right:10px"
              :type="getPaymentType(scope.row.paymenttype)"
            >{{scope.row.paymenttype_dispalay}}</el-tag>
            <el-tag
              v-if="scope.row.paymenttype2_dispalay"
              :type="getPaymentType(scope.row.paymenttype2)"
            >{{scope.row.paymenttype2_dispalay}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="生效日期" prop>
        <template slot-scope="scope">
          <div>{{dateFormat(scope.row.effectivedate)}}</div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="失效日期" prop>
        <template slot-scope="scope">
          <div>{{dateFormat(scope.row.expirationdate)}}</div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="发票类型" prop />
      <el-table-column show-overflow-tooltip align="center" label="发票编号" prop />
      <el-table-column show-overflow-tooltip align="center" label="操作员" prop="createid_display" />
      <el-table-column show-overflow-tooltip align="center" label="操作时间" prop="createtime" />
    </el-table>
    <el-footer>
      <mk-page :pager="paymentPage" @query="refreshPayment" />
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: "memberpayment",
  props: {
    userData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      paymentTableData: [],
      paymentPage: {
        page: 1,
        rows: 20,
        tag: 0,
        count: 0
      }
    };
  },
  created() {
    this.refreshPayment(this.userData.memberid);
  },
  methods: {
    refreshPayment(memberid) {
      (this.paymentPage.memberid = memberid),
        (this.paymentPage.hospitalid = this.info.hospitalid);
      this.MK.Request(
        "/Hcrm/MemberService/MemberShipFee",
        "get",
        this.paymentPage
      ).then(res => {
        this.paymentTableData = res.data;
        this.paymentPage.count = res.count;
      });
    },
    getPaymentType(type) {
      // 0:现金支付 1:银联支付 11:支付宝 12:微信
      if (type == "0") {
        return "danger";
      } else if (type == "1") {
        return "warning";
      } else if (type == "11") {
        return "primary";
      } else if (type == "12") {
        return "success";
      }
    },
    dateFormat(date) {
      if (date) {
        var year = date.substr(0, 4);
        var month = date.substr(4, 2);
        var day = date.substr(6);
        return `${year}-${month}-${day}`;
      }
    },
    // 表格金额过滤,
    projectAmountsTabel(row) {
      let num = row.actualfee; // 过滤字段
      if (isNaN(parseFloat(num))) {
        return 0.0;
      } else {
        return num
          ? (isNaN(parseFloat(num.toString().replace(/,/g, "")))
              ? 1
              : parseFloat(num.toString().replace(/,/g, ""))
            )
              .toFixed(2)
              .toString()
              .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
                return $1 + ",";
              })
          : "";
      }
    },
  }
};
</script>
