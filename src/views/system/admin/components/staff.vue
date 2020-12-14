<template>
	<vxe-modal v-model="modal" ref="modal" width="1220" height="860" :showFooter="true">
		<!-- 模态框title -->
		<div slot="title">
			{{ staffForm.staffno ? '编辑工作人员信息' : '新增工作人员' }}
			<span v-if="staffForm.staffno">
				- [
				<span style="color:red;">{{ staffForm.name }} - {{ staffForm.stafftype_display }}</span>
				]
			</span>
		</div>
		<el-steps :active="activeStep" align-center finish-status="success">
			<el-step title="人员基本信息" @click.native="handleChangeStep(0)" icon="el-icon-document"></el-step>
			<el-step title="人员附加信息" @click.native="handleChangeStep(1)" icon="el-icon-folder-add"></el-step>
		</el-steps>
		<!-- step 步骤 -->
		<template v-if="activeStep == 0">
			<div class="step step-0">
				<el-form :model="staffForm" ref="staffForm" :rules="validate" label-width="120px" :inline="true">
					<el-form-item label="人员类型" prop="stafftype">
						<mk-select
							v-model="staffForm.stafftype"
							url="1"
							:clearable="false"
							:globalFn="true"
							:param="{ codetype: '人员类型' }"
							:filter="['bzname', 'filterstr']"
							width="310px"
							label="bzname"
							val="bzcode"
							@keyup.enter.native="enterEvent"
							@change="handleChangeStaffType"
						></mk-select>
					</el-form-item>
					<el-form-item label="实习生" prop>
						<el-input style="width:310px" :readonly="true" :disabled="staffForm.stafftype != 1">
							<el-checkbox slot="prefix" true-label="1" false-label="0" :disabled="staffForm.stafftype != 1" v-model="staffForm.traineeflg" @change="handleChangeTraineeflg" />
							<el-select
								style="width:285px; transform: translateX(5px);"
								slot="suffix"
								:placeholder="staffForm.staffType == 1 ? '请选择实习生导师,按工号查询' : '当人员类型为医生，可选实习生导师'"
								:disabled="staffForm.traineeflg == 0"
								filterable
								clearable
								:filter-method="traineementorFilter"
								@change="handletraineementorFilter()"
								v-model="staffForm.traineementor"
							>
								<el-option v-for="item in filterArr" :key="item.userid" :label="item.name" :value="item.userid">
									<div>
										<el-tooltip effect="dark" :content="item.sex_dispalay" placement="left">
											<i
												:class="['mkfont', item.sex == 1 ? 'nan' : item.sex == 2 ? 'nv' : 'weizhi']"
												:style="{ color: item.sex == 1 ? '#6DCEFA' : item.sex == 2 ? '#F37E7D' : '' }"
											></i>
										</el-tooltip>
										<span style="min-width:60px;display:inline-block;margin-left:10px">{{ item.name }}</span>
										<span style="min-width:60px;display:inline-block;margin-right: 10px;">工号：{{ item.staffno }}</span>
										<span style="min-width:60px;display:inline-block;margin-right: 10px;">科室：{{ item.deptname }}</span>
										<span style="min-width:60px;display:inline-block;margin-right: 10px;">院区：{{ item.hospitalname }}</span>
									</div>
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
					<el-form-item label="人员工号" prop="staffno"><el-input style="width:310px" placeholder="请输入工号" v-model="staffForm.staffno" /></el-form-item>
					<el-form-item label="人员姓名" prop="name"><el-input style="width:310px" placeholder="请输入姓名" v-model="staffForm.name" /></el-form-item>
					<el-form-item label="证件类型" >
						<!-- prop="idtype" -->
						<mk-select
							url="1"
							v-model="staffForm.idtype"
							:clearable="false"
							:globalFn="true"
							:param="{ codetype: '证件类型' }"
							:filter="['bzname', 'filterstr']"
							width="310px"
							label="bzname"
							val="bzcode"
							@keyup.enter.native="enterEvent"
							@change="handleChangeIdType"
						></mk-select>
					</el-form-item>
					<el-form-item label="证件号码" >
						<!-- prop="idnumber" -->
						<!-- 当证件类型为身份时显示 -->
						<el-input
							v-if="staffForm.idtype == 1"
							v-model="staffForm.idnumber"
							style="width:310px"
							type="text"
							clearable
							@keyup.enter.native="handleIdNumberEnter($event)"
							@change="handleOnBlurIdnumber"
							placeholder="请输入"
						>
							<template slot="append">
								<i title="读取二代身份证" class="mkfont erdaishenfenzheng" style="font-size:22px;color:#1296db;cursor:pointer"></i>
							</template>
						</el-input>
						<!-- 证件类型不为身份证显示 -->
						<el-input
							:disabled="!staffForm.idtype"
							v-else
							style="width:310px"
							type="text"
							clearable
							v-model="staffForm.idnumber"
							@keyup.enter.native="handleIdNumberEnter($event)"
							placeholder="请输入"
						></el-input>
					</el-form-item>
					<el-form-item label="出生日期" >
						<!-- prop="birth" -->
						<el-date-picker
							v-model="staffForm.birth"
							value-format="yyyy-MM-dd"
							style="width:310px"
							@change="handleChangeBirthday"
							@keyup.enter.native="keyupBrithdayEnter($event)"
							type="date"
							placeholder="选择日期"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="年龄"><el-input :disabled="true" style="width:310px" v-model="staffForm.age" /></el-form-item>
					<el-form-item label="人员性别" prop="sex">
						<mk-select
							:disabled="staffForm.idtype == 1"
							:globalFn="true"
							url="1"
							:clearable="false"
							v-model="staffForm.sex"
							:param="{ codetype: '性别' }"
							:filter="['bzname']"
							width="310px"
							label="bzname"
							val="bzcode"
						></mk-select>
					</el-form-item>
					<el-form-item label="联系电话">
						<!--  prop="mobiletel" -->
						<el-input style="width:310px" placeholder="请输入联系电话" v-model="staffForm.mobiletel" /></el-form-item>

					<el-form-item label="所属院区" prop="hospitalid">
						<mk-select
							url="/Publics/Common/Dic/HospitalInfo"
							:clearable="false"
							v-model="staffForm.hospitalid"
							:filter="['hospitalname']"
							width="310px"
							label="hospitalname"
							val="hospitalid"
							@change="handleChangeHospital"
						></mk-select>
					</el-form-item>
					<el-form-item label="所属科室" prop="deptid">
						<mk-select
							v-if="staffForm.hospitalid"
							:url="isHospitalid"
							:clearable="false"
							v-model="staffForm.deptid"
							:param="{ hospitalid: staffForm.hospitalid }"
							:filter="['Name']"
							width="310px"
							label="Name"
							val="ID"
							:placeholder="staffForm.hospitalid ? '请选择科室' : '请先选择所属院区'"
						></mk-select>
						<el-input v-else style="width:310px" :disabled="true" placeholder="请先选择所属院区" />
					</el-form-item>
					<el-form-item label="职称" prop="jobtitle">
						<mk-select
							url="/Publics/Common/Dic/StandCode"
							:clearable="true"
							v-model="staffForm.jobtitle"
							:param="{ codetype: '职称' }"
							:filter="['bzname', 'filterstr']"
							width="310px"
							label="bzname"
							val="bzcode"
						></mk-select>
					</el-form-item>
					<el-form-item label="职务" prop="position">
						<mk-select
							:globalFn="true"
							url="1"
							:clearable="true"
							v-model="staffForm.position"
							:param="{ codetype: '职务(聘)' }"
							:filter="['bzname', 'filterstr']"
							width="310px"
							label="bzname"
							val="bzcode"
						></mk-select>
					</el-form-item>
					<el-form-item label="电子邮箱" prop="mail"><el-input style="width:310px" placeholder="请输入" v-model="staffForm.email" /></el-form-item>
					<el-form-item label="联系地址" prop><el-input style="width:310px" placeholder="请输入" v-model="staffForm.address" /></el-form-item>
					<el-form-item label="入院日期" prop>
						<el-date-picker style="width:310px" :clearable="false" value-format="yyyy-MM-dd" type="date" placeholder="选择入院日期" v-model="staffForm.joindate"></el-date-picker>
					</el-form-item>
					<el-form-item label="离院日期" prop>
						<el-date-picker style="width:310px" :clearable="false" value-format="yyyy-MM-dd" type="date" placeholder="选择离院日期" v-model="staffForm.leavedate"></el-date-picker>
					</el-form-item>
					<el-form-item label="HR编号" prop><el-input style="width:310px" placeholder="请输入" v-model="staffForm.hrno" /></el-form-item>
					<el-form-item label="输入码" prop><el-input style="width:310px" placeholder="请输入" v-model="staffForm.filterstr" /></el-form-item>
				</el-form>
			</div>
		</template>
		<!-- 附加信息 -->
		<template v-if="activeStep == 1">
			<div class="step step-1">
				<el-form :model="staffForm" ref="staffForm" label-width="125px" :inline="true">
					<el-form-item label="毕业院校" prop><el-input class="inputShort" placeholder="请输入" v-model="staffForm.graduatedschool" /></el-form-item>
					<el-form-item label="最高学历" prop>
						<mk-select
							url="1"
							v-model="staffForm.highesteducation"
							:clearable="false"
							:globalFn="true"
							:param="{ codetype: '最高学历' }"
							:filter="['bzname', 'filterstr']"
							:width="inputShort"
							label="bzname"
							val="bzcode"
						></mk-select>
					</el-form-item>
					<el-form-item label="国籍" prop>
						<mk-select
							url="1"
							v-model="staffForm.country"
							:clearable="false"
							:globalFn="true"
							:param="{ codetype: '国家' }"
							:filter="['bzname', 'filterstr']"
							:width="inputShort"
							label="bzname"
							val="bzcode"
						></mk-select>
					</el-form-item>
					<el-form-item label="民族" prop>
						<mk-select
							url="1"
							v-model="staffForm.nation"
							:clearable="false"
							:globalFn="true"
							:param="{ codetype: '民族' }"
							:filter="['bzname', 'filterstr']"
							:width="inputShort"
							label="bzname"
							val="bzcode"
						></mk-select>
					</el-form-item>
					<el-form-item label="从业资格证" prop><el-input class="inputShort" placeholder="请输入" v-model="staffForm.certno" /></el-form-item>
					<el-form-item label="从业资格证有效期" prop>
						<el-date-picker
							class="inputShort"
							v-model="staffForm.certnoexpirydate"
							value-format="yyyy-MM-dd"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="医保代码" prop><el-input class="inputShort" placeholder="请输入医保端对应代码" v-model="staffForm.ybcode" /></el-form-item>
					<el-form-item label="医保名称" prop><el-input class="inputShort" placeholder="请输入医保端对应名称" v-model="staffForm.ybname" /></el-form-item>
					<el-form-item label="执业资格证" prop><el-input class="inputShort" placeholder="请输入" v-model="staffForm.practicecertno" /></el-form-item>
					<el-form-item label="执业资格证有效期" prop>
						<el-date-picker
							class="inputShort"
							v-model="staffForm.practicecertnoexpirydate"
							value-format="yyyy-MM-dd"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="本院执业开始时间" prop>
						<el-date-picker class="inputShort" value-format="yyyy-MM-dd" type="date" placeholder="选择本院执业开始时间" v-model="staffForm.practicebegindate"></el-date-picker>
					</el-form-item>
					<el-form-item label="本院执业结束时间" prop>
						<el-date-picker class="inputShort" value-format="yyyy-MM-dd" type="date" placeholder="选择本院执业结束时间" v-model="staffForm.practiceenddate"></el-date-picker>
					</el-form-item>
					<el-form-item label="执业范围" prop><el-input class="inputShort" placeholder="请输入" v-model="staffForm.practicerange" /></el-form-item>
					<el-form-item label="执业注册地" prop><el-input class="inputShort" placeholder="请输入" v-model="staffForm.practiceregaddr" /></el-form-item>
					<el-form-item label="使用语种" prop>
						<mk-select
							url="1"
							v-model="staffForm.uselanguage"
							:globalFn="true"
							:clearable="false"
							:param="{ codetype: '语言' }"
							:filter="['bzname', 'filterstr']"
							:width="inputShort"
							label="bzname"
							val="bzcode"
						></mk-select>
					</el-form-item>
					<el-form-item label="图章号码" prop><el-input class="inputShort" placeholder="请输入图章号码" v-model="staffForm.stampno" /></el-form-item>
					<el-form-item label="图章照片" prop>
						<div class="inputShort">
							<img-upload :is-delete="true" @input="handleUploadStamp" :value="PHTOTLIST1" img-style="1" :limit="1" :is-empty="true" :width="80" :height="80"></img-upload>
						</div>
					</el-form-item>
					<el-form-item label="签名照片" prop>
						<img-upload :is-delete="true" @input="handleUploadSignature" :value="PHTOTLIST2" img-style="1" :limit="1" :is-empty="true" :width="80" :height="80"></img-upload>
					</el-form-item>
				</el-form>
			</div>
		</template>
		<div slot="footer" class="footer">
			<el-button-group>
				<el-button type="primary" @click="handleSumbit">提交</el-button>
				<el-button type="warning" @click="close">关闭</el-button>
			</el-button-group>
		</div>
	</vxe-modal>
</template>

<script>
import imgUpload from '@/components/mk-form/Upload/index.vue';
export default {
	name: 'staff',
	computed: {
		isHospitalid() {
			if (this.staffForm.hospitalid) {
				return '/Publics/Common/Dic/DepInfo/Tree';
			} else {
				return '';
			}
		}
	},
	props: {
		userData: {
			type: Object,
			default: () => {}
		},
		methods: {
			type: Function,
			default: null
		},
		staff: {
			type: Array,
			default: []
		},
		validate: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		const curDate = this.getCurDate();
		const curDateSpan = this.curDateSpan();
		return {
			internMentor: [],
			filterArr: [],
			inputShort: '310px',
			activeStep: 0, // 模态框步骤
			modal: false,
			isEditMemberSwitch: false,
			curDate: curDate,
			staffForm: {
				// 基本信息
				userid: '-1',
				stafftype: '',
				staffno: '',
				name: '',
				sex: '',
				hospitalid: '',
				deptid: '',
				mobiletel: '',
				position: '',
				jobtitle: '',
				traineeflg: '0',
				traineementor: '',
				note: '',
				leavedate: '',
				joindate: curDate,
				email: '',
				idtype: '',
				idnumber: '',
				hrno: '',
				birth: '',
				address: '',
				status: 1,
				idtype: '',
				idnumber: '',
				certno: '',
				certnoexpirydate: '',
				country: '142',
				graduatedschool: '',
				highesteducation: '0',
				nation: '1',
				practicebegindate: curDateSpan,
				practiceenddate: curDateSpan,
				practicerange: '',
				practiceregaddr: '',
				qualificationcertno: '',
				practicecertnoexpirydate: '',
				signaturepic: '',
				stampno: '',
				stamppic: '',
				uselanguage: '',
				ybcode: '',
				ybname: '',
				filterstr: ''
			},
			staffExtraForm: {},
			PHTOTLIST1: [], // 图章照片
			PHTOTLIST2: [], // 签名照片
			staffForm: {},
			stafftypeList: [],
			isSubmitBasicInfo: false // 基本信息提交
		};
	},
	components: { imgUpload },
	created() {
		this.GetCommonDicStandCode('人员类型');
	},
	methods: {
		// 初始化数据
		init() {
			this.isSubmitBasicInfo = false;
			this.isEditMemberSwitch = false;

			this.PHTOTLIST1 = [];
			this.PHTOTLIST2 = [];
			this.staffForm = {
				// 基本信息
				userid: '-1',
				stafftype: '',
				staffno: '',
				name: '',
				sex: '',
				hospitalid: '',
				deptid: '',
				mobiletel: '',
				position: '',
				jobtitle: '',
				traineeflg: '0',
				traineementor: '',
				note: '',
				leavedate: '',
				joindate: this.curDate,
				email: '',
				idtype: '',
				idnumber: '',
				hrno: '',
				birth: '',
				address: '',
				status: 1,
				idtype: '',
				idnumber: '',
				certno: '',
				certnoexpirydate: '',
				country: '142',
				graduatedschool: '',
				highesteducation: '0',
				nation: '1',
				practicebegindate: this.curDateSpan(),
				practiceenddate: this.curDateSpan(),
				practicerange: '',
				practiceregaddr: '',
				qualificationcertno: '',
				practicecertnoexpirydate: '',
				signaturepic: '',
				stampno: '',
				stamppic: '',
				uselanguage: '',
				ybcode: '',
				ybname: '',
				filterstr: ''
			};
			this.$refs.staffForm.clearValidate();
			this.$refs.staffForm.resetFields();
		},
		async open() {
			this.modal = true;
			this.curDateSpan()
		},
		close() {
			this.modal = false;
			this.$emit('update:userdata', {});
		},
		// 提交信息
		handleSumbit() {
			console.log(this.staffForm);
			let data = {};
			data.userid = this.staffForm.userid;
			data.birth = this.staffForm.birth;
			data.deptid = this.staffForm.deptid;
			data.email = this.staffForm.email;
			data.hospitalid = this.staffForm.hospitalid;
			data.hrno = this.staffForm.hrno;
			data.idnumber = this.staffForm.idnumber;
			data.idtype = this.staffForm.idtype;
			data.position = this.staffForm.position;
			data.jobtitle = this.staffForm.jobtitle;
			data.joindate = this.staffForm.joindate;
			data.leavedate = this.staffForm.leavedate;
			data.mobiletel = this.staffForm.mobiletel;
			data.name = this.staffForm.name;
			data.sex = this.staffForm.sex;
			data.staffno = this.staffForm.staffno;
			data.stafftype = this.staffForm.stafftype;
			data.traineeflg = this.staffForm.traineeflg;
			data.traineementor = this.staffForm.traineeflg == 0 ? '0' : this.staffForm.traineementor;
			data.certno = this.staffForm.certno;
			data.country = this.staffForm.country;
			data.graduatedschool = this.staffForm.graduatedschool;
			data.highesteducation = this.staffForm.highesteducation;
			data.nation = this.staffForm.nation;
			data.practicebegindate = this.staffForm.practicebegindate;
			data.practicecertno = this.staffForm.practicecertno;
			data.practiceenddate = this.staffForm.practiceenddate;
			data.practicerange = this.staffForm.practicerange;
			data.practiceregaddr = this.staffForm.practiceregaddr;
			data.signaturepic = this.staffForm.signaturepic;
			data.stampno = this.staffForm.stampno;
			data.stamppic = this.staffForm.stamppic;
			data.uselanguage = this.staffForm.uselanguage;
			data.ybcode = this.staffForm.ybcode;
			data.ybname = this.staffForm.ybname;
			if (this.activeStep == 1) {
				console.log(this.staffForm);
				data.certnoexpirydate = this.staffForm.certnoexpirydate ? this.staffForm.certnoexpirydate.join('|') : '';

				data.practicecertnoexpirydate = this.staffForm.practicecertnoexpirydate ? this.staffForm.practicecertnoexpirydate.join('|') : '';
			}
			data.filterstr = this.staffForm.filterstr;
			data.address = this.staffForm.address;
			data.status = 1;
			if (this.isEditMemberSwitch) {
				data.operatetype = 'U';
			} else {
				data.operatetype = 'C';
			}
			// 基本信息的提交
			if (this.activeStep == 0) {
				this.$refs.staffForm.validate(valid => {
					if (valid) {
						if (this.staffForm.traineeflg == 1 && this.staffForm.traineementor == '') {
							this.$message({
								message: '请选择实习生导师',
								type: 'warning'
							});
						} else {
							this.staffInfo_Post(data);
						}
					}
				});
			}
			// 附加信息的提交
			if (this.activeStep == 1) {
				data.operatetype = 'U';
				this.staffExtraInfo_Post(data);
			}
		},
		// 切换步骤
		handleChangeStep(step) {
			if (
				this.staffForm.stafftype == '' ||
				this.staffForm.staffno == '' ||
				this.staffForm.name == '' ||
				this.staffForm.sex == '' ||
				this.staffForm.hospitalid == '' ||
				this.staffForm.deptid == '' ||
				this.staffForm.mobiletel == '' ||
				this.staffForm.idtype == '' ||
				this.staffForm.idnumber == '' ||
				this.staffForm.birth == ''
			) {
				this.$message({
					message: '请您完成必填项并提交，再进行下一步填写',
					type: 'warning'
				});
			} else {
				if (this.isSubmitBasicInfo || this.isEditMemberSwitch) {
					this.activeStep = step;
				} else {
					this.$message({
						message: '请您提交基本信息',
						type: 'warning'
					});
				}
			}
		},
		// 实习生
		handleChangeTraineeflg(val) {
			if (val == 0) {
				this.staffForm.traineementor = '';
				delete this.staffForm.traineementor;
			}
		},
		//
		handletraineementorFilter(val) {
			console.log(val);
			this.filterArr = this.internMentor;
		},
		// 过滤实习生导师
		traineementorFilter(val) {
			console.log(val);
			var filterStr = ['name', 'staffno'],
				filterArr = [];
			if (val != '') {
				for (var index in this.internMentor) {
					for (var i = 0; i < filterStr.length; i++) {
						if (this.internMentor[index][filterStr[i]].toLowerCase().indexOf(val.toLowerCase()) > -1) {
							filterArr.push(this.internMentor[index]);
						}
					}
				}
				this.filterArr = filterArr;
			} else {
				this.filterArr = this.internMentor;
			}
		},
		// 切换人员类型
		handleChangeStaffType(val) {
			console.log(val.bzcode, this.staff);
		},
		// 切换医院
		handleChangeHospital(val) {
			// this.staffForm.hospitalid = val.hospitalid
			// this.staffForm.deptid = ''
			console.log(this.staffForm);
		},
		// 身份证回车事件
		handleIdNumberEnter(e) {
			e.target.blur();
		},
		// 更改证件类型
		handleChangeIdType(val) {
			console.log(val);
		},
		// 身份证识别
		handleOnBlurIdnumber(idNumber) {
			console.log(idNumber);
			//获取性别
			if (parseInt(idNumber.substr(16, 1)) % 2 == 1) {
				this.staffForm.sex = '1';
			} else {
				this.staffForm.sex = '2';
			}
			// 获取年龄
			var myDate = new Date();
			var month = myDate.getMonth() + 1;
			var day = myDate.getDate();
			var age = myDate.getFullYear() - idNumber.substring(6, 10) - 1;
			if (idNumber.substring(10, 12) < month || (idNumber.substring(10, 12) == month && idNumber.substring(12, 14) <= day)) {
				age++;
			}
			this.staffForm.age = age;

			if (idNumber.length == 18) {
				var year = idNumber.substring(6, 10) + '-' + idNumber.substring(10, 12) + '-' + idNumber.substring(12, 14);
				this.staffForm.birth = year;
			}
		},
		// 切换生日
		handleChangeBirthday(val) {
			console.log(val);
			if (val) {
				this.staffForm.birth = val;
				var year = val.split('-').join('');
				var age = this.ageComputed(year);
				if (age < 0) {
					this.$message({
						message: '会员年龄不能大于当前日期',
						type: 'warning'
					});
					this.staffForm.age = 0;
				} else {
					this.staffForm.age = age;
				}
			} else {
				this.staffForm.birth = '';
			}
		},
		// 根据生日识别年龄
		keyupBrithdayEnter(e) {},
		// 图章照片
		handleUploadStamp(data) {
			if (data[0]) {
				this.staffForm.stamppic = data[0].url;
			} else {
				this.staffForm.stamppic = '';
			}
		},
		// 签名照片
		handleUploadSignature(data) {
			if (data[0]) {
				this.staffForm.signaturepic = data[0].url;
			} else {
				this.staffForm.signaturepic = '';
			}
		},
		// 提交人员信息api
		staffInfo_Post(data) {
			this.MK.Request('/Publics/Common/UserInfo', 'post', data).then(res => {
				if (res.code == 0) {
					this.$message({
						message: res.msg,
						type: 'success'
					});
					this.isSubmitBasicInfo = true;
					if (!this.isEditMemberSwitch) {
						this.$confirm('会员信息待完善', '提交成功', {
							confirmButtonText: '继续填写',
							cancelButtonText: '关闭窗口',
							type: 'success'
						})
							.then(() => {
								this.activeStep = 1;
							})
							.catch(() => {
								this.modal = false;
							});
					} else {
						this.modal = false;
					}
					this.methods();
				}
			});
		},
		// 通过日期计算年龄
		ageComputed(date) {
			var myDate = new Date();
			var month = myDate.getMonth() + 1;
			var day = myDate.getDate();
			var age = myDate.getFullYear() - date.substring(0, 4) - 1;
			if (date.substring(4, 6) < month || (date.substring(4, 6) == month && date.substring(6) <= day)) {
				age++;
			}
			return age;
		},
		// 提交人员附加信息
		staffExtraInfo_Post(data) {
			this.MK.Request('/Publics/Common/UserInfo/Other', 'post', data).then(res => {
				if (res.code == 0) {
					this.$message({
						message: res.msg,
						type: 'success'
					});
					this.methods();
					this.modal = false;
				}
			});
		},
		// 获取标志字典
		GetCommonDicStandCode(codeType) {
			this.MK.Request('/Publics/Common/Dic/StandCode', 'get', {
				codetype: codeType
			}).then(res => {
				this.stafftypeList = res.data;
			});
		},
		// 获取当前日期
		getCurDate() {
			const year = new Date().getFullYear();
			const month = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
			const day = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
			return `${year}-${month}-${day}`;
		},
		curDateSpan() {
			var date = new Date()
			var year = date.getFullYear()
			var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)
			var date = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
			var day = `${year}-${month}-${date}`
			console.log([day,day,"@@@@"])
			return [day,day]
		}
	},
	watch: {
		userData: {
			deep: true,
			handler(val) {
				if (JSON.stringify(val) != '{}') {
					val.operatetype = 'U';
					let data = JSON.parse(JSON.stringify(val));
					let year = val.birth.split('-').join('');
					let age = this.ageComputed(year);
					this.staffForm = data;
					this.staffForm.sex = data.sex.toString();
					this.staffForm.idtype = data.idtype.toString();
					this.staffForm.hospitalid = data.hospitalid;
					this.staffForm.deptid = data.deptid == 0 ? '' : data.deptid;
					this.staffForm.nation = data.nation ? data.nation.toString() : '1';
					this.staffForm.country = data.country ? data.country.toString() : '142';
					this.staffForm.highesteducation = data.highesteducation ? data.highesteducation.toString() : '0';
					this.staffForm.traineeflg = data.traineeflg.toString();
					this.staffForm.practicecertnoexpirydate = data.practicecertnoexpirydate ? data.practicecertnoexpirydate.split('|') : this.curDateSpan();
					this.staffForm.certnoexpirydate = data.certnoexpirydate ? data.certnoexpirydate.split('|') : this.curDateSpan();
					this.PHTOTLIST1 = data.stamppic ? data.stamppic.split(',').map(item => ({ url: item })) : [];
					this.PHTOTLIST2 = data.signaturepic ? data.signaturepic.split(',').map(item => ({ url: item })) : [];
					this.staffForm.traineementor = data.traineeflg == 0 ? '' : data.traineementor;
					this.staffForm.age = age;
				}
			}
		},
		modal(val) {
			if (!val) {
				this.$emit('update:userdata', {});
				this.activeStep = 0;
			} else {
				this.$refs.form.clearValidate();
			}
		},
		'staffForm.stafftype'(val) {
			if (val != '1') {
				this.staffForm.traineeflg = 0;
				this.staffForm.traineementor = '';
			} else if (val == '1') {
				this.internMentor = this.staff.filter(item => {
					if (item.stafftype == '1') {
						return item;
					}
				});
				this.filterArr = this.internMentor;
			}
		},
		filterArr(val) {
			if (val.length == 0) {
				this.filterArr = this.internMentor;
			}
		}
	}
};
</script>

<style scoped>
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
	width: 960px;
}
.footer {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.inputShort {
	width: 310px;
}
.inputLong {
	width: 750px;
}
</style>
