<template>
  <div
    v-if="element && element.key"
    class="widget-table-view"
    :class="{active: selectWidget.key == element.key, 'is_req': element.options.required}"
    @click.stop="handleSelectWidget(index)"
    :style="{width: !element.options.width || element.options.width == '100%' ? '200px' : element.options.width}"
  >
    <el-table row-class-name="widget-table-row" :data="[{}]">
      <el-table-column :label="element.name">
        <widget-element-item :element="element" :is-table="true"></widget-element-item>
      </el-table-column>
    </el-table>

    <div class="widget-view-action" v-if="selectWidget.key == element.key">
      <i class="iconfont icon-icon_clone" @click.stop="handleWidgetClone(index)"></i>
      <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index,element)"></i>
    </div>
    <div class="widget-view-drag" v-if="selectWidget.key == element.key">
      <i class="iconfont icon-drag drag-widget"></i>
    </div>

    <!-- <div class="widget-view-model" v-if="element.options.dataBind">
    <span>{{element.model}}</span>
    </div>-->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import WidgetElementItem from "./WidgetElementItem";
import _ from "lodash";
import MD5 from "@/libs/util.md5.js";

export default {
  components: {
    WidgetElementItem
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
      this.selectWidget = this.data[index];
    },
    handleWidgetDelete(index, element) {
      if (this.data.length == 1) {
        this.$emit("select-change", -1);
      } else {
        if (this.data.length - 1 == index) {
          this.$emit("select-change", index - 1);
        } else {
          this.$emit("select-change", index);
        }
      }
      if (this.rateOptions.length > 0) {
        for (let i = 0; i < this.rateOptionList.length; i++) {
          if (element.model == this.rateOptionList[i].model) {
            this.rateOptionList.splice(i, 1);
          }
        }
      }
      console.log();
      this.$nextTick(() => {
        this.data.splice(index, 1);
      });
    },
    handleWidgetClone(index) {
      const key = new Date().getTime() + "";
      let cloneData = {
        ..._.cloneDeep(this.data[index]),
        key: key.MD5().toUpperCase(),
        model: key.MD5().toUpperCase()
      };

      this.data.splice(index + 1, 0, cloneData);

      this.$nextTick(() => {
        this.selectWidget = this.data[index + 1];
      });
    }
  },
  watch: {
    select(val) {
      this.selectWidget = val;
    },
    selectWidget: {
      handler(val) {
        this.$emit("update:select", val);
      },
      deep: true
    },
    rateOptions(val) {
      this.rateOptionList = val;
    }
  }
};
</script>
