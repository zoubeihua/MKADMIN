<template>
  <el-pagination
    background
    :current-page.sync="pager[props.page]"
    :page-size="pager[props.rows]"
    :pager-count="7"
    :page-sizes="[10, 20, 30, 50,80,100,200,500,1000]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="pager[props.total]"
    @size-change="onChangeSize"
    @current-change="onChangePage"
  ></el-pagination>
</template>
<script>
export default {
  name: "mk-page",
  props: {
    pager: {
      type: Object,
      required: true
    },
    refresh: {
      type: Boolean
    },
    props: {
      type: Object,
      required: false,
      default: () => ({
        page: "page", // 第几页
        rows: "rows", // 显示条数
        total: "count" // 总记录条数
      })
    }
  },
  // 设置绑定参数
  model: {
    prop: "pager",
    event: "setPager"
  },
  computed: {
    total() {
      return this.pager[this.props.total] || 0;
    },
    // 检测获取到的数据是否为空
    isEmptyList() {
      return (
        Math.ceil(this.pager[this.props.total] / this.pager[this.props.rows]) <
        this.pager[this.props.page]
      );
    }
  },
  watch: {
    total() {
      // 存在记录但未获取到数据时, 重新请求
      if (this.pager[this.props.page] > 1 && this.isEmptyList) {
        this.$emit(
          "setPager",
          Object.assign(this.pager, {
            [this.props.page]: this.pager[this.props.page] - 1
          })
        );
        this.$emit("query");
      }
    }
  },
  methods: {
    // 每页条数
    onChangeSize(rows) {
      const temp = {
        [this.props.rows]: rows,
        // 当显示条数小于或等于总条数时，重置页数
        [this.props.page]: rows <= this.total ? 1 : this.pager[this.props.page]
      };

      this.$emit("setPager", Object.assign(this.pager, temp));
      // 触发父组件查询请求
      this.$emit("query");
    },
    // 翻页
    onChangePage(page) {
      this.$emit(
        "setPager",
        Object.assign(this.pager, { [this.props.page]: page })
      );
      this.$emit("query");
    }
  }
};
</script>