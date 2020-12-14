<template>
  <div>
    <div class="m-select" :style="{display: inputbox && checked ? 'flex' :''}">
      <div style="flex:2;padding-right:6px;">
        <el-select
          v-bind:value="value.value"
          :disabled="!edit || element.options.disabled"
          :filter-method="filterSearch"
          :multiple="element.options.multiple"
          :clearable="element.options.clearable"
          :placeholder="element.options.placeholder"
          @clear="clear"
          :style="{width: isTable ? '100%' : element.options.width}"
          :filterable="element.options.filterable"
        >
          <el-option
            v-for="item in optionsCopy"
            :key="item.value"
            :value="item.value"
            :label="element.options.showLabel || element.options.remote?item.label:item.value"
          >
            <div
              @click="clickitem(item)"
            >{{ element.options.showLabel || element.options.remote?item.label:item.value }}</div>
          </el-option>
        </el-select>
      </div>
      <div style="flex:1">
        <el-input
          v-show="inputbox && checked"
          style="width:100%;"
          v-model="value.remark"
          @input="onInput($event)"
        ></el-input>
      </div>
    </div>
    <div v-if="element.options.score == 1 && element.options.scoreHidden" style="margin-top:10px;">
      <el-alert type="success" :closable="false">
        <div slot="title" style="font-size:16px;">评分：{{value.score}}</div>
      </el-alert>
    </div>
  </div>
</template>
<script>
export default {
  name: "m-select",
  props: ["element", "value", "isTable", "edit"],
  data() {
    return {
      inputbox: false,
      checked: false,
      optionsCopy:[]
    };
  },
  created() {
    this.optionsCopy = JSON.parse(JSON.stringify(this.element.options.options))
  },
  methods: {
    //数据源筛选
    filterSearch(val) {
      if (val !== "") {
        this.optionsCopy = this.element.options.options.filter(item => {
          //支持拼音码,名称检索
          return item.FILTERSTR.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.label.toLowerCase().indexOf(val.toLowerCase()) > -1;
        });
      } else {
        this.optionsCopy = this.element.options.options;
      }
    },
    clear() {
      this.$emit("input", { value: "", remark: "", score: "" });
    },
    clickitem(data) {
       this.value.remark = '';
      this.$emit("input", {...this.value, value: data.value });
    },
    onInput(val) {
      this.value.remark = val;
    }
  },
  watch: {
    value:{
      deep:true,
      immediate:true,
      handler(val){
        let vals = val.value;
        for (let i = 0; i < this.element.options.options.length; i++) {
          let item = this.element.options.options[i];
          if (vals == item.value) {
            this.value.score = item.SCORE || "";
            if (item.inputbox) {
              this.inputbox = true;
              this.checked = true;
            } else {
              this.inputbox = false;
              this.checked = false;
            }
          }
        }
      }
    }
  }
};
</script>
