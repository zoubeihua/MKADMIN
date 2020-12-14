<template>
	<d2-container>
		<SplitPane :min-percent="20" :default-percent="30" split="vertical">
			<template slot="paneL">
				<el-container>
					<el-main style="background-color: #fafafa;">
						<el-form label-width="auto">
							<el-form-item label="选择部门">
								<el-input @keyup.enter.native="query" v-model="form.condition" placeholder="请选择部门"></el-input>
							</el-form-item>
							<el-form-item label="年度体检">
								<el-input @keyup.enter.native="query" v-model="form.condition" placeholder="请选择年度体检"></el-input>
							</el-form-item>
							<el-form-item label="选择职务">
								<el-input @keyup.enter.native="query" v-model="form.condition" placeholder="请选择职务"></el-input>
							</el-form-item>
							<el-form-item label="年龄范围">
								<range-input v-model="form.agerange"></range-input>
							</el-form-item>
							<el-form-item label="选择性别">
								<el-input @keyup.enter.native="query" v-model="form.condition" placeholder="请选择性别"></el-input>
							</el-form-item>
							<el-form-item label="已选套餐">
								<el-input @keyup.enter.native="query" v-model="form.condition" placeholder="请选择套餐"></el-input>
							</el-form-item>
							<el-form-item label="套餐状态">
								<el-input @keyup.enter.native="query" v-model="form.condition" placeholder="请选择套餐状态"></el-input>
							</el-form-item>
							<el-form-item label="预约日期">
								<el-date-picker style="width: 100%;" value-format="yyyy-MM-dd" v-model="daterange" type="daterange" align="right"
								 unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
							</el-form-item>
							<el-form-item label="模糊查询">
								<el-input @keyup.enter.native="query" v-model="form.condition" placeholder="按姓名(首拼)、电话查询"></el-input>
							</el-form-item>
							<el-form-item label="预约通知">
								<el-radio-group v-model="form.tip">
									<el-radio :label="1">是</el-radio>
									<el-radio :label="0">否</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="query">查询</el-button>
							</el-form-item>
						</el-form>
					</el-main>
				</el-container>
			</template>
			<template slot="paneR">
				<el-container>
					<el-header>
						<el-button-group>
							<el-button type="primary" @click="add">添加套餐</el-button>
							<el-button type="primary" @click="edit">修改套餐</el-button>
							<el-button type="primary" @click="editKeep">修改预约</el-button>
							<el-button type="primary">发送预约消息</el-button>
							<el-button type="primary" icon="el-icon-download" @click="Export">导出</el-button>
						</el-button-group>
					</el-header>
					<el-main style="padding: 0;">
						<el-table :data="dataTable" stripe border highlight-current-row height="100%">
							<el-table-column label="工号" sortable show-overflow-tooltip prop="deptid"></el-table-column>
							<el-table-column label="姓名" sortable show-overflow-tooltip prop="deptid"></el-table-column>
							<el-table-column label="性别" sortable show-overflow-tooltip prop="deptid"></el-table-column>
							<el-table-column label="身份证号" sortable show-overflow-tooltip prop="deptid"></el-table-column>
							<el-table-column label="出生日期" sortable show-overflow-tooltip prop="deptid"></el-table-column>
							<el-table-column label="年龄" sortable show-overflow-tooltip prop="deptid"></el-table-column>
							<el-table-column label="联系电话" sortable show-overflow-tooltip prop="deptid"></el-table-column>
							<el-table-column label="职务" sortable show-overflow-tooltip prop="deptid"></el-table-column>
							<el-table-column label="已选套餐" sortable show-overflow-tooltip prop="deptid"></el-table-column>
							<el-table-column label="预约日期" sortable show-overflow-tooltip prop="deptid"></el-table-column>
							<el-table-column label="体检状态" sortable show-overflow-tooltip prop="deptid"></el-table-column>
							<el-table-column label="付款状态" sortable show-overflow-tooltip prop="deptid"></el-table-column>
						</el-table>
					</el-main>
				</el-container>
			</template>
		</SplitPane>
		<!-- 套餐 -->
		<vxe-modal v-model="addPackageModal" destroy-on-close :title="title" fullscreen width="99vw" height="99vh">
			<SplitPane :min-percent="20" :default-percent="36" split="vertical">
				<template slot="paneL">
					<el-container>
						<el-header style="background-color: #eef1f6;padding: 0 !important;">
							已选择员工列表
						</el-header>
						<el-main style="padding: 0;">
							<el-table :data="PackageDataTable" stripe border highlight-current-row height="100%">
								<el-table-column label="工号" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="姓名" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="性别" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="身份证号" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="出生日期" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="年龄" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="联系电话" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="职务" show-overflow-tooltip prop="deptid">
								</el-table-column>
							</el-table>
						</el-main>
					</el-container>

				</template>
				<template slot="paneR">
					<el-container>
						<el-header style="background-color: #eef1f6;padding: 0 !important;">
							套餐信息列表
						</el-header>
						<el-main style="padding: 0;">
							<el-table :data="RightPackageDataTable" stripe border highlight-current-row height="100%">
								<el-table-column label="套餐名称" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="套餐价格" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="适应性别" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="适应人群 " show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="适应年龄" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="操作" show-overflow-tooltip prop="deptid">
									<template slot-scope="scope">
										<el-link type="primary">查看详情</el-link>
									</template>
								</el-table-column>
							</el-table>
						</el-main>
					</el-container>
				</template>
			</SplitPane>
		</vxe-modal>
		<!-- 套餐明细 -->
		<vxe-modal v-model="DetailPackageModal" destroy-on-close title="套餐明细" fullscreen width="99vw" height="99vh">
			<el-container>
				<el-header style="padding: 0 !important;">
					<table style="width: 100%;" class="tables">
						<tr>
							<th width="200">套餐名称</th>
							<td>1</td>
						</tr>
						<tr>
							<th>套餐价格</th>
							<td>1</td>
						</tr>
						<tr>
							<th>适应性别</th>
							<td>1</td>
						</tr>
						<tr>
							<th>适应人群</th>
							<td>1</td>
						</tr>
						<tr>
							<th>适应年龄</th>
							<td>1</td>
						</tr>
						<tr>
							<th class="tableTitleBg">分类</th>
							<td align="center" class="tableTitleBg">分类明细</td>
						</tr>
					</table>
					
				</el-header>
				<el-main style="padding: 0;">
					<el-container>
					  <el-aside width="200px">
						  <table style="width: 100%;" class="tables table-th-h">
						  	<tr>
						  		<th width="200">一般检查</th>
						  	</tr>
						  	<tr>
						  		<th>超声检查</th>
						  	</tr>
						  	<tr>
						  		<th>妇科检查</th>
						  	</tr>
						  	<tr>
						  		<th>化验检查</th>
						  	</tr>
						  </table>
					  </el-aside>
					  <el-main style="padding: 0;">
						  <el-table :data="classDetailData" stripe border highlight-current-row height="100%">
						  	<el-table-column label="名称" show-overflow-tooltip prop="deptid">
						  	</el-table-column>
						  	<el-table-column label="数量" show-overflow-tooltip prop="deptid">
						  	</el-table-column>
						  	<el-table-column label="单位" show-overflow-tooltip prop="deptid">
						  	</el-table-column>
						  	<el-table-column label="检查意义 " show-overflow-tooltip prop="deptid">
						  	</el-table-column>
						  	<el-table-column label="注意事项" show-overflow-tooltip prop="deptid">
						  	</el-table-column>
						  </el-table>
					  </el-main>
					</el-container>
					
					
				</el-main>
			</el-container>
		</vxe-modal>
		<!-- 预约 -->
		<vxe-modal v-model="keepModal" destroy-on-close title="体检预约" fullscreen width="99vw" height="99vh">
			<SplitPane :min-percent="20" :default-percent="50" split="vertical">
				<template slot="paneL">
					<el-container>
						<el-header style="padding: 0 5px !important;" class="tableTitleBg">
							已选择员工列表
						</el-header>
						<el-main style="padding: 0 !important;">
							<el-table :data="staffData" stripe border highlight-current-row height="100%">
								<el-table-column
								      type="selection"
								      width="55">
								</el-table-column>
								<el-table-column label="工号" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="姓名" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="性别" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="身份证号 " show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="已选套餐" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="出生日期" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="年龄" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="联系电话" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="职务" show-overflow-tooltip prop="deptid">
								</el-table-column>
							</el-table>
						</el-main>
					</el-container>
				</template>
				<template slot="paneR">
					<el-container>
						<el-header style="padding: 0 5px !important;" class="tableTitleBg">
							 <div style="padding-right: 30px;">预约信息</div> 
							 <el-button-group size="mini">
							  <el-button type="primary" icon="el-icon-arrow-left">上一月</el-button>
							  <el-button type="primary">下一月<i class="el-icon-arrow-right el-icon--right"></i></el-button>
							</el-button-group>
						</el-header>
						<el-main style="padding: 0 !important;">
							<el-table :data="keepData" stripe border highlight-current-row height="100%">
								<el-table-column label="日期" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="已约人数" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="可约人数" show-overflow-tooltip prop="deptid">
								</el-table-column>
								<el-table-column label="操作 " show-overflow-tooltip prop="deptid">
								</el-table-column>
							</el-table>
						</el-main>
					</el-container>
				</template>
			</SplitPane>	
		</vxe-modal>
	</d2-container>
</template>

<script>
	import RangeInput from "@/components/mk-form/mk-range-input/index.vue";
	export default {
		components: {
			RangeInput
		},
		data() {
			return {
				title: "添加套餐",
				addPackageModal: false,
				DetailPackageModal:false,
				keepModal:false,
				dataTable: [],
				classDetailData:[],
				PackageDataTable: [],
				RightPackageDataTable: [],
				staffData:[],
				keepData:[],
				daterange: "",
				pickerOptions: {
					shortcuts: [{
							text: "最近一周",
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
								picker.$emit("pick", [start, end]);
							}
						},
						{
							text: "最近一个月",
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
								picker.$emit("pick", [start, end]);
							}
						},
						{
							text: "最近三个月",
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
								picker.$emit("pick", [start, end]);
							}
						}
					]
				},
				form: {
					agerange: ""
				},
				packageForm: {

				}
			}
		},
		methods: {
			query() {

			},
			Export() {

			},
			//添加预约
			add() {
				this.title = '添加套餐'
				this.addPackageModal = true;
			},
			//编辑预约
			edit() {
				this.title = '修改套餐'
				this.addPackageModal = true;
			},
			//修改预约
			editKeep(){
				this.keepModal = true;
			}
		}
	}
</script>

<style scoped>
	.tables,.tables tr th,.tables tr td{
		border:1px solid #cfcfcf; 
		border-collapse: collapse;
		padding: 5px ;
	}
	.tables tr th{
		text-align: center;
		font-weight: bold;
	}
	.table-th-h{
		border-top: 0 !important;
	}
	.table-th-h th{
		padding: 30px  0 !important;
		border-top: 0 !important;
	}
	.tableTitleBg{
		background-color: #eef1f6;
	}
</style>
