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
            <el-button
              type="success"
              icon="el-icon-circle-plus-outline"
              @click="showModel()"
              >添加优惠券</el-button
            >
            <!-- <el-button type="warning" @click="showAllDetail"
              >查看优惠券明细</el-button
            > -->
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>
    <el-table
      :data="tableData"
      border
      highlight-current-row
      stripe
      style="width:100%"
      height="100%"
      ref="tableM"
      @sort-change="changeTableSort"
    >
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="优惠券ID"
        prop="couponid"
        width="110"
        sortable
      />
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
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="券面额"
        prop="discountamount"
        sortable
        width="95"
        :formatter="i => projectAmountsTabel(i, 'discountamount')"
      />
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="满减额"
        prop="reduceamount"
        width="95"
        sortable
        :formatter="i => projectAmountsTabel(i, 'reduceamount')"
      />
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="折扣比例(%)"
        prop="discountratio"
        width="130"
        sortable
      />
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="发放总量"
        prop="totalquantity"
        width="160"
        sortable
      />
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="生效日期"
        prop="effectivedate"
        width="140"
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
        label="允许分享"
        prop="allowshare"
        width="110"
        sortable
      >
        <template slot-scope="scope">
          {{ scope.row.allowshare == 0 ? "否" : "是" }}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="制定人"
        prop="createname"
        width="120"
        sortable
      />
      <el-table-column
        align="center"
        label="状态"
        width="95"
        fixed="right"
        sortable
      >
        <template slot-scope="scope">
          <el-tag
            :type="GetCouponDisplay(scope.row.status)"
            disable-transitions
            >{{ scope.row.statusdisplay }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" width="200px">
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
              type="info"
              @click="showModel(scope.row)"
            >
              <i class="mkfont bianji1"></i>
            </el-link>
            <el-link
              title="维护明细"
              :underline="false"
              type="warning"
              @click="showMatchModel(scope.row)"
            >
              <i class="mkfont guanlian"></i>
            </el-link>
            <el-link
              title="明细查询"
              :underline="false"
              type="primary"
              @click="showDetailModel(scope.row)"
            >
              <i class="mkfont xiangmu1"></i>
            </el-link>

            <el-link
              icon="mkfont shangyi"
              title="上移"
              @click="
                MoveUp(
                  scope.$index,
                  scope.row,
                  tableData,
                  'couponid',
                  'orderno',
                  '',
                  '/Publics/Common/Dic/OrdrByMove'
                )
              "
              :underline="false"
              type="success"
            ></el-link>
            <el-link
              @click="
                MoveDow(
                  scope.$index,
                  scope.row,
                  tableData,
                  'couponid',
                  'orderno',
                  '',
                  '/Publics/Common/Dic/OrdrByMove'
                )
              "
              icon="mkfont xiayi"
              title="下移"
              :underline="false"
              type="danger"
            ></el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <mk-page :pager="pager" @query="CouponList_Get" />
    </template>
    <el-drawer
      :visible.sync="isModal"
      direction="rtl"
      size="100%"
      ref="isModal"
    >
      <div slot="title">
        <span>
          {{ operatetype == "C" ? "新增优惠券" : "编辑优惠券" }}
        </span>
      </div>
      <couponMaintain ref="couponMaintains" v-if="isModal" />
      <div class="lq_drawer__footer">
        <el-button-group>
          <el-button
            :type="getType(item.operate)"
            @click="CouponMaintain_Post(item.operate)"
            v-for="(item, index) in statusdefine"
            :key="index"
            v-if="item.sourcestatus == rowData.status"
            >{{ item.operate }}</el-button
          >
          <el-button
            type="primary"
            @click="CouponMaintain_Post('保存')"
            v-if="operatetype == 'C'"
            >暂存</el-button
          >
          <el-button @click="close">关闭</el-button>
        </el-button-group>
      </div>

      <!-- </vxe-modal> -->
    </el-drawer>
    <el-drawer
      :visible.sync="isMatchModal"
      direction="rtl"
      size="100%"
      ref="isMatchModal"
      :with-header="true"
    >
      <div slot="title">
        <span>
          {{ "适应维护" + "--" + rowData.couponname }}
        </span>
      </div>
      <couponMatch ref="couponMatch" v-if="isMatchModal" :row="rowData" />
      <div class="lq_drawer__footer">
        <el-button-group>
          <el-button @click="matchClose">关闭</el-button>
        </el-button-group>
      </div>
    </el-drawer>
    <el-drawer
    :visible.sync="isDetailModel"
      direction="rtl"
      size="100%"
      ref="isDetailModel"
    >
    <div slot="title">
        <span>
          {{ "明细查询" + "--" + rowData.couponname }}
        </span>
      </div>
      <couponDetail ref="couponMatch" v-if="isDetailModel" :row="rowData" />
      <div class="lq_drawer__footer">
        <el-button-group>
          <el-button @click="closeDetailModel">关闭</el-button>
        </el-button-group>
      </div>
    </el-drawer>
    <el-drawer
      :visible.sync="isAllDetail"
      direction="rtl"
      size="100%"
      ref="isAllDetail"
    >
      <div slot="title">
        <span>
          明细查询
        </span>
      </div>
      <couponAllDetail ref="couponMatch" v-if="isAllDetail" />
      <div class="lq_drawer__footer">
        <el-button-group>
          <el-button @click="closeAllDetail">关闭</el-button>
        </el-button-group>
      </div>
    </el-drawer>
  </d2-container>
</template>
<script>
import couponDetail from "./components/couponDetail";
import couponMaintain from "./components/couponMaintain";
import couponMatch from "./components/couponMatch";
import couponAllDetail from "./components/couponAllDetail";
export default {
  name: "couponInfoMaintain",
  components: { couponMaintain, couponMatch, couponDetail, couponAllDetail },
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
      isMatchModal: false,
      isDetailModel: false,
      isAllDetail: false,
      isModal: false,
      tableData: [],
      rowData: [],
      statusdefine: [],
      operatetype: "C",
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
      }
    };
  },
  created() {
    // //Publics/CouponManage/Coupon
    this.CouponList_Get();
  },
  methods: {
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
    //上移
    MoveUp(index, row, list, id, orderno, handler, url) {
      if (index == 0) {
        this.$message({
          type: "error",
          message: "当前为第一行,不能上移!"
        });
        return;
      }
      var PreRow = list[index - 1];
      this.MoveUpAndDown(row, PreRow, id, orderno, handler, url);
    },
    //下移
    MoveDow(index, row, list, id, orderno, handler, url) {
      if (index + 1 == list.length) {
        this.$message({
          type: "error",
          message: "当前为最后一行,不能下移!"
        });
        return;
      }
      var NextRow = list[index + 1];
      this.MoveUpAndDown(row, NextRow, id, orderno, handler, url);
    },
    MoveUpAndDown(Currentrow, NextRow, id, orderno, handler, url) {
      let opt = {};
      opt["currentid"] = Currentrow[id];
      opt["current" + orderno] = Currentrow[orderno];
      opt["nextid"] = NextRow[id];
      opt["next" + orderno] = NextRow[orderno];
      opt.type = "couponinfo";
      console.log(opt);
      if (opt.currentorderno == opt.nextorderno) {
        opt["next" + orderno] = NextRow[orderno] + 1;
      }
      this.MK.Request(url, "post", opt).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.CouponList_Get();
        }
      });
    },

    //可以有的操作:暂存,删除,保存,提交,撤销,审核,反审核,上架,下架
    getType(text) {
      let data = [
        {
          text: "暂存",
          type: "warning"
        },
        { text: "删除", type: "danger" },
        {
          text: "保存",
          type: "primary"
        },
        {
          text: "提交",
          type: "primary"
        },
        {
          text: "撤销",
          type: "danger"
        },
        {
          text: "审核",
          type: "success"
        },
        {
          text: "反审核",
          type: "info"
        },
        {
          text: "上架",
          type: "success"
        },
        {
          text: "下架",
          type: "warning"
        }
      ];
      for (let index = 0; index < data.length; index++) {
        if (data[index].text == text) {
          return data[index].type;
        }
      }
      return "primary";
    },
    CouponList_Get() {
      this.MK.Request("/Publics/CouponManage/Coupon", "get", this.pager).then(
        res => {
          if (res.code == 0) {
            this.tableData = res.data;
            this.statusdefine = res.statusdefine;
            if (res.data.length == 0) {
              this.pager.count = 0;
            } else {
              this.pager.count = res.data[0].__RowCount;
            }
          }
        }
      );
    },
    closeAllDetail() {
      this.isAllDetail = false;
    },
    showAllDetail() {
      this.isAllDetail = true;
    },
    matchClose() {
      this.isMatchModal = false;
    },
    close() {
      this.$refs.couponMaintains.fromData = {
        operatetype: "C",
        couponid: -1,
        allowshare: 0,
        couponname: "",
        coupontype: "0",
        discountamount: 0,
        effectivedate: "",
        enterid: "",
        expirationdate: "",
        note: "",
        orderno: 0,
        reduceamount: 0,
        status: 0,
        totalquantity: 0,
        discountratio: 0
      };
      this.isModal = false;
      this.operatetype = "C";
    },
    showModel(row) {
      this.isModal = true;

      this.$nextTick(() => {
        if (!!row) {
          row.coupontype += "";
          this.$refs.couponMaintains.fromData = { ...row };
          this.rowData = { ...row };
          this.operatetype = "U";
        } else {
          this.$refs.couponMaintains.fromData = {
            operatetype: "C",
            couponid: -1,
            allowshare: 0,
            couponname: "",
            coupontype: "1",
            discountamount: 0.0,
            effectivedate: "",
            enterid: "",
            expirationdate: "",
            note: "",
            orderno: 0,
            reduceamount: 0.0,
            status: 0,
            totalquantity: 0,
            img: [],
            CouponMatch: [],
            discountratio: 0
          };
          this.operatetype = "C";
          this.rowData = [];
        }
      });
    },
    showDetailModel(row) {
      this.rowData = { ...row };
      this.isDetailModel = true;
    },
    closeDetailModel() {
      this.isDetailModel = false;
    },
    showMatchModel(row) {
      this.isMatchModal = true;
      this.rowData = { ...row };
      setTimeout(() => {
        console.log(this.$refs.couponMatch);
        this.$refs.couponMatch.getCouponMatch(row);
      }, 20);
    },
    CouponMaintain_Post(operatetype) {
      this.$refs.couponMaintains.$refs["fromData"].validate(valid => {
        if (valid) {
          let data = this.$refs.couponMaintains.fromData;
          this.sucess_post(operatetype);
        } else {
          return false;
        }
      });
    },
    sucess_post(operatetype) {
      let data = this.$refs.couponMaintains.fromData;
      if (data.couponid == -1) {
        data.enterid = this.info.userid;
      }
      data.operatetype = operatetype;
      this.MK.Request("/Publics/CouponManage/Coupon", "post", data).then(
        res => {
          if (res.code == 0) {
            this.close();
            this.CouponList_Get();
          }
        }
      );
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 表格列头样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.labelClassName == "ChangeColor") {
        return "color:#1296db";
      } else {
        return "";
      }
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
>>>.el-drawer__body {
  padding-bottom: 55px;
}
</style>
