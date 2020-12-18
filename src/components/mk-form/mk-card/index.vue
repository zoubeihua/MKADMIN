<template>
  <div class="info-card-wrapper mk-card mk-card-dis-hover " :class="[shadow ? 'mk-card-shadow' : '']">
    <div class="mk-card-body" :style="{ padding:padding + 'px' }">
        <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
    name:'mk-card',
    props:{
        shadow:{
            type:Boolean,
            default:true
        },
        padding:{
            type: Number,
            default: 16,
        }
    }
}
</script>
<style lang="less" scoped>
.info-card-wrapper,
.info-card-wrapper .mk-card-body {
  width: 100%;
  height: 100%;
}
.info-card-wrapper {
  overflow: hidden;
}
.mk-card-shadow {
  -webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
}
.mk-card {
  background: #fff;
  border-radius: 4px;
  font-size: 14px;
  position: relative;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
</style>