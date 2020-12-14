<template>
  <d2-container>
    <template slot="header">
      <div class="page-header">
        <div>
          <el-input
            style="width:280px;margin-right:20px;"
            v-model="pager.condition"
            placeholder="请输入"
          />
          <el-button type="primary" @click="refreshList">查询</el-button>
        </div>
        <div>
          <el-button icon="el-icon-circle-plus-outline" type="primary" plain>添加</el-button>
        </div>
      </div>
    </template>
    <el-table :data="tableData" stripe>
      <el-table-column align="center" label="项目代码" prop />
      <el-table-column align="center" label="项目名称" prop />
      <el-table-column align="center" label="单价" prop />
      <el-table-column align="center" label="数量" prop />
      <el-table-column align="center" label="使用时间" prop />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div class="tableBtn">
            <i class="mkfont bianji1" title="编辑" @click="handleActivityEdit(scope.row,1)" />
            <i class="mkfont tingyong_line" title="停用" @click="handleActivityEdit(scope.row,2)" />
            <i class="mkfont qiyong" title="启用" @click="handleActivityEdit(scope.row,3)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
        <mk-page :pager="pager" @query="refreshList" />
    </template>
  </d2-container>
</template>

<script>
export default {
  name: "invoiceManagement",
  computed: {},
  data() {
    return {
      pager: {
        row: 10,
        count:0,
        page: 1,
        condition: ""
      },
      tableData: [{}]
    };
  },
  created() {},
  methods: {
    refreshList() {},
    // 表格操作
    handleActivityEdit(row, index) {}
  }
};
</script>