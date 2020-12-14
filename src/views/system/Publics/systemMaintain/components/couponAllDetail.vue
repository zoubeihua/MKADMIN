<template>
<el-container>
    <el-header>
      <el-form :inline="true" class="headerFrom">
        <!-- <el-form-item>
          <mk-select
            v-model="pages.DateTag"
            url="1"
            :globalFn="true"
            :datas="[
              { bzname: '生效时间', bzcode: '0' },
              { bzname: '失效时间', bzcode: '1' },
               { bzname: '使用时间', bzcode: '2' }
            ]"
            :filter="['bzname', 'bzname']"
            width="160px"
            label="bzname"
            val="bzcode"
            placeholder="请选择优惠券类型"
            @change="CouponDetail"
            :clearable="false"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="pages.dataRange"
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
        </el-form-item> -->
        <el-form-item>
          <mk-select
            style="width:185px;"
            v-model="pages.arrstatus"
            @change="CouponDetail"
            placeholder="选择状态"
            multiple
            collapse-tags
            :datas="arrList"
            :filter="['bzname', 'filterstr']"
            label="bzname"
            val="bzcode"
          ></mk-select>
        </el-form-item>
         <el-form-item>
           <mk-select
            style="width:185px;"
            v-model="pages.coupontype"
            url="1"
            :globalFn="true"
            :param="{ codetype: '优惠券类型' }"
            :filter="['bzname', 'filterstr']"
            label="bzname"
            val="bzcode"
            placeholder="请选择优惠券类型"
            @change="CouponDetail"
            :clearable="true"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <mk-select
            style="width:185px;"
            v-model="pages.status"
            url="1"
            multiple
            collapse-tags
            :globalFn="true"
            :param="{ codetype: '优惠券状态' }"
            :filter="['bzname', 'filterstr']"
            label="bzname"
            val="bzcode"
            placeholder="请选择优惠券状态"
            @change="CouponDetail"
            :clearable="true"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="pages.condition"
            style="width:260px"
            @keyup.enter.native="CouponDetail"
            placeholder="按优惠券名称查询"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" @click="CouponDetail">查询</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main style="padding:0;">
      <el-table :data="tableData" border highlight-current-row height="100%"  @sort-change="changeTableSort" >
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
          label="优惠券ID"
          prop="couponid"
          width="110"
          sortable
        />

        <el-table-column
          label="优惠券名称"
          prop="couponname"
          min-width="110"
           sortable
        >
        </el-table-column>
        <el-table-column label="优惠券状态" prop="c_status" width="90">
          <template slot-scope="scope">
            <el-tag
              :type="GetCouponDisplay(scope.row.c_status)"
              disable-transitions
              >{{ scope.row.cstatusdisplay }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="id"
          prop="coupodetailid"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          align="center"
          label="状态"
          width="80"
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
        ></el-table-column>
        <el-table-column
          label="领用时间"
          prop="taketime"
          align="center"
          width="120"
           sortable
        ></el-table-column>
        <el-table-column
          label="生效时间"
          prop="ceffectivedate"
          align="center"
           sortable
          width="120"
        ></el-table-column>
        <el-table-column
          label="到期时间"
          prop="cexpirationdate"
          align="center"
          width="120"
           sortable
        ></el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <mk-page :pager="pages" @query="CouponDetail" />
    </el-footer>
</el-container>
</template>
<script>
import { activate } from "../../../../../../public/lib/UEditor/third-party/zeroclipboard/ZeroClipboard";
export default {
  props: {},
  data() {
    return {
      //0 未领用 1 待使用 2 已使用 3 已过期 4 已取消
      arrList: [
        {
          bzcode: "0",
          bzname: "未领用"
        },
        {
          bzcode: "1",
          bzname: "待使用"
        },
        {
          bzcode: "2",
          bzname: "已使用"
        },
        {
          bzcode: "3",
          bzname: "已过期"
        },
        {
          bzcode: "4",
          bzname: "已取消"
        }
      ],
      tableData: [],
      pages: {
        arrstatus: [],
        status: [],
        couponid: "",
        condition: "",
        page: 0,
        rows: 20,
        tag: 0,
        hospitalid: "",
        orderby: "",
        count: 0,
        dataRange:"",
        DateTag:"",
        bdate: "",
        edate: "",
        coupontype:"",
      },
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
    this.CouponDetail();
  },
  methods: {
    changeTableSort(column) {
      if (column.order) {
        this.pages.orderby =
          column.prop + " " + column.order.replace(/ending/g, "");
      } else {
        this.pages.orderby = "";
      }
      this.CouponDetail();
    },
     getDataRange(value) {
      if (!value) {
        this.pages.bdate = "";
        this.pages.edate = "";
      } else {
        this.pages.bdate = value[0];
        this.pages.edate = value[1];
      }
      this.CouponDetail();
    },
    CouponDetail() {
      this.pages.hospitalid = this.info.hospitalid;
      this.MK.Request(
        "/Publics/CouponManage/CouponDetail",
        "get",
        this.pages
      ).then(res => {
        if (res.code == 0) {
          this.tableData = res.data;
          this.pages.count = res.count;
        }
      });
    }
  }
};
</script>
