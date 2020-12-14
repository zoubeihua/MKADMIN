<template>
  <el-select
    :value="value"
    @change="changeVal"
    :multiple="multiple"
    :multiple-limit="limit"
    @remove-tag="removetag"
    :disabled="disabled"
    filterable
    :collapse-tags="collapseTags"
    :clearable="clearable"
    :filter-method="filterSearch"
    :placeholder="placeholder"
    :style="{width: width}"
    :size="size"
  >
    <el-option :label="custom" value v-if="custom != ''"></el-option>
    <el-option
      v-for="item in data"
      :value-key="item[val]"
      :key="item[val]"
      :label="item[label]"
      :value="item[val]"
      :disabled="item.disabled || false"
    >
      <div v-if="isSlot">
        <slot name="option" v-bind:item="item"></slot>
      </div>
      <!-- 收费项目自定义下拉 -->
      <div v-if="isRights">
        <div class="custom-option">
          <el-tooltip
            :disabled="!(item.itemname.length > 20) "
            class="item"
            effect="dark"
            :content="item.itemname"
            placement="top"
          >
            <span class="content">{{item.itemname}}</span>
          </el-tooltip>
          <span>
            价格：
            <el-tag :type="getTagType(item.price)" size="mini">￥{{item.price}}</el-tag>
          </span>
        </div>
      </div>
    </el-option>
  </el-select>
</template>
<style>
.el-select {
  width: 100%;
}
.custom-option {
    display: flex;
    align-items: center;
}
.content {
  display: inline-block;
  width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-right: 40px;
}
</style>
<script>
export default {
  name: "mk-select",
  props: {
    value: {},
    placeholder: {
      type: String,
      default: "请选择"
    },
    custom: {
      default: ""
    },
    isSlot: {
      default: false
    },
    isRights: {
      default: false
    },
    isSlot: {
      default: false
    },
    disabled: {
      default: false
    },
    collapseTags: {
      default: false
    },
    clearable: {
      default: true
    },
    limit: {
      type: Number,
      default: 0
    },
    multiple: {
      type: Boolean,
      default: false
    },
    filter: {
      type: [String, Array],
      default: "label"
    },
    interface: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: "label"
    },
    val: {
      type: String,
      default: "value"
    },
    url: {
      type: String,
      default: ""
    },
    param: {
      type: Object
    },
    datas: {
      type: [Array, Object]
    },
    width: {
      type: String
    },
    size: {
      type: String
    },
    globalFn: {
      type: Boolean
    }
  },
  watch: {
    datas(newV, oldV) {
      // watch监听props里status的变化，然后执行操作
      this.data = newV;
      this.filterList = newV;
    }
  },
  mounted() {
    if (this.url != "") {
      this.getSelectList(this.param);
    } else {
      this.data = this.datas;
      this.filterList = this.datas;
    }
  },
  data() {
    return {
      filterList: [],
      data: []
    };
  },
  computed: {
    newValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    getTagType(price) {
      if (price < 100) {
        return "info";
      } else if (price >= 100 && price < 1000) {
        return "primary";
      } else if (price >= 1000 && price < 10000) {
        return "warning";
      } else {
        return "danger";
      }
    },
    filterSearch(val) {
      console.log(this.filter);
      if (val !== "") {
        var filterArr = [];
        for (var index in this.filterList) {
          for (var i = 0; i < this.filter.length; i++) {
            if (
              this.filterList[index][this.filter[i]]
                .toLowerCase()
                .indexOf(val.toLowerCase()) > -1
            ) {
              filterArr.push(this.filterList[index]);
            }
          }
        }
        this.data = filterArr;
      } else {
        this.data = this.filterList;
      }
    },
    getSelectList(param) {
      if (this.globalFn) {
        this.filterList = this.getDicStandarDcode(param.codetype);
        this.data = this.getDicStandarDcode(param.codetype);
      } else {
        this.MK.Request(this.url, "get", param).then(res => {
          try {
            let resData = res.data;
            this.filterList = resData;
            this.data = resData;
          } catch (error) {}
        });
      }
    },
    changeVal(val) {
      this.$emit("input", val);
      let obj = {};
      if (val != "") {
        if (!this.multiple) {
          //判断多选或者单选 多选返回数组 单选返回对象
          let data = this.data.filter(item => item[this.val] == val);
          let resData = data[0];
          obj = resData;
          // obj[this.val] = resData[this.val];
          // obj[this.label] = resData[this.label];
        } else {
          obj = [];
          this.data.forEach(item => {
            if (val.indexOf(item[this.val]) >= 0) {
              // let opt = {};
              // opt[this.val] = item[this.val];
              // opt[this.label] = item[this.label];
              obj.push(item);
            }
          });
        }
      } else {
        if (!this.multiple) {
          //判断多选或者单选 多选返回数组 单选返回对象
          obj[this.val] = "";
          obj[this.label] = "";
        } else {
          obj = [];
        }
      }
      this.$emit("change", obj);
    },
    removetag(val) {
      this.$emit("removetag", val);
    }
  }
};
</script>
