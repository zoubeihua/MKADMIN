<template>
  <el-container>
    <el-aside width="auto" style="background:#FAFAFA;">
      <el-tabs tab-position="left" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          :disabled="righttableListList.length == 0"
          :label="item.bzname"
          :name="item.bzcode"
          v-for="(item,index) in appList"
          :key="index"
        ></el-tab-pane>
      </el-tabs>
    </el-aside>
    <el-main style="padding:0;">
      <el-container>
        <el-header>
          <el-form :inline="true" class="headerFrom">
            <el-form-item>
              <el-radio-group v-model="form.type" @change="getAuthInfo(form)">
                <el-radio label="-1" border>全部</el-radio>
                <el-radio label="0" border>已授权</el-radio>
                <el-radio label="1" border>未授权</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-input
                :disabled="righttableListList.length == 0"
                v-model="form.condition"
                style="width:300px"
                @keyup.enter.native="getAuthInfo(form)"
                placeholder="按名称、输入码进行查询"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button
                  :disabled="righttableListList.length == 0"
                  type="primary"
                  @click="getAuthInfo(form)"
                >查询</el-button>
                <slot></slot>
                <!-- <el-button :disabled="righttableListList.length == 0" type="primary" @click="saveAuth">保存</el-button> -->
              </el-button-group>
            </el-form-item>
          </el-form>
        </el-header>
        <el-main style="padding:0;" class="tree-container">
          <vxe-table
            border
            resizable
            row-id="accessid"
            ref="xTable"
            :checkbox-config="{labelField: 'accessname',checkMethod: checCheckboxkMethod2,showHeader:false}"
            :tree-config="{lazy: true, children: 'children', hasChild: 'hasChildren',  loadMethod: loadChildrenMethod,accordion:true,reserve:true}"
            :data="tableList"
            @checkbox-change="handleSelectionChange"
          >
            <vxe-table-column tree-node width="60"></vxe-table-column>
            <vxe-table-column field="accessname" title="权限名称" type="checkbox" show-overflow></vxe-table-column>
            <vxe-table-column field="accessnote" title="权限类型" width="120" align="center">
              <template v-slot="{ row }">
                <el-tag
                  :type="GetAccessType(row.accesstype)"
                  disable-transitions
                >{{ row.accesstype_display }}</el-tag>
              </template>
            </vxe-table-column>
            <vxe-table-column field="accessnote" title="权限描述"></vxe-table-column>
            <vxe-table-column
              field="source"
             :visible="pageName == 'personnelAuth'"
             show-overflow
              title="授权来源"
              align="center"
              width="120"
            ></vxe-table-column>
            <vxe-table-column
              field="expirationdate"
              :visible="pageName == 'personnelAuth'"
              show-overflow
              title="授权有效期"
              width="150"
              align="center"
              label-class-name="primary"
            >
              <template v-slot="{ row }">{{row.expirationdate | dateFormat('YYYY-MM-DD')}}</template>
            </vxe-table-column>
          </vxe-table>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "permissions",
  props: {
    value: "",
    url: "",
    pageName: "",
    accesstype: {
      type: String,
      default: "全部"
    }
  },
  data() {
    return {
      expirationdate: "",
      tList: [],
      pid: 0,
      rowList: "",
      activeName: "1",
      form: {
        type: "-1" //默认 -1 全部 0 已授权 1未授权
      },
      righttableListList: [],
      appList: []
    };
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.$emit("input", val);
      }
    }
  },
  computed: {
    tableList() {
      return this.righttableListList.filter(
        item => item.accesstype == this.activeName
      );
    }
  },
  created() {
    this.appList = this.getDicStandarDcode("accesstype").filter(item => {
      if (this.accesstype == "全部") {
        return item;
      }
      if (this.accesstype == item.bzname) {
        return item;
      }
    });
  },
  methods: {
    //获取对应的权限信息  列表
    getAuthInfo(val) {
      var that = this;
      if (Object.keys(that.form).length == 1) {
        that.form = val;
      }
      let id = that.form.roleid || that.form.userid;
      that.sortColumn({ sortable: "none" }, that.url, that.form, res => {
        that.sortUserChange(res);
      });
    },
    //整理数据--
    sortUserChange(res) {
      if (res.code == 0) {
        for (let value of res.data) {
          value.hasChildren = value.haschildren == 1 ? true : false;
        }
        this.righttableListList = res.data;
        this.$nextTick(() => {
          this.checkedRows(this.righttableListList);
        });
      }
    },
    checkedRows(data) {
      this.$nextTick(() => {
        Array.from(data).forEach((row, index) => {
          if (row.accessstatus === 1) {
            this.$refs.xTable.setCheckboxRow(row, true);
          } else {
            this.$refs.xTable.setCheckboxRow(row, false);
          }
        });
      });
    },
    handleClick(tab) {
      this.$nextTick(() => {
        this.checkedRows(this.righttableListList);
      });
    },
    //点击复选框事件
    handleSelectionChange({ checked, row }) {
      // this.getSon(row);
      // return;
      this.rowList = row;
      this.pid = row.pid;
      this.permissionsChange(checked, row);
    },
    permissionsChange(selected, row) {
      console.log(selected);
      let Selects = selected;
      let operatetype = "C";
      if (selected) {
        operatetype = "C";
      } else {
        operatetype = "D";
      }
      if (this.expirationdate == "" && selected &&this.pageName == 'personnelAuth') {
        this.$message.error("请先设置授权期限");
        this.$refs.xTable.toggleCheckboxRow(row);
        return;
      }
      let sendData = {
        operatetype: operatetype,
        userid: this.form.userid,
        type: this.form.type,
        roleid: this.form.roleid,
        accessid: row.id,
        expirationdate: this.expirationdate
      };
      this.MK.Request(this.url, "post", sendData).then(
        res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.msg
            });
          } else {
            this.getSon(row);
          }
        }
      );
    },
    getSon(row){
       let treeExpandRecords = this.$refs.xTable.getTreeExpandRecords();
        //如果是根节点，直接刷新当前节点
         if (row.pid == 0) {
           console.log('111')
           this.$refs.xTable.reloadTreeChilds(row);
          return;
        };
      //当下面没有子集的时候 直接切换状态
      if(row.hasChildren==false){
        console.log("2222")
          this.$refs.xTable.toggleTreeExpand(row);
         return;
        };
       console.log("333")
        for (let i = 0; i < treeExpandRecords.length; i++) {
        if (treeExpandRecords[i].id == row.id) {
         this.$refs.xTable.reloadTreeChilds(treeExpandRecords[i]);
        }
      }
        
    },
    //表格懒加载
    async loadChildrenMethod({ row }) {
      console.log(row);
      let data = {
        pid: row.id,
        tag: 1,
        userid: this.form.userid,
        type: this.form.type,
        roleid: this.form.roleid
      };
      return new Promise((resolve, reject) => {
        this.MK.Request(this.url, "get", data).then(res => {
          let listdata = res.data[0].children;
          listdata.forEach(item => {
            item.hasChildren = item.haschildren == 1 ? true : false;
          });
          this.tList = listdata;
          resolve(listdata);
          setTimeout(() => {
            this.$nextTick(() => {
              listdata.forEach((row, index) => {
                if (row.accessstatus === 1) {
                  this.$refs.xTable.setCheckboxRow(row, true);
                } else if (row.accessstatus === 0) {
                  this.$refs.xTable.setCheckboxRow(row, false);
                }
              });
            });
          }, 50);
        });
      });
    },
    checCheckboxkMethod2({ row }) {
      if (row.source == "角色") {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>
<style scoped>
::v-deep .el-tabs--left .el-tabs__header.is-left {
  margin-right: 2px;
}
.unselected
  ::v-deep
  .el-checkbox__input.is-disabled
  .el-checkbox__inner::after {
  cursor: not-allowed;
  border-color: red;
}
::v-deep th.el-table-column--selection.is-leaf.selectionNone .cell {
  display: none !important;
}
.headerFrom >>> .el-form-item--medium .el-radio {
  line-height: 1 !important;
}
::v-deep .el-form-item--mini .el-radio,
::v-deep .el-form-item--medium .el-radio,
::v-deep .el-form-item--small .el-radio {
  line-height: inherit !important;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.tree-container /deep/ .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

.tree-container /deep/ .el-icon-caret-right:before {
  content: "\e791";
  font-size: 18px;
}

.tree-container /deep/ .el-tree-node__expand-icon {
  margin-left: 15px;
  padding: 0px;
}

.tree-container /deep/ .el-tree-node__expand-icon.is-leaf {
  margin-left: 0px;
}

.tree-container /deep/ .el-tree-node {
  position: relative;
  padding-left: 16px;
}

.tree-container /deep/ .el-tree-node__children {
  padding-left: 16px;
}

.tree-container /deep/ .el-tree > .el-tree-node:before {
  border-left: none;
}

.tree-container /deep/ .el-tree > .el-tree-node:after {
  border-top: none;
}
.tree-container /deep/ .el-tree > .el-tree-node:before {
  border-left: none;
}

.tree-container /deep/ .el-tree > .el-tree-node:after {
  border-top: none;
}

.tree-container /deep/ .el-tree-node:before {
  content: "";
  left: 10px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.tree-container /deep/ .el-tree-node:after {
  content: "";
  left: 10px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.tree-container /deep/ .el-tree-node:before {
  border-left: 1px solid #e6e6e6;
  bottom: 0px;
  height: 100%;
  top: -19px;
  width: 1px;
}

.tree-container /deep/ .el-tree-node:after {
  border-top: 1px solid #e6e6e6;
  height: 25px;
  top: 20px;
  width: 20px;
}

.el-tree-node :last-child:before {
  height: 40px;
}

.tree-container {
  margin: 10px;
}
.tree-container /deep/ .el-tree .el-tree-node {
  position: relative;
}
.tree-container /deep/ .el-tree-node .el-tree-node__content {
  height: 40px;
  padding-left: 0 !important;
}
.tree-container /deep/ .el-tree-node .el-tree-node__content::before {
  border-left: 1px solid #e6e6e6;
  height: 100%;
  top: 0;
  width: 1px;
  margin-left: 1px;
  margin-top: 0px;
  z-index: 8;
}
.tree-container
  /deep/
  .el-tree-node
  .el-tree-node__children
  .el-tree-node__content::before {
  border-left: 0px solid #e6e6e6;
  height: 100%;
  top: 0;
  width: 1px;
  margin-left: 1px;
  margin-top: 0px;
  z-index: 8;
}

.tree-container /deep/ .el-tree-node .el-tree-node__content::after {
  border-top: 1px solid #e6e6e6;
  height: 1px;
  top: 18px;
  width: 13px;
  margin-left: 1px;
  z-index: 8;
}

.tree-container
  /deep/
  .el-tree-node
  .el-tree-node__children
  .el-tree-node__content::after {
  border-top: 0px solid #e6e6e6;
}

.tree-container .el-tree-node .el-tree-node__content::before,
.tree-container .el-tree-node .el-tree-node__content::after {
  content: "";
  position: absolute;
  right: auto;
}
</style>
