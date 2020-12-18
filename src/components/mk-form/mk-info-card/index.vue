<template>
  <mk-card :padding="0">
      <div class="content-con">
        <div
          class="left-area"
          :style="{ background: color, width: leftWidth }"
        >
        <d2-icon :name="icon" :style="{fontSize:iconSize + 'px',color:'#fff'}" />
        </div>
        <div class="right-area" :style="{ width: rightWidth }">
          <div>
            <slot></slot>
          </div>
        </div>
      </div>
  </mk-card>
</template>

<script>
import MkCard from '@/components/mk-form/mk-card'
export default {
  name: "InforCard",
  components:{
      MkCard
  },
  props: {
    left: {
      type: Number,
      default: 36,
    },
    color: {
      type: String,
      default: "#2d8cf0",
    },
    icon: {
      type: String,
      default: "",
    },
    iconSize: {
      type: Number,
      default: 20,
    },
    shadow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    leftWidth() {
      return `${this.left}%`;
    },
    rightWidth() {
      return `${100 - this.left}%`;
    },
  },
};
</script>
<style lang="less" scoped>

.common{
  float: left;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.size{
  width: 100%;
  height: 100%;
}
.middle-center{
  display: table-cell;
  vertical-align: middle;
}
.info-card-wrapper{
  .size;
  overflow: hidden;
  .mk-card-body{
    .size;
  }
  .content-con{
    .size;
    position: relative;
    .left-area{
      .common;
      & > .icon{
        .middle-center;
      }
    }
    .right-area{
      .common;
      & > div{
        .middle-center;
      }
    }
  }
}
</style>