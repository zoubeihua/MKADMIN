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
          <el-table
            :data="tableList"
            style="width: 100%;"
            height="99%"
            row-key="accessid"
            @row-click="ClickRow"
            ref="ProductTypes"
            @select="handleSelectionChange"
            @select-all="selectAll"
            stripe
            sortable
            border
            highlight-current-row
            lazy
            :load="load"
            :tree-props="{
                  children: 'children',
                  hasChildren: 'hasChildren'
                }"
          >
            <el-table-column width="100" align="center">
              <!-- <div slot="header" slot-scope="scope">
                <el-link
                  :underline="false"
                  :disabled="righttableListList.length == 0"
                  :icon="isExpandAll ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"
                  @click="expand"
                >{{isExpandAll ? '全部收起' : '全部展开'}}</el-link>
              </div>-->
            </el-table-column>
            <el-table-column
              type="selection"
              align="center"
              width="55"
              :selectable="checkboxT"
              label-class-name="selectionNone"
            ></el-table-column>
            <!-- <el-table-column label="初始选择" width="85" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  label
                  name="type"
                  disabled
                  v-model="scope.row.loadCheckd"
                  :class="[scope.row.accessstatus === 0 ? '' : 'unselected']"
                ></el-checkbox>
              </template>
            </el-table-column>-->
            <el-table-column prop="accessname" show-overflow-tooltip label="权限名称"></el-table-column>
            <el-table-column
              prop="accesstype_display"
              show-overflow-tooltip
              label="权限类型"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="GetAccessType(scope.row.accesstype)"
                  disable-transitions
                >{{ scope.row.accesstype_display }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="accessnote" show-overflow-tooltip label="权限描述" align="center"></el-table-column>
            <el-table-column
              prop="source"
              v-if="pageName == 'personnelAuth'"
              show-overflow-tooltip
              label="授权来源"
            ></el-table-column>
            <el-table-column
              prop="expirationdate"
              v-if="pageName == 'personnelAuth'"
              show-overflow-tooltip
              label="授权有效期"
              width="150"
              align="center"
              label-class-name="primary"
            >
              <template slot-scope="scope">{{scope.row.expirationdate | dateFormat('YYYY-MM-DD')}}</template>
            </el-table-column>
            <el-table-column v-if="false" prop="accessid" label="权限ID" width="180" align="center"></el-table-column>
          </el-table>
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
      pid: 0,
      onlyId: "",
      isonly:false,
      rowList: "",
      maps: new Map(),
      checkedkeys: [],
      isExpandAll: true,
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

    console.log(this.appList);
  },
  methods: {
    //复选框
    checkboxT(row, index) {
      if (row.source == "角色") {
        return 0;
      } else {
        return 1;
      }
    },
    //获取对应的权限信息  列表
    getAuthInfo(val) {
      var that = this;
      if (Object.keys(that.form).length == 1) {
        that.form = val;
      }
      let id =that.form.roleid||that.form.userid;
      that.sortColumn({ sortable: "none" }, that.url, that.form, res => {
        if (that.isonly) {
          console.log("刚进来的时候")
          that.maps.forEach((itemm, key) => {
            that.$refs.ProductTypes.store.states.treeData[key].loaded = false;
            that.$refs.ProductTypes.store.states.treeData[key].expanded = false;
          });
          that.isonly=false;
        }
        if (!that.isonly&& that.pid != 0) {
          console.log("子菜单修改的时候")
          that.refreshLoadTree(that.pid);
        }
        if (that.pid == 0 && !!that.rowList) {
          console.log("点击了根菜单")
          that.maps.forEach((item, key) => {
            if (that.rowList.id == key) {
              that.refreshLoadTree(that.rowList.id);
            }
          });
        }
        that.sortUserChange(res);
      });
    },
    // 重新触发树形表格的loadTree函数(因项目中需要多次触发loadTree方法，故封装成一个方法)
    refreshLoadTree(parentId) {
      if (parentId == 0) {
        return;
      } else {
        const { tree, treeNode, resolve } = this.maps.get(parentId);
        this.$set(
          this.$refs.ProductTypes.store.states.lazyTreeNodeMap,
          parentId,
          []
        );
        if (tree) {
          this.load(tree, treeNode, resolve);
        }
      }

      // 根据父级id取出对应节点数据
    },
    //整理数据--
    sortUserChange(res) {
      if (res.code == 0) {
        for (let value of res.data) {
          value.hasChildren = value.haschildren == 1 ? true : false;
        }
        this.righttableListList = res.data;
        this.checkedkeys = [];
        this.setArr(this.righttableListList);
        this.$nextTick(() => {
          this.checkedRows(this.righttableListList);
        });
      }
    },
    //目前没用
    checkchange(data, node) {
      // console.log(this.$refs.tree.getCheckedNodes(true))
      // console.log(this.$refs.tree.getCheckedKeys());
    },
    //目前没用
    currentchange(data, node) {
      // console.log(this.$refs.tree.getCurrentKey())
    },
    //将字符串改为布尔值 Boolean
    setArr(arr) {
      for (let value of arr) {
        // console.log(value)
        if (value.accessstatus == 1) {
          this.checkedkeys.push(value.accessid);
        }
        if (value.source) {
          this.$set(value, "disabled", value.source == "角色" ? true : false);
        }
        this.$set(value, "checkedAll", value.accessstatus == 0 ? false : true);
        this.$set(value, "loadCheckd", value.accessstatus == 0 ? false : true);
        if (value.children && value.children.length) {
          this.setArr(value.children);
        }
      }
    },
    //获得数据之后 判断选中递归
    checkedRows(data) {
      console.log(data)
      Array.from(data).forEach(row => {
        if (row.accessstatus != 0) {
          this.$refs.ProductTypes.toggleRowSelection(row, true);
        } else {
          this.$refs.ProductTypes.toggleRowSelection(row, false);
        }
        if (row.children && row.children.length) this.checkedRows(row.children);
      });
    },
    handleClick(tab) {
      this.$nextTick(() => {
        this.checkedRows(this.righttableListList);
      });
    },
    ClickRow(row) {
      // this.rows = this.$refs.ProductTypes.selection;
      // let checkrow = [];
      // checkrow.push(row);
      // if (row.checkedAll == true) {
      //   this.clearRow(checkrow);
      // } else {
      //   this.checkRow(checkrow);
      // }
    },
    //点击复选框事件
    handleSelectionChange(select, row) {
      this.rowList = row;
      let selected = select.length && select.indexOf(row) !== -1;
      // this.rows = this.$refs.ProductTypes.selection; //获取表格中所有选中的数据
      let checkrow = [];
      checkrow.push(row);

      let sList = row.accessid;
      // this.$set(this.pid,row.pid)
      console.log(row);
      this.pid = row.pid;
      if (selected) {
        this.$emit("change", selected, sList, []); //selected  true就是选中，0或者false是取消选中
      } else {
        this.$emit("change", selected, sList, []); //selected  true就是选中，0或者false是取消选中
      }

      return;
      let treeFindPathList = this.treeFindPath(
        this.tableList,
        data => data === row
      );
      console.log(treeFindPathList);
      //返回当前操作节点和关联的父节点
      // console.log("treeFindPathList");
      if (treeFindPathList.length > 0) {
        let curArr = [];
        if (treeFindPathList.length == 1) {
          // 当前只有一个节点
          console.log("treeFindPathList.length == 1");

          if (
            treeFindPathList[0].children &&
            treeFindPathList[0].children.length
          ) {
            let partId = this._zipObject(treeFindPathList, "accessid");
            let childrenId = this._zipObject(
              treeFindPathList[0].children,
              "accessid"
            );
            curArr = [...partId, ...childrenId];
            console.log(partId, treeFindPathList[0].children);
            this.$emit("change", selected, curArr, treeFindPathList); //selected  true就是选中，0或者false是取消选中
          } else {
            let partId = this._zipObject(treeFindPathList, "accessid");
            curArr = partId;
            this.$emit("change", selected, curArr, treeFindPathList); //selected  true就是选中，0或者false是取消选中
          }
        }
        if (treeFindPathList.length > 1) {
          //当前节点有多个节点父子 关联节点
          let curArr = [];
          let newPathList = this._zipObject(treeFindPathList, "accessid");
          console.log("treeFindPathList.length > 1");
          console.log(newPathList, treeFindPathList);
          let partId = newPathList[0];
          let childrenId = newPathList[1];
          curArr = [...[partId], ...[childrenId]];
          if (newPathList.length == 3) {
            curArr.push(newPathList[2]);
          }
          if (selected) {
            this.$emit("change", selected, curArr, treeFindPathList); //selected  true就是选中，0或者false是取消选中
          } else {
            this.$emit(
              "change",
              selected,
              [newPathList[newPathList.length - 1]],
              treeFindPathList
            ); //selected  true就是选中，0或者false是取消选中
          }

          let isTrue = false; //判断当前点击节点的选中状态
          for (let i = 0; i < treeFindPathList.length; i++) {
            if (i == treeFindPathList.length - 1) {
            } else {
              if (treeFindPathList[treeFindPathList.length - 1].checkedAll) {
                //如果点击的子节点状态为选中状态那么关联的所有父节点都选中
                console.log(i);
                treeFindPathList[i].checkedAll = true;
                this.$refs.ProductTypes.toggleRowSelection(
                  treeFindPathList[i],
                  true
                );
              }
            }
          }
        }
      }
    },
    //找父节点
    treeFindPath(tree, func, path = []) {
      if (!tree) return [];
      for (const data of tree) {
        // 这里按照你的需求来存放最后返回的内容
        path.push(data);
        if (func(data)) return path;
        if (data.children && data.children.length) {
          const findChildren = this.treeFindPath(data.children, func, path);
          if (findChildren.length) return findChildren;
        }
        path.pop();
      }
      return [];
    },
    //全选
    selectAll(selection) {
      let isTrue = this.mapIsTrue(this.tableList);
      if (!isTrue) {
        this.checkRow(this.tableList);
      } else {
        this.clearRow(this.tableList);
      }
    },
    mapIsTrue(list) {
      let flag = true;
      Array.from(list).forEach(row => {
        if (row.checkedAll == false) {
          flag = false;
        }
        if (row.children && row.children.length) {
          //有子集就递归  没子集了就不循环了
          this.mapIsTrue(row.children);
        }
      });
      return flag;
    },
    //取消选中递归
    clearRow(data) {
      Array.from(data).forEach(row => {
        row.checkedAll = false; //给这行数据设置一个选中字段为false
        this.$refs.ProductTypes.toggleRowSelection(row, false);
        if (row.children && row.children.length) this.clearRow(row.children); //有子集就递归  没子集了就不循环了
      });
    },
    //选中递归
    checkRow(data) {
      Array.from(data).forEach(row => {
        row.checkedAll = true; //选中是字段值为true
        this.$refs.ProductTypes.toggleRowSelection(row, true);
        if (row.children && row.children.length) this.checkRow(row.children);
      });
    },
    cellStyle: function({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        //指定坐标 选择,中心编号 蓝色;
        return "selectionNone";
      } else {
        return "";
      }
    },
    //保存
    saveAuth() {
      this.$emit(
        "change",
        this._zipObject(this.$refs.ProductTypes.selection, "accessid")
      );
    },
    _zipObject(arr, key) {
      return arr.map(item => item[key]);
    },
    expand() {
      this.isExpandAll = !this.isExpandAll;
      for (let row of this.tableList) {
        setTimeout(_ => {
          this.$refs.ProductTypes.toggleRowExpansion(row);
        }, 200);
      }
    },
    load(tree, treeNode, resolve) {
      this.maps.set(tree.id, { tree, treeNode, resolve });
      let data = {
        pid: tree.id,
        tag: 1,
        userid: this.form.userid,
        type: this.form.type,
        roleid: this.form.roleid
      };
      console.log(data);

      this.MK.Request(this.url, "get", data).then(res => {
        if (res.code == 0) {
          let listdata = res.data[0].children;
          listdata.forEach(item => {
            item.hasChildren = item.haschildren == 1 ? true : false;
          });
          this.setArr(listdata);
          this.$nextTick(() => {
            this.checkedRows(listdata);
          });
          resolve(listdata);
        }
      });
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
