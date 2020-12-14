<template>
  <d2-container>
    <SplitPane :min-percent="20" :default-percent="35" split="vertical">
      <template slot="paneL">
        <el-container>
          <el-header>
            <el-form :inline="true" class="headerFrom">
              <el-form-item label="院区">
                <mk-select
                  style="width:118px;"
                  v-model="form.hospitalid"
                  placeholder="请选择院区"
                  url="/Publics/Common/Dic/HospitalInfo"
                  :filter="['hospitalname','filterstr']"
                  label="hospitalname"
                  val="hospitalid"
                  @change="RefreshList"
                ></mk-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="form.condition"
                  style="width:300px"
                  @keyup.enter.native="RefreshList"
                  placeholder="按名称、输入码进行查询"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button type="primary" @click="RefreshList">查询</el-button>
                </el-button-group>
              </el-form-item>
            </el-form>
          </el-header>
          <el-main style="padding:0;">
            <el-table
              :data="roleList"
              stripe
              border
              @row-click="tableRowClick"
              highlight-current-row
              @sort-change="(({column}) => {sortColumn(column,'/Publics/Common/Role',form,sortChange)})"
              height="100%"
            >
              <el-table-column
                label="所属院区"
                sortable="custom"
                show-overflow-tooltip
                prop="hospitalname"
              ></el-table-column>
              <el-table-column label="角色名称" sortable="custom" show-overflow-tooltip prop="rolename"></el-table-column>
              <el-table-column label="角色描述" sortable="custom" show-overflow-tooltip prop="note"></el-table-column>
              <el-table-column label="权限名称" sortable="custom" show-overflow-tooltip prop="note"></el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <mk-page :pager="form" @query="RefreshList" />
          </el-footer>
        </el-container>
      </template>
      <template slot="paneR">
        <newPermissions ref="newPermissions" url="/Publics/Common/Role/Permission" @change="permissionsChange" />
      </template>
    </SplitPane>
  </d2-container>
</template>
<script>
import newPermissions from "./components/newPermissions";
export default {
  name: "roleCounterpart",
  components: {
    newPermissions
  },
  data() {
    return {
      form: {
        roleid: "",
        status: "-1", //状态 1 正常 0 停用 -1全部(默认)
        condition: "",
        hospitalid: "",
        orderby: "",
        page: 1,
        rows: 20,
        count: 0
      },
      rightForm: {
        roleid: "",
        type: "-1", //查询类型 默认 -1 全部 0 已授权 1未授权
        condition: "", //按名称、输入码进行查询
        tag:1,
        // page:1,
        // rows:20,
        // count:0,
        hospitalid: "",
        orderby: ""
      },
      curRow: {},
      roleList: [],
      rightTableDataList: []
    };
  },
  created() {
    this.RefreshList();
  },
  methods: {
    //获取页面数据
    RefreshList() {
      this.sortColumn(
        { sortable: "none" },
        "/Publics/Common/Role",
        this.form,
        res => {
          this.sortChange(res);
        }
      );
    },
    sortChange(res) {
      if (res.code == 0) {
        this.roleList = res.data;
        this.form.count = res.count;
      }
    },
    //左边tabel行单击事件
    tableRowClick(row) {
      this.curRow = row;
      this.rightForm.roleid = row.roleid;
      this.$refs.newPermissions.getAuthInfo(this.rightForm);
    },
    permissionsChange(selected,val,list) {
      let Selects = val;
      let operatetype = "C";
      if(selected){
        operatetype = "C"
      }else{
        operatetype = "D"
      }
      let sendData = {
        operatetype: operatetype,
        roleid: this.rightForm.roleid,
        accessid: val
      };
        this.MK.Request("/Publics/Common/Role/Permission", "post", sendData).then(
        res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.msg
            });
           this.$refs.newPermissions.getAuthInfo();
          }else{
          }
        }
      );
    }
  }
};
</script>
