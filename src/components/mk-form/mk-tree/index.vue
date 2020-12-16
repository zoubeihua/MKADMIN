<template>
	<el-container style="height:100%;">
		<el-header style="height: 40px;display: flex;align-items: center;padding: 0 10px;">
			<el-input clearable placeholder="检索" style="width: 100%;" prefix-icon="el-icon-search" v-model="filterText" size="small"></el-input>
		</el-header>
		<el-main style="padding: 0;">
			<el-container style="height:100%;">
				<el-header style="height: 48px;background-color:#f5f5f5;display: flex;align-items: center;padding: 0 10px;">
					<el-link
					  :icon="dexpandAll ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"
					  :underline="false"
					  @click="expand"
					>{{dexpandAll ? '全部收起' : '全部展开'}}</el-link>
				</el-header>
				<el-main style="padding:0 6px 6px 6px;background-color:#f5f5f5;">
					<div style="height: 100%; width: 100%;background: #fff;border: 1px dashed #ccc;">
						<el-scrollbar style="height:100%;width:100%;">
							<el-tree
							  ref="tree"
							  v-if="treeShow"
							  :data="treeList"
							  :node-key="nodeKey"
							  :props="props"
							  :default-expand-all="dexpandAll"
							  @node-click="nodeClick"
							  :filter-node-method="filterNode"
							  :expand-on-click-node="false">
							  <span class="custom-tree-node" slot-scope="{ node, data }">
								<slot name="body" :node="node" :data="data"></slot>
							  </span>
							</el-tree>
						</el-scrollbar>
					</div>
				</el-main>
			</el-container>
		</el-main>
	</el-container>
</template>

<script>
	export default {
		name: 'mk-tree',
		props: {
			nodeKey:{
				type:String,
				default:'id'
			},
			data:{
				type:Array,
				default:() => []
			},
			filterStr:{
				type:String,
				default:'label'
			},
			props: {
			 type:Object,
			 default:() => {
				 return {
					 label: "label",
					 children: "children"
				 }
			 }
			},
		},
		data() {
			return {
				dexpandAll:true,
				treeList:this.data,
				filterText:'',
				treeShow:true,
			}
		},
		methods: {
			//全部展开/关闭事件
			expand() {
			  this.treeShow = false;
			  this.dexpandAll = !this.dexpandAll;
			  setTimeout(() => {
			    this.treeShow = true;
			  });
			},
			//节点单击事件
			nodeClick(data,node,e){
				this.$emit('node-click',data,node,e)
			},
			filterNode(value, data, node) {
			  // 如果什么都没填就直接返回
			  if (!value) return true;
			  // 如果传入的value和data中的label相同说明是匹配到了
			  if (data[this.filterStr].indexOf(value) !== -1) {
			    return true;
			  }
			  // 否则要去判断它是不是选中节点的子节点
			  return this.checkBelongToChooseNode(value, data, node);
			},
			// 判断传入的节点是不是选中节点的子节点
			checkBelongToChooseNode(value, data, node) {
			  const level = node.level;
			  // 如果传入的节点本身就是一级节点就不用校验了
			  if (level === 1) {
			    return false;
			  }
			  // 先取当前节点的父节点
			  let parentData = node.parent;
			  // 遍历当前节点的父节点
			  let index = 0;
			  while (index < level - 1) {
			    // 如果匹配到直接返回
			    if (parentData.data[this.filterStr].indexOf(value) !== -1) {
			      return true;
			    }
			    // 否则的话再往上一层做匹配
			    parentData = parentData.parent;
			    index++;
			  }
			  // 没匹配到返回false
			  return false;
			},
		},
		watch:{
			data(val){
				this.treeList = val;
			},
			treeList(val){
				this.$emit('update:data',val);
			},
			filterText(val) {
			  this.$refs.tree.filter(val);
			}
		}
	}
</script>

<style scoped>
	/deep/ .el-scrollbar__wrap{
		overflow-x: hidden !important;
	}
	.custom-tree-node {
	   flex: 1;
	   display: flex;
	   align-items: center;
	   justify-content: space-between;
	   font-size: 14px;
	   padding-right: 8px;
	 }
	 .tree-container /deep/ .el-tree-node__expand-icon.expanded {
	 		-webkit-transform: rotate(90deg);
	   		transform: rotate(90deg);
	 	}
	 
	 	.tree-container /deep/ .el-icon-caret-right:before {
	 		content: "\e791";
	 		font-size: 18px;
	 	}
	 	
	 	.tree-container /deep/ .el-tree-node__expand-icon{
	 		margin-left: 15px;
	 		padding: 0px;
	 	}
	 	
	 	.tree-container /deep/ .el-tree-node__expand-icon.is-leaf{
	 		margin-left: 0px;
	 	}
	 
	 	.tree-container /deep/ .el-tree-node {
	 		position: relative;
	 		padding-left: 16px;
	 	}
	  
	 	.tree-container /deep/ .el-tree-node__children {
	 		padding-left: 16px;
	 	}
	 
	 
	 	.tree-container /deep/ .el-tree > .el-tree-node:before {
	       	border-left: none;
	     }
	  
	     .tree-container /deep/ .el-tree > .el-tree-node:after {
	       	border-top: none;
	     }
	 	.tree-container /deep/ .el-tree > .el-tree-node:before {
	 		border-left: none;
	 	}
	  
	 	.tree-container /deep/ .el-tree > .el-tree-node:after {
	 		border-top: none;
	 	}
	  
	 	.tree-container /deep/ .el-tree-node:before {
	 		content: "";
	 		left: 10px;
	 		position: absolute;
	 		right: auto;
	 		border-width: 1px;
	 	}
	  
	 	.tree-container /deep/ .el-tree-node:after {
	 		content: "";
	 		left: 10px;
	 		position: absolute;
	 		right: auto;
	 		border-width: 1px;
	 	}
	  
	 	.tree-container /deep/ .el-tree-node:before {
	 		border-left: 1px solid #e6e6e6;
	 		bottom: 0px;
	 		height: 100%;
	 		top: -19px;
	 		width: 1px;
	 	}
	  
	 	.tree-container /deep/ .el-tree-node:after {
	 		border-top: 1px solid #e6e6e6;
	 		height: 25px;
	 		top: 20px;
	 		width: 20px;
	 	}
	 
	 	.el-tree-node :last-child:before {
	       	height: 40px;
	     }
	 
	 	
	 	.tree-container {
	 		margin: 10px;
	 	}
	 	.tree-container /deep/ .el-tree .el-tree-node {
	 		position: relative;
	 	}
	 	.tree-container /deep/ .el-tree-node .el-tree-node__content {
	     	height: 40px;
	 		padding-left: 0 !important;
	 	}
	 	.tree-container /deep/ .el-tree-node .el-tree-node__content::before {
	 		border-left: 1px solid #e6e6e6;
	 		height: 100%;
	 		top: 0;
	 		width: 1px;
	 		margin-left: 1px;
	 		margin-top: 0px;
	 		z-index: 8;
	 	}
	 	.tree-container /deep/ .el-tree-node .el-tree-node__children .el-tree-node__content::before {
	 		border-left: 0px solid #e6e6e6;
	 		height: 100%;
	 		top: 0;
	 		width: 1px;
	 		margin-left: 1px;
	 		margin-top: 0px;
	 		z-index: 8;
	 	}
	 
	 	.tree-container /deep/ .el-tree-node .el-tree-node__content::after {
	 		border-top: 1px solid #e6e6e6;
	 		height: 1px;
	 		top: 18px;
	 		width: 13px;
	 		margin-left: 1px;
	 		z-index: 8;
	 	}
	 	
	 	.tree-container /deep/ .el-tree-node .el-tree-node__children  .el-tree-node__content::after {
	 		border-top: 0px solid #e6e6e6;
	 	}
	 
	 	.tree-container .el-tree-node .el-tree-node__content::before, .tree-container .el-tree-node .el-tree-node__content::after {
	 		content: '';
	 		position: absolute;
	 		right: auto;
	 	}
		 /deep/.is-current>.el-tree-node__content{
		        background: #e4e4ec;
		        position: relative;
				color: #1989FA;
		    }
		/deep/.is-current>.el-tree-node__content::before{
			content: "";
			position: absolute;
			width: 3px;
			height: 100%;
			background: #1989FA;
			top: 0;
			left: 0;;
		}
</style>
