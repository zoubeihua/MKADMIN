<template>
  <el-col :span="element.options.span">
    <el-row
      class="widget-col widget-view Row-Matrix"
      :class="{
      active: selectWidget.key && selectWidget.key == element.key,
      'is_hidden': element.options.hidden
    }"
      @click.native.stop="handleSelectWidget(index)"
      type="flex"
      :gutter="element.options.gutter || 0"
      :justify="element.options.justify"
      :align="element.options.align"
    >
      <el-col v-for="(item, index) in element.columns" :key="index" :span="item.span || 0">
        <draggable
          v-model="item.list"
          v-bind="{group:{name: 'people', put: handlePut}, ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
          :no-transition-on-drag="true"
          @add="handleWidgetColAdd($event, element, index)"
        >
          <transition-group name="fade" tag="div" class="widget-col-list">
            <template v-for="(col, colindex) in item.list">
              <widget-col-item
                v-if="col && col.key && col.type === 'grid'"
                :key="col.key"
                :element="col"
                :select.sync="selectWidget"
                :index="colindex"
                :data="item"
                @select-change="handleSelectChange($event, item)"
              ></widget-col-item>

              <widget-row-matrix-item
                v-else-if="col && col.key && col.type === 'rowmatrix'"
                :key="col.key"
                :element="col"
                :select.sync="selectWidget"
                :index="colindex"
                :data="item"
                @select-change="handleSelectChange($event, item)"
              ></widget-row-matrix-item>

              <widget-tab-item
                v-else-if="col && col.key && col.type === 'tabs'"
                :key="col.key"
                :element="col"
                :select.sync="selectWidget"
                :index="colindex"
                :data="item"
                @select-change="handleSelectChange($event, item)"
              ></widget-tab-item>

              <widget-table
                v-else-if="col && col.key && col.type === 'table'"
                :key="col.key"
                :element="col"
                :select.sync="selectWidget"
                :index="colindex"
                :data="item"
                @select-change="handleSelectChange($event, item)"
              ></widget-table>

              <widget-form-item
                v-else
                :key="col.key"
                :element="col"
                :select.sync="selectWidget"
                :index="colindex"
                :data="item"
                @select-change="handleSelectChange($event, item)"
              ></widget-form-item>
            </template>
          </transition-group>
        </draggable>
      </el-col>

      <div class="widget-view-action widget-col-action" v-if="selectWidget.key == element.key">
        <i class="iconfont icon-icon_clone" @click.stop="handleColClone(index)"></i>
        <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index,element)"></i>
      </div>

      <div class="widget-view-drag widget-col-drag" v-if="selectWidget.key == element.key">
        <i class="iconfont icon-drag drag-widget"></i>
      </div>
    </el-row>
  </el-col>
</template>

<script>
import { mapState, mapActions } from "vuex";
import WidgetColItem from "./WidgetColItem";
import WidgetFormItem from "./WidgetFormItem";
import WidgetTable from "./WidgetTable";
import WidgetTabItem from "./WidgetTabItem";
import Draggable from "vuedraggable";
import _ from "lodash";
import { CloneLayout } from "../util/layout-clone.js";
import MD5 from "@/libs/util.md5.js";

export default {
  name: "widget-row-matrix-item",
  components: {
    Draggable,
    WidgetColItem,
    WidgetFormItem,
    WidgetTable,
    WidgetTabItem
  },
  props: ["element", "select", "index", "data"],
  data() {
    return {
      selectWidget: this.select,
      rateOptionList: []
    };
  },
  computed: {
    ...mapState("d2admin/ecrf", ["rateOptions"])
  },
  created() {
    this.rateOptionList = this.rateOptions;
  },
  methods: {
    ...mapActions("d2admin/ecrf", ["wgeCRFDataSet", "rateOptionsSet"]),
    handleSelectWidget(index) {
      this.selectWidget = this.data.list[index];
    },
    handleWidgetDelete(index, element) {
      console.log(this.rateOptions);
      if (this.data.list.length == 1) {
        this.$emit("select-change", -1);
      } else {
        if (this.data.list.length - 1 == index) {
          this.$emit("select-change", index - 1);
        } else {
          this.$emit("select-change", index);
        }
      }

      this.data.list.splice(index, 1);
    },
    handleColClone(index) {
      let cloneData = _.cloneDeep(this.data.list[index]);

      console.log(cloneData);
      this.data.list.splice(index + 1, 0, CloneLayout(cloneData));

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1];
      });
    },
    handlePut(a, b, c) {
      if (
        c.className.indexOf("widget-col") >= 0 ||
        c.className.indexOf("widget-table") >= 0 ||
        c.className.indexOf("widget-tab") >= 0 ||
        c.className.indexOf("no-put") >= 0 ||
        c.children[0].className.indexOf("no-put") >= 0
      ) {
        return false;
      }
      return true;
    },
    handleWidgetColAdd($event, row, colIndex) {
      const newIndex = $event.newIndex;
      console.log(colIndex);
      const key = new Date().getTime() + "";
      try {
        this.$set(row.columns[colIndex].list, newIndex, {
          ...row.columns[colIndex].list[newIndex],
          options: {
            ...row.columns[colIndex].list[newIndex].options,
            remoteFunc:
              row.columns[colIndex].list[newIndex].options.remoteFunc ||
              "func_" + key,
            remoteOption:
              row.columns[colIndex].list[newIndex].options.remoteOption ||
              "option_" + key
          },
          novalid: {
            ...row.columns[colIndex].list[newIndex].novalid
          },
          name:
            colIndex > 0
              ? row.columns[0].list[newIndex].name + "-" + colIndex
              : row.columns[0].list[newIndex].name,
          key:
            colIndex > 0
              ? row.columns[0].list[newIndex].model + "_" + colIndex
              : key.MD5().toUpperCase(),
          model:
            colIndex > 0
              ? row.columns[0].list[newIndex].model + "_" + colIndex
              : key.MD5().toUpperCase(),
          rules: row.columns[colIndex].list[newIndex].rules
            ? [...row.columns[colIndex].list[newIndex].rules]
            : []
        });
      } catch (error) {
        row.columns[colIndex].list = [];
        this.$message({
          showClose: true,
          message: "警告：必须按照顺序拖放",
          type: "error"
        });
        return;
      }
      this.$set(
        row.columns[colIndex].list,
        newIndex,
        _.cloneDeep(row.columns[colIndex].list[newIndex])
      );

      this.selectWidget = row.columns[colIndex].list[newIndex];
    },
    handleSelectChange(index, item) {
      setTimeout(() => {
        index >= 0
          ? (this.selectWidget = item.list[index])
          : (this.selectWidget = {});
      });
    }
  },
  watch: {
    select(val) {
      this.selectWidget = val;
    },
    selectWidget: {
      deep: true,
      handler(val) {
        this.$emit("update:select", val);
      }
    },
    rateOptions(val) {
      this.rateOptionList = val;
    }
  }
};
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
