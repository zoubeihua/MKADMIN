 /**
 * @description 生成页面代码
 * @param {Object} data Vue data字段
 * @param {String} Template 模板布局方式  mkLR左右布局 | mkTB上下布局 | 默认主表布局
 */
export default function(data,Template='default'){
	const templateName = 'mk-grid';
	if(Template == 'default'){
		return `<template>
			<d2-container>
				<mk-grid 
					:option.sync="gridOption" 
					:queryForm.sync="queryWidgetForm" 
					:addForm.sync="addWidgetForm" 
					:editForm.sync="modifyWidgetForm" 
					:toolButtos="toolButtos" 
					:toolbarRight="toolbarRight"
					:parameter="parameter"
					:importParame="importParame"
					:url="Interface.tableInterface"
					:importUrl="Interface.importInterface"
					:exportUrl="Interface.exportInterface"
					:operateBtn="operateBtn" 
					ref="mkGrid">
				</mk-grid>
			</d2-container>
		</template>	
		<script>
		export default {
			name:'',
			data(){
				return {
					//table 配置项
					gridOption:${JSON.stringify(data.gridOption)},
					//table表格查询字段
					queryWidgetForm:${JSON.stringify(data.queryWidgetForm)},
					//弹窗新增数据
					addWidgetForm:${JSON.stringify(data.addWidgetForm)},
					//弹窗编辑数据
					modifyWidgetForm:${JSON.stringify(data.modifyWidgetForm)},
					//工具栏左侧自定义按钮
					toolButtos:${JSON.stringify(data.toolButtos)},
					//工具栏右侧自定义按钮目前只有导入 导出
					toolbarRight:${JSON.stringify(data.toolbarRight)},
					//table 行操作列按钮
					operateBtn:${JSON.stringify(data.operateBtn)},
					//table数据接口地址 导入 导出接口地址
					Interface:${JSON.stringify(data.Interface)},
					//附加参数
					parameter:{},
					//导入附加参数
					importParame:{}
				}
			},
			computed: {
				
			},
			watch: {
				
			},
			//如果页面有keep-alive缓存功能，这个函数会触发
			activated(){
				
			},
			created(){
				// this.$refs.mkGrid.reload();
			},
			methods:{
    
			},
			mounted(){
				
			},
			//生命周期 - 创建之前
			beforeCreate(){
				
			},
			//生命周期 - 挂载之前
			beforeMount(){
				
			},
			//生命周期 - 更新之前
			beforeUpdate(){
				
			},
			//生命周期 - 更新之后
			updated(){
				
			},
			//生命周期 - 销毁之前
			beforeDestroy(){
				
			},
			//生命周期 - 销毁完成
			destroyed(){
				
			}
		}
		</script>
		<style scoped>
		</style>
		`
	}else if(Template == 'mkLR'){
		return `<template>
				<split-pane  :min-percent='20' :default-percent='30' split="vertical">
					<template slot="paneL">
					    A
					</template>
					<template slot="paneR">
					      B
					</template>
				</split-pane>
			</template>
			<script>
				export default {
					name:'',
					components: {
						
					},
					data(){
						return {
							
						}
					},
					computed: {
						
					},
					watch: {
						
					},
					//如果页面有keep-alive缓存功能，这个函数会触发
					activated(){
						
					},
					created(){
						
					},
					mounted(){
						
					},
					//生命周期 - 创建之前
					beforeCreate(){
						
					},
					//生命周期 - 挂载之前
					beforeMount(){
						
					},
					//生命周期 - 更新之前
					beforeUpdate(){
						
					},
					//生命周期 - 更新之后
					updated(){
						
					},
					//生命周期 - 销毁之前
					beforeDestroy(){
						
					},
					//生命周期 - 销毁完成
					destroyed(){
						
					}
					
				}
			</script>
			<style scoped>
			</style>
			`
	}else{
		return `<template>
				<split-pane  :min-percent='20' :default-percent='30' split="horizontal">
					<template slot="paneL">
					    A
					</template>
					<template slot="paneR">
					      B
					</template>
				</split-pane>
			</template>
			<script>
				export default {
					name:'',
					components: {
						
					},
					data(){
						return {
							
						}
					},
					computed: {
						
					},
					watch: {
						
					},
					//如果页面有keep-alive缓存功能，这个函数会触发
					activated(){
						
					},
					created(){
						
					},
					mounted(){
						
					},
					//生命周期 - 创建之前
					beforeCreate(){
						
					},
					//生命周期 - 挂载之前
					beforeMount(){
						
					},
					//生命周期 - 更新之前
					beforeUpdate(){
						
					},
					//生命周期 - 更新之后
					updated(){
						
					},
					//生命周期 - 销毁之前
					beforeDestroy(){
						
					},
					//生命周期 - 销毁完成
					destroyed(){
						
					}
					
				}
			</script>
			<style scoped>
			</style>
			`
	}
}