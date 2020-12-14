<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true">
        <el-form-item>
          <el-input
            style="width:300px;"
            @keyup.enter.native="query"
            v-model="pager.condition"
            placeholder="按企业名称查找"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            style="width:300px;"
            @keyup.enter.native="query"
            v-model="pager.condition"
            placeholder="按合同编号查找"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            style="width:300px;"
            @keyup.enter.native="query"
            v-model="pager.condition"
            placeholder="选择日期范围"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-input
            style="width:300px;"
            @keyup.enter.native="query"
            v-model="pager.condition"
            placeholder="选择体检套餐"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="dataTable" stripe border highlight-current-row height="100%">
      <el-table-column label="日期" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="总人数" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="企业名称" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="合同编号" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="企业总人数" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="男性" sortable show-overflow-tooltip prop="deptid">
        <template slot-scope="scope">
           <el-link type="primary" @click="showSeeModel">{{scope.row.deptid}}</el-link>
        </template>
      </el-table-column>
     <el-table-column label="未婚女" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="已婚女" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="预约套餐A" sortable show-overflow-tooltip prop="deptid"></el-table-column>
       <el-table-column label="预约套餐B" sortable show-overflow-tooltip prop="deptid"></el-table-column>
        <el-table-column label="预约套餐C" sortable show-overflow-tooltip prop="deptid"></el-table-column>
    </el-table>
    <template slot="footer">
      <mk-page :pager="pager" @query="query" />
    </template>
    <vxe-modal
      v-model="dialogVisible"
      ref="effectModal"
      title="预约情况"
      @close="handleClose"
      :showFooter="true"
      width="99vw"
      height="99vh"
    >
      <el-table :data="dataTable" stripe border highlight-current-row height="100%">
      <el-table-column label="合同编号" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="企业名称" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="合同人数" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="到检人数" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="部门" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="工号" sortable show-overflow-tooltip prop="deptid">
      </el-table-column>
     <el-table-column label="姓名" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="性别" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="身份证号" sortable show-overflow-tooltip prop="deptid"></el-table-column>
       <el-table-column label="出生日期" sortable show-overflow-tooltip prop="deptid"></el-table-column>
        <el-table-column label="年龄" sortable show-overflow-tooltip prop="deptid"></el-table-column>
        <el-table-column label="联系电话" sortable show-overflow-tooltip prop="deptid"></el-table-column>
        <el-table-column label="职务" sortable show-overflow-tooltip prop="deptid"></el-table-column>
        <el-table-column label="体检套餐" sortable show-overflow-tooltip prop="deptid"></el-table-column>
        <el-table-column label="预约日期" sortable show-overflow-tooltip prop="deptid"></el-table-column>
    </el-table>
      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
    <!-- 导入弹窗 -->
    <vxe-modal v-model="importVisible" destroy-on-close title="企业人员导入" width="600" height="500">
      <import-data @close="e => { importVisible = e}"></import-data>
    </vxe-modal>
  </d2-container>
</template>

<script>
import importData from "../components/importData.vue";
export default {
  components: {
    importData
  },
  data() {
    return {
      dataTable: [
        {
          deptid:22
        }
      ],
      pager: {
        condition: "",
        count: 0,
        page: 1,
        rows: 20
      },
      form: {},
      rules: {},
      dialogVisible: false,
      importVisible: false
    };
  },
  methods: {
    query() {},
    Import() {
      this.importVisible = true;
    },
    Export() {},
    handleClose() {},
    showSeeModel() {
      this.dialogVisible = true;
    }
  }
};
</script>

<style>
</style>
