<template>
  <el-select
    :value="value"
    @change="changeVal"
    :multiple="multiple"
    :multiple-limit="limit"
    @remove-tag="removetag"
    :class="[disabled?'tagRemoveIcon':'']"
    filterable
    :collapse-tags="collapseTags"
    :clearable="clearable&&!disabled"
    :filter-method="filterSearch"
    :placeholder="placeholder"
    :style="{width: width}"
    :size="size"
    :disabled="disabled"
  >
    <el-option :label="custom" value v-if="custom != ''" :disabled="disabled"></el-option>
    <el-option
      v-for="item in data"
      :value-key="item[val]"
      :key="item[val]"
      :label="item[label]"
      :value="item[val]"
      :disabled="item.disabled || disabled||false"
    >
      <div v-if="isSlot">
        <slot name="option" v-bind:item="item"></slot>
      </div>
    </el-option>
  </el-select>
</template>
<style>
.el-select {
  width: 100%;
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
    },
    retureType: {
      type: String
    },
    isInit: {
      type:Boolean,
      default: true
    }
  },
  watch: {
    datas(newV, oldV) {
      // watch监听props里status的变化，然后执行操作
      this.data = newV;
      this.filterList = newV;
    },
    // 判断第一个参数的更新 重新请求
    param(oldVal, newVal) {
      for (var key in oldVal) {
        oldVal[key];
      }
      for (var key in newVal) {
        newVal[key];
      }
      
      if (oldVal[key] != newVal[key]) {
        // 如果是初始化导致参数更新 则不需要重新 此为大坑QAQ
        if(!this.isInit) {
          this.getSelectList(this.param);
        }
      }
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
        if(param==undefined){
          return;
        }
        this.filterList = this.getDicStandarDcode(param.codetype);
        this.data = this.getDicStandarDcode(param.codetype||"");
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
          if (this.retureType == "1") {
            obj = [];
            this.data.forEach(item => {
              if (val.indexOf(item[this.val]) >= 0) {
                let opt = {};
                opt[this.val] = item[this.val];
                opt[this.label] = item[this.label];
                obj.push(opt);
              }
            });
            console.log(obj)
          }
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
<style lang="scss">
.tagRemoveIcon {
  .el-tag.el-tag--info .el-tag__close {
    display: none !important;
  }
}
</style>