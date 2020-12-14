<template>
  <el-col :span="element.options.span" :class="{
      [element.options.customClass]: element.options.customClass?true: false
    }">
    <el-row
      type="flex"
      :gutter="element.options.gutter || 0"
      :justify="element.options.justify"
      :align="element.options.align"
      v-if="display[element.model]"
    >
      <!--鼠标右键点击出现页面-->
      <div v-show="menuVisible">
        <el-menu
          :id="'rightClickMenus' + element.model"
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
      <el-col v-for="(item, index) in element.columns" :key="index" :span="item.span || 0">
        <template v-for="col in item.list">
          <generate-row-matrix-item
            v-if="col.type == 'rowmatrix'"
            :key="col.key"
            :model.sync="dataModels"
            :rules="rules"
            :element="col"
            :remote="remote"
            :blanks="blanks"
            :display="display"
            @rightClickMenu="rightClickMenu"
            @input-change="onInputChange"
            :edit="edit"
            :remote-option="remoteOption"
          >
            <template v-slot:[blank.name]="scope" v-for="blank in blanks">
              <slot :name="blank.name" :model="scope.model"></slot>
            </template>
          </generate-row-matrix-item>

          <generate-col-item
            v-else-if="col.type == 'grid'"
            :key="col.key"
            :model.sync="dataModels"
            :rules="rules"
            :element="col"
            :remote="remote"
            :blanks="blanks"
            :display="display"
            @rightClickMenu="rightClickMenu"
            @input-change="onInputChange"
            :edit="edit"
            :remote-option="remoteOption"
          >
            <template v-slot:[blank.name]="scope" v-for="blank in blanks">
              <slot :name="blank.name" :model="scope.model"></slot>
            </template>
          </generate-col-item>

          <generate-tab-item
            v-else-if="col.type == 'tabs'"
            :key="col.key"
            :model.sync="dataModels"
            :rules="rules"
            :element="col"
            :remote="remote"
            :blanks="blanks"
            :display="display"
            @rightClickMenu="rightClickMenu"
            @input-change="onInputChange"
            :edit="edit"
            :remote-option="remoteOption"
          >
            <template v-slot:[blank.name]="scope" v-for="blank in blanks">
              <slot :name="blank.name" :model="scope.model"></slot>
            </template>
          </generate-tab-item>

          <generate-form-item
            v-else
            :key="col.key"
            :models.sync="dataModels"
            :rules="rules"
            :widget="col"
            :remote="remote"
            :blanks="blanks"
            :display="display"
            @contextmenu.prevent.native="rightClick($event,col)"
            @input-change="onInputChange"
            :edit="edit"
            :remote-option="remoteOption"
          >
            <template v-slot:[blank.name]="scope" v-for="blank in blanks">
              <slot :name="blank.name" :model="scope.model"></slot>
            </template>
          </generate-form-item>
        </template>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
import GenerateFormItem from "./GenerateFormItem";
import GenerateTabItem from "./GenerateTabItem";
import { questionMenu } from "./questionMenu.js";

export default {
  name: "generate-row-matrix-item",
  components: {
    GenerateFormItem,
    GenerateTabItem,
    GenerateColItem: () => import("./GenerateColItem.vue")
  },
  props: [
    "element",
    "model",
    "rules",
    "remote",
    "blanks",
    "display",
    "edit",
    "isrightclick",
    "remoteOption"
  ],
  data() {
    return {
      questionMenu,
      dataModels: this.model,
      rightClickData: {},
      menuVisible: false //右键菜单显示状态
    };
  },
  methods: {
    //左键菜单点击事件
    handleRightSelect(key) {
      this.$emit("rightClickMenu", this.rightClickData, key);
    },
    rightClickMenu(rightClickData, key) {
      this.$emit("rightClickMenu", rightClickData, key);
    },
    onInputChange(value, field) {
      this.$emit("input-change", value, field);
    },
    rightClick(event, data) {
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
      if (!this.isrightclick) {
        return;
      }
      this.rightClickData = data;
      if (this.menuId !== data.model) {
        this.menuId = data.model;
        this.menuVisible = true;
      } else {
        this.menuVisible = !this.menuVisible;
      }
      document.addEventListener("click", e => {
        this.menuVisible = false;
      });
      let menu = document.querySelector(
        "#rightClickMenus" + this.element.model
      );
      /* 菜单定位基于鼠标点击位置 */
      menu.style.left = event.clientX + 20 + "px";
      menu.style.top = event.clientY - 30 + "px";
      menu.style.position = "fixed"; // 为新创建的DIV指定绝对定位
      menu.style.width = 160 + "px";
      menu.style.zIndex = "999999";
    }
  },
  watch: {
    model: {
      deep: true,
      handler(val) {
        this.dataModels = this.model;
      }
    },
    dataModels: {
      deep: true,
      handler(val) {
        this.$emit("update:model", val);
      }
    }
  }
};
</script>
