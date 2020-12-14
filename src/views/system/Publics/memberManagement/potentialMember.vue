<template>
	<d2-container>
		<template slot="header">
			<el-form :inline="true" label-width="90px" label-position="left">
				<el-form-item>
					<mk-select
						style="width: 466px;"
						v-model="pager.event"
						url="Publics/Common/Dic/HospitalEvents"
						placeholder="请选择活动信息"
						:filter="['eventname']"
						label="eventname"
						val="eventid"
						@change="handleChangeEvent"
					/>
				</el-form-item>
				<el-form-item>
					<el-select @change="refreshPage" style="width: 466px;" v-model="pager.visitstatus" placeholder="请选择回访状态">
						<el-option value="0" label="未回访"></el-option>
						<el-option value="1" label="已回访"></el-option>
						<el-option value="2" label="全部"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item><el-input clearable style="width: 466px;" v-model="pager.visitnote" placeholder="请输入回访备注" /></el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="el-icon-search" @click="refreshPage">查询</el-button>
						<el-button type="info" icon="el-icon-refresh" @click="clearCondition">清空</el-button>
						<el-button type="danger" icon="el-icon-download" @click="exportData">导出</el-button>
					</el-button-group>
				</el-form-item>
				<el-form-item>
					<el-input v-model="eventInfo.contents" readonly style="width: 85.8vw;" type="textarea" placeholder="活动描述" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
				</el-form-item>
				<el-form-item label="活动有效期">
					<el-date-picker
						v-model="eventInfo.time"
						value-format="yyyy-MM-dd"
						readonly
						style="width: 16.3vw;"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="活动负责人"><el-input v-model="eventInfo.handuername" readonly style="width: 16.3vw;" placeholder="活动负责人"></el-input></el-form-item>
				<el-form-item label="活动采集表"><el-input v-model="eventInfo.crfname" readonly style="width: 16.5vw;" placeholder="活动采集表"></el-input></el-form-item>
				<el-form-item label="活动优惠券"><el-input v-model="eventInfo.couponname" readonly style="width: 16.5vw;" placeholder="活动优惠券"></el-input></el-form-item>
			</el-form>
		</template>
		<el-table :data="tableData" border stripe @row-click="handleRowClick" style="width:100%" height="100%" :highlight-current-row="true" :header-cell-style="cellStyle">
			<el-table-column show-overflow-tooltip sortable align="center" label="会员卡号" prop="cardno" />
			<el-table-column show-overflow-tooltip sortable align="center" label="会员姓名">
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
			<el-table-column show-overflow-tooltip sortable align="center" label="会员年龄" prop="age" />
			<el-table-column
				show-overflow-tooltip
				sortable
				align="center"
				label="手机号"
				prop="mobiletel"
				:formatter="
					i => {
						return PhoneFormat(i, 'mobiletel');
					}
				"
			/>
			<el-table-column show-overflow-tooltip sortable align="center" label="身份证号" prop="idnumber" />
			<el-table-column show-overflow-tooltip sortable align="center" label="活动名称" prop="sourcenote" />
			<el-table-column
				show-overflow-tooltip
				sortable
				align="center"
				label="关注日期"
				prop="updatetime"
				:formatter="
					i => {
						return DateFormat(i, 'updatetime');
					}
				"
			/>
			<el-table-column show-overflow-tooltip sortable align="center" label="是否回访">
				<template slot-scope="scope">
					<el-tag :type="scope.row.visitpersonid_display ? 'success' : 'danger'">{{ scope.row.visitpersonid_display ? '是' : '否' }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip sortable align="center" label="回访人" prop="visitpersonid_display" />
			<el-table-column show-overflow-tooltip sortable align="center" label="回访时间" prop="visittime" />
			<el-table-column show-overflow-tooltip sortable align="center" label="回访备注" prop="visitnote" />
				<el-table-column show-overflow-tooltip align="center" label="操作" label-class-name="ChangeColor" width="160">
				<template slot-scope="scope">
					<div class="tableBtn">
						<el-link title="补充资料" :underline="false" type="primary" @click="handleEdit(scope.row)"><i class="mkfont bianji1"></i></el-link>
						<el-link title="表单查看" :underline="false" type="success" @click="handleForm(scope.row)"><i class="mkfont xiangmu1"></i></el-link>
						<el-link title="回访备注" :underline="false" type="danger" @click="handleNote(scope.row)"><i class="mkfont bianji2"></i></el-link>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<template slot="footer">
			<mk-page :pager="pager" @query="MemberInfo_Get" />
		</template>
		<!-- 回访备注 -->
		<vxe-modal v-model="noteModal" :showFooter="true" width="580" height="auto" @close="close">
			<div slot="title">
				回访备注 [
				<span style="color: red;">{{ userdata.membername }}</span>
				]
			</div>
			<el-input v-model="visitnote" style="margin-bottom: 30px;" type="textarea" placeholder="回访备注" :autosize="{ minRows: 16, maxRows: 30 }"></el-input>
			<div slot="footer" style="text-align:center;">
				<el-button-group>
					<el-button type="success" @click="submitNote">保存</el-button>
					<el-button type="warning" @click="closeNote">取消</el-button>
				</el-button-group>
			</div>
		</vxe-modal>
		<!-- 表单查看 -->
		<el-drawer :title="userdata.membername" :visible.sync="formModal" direction="rtl">
		  <phone :filljson="filljson" :jsonData="jsonData" v-if="formModal" ref="phone" />
		</el-drawer>

		<member-register :curRowData.sync="userdata" ref="memberregister" :method="MemberInfo_Get" />
	</d2-container>
</template>

<script>
import utils from '@/minxins/util.js';
import phone from "./components/phone.vue";
import MemberRegister from '@/components/mk-custom-components/mk-memberRegister/index.vue';
import XLSX from 'xlsx';
export default {
	name: 'potentialMember',
	components: {
		MemberRegister,
		phone
	},
	data() {
		return {
			jsonData: {
			  list: [],
			  config: {
			    labelWidth: 100,
			    labelPosition: "right",
			    size: "small",
			    customClass: ""
			  },
			  key: new Date().getTime()
			},
			filljson:{},
			rowData:{},
			modal: false,
			noteModal: false,
			formModal: false,
			eventCrfid: '',
			pager: {
				event: '',
				sourceid: '3',
				sourcenote: '',
				visitstatus: '2',
				visitnote: '',
				Tags: '',
				count: 0,
				rows: 20,
				tag: 0,
				page: 1
			},
			userdata: {},
			visitnote: '',
			eventInfo: {
				contents: '',
				time: '',
				handuername: '',
				crfname: '',
				couponname: ''
			},
			tableData: [],
			form: {},
			rules: {},
			crfFormBtnStatus: ''
		};
	},
	computed: {},
	watch: {
		'pager.event'(val) {
			if (!val) {
				this.eventInfo = {
					contents: '',
					time: '',
					handuername: '',
					crfname: '',
					couponname: ''
				};
			}
		}
	},
	methods: {
		refreshPage() {
			if (!this.pager.event) {
				this.$message.warning('请先选择活动');
				this.pager.visitstatus = '2';
			} else {
				this.MemberInfo_Get();
			}
		},
		tabsrfChange(tab) {
			console.log(tab);
		},
		clearCondition() {
			this.pager.event = '';
			this.pager.visitstatus = '2';
			this.pager.Tags = '';
			this.pager.visitnote = '';
			this.pager.sourceid = '3';
			this.pager.sourcenote = '';
			this.MemberInfo_Get();
		},
		exportData() {
			this.pager.tag = 1;
			this.MK.Request('/Publics/MemberManage/BasicInfo', 'get', this.pager).then(res => {
				var data = res.data.map(item => {
					let obj = {};
					obj['会员卡号'] = item.cardno;
					obj['会员姓名'] = item.membername;
					obj['会员性别'] = item.sex_dispalay;
					obj['会员年龄'] = item.age;
					obj['手机号'] = item.mobiletel;
					obj['身份证号'] = item.idnumber;
					obj['活动名称'] = item.sourcenote;
					obj['关注日期'] = item.updatetime;
					obj['是否回访'] = item.visitpersonid_display ? '是' : '否';
					obj['回访人'] = item.visitpersonid_display;
					obj['回访时间'] = item.visittime;
					obj['回访备注'] = item.visitnote;
					return obj;
				});
				let ss = XLSX.utils.json_to_sheet(data);
				let keys = Object.keys(ss).sort(); //排序 [需要注意，必须从A1开始]
				let ref = keys[1] + ':' + `K${keys.length - 1}`; //这个是定义一个字符串 也就是表的范围[A1:C5]
				console.log(ref, keys, '###');
				let workbook = {
					//定义操作文档
					SheetNames: ['sheet1'], //定义表明
					Sheets: {
						sheet1: Object.assign({}, ss, { '!ref': ref }) //表对象[注意表明]
					}
				};
				XLSX.writeFile(workbook, '潜在会员数据.xls'); //将数据写入文件
			});
		},
		submit() {},
		submitNote() {
			this.MK.Request('/Publics/MemberManage/MemberVisit', 'post', {
				memberid: this.userdata.memberid,
				visitnote: this.visitnote,
				visitpersonid: this.info.userid.toString()
			}).then(res => {
				if (res.code == 0) {
					this.$message.success(res.msg);
					this.noteModal = false;
					this.visitnote = '';
					this.userdata = {};
					this.MemberInfo_Get();
				}
			});
		},
		close() {
			this.modal = false;
		},
		closeNote() {
			this.noteModal = false;
		},
		handleChangeEvent(val) {
			console.log(val);
			this.eventCrfid = val.crfid;
			this.pager.sourcenote = val.eventname;
			this.eventInfo.contents = val.contents;
			this.eventInfo.handuername = val.handuername;
			this.eventInfo.crfname = val.crfname;
			this.eventInfo.couponname = val.couponname;
			this.eventInfo.time = [val.begintime, val.endtime];
			this.MemberInfo_Get();
		},
		// 补充资料
		handleEdit(row) {
			console.log(row);
			this.userdata = row;
			this.$refs.memberregister.open();
			this.$refs.memberregister.isSubmitBasicInfo = true;
			this.$refs.memberregister.curMemberId = '1';
			this.$refs.memberregister.MemberInfoByid_Get(row.memberid);
		},
		// 表单查看
		handleForm(row) {
			console.log(row);
			this.CRFJsonBycrfid_Get(row)
			// this.$refs.formModal.maximize();
			// this.$nextTick(() => {
			// 	this.$refs.tabscrf
			// 		.CRFillJsonBysubclassid_Get({
			// 			classid: 100016,
			// 			subclassid: 100054,
			// 			classname: '营销活动表单',
			// 			subclassname: '会员关注采集',
			// 			collectionid: 1,
			// 			memberid: row.memberid,
			// 			eventCrfid: this.eventCrfid
			// 		})
			// 		.then(res => {
			// 			// this.crfFormBtnStatus = res.code;
			// 		});
			// })
		},
		//获取模板
		CRFJsonBycrfid_Get(item) {
		  this.MK.Request("/Publics/CRFMaintain/CRFillJsonBysubclassidandcrfid_Get", "get", {
		    formtype:2,
		    hospitalid:this.info.hospitalid,
		    memberid:item.memberid,
			classid: 100016,
		    subclassid:100054,
		    collectionid:1,
			crfid:this.eventCrfid
		  }).then(res => {
			if(res.code == 0){
				if(res.lstCRFinfo.length){
					let resData = res.lstCRFinfo[0];
					this.jsonData.list = resData.jsonformat.list;
					this.jsonData.config = resData.jsonformat.config;
					this.filljson = resData.filljson;
					this.jsonData.key = new Date().getTime();
					this.$nextTick(() => {
					 this.formModal = true;
					});
				}
			}
		  });
		},
		// 回访备注
		handleNote(row) {
			this.visitnote = row.visitnote;
			this.noteModal = true;
		},
		handleRowClick(row) {
			this.userdata = row;
			console.log(row);
		},
		// 表格列头样式
		cellStyle({ row, column, rowIndex, columnIndex }) {
			if (column.labelClassName == 'ChangeColor') {
				return 'color:#1296db';
			} else {
				return '';
			}
		},
		// 过滤日期
		filterDate(value, row, column) {
			console.log(value, row, column, '@@@');
		},
		finish(status) {
			if (status != 0) {
				this.crfSave();
			} else {
				this.followupModal = false;
			}
		},
		MemberInfo_Get() {
			this.MK.Request('/Publics/MemberManage/BasicInfo', 'get', this.pager).then(res => {
				this.tableData = res.data;
				this.pager.count = res.count;
			});
		},
		eventInfo_Get() {
			this.MK.Request('Publics/Common/Dic/HospitalEvents', 'get').then(res => {
				var data = res.data;
				function compare(property) {
					return function(a, b) {
						var value1 = new Date(a[property]);
						var value2 = new Date(b[property]);
						return value2 - value1;
					};
				}
				this.eventCrfid = data[0].crfid
				this.pager.event = data[0].eventid;
				this.pager.sourcenote = data[0].eventname;
				this.eventInfo.contents = data[0].contents;
				this.eventInfo.handuername = data[0].handuername;
				this.eventInfo.crfname = data[0].crfname;
				this.eventInfo.couponname = data[0].couponname;
				this.eventInfo.time = [data[0].begintime, data[0].endtime];
				this.MemberInfo_Get();
			});
		}
	},
	created() {
		// this.MemberInfo_Get();
		this.eventInfo_Get();
	},
	mounted() {}
};
</script>
<style scoped>
.main {
	padding: 20px;
}
.main-item {
	margin-bottom: 40px;
}
::v-deep .vxe-modal--content{
	overflow: hidden !important;
}
.info {
}
.appointment {
}
.title {
	width: 150px;
	height: 30px;
	line-height: 30px;
	border-bottom: 1px solid rgba(187, 187, 187, 1);
	color: rgba(159, 142, 97, 1);
	font-size: 18px;
	text-align: left;
}
</style>
