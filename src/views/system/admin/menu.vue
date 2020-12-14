<template>
	<d2-container>
		<template slot="header">
<!-- 			<el-form :inline="true">
				<el-form-item label="">
					<el-input style="width:220px;" v-model="form.condition" placeholder="按菜单名称查询"
					@keyup.enter.native=""
					></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-button type="primary" @click="add">新增</el-button>
				</el-form-item>
			</el-form> -->
		</template>
		 <el-table
			v-if="show"
			size="small"
			border		
			ref="menu"
			:data="tableData"
			height="100%"
			highlight-current-row
		    row-key="menuid"
		    :default-expand-all="isExpandAll"
		    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
			<el-table-column width="100" align="center" fixed="left">
			  <div slot="header" slot-scope="scope">
			    <el-link :underline="false"  :icon="isExpandAll ? 'el-icon-caret-bottom' : 'el-icon-caret-top'" @click="expand">{{isExpandAll ? '全部收起' : '全部展开'}}</el-link>
			  </div>
			</el-table-column>
		    <el-table-column
			width="230"
			fixed="left"
		      prop="title"
			  show-overflow-tooltip
		      label="名称"
		      sortable>
			  <template slot-scope="scope">
				  <el-link class="el-icon-folder-opened" :underline="false" type="warning" v-if="scope.row.target == 'expand'"> </el-link>
				  <el-link class="fa fa-file-o" :underline="false" type="success" v-if="scope.row.target == 'iframe'"> </el-link>
				  <el-link class="el-icon-turn-off" :underline="false" type="primary" v-if="scope.row.target == 'button'"> </el-link>
				 {{scope.row.title}}
			  </template>
		    </el-table-column>
		    <el-table-column
			align="center"
		      prop="icon"
		      label="图标"
		      width="80">
			  <template slot-scope="scope">
				  <d2-icon :name="scope.row.icon"/>
			  </template>
		    </el-table-column>
		    <el-table-column
			show-overflow-tooltip
			width="300"
		      prop="perms"
		      label="权限标识">
		    </el-table-column>
			<el-table-column
			show-overflow-tooltip
			width="300"
			  prop="name"
			  label="路由名称">
			</el-table-column>
			<el-table-column
			show-overflow-tooltip
			width="300"
			  prop="path"
			  label="路由地址">
			</el-table-column>
			<el-table-column
			show-overflow-tooltip
			width="300"
			  prop="component"
			  label="路由组件">
			</el-table-column>
			<el-table-column
			align="center"
			show-overflow-tooltip
			  prop="cache"
			  width="80"
			  label="缓存">
				<template slot-scope="scope">
					{{scope.row.cache == true ? '是' : '否'}}
				</template>
			</el-table-column>
			<el-table-column
			align="center"
			show-overflow-tooltip
			  prop="menusort"
			  width="60"
			  label="排序">
			</el-table-column>
			<!-- <el-table-column
			align="center"
			  prop="target"
			  fixed="right"
			   width="80"
			  label="类型">
			  <template slot-scope="scope">
				  <i class="el-icon-folder-opened" v-if="scope.row.target == 'expand'"> </i>
				  <i class="el-icon-paperclip" v-if="scope.row.target == 'iframe'"> </i>
				  <i class="el-icon-turn-off" v-if="scope.row.target == 'button'"> </i>
				 {{scope.row.target == 'expand' ? '目录' : scope.row.target == 'iframe' ? '菜单' : '按钮'}}
			  </template>
			</el-table-column> -->
			<el-table-column
			width="60"
			align="center"
			fixed="right"
			  prop="status"
			  label="可见性">
			  <template slot-scope="scope">
				  <el-tag size="mini" :type="scope.row.status == 1 ? 'success' : 'danger'"> {{scope.row.status == 1 ? '显示' : '隐藏'}}</el-tag>
				 
			  </template>
			</el-table-column>
			<el-table-column
			fixed="right"
			width="160"
			align="center"
			label="操作"
			>
			<div slot="header">
				<el-button type="primary" size="mini" @click="add">新增</el-button>
			</div>
				<template slot-scope="scope">
					 <div class="tableBtn">
					<el-link
					  title="编辑"
					  @click="rowEdit(scope.row)"
					  :underline="false"
					  type="primary"
					  icon="mkfont bianji1"
					></el-link>
					<el-link
					  title="添加"
					   @click="rowAdd(scope.row)"
					  :underline="false"
					  type="primary"
					  icon="el-icon-plus"
					></el-link>
					<el-link
					  title="删除"
					  @click="rowDel(scope.row)"
					  :underline="false"
					  type="danger"
					  icon="el-icon-delete"
					></el-link>
					</div>
				</template>
			</el-table-column>
		  </el-table>
		   <!-- liqian-高度auto -->
		  <vxe-modal v-model="menuModal" title="菜单维护" :showFooter="true" width="800" @close="closeModal" height="auto">
		  	<el-form ref="form" :model="form" :rules="rules" label-width="80px">
		  	  <el-form-item label="上级菜单">
		  	   <treeselect 
			   v-model="form.parmenuid" 
			   @input="userMenuidChange"
				placeholder="请选择菜单"  
				:searchable="false"
				:show-count="false"
				:default-expand-level="1"  
				:normalizer="normalizer" 
				 :options="dataMenu" />
		  	  </el-form-item>
			  <el-form-item label="菜单类型" prop="target">
				 <el-radio-group v-model="form.target">
				    <el-radio label="expand">目录</el-radio>
				    <el-radio label="iframe">菜单</el-radio>
				    <el-radio label="button">按钮</el-radio>
				  </el-radio-group>
				 
			  </el-form-item>
			  <el-form-item label="菜单图标" prop="target" v-if="form.target != 'button'"> 
				  <d2-icon-select v-model="form.icon"/>
			  </el-form-item> 
			 <el-form-item label="菜单名称" prop="title">
			 	<el-input clearable v-model="form.title"></el-input>
			 </el-form-item>
			 <el-form-item label="显示排序" prop="menusort">
				  <el-input-number v-model="form.menusort" controls-position="right"  ></el-input-number>
			 </el-form-item>
			 <el-form-item label="路由名称" prop="name" v-if="form.target != 'button'">
			 	<el-input clearable v-model="form.name"></el-input>
			 </el-form-item>
			 <el-form-item label="路由地址" prop="path" v-if="form.target != 'button'">
			 	<el-input clearable v-model="form.path"></el-input>
			 </el-form-item>
			 <el-form-item label="组件路径" prop="component"  v-if="form.target != 'button'">
			 	<el-input clearable v-model="form.component"></el-input>
			 </el-form-item>
			 <el-form-item label="可见性" prop="status"  v-if="form.target != 'button'">
				<el-radio-group v-model="form.status"  size="mini">
				   <el-radio-button :label="1">显示</el-radio-button>
				   <el-radio-button :label="0">隐藏</el-radio-button>
				</el-radio-group>
			 </el-form-item>
			 <el-form-item label="权限标识" prop="perms">
			 	<el-input clearable v-model="form.perms"></el-input>
			 </el-form-item>
			 <el-form-item label="是否缓存" prop="cache"  v-if="form.target != 'button'">
			 	<el-checkbox name="type" v-model="form.cache"></el-checkbox>
			 </el-form-item>
			 <el-form-item label="验证登录" prop="auth"  v-if="form.target != 'button'">
			 	<el-checkbox name="type" v-model="form.auth"></el-checkbox>
			 </el-form-item>
		  	</el-form>
			<el-alert  v-if="form.target == 'button'" :closable="false" title="权限标识" type="error">
			
				<div>
					<p>权限标识是每个页面按钮的唯一id,格式如 sys:pageName:add, sys固定 pageName是页面的name add按钮的操作类型,按钮类型统一格式为</p>
					<p>查询：query，新增：add，编辑：edit，删除：del，导出：export，导入：import</p>
					<p>页面元素用法：v-permission="'sys:pageName:add'" </p>
					<p>函数调用：this.$permission('sys:pageName:add') </p>
				</div>
			</el-alert>
			<div slot="footer" style="text-align:center;">
			  <el-button type="success" @click="submitForm('form')">保存</el-button>
			  <el-button @click="closeModal">关闭</el-button>
			</div>
		  </vxe-modal>
	</d2-container>
</template>
<style scoped>
	.el-button--mini.is-thin {
	    padding-left: 8px !important;
	    padding-right: 8px !important;
	}
</style>
<script>
	import {
		mapState,
		mapActions
	} from "vuex";
	// import the component
	import Treeselect from "@riophae/vue-treeselect";
	// import the styles
	import "@riophae/vue-treeselect/dist/vue-treeselect.css";
	import util from "@/libs/util.js";
	import api from "@/api";
	export default {
		name: "adminmenu",
		components:{
			Treeselect
		},
		data() {
			return {
				isExpandAll: true,
				tableExpand:true,
				show:true,
				menuModal:false,
				tableData:[],
				rules: {
					title: [{
							required: true,
							message: "请输入菜单名称",
							trigger: "blur"
						},
						{
							min: 2,
							max: 36,
							message: "长度在 2 到 36 个字符",
							trigger: "blur"
						}
					],
					path: [{
						required: true,
						message: "请输入菜单路径",
						trigger: "blur"
					}],
					// perms: [{
					// 	required: true,
					// 	message: "请输入权限标识",
					// 	trigger: "blur"
					// }],
					menusort: [{
						type: "number",
						message: "必须为数字值"
					}]
				},
				form:{
					perms: "", //权限标识 例 sys:user:add  ps sys固定 user根据页面名称来 add也是固定格式 增加按钮add 删除按钮del 查询query 修改edit
					menuid: "", //菜单Id
					parmenuid: null, //父菜单Id
					title: "", //菜单名称
					path: "", //菜单路径
					icon: "", //菜单icon
					menusort: "", //排序
					component: "", //页面组件
					name: "", //页面名称
					userid: util.cookies.get("uuid"), //操作人
					cache: true, //
					auth: true,
					status: 1, //0停用 1启用
					target: 'expand', //expand 目录 iframe 菜单 button 按钮
					memo: "" //备注
				},
				dataMenu: [],
				normalizer(node) {
				  return {
				    id: node.menuid,
				    label: node.title,
				    children: node.children
				  };
				},
			}
		},
		computed: {
			...mapState("d2admin/user", ["info"])
			
		},
		watch: {
			
		},
		mounted() {
			this.getRoutFormMenuData();
		
		},
		methods: {
			initForm() {
				this.form = {
					operatetype:"C",
					menuid: "", //菜单Id
					parmenuid: null, //父菜单Id
					title: "", //菜单名称
					path: "", //菜单路径
					icon: "", //菜单icon
					menusort: "", //排序
					component: "", //页面组件
					name: "", //页面名称
					userid: this.info.userid, //操作人
					cache: true, //
					auth: true,
					status: 1, //0停用 1启用
					target: 'expand', //expand 目录 iframe 菜单
					memo: "" //备注
				};
				this.$nextTick(() => {
					this.$refs["form"].clearValidate();
				})
			},
			expand() {
			  this.isExpandAll = !this.isExpandAll;
			  this.show = false;
			   const loading = this.$loading({
				lock: true,
				text: '加载中...',
				spinner: 'el-icon-loading',
				background: 'rgba(255, 255, 255, 0.7)'
			  });
		
			  setTimeout(_ => {
				  this.show = true;
				  loading.close();
			    }, 200);
			  // for (let row of this.tableData) {
			  //   setTimeout(_ => {
			  //     this.$refs.menu.toggleRowExpansion(row);
			  //   }, 200);
			  // }
			},
			closeModal(){
				this.initForm();
				this.menuModal = false;
			},
			//使用菜单更改回调
			userMenuidChange(val) {
				
			},
			rowEdit(row){
				console.log(row)
				this.setFrom(row);
				this.menuModal = true;
			},
			rowAdd(row){
				this.form.parmenuid = row.menuid;
				this.form.target = 'iframe';
				this.menuModal = true;
			},
			rowDel(row){
				this.form = JSON.parse(JSON.stringify(row));
				this.Menu_Del();
			},
			add(){
				this.menuModal = true;
				this.initForm()
			},
			//提交
			submitForm(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						if (this.form.menuid != "") {
							this.Menu_Edit();
						} else {
							this.Menu_Add();
						}
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			//添加
			Menu_Add() {
				let data = JSON.parse(JSON.stringify(this.form));
				data.parmenuid = data.parmenuid == null ? '0' : data.parmenuid;
				this.MK.Request("/Publics/Common/Menu_Add", "post", data).then(
					res => {
						if(res.code == 0){
							this.$message({
								type: "success",
								message: res.msg
							});
							this.menuModal = false;
							this.getRoutFormMenuData();
							this.initForm();
						}
					}
				);
			},
			//编辑
			Menu_Edit() {
				let data = JSON.parse(JSON.stringify(this.form));
				data.parmenuid = data.parmenuid == null ? '0' : data.parmenuid;
				data.operatetype = 'U';
				this.MK.Request("/Publics/Common/Menu_Edit", "post", data).then(
					res => {
						if(res.code == 0){
							this.$message({
								type: "success",
								message: res.msg
							});
							this.menuModal = false;
							this.getRoutFormMenuData();
							this.initForm();
						}
					}
				);
			},
			//删除
			Menu_Del() {
				this.form.operatetype = 'D';
				this.MK.Request("/Publics/Common/Menu_Del", "post", this.form).then(
					res => {
						this.$message({
							type: "success",
							message: res.msg
						});
						this.getRoutFormMenuData();
						this.initForm();
					}
				);
			},
			//设置表单
			setFrom(data) {
				data.parmenuid = data.parmenuid == '0' ? null :  data.parmenuid;
				this.form = JSON.parse(JSON.stringify(data));
				this.$nextTick(() => {
					this.$refs["form"].clearValidate();
				})
			},
			//将字符串改为布尔值 Boolean
			getMenuName(menus) {
				for (let value of menus) {
					this.$set(value, "auth", value.auth === "true" ? true : false);
					this.$set(value, "cache", value.cache === "true" ? true : false);
					if (value.children) {
						this.getMenuName(value.children);
					}
				}
			},
			async getRoutFormMenuData() {
				let data = {
					userid: this.info.userid,
					tag: -1
				};
				let getRoutFormMenuData = await api.MENU_ALL(data);
				this.tableData = getRoutFormMenuData.dataRoute;
				this.getMenuName(this.tableData);
				this.dataMenu = this.tableData;
			}
		}
	};
</script>
