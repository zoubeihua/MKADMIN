<template>
  <d2-container>
    <SplitPane :min-percent="20" :default-percent="40" split="vertical">
      <template slot="paneL">
        <el-container>
          <el-header>
            <el-form :inline="true">
              <el-form-item>
                <el-input
                  style="width:360px;"
                  @keyup.enter.native="query"
                  v-model="pager.condition"
                  placeholder="按企业名称（首拼）查找"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                </el-button-group>
              </el-form-item>
            </el-form>
          </el-header>
          <el-main style="padding: 0;">
            <el-table :data="dataTable" stripe border highlight-current-row height="100%">
              <el-table-column label="企业名称" show-overflow-tooltip prop="deptid"></el-table-column>
              <el-table-column label="企业类型" show-overflow-tooltip prop="deptid"></el-table-column>
              <el-table-column label="国籍" show-overflow-tooltip prop="deptid"></el-table-column>
              <el-table-column label="负责人姓名" show-overflow-tooltip prop="deptid"></el-table-column>
              <el-table-column label="负责人电话" show-overflow-tooltip prop="deptid"></el-table-column>
              <el-table-column label="通讯地址" show-overflow-tooltip prop="deptid"></el-table-column>
              <el-table-column label="状态" show-overflow-tooltip prop="deptid"></el-table-column>
              <el-table-column label="客服经理" show-overflow-tooltip prop="deptid"></el-table-column>
            </el-table>
          </el-main>
          	<el-footer>
						 <mk-page :pager="pager" @query="query" />
					</el-footer>
        </el-container>
      </template>
      <template slot="paneR">
        <el-container>
          <el-header>
            <el-form :inline="true">
              <el-form-item>
                <el-input
                  style="width:360px;"
                  @keyup.enter.native="query"
                  v-model="pager.condition"
                  placeholder="按员工姓名（首拼）、联系电话查询"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                  <!-- <el-button type="primary" icon="el-icon-upload2" @click="Import" >导入</el-button>
                  <el-button type="primary" icon="el-icon-download" @click="Export">导出</el-button>-->
                </el-button-group>
              </el-form-item>
            </el-form>
          </el-header>
          <el-main style="padding: 0;">
            <el-table :data="dataTable" stripe border highlight-current-row height="100%">
              <el-table-column label="部门" show-overflow-tooltip prop="deptid"></el-table-column>
              <el-table-column label="工号" show-overflow-tooltip prop="deptid"></el-table-column>
              <el-table-column label="姓名" show-overflow-tooltip prop="deptid"></el-table-column>
              <el-table-column label="性别" show-overflow-tooltip prop="deptid"></el-table-column>
              <el-table-column label="身份证号" show-overflow-tooltip prop="deptid"></el-table-column>
              <el-table-column label="出生日期" show-overflow-tooltip prop="deptid"></el-table-column>
              <el-table-column label="年龄" show-overflow-tooltip prop="deptid"></el-table-column>
              <el-table-column label="联系电话" show-overflow-tooltip prop="deptid"></el-table-column>
              <el-table-column label="职务" show-overflow-tooltip prop="deptid"></el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <mk-page :pager="pager" @query="query" />
          </el-footer>
        </el-container>
      </template>
    </SplitPane>
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
      importVisible: false,
      dataTable: [],
      pager: {
        condition: "",
        count: 0,
        page: 1,
        rows: 20
      }
    };
  },
  methods: {
    query() {},
    Import() {
      this.importVisible = true;
    },
    Export() {}
  }
};
</script>

<style>
</style>
