<template>
	<el-container>
		<el-header style="height: 40px; display: flex; align-items: center;padding: 0;">
			<el-button-group >
				<el-button type="info" :disabled="disabled" icon="fa fa-cog" size="small" @click="toolClickEvent">Grid配置</el-button>
				<el-button type="info" :disabled="disabled" icon="fa fa-cog" size="small" @click="handleGenerateCode">生成代码</el-button>
			</el-button-group>
		</el-header>
		<el-main style="padding: 0;">
			<mk-grid :option.sync="gridOption" :queryForm.sync="queryWidgetForm" :url="Interface.tableInterface" :importUrl="Interface.importInterface" :exportUrl="Interface.exportInterface" :addForm.sync="addWidgetForm" :editForm.sync="modifyWidgetForm" :toolButtos="toolButtos" :toolbarRight="toolbarRight" :operateBtn="operateBtn" ref="mkGrid"></mk-grid>
		</el-main>
		<vxe-modal v-model="tableConfigModal" title="" width="600" fullscreen remember height="400" resize >
			<template v-slot:title>
				<span>Grid配置</span>
				<span style="color: red;"> [ {{node.title}} - {{node.menuid}} ] </span>
			</template>
			<table-config v-if="tableConfigModal"  v-model="dataTable" @change="tableConfigChange" @close="tableConfigModal = false"></table-config>
		</vxe-modal>
		<vxe-modal v-model="codeVisible" title="生成代码" width="600" fullscreen remember height="400" resize >
			<el-container>
				<el-header style="height: auto;padding:0;">
					<select-template v-if="codeVisible" @change="templateChangeHandler"></select-template>
				</el-header>
				<el-main style="padding:0;">
					<code-editor height="100%" :key="key" v-if="codeVisible"  mode="html" v-model="VueTemplate"></code-editor>
				</el-main>
			</el-container>
		</vxe-modal>
	</el-container>
</template>

<script>
	import MkGrid from '@/components/mk-grid'
	import TableConfig from './table-config.vue'
	import CodeEditor from '@/components/CodeEditor'
	import generateCode from './generateCode.js'
	import SelectTemplate from './selectTemplate'
	import _ from 'lodash'
	export default {
		name: 'mk-designer-grid',
		components: {
			TableConfig,
			MkGrid,
			CodeEditor,
			SelectTemplate
		},
		provide() {
			return {
				designerGrid: this
			}
		},
		props:{
			node:{
				type:Object
			},
			disabled:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				tableConfigModal: false,
				codeVisible:false,
				key:new Date().getTime(),
				dataTable:[],
				tableColumn: [],
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
				},
				toolButtos:[],
				toolbarRight:{
					import:"0",
					export:"0",
					print:"0",
				},
				Interface:{
					tableInterface:'',
					importInterface:'',
					exportInterface:'',
				},
				operateBtn:[],
				gridOption:{
					
				},
				VueTemplate:'',
			}
		},
		created() {
		
		},
		watch:{
			node(val){
				
			}
		},
		computed:{
			sortTableColumn(){
				return _.sortBy(this.tableColumn,item => item.seq)
			}
		},
		methods: {
			//初始化表单模板
			initForm(){
				this.queryWidgetForm = {
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
				};
				this.addWidgetForm = {
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
				};
				this.modifyWidgetForm = {
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
				};
			},
			//设置页面配置
			setPageConfig(opt){
				this.$nextTick(() => {
					let data = {
						category:this.node.title + '_页面Grid配置',
						introid:this.node.menuid
					}
					this.MK.Request('/Publics/Common/Dic/IntroInfo', 'get', data)
					.then(res => {
						if(res.code == 0){
							let data = res.data;
							if(data.length == 0) {
								this.toolButtos = [];
								this.operateBtn = [];
								this.gridOption = {};
								this.initForm();
								return;
							};
							let {gridOption,tableData, toolBarData,operateData,queryWidgetForm,addWidgetForm,modifyWidgetForm} = JSON.parse(data[0].introinfo);
							this.toolButtos = toolBarData.toolButtos;
							this.toolbarRight = toolBarData.toolbarRight;
							this.Interface = toolBarData.Interface;
							this.operateBtn = operateData.operateBtn;
							this.queryWidgetForm = queryWidgetForm;
							this.addWidgetForm = addWidgetForm;
							this.modifyWidgetForm = modifyWidgetForm;
							this.gridOption = gridOption;
						}
					})
				})
				
			},
			//获取列数据集
			getColumns(){
				let data = {
					category:this.node.title + '_Grid-Columns',
					introid:this.node.menuid
				}
				return this.MK.Request('/Publics/Common/Dic/IntroInfo', 'get', data);
			},
			async findColumn() {
				const gridOption = {}
				const validRules = {}
				let reslut = await this.getColumns();
				if(reslut.code == 0){
					let data = reslut.data;
					if(data.length == 0) return;
					let { Columns } = JSON.parse(data[0].introinfo);
					this.dataTable =  Columns;
				}
				const data = JSON.parse(JSON.stringify( this.dataTable))
				// 使用async await 处理异步操作
				this.tableColumn = await Promise.all(data.map(async (item) => {
					const config = {
						seq:item.seq,
						title: item.name,
						width: item.width,
						visible:item.visible,
						resizable:item.resizable,
						align:item.align,
						remoteSort:item.remoteSort,
						is_query:item.is_query,
						is_modify:item.is_modify,
						is_add:item.is_add,
						fieldtype:item.fieldtype
					}
					if (item.type) {
						config.type = item.type
					} else {
						//固定
						if(item.fixed){
							config.fixed = item.align == 'center' ? 'right' : item.align;
						}
						//插槽
						if(item.key == 'operate_id'){
							config.slots = {
								default: 'operate'
							}
						}else{
							config.slots = {
								default: ({
									row,
									column
								}) => {
									// 渲染链接
									if (item.link) {
										return [
											<a class="link" href={ item.link }>{ row[column.property] }</a>
										]
									}
									// 渲染文本
									return [ <span > {row[column.property]} < /span>]
								}
							}
						}
						// 动态生成校验
						if (item.required) {
							validRules[item.key] = [{
								required: true,
								message: `请填写${item.name}`
							}]
						}
						if (item.validator) {
							if (validRules[item.key]) {
								validRules[item.key].push({
									pattern: new RegExp(item.validator),
									message: item.validMsg || `${item.name}校验不通过，请重新填写`
								})
							} else {
								validRules[item.key] = [{
									pattern: new RegExp(item.validator),
									message: item.validMsg || `${item.name}校验不通过，请重新填写`
								}]
							}
						}
						if (item.key) {
							config.field = item.key;
						}
						//自定义行数据唯一主键的字段名（行数据必须要有唯一主键，默认自动生成）
						if(item.rowId){
							gridOption.rowId = item.key;
						}
						//生成字典
						if(item.dic && item.dic != ''){
							let res = await this.$getDicCode(item.dic);
							config.dic = {
								codetype: item.dic,
								disabled: false
							};
							config.editRender = {
								name: '$select',
								options: res
							};
						}
						if (item.isEdit) {
							config.editRender = {
								name: 'input'
							}
						}
					}
					// console.log(JSON.stringify(config))
					return  config
				}));
				gridOption.columns = this.sortTableColumn;
				gridOption.editRules = validRules;
				return gridOption
			},
			toolClickEvent() {
				this.tableConfigModal = true;
			},
			async tableConfigChange(data){
				let res = await this.findColumn();
				res.toolbar = data.toolBarData.toolbar;
				this.toolButtos = data.toolBarData.toolButtos;
				this.toolbarRight = data.toolBarData.toolbarRight;
				this.Interface = data.toolBarData.Interface;
				this.operateBtn = data.operateData.operateBtn;
				this.queryWidgetForm = data.queryWidgetForm;
				this.addWidgetForm = data.addWidgetForm;
				this.modifyWidgetForm = data.modifyWidgetForm;
				this.gridOption = res;
				this.savePageOption(data);
				
			},
			//保存页面相关配置
			async savePageOption(opt){
				let res = await this.findColumn();
				res.toolbar = opt.toolBarData.toolbar;
				let data = {
					category: this.node.title + '_页面Grid配置',
					introid:this.node.menuid,
					introinfo:{
						gridOption:res,
						tableData:opt.tableData,
						toolBarData:opt.toolBarData,
						operateData:opt.operateData,
						queryWidgetForm:opt.queryWidgetForm,
						addWidgetForm:opt.addWidgetForm,
						modifyWidgetForm:opt.modifyWidgetForm,
					}
				}
				
				this.MK.Request('/Publics/Common/Dic/IntroInfo', 'post', data)
				.then(res => {
					if(res.code == 0){
						this.$XModal.message({
							status: 'success',
							message: res.msg,
							id: 'unique1'
						})
						this.$refs.mkGrid.reload();
					}
				})
			},
			//生成代码
			handleGenerateCode(){
				this.codeVisible = true;
				let data = {
					gridOption:this.gridOption,
					queryWidgetForm:this.queryWidgetForm,
					addWidgetForm:this.addWidgetForm,
					modifyWidgetForm:this.modifyWidgetForm,
					toolButtos:this.toolButtos || [],
					toolbarRight:this.toolbarRight || {},
					Interface:this.Interface,
					operateBtn:this.operateBtn || [],
				}
				console.log(data);
				this.VueTemplate = generateCode(data);
			},
			templateChangeHandler(type){
				let data = {
					gridOption:this.gridOption,
					queryWidgetForm:this.queryWidgetForm,
					addWidgetForm:this.addWidgetForm,
					modifyWidgetForm:this.modifyWidgetForm,
					toolButtos:this.toolButtos || [],
					toolbarRight:this.toolbarRight || {},
					Interface:this.Interface,
					operateBtn:this.operateBtn || [],
				}
				switch(type){
					case 'default':
					this.VueTemplate = generateCode(data);
					break;
					case 'mkLR':
					this.VueTemplate = generateCode(data,'mkLR');
					break;
					case 'mkTB':
					this.VueTemplate = generateCode(data,'mkTB');
					break;
				}
				this.key = new Date().getTime();
			},
		},
	
	}
</script>

<style>
</style>
