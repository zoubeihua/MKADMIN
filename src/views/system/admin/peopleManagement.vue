<template>
	<d2-container>
		<template slot="header">
			<el-form :inline="true">
				<el-form-item>
					<mk-select
						style="width:150px;"
						v-model="pager.hospitalid"
						@change="getStaffInfo"
						placeholder="选择院区"
						url="/Publics/Common/Dic/HospitalInfo"
						:filter="['hospitalname', 'filterstr']"
						label="hospitalname"
						val="hospitalid"
					></mk-select>
				</el-form-item>
				<el-form-item>
					<mk-select
						style="width:150px;"
						v-model="pager.deptid"
						:isInit="false"
						@change="getStaffInfo"
						placeholder="选择科室"
						:url="isHospitalid"
						:param="{ hospitalid: pager.hospitalid }"
						:filter="['Name']"
						label="Name"
						val="ID"
					></mk-select>
				</el-form-item>
				<el-form-item>
					<mk-select
						style="width:150px;"
						v-model="pager.stafftype"
						@change="getStaffInfo"
						placeholder="选择人员类型"
						:datas="getDicStandarDcode('人员类型')"
						:filter="['bzname', 'filterstr']"
						label="bzname"
						val="bzcode"
					></mk-select>
				</el-form-item>
				<el-form-item>
					<mk-select
						style="width:150px;"
						v-model="pager.jobtitle"
						@change="getStaffInfo"
						placeholder="选择职称"
						:datas="getDicStandarDcode('职称')"
						:filter="['bzname', 'filterstr']"
						label="bzname"
						val="bzcode"
					></mk-select>
				</el-form-item>
				<el-form-item>
					<mk-select
						style="width:150px;"
						v-model="pager.position"
						@change="getStaffInfo"
						placeholder="选择职务"
						:datas="getDicStandarDcode('职务(聘)')"
						:filter="['bzname', 'filterstr']"
						label="bzname"
						val="bzcode"
					></mk-select>
				</el-form-item>
				<el-form-item>
					<el-input
						class="mr20"
						style="width:300px"
						type="text"
						clearable
						v-model="pager.condition"
						@keyup.enter.native="getStaffInfo"
						placeholder="按会员工号 / 姓名 / 输入码查询"
					/>
				</el-form-item>
				<el-form-item>
					<el-button-group><el-button type="primary" icon="el-icon-search" @click="getStaffInfo">查询</el-button></el-button-group>
				</el-form-item>
			</el-form>
			<el-button-group class="headerR" style="margin-top: -4px;">
				<el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleInit">新增工作人员</el-button>
			</el-button-group>
		</template>
		<SplitPane :min-percent="20" :default-percent="80" split="vertical">
			<!-- 左屏 -->
			<template slot="paneL">
				<el-container>
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
						<el-table-column show-overflow-tooltip align="center" label="ID" prop="userid" width="60" sortable fixed="left" />
						<el-table-column show-overflow-tooltip align="center" label="人员类型" prop="stafftype_display" sortable fixed="left" width="120" />
						<el-table-column show-overflow-tooltip align="center" label="院区" prop="hospitalname" sortable fixed="left" />
						<el-table-column show-overflow-tooltip align="center" label="科室" prop="deptname" width="80" sortable fixed="left" />
						<el-table-column show-overflow-tooltip align="center" label="工号" prop="staffno" sortable fixed="left" />
						<el-table-column show-overflow-tooltip align="center" label="姓名" prop="name" sortable fixed="left">
							<template slot-scope="scope">
								<div>
									<el-tooltip class="item" effect="dark" :content="scope.row.sex_dispalay" placement="left">
										<i
											:class="['mkfont', scope.row.sex == 1 ? 'nan' : scope.row.sex == 2 ? 'nv' : 'weizhi']"
											:style="{ color: scope.row.sex == 1 ? '#6DCEFA' : scope.row.sex == 2 ? '#F37E7D' : '' }"
										></i>
									</el-tooltip>
									<span style="min-width:60px;display:inline-block;">{{ scope.row.name }}</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column
							show-overflow-tooltip
							align="center"
							label="联系电话"
							prop="mobiletel"
							sortable
							fixed="left"
							width="120"
							:formatter="
								i => {
									return PhoneFormat(i, 'mobiletel');
								}
							"
						/>
						<el-table-column show-overflow-tooltip align="center" label="职称" prop="jobtitle_display" sortable fixed="left" />
						<el-table-column show-overflow-tooltip align="center" label="职务" prop="position_display" sortable fixed="left" />

						<el-table-column show-overflow-tooltip align="center" label="HR编号" prop="hrno" sortable width="100" />
						<el-table-column show-overflow-tooltip align="center" label="入院日期" prop="joindate" sortable width="120">
							<template slot-scope="scope">
								<div>{{ dateFormat(scope.row.joindate) }}</div>
							</template>
						</el-table-column>
						<el-table-column show-overflow-tooltip align="center" label="离院日期" prop="leavedate" sortable width="120">
							<template slot-scope="scope">
								<div>{{ dateFormat(scope.row.leavedate) }}</div>
							</template>
						</el-table-column>
						<el-table-column show-overflow-tooltip align="center" label="证件类型" prop="idtype_display" sortable width="120" />
						<el-table-column show-overflow-tooltip align="center" label="证件号码" prop="idnumber" sortable width="140" />
						<el-table-column show-overflow-tooltip align="center" label="联系地址" prop="address" sortable width="140" />
						<el-table-column show-overflow-tooltip align="center" label="联系邮箱" prop="email" sortable width="140" />
						<el-table-column show-overflow-tooltip align="center" label="输入码" prop="filterstr" sortable width="140" />
						<!-- <el-table-column show-overflow-tooltip align="center" label="医疗组" prop /> -->
						<!-- <el-table-column show-overflow-tooltip align="center" label="核算组" prop /> -->
						<el-table-column show-overflow-tooltip align="center" label="状态" width="80" sortable fixed="right">
							<template slot-scope="scope">
								<el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">{{ scope.row.status == 1 ? '在职' : '离职' }}</el-tag>
							</template>
						</el-table-column>
						<el-table-column align="center" label="操作" label-class-name="ChangeColor" fixed="right" width="160">
							<template slot-scope="scope">
								<div class="tableBtn">
									<el-link title="编辑" :underline="false" type="warning" @click="handleEdit(0, scope.row)"><i class="mkfont bianji1"></i></el-link>
									<el-link title="介绍" :underline="false" type="primary" @click="handleIntro(scope.row)"><i class="mkfont xiangmu"></i></el-link>
									<el-link title="启用" v-if="scope.row.status == 0" :underline="false" type="success" @click="handleStatus(scope.row, 1)"><i class="mkfont qiyong"></i></el-link>
									<el-link title="停用" v-if="scope.row.status == 1" :underline="false" type="danger" @click="handleStatus(scope.row, 0)">
										<i class="mkfont tingyong_line"></i>
									</el-link>
									<el-link title="重置密码" :underline="false" type="default" @click="handleReset(scope.row)">
										<i class="mkfont zhongzhimima"></i>
									</el-link>
								</div>
							</template>
						</el-table-column>
					</el-table>
					<el-footer><mk-page :pager="pager" @query="getStaffInfo" /></el-footer>
				</el-container>
			</template>
			<!-- 右屏 -->
			<template slot="paneR">
				<SplitPane :min-percent="50" :default-percent="50" split="horizontal">
					<template slot="paneL">
						<SplitPane :min-percent="50" :default-percent="50" split="horizontal">
							<template slot="paneL">
								<el-table :data="staffDeptList" border style="width:100%" height="100%" stripe :highlight-current-row="true">
									<el-table-column show-overflow-tooltip align="left" label="工作院区" prop="hospitalname" width="150" />
									<el-table-column show-overflow-tooltip align="center" label="管理科室" width="100" prop="deptname" />
									<el-table-column align="center">
										<template slot="header">
											<el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="handleAddOffice">添加</el-button>
										</template>
										<template slot-scope="scope">
											<div class="tableBtn">
												<el-link title="移除" :underline="false" type="danger" @click="handleDelDept(scope.row)"><i class="mkfont trasch"></i></el-link>
											</div>
										</template>
									</el-table-column>
								</el-table>
							</template>
							<template slot="paneR">
								<el-table :data="recipeList" border style="width:100%" height="100%" stripe :highlight-current-row="true">
									<el-table-column label="处方权限" width="250">
										<template slot-scope="scope">
											{{ recipeType(scope.row.recipe) }}
										</template>
									</el-table-column>
									<el-table-column align="center">
										<template slot="header">
											<el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="handleAddRecipe">添加</el-button>
										</template>
										<template slot-scope="scope">
											<div class="tableBtn">
												<el-link title="移除" :underline="false" type="danger" @click="handleDelRecipe(scope.row, scope.$index)"><i class="mkfont trasch"></i></el-link>
											</div>
										</template>
									</el-table-column>
								</el-table>
							</template>
						</SplitPane>
					</template>
					<template slot="paneR">
						<SplitPane :min-percent="50" :default-percent="50" split="horizontal">
							<template slot="paneL">
								<el-table :data="roleList" border style="width:100%" height="100%" stripe :highlight-current-row="true">
									<el-table-column label="人员角色" width="250">
										<template slot-scope="scope">
											{{ scope.row.rolename }}
										</template>
									</el-table-column>
									<el-table-column align="center">
										<template slot="header">
											<el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="handleAddRole">添加</el-button>
										</template>
										<template slot-scope="scope">
											<div class="tableBtn">
												<el-link title="移除" :underline="false" type="danger" @click="handleDelRole(scope.row, scope.$index)"><i class="mkfont trasch"></i></el-link>
											</div>
										</template>
									</el-table-column>
								</el-table>
							</template>
							<template slot="paneR">
								<el-table :data="memberWorkGroupList" border style="width:100%" height="100%" stripe :highlight-current-row="true">
									<el-table-column align="left" label="工作组" width="250" prop="wgname" />
									<el-table-column align="center">
										<template slot="header">
											<el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="handleAddWorkGroup">添加</el-button>
										</template>
										<template slot-scope="scope">
											<div class="tableBtn">
												<el-link title="移除" :underline="false" type="danger" @click="handleDelWg(scope.row)"><i class="mkfont trasch"></i></el-link>
											</div>
										</template>
									</el-table-column>
								</el-table>
							</template>
						</SplitPane>
					</template>
				</SplitPane>
			</template>
		</SplitPane>
		<!-- 科室 -->
		<office ref="office" :userData.sync="userdata" :methods="staffDept_Get" />
		<!-- 处方 -->
		<recipe ref="recipe" :userData.sync="userdata" />
		<!-- 工作组 -->
		<work-group ref="workgroup" :userData.sync="userdata" :methods="memberWorkGroup_Get" />
		<!-- 人员信息 -->
		<staff ref="staff" :userData.sync="userdata" :methods="getStaffInfo" :staff="tableData" :validate="staffRule" />
		<!-- 角色 -->
		<role ref="role" :userData.sync="userdata" @roleList="roleList_Get" :methods="getStaffInfo" />
		<!-- 介绍 -->
		<mkIntro ref="intro" :introData.sync="introInfo" />
	</d2-container>
</template>

<script>
import Staff from './components/staff';
import Office from './components/office';
import Recipe from './components/recipe';
import Role from './components/roleToPerson';
import WorkGroup from './components/workgroup';
import imgUpload from '@/components/mk-form/Upload/index.vue';
import utils from '@/minxins/util.js';
// 手机号验证
const checkPhone = (rule, value, callback) => {
	const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/;
	if (!value) {
		return callback(new Error('联系手机不能为空'));
	}
	setTimeout(() => {
		if (!Number.isInteger(+value)) {
			callback(new Error('请输入数字'));
		} else {
			if (phoneReg.test(value)) {
				callback();
			} else {
				callback(new Error('联系电话格式不正确'));
			}
		}
	}, 200);
};
// 邮箱校验
const checkMail = (rule, value, callback) => {
	const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
	if (value != '') {
		setTimeout(() => {
			if (reg.test(value)) {
				callback();
			} else {
				callback(new Error('邮箱格式不正确'));
			}
		}, 200);
	} else {
		callback();
	}
};
export default {
	name: 'peopleManagement',

	data() {
		// 证件校验 包含身份证
		const checkIDCard = (rule, value, callback) => {
			const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			if (this.$refs.staff.staffForm.idtype == '1') {
				if (!value) {
					return callback(new Error('身份证号不能为空'));
				}
				setTimeout(() => {
					if (!regIdCard.test(value)) {
						return callback(new Error('身份证号填写有误'));
					} else {
						callback();
					}
				}, 200);
			} else {
				if (!value) {
					callback(new Error('证件号不能为空'));
				}
				var reg = /^[a-zA-Z0-9]+$/;
				if (!reg.test(value)) {
					callback(new Error('请输入字母或数字组成的证件号'));
				} else {
					callback();
				}
			}
		};
		return {
			pager: {
				count: 0,
				page: 1,
				rows: 20,
				condition: '',
				queryPosition: '',
				queryStatus: '',
				type: '0', //-1 全部(默认) 0 查询角色已经对应的人员 1 查询角色未对应的人员列表
				hospitalid: '', //院区
				deptid: '', //科室
				stafftype: '', //工作人员类型,默认(-1)查询全部 0 其他 1 医生 1 药剂师 3 护士 4 技师 5 财务 6 行政 7 客服 9 实习生
				jobtitle: '', //职称 获取标准字典表的数据
				position: '', //职务(聘) 获取标准字典表的数据
				orderby: ''
			},
			introInfo: {},
			userdata: {},
			isComponentClick: false, // 模态框
			isEditMemberSwitch: false, // 编辑人员信息
			isinit: true,
			tableData: [],
			inputShort: '240px',
			PHTOTLIST1: [], // 图章照片
			PHTOTLIST2: [], // 签名照片
			staffDeptList: [],
			staffRule: {
				stafftype: [{ required: true, message: '请选择人员类型', trigger: 'change' }],
				staffno: [{ required: true, message: '请输入人员工号', trigger: 'blur' }],
				name: [{ required: true, message: '请输入人员姓名', trigger: 'blur' }],
				birth: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
				sex: [{ required: true, message: '请选择人员性别', trigger: 'change' }],
				hospitalid: [{ required: true, message: '请选择所属院区', trigger: 'change' }],
				deptid: [{ required: true, message: '请选择科室', trigger: 'change' }],
				idtype: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
				mobiletel: [{ required: true, validator: checkPhone, trigger: 'blur' }],
				email: [{ validator: checkMail, trigger: 'blur' }],
				idnumber: [{ required: true, validator: checkIDCard, trigger: 'blur' }]
			},
			recipeList: [],
			roleList: [],
			memberWorkGroupList: [],
		};
	},
	components: {
		imgUpload,
		Staff,
		Office,
		Recipe,
		WorkGroup,
		Role
	},
	computed: {
		isHospitalid() {
			if (this.pager.hospitalid) {
				return '/Publics/Common/Dic/DepInfo/Tree';
			} else {
				return '';
			}
		}
	},
	created() {
		this.getStaffInfo();
	},
	methods: {
		handleChangeDate(val) {},
		// 介绍
		handleIntro(row) {
			this.introInfo.category = '人员';
			this.introInfo.name = row.name;
			this.introInfo.introid = row.userid;
			this.$refs.intro.open();
			this.$refs.intro.introInfo_Get();
		},
		// 工作组模态框
		handleAddWorkGroup() {
			if (this.isComponentClick) {
				this.$refs.workgroup.open();
			} else {
				this.$message({
					message: '请选择人员',
					type: 'warning'
				});
			}
		},
		// 科室模态框
		handleAddOffice() {
			if (this.isComponentClick) {
				this.$refs.office.open();
				// this.$refs.office.hospitalid = '';

			} else {
				this.$message({
					message: '请先选择人员',
					type: 'warning'
				});
			}
		},
		// 人员角色模态框
		handleAddRole() {
			if (this.isComponentClick) {
				this.$refs.role.open();
			} else {
				this.$message({
					message: '请先选择人员',
					type: 'warning'
				});
			}
		},
		// 处方模态框
		handleAddRecipe() {
			if (this.isComponentClick) {
				this.$refs.recipe.open();
			} else {
				this.$message({
					message: '请先选择人员',
					type: 'warning'
				});
			}
		},
		// 人员状态
		handleStatus(row, key) {
			this.$refs.staff.isEditMemberSwitch = true;
			if (key == 0) {
				this.userdata = row;
				this.userdata.status = key;
				this.$refs.staff.staffInfo_Post(row);
			}
			if (key == 1) {
				this.userdata = row;
				this.userdata.status = key;
				this.$refs.staff.staffInfo_Post(row);
			}
		},
		// 重置密码
		handleReset(row) {
			var msg = `此操作将重置${row.name}的账户密码, 是否继续?`;
			this.$confirm(msg, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.MK.Request('/Publics/Common/UserInfo/ResetPwd', 'post', { userid: row.userid }).then(res => {
						if (res.code == 0) {
							this.$message({
								type: 'success',
								message: res.msg
							});
						}
					});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消重置'
					});
				});
		},
		// 删除科室
		handleDelDept(row) {
			this.$refs.office.handleSumbit('D', row.deptid);
		},
		// 删除权限
		handleDelRecipe(row, index) {
			let item = row.recipe;
			this.$refs.recipe.newRecipe[item] = 0;
			this.$refs.recipe.newRecipe.operatetype = 'D';
			if (this.$refs.recipe.newRecipe.operatetype == 'D') {
				this.$refs.recipe.recipeList = [];
			}
			this.$refs.recipe.newRecipe.userid = this.userdata.userid;
			this.$refs.recipe.recipe_Post(this.$refs.recipe.newRecipe);
			this.recipeList.splice(index, 1);
		},
		// 删除角色
		handleDelRole(row, index) {
			console.log(row, index);
			const role = {
				label: row.rolename,
				key: row.roleid
			};
			this.$refs.role.roleUsers_Post(role, 'D');
		},
		// 删除工作组
		handleDelWg(row) {
			this.$refs.workgroup.workGroupMember_Post('D', row);
		},

		// 切换人员类型
		handleChangeStaffType(val) {},
		// 切换医院
		handleChangeHospital(val) {},

		// 图章照片
		handleUploadStamp() {},
		// 签名照片
		handleUploadSignature() {},

		// 页面数据刷新
		refreshList() {},
		// 回车查询
		keyupEnterSearch() {},
		// 初始化
		handleInit() {
			this.isComponentClick = false;
			this.$refs.staff.open();
			this.$refs.staff.init();
		},
		roleList_Get(val) {
			this.roleList = val;
		},
		// 行点击事件
		 handleRowClick(row) {
			console.log('当前行：', row);
			this.userdata = row;
			this.isComponentClick = true;
			this.staffDeptList = [];
			this.staffDept_Get(row.userid);
			this.memberWorkGroup_Get(row.userid);
			this.$refs.role.form.deptid = []
			this.$refs.recipe.recipeList = [];
			this.$refs.recipe.checkedCities = [];
			this.$refs.recipe.recipe_Get(row.userid);
			this.$refs.role.roleUsers_Get(row.userid);
			this.$refs.office.officeForm.deptid;
			 this.recipeList = this.$refs.recipe.recipeList;
			console.log(this.recipeList)
		},
		// 编辑人员
		handleEdit(key, row) {
			this.userdata = {}
			this.isinit = false;
			this.userdata = row;
			this.$refs.staff.open();
			this.$refs.staff.isEditMemberSwitch = true;
		},
		// 表格列头样式
		cellStyle: function({ row, column, rowIndex, columnIndex }) {
			if (column.labelClassName == 'ChangeColor') {
				return 'color:#1296db';
			} else {
				return '';
			}
		},
		// 处方类型处理
		recipeType(type) {
			const data = type.toString();
			switch (data) {
				case 'jmcf':
					return '精麻处方权';
					break;
				case 'jzcf':
					return '急诊处方权';
					break;
				case 'mzcf':
					return '门诊处方权';
					break;
				case 'mzq':
					return '麻醉权';
					break;
				case 'sszd':
					return '手术主刀权';
					break;
				case 'sszg':
					return '手术资格权';
					break;
				case 'zycf':
					return '住院处方权';
					break;
			}
		},

		// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   API   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		// 提交人员信息
		staffInfo_Post(data) {
			this.staffForm.userid = '19';
			this.MK.Request('/Publics/Common/UserInfo', 'post', data).then(res => {
				if (res.code == 0) {
					this.$message({
						message: res.msg,
						type: 'success'
					});
					this.getStaffInfo();
				}
			});
		},
		// 提交人员附加信息
		staffExtraInfo_Post(data) {
			this.MK.Request('/Publics/Common/UserInfo/Other', 'post', data).then(res => {
				if (res.code == 0) {
					this.$message({
						message: res.msg,
						type: 'success'
					});
					this.getStaffInfo();
				}
			});
		},
		// 获取工作人员
		getStaffInfo() {
			this.MK.Request('/Publics/Common/UserInfo', 'get', this.pager).then(res => {
				this.tableData = res.data;
				this.pager.count = res.count;
			});
		},
		// 工作人员科室查询
		staffDept_Get(userid) {
			this.MK.Request('/Publics/Common/UserInfo/ManageDept', 'get', {
				userid
			}).then(res => {
				this.staffDeptList = res.data;
				res.data.forEach(item => {
					this.$refs.office.officeForm.deptid.push(item.deptid);
				});
			});
		},
		// 人员工作组维护
		memberWorkGroup_Post() {
			const data = {};
			this.MK.Request('/Publics/Common/Dic/MemberWorkGroup', 'post', data).then(res => {
				// this.memberWorkGroupList = res.data
			});
		},
		// 获取人员工作组
		memberWorkGroup_Get(userid) {
			this.MK.Request('/Publics/Common/Dic/MemberWorkGroup', 'get', {
				userid
			}).then(res => {
				this.memberWorkGroupList = res.data;
			});
		},
		// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   API   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		dateFormat(date) {
			const year = new Date(date).getFullYear();
			const month = new Date(date).getMonth() + 1 < 10 ? '0' + (new Date(date).getMonth() + 1) : new Date(date).getMonth() + 1;
			const day = new Date(date).getDate() < 10 ? '0' + new Date(date).getDate() : new Date(date).getDate();
			return `${year}-${month}-${day}`;
		}
	},
	watch: {
		modal(val) {
			if (!val) {
				this.activeStep = 0;
			}
		}
	}
};
</script>

<style scoped>
.mr20 {
	margin-right: 20px !important;
}
>>> .el-date-editor .el-range-separator {
	width: 8%;
}
.step {
	height: 640px;
	margin: 30px auto 0;
	border-radius: 8px;
	display: flex;
	justify-content: center;
}
.step-0 {
	width: 960px;
}
.step-1 {
	width: 1520px;
}
.footer {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.inputShort {
	width: 240px;
}
.inputLong {
	width: 750px;
}
</style>
