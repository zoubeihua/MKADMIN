<template>
  <div class="selctTableContent" style="width:100%;">
    <div class="el-select" @click="Inputfocus" ref="input" style="width:100%;">
		<el-input 
		style="width:100%;"
		type="text"
		readonly="readonly"
		:disabled="disabled"
		@focus="show"
		v-model="value"
		:placeholder="placeholder"
		ref="focus"
		v-clickoutside="handleClose"
		></el-input>
    </div>
    <div ref="listWrap" class="el-select-dropdown el-popper dropdownstyle" v-show="visible">
      <el-container>
        <el-header style="padding:0;" v-if="VShowHeader">
          <slot name="header" />
        </el-header>
        <el-main style="padding:0;">
          <el-table
            :data="url?rowData:tableData"
            border
            ref="mutipleTable"
            :height="height"
            highlight-current-row
            @row-click="cellClickEvent"
            @selection-change="handleSelectionChange"
          >
            <!--endregion-->
            <!--region 数据列-->
            <template v-for="(column, index) in columns">
              <el-table-column
                :prop="column.prop"
                :key="column.label"
                :label="column.label"
                :width="column.width"
                :align="column.align"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <template v-if="!column.render">
                    <template v-if="column.formatter">
                      <span v-html="column.formatter(scope.row, column)"></span>
                    </template>
                    <template v-else>
                      <span>{{scope.row[column.prop]}}</span>
                    </template>
                  </template>
                  <template v-else>
                    <expand-dom
                      :column="column"
                      :row="scope.row"
                      :render="column.render"
                      :index="index"
                    ></expand-dom>
                  </template>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </el-main>
        <el-footer style="padding:0;" v-if="VShowFooter">
          <mk-page :pager="pager" @query="getData" />
        </el-footer>
      </el-container>
    </div>
  </div>
</template>
<script>
import Clickoutside from "@/directives/clickoutside";
export default {
  name: "mk-select-table",
  props: {
    value: "",
    url: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    VShowHeader: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: "460",
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    //如果不显示分页params 参数tag传1 默认分页0
    VShowFooter: {
      type: Boolean,
      default: true,
    },
    //数据源key
    sourcekey: {
      type: String,
      default: "data",
    },
    //参数
    params: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    //数据列表
    tableData: {
      //表数据源,配置了url就不用传这个参数了
      type: Array,
      default: () => {
        return [];
      },
    },
    // 需要展示的列 === prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽
    columns: {
      type: Array,
      default: () => [],
    },
  },
  //组件
  components: {
    expandDom: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
          type: Object,
          default: null,
        },
      },
      render: (h, ctx) => {
        const params = {
          row: ctx.props.row,
          index: ctx.props.index,
        };
        if (ctx.props.column) params.column = ctx.props.column;
        return ctx.props.render(h, params);
      },
    },
  },
  directives: { Clickoutside },
  data() {
    return {
      visible: false,
      rowData: [],
      pager: {
        page: 1,
        rows: 20,
        count: 0,
      },
      multipleSelection: [], // 多行选中
    };
  },
  computed: {
    popperElm() {
      return this.$refs.listWrap;
    },
  },
  watch: {
    value(val) {},
  },
  created() {
    if (!this.url) return;
    this.getData();
  },
  mounted() {},
  methods: {
    Inputfocus() {
      this.$refs.focus.focus();
    },
    getData() {
      let data = { ...this.pager, ...this.params };
      if (!this.VShowFooter) {
        data.tag = 1;
      }
      this.MK.Request(this.url, "get", data).then((res) => {
        if (res.code == 0) {
          this.rowData = res[this.sourcekey];
          this.pager.count = res.count;
        }
      });
    },
    // 多行选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit("handleSelectionChange", val);
    },
    cellClickEvent(row) {
      if (!this.label) {
        this.$message.error("请先设置input显示的lable");
        return;
      }
      this.$emit("input", row[this.label]);
      this.$emit("change", row);
      this.hiden();
    },
    handleClose() {
      if (!this.visible) return;
      this.visible = false;
    },
    show() {
      let DOMRect = this.$refs.input.getBoundingClientRect();
      console.log(DOMRect, this.popperElm);
      this.popperElm.style.position = "fixed";
      this.popperElm.style.minWidth = "auto";
      // this.popperElm.style.width = DOMRect.width + "px";
      // this.popperElm.style.height = this.height + "px";
      this.popperElm.style.left = DOMRect.left + "px";
      this.visible = true;
    },
    hiden() {
      this.visible = false;
    },
  },
};
</script>
<style  scoped>
>>> .el-tag.el-tag--success .el-tag__close {
  color: #f0f9eb;
}
.selctTableContent {
  position: relative;
  width: 100%;
}
.dropdownstyle {
}
</style>
