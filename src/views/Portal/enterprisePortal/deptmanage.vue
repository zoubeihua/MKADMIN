<template>
	<d2-container>
		<template slot="header">
			<el-form :inline="true">
			  <el-form-item>
			    <el-input
			      style="width:360px;"
			      @keyup.enter.native="query"
			      v-model="pager.condition"
			      placeholder="按部门名称（首拼）查找"
			    ></el-input>
			  </el-form-item>
			  <el-form-item>
			    <el-button-group>
			      <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
			      <el-button type="primary" icon="el-icon-upload2" @click="Import" >导入</el-button>
			      <el-button type="primary" icon="el-icon-download" @click="Export">导出</el-button>
			     </el-button-group>
			  </el-form-item>
			</el-form>
		</template>
		<el-table
		:data="dataTable"
		stripe
		border
		highlight-current-row
		height="100%">
		<el-table-column label="部门ID" sortable show-overflow-tooltip prop="deptid">
		</el-table-column>
		<el-table-column label="上级部门" sortable show-overflow-tooltip prop="deptid">
		</el-table-column>
		<el-table-column label="部门名称" sortable show-overflow-tooltip prop="deptid">
		</el-table-column>
		<el-table-column label="部门负责人" sortable show-overflow-tooltip prop="deptid">
		</el-table-column>
		<el-table-column label="部门负责人电话" sortable show-overflow-tooltip prop="deptid">
		</el-table-column>
		<el-table-column label="部门状态" sortable show-overflow-tooltip prop="deptid">
		</el-table-column>
		<el-table-column >
			<template slot="header">
			  <el-button type="primary" @click="deptAdd">添加</el-button>
			</template>
			<template slot-scope="scope">
			</template>
		</el-table-column>
		</el-table>
		<template slot="footer">
			 <mk-page :pager="pager" @query="query" />
		</template>
		 <vxe-modal v-model="dialogVisible" ref="effectModal" title="部门维护" @close="handleClose" :showFooter="true" width="460" height="auto"  >
			 <el-form :model="form" :rules="rules" label-width="120px" ref="ruleForm">
			    <el-form-item label="上级部门" prop="crfname">
			      <el-input
			        autocomplete="off"
			        clearable
			      ></el-input>
			    </el-form-item>
				<el-form-item label="部门名称" prop="crfname">
				  <el-input
				    autocomplete="off"
				    clearable
				  ></el-input>
				</el-form-item>
				<el-form-item label="部门负责人姓名" prop="crfname">
				  <el-input
				    autocomplete="off"
				    clearable
				  ></el-input>
				</el-form-item>
				<el-form-item label="部门负责人电话" prop="crfname">
				  <el-input
				    autocomplete="off"
				    clearable
				  ></el-input>
				</el-form-item>
			  </el-form>
			 <div slot="footer" style="text-align:center;">
			 	<el-button-group>
			 		<el-button @click="dialogVisible = false">取 消</el-button>
			 		<el-button type="primary" @click="submitForm('ruleForm')"
			 		  >确 定</el-button>
			 	</el-button-group>
			 </div>
		</vxe-modal>
		<!-- 导入弹窗 -->
		 <vxe-modal v-model="importVisible" destroy-on-close title="企业人员导入"  width="600" height="500">
			<import-data @close="e => { importVisible = e}" ></import-data>
		 </vxe-modal>
	</d2-container>
</template>

<script>
	import importData from '../components/importData.vue'
	export default {
		components:{
			importData
		},
		data(){
			return {
				dataTable:[],
				pager:{
					condition:"",
					count: 0,
					page: 1,
					rows: 20
				},
				form:{
					
				},
				rules:{},
				dialogVisible:false,
				importVisible:false
			}
		},
		methods:{
			query(){
				// this.$XModal.message({ message: '不允许重复点击', id: 'unique1' ,status:'loading',lockView:true})
			},
			Import(){
				this.importVisible = true;
			},
			Export(){
				
			},
			handleClose(){
				
			},
			deptAdd(){
				this.dialogVisible = true;
			}
		}
	}
</script>

<style>
</style>
