<template>
  <d2-container>
    <!-- 头部 -->
    <template slot="header">
      <el-form :inline="true">
        <el-form-item>
          <el-input
            v-model="pager.condition"
            placeholder="按应用名称查找"
            @keyup.enter.native="Appinfo"
          />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="Appinfo"
              >查询</el-button
            >
          </el-button-group>
        </el-form-item>
      </el-form>
      <el-button-group class="headerR">
        <el-button
          type="success"
          icon="el-icon-circle-plus-outline"
          @click="showModel('C', operateData)"
          >添加应用</el-button
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
        label="排序号"
        prop="orderno"
      />
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="应用ID"
        prop="appid"
      />

      <el-table-column
        show-overflow-tooltip
        align="center"
        label="应用名称"
        prop="appname"
      />
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="应用描述"
        prop="appnote"
      />
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="应用图标"
        prop="appicon"
      >
        <template slot-scope="scope">
          <i class="fa" :class="'fa-' + scope.row.appicon"></i>
        </template>
      </el-table-column>

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
        show-overflow-tooltip
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
            <!-- <el-link
              title="停用"
              :underline="false"
              type="danger"
              @click="handleActivityEdit('0', scope.row)"
              v-if="scope.row.status == 1"
            >
              <i class="mkfont tingyong_line"></i>
            </el-link>
            <el-link
              title="启用"
              :underline="false"
              type="primary"
              @click="handleActivityEdit('1', scope.row)"
              v-if="scope.row.status == 0"
            >
              <i class="mkfont qiyong"></i>
            </el-link> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <mk-page :pager="pager" @query="Appinfo" />
    </template>
     <!-- liqian-高度auto -->
    <vxe-modal
      v-model="isModal"
      ref="isModal"
      :showFooter="true"
      width="540"
      height="auto"
      @close="close"
    >
    <template slot="header">
        <i>{{operateData.operatetype=="C"?"新增应用":"编辑应用"}}</i>
    </template>
      <el-form
        :model="operateData"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
      >
        <el-form-item label="应用名称" prop="appname">
          <el-input
            v-model="operateData.appname"
            placeholder="请输入应用名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="输入码" prop="filterstr">
          <el-input
            v-model="operateData.filterstr"
            placeholder="请输入输入码"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序号" prop="orderno">
          <el-input
            clearable
            type="number"
            @keyup.native="proving1"
            v-model.numbe="operateData.orderno"
            placeholder="请输入排序号"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="应用备注">
          <el-input
            v-model="operateData.appnote"
            placeholder="请输入应用备注"
          ></el-input>
        </el-form-item>
        <el-form-item label="应用图标" prop="appicon">
          <d2-icon-select v-model="operateData.appicon" :user-input="true" />
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
          <el-button type="primary" @click="checkieFrom"  >保存</el-button>
          <el-button @click="close">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
  </d2-container>
</template>

<script>
import util from "@/libs/util.js";
import dayjs from "dayjs";
export default {
  name: "couponInfoMaintain",
  data() {
    return {
      operatetype: "C",
      operateData: {
        operatetype: "C",
        appid: "",
        appicon: "",
        appname: "",
        appnote: "",
        filterstr: "",
        orderno: 0,
        status: 1
      },
      rules: {
        appname: [
          { required: true, message: "请输入应用名称", trigger: "blur" }
        ],
        filterstr: [
          { required: true, message: "请输入输入码", trigger: "blur" }
        ],
        orderno: [
          {
            required: true,
            message: "请输入排序号"
          }
        ],
        appnote: [
          { required: true, message: "请输入应用备注", trigger: "blur" }
        ],
        appicon: [
          { required: true, message: "请输入应用图标", trigger: "blur" }
        ]
      },
      pager: {
        count: 0,
        page: 1,
        rows: 20,
        condition: "",
        appid: "",
        orderby: ""
      },
      isModal: false,
      tableData: [{}],
      rowData: []
    };
  },
  watch: {
    "operateData.appname"(val) {
      this.operateData.filterstr = util.py.firstChar(val);
    }
  },
  created() {
    this.Appinfo();
  },
  directives: {
   positiveInt: {
     bind: function(el) {
       el.handler = function() {
           
         el.value = Number(el.value.replace(/\D+/, ''))
       }
       el.addEventListener('input', el.handler)
     },
     unbind: function(el) {
       el.removeEventListener('input', el.handler)
     }
   }
 },
  methods: {
       proving1(){
        this.operateData.orderno=this.operateData.orderno.replace(/[^\.\d]/g,'');
        this.operateData.orderno=this.operateData.orderno.replace('.','');
      },
    Appinfo() {
      this.MK.Request("/Publics/Common/Dic/Appinfo", "get", this.pager).then(
        res => {
          if (res.code == 0) {
            this.tableData = res.data;
            this.pager.count = res.count;
          }
        }
      );
    },
    checkieFrom() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.Appinfo_Post();
        } else {
          return false;
        }
      });
    },
    Appinfo_Post() {
      this.MK.Request(
        "/Publics/Common/Dic/Appinfo",
        "post",
        this.operateData
      ).then(res => {
        if (res.code == 0) {
          this.close();
          this.Appinfo();
        }
      });
    },
    handleActivityEdit(status, row) {
      row.operatetype = "U";
      row.status = status;
      this.MK.Request("/Publics/Common/Dic/Appinfo", "post", row).then(res => {
        if (res.code == 0) {
          this.close();
          this.Appinfo();
        }
      });
    },
    close() {
      this.isModal = false;
      this.operateData = {
        operatetype: "C",
        appid: "",
        appicon: "",
        appname: "",
        appnote: "",
        filterstr: "",
        orderno: 0,
        status: 1
      };
    },
    showModel(operatetype, row) {
      row.orderno=parseInt(row.orderno);
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

<style scoped></style>
