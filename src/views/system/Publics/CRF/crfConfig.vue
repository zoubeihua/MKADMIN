<template>
  <mk-making-form ref="makingForm"
  :basic-fields="
	['input','textarea','number','units',
	'radio','checkbox','time','date',
	'score','select','text','slider',
	'html','img','name','sex','age','idcard','address','tel']"
  :advance-fields="['imgupload','table','rowmatrix','oralcavity','btn']"
  :layout-fields="['grid','tabs','divider']"
  upload preview generate-code generate-json clearable>
   <template slot="action">
   	<el-button type="text" size="medium" icon="el-icon-back" @click="back">返回</el-button>
   </template>
  </mk-making-form>
</template>
<script>
import mkMakingForm from "@c/mkmakingform/components/Container";
export default {
	name:'crfConfig',
   components: {
    mkMakingForm
  },
  activated() {
  	this.$refs.makingForm.setWidForm()
  },
  methods:{
	  //返回
	  back() {
	    this.$router.go(-1);
	  },
  }
}
</script>
<style lang="scss" scoped>

</style>
