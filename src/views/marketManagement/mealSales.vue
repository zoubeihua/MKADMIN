<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true">
        <el-form-item>
          <el-input
            class="mr20"
            style="width:180px;"
            v-model="searchConditionForm.packageid"
            placeholder="按套餐id查询"
            @keydown.enter.native="getSaleInfo"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-input
            class="mr20"
            style="width:180px;"
            v-model="searchConditionForm.memberid"
            placeholder="按会员id查询"
            @keydown.enter.native="getSaleInfo"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-input
            class="mr20"
            style="width:180px;"
            v-model="searchConditionForm.buyername"
            placeholder="按购买者姓名查询"
            @keydown.enter.native="getSaleInfo"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-input
            class="mr20"
            style="width:180px;"
            v-model="searchConditionForm.buyertel"
            placeholder="按购买者电话查询"
            @keydown.enter.native="getSaleInfo"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchConditionForm.status"
            placeholder="状态"
            @change="getSaleInfo"
            multiple
            collapse-tags
            clearable
          >
            <el-option
              v-for="item in appointList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" @click="getSaleInfo">查询</el-button>
            <el-button type="success" @click="ShwoSalesModel"
              >销售套餐</el-button
            >
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="tableData" border style="width:100%" stripe>
      <el-table-column label="销售编号" align="center" prop="saleid" />
      <!-- <el-table-column label="合同编号" align="center" prop="contractcode" />
      <el-table-column label="发票编号" align="center" prop="invoicecode" /> -->
      <el-table-column
        label="套餐名称"
        align="center"
        prop="packagename"
        width="130"
      />
      <el-table-column label="购买人" align="center" prop="buyername" />
             <el-table-column label="购买人手机号" align="center" prop="buyertel" :formatter=" (i=>{return PhoneFormat(i,'buyertel')})" show-overflow-tooltip />

      <el-table-column label="会员ID" align="center" prop="memberid" />
      <el-table-column label="会员姓名" align="center" prop="membername" />
      <el-table-column label="购买渠道" align="center" prop="channel">
        <template slot-scope="scope">
          {{scope.row.channel=="1"?"线上":"线下"}}
        </template>
      </el-table-column>
      <el-table-column
        label="购买价格"
        align="center"
        prop="price"
        :formatter="i => projectAmountsTabel(i, 'price')"
      />
      <el-table-column label="介绍人" align="center" prop="introusername" show-overflow-tooltip />
       <el-table-column label="介绍人手机号" align="center" prop="introusertel" :formatter="(i=>{return PhoneFormat(i,'introusertel')})" show-overflow-tooltip />
      <el-table-column
        label="介绍费用"
        align="center"
        prop="introfee"
        :formatter="i => projectAmountsTabel(i, 'introfee')"
      />
      <el-table-column label="销售人" align="center" prop="saleusername" />
      <el-table-column
        label="销售时间"
        align="center"
        prop="saletime"
        width="120px"
      />
      <el-table-column align="center" fixed="right" width="180px">
        <template slot="header">
          <span class="primary">
            操作
          </span>
        </template>
        <template slot-scope="scope">
          <div class="tableBtn">
            <el-link
              title="编辑"
              :underline="false"
              type="success"
              @click="showModel(scope.row)"
            >
              <i class="mkfont bianji1"></i>
            </el-link>
            <el-link
              title="激活"
              :underline="false"
              type="warning"
              @click="showMatchModel(scope.row)"
            >
              <i class="mkfont guanlian"></i>
            </el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <mk-page :pager="pagerMember" @query="getSaleInfo" />
    </template>
    <!--  -->
    <vxe-modal
      v-model="Modal"
      title="激活套餐"
      width="600"
      height="400"
      :showFooter="true"
      @close="closeMatchModel"
    >
      <el-form
        ref="regFromData"
        :model="regFromData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="会员查询">
          <mk-member-select
            @change="getManagerItem"
            url="Publics/MemberManage/BasicInfo"
            :RequestData="{
              mycustomer: 0,
              expirationdaysmemberfee: 0,
              tag: 0,
              page: 1,
              rows: 20
            }"
            ref="selectManager"
            :clearable="true"
          />
        </el-form-item>
        <el-form-item label="会员名称" prop="memberid">
          <span :value="rowData.smembername">{{
            rowData.smembername || "请选择会员"
          }}</span>
        </el-form-item>
        <el-form-item label="会员id" prop="">
          <span :value="regFromData.memberid">{{
            rowData.smemberid || "请选择会员"
          }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center;">
        <el-button type="primary" @click="submitForm">确定</el-button>

        <el-button @click="closeMatchModel">关闭</el-button>
      </div>
    </vxe-modal>

    <!--  -->
    <el-drawer
      :visible.sync="isSalesShow"
      direction="rtl"
      size="100%"
      ref="isSalesShow"
      title="套餐销售"
    >
      <div slot="title">
        <span>
          套餐销售
        </span>
      </div>
      <div style="height:calc(100% - 50px);overflow-y:auto">
        <sales ref="sales" v-if="isSalesShow" :rowData="rowData" />
      </div>
      <div class="lq_drawer__footer">
        <el-button-group>
          <el-button @click="saleInfoPost">提交</el-button>
          <el-button @click="closeSalesModel">关闭</el-button>
        </el-button-group>
      </div>
    </el-drawer>
  </d2-container>
</template>

<script>
import sales from "./components/sales";
import dayjs from "dayjs";
export default {
  name: "mealSales",
  computed: {},
  components: { sales },
  data() {
    return {
      Modal: false,
      rules: {
        memberid: [{ required: true, message: "请选择会员",trigger: "blur" }]
      },
      regFromData: {
        memberid: "",
        saleid: "",
        operatetype: "C"
      },
      isSalesShow: false,
      rowData: {
        smemberid: "",
        smembername: ""
      },
      saleDate: "",
      appoint: 0,
      appointList: [
        {
          value: "0",
          label: "正常"
        },
        { value: "1", label: "作废" }
      ],
      // 会员信息表格分页
      pagerMember: {
        count: 0,
        page: 1,
        rows: 10,
        condition: ""
      },
      // 当前会员套餐表格分页
      pagerMemberMeal: {
        count: 0,
        page: 1,
        rows: 10,
        condition: ""
      },
      // 头部搜索条件
      searchConditionForm: {
        packageid: "",
        memberid: "",
        buyername: "",
        buyertel: "",
        page: 1,
        rows: 20,
        hospitalid: "",
        status:["0"]
      },
      // 会员信息表格
      tableData: [],
      // 当前选中会员的套餐信息表格
      curMemberMealTableData: [],

      // 日期选择
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  created() {
    this.getSaleInfo();
  },
  methods: {
    // 提交
    submitForm() {
      this.$refs.regFromData.validate(valid => {
        if (valid) {
          this.MemberRegInfo_post();
        }
      });
    },
    MemberRegInfo_post() {
      this.MK.Request(
        "/Hcrm/PackageService/MemberRegInfo",
        "post",
        this.regFromData
      ).then(res => {
        if (res.code == 0) {
          this.$message.success(res.msg);
          this.closeMatchModel();
          this.getSaleInfo();
        }
      });
    },
    showModel(data) {
      this.isSalesShow = true;
      this.rowData = data;
      this.$nextTick(() => {
         this.$refs.sales.remoteMethod(data.packageid)
        this.$refs.sales.fromData = { ...data };
         this.$refs.sales.fromData.operatetype = "U";
        this.$refs.sales.ManagerItem.memberid = data.memberid;
        this.$refs.sales.ManagerItem.membername = data.membername;
        this.$refs.sales.packageclassify_Get(data.packageid,data.packagename)
      });
    },
    // 分页刷新 查询
    getSaleInfo() {
      this.searchConditionForm.hospitalid = this.info.hospitalid;
      this.MK.Request(
        "/Hcrm/PackageService/SaleInfo",
        "get",
        this.searchConditionForm
      ).then(res => {
        if (res.code == 0) {
          this.tableData = res.data;
          this.searchConditionForm.count = res.count;
        }
      });
    },
    //提交
    saleInfoPost() {
      this.$refs.sales.$refs["fromData"].validate(valid => {
        if (valid) {
          let data = { ...this.$refs.sales.fromData };
          data.operatetime = dayjs().format("YYYY-MM-DD HH:mm:ss");
          data.saletime = dayjs().format("YYYY-MM-DD HH:mm:ss");
          data.operateueername = this.info.username;
          data.operateuserid = this.info.userid;
          data.operateuserno = this.info.userno;
          console.log(data);
          this.MK.Request("/Hcrm/PackageService/SaleInfo", "post", data).then(
            res => {
              if (res.code == 0) {
                console.log(res);
                this.$message.success(res.msg);
                this.getSaleInfo();
                this.closeSalesModel();
              }
            }
          );
        }
      });
    },
    getManagerItem(item) {
      if (!item) {
        this.rowData.smemberid = "";
        this.rowData.membername = "";
        this.regFromData.memberid = "";
        return;
      }
      this.rowData.smemberid = item.memberid;
      this.regFromData.memberid = item.memberid;
      this.rowData.smembername = item.membername;
    },
    showMatchModel(row) {
      this.rowData = { ...row };
      this.rowData.smemberid = row.memberid;
      this.rowData.smembername = row.membername;
      if (!!row.memberid) {
        this.regFromData.operatetype = "U";
      }
      this.regFromData.saleid = row.saleid;

      this.Modal = true;
    },
    closeMatchModel() {
      this.Modal = false;
      this.regFromData = {
        memberid: "",
        saleid: "",
        operatetype: "C"
      };
    },
    ShwoSalesModel() {
      this.isSalesShow = true;
    },
    closeSalesModel() {
        this.$refs.sales.init();
        this.$refs.sales.fromData.operatetype = "C";
      this.isSalesShow = false;
      
    }
  }
};
</script>

<style scoped>
.inputSearch {
  width: 160px;
}
.mr20 {
  margin-right: 20px;
}
>>> .el-drawer__header {
  margin: 0 !important;
  padding: 5px 20px !important;
  background: #8ddba5;
  color: white;
}
.lq_drawer__footer {
  position: fixed;
  bottom: 10px;
  width: 100%;
  text-align: center;
}
>>> .el-drawer__body {
  height: 100%;
}
</style>
