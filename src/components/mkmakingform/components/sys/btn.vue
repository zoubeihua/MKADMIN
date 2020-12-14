<template>
	<div style="width: 100%;" :style="{textAlign:position}">
		<el-button :type="type" :disabled="disabled" :plain="plain" :round="round" :style="{width: width }" @click="SubmitEvent">提交</el-button>
	</div>
</template>

<script>
	import to from "await-to-js";
	import dayjs from 'dayjs'
	export default {
		name:'mk-btn',
		inject: ['generateForm'],
		props: ["size","type","disabled","plain","round","circle","width","position","script"],
		methods:{
			SubmitEvent(){
				let vm = this;
				try{
					let func =  new Function('vm','to','dayjs',this.script);
					func(vm,to,dayjs,this.script)
				}catch(e){
					let txt = `脚本中存在错误。\n错误描述：${e}`
					console.error(txt);
				}
				
				// this.generateForm.getData()
				// .then(res => {
				// 	console.log(res)
				// })
			}
		}
	}
</script>

<style>
</style>
