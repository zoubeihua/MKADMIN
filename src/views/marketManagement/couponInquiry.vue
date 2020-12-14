<template>
  <d2-container>
    <!-- 头部 -->
    <template slot="header">
      <el-form :inline="true">
        <el-form-item>
          <mk-select
            v-model="pager.DateTag"
            url="1"
            :globalFn="true"
            :datas="[
              { bzname: '生效时间', bzcode: '0' },
              { bzname: '失效时间', bzcode: '1' }
            ]"
            :filter="['bzname', 'bzname']"
            width="160px"
            label="bzname"
            val="bzcode"
            placeholder="请选择优惠券类型"
            @change="CouponList_Get"
            :clearable="false"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="pager.dataRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="getDataRange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <mk-select
            v-model="pager.coupontype"
            url="1"
            :globalFn="true"
            :param="{ codetype: '优惠券类型' }"
            :filter="['bzname', 'filterstr']"
            width="160px"
            label="bzname"
            val="bzcode"
            placeholder="请选择优惠券类型"
            @change="CouponList_Get"
            :clearable="true"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <mk-select
            v-model="pager.status"
            url="1"
            multiple
            collapse-tags
            :globalFn="true"
            :param="{ codetype: '优惠券状态' }"
            :filter="['bzname', 'filterstr']"
            width="160px"
            label="bzname"
            val="bzcode"
            placeholder="请选择优惠券状态"
            @change="CouponList_Get"
            :clearable="true"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="pager.condition"
            placeholder="按优惠券名称查找"
            @keyup.enter.native="CouponList_Get"
          />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="CouponList_Get"
              >查询</el-button
            >
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>

    <SplitPane
      :min-percent="50"
      :default-percent="50"
      split="vertical"
      style="height:100%"
    >
      <template slot="paneL">
        <el-container>
          <el-table
            :data="tableData"
            border
            highlight-current-row
            stripe
            style="width:100%"
            height="100%"
            ref="tableM"
            @sort-change="changeTableSort"
            @row-click="seachDetail"
          >
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="类型"
              prop="coupontypedisplay"
              width="80"
              sortable
            />
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="优惠券名称"
              prop="couponname"
              min-width="120"
              sortable
            />
            <el-table-column align="center" label="状态" width="95" sortable>
              <template slot-scope="scope">
                <el-tag
                  :type="GetCouponDisplay(scope.row.status)"
                  disable-transitions
                  >{{ scope.row.statusdisplay }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="生效日期"
              prop="effectivedate"
              width="100"
              sortable
            />
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="失效日期"
              prop="expirationdate"
              width="140"
              sortable
            />
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="发放总量"
              prop="totalquantity"
              width="100"
              sortable
            />

            <el-table-column
              show-overflow-tooltip
              align="center"
              label="领取数量"
              prop="receivedquantity"
              width="100"
              sortable
            />
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="剩余数量"
              prop="remainingquantity"
              width="100"
              sortable
            />
          </el-table>
          <el-footer
            ><mk-page :pager="pager" @query="CouponList_Get"
          /></el-footer>
        </el-container>
      </template>
      <template slot="paneR">
        <el-container>
          <el-table
            :data="detailtableData"
            border
            highlight-current-row
            stripe
            style="width:100%"
            height="100%"
            ref="detailtableData"
            @sort-change="changeTableDetailSort"
          >
            <el-table-column
              label="id"
              prop="coupodetailid"
              sortable
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="状态"
              width="80"
              sortable
              prop="status"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="GetEvaluateDisplay(scope.row.status)"
                  disable-transitions
                  >{{ scope.row.status_display }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              label="领用人"
              prop="membername"
              align="center"
              width="100"
              sortable
            >
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="showBaseUSer({ memberid: scope.row.memberid })"
                >
                  {{ scope.row.membername }}</el-link
                >
              </template>
            </el-table-column>
            <el-table-column
              label="领取时间"
              prop="taketime"
              align="center"
              width="150"
              sortable
            ></el-table-column>
            <!-- <el-table-column
              label="使用时间"
              prop="usedTime"
              align="center"
              width="120"
              sortable
            ></el-table-column> -->
          </el-table>
          <el-footer
            ><mk-page :pager="CouponDetailFrom" @query="CouponDetail"
          /></el-footer>
        </el-container>
      </template>
    </SplitPane>
    <el-drawer
      :visible.sync="isUserModel"
      direction="rtl"
      size="100%"
      ref="isUserModel"
      title="会员基本信息"
    >
      <baseinfo
        v-if="isUserModel"
        :userData="memberBasicinfo"
        :memberid="memberBasicinfo.memberid"
      ></baseinfo>
    </el-drawer>
  </d2-container>
</template>
<script>
import baseinfo from "@/views/system/Publics/memberManagement/components/page/baseinfo.vue";
export default {
  components: { baseinfo },
  name: "couponInfoMaintain",

  data() {
    return {
      pager: {
        count: 0,
        page: 1,
        rows: 20,
        status: [],
        condition: "",
        coupontype: "",
        dataRange: "",
        DateTag: "0",
        Bdate: "",
        Edate: "",
        hospitalid: "",
        orderby: ""
      },
      memberBasicinfo: {},
      isUserModel: false,
      tableData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      detailtableData: [],
      CouponDetailFrom: {
        hospitalid: "",
        couponid: "",
        count: 0,
        page: 1,
        rows: 20,
        arrstatus: ["1", "2", "3", "4"]
      }
    };
  },
  created() {
    this.CouponList_Get();
  },
  methods: {
    showBaseUSer(user) {
      this.memberBasicinfo = user;
      this.isUserModel = true;
    },
    seachDetail(row) {
      this.CouponDetailFrom.couponid = row.couponid;
      this.CouponDetail(row);
    },
    CouponDetail() {
      this.CouponDetailFrom.hospitalid = this.info.hospitalid;
      this.MK.Request(
        "/Publics/CouponManage/CouponDetail",
        "get",
        this.CouponDetailFrom
      ).then(res => {
        if (res.code == 0) {
          this.detailtableData = res.data;
          this.CouponDetailFrom.count = res.count;
        }
      });
    },
    //查询
    getDataRange(value) {
      if (!value) {
        this.pager.Bdate = "";
        this.pager.Edate = "";
      } else {
        this.pager.Bdate = value[0];
        this.pager.Edate = value[1];
      }
      this.CouponList_Get();
    },
    changeTableSort(column) {
      if (column.order) {
        this.pager.orderby =
          column.prop + " " + column.order.replace(/ending/g, "");
      } else {
        this.pager.orderby = "";
      }
      this.CouponList_Get();
    },
    changeTableDetailSort(column) {
      console.log(column);
      if (column.order) {
        this.pager.orderby =
          column.prop + " " + column.order.replace(/ending/g, "");
      } else {
        this.pager.orderby = "";
      }
      this.CouponDetail();
    },

    CouponList_Get() {
      this.MK.Request("/Publics/CouponManage/Coupon", "get", this.pager).then(
        res => {
          if (res.code == 0) {
            this.tableData = res.data;
            if (res.data.length == 0) {
              this.pager.count = 0;
            } else {
              this.pager.count = res.data[0].__RowCount;
            }
          }
        }
      );
    }
  }
};
</script>

<style scoped>
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
  /* padding-bottom: 55px; */
  overflow-y: auto;
}
</style>
