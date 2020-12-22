<template>
  <div style="width:100%" class="rangeinput el-input__inner">
      <div style="width:100%;">
        <el-input class="start" v-model="start"  @input="start=start.replace(/[^\d]/g,'')"  placeholder="范围" ></el-input>
      </div>
      <div class="fh">~</div>
      <div style="width:100%;">
        <el-input class="end" v-model="end" @input="end=end.replace(/[^\d]/g,'')" placeholder="范围" ></el-input>
      </div>
  </div>
</template>
<script>
export default {
    props:['value','startPlaceholder'],
    data() {
      return {
        start:'',
        end:''
      }
    },
    computed:{
      models(){
        if(this.start != '' && this.end != ''){
          if(parseInt(this.start) >= parseInt(this.end)){
            this.$message({
              type:'error',
              message:'开始值不能大于等于结束值'
            })
            return '';
          }else{
            return this.start + '-' + this.end;
          }
        }else{
          return '';
        }
      }
    },
    watch: {
      models(val){
        this.$emit('input',val)
      },
      value:{
        immediate:true,
        handler(val){
          if (val=='-1') return;
          let strArr = val.split('-');
          this.start = strArr[0] || '';
          this.end = strArr[1] || '';
        }
      }
    },
}
</script>
<style  scoped>
.start >>>.el-input__inner{
  border:0 !important;
  border-radius: 0;
  text-align: center;
}
.end >>>.el-input__inner{
  border:0 !important;
  border-radius: 0;
  text-align: center;
}
.rangeinput.el-input__inner{
  height: auto;
  line-height: inherit;
}
.fh{
  flex-basis: 60px;
  text-align: center;
  background:#efefef;
  height: 100%;
  padding: 0 16px;
}
  .rangeinput{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
