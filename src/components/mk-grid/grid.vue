<template>
	<div style="height: 100%;overflow: hidden;">
		<vxe-grid ref="xGrid" v-bind="newGridData" @cell-click="cellClick">
			<!--将表单放在工具栏中-->
			<template v-slot:toolbar_buttons>
					<div style="display: flex;align-items: center;" class="toolbarFrom">
						<slot name="toolbarLeft" />
						<el-button v-for="(item,index) in toolButtos" :size="queryForm.config.size" :key="index" @click="toolbarButtonClick(item.code)">{{item.name}}</el-button>
					</div>
			</template>
			<!--工具栏右边按钮-->
			<template v-slot:toolbar_right>
				<vxe-button icon="vxe-button--icon vxe-icon--upload" title="导入" v-if="toolbarRight.import == 1" circle @click="Import"></vxe-button>
			</template>
			<!--操作列-->
			<template v-slot:operate="{ row }">
				<vxe-button icon="fa fa-edit" title="编辑" v-if="operateBtn.includes('edit')" circle @click="editRowEvent(row)"></vxe-button>
				<vxe-button icon="fa fa-trash" title="删除" v-if="operateBtn.includes('del')" circle @click="removeRowEvent(row)"></vxe-button>
				<vxe-button icon="fa fa-eye" title="查看" v-if="operateBtn.includes('look')" circle @click="lookRowEvent(row)"></vxe-button>
			</template>
			<!--自定义空数据模板-->
			<template v-slot:empty>
				<span style="color: red;">
					<p>没有更多数据了!</p>
				</span>
			</template>
		</vxe-grid>
		<!-- <dialog-form ref="dialogForm"></dialog-form> -->
		<import-data ref="ImportData" :parameter="importParame" :url="importUrl"></import-data>
	</div>
</template>

<script>
import { mapState } from 'vuex'
	import QueryForm from './query-form.vue'
	import DialogForm from './dialog-form.vue'
	import ImportData from './importdata'
import log from '@/libs/util.log'
	export default {
		name: 'mk-grid',
		components:{
			QueryForm,
			DialogForm,
			ImportData
		},
		provide(){
			return {
				grid:this
			}
		},
		props: {
			option: {
				type: Object,
				default: () => {}
			},
			url: {
				type: String,
				default: ""
			},
			importUrl:{
				type: String,
				default: ""
			},
			exportUrl:{
				type: String,
				default: ""
			},
			parameter:{
				type: Object,
				default: () => {}
			},
			importParame:{
				type: Object,
				default: () => {}
			},
			queryForm:{
				type:Object,
				default: () => {
					return {
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
						},
					}
				}
			},
			addForm:{
				type:Object,
				default: () => {
					return {
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
			},
			editForm:{
				type:Object,
				default: () => {
					return {
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
			},
			toolButtos:{
				type:Array,
				default:() => {
					return [];
				}
			},
			toolbarRight:{
				type:Object,
				default:() => {
					return {
						import:"0",
						export:"0",
						print:"0",
					}
				}
			},
			operateBtn:{
				type:Array,
				default:() => {
					return [];
				}
			},
			generateForm: {
				type: Array,
				default: () => {
					return [];
				}
			},
			tableData: {
				type: Array,
				default: () => {
					return [];
				}
			}
		},
		computed:{
			//是否为本地数据
			isTableData(){
				return this.url == '' ? false : true;
			},
			newGridData(){
				return {...this.gridData,...this.option};
			},
			 ...mapState('d2admin/size', [
				'value'
			])
		},
		data() {
			// 去除对象空属性
			function deleteObjNull(obj) {
			    let _newPar = {};
			    for (let key in obj) {
			        /**
			         * 如果对象属性的值不为空,就保存该属性
			         * 这里我做了限制,如果属性的值为0,保存该属性。如果属性的值全部是空格,属于为空。
			         */
			        if (
			            (obj[key] === 0 || obj[key]) &&
			            obj[key].toString().replace(/(^\s*)|(\s*$)/g, "") !== ""
			        ) {
			            //记录属性
			            _newPar[key] = obj[key];
			        }
			    }
			    //返回对象
			    return _newPar;
			};
			return {
				size:this.value,
				dic: this.option.columns,
				gridData: {
					id: 'grid_' + new Date().getTime(), //唯一标识（被某些特定的功能所依赖）string
					size: this.size || 'mini', //表格的尺寸 //medium, small, mini
					height: 'auto', //number | string   auto, %, px
					align: 'left', //所有的列对齐方式 left（左对齐）, center（居中对齐）, right（右对齐）
					stripe: true, //	是否带有斑马纹（需要注意的是，在可编辑表格场景下，临时插入的数据不会有斑马纹样式）
					border: true, //boolean | string default（默认）, full（完整边框）, outer（外边框）, inner（内边框）, none（无边框）
					resizable: true, //所有的列是否允许拖动列宽调整大小
					autoResize: true, //自动监听父元素的变化去重新计算表格（对于父元素可能存在动态变化、显示隐藏的容器中、列宽异常等场景中的可能会用到）
					round: false, //是否为圆角边框
					keepSource: true, //保持原始值的状态，被某些功能所依赖，比如编辑状态、还原数据等（开启后性能直线下降，具体取决于数据量）
					showHeaderOverflow: true, //设置表头所有内容过长时显示为省略号
					showOverflow: true, //设置所有内容过长时显示为省略号（如果是固定列建议设置该值，提升渲染速度）
					showHeader: true, //是否显示表头
					highlightCurrentRow: true, //是否要高亮当前行
					highlightHoverRow: true, //鼠标移到行是否要高亮显示
					highlightCurrentColumn: false, //是否要高亮当前列
					highlightHoverColumn: false, //鼠标移到列是否要高亮显示
					highlightCell: false, //只对 edit-config 配置时有效，是否在编辑时高亮单元格边框（只支持部分）
					autoResize:true,//自动监听父元素的变化去重新计算表格
					sortConfig: {
						trigger: 'cell'
					},
					toolbarConfig: {
						slots: {
							buttons: 'toolbar_buttons',
							tools:'toolbar_right'
						},
						perfect: true,
						refresh: false,
						import: false,
						export: true,
						print: false,
						zoom: true,
						custom: true
					},

					filterConfig: {
						remote: true
					},

					formConfig: {
						titleWidth: 100,
						titleAlign: 'right',
						items: []
					},
					customConfig: {
						storage: true,
						checkMethod: this.checkColumnMethod
					},
					editConfig: {
						trigger: 'click',
						mode: 'cell',
						showIcon: false,
						activeMethod: this.activeCellMethod
					},
					importConfig: {
						// remote: true,
						// importMethod: this.importMethod,
						types: ['xlsx'],
						modes: ['insert']
					},
					exportConfig: {

						type: 'xlsx',
						// 局部自定义类型
						types: ['xlsx'],
						// 自定义数据量列表
						modes: ['current', 'all']
						// type: 'xlsx',
						// remote: true,
						// exportMethod: this.exportMethod,
						// types: ['xlsx','pdf'],
						// modes: ['current',  'all']
					},
					pagerConfig: {
						layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
						pageSize: 20,
						pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
						perfect:true
					},
					proxyConfig: {
						seq: true, // 启用动态序号代理
						sort: true, // 启用排序代理
						filter: true, // 启用筛选代理
						form: true, // 启用表单代理
						props: {
							result: 'data',
							total: 'count'
						},
						ajax: {
							// 任何支持 Promise API 的库都可以对接（fetch、jquery、axios、xe-ajax）
							query: ({
								page,
								sort,
								filters,
								form
							},arg) => {
								// 处理排序条件
								const queryParams = Object.assign(arg ? arg : {}, form)
								const orderby = sort.property && sort.order ? `${sort.property} ${sort.order}` : ''
								// 处理筛选条件
								console.log(filters)
								filters.forEach(({
									property,
									values
								}) => {
									queryParams[property] = values.join(',')
								})
								queryParams['orderby'] = orderby;
								queryParams['page'] = page.currentPage;
								queryParams['rows'] = page.pageSize;
								deleteObjNull(queryParams)
								console.log('------表格查询入参------')
								console.log(queryParams,form)
								return this.isTableData ? this.MK.Request(this.url, 'get', {...queryParams,...this.parameter}) : this.getData()
							},
							delete: ({
								body
							}) => XEAjax.post('https://api.xuliangzhan.com:10443/api/pub/save', body),
							save: ({
								body
							}) => XEAjax.post('https://api.xuliangzhan.com:10443/api/pub/save', body)
						}
					},
				}
			}
		},
		created() {

			// this.setRowDicVal();
		},
		updated(){
			this.$nextTick(() => {
				// this.setRowDicVal();
				// this.$refs.xGrid.commitProxy('reload')
			})
		},
		methods: {
			commitProxy(code){
				this.$refs.xGrid.commitProxy(code)
			},
			//刷新数据
			reload(form){
				this.$refs.xGrid.commitProxy('query',form)
				// this.$refs.xGrid.commitProxy('reload',form)
				// this.$nextTick(() => {
				// 	this.setRowDicVal();
				// })
			},
			//手动处理数据（对于手动更改了排序、筛选...等条件后需要重新处理数据时可能会用到）
			updateData(){
				this.$refs.xGrid.updateData();
			},
			//同步 data 数据；如果用了该方法，那么组件将不再记录增删改的状态，只能自行实现对应逻辑（对于某些特殊的场景，比如深层树节点元素发生变动时可能会用到）
			syncData(){
				this.$refs.xGrid.syncData();
			},
			refreshColumn(){
				this.$refs.xGrid.refreshColumn();
			},
			//单元格被单击
			cellClick({row, rowIndex}){
				this.$emit('cell-click',{row,rowIndex})
			},
			setRowDicVal(){
				const n = JSON.parse(JSON.stringify(this.newGridData.columns));
				console.log("字典++++")
				console.log(n)
				if (n.length) {
					this.$nextTick(async () => {
						const xGrid = this.$refs.xGrid;
						if (xGrid) {
							for (let i = 0, l = n.length; i < l; i++) {
								if (n[i]['dic']) {
									let res = await this.StandCode(n[i]['dic']['codetype']);
									const Column = xGrid.getColumnByField(n[i].field);
									Column.editRender.options = res;
								}
				
							}
						}
					})
				}
			},
			//本地数据
			getData(){
				return new Promise( resolve => {
					let data = {
						data: this.tableData,
						count:this.tableData.length
					};
					resolve(data);
				})
			},
			//获取字典
			StandCode(codetype) {
				return new Promise(async resolve => {
					let res = await this.MK.Request(
						'/Publics/Common/Dic/StandCode',
						'get', {
							codetype: codetype
						}
					);
					let data = res.data.map(e => ({
						...e,
						label: e.bzname,
						value: e.bzcode
					}));
					resolve(data);
				})
			},
			//根据字典禁用选择
			activeCellMethod({
				column,
				columnIndex
			}) {
				let dic = JSON.parse(JSON.stringify(this.newGridData.columns));
				if (dic.length) {
					let curDic = dic.filter(item => item.field == column.property);
					if (curDic.length) {
						if (curDic[0]['dic']) {
							if (curDic[0]['dic']['disabled']) {
								return true
							} else {
								return false
							}
						}
					} else {
						return true;
					}
				} else {
					return false
				}
			},
			//导出
			exportMethod({ options }){
				console.log(options)
				return true
			},
			//菜单列配置是否可选
			checkColumnMethod({
				column
			}) {
				if (column.fixed) {
					return false;
				} else {
					return true;
				};
			},
			//工具栏按钮事件回调
			toolbarButtonClick(code){
				switch(code) {
					case 'add':
						this.add();
					break
					default:
						this.$emit('toolbar-button-click',code)
					break
				}
			},
			//新增
			add(){
				this.$refs.dialogForm.show('add');
			},
			//编辑
			editRowEvent(row){
				this.$emit('editRowEvent',row)
				// this.$refs.dialogForm.show('edit',row);
			},
			//删除
			removeRowEvent(row){
				this.$emit('removeRowEvent',row)
			},
			//查看
			lookRowEvent(row){
				this.$refs.dialogForm.show('look',row);
			},
			//导入
			Import(){
				// this.$emit('importMethod')
				this.$refs.ImportData.show()
			
			}
		},
		watch: {
			value:{
				immediate:true,
				handler(val){
					this.gridData.size = val;
				}
			},
			gridData: {
				deep: true,
				handler(val) {
					this.$emit('update:option', val)
				}
			},
			option: {
				deep: true,
				handler(val) {
					console.log('++++++watch----')
					console.log(this.newGridData)
					// this.gridData = this.newGridData
					// this.$emit('update:option', this.newGridData)
				}
			}
		}
	}
</script>

<style scoped>
::v-deep .vxe-tools--wrapper{
	padding:0 12px !important;
}
::v-deep .vxe-grid .vxe-grid--toolbar-wrapper .vxe-toolbar{
	height: auto !important;
}
.toolbarFrom{
	padding: 5px 5px 0 5px;
}
::v-deep .toolbarFrom .el-form .el-form-item{
	margin-bottom: 5px !important;
}
</style>
