<template>
  <el-col :span="element.options.span">
    <div>
      <el-form-item
        class="widget-view"
        v-if="element && element.key && element.type != 'divider'"
        :class="{active: selectWidget.key == element.key, 'is_req': element.options.required, 'is_hidden': element.options.hidden,'is_quesion': !element.options.question}"
        :label-width="element.options.isLabelWidth ? element.options.labelWidth + 'px' : ''"
        @click.native.stop="handleSelectWidget(index)"
      >
        <span slot="label" v-if="element.labelHidden">{{element.name}}</span>
        <widget-element-item :element="element" :is-table="false"></widget-element-item>

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
      </el-form-item>
      <div
        class="widget-view no-put"
        v-if="element && element.key && element.type == 'divider'"
        :class="{active: selectWidget.key == element.key, 'is_hidden': element.options.hidden}"
        @click.stop="handleSelectWidget(index)"
        style="padding-bottom: 0;"
      >
        <el-divider :content-position="element.options.contentPosition">
          <span v-if="element.options.labelHidden">{{element.name}}</span>
        </el-divider>

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
    </div>
  </el-col>
</template>

<script>
import { mapState, mapActions } from "vuex";
import WidgetElementItem from "./WidgetElementItem";
import _ from "lodash";
import { MD5 } from "@/libs/util.md5.js";
export default {
  props: ["element", "select", "index", "data"],
  components: {
    WidgetElementItem
  },
  data() {
    return {
      selectWidget: this.select,
      rateOptionList: []
    };
  },
  created() {
    this.rateOptionList = this.rateOptions;
  },
  computed: {
    ...mapState("d2admin/ecrf", ["rateOptions"])
  },
  mounted() {},
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
      if (this.rateOptions.length > 0) {
        for (let i = 0; i < this.rateOptionList.length; i++) {
          if (element.model == this.rateOptionList[i].model) {
            this.rateOptionList.splice(i, 1);
          }
        }
      }
      this.$nextTick(() => {
        this.data.list.splice(index, 1);
      });
    },
    handleWidgetClone(index) {
      const key = new Date().getTime() + "";
      let cloneData = {
        ..._.cloneDeep(this.data.list[index]),
        key: key.MD5().toUpperCase(),
        model: key.MD5().toUpperCase()
      };

      this.data.list.splice(index + 1, 0, cloneData);

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1];
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
