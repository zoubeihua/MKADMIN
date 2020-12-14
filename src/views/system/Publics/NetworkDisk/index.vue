<template>
	<d2-container>
		<template slot="header">
			<div style="display: flex;justify-content: space-between;width: 100%;">
				<el-form :inline="true">
					<el-form-item>
						<el-upload class="upload-demo" action="" :show-file-list="false" :http-request="uploadSectionFile" multiple>
							<el-button size="small" type="primary"><i class="el-icon-upload el-icon--left"></i>点击上传</el-button>
							<div slot="tip" class="el-upload__tip"></div>
						</el-upload>
					</el-form-item>
				</el-form>
				<el-form :inline="true">
					<el-form-item>
						<el-input style="width:300px;" v-model="pager.condition" placeholder="查询"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button-group>
							<el-button type="primary" icon="el-icon-search">查询</el-button>
						</el-button-group>
					</el-form-item>
				</el-form>
			</div>
		</template>

		<template slot="footer">
			<!-- <mk-page :pager="pager" @query="CRFForm_Get" /> -->
		</template>
	</d2-container>
</template>

<script>
	import {
		mapState,
		mapActions
	} from "vuex";
	import pageStatus from "@/minxins/pagestatus.js";
	export default {
		name: "NetworkDisk-index",
		mixins: [pageStatus],
		computed: {},
		data() {
			return {
				pager: {
					condition: "", //查询条件
					tag: "0", //1 不分页,查询所有 0:分页 (默认:0)
					count: 0,
					page: 1,
					rows: 20
				},
				fromData: {

				}
			};
		},
		computed: {},
		created() {

		},
		methods: {
			uploadSectionFile(e) {
				let file = e.file;
				let name = file.name;
				console.log(e)
				let form = new FormData();
				form.append('file', file);
				console.log(form)
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = res => {
					// console.log(tres)
				}
				// console.log(this.getCaption(name))
			},
			testFile(){
				let fileType = [".jpg",".png",".jpeg",".JPG",".PNG",".JPEG",".pdf",".PDF",".doc",".docx",".xls"]
			},
			getCaption(obj){
			    var index=obj.lastIndexOf("\.");
			    obj=obj.substring(index+1,obj.length);
			    return obj.toLowerCase();
			}
		}
	};
</script>

<style scoped>
</style>
