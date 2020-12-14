<template>
  <div class="mkImg" :style="{'textAlign':align}">
    <img :src="value" alt=""  :style="{width: width+'px', height: height+'px'}">
  </div>
</template>
<script>
export default {
  name:'mk-img',
  props:{
    value: {
      type: String,
      default: () => 'http://i0.sinaimg.cn/IT/images/2013-03-20/U74P2T78D24705F3303DT20130320151120.jpg'
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    align:{
      type:String,
      default: 'center'
    }
  },
  watch:{
    value(val){
      this.$emit('input',val)
    }
  }
}
</script>
<style lang="scss" scoped>
.mkImg{
  width: 100%;
  overflow: hidden;
}
</style>
