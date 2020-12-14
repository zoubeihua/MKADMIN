<template>
<div class="units" :class="{'is-error':isError}">
  <el-input
    v-model.number='value.value'
    @input="onInput($event)"
    placeholder="请输入内容"
    :style="{width: width}"
    :disabled="disabled"
    clearable
    class="input-with-select"
  >
    <el-select
      v-bind:value='value.unit'
      @change="changeSelect"
      :disabled="disabled"
      slot="append"
      placeholder="单位"
    >
      <el-option
        v-for="item in list.options.options"
        :key="item.value"
        :value="item.value"
        :label="list.options.options.showLabel?item.label:item.value"
      ></el-option>
    </el-select>
  </el-input>
  <div class="error" v-if="isError">{{errorText}}</div>
  </div>
</template>
<script>
export default {
    name:'unit-input',
    props: ['value', 'list', 'width', 'disabled'],
    data(){
      return {
        isError:false,
        errorText:'错误'
      }
    },
    created(){

    },
    methods:{
        onInput(val){
          if(val == ''){
            this.isError = false;
            this.errorText = "错误";
            return
          }
          let opts = this.list.options.options;
          let validator = eval(this.list.options.validator);
          if(this.value.unit){
            let item = opts.find(key => key.value == this.value.unit)
            if(val < item.BEGINVAL || val > item.ENDVAL ){
               this.isError = true;
               this.errorText = '范围值：' + item.BEGINVAL + '~' + item.ENDVAL;
            }else{
              this.isError = false;
              this.errorText = "错误";
            }
          }
          if(validator != undefined){
             if(!validator.test(val)){
            this.isError = true;
            this.errorText = this.list.name + '验证失败';
          }else{
              this.isError = false;
              this.errorText = "错误";
            }
          }
            this.$emit('input', { value:val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1'),unit:this.value.unit})
        },
        changeSelect(val){
          let opts = this.list.options.options;
          if(this.value){
            let item = opts.find(key => key.value == val)
            if(this.value.value < item.BEGINVAL || this.value.value > item.ENDVAL ){
              this.isError = true;
              this.errorText = '范围值：' + item.BEGINVAL + '~' + item.ENDVAL;
            }else{
               this.isError = false;
               this.errorText = "错误";
            }
          }
            this.$emit('input', { value:this.value.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1'),unit:val})
        }
    }
};
</script>
<style >
.units.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner:focus{
  border-color: #f56c6c !important;
}
.units.is-error .error{
  color: #f56c6c;
    font-size: 12px;
}
</style>
