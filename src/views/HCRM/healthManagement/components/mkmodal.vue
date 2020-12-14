<template>
  <el-container v-if="Modal">
    <vxe-modal v-model="Modal" :title="title" :zIndex="zIndex" :fullscreen="fullscreen" :showFooter="true" @close="closeModal" :width="width" :height="height">
      <div slot="title">
        <slot name="header"></slot>
      </div>
      <slot></slot>
      <div slot="footer" style="text-align:center;">
        <slot name="footer"></slot>
      </div>
    </vxe-modal>
  </el-container>
</template>
<script>
export default {
  name: "MkModal",
  props:{
    width:{
      type:String,
      default:'540'
    },
    height:{
      type:String,
      default:'540'
    },
    title:{
      type:String,
      default:'维护'
    },
    fullscreen:{
      type:Boolean,
      default:false
    },
    zIndex:{
      type:Number,
      default:() => 99
    }
  },
  data() {
    return {
      Modal:false
    };
  },
  mounted(){


  },

  methods: {
    open(data){
      if(data){

      }
      this.Modal = true;

    },
    close(){
      this.Modal = false;
    },
    closeModal( type, $event){
      console.log(type,$event)
      this.$emit('close')
    }
  }
};
</script>
