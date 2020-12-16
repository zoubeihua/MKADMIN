<template>
	<el-container style="height:100%;">
		<el-aside width="300px">
			<mk-tree 
				:data.sync="data"
				node-key="menuid"
				filterStr="title"
				:props="{ label: 'title',children: 'children'}"
				@node-click="nodeClick"
				>
				<template #body="{node, data}">
					 <span>{{ data.title }}</span>
				</template>
			</mk-tree>
		</el-aside>
		<el-main style="padding:0;">
			<mk-designer-grid :disabled="disabled" :node="item" ref="mkDesignerGridEl"></mk-designer-grid>
		</el-main>
	</el-container>
	
</template>

<script>
	import MkTree from '@/components/mk-form/mk-tree'
	import mkDesignerGrid from '@/components/mk-designer-grid/index.vue'
	export default {
		components:{
			mkDesignerGrid,
			MkTree
		},
		data(){
			return {
				data:[],
				disabled:true,
				item:{}
			}
		},
		created() {
			this.getTreeData();
		},
		mounted() {
			
		},
		methods:{
			nodeClick(data,node,e){
				this.disabled = data.target == 'iframe' ? false : true;
				this.item = JSON.parse(JSON.stringify(data));
				this.$refs.mkDesignerGridEl.setPageConfig();
			},
			getTreeData(){
				this.MK.Request('/Publics/Common/Menu', 'get', {userid:-1,tag:1})
				.then(res => {
					if(res.code == 0){
						this.data = res.dataRoute;
					};
				})
			}
		}
	}
</script>

<style>
</style>
