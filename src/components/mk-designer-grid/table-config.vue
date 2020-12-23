<template>
	<div style="height: 100%;">
		<vxe-grid border resizable show-overflow keep-source height="auto" ref="xTable" :auto-resize="true" :edit-rules="editRules"
		 @toolbar-button-click="toolbarButtonClick" :columns="tableColumn" :toolbar="tableToolbar" :edit-config="{trigger: 'click', mode: 'row', showStatus: true}">
		</vxe-grid>
		<vxe-modal v-model="tableConfigModal"  showFooter width="1300" fullscreen remember height="800" resize>
			<template v-slot:title>
				<span>表格配置</span>
				<span style="color: red;"> [ {{designerGrid.node.title}} - {{designerGrid.node.menuid}} ] </span>
			</template>
			<table-config-sub ref="tableConfigSub"></table-config-sub>
			<div slot="footer" style="text-align: center;">
				<vxe-button status="primary" @click="saveTableConfig">保存</vxe-button>
			</div>
		</vxe-modal>
		<vxe-modal v-model="formConfigModal"   width="1300" fullscreen remember height="800" resize>
			<template v-slot:title>
				<span>表格配置</span>
				<span style="color: red;"> [ {{designerGrid.node.title}} - {{designerGrid.node.menuid}} ] </span>
			</template>
			<!-- <mk-container-frame :src="`${$baseUrl}html/demo.html`"/> -->
			<table-form ref="modelFormCofig" v-if="formConfigModal" @change="saveModelFormCofig" @close="formConfigModal = false"></table-form>
		</vxe-modal>
	</div>
</template>

<script>
	import TableConfigSub from './table-config-sub.vue'
	import TableForm from './table-form.vue'
	import componentsData from './componentsConfig.js'
	import _ from 'lodash'
	export default {
		name: 'table-config',
		provide() {
			return {
				tableConfig: this
			}
		},
		inject:['designerGrid'],
		props: {
			value: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		components: {
			TableConfigSub,
			TableForm
		},
		data() {
			//表格列类型
			const typeList = [{
					value: 'seq',
					label: '序号'
				},
				{
					value: 'checkbox',
					label: '复选框'
				},
				{
					value: 'radio',
					label: '单选框'
				}
			]
			//表格对齐方式列表
			const alignList = [{
					value: 'left',
					label: '左对齐'
				},
				{
					value: 'center',
					label: '居中对齐'
				},
				{
					value: 'right',
					label: '右对齐'
				},
			]
			//表格固定列对齐方式列表
			const fixedList = [{
					value: 'left',
					label: '左对齐'
				},
				{
					value: 'right',
					label: '右对齐'
				},
			]
			//控件列表
			const fieldList = [{
				value: 'input',
				label: '单行文本'
			}, {
				value: 'textarea',
				label: '多行文本'
			}, {
				value: 'number',
				label: '计数器'
			}, {
				value: 'radio',
				label: '单选框组'
			}, {
				value: 'checkbox',
				label: '多选框组'
			}, {
				value: 'date',
				label: '日期选择器'
			}, {
				value: 'select',
				label: '下拉选择框'
			}, {
				value: 'switch',
				label: '开关'
			}, {
				value: 'slider',
				label: '滑块'
			}, ]
			return {
				componentsData,
				tableConfigModal: false,
				formConfigModal: false,
				tableData: this.value,
				//表格属性配置
				gridOption: {

				},
				editRules: {
					key: [{
						required: true,
						message: '请输入列键值'
					}, ],
					name: [{
						required: true,
						message: '请输入列名称'
					}, ]
				},
				// tableProxy: {
				//   props: {
				//     result: 'result',
				//     total: 'page.total'
				//   },
				//   ajax: {
				//     query: ({ page }) => XEAjax.get(`/api/column/page/list/${page.pageSize}/${page.currentPage}`, { sort: 'seq', order: 'asc' }),
				//     delete: ({ body }) => XEAjax.post('/api/column/save', body),
				//     save: ({ body }) => XEAjax.post('/api/column/save', body)
				//   }
				// },
				tableToolbar: {
					buttons: [{
							code: 'add', //
							name: '新增',
							status: 'perfect',
							icon: 'fa fa-plus'
						},
						{
							code: 'grid_cofig', //
							name: '表格配置',
							status: 'perfect',
							icon: 'fa fa-cog'
						}, {
							code: 'model_form_cofig', //
							name: '弹窗和查询表单配置',
							status: 'perfect',
							icon: 'fa fa-cog'
						},
						{
							code: 'saveTable',
							name: '保存',
							status: 'perfect',
							icon: 'fa fa-save'
						}
					],
					perfect: true,
					// refresh: true,
					custom: true
				},
				tableColumn: [{
						type: 'checkbox',
						width: 50,
						fixed: 'left'
					},
					{
						field: 'seq',
						title: '排序',
						align: 'center',
						width: 80,
						fixed: 'left',
						editRender: {
							name: 'input'
						}
					},
					{
						field: 'rowId',
						title: '是否为主键',
						align: 'center',
						width: 100,
						fixed: 'left',
						cellRender: {
							name: '$switch',
						}
					},
					{
						field: 'key',
						title: '列键值',
						align: 'center',
						width: 100,
						fixed: 'left',
						editRender: {
							name: 'input'
						}
					},
					{
						field: 'name',
						title: '列名称',
						align: 'center',
						width: 100,
						fixed: 'left',
						editRender: {
							name: 'input'
						}
					},
					{
						field: 'type',
						title: '列类型',
						align: 'center',
						width: 120,
						editRender: {
							name: '$select',
							options: typeList,
							props: {
								clearable: true
							}
						}
					},
					{
						field: 'width',
						title: '列宽度',
						align: 'center',
						width: 100,
						editRender: {
							name: 'input',
							attrs: {
								placeholder: '*,*px,*%'
							}
						}
					},
					{
						field: 'link',
						title: '是否链接',
						align: 'center',
						width: 150,
						editRender: {
							name: 'input'
						}
					},
					{
						field: 'fixed',
						title: '是否固定列',
						align: 'center',
						width: 120,
						editRender: {
							name: '$select',
							options: fixedList,
							props: {
								clearable: true
							}
						}
					},
					{
						field: 'visible',
						title: '是否在列里显示',
						align: 'center',
						width: 120,
						cellRender: {
							name: '$switch'
						}
					},
					{
						field: 'resizable',
						title: '是否允许拖动列宽',
						align: 'center',
						width: 140,
						cellRender: {
							name: '$switch'
						}
					},
					{
						field: 'remoteSort',
						title: '是否排序',
						align: 'center',
						width: 100,
						cellRender: {
							name: '$switch',
							defaultValue: true
						}
					},
					{
						field: 'align',
						title: '列对齐方式',
						align: 'center',
						width: 120,
						editRender: {
							name: '$select',
							options: alignList,
							props: {
								clearable: true
							}
						}
					},
					{
						field: 'dic',
						title: '字典类别',
						align: 'center',
						width: 150,
						editRender: {
							name: 'input'
						}
					},
					{
						field: 'dicdisabled',
						title: '字典是否可编辑',
						align: 'center',
						width: 150,
						visible: false,
						cellRender: {
							name: '$switch',
						}
					},
					// {
					// 	field: 'fieldtype',
					// 	title: '控件类型',
					// 	align: 'center',
					// 	width: 120,
					// 	editRender: {
					// 		name: '$select',
					// 		options: fieldList,
					// 		props: {
					// 			clearable: true
					// 		}
					// 	}
					// },
					// {
					// 	field: 'is_query',
					// 	title: '是否为查询字段',
					// 	align: 'center',
					// 	width: 120,
					// 	cellRender: {
					// 		name: '$switch'
					// 	}
					// },
					// {
					// 	field: 'is_add',
					// 	title: '是否为新增字段',
					// 	align: 'center',
					// 	width: 120,
					// 	cellRender: {
					// 		name: '$switch'
					// 	}
					// },
					// {
					// 	field: 'is_modify',
					// 	title: '是否为编辑字段',
					// 	align: 'center',
					// 	width: 120,
					// 	cellRender: {
					// 		name: '$switch'
					// 	}
					// }

				],
				//表格配置
				tableConfig:{
					toolBarData:{
						toolbar: {
							slots: {
								buttons: 'toolbar_buttons',
								tools:'toolbar_right'
							},
							toolButtos: []
						}
					},
					operateData:{
						code:1,
						row:{},
						operateBtn:[]
					}
					
				},
				//弹窗和查询表单配置
				modelFromConfig:{
					queryWidgetForm:{
						list: [],
						config: {
							labelWidth: 100,
							labelPosition: 'right',
							size: 'small',
							customClass: '',
							ui: 'element',
							layout: 'horizontal',
							labelCol: 3,
							width: '100%',
							hideLabel: false,
							hideErrorMessage: false
						}
					},
					addWidgetForm:{
						list: [],
						config: {
							labelWidth: 100,
							labelPosition: 'right',
							size: 'small',
							customClass: '',
							ui: 'element',
							layout: 'horizontal',
							labelCol: 3,
							width: '100%',
							hideLabel: false,
							hideErrorMessage: false
						}
					},
					modifyWidgetForm:{
						list: [],
						config: {
							labelWidth: 100,
							labelPosition: 'right',
							size: 'small',
							customClass: '',
							ui: 'element',
							layout: 'horizontal',
							labelCol: 3,
							width: '100%',
							hideLabel: false,
							hideErrorMessage: false
						}
					}
				}
			}
		},
		created() {
			this.$nextTick(async () => {
				let res = await this.getColumns();
				if(res.code == 0){
					let data = res.data;
					if(data.length == 0) return;
					let { Columns } = JSON.parse(data[0].introinfo);
					this.$refs.xTable.loadData(Columns);
					this.getTableData();
				}
			})
		},
		methods: {
			//获取列数据相关配置
			async getTableData(cb){
				let {toolBarData,operateData} = await this.getTableConfig();
				this.tableConfig.toolBarData = toolBarData;
				this.tableConfig.operateData = operateData;
				const xTable = this.$refs.xTable;
				const {
					tableData
				} = xTable.getTableData();
				if (operateData.code == 0) {
					let isoperate = tableData.some(item => item.key == operateData.row.key);
					//如果有重复[操作列]禁止插入
					if (!isoperate) {
						this.$refs.xTable.insert(operateData.row)
					}
				};
				if(cb && typeof cb === "function" ){
					cb()
				}
			},
			//获取表格配置
			getTableConfig(){
				return new Promise((resolve,reject) => {
					let data = {
						category:this.designerGrid.node.title + '_表格配置',
						introid:this.designerGrid.node.menuid
					};
					this.MK.Request('/Publics/Common/Dic/IntroInfo', 'get', data)
					.then(res => {
						let toolData = {
							add:"0",
							import:"0",
							export:"0",
							print:"0",
							refresh:"0",
							zoom:"1",
							custom:"1"
						};
						let operateData = {
							isOperate:"0",
							edit:"0",
							look:"0",
							del:"0",
						}
						let toolbarRight = {
							import:"0",
							export:"0",
							print:"0",
						}
						let Interface = {
							tableInterface:'',
							importInterface:'',
							exportInterface:'',
						}
						if(res.code == 0){
							let data = res.data;
							if(data.length == 0) return;
							let { toolData:toolDatas, operateData:operateDatas,toolbarRight:toolbarRights,Interface:Interfaces } = JSON.parse(data[0].introinfo);
							toolData = toolDatas;
							operateData = operateDatas;
							toolbarRight = toolbarRights;
							Interface = Interfaces;
							//生成工具栏数据
							let toolBarDataJSON = {...this.getToolBar(toolData),toolbarRight,Interface};
							//工具栏右边
							let toolbarRightDataJSON = toolbarRight;
							//生成表格操作列数据
							let operateDataJSON =  this.getOperate(operateData);
							resolve({
								toolBarData:toolBarDataJSON,
								operateData:operateDataJSON
							})
						}
					});
				})
				
			},
			//生成工具栏
			getToolBar(toolData){
				let toolbar = {
					slots: {
						buttons: 'toolbar_buttons',
						tools:'toolbar_right'
					},
					perfect:true,
				};
				let toolButtos = [];
				for(let key in toolData){
					if(key == 'add'){
						if(toolData[key] != '0'){
							toolButtos.push({
								code:'add',
								name:'新增'
							});
						}
					}else{
						toolbar[key] = toolData[key] == 0 ? false : true;
					};
				};
				return {
					toolbar,
					toolButtos
				}
			},
			//生成操作列
			getOperate(operateData){
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
				
				if(operateData.isOperate == 0){
					row = {};
					operateBtn = [];
					code = 1;
				}else{
					code = 0;
					for(let key in operateData){
						if(operateData[key] == "1"){
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
			},
			//表格配置保存事件
			async saveTableConfig() {
				let res = await this.$refs.tableConfigSub.saveTableConfig();
				if(res.code == 0){
					this.getTableData(()=> this.tableConfigModal = false);
				}
				
			},
			//弹窗和查询表单配置保存事件回调
			saveModelFormCofig(data){
				//根据业务 数据要保存到数据库里
				this.modelFromConfig = data;
			},
			//工具栏事件回调
			toolbarButtonClick({
				code
			}) {
				switch (code) {
					case 'saveTable': //保存
						this.saveTable();
						break;
					case 'add': //新增
						this.insert();
						break;
					case 'grid_cofig': //表格属性配置
						this.grid_cofig();
						break;
					case 'model_form_cofig':
						this.model_form_cofig();
						break;
				}
			},
			//新增
			insert() {
				let row = {
					seq: null,
					key: null,
					name: null,
					type: null,
					width: null,
					link: null,
					dic: null,
					dicdisabled: null,
					visible: true,
					resizable: null,
					fixed: null,
					remoteSort: true,
					align: 'center'
				};
				this.$refs.xTable.insertAt(row,-1)
				// this.$refs.xTable.insert(row)
			},
			//保存
			saveTable() {
				let {
					tableData
				} = this.$refs.xTable.getTableData();
				if (!tableData.length) {
					this.$XModal.message({
						status: 'error',
						message: '请添加数据',
						id: 'unique1'
					});
					return;
				};
				this.$refs.xTable.validate(async (errMap) => {
					if (errMap) {
						this.$XModal.message({
							status: 'error',
							message: '校验不通过！',
							id: 'unique1'
						})
					} else {
						//工具栏数据 操作列
						let {toolBarData,operateData} = await this.getTableConfig();
						let res = await this.saveColumns(tableData);
						let  result = await this.mergeMakingFormData();
						
						let WidgetFormData = result.WidgetForm;
						let { queryWidgetForm, addWidgetForm, modifyWidgetForm} = WidgetFormData;
						this.tableData = tableData;
						this.$nextTick(() => {
							this.$emit('change', {
								tableData: this.tableData,
								toolBarData,
								operateData,
								queryWidgetForm,
								addWidgetForm,
								modifyWidgetForm
							});
							this.$emit('close')
						})
					}
				})
			},
			//保存列数据集
			saveColumns(tableData){
				let Columns = tableData;
				let data = {
					category:this.designerGrid.node.title + '_Grid-Columns',
					introid:this.designerGrid.node.menuid,
					introinfo:{
						Columns
					}
				}
				return this.MK.Request('/Publics/Common/Dic/IntroInfo', 'post', data);
			},
			//获取列数据集
			getColumns(){
				let data = {
					category:this.designerGrid.node.title + '_Grid-Columns',
					introid:this.designerGrid.node.menuid
				}
				return this.MK.Request('/Publics/Common/Dic/IntroInfo', 'get', data);
			},
			//表格属性配置
			grid_cofig() {
				this.tableConfigModal = true;
			},
			//表单维护弹窗
			async model_form_cofig() {
				//根据业务 实际情况 请求网络
				let res = await this.mergeMakingFormData();
				console.log('res++++++++++')
				console.log(res)
				//code 0成功 
				if(res.code == 0 ){
					this.formConfigModal = true;
					this.$nextTick(() => {
						this.$refs.modelFormCofig.setJSON(res.WidgetForm)
					})
					
				}else{
					this.$XModal.message({
						status: 'error',
						message: '没有数据',
						id: 'unique1'
					});
				}
			},
			//本地生成表单格式与数据库回去表单格式合并
			async mergeMakingFormData(){
				//code 0成功 
				return new Promise(async (resolve) => {
					let netWidgetForm = {};
					let res = await this.getNetMakingFormData();
					if(res.code == 0){	
						let data = res.data;
						if(data.length != 0){
							netWidgetForm = JSON.parse(data[0].introinfo);//网络请求数据 
							if(netWidgetForm.queryWidgetForm && netWidgetForm.addWidgetForm && netWidgetForm.modifyWidgetForm){
								let WidgetForm = {
									queryWidgetForm:netWidgetForm.queryWidgetForm,
									addWidgetForm:netWidgetForm.addWidgetForm,
									modifyWidgetForm:netWidgetForm.modifyWidgetForm
								}
								resolve({
									code:0,
									WidgetForm:WidgetForm
								})
							}else{
								const { queryWidgetForm, addWidgetForm, modifyWidgetForm } = this.modelFromConfig;
								resolve({
									code:0,
									WidgetForm:{
										queryWidgetForm,
										addWidgetForm,
										modifyWidgetForm
									}
								})
							}	
							
						}else{
							const { queryWidgetForm, addWidgetForm, modifyWidgetForm } = this.modelFromConfig;
							resolve({
									code:0,
									WidgetForm:{
										queryWidgetForm,
										addWidgetForm,
										modifyWidgetForm
									}
								})
						}
						
					}
					
				})
				
			},
			//获取弹窗表单和查询表单配置
			getNetMakingFormData(){
				let data = {
					category:this.designerGrid.node.title + '_弹窗表单和查询表单配置',
					introid:this.designerGrid.node.menuid
				}
				return this.MK.Request('/Publics/Common/Dic/IntroInfo', 'get', data)
			},
			getWidgetForm(list = []) {
				return {
					list: list,
					config: {
						labelWidth: 100,
						labelPosition: 'right',
						size: 'small',
						customClass: '',
						ui: 'element',
						layout: 'horizontal',
						labelCol: 3,
						width: '100%',
						hideLabel: false,
						hideErrorMessage: false
					}
				}
			}
		},
		watch: {
			tableData(val) {
				this.$emit('input', val);

			},
			value(val) {
				this.tableData = val;
			}
		}
	}
</script>

<style scoped>
	::v-deep .el-scrollbar__wrap {
		overflow-x: hidden !important;
	}
</style>
