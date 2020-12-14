<template>
	<el-input
	    :placeholder="placeholder"
	    prefix-icon="icon iconfont icon-xingming"
		:disabled="disabled"
		:clearable="clearable"
	    v-model="dataModel">
	  </el-input>
</template>

<script>
	export default {
		name:'mk-name',
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
		font-size: 20px !important;
	}
</style>
