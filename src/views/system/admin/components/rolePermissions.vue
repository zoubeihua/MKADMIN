<template>
  <el-container>
    <el-aside width="auto" style="background:#FAFAFA;">
      <el-tabs
        tab-position="left"
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          :disabled="righttableListList.length == 0"
          :label="item.bzname"
          :name="item.bzcode"
          v-for="(item, index) in getDicStandarDcode('accesstype')"
          :key="index"
        ></el-tab-pane>
      </el-tabs>
    </el-aside>
    <el-main style="padding:0;">
      <el-container>
        <el-header>
          <el-form :inline="true" class="headerFrom">
            <el-form-item>
              <el-input
                v-model="from.condition"
                style="width:300px"
                @keyup.enter.native="Permission_get()"
                placeholder="按名称、输入码进行查询"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button
                  type="primary"
                  @click="Permission_get()"
                  >查询</el-button
                >
                <slot></slot>
                <!-- <el-button :disabled="righttableListList.length == 0" type="primary" @click="saveAuth">保存</el-button> -->
              </el-button-group>
            </el-form-item>
          </el-form>
        </el-header>
        <el-main style="padding:0;">
          <el-table
            :data="tableList"
            style="width: 100%;"
            height="99%"
            row-key="accessid"
            @row-click="ClickRow"
            ref="ProductTypes"
            stripe
            sortable
            border=""
            highlight-current-row
             lazy
            :load="load"
            :tree-props="{
              children: 'children',
              hasChildren: 'hasChildrens'
            }"
          >
            <el-table-column width="100" align="center">
              <!-- <div slot="header" slot-scope="scope">
                <el-link
                  :underline="false"
                  :disabled="righttableListList.length == 0"
                  :icon="
                    isExpandAll ? 'el-icon-caret-bottom' : 'el-icon-caret-top'
                  "
                  @click="expand"
                  >{{ isExpandAll ? "全部收起" : "全部展开" }}</el-link
                >
              </div> -->
            </el-table-column>
            <el-table-column
              prop="accessname"
              show-overflow-tooltip
              label="权限名称"
            ></el-table-column>
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
                  >{{ scope.row.accesstype_display }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="accessnote"
              show-overflow-tooltip
              label="权限描述"
              align="center"
            ></el-table-column>
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
              <template slot-scope="scope">
                {{ scope.row.expirationdate | dateFormat("YYYY-MM-DD") }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="false"
              prop="accessid"
              label="权限ID"
              width="180"
              align="center"
            ></el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "rolepermissions",
  props: ["value", "url", "pageName"],
  data() {
    return {
      isExpandAll: true,
      activeName: "1",
      from: {
        tag: 1,
         condition: "",
      },
      accessid:"",
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
      righttableListList: []
    };
  },
  created() {
    this.Permission_get();
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
  methods: {
    load(tree, treeNode, resolve) {
      let data = {
        pid: tree.id,
        tag: this.from.tag,
      };

      this.MK.Request(this.url, "get", data).then(res => {
        if (res.code == 0) {
          console
          let listdata = res.data;
          listdata.forEach(item => {
            item.hasChildrens = item.haschildren == 1 ? true : false;
          });
          this.setArr(listdata);
          this.$nextTick(() => {
            this.checkedRows(listdata);
          });
          resolve(listdata);
        }
      });
    },

    //获取对应的权限信息
    Permission_get() {
      this.MK.Request(this.url, "get", this.from).then(res => {
        if (res.code == 0) {
           for (let value of res.data) {
          value.hasChildrens = value.haschildren == 1 ? true : false;
        }
          this.righttableListList = res.data;
          this.setArr(this.righttableListList);
          this.$nextTick(() => {
            this.checkedRows(this.righttableListList);
          });
        }
      });
    },
    //将字符串改为布尔值 Boolean
    setArr(arr) {
      for (let value of arr) {
        this.$set(value, "checkedAll", value.accessstatus == 0 ? false : true);
        this.$set(value, "loadCheckd", value.accessstatus == 0 ? false : true);
        if (value.children && value.children.length) {
          this.setArr(value.children);
        }
      }
    },
    //选中递归
    checkedRows(data) {
      Array.from(data).forEach(row => {
        if (row.accessstatus != 0) {
          // this.$refs.ProductTypes.toggleRowSelection(row, true);
        } else {
          // this.$refs.ProductTypes.toggleRowSelection(row, false);
        }
        if (row.children && row.children.length) this.checkedRows(row.children);
      });
    },
    handleClick(tab) {
      this.$nextTick(() => {
        this.$emit("tabChange")
        this.checkedRows(this.righttableListList);
      });
    },
    ClickRow(row) {
      this.accessid = row.accessid;
      this.$emit('change')
    },
    Roles_get() {
      this.MK.Request(
        "/Publics/Common/Permission/Roles",
        "get",
        this.roleFrom
      ).then(res => {
        if (res.code == 0) {
          this.righttableListList = res.data;
          this.setArr(this.righttableListList);
          this.$nextTick(() => {
            this.checkedRows(this.righttableListList);
          });
        }
      });
    },
    expand() {
      this.isExpandAll = !this.isExpandAll;
      for (let row of this.tableList) {
        setTimeout(_ => {
          this.$refs.ProductTypes.toggleRowExpansion(row);
        }, 200);
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
</style>
