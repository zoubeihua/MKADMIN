<template>
	<el-input
		:type="type"
	    :placeholder="placeholder"
	    prefix-icon="icon iconfont icon-nianlingguangfan-02"
		:disabled="disabled"
		:max="max"
		:min="min"
		:clearable="clearable"
	    v-model="dataModel">
	  </el-input>
</template>

<script>
	export default {
		name:'mk-age',
		props: ["widget", "disabled", "value","clearable","placeholder","max","min","type"],
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
		font-size: 26px !important;
	}
</style>
