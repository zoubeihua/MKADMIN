<template>
<!-- liqian高度auto -->
	<vxe-modal v-model="modal" ref="modal" :showFooter="true" width="1340" height="auto" @close="close">
		<div slot="title">
			科室维护
			<span v-if="userData.userid">
				- [
				<span style="color:red;">{{ userData.deptname }}</span>
				]
			</span>
		</div>
		<el-form :model="form" :inline="true" ref="form" :rules="rules" label-width="100px" style="padding:0 30px 0 0px">
			<el-form-item label="所属院区" prop="hospitalid">
				<mk-select
					style="width:200px;"
					url="/Publics/Common/Dic/HospitalInfo"
					:clearable="false"
					v-model="form.hospitalid"
					:filter="['hospitalname']"
					label="hospitalname"
					val="hospitalid"
					placeholder="请选择所属院区"
				></mk-select>
			</el-form-item>
			<el-form-item label="上级科室" prop>
				<mk-select
					:disabled="!isHospitalid"
					style="width:200px;"
					:url="isHospitalid"
					:isInit="false"
					:clearable="true"
					v-model="form.superiordeptid"
					:param="{ hospitalid: form.hospitalid }"
					:filter="['Name','']"
					label="Name"
					val="ID"
					:placeholder="form.hospitalid ? '请选择上级科室' : '请先选择所属院区'"
				></mk-select>
			</el-form-item>

			<el-form-item label="科室ID"><el-input style="width:200px;" v-model="form.deptid" :disabled="true" placeholder="新增加科室无需输入" /></el-form-item>
			<!-- 无字段 -->
			<el-form-item label="外部代码" prop=""><el-input style="width:200px;" v-model="form.externalcode" placeholder="请输入外部代码" /></el-form-item>
			<el-form-item label="科室名称" prop="deptname"><el-input style="width:200px;" v-model="form.deptname" placeholder="请输入科室名称" /></el-form-item>
			<!-- 无字段 -->
			<el-form-item label="科室简称" prop="deptshortname"><el-input style="width:200px;" v-model="form.deptshortname" placeholder="请输入科室简称" /></el-form-item>
			<el-form-item label="输入码" prop><el-input style="width:200px;" v-model="form.filterstr" placeholder="请输入输入码" /></el-form-item>
			<el-form-item label="临床科室" prop="clinicaldept">
				<el-select style="width:200px;" v-model="form.clinicaldept" placeholder="是否支持临床科室">
					<el-option :value="0" label="否" />
					<el-option :value="1" label="是" />
				</el-select>
			</el-form-item>
			<el-form-item label="科室分类" prop="ksfl">
				<mk-select
					style="width:200px;"
					url="1"
					:globalFn="true"
					:clearable="false"
					:param="{ codetype: '医院科室分类' }"
					v-model="form.ksfl"
					:filter="['bzname']"
					label="bzname"
					val="bzcode"
				></mk-select>
			</el-form-item>
			<el-form-item label="专科分类" prop="zkfl">
				<mk-select
					style="width:200px;"
					url="1"
					:globalFn="true"
					:clearable="false"
					:param="{ codetype: '医院科室专科分类' }"
					v-model="form.zkfl"
					:filter="['bzname']"
					label="bzname"
					val="bzcode"
				></mk-select>
			</el-form-item>
			<el-form-item label="部门分类" prop="bmfl">
				<el-select style="width:200px;" v-model="form.bmfl" placeholder="请选择部门分类">
					<el-option :value="0" label="门诊" />
					<el-option :value="1" label="住院" />
					<el-option :value="2" label="急诊" />
					<el-option :value="3" label="不区分" />
				</el-select>
			</el-form-item>

			<el-form-item label="库存单元" prop="kcfl">
				<el-select style="width:200px;" v-model="form.kcfl" placeholder="是否支持库存分类">
					<el-option :value="0" label="否" />
					<el-option :value="1" label="是" />
				</el-select>
			</el-form-item>

			<el-form-item label="挂号支持" prop="standregist">
				<el-select style="width:200px;" v-model="form.standregist" placeholder="是否支持挂号">
					<el-option :value="0" label="否" />
					<el-option :value="1" label="是" />
				</el-select>
			</el-form-item>
			<el-form-item label="自助支持" prop="buffetdept">
				<el-select style="width:200px;" v-model="form.buffetdept" placeholder="是否支持自助终端">
					<el-option :value="0" label="否" />
					<el-option :value="1" label="是" />
				</el-select>
			</el-form-item>
			<el-form-item label="体检支持" prop="standexam">
				<el-select style="width:200px;" v-model="form.standexam" placeholder="是否支持体检">
					<el-option :value="0" label="否" />
					<el-option :value="1" label="是" />
				</el-select>
			</el-form-item>
			<el-form-item label="线上支持" prop="standonline">
				<el-select style="width:200px;" v-model="form.standonline" placeholder="是否在线支持">
					<el-option :value="0" label="否" />
					<el-option :value="1" label="是" />
				</el-select>
			</el-form-item>
			<el-form-item label="统计序号" prop="tjxh"><el-input style="width:200px;" v-model="form.tjxh" placeholder="请输入统计序号" /></el-form-item>
			<el-form-item label="统计名称" prop><el-input style="width:200px;" v-model="form.tjmc" placeholder="请输入统计名称" /></el-form-item>
			<el-form-item label="医保端名称" prop><el-input style="width:200px;" v-model="form.ybname" placeholder="请输入医保端名称" /></el-form-item>
			<el-form-item label="医保端代码" prop><el-input style="width:200px;" v-model="form.ybcode" placeholder="请输入医保端名称" /></el-form-item>
		</el-form>
		<div slot="footer" class="footer">
			<el-button-group>
				<el-button type="primary" @click="handleSumbit">提交</el-button>
				<el-button type="warning" @click="close">关闭</el-button>
			</el-button-group>
		</div>
	</vxe-modal>
</template>

<script>
export default {
	name: '',
	props: {
		userData: {
			type: Object,
			default: () => {}
		},
		methods: {
			type: Function,
			default: null
		}
	},
	computed: {
		isHospitalid() {
			if (this.form.hospitalid) {
				return '/Publics/Common/Dic/DepInfo/Tree';
			} else {
				return '';
			}
		}
	},
	data() {
		return {
			modal: false,
			isInit: true,
			form: {
				bmfl: '', // 部门分类
				buffetdept: 0, // 自主支持
				clinicaldept: 0, // 临床科室
				deptid: 0,
				deptname: '', // 科室名称
				dicdeptid: '-1',
				filterstr: '', // 输入码
				hospitalid: '', // 院区id
				kcfl: 0, // 库存分类
				ksfl: '', // 科室分类
				note: '', // 备注
				standexam: 0, // 体检支持
				standonline: 0, // 互联网支持
				standregist: 0, // 挂号支持
				status: 1,
				superiordeptid: '', // 上级科室
				tjmc: '', // 统计名称
				tjxh: '', // 统计序号
				ybcode: '', // 科室代码
				ybname: '', // 科室名称
				zkfl: '', // 专科分类
				orderno: '',
				deptshortname:"",
				externalcode:""
			},
			rules: {
				hospitalid: [{ required: true, message: '请选择院区', trigger: 'change' }],
				deptname: [{ required: true, message: '请输入科室名称', trigger: 'blur' }],
				ksfl: [{ required: true, message: '请选择科室分类', trigger: 'change' }],
				zkfl: [{ required: true, message: '请选择专科分类', trigger: 'change' }],
				bmfl: [{ required: true, message: '请选择部门分类', trigger: 'change' }],
				tjxh: [{ required: true, message: '请输入统计序号', trigger: 'blur' }]
			}
		};
	},
	methods: {
		init() {
			this.$refs.form.clearValidate();
			this.isInit = true;
			this.form = {
				bmfl: '', // 部门分类
				buffetdept: 0, // 自主支持
				clinicaldept: 0, // 临床科室
				deptid: 0,
				deptname: '', // 科室名称
				dicdeptid: '-1',
				filterstr: '', // 输入码
				hospitalid: '', // 院区id
				kcfl: 0, // 库存分类
				ksfl: '', // 科室分类
				note: '', // 备注
				standexam: 0, // 体检支持
				standonline: 0, // 互联网支持
				standregist: 0, // 挂号支持
				status: 1,
				superiordeptid: '', // 上级科室
				tjmc: '', // 统计名称
				tjxh: '', // 统计序号
				ybcode: '', // 科室代码
				ybname: '', // 科室名称
				zkfl: '', // 专科分类
				orderno: '',
				deptshortname:"",
				externalcode:""
			};
		},
		async open() {
			this.modal = true;
		},
		close() {
			this.modal = false;
		},
		// 提交
		handleSumbit() {
			this.DepInfo_Post();
		},
		// 科室维护
		DepInfo_Post() {
			let data = JSON.parse(JSON.stringify(this.form));
			console.log(data);
			data.createid = this.info.userid;
			if (data.superiordeptid == '') {
				data.superiordeptid = 0;
			}
			this.$refs.form.validate(valid => {
				if (valid) {
					this.MK.Request('/Publics/Common/Dic/DepInfo', 'post', data).then(res => {
						if (res.code == 0) {
							this.$message({
								message: res.msg,
								type: 'success'
							});
							this.modal = false;
							this.methods();
						}
					});
				}
			});
		}
	},
	watch: {
		userData: {
			deep: true,
			handler(val) {
				val.operatetype = 'U';
				let data = JSON.parse(JSON.stringify(val));
				this.form = data;
				this.form.hospitalid = data.hospitalid;
				if (data.superiordeptid == 0) {
					this.form.superiordeptid = '';
				}
			}
		},
		modal(val) {
			if (!val) {
				this.$emit('update:userdata', {});
			}
		},
		'form.hospitalid'(newVal, oldVal) {
			if (newVal != oldVal) {
				this.form.superiordeptid = '';
			}
		},
		'form.tjxh'(val) {
			this.form.orderno = val
		}
	}
};
</script>

<style scoped></style>
