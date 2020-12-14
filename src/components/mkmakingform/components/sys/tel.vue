<template>
	<el-input
		:type="type"
	    :placeholder="placeholder"
	    prefix-icon="el-icon-mobile-phone"
		:disabled="disabled"
		:clearable="clearable"
	    v-model="dataModel">
	  </el-input>
</template>

<script>
	export default {
		name:'mk-tel',
		props: ["widget", "disabled", "value","clearable","placeholder","type"],
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
