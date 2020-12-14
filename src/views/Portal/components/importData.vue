<template>
	<el-container>
		<el-header>
			<el-steps :active="active" style="width: 100%;">
			  <el-step title="下载模板"></el-step>
			  <el-step title="导入数据" ></el-step>
			</el-steps>
		</el-header>
		<el-main style="display: flex; align-items: center;justify-content: center;">
			<template v-if="active == 1">
				<div class="download" @click="download">
					<i class="el-icon-download iconFontSize"></i>
					<span class="downloadFontSize">下载模板</span>
				</div>
			</template>
			<template v-else>
				<el-upload
				  class="upload-demo"
				  drag
				  action="https://jsonplaceholder.typicode.com/posts/"
				  >
				  <i class="el-icon-upload"></i>
				  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				  <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过20M</div>
				</el-upload>
			</template>
		</el-main>
		<el-footer style="justify-content: center;">
			<el-button-group>
			  <el-button type="primary" v-if="active == 2">保存</el-button>
			  <el-button type="primary" @click="$emit('close',false)">取消</el-button>
			</el-button-group>
		</el-footer>
	</el-container>
</template>

<script>
	export default {
		data(){
			return {
				active:1
			}
		},
		methods:{
			download(){
				this.active = 2;
			}
		}
	}
</script>

<style scoped>
	.download{
		width: 80%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #ededed;
		height: 46px;
		transition: all .8s;
		cursor: pointer;
	}
	.download:hover{
		background-color: #cbcbcb;
	}
	.iconFontSize{
		font-size: 30px;
	}
	.downloadFontSize{
		font-size: 20px;
	}
</style>
