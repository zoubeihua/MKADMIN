<template>
	<split-pane  :min-percent='20' :default-percent='50' split="horizontal" >
		<template slot="paneL">
		  <split-pane  :min-percent='20' :default-percent='50' split="vertical" >
			  <template slot="paneL">
				  <el-container>
					  <el-header style="height: 40px;display: flex;align-items: center;">
						  <i class="fa fa-cog"></i> 表格属性配置
					  </el-header>
					  <el-main style="padding:0 30px 0 30px;">
						  <el-scrollbar style="height: 100%;">
							  
						  </el-scrollbar>
					  </el-main>
				  </el-container>
			  </template>
			  <template slot="paneR">
			  	<el-container>
				  <el-header style="height: 40px;display: flex;align-items: center;">
					  <i class="fa fa-cog"></i> 工具栏配置
				  </el-header>
				  <el-main style="padding:0 30px 0 30px;">
					  <el-scrollbar style="height: 100%;">
						   <vxe-form :data="toolData">
								<vxe-form-item title="是否添加新增按钮" field="add" span="12" >
									<template v-slot>
									   <vxe-radio-group v-model="toolData.add">
											<vxe-radio label="1">是</vxe-radio>
											<vxe-radio label="0">否</vxe-radio>
									   </vxe-radio-group>
									</template>
								</vxe-form-item>
								<vxe-form-item title="是否添加导入按钮" field="import" span="12" >
									<template v-slot>
									   <vxe-radio-group v-model="toolbarRight.import">
										 <vxe-radio label="1">是</vxe-radio>
										 <vxe-radio label="0">否</vxe-radio>
									   </vxe-radio-group>
									</template>
								</vxe-form-item>
								<vxe-form-item title="是否添加导出按钮" field="export" span="12" >
									<template v-slot>
									   <vxe-radio-group v-model="toolbarRight.export">
										 <vxe-radio label="1">是</vxe-radio>
										 <vxe-radio label="0">否</vxe-radio>
									   </vxe-radio-group>
									</template>
								</vxe-form-item>
								<vxe-form-item title="是否添加打印按钮" field="print" span="12" >
									<template v-slot>
									   <vxe-radio-group v-model="toolbarRight.print">
										<vxe-radio label="1">是</vxe-radio>
										<vxe-radio label="0">否</vxe-radio>
									   </vxe-radio-group>
									</template>
								</vxe-form-item>
								<!-- <vxe-form-item title="是否添加刷新按钮" field="refresh" span="12" >
									<template v-slot>
									   <vxe-radio-group v-model="toolData.refresh">
										<vxe-radio label="1">是</vxe-radio>
										<vxe-radio label="0">否</vxe-radio>
									   </vxe-radio-group>
									</template>
								</vxe-form-item>
								<vxe-form-item title="是否添加最大化按钮" field="zoom" span="12" >
									<template v-slot>
									   <vxe-radio-group v-model="toolData.zoom">
										<vxe-radio label="1">是</vxe-radio>
										<vxe-radio label="0">否</vxe-radio>
									   </vxe-radio-group>
									</template>
								</vxe-form-item>
								<vxe-form-item title="是否添加自定义列配置按钮" field="custom" span="12" >
									<template v-slot>
									   <vxe-radio-group v-model="toolData.custom">
										<vxe-radio label="1">是</vxe-radio>
										<vxe-radio label="0">否</vxe-radio>
									   </vxe-radio-group>
									</template>
								</vxe-form-item> -->
						   </vxe-form>  
					  </el-scrollbar>
				  </el-main>
			  	</el-container>
			  </template>
		  </split-pane>
		</template>
		<template slot="paneR">
			<split-pane  :min-percent='20' :default-percent='50' split="vertical" >
			  <template slot="paneL">
				  <el-container>
				    <el-header style="height: 40px;display: flex;align-items: center;">
				  	  <i class="fa fa-cog"></i> 操作列配置
				    </el-header>
				    <el-main style="padding:0 30px 0 30px;">
				  	  <el-scrollbar style="height: 100%;">
				  		   <vxe-form :data="operateData">
							   <vxe-form-item title="是否启用操作列" field="isOperate" span="24" >
							   	<template v-slot>
							   	   <vxe-radio-group v-model="operateData.isOperate">
							   			<vxe-radio label="1">是</vxe-radio>
							   			<vxe-radio label="0">否</vxe-radio>
							   	   </vxe-radio-group>
							   	</template>
							   </vxe-form-item>
							   <vxe-form-item title="是否启用列编辑" field="edit" span="24" v-if="operateData.isOperate == 1">
									<template v-slot>
									   <vxe-radio-group v-model="operateData.edit">
										<vxe-radio label="1">是</vxe-radio>
										<vxe-radio label="0">否</vxe-radio>
									   </vxe-radio-group>
									</template>
							   </vxe-form-item>
							   <vxe-form-item title="是否启用列查看" field="look" span="24" v-if="operateData.isOperate == 1">
								<template v-slot>
								   <vxe-radio-group v-model="operateData.look">
									<vxe-radio label="1">是</vxe-radio>
									<vxe-radio label="0">否</vxe-radio>
								   </vxe-radio-group>
								</template>
							   </vxe-form-item>
							   <vxe-form-item title="是否启用列删除" field="del" span="24" v-if="operateData.isOperate == 1">
								<template v-slot>
								   <vxe-radio-group v-model="operateData.del">
									<vxe-radio label="1">是</vxe-radio>
									<vxe-radio label="0">否</vxe-radio>
								   </vxe-radio-group>
								</template>
							   </vxe-form-item>
						   </vxe-form>
				  	  </el-scrollbar>
				    </el-main>
				  </el-container>
			  </template>
			  <template slot="paneR">
				<el-container>
				  <el-header style="height: 40px;display: flex;align-items: center;">
					  
				  </el-header>
				  <el-main style="padding:0 30px 0 30px;">
					  <el-scrollbar style="height: 100%;">
						  
					  </el-scrollbar>
				  </el-main>
				</el-container>
			  </template>
			</split-pane>
		</template>
	</split-pane>	 
</template>

<script>
	export default {
		name:'table-config-sub',
		inject:['tableConfig','designerGrid'],
		data(){
			return {
				toolData:{
					add:"0",
					import:"0",
					export:"0",
					print:"0",
					refresh:"1",
					zoom:"1",
					custom:"1"
				},
				toolbarRight:{
					import:"0",
					export:"0",
					print:"0",
				},
				operateData:{
					isOperate:"0",
					edit:"0",
					look:"0",
					del:"0",
				},
			}
		},
		created(){
			this.getTableConfig();
		},
		methods:{
			//获取配置
			getTableConfig(){
				let data = {
					category:this.designerGrid.node.title + '_表格配置',
					introid:this.designerGrid.node.menuid
				}
				return this.MK.Request('/Publics/Common/Dic/IntroInfo', 'get', data)
				.then(res => {
					if(res.code == 0){
						let data = res.data;
						if(data.length == 0) return;
						try {
							let {toolData, operateData,toolbarRight} = JSON.parse(data[0].introinfo);
							this.toolData = toolData;
							this.operateData = operateData;
							this.toolbarRight = toolbarRight;
						} catch (error) {
							console.log(error)
						}
						
					}
					return res;
				})
			},
			// 保存
			saveTableConfig(){
				let toolData = this.toolData;
				let operateData = this.operateData;
				let toolbarRight = this.toolbarRight;
				let data = {
					category:this.designerGrid.node.title + '_表格配置',
					introid:this.designerGrid.node.menuid,
					introinfo:{
						toolData,
						operateData,
						toolbarRight
					}
				}
				return this.MK.Request('/Publics/Common/Dic/IntroInfo', 'post', data)
				
			},
			getToolBar(){
				let toolbar = {
					slots: {
						buttons: 'toolbar_buttons',
						tools:'toolbar_right'
					},
					perfect:true,
				};
				let toolbarRight = this.toolbarRight;
				let toolButtos = [];
				for(let key in this.toolData){
					if(key == 'add'){
						if(this.toolData[key] != '0'){
							toolButtos.push({
								code:'add',
								name:'新增'
							});
						}
					}else{
						toolbar[key] = this.toolData[key] == 0 ? false : true;
					};
				};
				return {
					toolbar,
					toolButtos,
					toolbarRight
				}
			},
			getOperate(){
				let row  = {
					seq: null,
					key: "operate_id",
					name: '操作',
					type: null,
					width: null,
					link: null,
					dic: null,
					dicdisabled: null,
					visible: true,
					resizable: null,
					fixed: "right",
					remoteSort: false,
					align: 'center',
					slots: {
						default: 'operate'
					}
				}
				let operateBtn = [];
				let code = 0;
				if(this.operateData.isOperate == 0){
					row = {};
					operateBtn = [];
					code = 1;
				}else{
					code = 0;
					for(let key in this.operateData){
						if(this.operateData[key] == "1"){
							if(key != 'isOperate'){
								operateBtn.push(key);
							};
						}
					}
					
				}
				return {
					code,
					row,
					operateBtn
				}
			}
		}
	}
</script>

<style>
</style>
