<template>
  <div>
    <div  :class="{disabled:element.options.disabled || !edit}">
      <el-radio-group
        v-bind:value="valueModel.value"
        :style="{width: isTable ? '100%' : element.options.width}"
        :disabled="!edit || element.options.disabled"
      >
        <div
          v-for="(item, index) in element.options.options"
          :key="index"
          :style="{display: element.options.inline ? 'inline-block' : 'block'}"
        >
          <el-radio
            :label="item.value"
            @click.native.prevent="clickitem(item)"
            :key="item.value + index"
          >
            <span>{{element.options.showLabel ? item.label : item.value}}</span>
          </el-radio>
          <el-input
            v-show="item.inputbox && item.checked"
            style="width:120px;"
            v-model="valueModel.remark"
            @input="onInput($event)"
          ></el-input>
        </div>
      </el-radio-group>
    </div>
    <div v-if="element.options.score == 1 && element.options.scoreHidden">
      <el-alert type="success" :closable="false">
        <div slot="title" style="font-size:16px;">评分：{{value.score}}</div>
      </el-alert>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: "m-radio",
  props: ["element", "value", "isTable",'edit'],
  data() {
    return {
      options: [],
      valueModel:this.value,
    };
  },
   computed: {
    ...mapState('d2admin/ecrf', [
      'rateOptions'
    ])
   },
  created() {
    
  },
  methods: {
    ...mapActions('d2admin/ecrf', [
      'rateOptionsSet'
    ]),
    clickitem(data) {
      // if(this.valueModel.remark != ''){

      // }else{
      //    this.value.remark = "";
      // }
      data.value === this.valueModel.value
        ? (this.$emit("input", { ...this.value,value: "" ,score:0}))
        : (this.$emit("input", { ...this.value,value:data.value }))
    },
    onInput(val) {
      this.value.remark = val;
    }
  },
  watch: {
    value :{
      deep:true,
      immediate:true,
      handler(val){
        let vals = val.value;
        this.valueModel = val;
        for (let i = 0; i < this.element.options.options.length; i++) {
          let item = this.element.options.options[i];
          this.$set(item, "checked", false);
          if (vals == item.value) {
            this.$set(item, "checked", true);
            this.value.score = item.SCORE || 0;
          }
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.disabled{
  position: relative;
}
.disabled::after{
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 7;
}
</style>
