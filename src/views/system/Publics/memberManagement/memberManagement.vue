<template>
	<d2-container>
		<template slot="header">
			<el-form :inline="true">
				<el-form-item>
					<el-select v-model="query.queryMemberLv" class="mr20" style="width:300px" multiple placeholder="按会员等级查询" @change="refreshList">
						<el-option v-for="item in memberLevelSelect" :key="item.name" :label="item.name" :value="item.levelid"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-date-picker
						class="mr20"
						style="width:300px"
						v-model="query.queryRegDate"
						type="daterange"
						align="right"
						unlink-panels
						range-separator="至"
						start-placeholder="注册日期"
						end-placeholder="注册日期"
						:picker-options="pickerOptions"
						format="yyyy-MM-dd"
						value-format="yyyy-MM-dd"
						@blur="refreshList"
					></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-input
						class="mr20"
						style="width:300px"
						type="text"
						clearable
						v-model="pager.condition"
						@keyup.enter.native="refreshList"
						placeholder="按会员卡号 / 姓名 / 拼音 / 联系手机查询"
					/>
				</el-form-item>
				<el-form-item>
					<el-checkbox v-model="myCustomer" class="mr20" @change="refreshList" v-permission="'sys:memberManagement:queryallmemberData'">我的客户</el-checkbox>
					<el-tooltip class="item" effect="dark" content="两个月内会费到期的会员" placement="top">
						<el-checkbox v-model="pastShipFee" class="mr20" @change="refreshList">会费近期</el-checkbox>
					</el-tooltip>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="el-icon-search" @click="refreshList">查询</el-button>
						<el-button type="warning" icon="el-icon-refresh" @click="handleClear">清空</el-button>
					</el-button-group>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="el-icon-circle-plus-outline" v-permission="'sys:memberManagement:add'" @click="handleAddMember">新增会员</el-button>
						<el-button v-permission="'sys:memberManagement:export'" style="width:80px;" icon="el-icon-download" type="success" @click="handleMemberDataExport">导出</el-button>
						<!-- <el-button type="primary" icon v-permission="'sys:memberManagement:add'" @click="handlelookBlack">失信管理</el-button> -->
					</el-button-group>
				</el-form-item>
			</el-form>
		</template>
		<el-table
			:data="tableData"
			border
			style="width:100%"
			height="100%"
			stripe
			:header-cell-style="cellStyle"
			:highlight-current-row="true"
			@row-click="handleRowClick"
			ref="tableM"
		>
			<el-table-column show-overflow-tooltip sortable label="会员卡号" align="center" prop="cardno" width="160" />
			<el-table-column sortable show-overflow-tooltip label="会员姓名" align="center" prop="membername" width="120">
				<template slot-scope="scope">
					<div>
						<el-tooltip class="item" effect="dark" :content="scope.row.sex_dispalay" placement="left">
							<i
								:class="['mkfont', scope.row.sex == 1 ? 'nan' : scope.row.sex == 2 ? 'nv' : 'weizhi']"
								:style="{ color: scope.row.sex == 1 ? '#6DCEFA' : scope.row.sex == 2 ? '#F37E7D' : '' }"
							></i>
						</el-tooltip>
						<span style="min-width:60px;display:inline-block;">{{ scope.row.membername }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip sortable align="center" label="年龄" width="100" prop="age" />
			<el-table-column
				show-overflow-tooltip
				sortable
				label="出生日期"
				align="center"
				width="140"
				:formatter="
					i => {
						return dateFormatSpec(i, 'birthday');
					}
				"
			/>
			<el-table-column show-overflow-tooltip align="center" label="等级" width="80" sortable :sort-method="rowSort">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.memberlevel_display" placement="right">
						<i
							:class="['mkfont', scope.row.icon ? scope.row.icon.split(',')[0] : '']"
							:style="{ color: scope.row.icon ? scope.row.icon.split(',')[1] : '', fontSize: 28 + 'px' }"
						></i>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
				sortable
				label="联系手机"
				align="center"
				prop="mobiletel"
				width="160"
				:formatter="
					i => {
						return PhoneFormat(i, 'mobiletel');
					}
				"
			></el-table-column>
			<el-table-column show-overflow-tooltip sortable label="注册时间" align="center" prop="createtime" width="180" />
			<el-table-column
				show-overflow-tooltip
				sortable
				label="会费生效日期"
				align="center"
				width="160"
				prop="fee_effectivedate"
				:formatter="
					i => {
						return dateFormatSpec(i, 'fee_effectivedate');
					}
				"
			/>
			<el-table-column
				show-overflow-tooltip
				sortable
				label="会费失效日期"
				align="center"
				width="160"
				prop="fee_expirationdate"
				:formatter="
					i => {
						return dateFormatSpec(i, 'fee_expirationdate');
					}
				"
			/>
			<el-table-column show-overflow-tooltip label="客户经理" align="center" fixed="right" width="120" label-class-name="ChangeColor">
				<template slot-scope="scope">
					<span class="underLine" @click="handleOpenManagerModal(scope.row)">{{ scope.row.managerid_display ? scope.row.managerid_display : '关联客户经理' }}</span>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="操作" align="center" fixed="right" width="240" label-class-name="ChangeColor">
				<template slot-scope="scope">
					<div class="tableBtn">
						<el-link v-permission="'sys:memberManagement:edit'" title="信息补充" :underline="false" type="warning" @click="handleMemberMsgSupplement(scope.row)">
							<i class="mkfont bianji1"></i>
						</el-link>
						<el-link v-permission="'sys:memberManagement:fee'" title="会费缴纳" :underline="false" type="success" @click="handleMemberShipfee(scope.row)">
							<i class="mkfont jiaofei"></i>
						</el-link>
						<el-link title="会员视图" v-permission="'sys:memberManagement:memberview'" :underline="false" type="primary" @click="handleViews(scope.row)">
							<i class="mkfont shitu"></i>
						</el-link>
						<el-link title="失信名单" v-permission="'sys:memberManagement:blacklist'" :underline="false" type="danger" @click="handBalckList(scope.row)">
							<i class="mkfont shixin"></i>
						</el-link>
						<el-link title="数据采集" v-permission="'sys:memberManagement:collection'" @click="handleDataCollection(scope.row)" :underline="false">
							<i class="mkfont data" style="color:#bd8cbb"></i>
						</el-link>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- 更换客户经理 -->
		<vxe-modal v-model="changeManagerModal" width="540" height="auto" :showFooter="true">
			<div slot="title">
				更换客户经理 - [
				<span style="color:red;">会员姓名：{{ curRowData.membername }} 性别：{{ curRowData.sex_dispalay }} 年龄：{{ curRowData.age }}</span>
				]
			</div>
			<el-form :model="changeManagerForm" ref="changeManagerForm" label-width="120px">
				<el-form-item label="客户经理" prop="curManager" :rules="[{ required: true, message: '请输入选择客户经理', trigger: 'change' }]">
					<el-select class="inputShort" v-model="changeManagerForm.curManager" placeholder="请选择">
						<el-option v-for="item in customManagerList" :key="item.managerid" :label="item.managername" :value="item.managerid">
							<div>
								<el-tooltip effect="dark" :content="item.sex_dispalay" placement="left">
									<i
										:class="['mkfont', item.sex == 1 ? 'nan' : item.sex == 2 ? 'nv' : 'weizhi']"
										:style="{
											color: item.sex == 1 ? '#6DCEFA' : item.sex == 2 ? '#F37E7D' : ''
										}"
									></i>
								</el-tooltip>
								<span style="min-width:60px;display:inline-block;margin:0 20px 0 10px">工号：{{ item.filterstr }}</span>
								<span>{{ item.managername }}</span>
							</div>
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" style="text-align:center;">
				<el-button-group>
					<el-button type="success" @click="handleChangeManager">提交</el-button>
					<el-button type="warning" @click="changeManagerModal = false">取消</el-button>
				</el-button-group>
			</div>
		</vxe-modal>

		<template slot="footer">
			<mk-page :pager="pager" @query="refreshList" />
		</template>
		<!-- 会员注册 -->
		<member-register :userData.sync="userdata" ref="memberregister" />
		<!-- 数据采集 -->
		<data-collection :userdata.sync="userdata" ref="datacollection"></data-collection>
		<!-- 会员视图 -->
		<member-view :userdata.sync="userdata" v-model="drawer" ref="memberview"></member-view>
		<!-- 会员缴费 -->
		<member-shipfee ref="membershipfee" :userData.sync="userdata" @refresh="refreshList"></member-shipfee>
		<!-- 会员权益 -->
		<member-rights ref="memberrights" :userData.sync="userdata"></member-rights>
		<!-- 会员失信详情 -->
		<blacklist ref="blacklist" :userData.sync="userdata" />
		<!-- 失信管理 -->
		<!-- <BlacklistManagement ref="BlacklistManagement" /> -->
	</d2-container>
</template>

<script>
import pageStatus from '@/minxins/pagestatus.js';
import utils from '@/minxins/util.js';
import imgUpload from '@/components/mk-form/Upload/index.vue';
import DataCollection from './components/datacollection';
import MemberView from './components/memberview';
import MemberShipfee from './components/memberShipfee';
import MemberRights from './components/memberRights';
import blacklist from './components/blacklist';
import MemberRegister from '@/components/mk-custom-components/mk-memberRegister/index.vue';
// import BlacklistManagement from './components/BlacklistManagement';
export default {
	mixins: [pageStatus, utils],
	name: 'memberManagement',
	data() {
		return {
			drawer: false,
			userdata: {},
			pickerOptions: {
				shortcuts: [
					{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}
				]
			},
			query: {
				queryStatus: '',
				queryMemberLv: [],
				queryMemberType: '',
				queryRegDate: []
			},
			myCustomer: '', //我的客户
			pastShipFee: '', // 会费近期
			curRowData: {}, // 当前行
			inputShort: '280px', // 下拉框宽度
			memberLevelSelect: [],
			customManagerList: [],
			changeManagerModal: false,
			changeManagerForm: {
				curManager: ''
			},
			// 会员信息表格
			tableData: [],
			pager: {
				count: 0,
				page: 1,
				rows: 20,
				CONDITION: ''
			},
			exportTabel: {
				columns: [
					{
						label: '会员卡号',
						prop: 'cardno'
					},
					{
						label: '会员姓名',
						prop: 'membername'
					},
					{
						label: '性别',
						prop: 'sex'
					},
					{
						label: '年龄',
						prop: 'age'
					},
					{
						label: '出生日期',
						prop: 'birthday'
					},
					{
						label: '等级',
						prop: 'memberlevel_display'
					},
					{
						label: '联系手机',
						prop: 'mobiletel'
					},
					{
						label: '注册时间',
						prop: 'createtime'
					},
					{
						label: '会费缴纳日期',
						prop: 'actualdate'
					},
					{
						label: '会费失效日期',
						prop: 'fee_expirationdate'
					},
					{
						label: '客户经理',
						prop: 'managerid_display'
					}
				]
			}
		};
	},
	components: {
		imgUpload,
		DataCollection,
		MemberView,
		MemberShipfee,
		MemberRights,
		blacklist,
		// BlacklistManagement
		MemberRegister
	},
	created() {
		this.Memberlevel_Get();
		this.Member_AccountManager_Get();
		this.MemberInfo_Get();
	},
	methods: {
		//失信名单
		handBalckList(row) {
			this.userdata = row;
			this.$refs.blacklist.open();
		},
		//数据采集
		handleDataCollection(row) {
			this.userdata = row;
			this.$refs.datacollection.open();
		},
		// 表格行排序
		rowSort(a, b) {
			let sort1 = a.memberlevel;
			let sort2 = b.memberlevel;
			return sort1 - sort2;
		},
		// 分页刷新 c查询
		refreshList() {
			this.MemberInfo_Get();
		},
		// 清空查询条件
		handleClear() {
			this.query = {
				queryStatus: '',
				queryMemberLv: [],
				queryMemberType: '',
				queryRegDate: []
			};
			this.pager.condition = '';
			this.myCustomer = false;
			this.pastShipFee = false;
			this.MemberInfo_Get();
		},
		// 新增会员按钮
		handleAddMember() {
			this.$refs.memberregister.open();
			this.$refs.memberregister.init();
		},
		// 会员视图
		handleViews(row) {
			this.userdata = row;
			this.drawer = true;
		},
		// 会员权益
		handleRights(row) {
			this.userdata = row;
			this.$refs.memberrights.open();
			this.$refs.memberrights.MemberRights_Get(row.memberid);
		},
		// 会员数据导出
		handleMemberDataExport() {
			this.MK.Request('Publics/MemberManage/BasicInfo', 'get', {
				createuserid: this.info.userid,
				tag: 1
			}).then(res => {
				this.exportExcel(res.data);
			});
		},
		exportExcel(data) {
			this.$export
				.excel({
					columns: this.exportTabel.columns,
					data: data,
					title: '会员列表'
					//header: ['卡号','名字'],
					//merges: this.merges
				})
				.then(() => {
					this.$message('导出表格成功');
				});
		},
		// 会费缴纳行操作
		handleMemberShipfee(row) {
			this.userdata = row;
			this.$refs.membershipfee.open();
			this.$refs.membershipfee.isPrint = false;
			this.$refs.membershipfee.activeName = 'first';
			this.$refs.membershipfee.curRightsTableData = [];
			this.$refs.membershipfee.paymentRightsTableData = [];
			this.$refs.membershipfee.shipfeeForm.actualfee = '';
			this.$refs.membershipfee.shipfeeForm.shouldfee = '';
			this.$refs.membershipfee.shipfeeForm.membertypeid = '';
			this.$refs.membershipfee.CurMemberRights_Get(row.memberid);
		},
		handleRowClick(row) {
			row.isRecharge = true;
			this.curRowData = row;
		},
		// 客户经理模态框
		handleOpenManagerModal(row) {
			this.curRowData = row;
			
			this.changeManagerModal = true;
			this.changeManagerForm.curManager = row.managerid_display;
		},
		// 更改客户经理
		handleChangeManager() {
			const data = {
				memberid: this.curRowData.memberid,
				managerid: isNaN(this.changeManagerForm.curManager) ? this.curRowData.managerid : this.changeManagerForm.curManager
			};
			this.$refs.changeManagerForm.validate(valid => {
				if (valid) {
					this.MK.Request('Publics/MemberManage/ChangeAccountManager', 'post', data).then(res => {
						this.$message.success(res.msg);
						this.MemberInfo_Get();
						this.$refs.changeManagerForm.clearValidate();
						this.changeManagerModal = false;
					});
				}
			});
		},
		// 会员信息补充
		handleMemberMsgSupplement(row) {
			this.userdata = row;
			this.$refs.memberregister.open();
			this.$refs.memberregister.isNewMember = false;
			this.$refs.memberregister.isSubmitBasicInfo = true;
			this.$refs.memberregister.MemberInfoByid_Get(row.memberid);
		},
		// 表格列头样式
		cellStyle({ row, column, rowIndex, columnIndex }) {
			if (column.labelClassName == 'ChangeColor') {
				return 'color:#409EFF';
			} else {
				return '';
			}
		},
		Memberlevel_Get() {
			this.MK.Request('Publics/MemberManage/Memberlevel', 'get', {
				condition: '',
				page: 1,
				rows: 10,
				tag: 1
			}).then(res => {
				this.memberLevelSelect = res.data.map(item => {
					item.isCheck = false;
					return item;
				});
			});
		},
		MemberInfo_Get() {
			let isPerms = this.$permission('sys:memberManagement:queryallmemberData');
			this.MK.Request('Publics/MemberManage/BasicInfo', 'get', {
				createuserid: this.info.userid,
				mycustomer: isPerms ? (this.myCustomer ? 1 : 0) : 1,
				expirationdaysmemberfee: this.pastShipFee ? 1 : 0,
				regdatebegin: this.query.queryRegDate != null ? this.query.queryRegDate[0] : '',
				regdatesend: this.query.queryRegDate != null ? this.query.queryRegDate[1] : '',
				levelidarr: this.query.queryMemberLv,
				condition: this.pager.condition,
				page: this.pager.page,
				rows: this.pager.rows,
				tag: 0,
				orderby: 'createtime desc'
			}).then(res => {
				this.tableData = res.data;
				this.pager.count = res.count;
			});
		},
		Member_AccountManager_Get() {
			this.MK.Request('Publics/MemberManage/AccountManager', 'get', {
				condition: '',
				hospitalid: this.info.hospitalid,
				page: 0,
				rows: 0,
				tag: 1
			}).then(res => {
				this.customManagerList = res.data;
			});
		}
	},
	watch: {
		'query.queryRegDate'(val) {
			if (val == null) {
				this.refreshList();
			}
		}
	}
};
</script>

<style scoped>
>>> .el-date-editor .el-range-separator {
	width: 8%;
}
>>> .el-select-dropdown__item span {
	width: 20px;
	height: 20px;
	border: 1px solid red;
}
.mr20 {
	margin-right: 20px !important;
}
.underLine {
	text-decoration: underline;
	color: #409eff;
	font-weight: bold;
	cursor: pointer;
}
.footer {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
