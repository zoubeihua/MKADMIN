 /**
 * @description 生成页面代码
 * @param {Object} data Vue data字段
 * @param {String} Template 模板布局方式  mkLR左右布局 | mkTB上下布局 | 默认主表布局
 */
export default function(data,Template='default'){
	const templateName = 'mk-grid';
	if(Template == 'default'){
		return `<template>
			<el-container>
				<el-main>
					<mk-grid 
						:option.sync="gridOption" 
						:queryForm.sync="queryWidgetForm" 
						:addForm.sync="addWidgetForm" 
						:editForm.sync="modifyWidgetForm" 
						:toolButtos="toolButtos" 
						:toolbarRight="toolbarRight"
						:operateBtn="operateBtn" 
						ref="mkGrid">
					</mk-grid>
				</el-main>
			</el-container>
		</template>	
		<script>
		import MkGrid from '@/components/mk-grid'
		export default {
			name:'',
			components: {
				MkGrid
			},
			data(){
				return {
					gridOption:${JSON.stringify(data.gridOption)},
					queryWidgetForm:${JSON.stringify(data.queryWidgetForm)},
					addWidgetForm:${JSON.stringify(data.addWidgetForm)},
					modifyWidgetForm:${JSON.stringify(data.modifyWidgetForm)},
					toolButtos:${JSON.stringify(data.toolButtos)},
					toolbarRight:${JSON.stringify(data.toolbarRight)},
					operateBtn:${JSON.stringify(data.operateBtn)}
					
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