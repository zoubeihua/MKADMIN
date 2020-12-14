<template>
  <el-container>
    <el-header>
      <el-form :inline="true" class="headerFrom">
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
          <el-input
            v-model="pages.condition"
            style="width:260px"
            @keyup.enter.native="CouponDetail"
            placeholder="按工号、姓名、首拼查询"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" @click="CouponDetail">查询</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main style="padding:0;height:calc(100% - 120px)">
      <el-table :data="tableData" border highlight-current-row height="100%">
        <el-table-column label="id" prop="coupodetailid"></el-table-column>
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
        <el-table-column label="领用人" prop="membername" align="center" width="100"></el-table-column>
        <el-table-column label="领用时间" prop="taketime" align="center" width="120"></el-table-column>
        <el-table-column label="生效时间" prop="ceffectivedate" align="center" width="120"></el-table-column>
        <el-table-column label="到期时间" prop="cexpirationdate" align="center" width="120"></el-table-column>
       
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
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
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
        arrstatus: ["0"],
        couponid: "",
        condition: "",
        page: 0,
        rows: 20,
        tag: 0,
        hospitalid: "",
        orderby: "",
        count: 0
      }
    };
  },
  created() {
    this.CouponDetail();
  },
  methods: {
    CouponDetail() {
      this.pages.hospitalid = this.info.hospitalid;
      this.pages.couponid = this.row.couponid;
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
