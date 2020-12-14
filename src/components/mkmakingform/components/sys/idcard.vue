<template>
	<el-input
	    :placeholder="placeholder"
	    prefix-icon="icon iconfont icon-credentials_icon"
		:disabled="disabled"
		:clearable="clearable"
	    v-model="dataModel">
	  </el-input>
</template>

<script>
	export default {
		name:'mk-tel',
		props: ["widget", "disabled", "value","clearable","placeholder"],
		data(){
			return {
				dataModel: this.value,
			}
		},
		watch:{
			dataModel(val){
				this.$emit('input',val);
			},
			value(val){
				this.dataModel = val;
			}
		}
		
	}
</script>

<style scoped>
	::v-deep .el-input__icon.icon{
		font-size: 18px !important;
	}
</style>
