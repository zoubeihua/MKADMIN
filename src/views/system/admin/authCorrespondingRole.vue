<template>
  <d2-container>
    <SplitPane :min-percent="20" :default-percent="35" split="vertical">
      <template slot="paneL">
        <rolepermissions
          ref="permissions"
          url="/Publics/Common/Permission"
          @change="permissionsChange"
        />
      </template>
      <template slot="paneR">
        <el-container>
          <el-header>
            <el-form :inline="true" class="headerFrom">
              <el-form-item>
                <el-radio-group
                  v-model="roleFrom.type"
                  @change="permissionsChange()"
                >
                  <el-radio label="-1" border>全部</el-radio>
                  <el-radio label="0" border>已授权</el-radio>
                  <el-radio label="1" border>未授权</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="roleFrom.condition"
                  style="width:300px"
                  @keyup.enter.native="permissionsChange()"
                  placeholder="按名称、输入码进行查询"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button type="primary" @click="permissionsChange()"
                    >查询</el-button
                  >
                  <slot></slot>
                </el-button-group>
              </el-form-item>
            </el-form>
          </el-header>
          <el-main style="padding:0;">
            <el-table
              :data="righttableList"
              stripe
              border
              highlight-current-row
              height="100%"
              @select="handleSelectionChange"
              @select-all="selectAll"
              ref="roleTable"
              @sort-change="changeTableSort"
            >
              <el-table-column
                type="selection"
                align="center"
                width="55"
                :selectable="checkboxT"
                label-class-name="selectionNone"
              ></el-table-column>
              <el-table-column
                label="所属院区"
                sortable
                show-overflow-tooltip
                prop="hospitalname"
              ></el-table-column>
              <el-table-column
                label="角色名称"
                sortable
                show-overflow-tooltip
                prop="rolename"
              ></el-table-column>
              <el-table-column
                label="角色描述"
                sortable
                show-overflow-tooltip
                prop="note"
              ></el-table-column>
              <el-table-column
                label="权限名称"
                sortable
                show-overflow-tooltip
                prop="note"
              ></el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <mk-page :pager="roleFrom" @query="permissionsChange" />
          </el-footer>
        </el-container>
      </template>
    </SplitPane>
  </d2-container>
</template>
<script>
import rolepermissions from "./components/rolePermissions";
export default {
  name: "roleCounterpart",
  components: {
    rolepermissions
  },
  data() {
    return {
      mode: true,
      righttableList: [],
      roleFrom: {
        accessid: "",
        type: "-1",
        condition: "",
        page: 1,
        rows: 20,
        count: 0,
        hospitalid: "",
        orderby: ""
      },
      curRow: {},
      roleList: [],
      rightTableDataList: []
    };
  },
  created() {},
  methods: {
     //表格排序
    changeTableSort(column) {
      if(column.order){
        this.roleFrom.orderby =
        column.prop + " " + column.order.replace(/ending/g, "");
      }else{
         this.roleFrom.orderby =""
      }
      
      this.permissionsChange();
    },
    permissionsChange() {
      this.roleFrom.accessid = this.$refs.permissions.accessid;
      this.MK.Request(
        "/Publics/Common/Permission/Roles",
        "get",
        this.roleFrom
      ).then(res => {
        if (res.code == 0) {
          this.righttableList = res.data;
          this.roleFrom.count = res.count;
          this.$nextTick(() => {
            this.checkedRows(this.righttableList);
          });
        }
      });
    },
    //循环递归
    checkedRows(data) {
      Array.from(data).forEach(row => {
        if (row.accessstatus != 0) {
          this.$refs.roleTable.toggleRowSelection(row, true);
        } else {
          this.$refs.roleTable.toggleRowSelection(row, false);
        }
      });
    },
    //点击复选框事件
    handleSelectionChange(select, row) {
      let arr = [row.roleid];
      if (row.accessstatus == 0) {
        //添加
        this.checkRow(arr, "U");
      } else {
        //删除
        this.checkRow(arr, "D");
      }
    },
    selectAll(selection) {
      let operatetype = "U";
      let arr = [];
      for (let i = 0; i < this.righttableList.length; i++) {
        arr.push(this.righttableList[i].roleid);
      }
      if (selection.length > 0) {
        //添加
        this.checkRow(arr, "U");
      } else {
        //删除
        this.checkRow(arr, "D");
      }
    },
    //
    checkRow(arr, operatetype) {
      let data = {
        operatetype: operatetype,
        accessid: this.$refs.permissions.accessid,
        arrroleid: arr
      };
      this.MK.Request("/Publics/Common/Permission/Roles", "post", data).then(
        res => {
          if (res.code == 0) {
            this.$message.success(res.msg);
          }
          this.permissionsChange()
        }
      );
    },
    //复选框
    checkboxT(row, index) {
      return 1;
      //判断是否可以选中，0：不可选，1:可选
      //   if (row.status == 1) {
      //     return 0;
      //   } else {
      //     return 1;
      //   }
    }
  }
};
</script>
<style scoped>
>>> .el-form-item--medium .el-radio {
  line-height: 1 !important;
}
 ::v-deep .el-form-item--mini .el-radio,::v-deep .el-form-item--medium .el-radio, ::v-deep .el-form-item--small .el-radio {
    line-height: inherit !important;
  }
</style>
