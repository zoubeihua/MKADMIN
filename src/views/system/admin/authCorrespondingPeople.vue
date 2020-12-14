<template>
  <d2-container>
    <SplitPane :min-percent="20" :default-percent="35" split="vertical">
      <template slot="paneL">
        <rolepermissions
          ref="permissions"
          url="/Publics/Common/Permission"
          @change="permissionsChange"
          @tabChange="clearTabel"
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
                  placeholder="按会员姓名查询"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button type="primary" @click="permissionsChange()"
                    >查询</el-button
                  >
                  <el-date-picker
                    v-model="expirationdate"
                    align="right"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="设置有效期限"
                    :picker-options="pickerOptions"
                  />
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
                show-overflow-tooltip
                align="center"
                label="ID"
                prop="userid"
                width="60"
                sortable
              />
              <el-table-column
                show-overflow-tooltip
                align="center"
                label="人员类型"
                prop="stafftype_display"
                width="110"
                sortable
              />
              <el-table-column
                show-overflow-tooltip
                align="center"
                label="院区"
                prop="hospitalname"
                sortable
              />
              <el-table-column
                show-overflow-tooltip
                align="center"
                label="科室"
                prop="deptname"
                width="80"
                sortable
              />
              <el-table-column
                show-overflow-tooltip
                align="center"
                label="工号"
                prop="staffno"
                sortable
              />
              <el-table-column
                show-overflow-tooltip
                align="center"
                label="姓名"
                prop="name"
                sortable
              >
                <template slot-scope="scope">
                  <div>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="scope.row.sex_dispalay"
                      placement="left"
                    >
                      <i
                        :class="[
                          'mkfont',
                          scope.row.sex == 1
                            ? 'nan'
                            : scope.row.sex == 2
                            ? 'nv'
                            : 'weizhi'
                        ]"
                        :style="{
                          color:
                            scope.row.sex == 1
                              ? '#6DCEFA'
                              : scope.row.sex == 2
                              ? '#F37E7D'
                              : ''
                        }"
                      ></i>
                    </el-tooltip>
                    <span style="min-width:60px;display:inline-block;">{{
                      scope.row.name
                    }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                align="center"
                label="职称"
                prop="jobtitle_display"
                sortable
              />
              <el-table-column
                show-overflow-tooltip
                align="center"
                label="职务"
                prop="position_display"
                sortable
              />
              <el-table-column
                show-overflow-tooltip
                align="center"
                label="状态"
                width="70"
                sortable
                prop="status"
              >
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.status == 1 ? 'success' : 'danger'"
                    >{{ scope.row.status == 1 ? "在职" : "离职" }}</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="source"
                show-overflow-tooltip
                label="授权来源"
              ></el-table-column>
              <el-table-column
                prop="expirationdate"
                show-overflow-tooltip
                label="授权有效期"
                width="150"
                align="center"
                label-class-name="primary"
              >
                <template slot-scope="scope">
                  {{ scope.row.expirationdate | dateFormat("YYYY-MM-DD") }}
                </template>
              </el-table-column>
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
      form: {
        userid: "",
        status: "-1", //状态 1 正常 0 停用 -1全部(默认)
        condition: "",
        hospitalid: "",
        orderby: "",
        page: 1,
        rows: 20,
        count: 0
      },
      expirationdate: "",
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
      rightTableDataList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
        shortcuts: [
          {
            text: "一周",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一个月",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", date);
            }
          },
          {
            text: "三个月",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit("pick", date);
            }
          },
          {
            text: "半年",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 180);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一年",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 360);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    //表格排序
    changeTableSort(column) {
      if (column.order) {
        this.roleFrom.orderby =
          column.prop + " " + column.order.replace(/ending/g, "");
      } else {
        this.roleFrom.orderby = "";
      }
      this.permissionsChange();
    },
    permissionsChange() {
      this.roleFrom.accessid = this.$refs.permissions.accessid;
      if (this.roleFrom.accessid == "") {
        this.$message.error("请先选择权限");
        return;
      }
      this.MK.Request(
        "/Publics/Common/Permission/Users",
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
      let arr = [row.userid];
      if (row.accessstatus == 0) {
        //添加
        this.checkRow(arr, "U", [row]);
      } else {
        //删除
        this.checkRow(arr, "D", [row]);
      }
    },
    selectAll(selection) {
      let arr = [];
      //筛选非角色权限
      let list = this.righttableList.filter(item => item.source !== "角色");
      //只操作非角色权限
      for (let i = 0; i < list.length; i++) {
        arr.push(list[i].userid);
      }
      //selection=righttableList的时候表示全选
      if (selection.length == this.righttableList.length) {
        //添加
        this.checkRow(arr, "U", list);
      } else {
        //删除
        this.checkRow(arr, "D", list);
      }
    },
    checkRow(arr, operatetype, list) {
      //operatetype == "U"添加的时候 必须 加上expirationdate有效期
      if (this.expirationdate == "" && operatetype == "U") {
        this.$message.error("请设置有效日期");
        for (let i = 0; i < list.length; i++) {
          //不符合条件的话 恢复选中状态
          this.$refs.roleTable.toggleRowSelection(
            list[i],
            list[i].accessstatus == 0 ? false : true
          );
        }
        return;
      }
      let data = {
        operatetype: operatetype,
        accessid: this.$refs.permissions.accessid,
        arruserid: arr,
        expirationdate: this.expirationdate
      };
      this.MK.Request("/Publics/Common/Permission/Users", "post", data).then(
        res => {
          if (res.code == 0) {
            this.$message.success(res.msg);
          }
          this.permissionsChange();
        }
      );
    },
    //复选框
    checkboxT(row, index) {
      //判断是否可以选中，0：不可选，1:可选
      if (row.source == "角色") {
        return 0;
      } else {
        return 1;
      }
    },
    //点击左侧tab，清空右侧列表
    clearTabel() {
      this.righttableList = [];
    }
  }
};
</script>
<style scoped>
	::v-deep .el-form-item--mini .el-radio,::v-deep .el-form-item--medium .el-radio, ::v-deep .el-form-item--small .el-radio {
	   line-height: inherit !important;
	 }
>>> .el-form-item--medium .el-radio {
  line-height: 1 !important;
}
>>> .el-date-editor--date {
  width: 150px;
  background: #3f9eff;
}
>>> .el-date-editor--date input {
  background: #3f9eff;
  padding-right: 10px;
  border-radius: 0;
  color: #ffffff;
  border: none;
  border-left: 1px solid #fff;
}
>>> .el-date-editor--date input::-webkit-input-placeholder,
>>> .el-date-editor--date .el-icon-date,
>>> .el-date-editor--date .el-input__suffix {
  color: #ffffff;
}
</style>
