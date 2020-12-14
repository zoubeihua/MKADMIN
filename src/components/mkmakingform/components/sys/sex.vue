<template>
	<el-radio-group v-model="dataModel" :disabled="disabled">
	    <el-radio label="1">男</el-radio>
	    <el-radio label="2">女</el-radio>
	</el-radio-group>
</template>

<script>
	export default {
		name:'mk-sex',
		props: [ "disabled", "value"],
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

<style>
</style>
