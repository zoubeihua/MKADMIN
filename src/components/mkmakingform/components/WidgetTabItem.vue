<template>
  <el-col :span="element.options.span">
    <div
      class="widget-tab widget-view"
      :class="{
      active: selectWidget.key && selectWidget.key == element.key,
      'is_hidden': element.options.hidden
    }"
      @click.stop="handleSelectWidget(index)"
    >
      <el-tabs
        v-model="tabActive"
        :type="element.options.type"
        :tab-position="element.options.tabPosition"
      >
        <el-tab-pane
          :key="item.name"
          :label="item.label"
          :name="item.name"
          v-for="(item, index) in element.tabs"
        >
          <draggable
            v-model="item.list"
            v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
            :no-transition-on-drag="true"
            @add="handleWidgetTabAdd($event, element, index)"
          >
            <transition-group name="fade" tag="div" class="widget-col-list">
              <template v-for="(tab, tabindex) in item.list" v-if="tab && tab.key">
                <widget-tab-item
                  v-if="tab.type === 'tabs'"
                  :key="tab.key"
                  :element="tab"
                  :select.sync="selectWidget"
                  :index="tabindex"
                  :data="item"
                  @select-change="handleSelectChange($event, item)"
                ></widget-tab-item>

                <widget-table
                  v-else-if="tab.type === 'table'"
                  :key="tab.key"
                  :element="tab"
                  :select.sync="selectWidget"
                  :index="tabindex"
                  :data="item"
                  @select-change="handleSelectChange($event, item)"
                ></widget-table>

                <widget-col-item
                  v-else-if="tab.type == 'grid'"
                  :key="tab.key"
                  :element="tab"
                  :select.sync="selectWidget"
                  :index="tabindex"
                  :data="item"
                  @select-change="handleSelectChange($event, item)"
                ></widget-col-item>

                <widget-row-matrix-item
                  v-else-if="tab.type == 'rowmatrix'"
                  :key="tab.key"
                  :element="tab"
                  :select.sync="selectWidget"
                  :index="tabindex"
                  :data="item"
                  @select-change="handleSelectChange($event, item)"
                ></widget-row-matrix-item>

                <widget-form-item
                  v-else
                  :key="tab.key"
                  :element="tab"
                  :select.sync="selectWidget"
                  :index="tabindex"
                  :data="item"
                  @select-change="handleSelectChange($event, item)"
                ></widget-form-item>
              </template>
            </transition-group>
          </draggable>
        </el-tab-pane>
      </el-tabs>

      <div class="widget-view-action widget-col-action" v-if="selectWidget.key == element.key">
        <i class="iconfont icon-icon_clone" @click.stop="handleTabClone(index)"></i>
        <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index,element)"></i>
      </div>

      <div class="widget-view-drag widget-col-drag" v-if="selectWidget.key == element.key">
        <i class="iconfont icon-drag drag-widget"></i>
      </div>
    </div>
  </el-col>
</template>

<script>
import { mapState, mapActions } from "vuex";
import WidgetFormItem from "./WidgetFormItem";
import WidgetTable from "./WidgetTable";
import Draggable from "vuedraggable";
import _ from "lodash";
import { CloneLayout } from "../util/layout-clone.js";
import MD5 from "@/libs/util.md5.js";

export default {
  name: "widget-tab-item",
  components: {
    WidgetFormItem,
    WidgetTable,
    Draggable,
    WidgetColItem: () => import("./WidgetColItem.vue"),
    WidgetRowMatrixItem: () => import("./WidgetRowMatrixItem.vue")
  },
  props: ["element", "select", "index", "data"],
  data() {
    return {
      tabActive: this.element.tabs[0].name,
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
    handleTabClone(index) {
      let cloneData = _.cloneDeep(this.data.list[index]);

      this.data.list.splice(index + 1, 0, CloneLayout(cloneData));

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1];
      });
    },
    handleWidgetTabAdd($event, element, tabIndex) {
      const newIndex = $event.newIndex;

      const key = new Date().getTime() + "";

      this.$set(element.tabs[tabIndex].list, newIndex, {
        ...element.tabs[tabIndex].list[newIndex],
        options: {
          ...element.tabs[tabIndex].list[newIndex].options,
          remoteFunc:
            element.tabs[tabIndex].list[newIndex].options.remoteFunc ||
            "func_" + key,
          remoteOption:
            element.tabs[tabIndex].list[newIndex].options.remoteOption ||
            "option_" + key
        },
        key: key.MD5().toUpperCase(),
        model: element.tabs[tabIndex].list[newIndex].model
          ? element.tabs[tabIndex].list[newIndex].model
          : key.MD5().toUpperCase(),
        rules: element.tabs[tabIndex].list[newIndex].rules
          ? [...element.tabs[tabIndex].list[newIndex].rules]
          : []
      });

      this.$set(
        element.tabs[tabIndex].list,
        newIndex,
        _.cloneDeep(element.tabs[tabIndex].list[newIndex])
      );

      this.selectWidget = element.tabs[tabIndex].list[newIndex];
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

