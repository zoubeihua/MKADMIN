<template>
  <d2-container>
    <template slot="header">
      <div class="page-header">
        <div>
          <el-input
            style="width:320px;margin-right:20px;"
            v-model="pager.condition"
            placeholder="按项目负责人姓名 / 输入码查询"
          />
          <el-button type="primary" @click="refreshList">查询</el-button>
        </div>
        <div>
          <el-button-group style="margin-right:20px;">
            <el-button type="primary" @click="handleAdd">新建</el-button>
            <el-button type="success">引用</el-button>
            <el-button type="warning">修改</el-button>
            <el-button type="danger">停用</el-button>
            <el-button type="success">启用</el-button>
          </el-button-group>
        </div>
      </div>
    </template>
    <el-table :data="tableData" stripe>
      <el-table-column align="center" label="机构代码" prop />
      <el-table-column align="center" label="机构名称" prop />
      <el-table-column align="center" label="输入码" prop />
      <el-table-column align="center" label="类型" prop />
      <el-table-column align="center" label="国籍" prop />
      <el-table-column align="center" label="操作员" prop />
      <el-table-column align="center" label="操作时间" prop />
      <el-table-column align="center" label="状态"></el-table-column>
    </el-table>
    <template slot="footer">
      <mk-page :pager="pager" @query="refreshList" />
    </template>
    <vxe-modal v-model="orgModal" title="合作机构" width="540" height="600">
      <el-form :model="orgForm" ref="orgForm" :rules="orgRules" label-width="120px">
        <el-form-item label="机构名称">
          <el-input class="input" v-model="orgForm.name" />
        </el-form-item>
      </el-form>
      <el-button-group style="margin-left: 35%;">
        <el-button type="primary">提交</el-button>
        <el-button type="warning">取消</el-button>
      </el-button-group>
    </vxe-modal>
  </d2-container>
</template>

<script>
export default {
  name: "cooperationOrgMaintain",
  computed: {},
  data() {
    return {
      orgModal: false,
      orgForm: {
        name: ""
      },
      orgRules: {},
      tableData: [],
      pager: {
        count: 0,
        rows: 10,
        page: 1,
        condition: "",
        status:"",
        coupontype:"",
        DateTag:"",
        Bdate:"",
        Edate:"",
        hospitalid:"",
        orderby:"",
      }
    };
  },
  created() {
    this.CouponList_Get();
  },
  methods: {
    refreshList() {},
    // 新建
    handleAdd() {
      this.orgModal = true;
    },
    CouponList_Get() {
      this.MK.Request(
        "/Publics/CouponManage/CouponList_Get",
        "get",
        this.pager
      ).then(res => {
        if (res.code == 0) {
          this.tableData=res.data
        }
      });
    }
  }
};
</script>

<style scoped>
.mr20 {
  margin-right: 20px;
}
.input {
  width: 280px;
}
</style>