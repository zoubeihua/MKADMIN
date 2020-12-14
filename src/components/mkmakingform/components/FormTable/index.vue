<template>
  <div class="form-table" :class="{'is-disabled': disabled}">
    <!--鼠标右键点击出现页面-->
    <div v-show="menuVisible">
      <el-menu
        :id="'rightClickMenusaa' + randomId"
        class="el-menu-vertical"
        @select="handleRightSelect"
      >
        <el-menu-item
          :index="itemMuen.type"
          class="menuItem"
          v-for="(itemMuen,index) in questionMenu"
          :key="index"
        >
          <template slot="title">
            <i :class="itemMuen.icon"></i>
            <span>{{itemMuen.name}}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
    <el-table :data="tableData" border :key="keys">
      <el-table-column label="#" fixed width="50">
        <template slot="header">
          <el-button
            icon="el-icon-plus"
            size="mini"
            type="primary"
            :disabled="disabled"
            circle
            @click="handleAddRow"
          ></el-button>
        </template>
        <template slot-scope="scope">
          <div class="scope-index" style="text-align: center;">
            <span>{{scope.$index + 1}}</span>
          </div>
          <div class="scope-action" style="text-align: center;">
            <el-button
              :disabled="disabled"
              @click="handleRemove(scope.$index)"
              type="danger"
              icon="el-icon-minus"
              size="mini"
              circle
            ></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.length==0"></el-table-column>
      <template v-else>
        <el-table-column
          v-for="column in columns"
          :key="column.key"
          :label="column.name"
          :width="column.options.width"
        >
          <!-- <el-input></el-input> -->
          <template slot="header" v-if="!column.options.question">
            <el-popover placement="left-start" title width="800" trigger="hover">
              <el-table
                border
                :data="column.options.querycontent"
                @row-dblclick="rowHandelClick"
                height="400"
              >
                <el-table-column
                  property="SERIALNO"
                  width="200"
                  show-overflow-tooltip
                  label="行数标记明细"
                >
                  <template slot-scope="scope">
                    第
                    <span style="color:red;">{{Number(scope.row.SERIALNO) + 1}}</span> 行
                    <span style="color:red;">{{scope.row.FIELDNAME}}</span> 有质疑
                    <!-- 第 <span style="color:red;">{{scope.row.SERIALNO}}</span> 行 <span style="color:red;">{{scope.row.FIELDNAME}}</span> 字段有问题 -->
                  </template>
                </el-table-column>
                <el-table-column property="QUESTIONNAME" show-overflow-tooltip label="质疑人"></el-table-column>
                <el-table-column property="QUESTIONREASON" show-overflow-tooltip label="质疑原因"></el-table-column>
                <el-table-column property="QUESTIONTIME" show-overflow-tooltip label="质疑时间"></el-table-column>
              </el-table>
              <div slot="reference">
                {{column.name}}
                <i class="el-icon-question" style="font-size:16px;color:red;"></i>
              </div>
            </el-popover>
          </template>
          <template slot-scope="scope">
            <GenerateElementItem
              :edit="!disabled"
              :blanks="blanks"
              :is-table="true"
              :widget="column"
              v-model="scope.row[column.model]"
              :models.sync="tableData[scope.$index]"
              :remote="remote"
              @contextmenu.prevent.native="rightClick($event,column,scope.$index)"
            >
              <template v-slot:[blank.name]="blankScope" v-for="blank in blanks">
                <slot :name="blank.name" :model="scope.row"></slot>
              </template>
            </GenerateElementItem>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import { questionMenu } from "../questionMenu.js";
export default {
  components: {
    GenerateElementItem: () => import("../GenerateElementItem.vue")
  },
  props: ["columns", "value", "models", "remote", "blanks", "disabled","isrightclick"],
  data() {
    return {
      questionMenu,
      tableData: this.value,
      dataModels: this.models,
      rightClickData: {},
      index: 0, //当前行索引
      keys: new Date().getTime(),
      menuVisible: false //右键菜单显示状态
    };
  },
  computed: {
    randomId() {
      var Num = "";
      for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      return Num;
    }
  },
  created() {
    let newArr = [];
    if (this.columns.length == 0) return;
    for (let i = 0; i < this.columns.length; i++) {
      newArr = [];
      if (this.columns[i].options.querycontent.length > 0) {
        this.columns[i].options.querycontent.forEach(item => {
          item = { ...item, ...this.columns[i] };
          newArr.push(item);
        });
        this.$set(this.columns[i].options, "querycontent", newArr);
      }
    }
  },
  methods: {
    //左键菜单点击事件
    handleRightSelect(key) {
      this.$emit("rightClickMenu", this.rightClickData, key, this.index);
    },
    rowHandelClick(row) {
      this.$emit("rightClickMenu", row, 3, this.index);
    },
    rightClick(event, data, index) {
      if (
        data.type == "text" ||
        data.type == "html" ||
        data.type == "table" ||
        data.type == "grid" ||
        data.type == "tabs" ||
        data.type == "divider"
      ) {
        return;
      }
      if(!this.isrightclick){
        return;
      }
      this.rightClickData = data;
      this.index = index;
      if (this.menuId !== data.model) {
        this.menuId = data.model;
        this.menuVisible = true;
      } else {
        this.menuVisible = !this.menuVisible;
      }
      document.addEventListener("click", e => {
        this.menuVisible = false;
      });
      let menu = document.querySelector("#rightClickMenusaa" + this.randomId);
      /* 菜单定位基于鼠标点击位置 */
      menu.style.left = event.clientX + 20 + "px";
      menu.style.top = event.clientY - 30 + "px";
      menu.style.position = "fixed"; // 为新创建的DIV指定绝对定位
      menu.style.width = 160 + "px";
      menu.style.zIndex = "999999";
    },
    handleAddRow() {
      let item = {};

      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].type === "blank") {
          item[this.columns[i].model] =
            this.columns[i].options.defaultType == "String"
              ? ""
              : this.columns[i].options.defaultType == "Object"
              ? {}
              : [];
        } else {
          item[this.columns[i].model] = this.columns[i].options.defaultValue;
        }
      }

      this.tableData.push(item);
    },

    handleRemove(index) {
      this.tableData.splice(index, 1);
    }
  },
  watch: {
    value(val) {
      this.tableData = val;
    },
    tableData(val) {
      this.$emit("input", val);
    },
    disabled(val) {
      this.keys = new Date().getTime();
    },
    dataModels: {
      deep: true,
      handler(val) {
        this.$emit("update:models", val);
      }
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModels = val;
      }
    }
  }
};
</script>

<style  scoped>
.form-table {
  position: relative;

  &.is-disabled {
    background-color: #f5f7fa;
    &::after {
      display: block;
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      cursor: no-drop;
    }
  }

  .el-table__empty-block {
    display: none;
  }

  .scope-action {
    display: none;
  }

  .scope-index {
    display: block;
  }

  .hover-row {
    .scope-action {
      display: block;
      .el-button {
        padding: 3px;
      }
    }

    .scope-index {
      display: none;
    }
  }
}
>>> .el-table__row {
  cursor: pointer !important;
}
</style>
