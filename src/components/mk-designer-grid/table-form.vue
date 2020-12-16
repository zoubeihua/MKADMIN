<template>
	<!-- generate-code
	generate-json -->
	<el-container style="height:100%;">
		<el-header style="display: flex;align-items: center;height: 40px;padding: 0;">
			<el-tabs v-model="activeName" @tab-click="tabClick">
			    <el-tab-pane label="查询表单布局" name="query"></el-tab-pane>
			    <el-tab-pane label="新增弹窗表单布局" name="add"></el-tab-pane>
			    <el-tab-pane label="编辑弹窗表单布局" name="edit"></el-tab-pane>
			  </el-tabs>
		</el-header>
		<mk-making-form
			v-show="activeName == 'query'"
		   ref="queryMakingForm" 
		   :isShowFields="true" 
		   key="query"
		   :isOperate="true"
		   preview 
		 >
		   <template slot="action">
			   <el-button type="text" icon="el-icon-upload" @click="handleSave">保存</el-button>
		   </template>
		 </mk-making-form>
		 <mk-making-form
		 	v-show="activeName == 'add'"
		    ref="addMakingForm" 
			key="add"
		    :isShowFields="false" 
		    :isOperate="false"
		    preview 
		  >
		    <template slot="action">
		 	  
		    </template>
		  </mk-making-form>
		  <mk-making-form
		  	v-show="activeName == 'edit'"
		     ref="editMakingForm" 
			key="edit"
		     :isShowFields="false" 
		     :isOperate="false"
		     preview 
		   >
		     <template slot="action">
		  	 
		     </template>
		   </mk-making-form>
		   <el-footer style="height: 40px;display: flex;align-items: center;justify-content: center;">
			   <vxe-button status="primary" @click="saveModelFormCofig">保存</vxe-button>
		   </el-footer>
	 </el-container>
</template>

<script>

	export default {
		name:'table-form',
		inject:['tableConfig','designerGrid'],
		components:{
			
		},
		data(){
			return {
				activeName:'query',
				widgetForm: {
				},
				key:new Date().getTime() + ''
			}
		},
		created() {
				this.tabClick('query')
		},
		methods:{
			handleSave(){
				
			},
			tabClick(val){
				// this.$nextTick(() => {
				// 	switch(val) {
				// 		case 'query':
				// 			this.$refs.queryMakingForm.setJSON(this.widgetForm.queryWidgetForm);
				// 		break;
				// 		case 'add':
				// 			this.$refs.addMakingForm.setJSON(this.widgetForm.addWidgetForm);
				// 		break;
				// 		case 'edit':
				// 			this.$refs.editMakingForm.setJSON(this.widgetForm.modifyWidgetForm);
				// 		break;
				// 	}
				// })
			},
			saveModelFormCofig(){
				let { queryWidgetForm, addWidgetForm, modifyWidgetForm } = this.getJSON();
				
				let data = {
					category: this.designerGrid.node.title + '_弹窗表单和查询表单配置',
					introid:this.designerGrid.node.menuid,
					introinfo:{
						queryWidgetForm,
						addWidgetForm,
						modifyWidgetForm
					}
				}
				this.MK.Request('/Publics/Common/Dic/IntroInfo', 'post', data)
				.then(res => {
					this.$emit('change',this.getJSON());
					this.$emit('close')
				})
			},
			getJSON(){
				let queryWidgetForm = this.$refs.queryMakingForm.getJSON();
				let addWidgetForm = this.$refs.addMakingForm.getJSON();
				let modifyWidgetForm = this.$refs.editMakingForm.getJSON();
				return {
					queryWidgetForm,
					addWidgetForm,
					modifyWidgetForm
				}
			},
			setJSON(data){
				this.widgetForm = data;
				this.$nextTick(() => {
					this.$refs.queryMakingForm.setJSON(data.queryWidgetForm);
					this.$refs.addMakingForm.setJSON(data.addWidgetForm);
					this.$refs.editMakingForm.setJSON(data.modifyWidgetForm);
					
				})
			}
		}
	}
</script>

<style scoped>
		
</style>
