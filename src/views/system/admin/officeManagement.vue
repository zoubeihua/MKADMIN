<template>
	<d2-container>
		<template slot="header">
			<el-form :inline="true">
				<el-form-item>
					<mk-select
						url="/Publics/Common/Dic/HospitalInfo"
						:clearable="true"
						v-model="pager.hospitalid"
						:filter="['hospitalname']"
						width="180px"
						label="hospitalname"
						val="hospitalid"
						@change="refreshList"
						placeholder="按院区名称查询"
					></mk-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="pager.status" class="mr20" style="width:110px" clearable placeholder="状态" @change="refreshList">
						<el-option label="启用" value="1" />
						<el-option label="停用" value="0" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="pager.kcfl" class="mr20" style="width:110px" clearable placeholder="库存单元" @change="refreshList">
						<el-option label="是" value="1" />
						<el-option label="否" value="0" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="pager.clinicaldept" class="mr20" style="width:110px" clearable placeholder="临床支持" @change="refreshList">
						<el-option label="是" value="1" />
						<el-option label="否" value="0" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="pager.buffetdept" class="mr20" style="width:110px" clearable placeholder="自助支持" @change="refreshList">
						<el-option label="是" value="1" />
						<el-option label="否" value="0" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="pager.standonline" class="mr20" style="width:110px" clearable placeholder="在线支持" @change="refreshList">
						<el-option label="是" value="1" />
						<el-option label="否" value="0" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="pager.standexam" class="mr20" style="width:110px" clearable placeholder="体检支持" @change="refreshList">
						<el-option label="是" value="1" />
						<el-option label="否" value="0" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="pager.standregist" class="mr20" style="width:110px" clearable placeholder="挂号支持" @change="refreshList">
						<el-option label="是" value="1" />
						<el-option label="否" value="0" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<mk-select
						multiple
						style="width:120px;"
						url="1"
						:globalFn="true"
						:clearable="false"
						:param="{ codetype: '医院科室分类' }"
						v-model="pager.ksfl"
						:filter="['bzname']"
						label="bzname"
						val="bzcode"
						placeholder="科室分类"
						@change="refreshList"
					></mk-select>
				</el-form-item>
				<el-form-item>
					<mk-select
						multiple
						style="width:120px;"
						url="1"
						:globalFn="true"
						:clearable="false"
						:param="{ codetype: '医院科室专科分类' }"
						v-model="pager.zkfl"
						:filter="['bzname']"
						label="bzname"
						val="bzcode"
						placeholder="专科分类"
						@change="refreshList"
					></mk-select>
				</el-form-item>
				<el-form-item>
					<el-select style="width:120px;" multiple v-model="pager.bmfl" placeholder="部门分类" @change="refreshList">
						<el-option :value="0" label="门诊" />
						<el-option :value="1" label="住院" />
						<el-option :value="2" label="急诊" />
						<el-option :value="3" label="不区分" />
					</el-select>
				</el-form-item>
				<el-form-item><el-input style="width:160px" :clearable="true" v-model="pager.condition" placeholder="按科室名称查询" @keyup.enter.native="refreshList" /></el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="el-icon-search" @click="refreshList">查询</el-button>
						<el-button type="warning" icon="el-icon-refresh" @click="clearSearchCondition">清空</el-button>
				<el-button type="success" icon="el-icon-circle-plus-outline" @click="handleInit">新增科室</el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
			<el-button-group class="headerR" style="margin-top: -4px;">
			</el-button-group>
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
			ref="tableL"
		>
			<el-table-column show-overflow-tooltip sortable align="center" label="序号" prop="orderno" width="80" />
			<el-table-column show-overflow-tooltip sortable align="center" label="科室ID" prop="deptid" width="90" />
			<el-table-column show-overflow-tooltip align="center" label="上级科室" prop="superiordeptid_display" />
			<el-table-column show-overflow-tooltip align="center" label="所属院区" prop="hospitalname" width="160" />
			<el-table-column show-overflow-tooltip align="center" label="科室名称" prop="deptname" />
			<el-table-column show-overflow-tooltip align="center" label="科室分类" prop="ksfl_display" />
			<el-table-column show-overflow-tooltip align="center" label="专科分类" prop="zkfl_display" />
			<el-table-column show-overflow-tooltip align="center" label="部门分类" prop="bmfl">
				<template slot-scope="scope">
					{{ Getbmfl(scope.row.bmfl) }}
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip align="center" label="库存单元" width="80">
				<template slot-scope="scope">
					<el-tag :type="scope.row.kcfl == 0 ? 'danger' : 'success'">{{ scope.row.kcfl == 0 ? '否' : '是' }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip align="center" label="自助支持" width="80">
				<template slot-scope="scope">
					<el-tag :type="scope.row.buffetdept == 0 ? 'danger' : 'success'">{{ scope.row.buffetdept == 0 ? '否' : '是' }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip align="center" label="临床科室" width="80">
				<template slot-scope="scope">
					<el-tag :type="scope.row.clinicaldept == 0 ? 'danger' : 'success'">{{ scope.row.clinicaldept == 0 ? '否' : '是' }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip align="center" label="挂号支持" width="80">
				<template slot-scope="scope">
					<el-tag :type="scope.row.standregist == 0 ? 'danger' : 'success'">{{ scope.row.standregist == 0 ? '否' : '是' }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip align="center" label="体检支持" width="80">
				<template slot-scope="scope">
					<el-tag :type="scope.row.standexam == 0 ? 'danger' : 'success'">{{ scope.row.standexam == 0 ? '否' : '是' }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip align="center" label="在线支持" width="80">
				<template slot-scope="scope">
					<el-tag :type="scope.row.standonline == 0 ? 'danger' : 'success'">{{ scope.row.standonline == 0 ? '否' : '是' }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip align="center" label="医保代码" prop="ybcode" />
			<el-table-column show-overflow-tooltip align="center" label="医保名称" prop="ybname" />
			<el-table-column show-overflow-tooltip align="center" label="输入码" prop="filterstr" />
			<el-table-column show-overflow-tooltip align="center" label="状态" fixed="right">
				<template slot-scope="scope">
					<el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">{{ scope.row.status == 1 ? '启用' : '停用' }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" label-class-name="ChangeColor" width="220" fixed="right">
				<template slot-scope="scope">
					<div class="tableBtn">
						<el-link icon="mkfont bianji" title="编辑" :underline="false" type="primary" @click="handleEdit(scope.row)" />
						<el-link title="介绍" :underline="false" type="primary" @click="handleIntro(scope.row)"><i class="mkfont xiangmu"></i></el-link>
						<el-link icon="mkfont qiyong" title="启用" v-if="scope.row.status == 0" :underline="false" type="success" @click="handleChangeStatus(scope.row, 1)"></el-link>
						<el-link icon="mkfont tingyong_line" title="停用" v-if="scope.row.status == 1" :underline="false" type="danger" @click="handleChangeStatus(scope.row, 0)"></el-link>
						<!-- <el-link icon="mkfont xiangmu" title="科室介绍" :underline="false" type="warning"></el-link> -->
						<el-link
							icon="mkfont shangyi"
							title="上移"
							:underline="false"
							type="success"
							@click="MoveUp(scope.$index, scope.row, tableData, 'deptid', 'orderno', '', '/Publics/Common/Dic/OrdrByMove')"
						></el-link>
						<el-link
							icon="mkfont xiayi"
							title="下移"
							:underline="false"
							type="danger"
							@click="MoveDow(scope.$index, scope.row, tableData, 'deptid', 'orderno', '', '/Publics/Common/Dic/OrdrByMove')"
						></el-link>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<template slot="footer">
			<mk-page :pager="pager" @query="refreshList" />
		</template>
		<!-- 科室模态框 -->
		<office ref="office" :userData.sync="userdata" :methods="DepInfo_Get" />
		<!-- 介绍 -->
		<mkIntro ref="intro" :introData.sync="introInfo" />
	</d2-container>
</template>

<script>
import Office from './components/officeMaintain';
export default {
	name: 'officeManagement',
	data() {
		return {
			introInfo: {},
			pager: {
				count: 0,
				page: 1,
				rows: 20,
				hospitalid: '',
				condition: '',
				status: '',
				kcfl: ''
			},
			userdata: {},
			tableData: []
		};
	},
	components: {
		Office
	},
	created() {
		this.DepInfo_Get();
	},
	methods: {
		// 查询
		refreshList() {
			this.DepInfo_Get();
		},
		// 清空
		clearSearchCondition() {
			this.pager = {
				count: 0,
				page: 1,
				rows: 20,
				hospitalid: '',
				condition: '',
				status: '',
				kcfl: '',
				clinicaldept: "",
				buffetdept: "",
				standonline:"",
				standexam:"",
				standregist:"",
				bmfl:[],
				zkfl:[],
				ksfl:[]
			}
			this.refreshList()
		},
		// 初始化
		handleInit() {
			this.$refs.office.open();
			this.$refs.office.init();
		},
		// 行事件
		handleRowClick(row) {
			console.log('当前行：', row);
		},
		// 编辑
		handleEdit(row) {
			this.userdata = row;
			this.$refs.office.modal = true;
			this.$refs.office.$refs.form.clearValidate()
		},
		// 改变状态
		handleChangeStatus(row, key) {
			let data = {};
			if (key == 0) {
				data = JSON.parse(JSON.stringify(row));
				data.status = 0;
				data.operatetype = 'U';
				this.deptinfo_post(data);
			} else {
				data = JSON.parse(JSON.stringify(row));
				data.status = 1;
				data.operatetype = 'U';
				this.deptinfo_post(data);
			}
		},
		// 介绍
		handleIntro(row) {
			console.log(row);
			this.introInfo.category = '科室';
			this.introInfo.name = row.hospitalname + row.deptname;
			this.introInfo.introid = row.deptid;
			this.$refs.intro.open();
			this.$refs.intro.introInfo_Get();
		},
		// 科室维护
		deptinfo_post(data) {
			this.MK.Request('/Publics/Common/Dic/DepInfo', 'post', data).then(res => {
				if (res.code == 0) {
					this.$message.success(res.msg);
					this.DepInfo_Get();
				}
			});
		},
		//上移
		MoveUp(index, row, list, id, orderno, handler, url) {
			if (index == 0) {
				this.$message({
					type: 'error',
					message: '当前为第一行,不能上移!'
				});
				return;
			}
			var PreRow = list[index - 1];
			this.MoveUpAndDown(row, PreRow, id, orderno, handler, url);
		},
		//下移
		MoveDow(index, row, list, id, orderno, handler, url) {
			if (index + 1 == list.length) {
				this.$message({
					type: 'error',
					message: '当前为最后一行,不能下移!'
				});
				return;
			}
			var NextRow = list[index + 1];
			this.MoveUpAndDown(row, NextRow, id, orderno, handler, url);
		},
		MoveUpAndDown(Currentrow, NextRow, id, orderno, handler, url) {
			let opt = {};
			opt['currentid'] = Currentrow[id];
			opt['current' + orderno] = Currentrow[orderno];
			opt['nextid'] = NextRow[id];
			opt['next' + orderno] = NextRow[orderno];
			opt.type = 'deptinfo';
			console.log(opt);
			if (opt.currentorderno == opt.nextorderno) {
				opt['next' + orderno] = NextRow[orderno] + 1;
			}
			this.MK.Request(url, 'post', opt).then(res => {
				if (res.code == 0) {
					this.$message({
						type: 'success',
						message: res.msg
					});
					this.DepInfo_Get();
				}
			});
		},
		// 表格列头样式
		cellStyle: function({ row, column, rowIndex, columnIndex }) {
			if (column.labelClassName == 'ChangeColor') {
				return 'color:#1296db';
			} else {
				return '';
			}
		},
		// 部门分类
		Getbmfl(type) {
			switch (type) {
				case 0:
					return '门诊';
					break;
				case 1:
					return '住院';
					break;
				case 2:
					return '急诊';
					break;
				case 3:
					return '不区分';
					break;
			}
		},
		// 获取科室信息
		DepInfo_Get() {
			this.MK.Request('/Publics/Common/Dic/DepInfo', 'get', this.pager).then(res => {
				this.tableData = res.data;
				this.pager.count = res.count;
			});
		}
	}
};
</script>

<style scoped></style>
