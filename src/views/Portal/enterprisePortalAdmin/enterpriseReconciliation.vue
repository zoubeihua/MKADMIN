<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true">
        <el-form-item>
          <el-input
            style="width:300px;"
            @keyup.enter.native="query"
            v-model="pager.condition"
            placeholder="按企业名称（首拼）查找"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            style="width:300px;"
            @keyup.enter.native="query"
            v-model="pager.condition"
            placeholder="请选择账单状态"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="info" icon="el-icon-search" @click="query">导出</el-button>
            <el-button type="success" icon="el-icon-search" @click="showBillsModel">生成账单</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="dataTable" stripe border highlight-current-row height="100%">
      <el-table-column label="账单日期" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="合同编号" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="账单内容" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="开票日期" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="发票号码" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="发票内容" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="支付状态" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="总人数" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="男性人数" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="女性人数" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="套餐金额" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="加项金额" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column label="总金额" sortable show-overflow-tooltip prop="deptid"></el-table-column>
      <el-table-column
        label="操作"
        sortable
        show-overflow-tooltip
        prop="deptid"
        width="250px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="mini">生成</el-button>
            <el-button type="info" size="mini">查看</el-button>
            <el-button type="success" size="mini">发送</el-button>
            <el-button type="warning" size="mini">核销</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <mk-page :pager="pager" @query="query" />
    </template>
    <vxe-modal
      v-model="dialogVisible"
      ref="effectModal"
      title="部门维护"
      @close="handleClose"
      :showFooter="true"
      width="99vw"
      height="99vh"
    >
      <el-form :model="form" :rules="rules" label-width="120px" ref="ruleForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="企业名称" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="识别号" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业类型" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所在国籍" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="注册地址" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="通讯地址" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="银行帐户" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开户银行" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="负责人姓名" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="负责人电话" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider></el-divider>
          <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="账单标题" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="账单内容" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票抬头" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="识别号" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总人数" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="男性人数" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="女性人数" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
         <el-col :span="8">
            <el-form-item label="套餐A人数" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="金额" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="套餐B人数" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="金额" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
            <el-col :span="8">
            <el-form-item label="套餐B人数" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="金额" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <!--  -->
            <el-col :span="24">
            <el-form-item label="加项金额" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合计金额" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="大写" prop="crfname">
              <el-input autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
    <!-- 导入弹窗 -->
    <vxe-modal v-model="importVisible" destroy-on-close title width="600" height="500"></vxe-modal>
  </d2-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      dataTable: [
        {
          dipid: 1
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
    showBillsModel() {
      this.dialogVisible = true;
    }
  }
};
</script>

<style>
</style>
