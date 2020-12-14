<template>
  <d2-container>
    <!-- 头部 -->
    <template slot="header">
      <el-form :inline="true">
        <el-form-item>
          <el-input
            v-model="pager.condition"
            placeholder="按院区名称查找"
            @keyup.enter.native="HospitalInfo"
          />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="HospitalInfo"
              >查询</el-button
            >
          </el-button-group>
        </el-form-item>
      </el-form>
      <el-button-group class="headerR">
        <el-button
          type="success"
          icon="el-icon-circle-plus-outline"
          @click="showModel('C',operateData)"
          >添加院区</el-button
        >
      </el-button-group>
    </template>
    <el-table
      :data="tableData"
      border
      style="width:100%"
      height="100%"
      stripe
      :highlight-current-row="true"
      ref="tableM"
    >
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="院区ID"
        prop="hospitalid"
      />
     
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="院区名称"
        prop="hospitalname"
      />
       <el-table-column
        show-overflow-tooltip
        align="center"
        label="院区简称"
        prop="shortname"
      />
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="状态"
        width="80"
      >
        <template slot-scope="scope">
          <el-tag
            :type="GetOpenAndStoptatusType(scope.row.status)"
            disable-transitions
            >{{ getStatusText(scope.row.status) }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        fixed="right"
        width="200px"
      >
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
              type="warning"
              @click="showModel('U', scope.row)"
             
            >
              <i class="mkfont bianji1"></i>
            </el-link>
						<el-link
              title="介绍"
              :underline="false"
              type="primary"
              @click="handleIntro(scope.row)"
             
            >
              <i class="mkfont xiangmu"></i>
            </el-link>
            <!-- <el-link
              title="停用"
              :underline="false"
              type="primary"
              @click="handleActivityEdit('0', scope.row)"
              v-if="scope.row.status !== 99 && scope.row.status == 1"
            >
              <i class="mkfont tingyong_line"></i>
            </el-link>
            <el-link
              title="启用"
              :underline="false"
              type="primary"
              @click="handleActivityEdit('1', scope.row)"
              v-if="scope.row.status !== 99 && scope.row.status == 0"
            >
              <i class="mkfont qiyong"></i>
            </el-link> -->
            <!-- <el-link
              title="删除"
              :underline="false"
              type="primary"
              @click="handleActivityEdit('99', scope.row)"
              v-if="scope.row.status == 99 ? false : true"
            >
              <i class="mkfont trasch"></i>
            </el-link> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <mk-page :pager="pager" @query="HospitalInfo" />
    </template>
    <!-- liqian高度auto -->
    <vxe-modal
      v-model="isModal"
      ref="isModal"
      :showFooter="true"
      width="1080"
      height="auto"
      @close="close"
      :title="operateData.operatetype=='C'?'新增院区':'编辑院区'"
    >
      <el-form
        :model="operateData"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
      >
        <el-form-item label="院区名称" prop="hospitalname">
          <el-input
            v-model="operateData.hospitalname"
            placeholder="请输入院区名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="输入码" prop="filterstr">
          <el-input
            v-model="operateData.filterstr"
            placeholder="请输入输入码"
          ></el-input>
        </el-form-item>
        <el-form-item label="院区id" prop="hospitalid">
          <el-input
            :disabled="operatetype == 'U'"
            v-model="operateData.hospitalid"
            placeholder="请输入院区id"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="院区简称" prop="shortname">
          <el-input
            v-model="operateData.shortname"
            placeholder="请输入院区简称"
          ></el-input>
        </el-form-item>
        <el-form-item label="院区代码" prop="hospitalcode">
          <el-input
            v-model="operateData.hospitalcode"
            placeholder="请输入院区代码"
          ></el-input>
        </el-form-item>
        <el-form-item label="医保帐户" prop="ybaccount">
          <el-input
            v-model="operateData.ybaccount"
            placeholder="请输入医保帐户"
          ></el-input>
        </el-form-item>
        <el-form-item label="主院区" prop="mainhospital">
          <el-radio-group v-model="operateData.mainhospital">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
           
          </el-radio-group>
           <span class="item-tip"><span>*</span> 选择"是",则其他院区自动变为否</span>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="operateData.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="primary" @click="checkieFrom">保存</el-button>
          <el-button @click="close">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
		<!-- 介绍 -->
		<mkIntro ref="intro" :introData.sync="introInfo" />
  </d2-container>
</template>

<script>
import util from "@/libs/util.js";
import dayjs from "dayjs";
export default {
  name: "couponInfoMaintain",
  data() {
    return {
			introInfo: {},
      operatetype: "C",
      operateData: {
        operatetype: "C",
        hospitalid: 0,
        createid: 0,
        createtime: "",
        filterstr: "",
        hospitalcode: "",
        hospitalname: "",
        mainhospital: "0",
        orgcode: "",
        shortname: "",
        status: 1,
        updatetime: "",
        ybaccount: ""
      },
      rules: {
        hospitalname: [
          { required: true, message: "请输入院区名称", trigger: "blur" }
        ],
        filterstr: [
          { required: true, message: "请输入输入码", trigger: "blur" }
        ],
        hospitalid: [
          { required: true, message: "请输入院区id", trigger: "blur" }
        ],
        hospitalcode: [
          { required: true, message: "请输入院区code", trigger: "blur" }
        ],
        ybaccount: [
          { required: true, message: "请输入医保帐户", trigger: "blur" }
        ],
        mainhospital: [
          { required: true, message: "请输入主院区", trigger: "blur" }
        ]
      },
      pager: {
        count: 0,
        page: 1,
        rows: 20,
        condition: "",
        hospitalid: "",
        orderby: ""
      },
      isModal: false,
      tableData: [{}],
      rowData: []
    };
  },
  watch: {
    "operateData.hospitalname"(val) {
      this.operateData.filterstr = util.py.firstChar(val);
    }
  },
  created() {
    this.HospitalInfo();
  },
  methods: {
		// 介绍
		handleIntro(row) {
			console.log(row)
			this.introInfo.category = '院区';
			this.introInfo.name = row.hospitalname;
			this.introInfo.introid = row.hospitalid;
			this.$refs.intro.open();
			this.$refs.intro.introInfo_Get();
		},
    HospitalInfo() {
      this.MK.Request(
        "/Publics/Common/Dic/HospitalInfo",
        "get",
        this.pager
      ).then(res => {
        if (res.code == 0) {
          this.tableData = res.data;
          this.pager.count = res.count;
        }
      });
    },
    checkieFrom() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.HospitalInfo_Post();
        } else {
          return false;
        }
      });
    },
    HospitalInfo_Post() {
      this.operateData.createtime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      this.operateDatacreateid = this.info.userid;
      this.MK.Request(
        "/Publics/Common/Dic/HospitalInfo",
        "post",
        this.operateData
      ).then(res => {
        if (res.code == 0) {
          this.close();
          this.HospitalInfo();
        }
      });
    },
    handleActivityEdit(status, row) {
      row.operatetype = "U";
      row.status = status;
      this.MK.Request("/Publics/Common/Dic/HospitalInfo", "post", row).then(
        res => {
          if (res.code == 0) {
            this.close();
            this.HospitalInfo();
          }
        }
      );
    },
    close() {
      this.isModal = false;
      this.operateData = {
        operatetype: "C",
        hospitalid: 0,
        createid: 0,
        createtime: "",
        filterstr: "",
        hospitalcode: "",
        hospitalname: "",
        mainhospital: "0",
        orgcode: "",
        shortname: "",
        status: 1,
        updatetime: "",
        ybaccount: ""
      };
    },
    showModel(operatetype, row) {
      this.operateData = row;
      this.operatetype = operatetype;
      this.operateData.operatetype = operatetype;
      this.isModal = true;
    },
    getStatusText(status) {
      if (status == 0) {
        return "停用";
      } else if (status == 1) {
        return "启用";
      } else if (status == 99) {
        return "删除";
      }
    }
  }
};
</script>

<style scoped>
.item-tip{
  padding-left:20px;
  font-size:12px;
  color:#f85a5a;
}

</style>
