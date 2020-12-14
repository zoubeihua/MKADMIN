<template>
	<d2-container>
		<!-- 头部 -->
		<template slot="header">
			<el-form :inline="true">
				<el-form-item>
					<mk-select
						v-model="pager.packagetype"
						url="1"
						:globalFn="true"
						:clearable="true"
						:param="{ codetype: '套餐类型' }"
						:filter="['bzname']"
						width="300px"
						label="bzname"
						val="bzcode"
						@keyup.enter.native="enterEvent"
						@change="refreshList"
						placeholder="请选择套餐类型"
					/>
				</el-form-item>
				<el-form-item>
					<mk-select
						v-model="pager.status"
						url="1"
						:globalFn="true"
						:clearable="true"
						:multiple="true"
						:param="{ codetype: '套餐信息状态' }"
						:filter="['bzname']"
						width="300px"
						label="bzname"
						val="bzcode"
						@keyup.enter.native="enterEvent"
						@change="refreshList"
						placeholder="请选择套餐状态"
					/>
				</el-form-item>
				<el-form-item><el-input clearable style="width:300px" v-model="pager.condition" placeholder="按套餐名称查找" /></el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" icon="el-icon-search" @click="refreshList">查询</el-button>
						<el-button type="warning" icon="el-icon-refresh" @click="handleClearSearchCondition">清空</el-button>
					</el-button-group>
				</el-form-item>
			</el-form>
			<el-button-group class="headerR"><el-button type="success" icon="el-icon-circle-plus-outline" @click="handleOpenMealModal">添加套餐</el-button></el-button-group>
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
			<el-table-column sortable show-overflow-tooltip align="center" label="套餐ID" prop="packageid" width="90" />
			<el-table-column sortable show-overflow-tooltip align="center" label="套餐名称" prop="packagename" min-width="100"/>
			<el-table-column sortable show-overflow-tooltip align="center" label="销售开始时间" prop="effectivedate" width="180" />
			<el-table-column sortable show-overflow-tooltip align="center" label="销售截止时间" prop="expirationdate" width="180" />
			<el-table-column sortable show-overflow-tooltip align="center" label="套餐类型" prop="packagetypedisplay" width="120"/>
			<el-table-column sortable show-overflow-tooltip align="center" label="套餐金额" prop="packageamount" :formatter="tabelNumberFilter" width="120"/>
			<el-table-column sortable show-overflow-tooltip align="center" label="套餐成本" prop="costamount" :formatter="tabelNumberFilter" width="120"/>
			<el-table-column sortable show-overflow-tooltip align="center" label="套餐折扣" prop="discount" :formatter="tabelNumberFilter" width="120"/>
			<el-table-column sortable show-overflow-tooltip align="center" label="套餐原价" prop="originalamount" :formatter="tabelNumberFilter" width="120"/>
			<el-table-column sortable show-overflow-tooltip align="center" label="制定人" prop="createname" width="120"/>
			<el-table-column sortable show-overflow-tooltip align="center" label="审核人" prop="checkname" width="120"/>
			<el-table-column sortable show-overflow-tooltip align="center" label="备注" prop="packagenote" min-width="100"/>
			<el-table-column sortable show-overflow-tooltip align="center" label="状态" width="120" fixed="right">
				<template slot-scope="scope">
					<el-tag :type="getStatus(scope.row.statusdisplay)">{{ scope.row.statusdisplay }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" label-class-name="ChangeColor" width="240" fixed="right">
				<template slot-scope="scope">
					<div class="tableBtn">
						<el-link title="编辑套餐" :underline="false" type="danger" @click="handleEdit(scope.row)">
							<i class="mkfont bianji1"></i>
						</el-link>
						<el-link title="维护明细" :underline="false" type="primary" @click="handleMealDetail(scope.row)"><i class="mkfont xiangmu1"></i></el-link>
						<el-link title="适应维护" :underline="false" type="warning" @click="handleMealFit(scope.row)"><i class="mkfont guanlian"></i></el-link>
						<el-link
							title="复制"
							:underline="false"
							type="primary"
							@click="Copy(scope.row, '/Publics/CodePackageMaintain/CodePackageMaintain_Post', '新的套餐名称', 'packagename', packageList_Get)"
						>
							<i class="el-icon-document-copy"></i>
						</el-link>
						<el-link
							icon="mkfont shangyi"
							title="上移"
							:underline="false"
							type="success"
							@click="MoveUp(scope.$index, scope.row, tableData, 'packageid', 'orderno', '', '/Publics/Common/Dic/OrdrByMove')"
						></el-link>
						<el-link
							icon="mkfont xiayi"
							title="下移"
							:underline="false"
							type="danger"
							@click="MoveDow(scope.$index, scope.row, tableData, 'packageid', 'orderno', '', '/Publics/Common/Dic/OrdrByMove')"
						></el-link>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<template slot="footer">
			<mk-page :pager="pager" @query="refreshList" />
		</template>
		<!-- 套餐基本信息 -->
		<meal-maintain ref="mealmaintain" :key="keyMaintain" :userData.sync="userdata" :method="packageList_Get" />
		<!-- 套餐明细维护 -->
		<meal-detail ref="mealdetail" :key="keyDetail" :userData.sync="userdata" :btnDefine="statusdefine" :method="packageList_Get" />
		<!-- 套餐适应维护 -->
		<meal-match ref="mealmatch"  :key="keyMatch"   :userData.sync="userdata" />
	</d2-container>
</template>

<script>
import MealMaintain from './components/mealMaintain';
import MealDetail from './components/mealDetail';
import MealMatch from './components/mealMatch';
export default {
	name: 'mealInfo',
	provide(){
		return {
			userdata:this.userdata
		}
	},
	data() {
		return {
			pager: {
				count: 0,
				page: 1,
				rows: 20,
				packagetype: '',
				status: '',
				condition: ''
			},
			userdata: {},
			tableData: [],
			statusdefine: [],
			keyMatch:new Date().getTime(),
			keyDetail:new Date().getTime(),
			keyMaintain:new Date().getTime()
		};
	},
	components: {
		MealMaintain,
		MealDetail,
		MealMatch
	},
	created() {
		this.packageList_Get();
	},
	methods: {
		// 筛选
		refreshList() {
			this.packageList_Get();
		},
		// 清空查询条件
		handleClearSearchCondition() {
			this.pager = {
				count: 0,
				page: 1,
				rows: 20,
				packagetype: '',
				status: '',
				condition: ''
			};
			this.packageList_Get();
		},
		// 创建套餐
		handleOpenMealModal() {
			this.userdata = {
				status:0
			};
			this.keyMaintain = new Date().getTime();
			this.$refs.mealmaintain.operatetype = '保存';
			
			this.$nextTick(()=>{
				this.$refs.mealmaintain.open();
				this.$refs.mealmaintain.init();
			})
			
		},
		// 编辑套餐
		handleEdit(row) {
			this.packageIntroduction_Get(row.packageid);
			this.$refs.mealmaintain.operatetype = '暂存';
			this.$refs.mealmaintain.open();
		},
		// 表格行点击
		handleRowClick(row) {
			console.log(row);
		},
		// 套餐明细维护
		handleMealDetail(row) {
			this.userdata = row;
			this.keyDetail = new Date().getTime();
			this.$nextTick(() => {
				this.$refs.mealdetail.open();
			})
		},
		// 套餐适应维护
		handleMealFit(row) {
			this.userdata = row;
			this.keyMatch = new Date().getTime();
			this.$nextTick(() => {
				this.$refs.mealmatch.open();
				setTimeout(() => {
					this.$refs.mealmatch.getSelectedData();
				}, 20);
			})
		},
		// 表格列头样式
		cellStyle({ row, column, rowIndex, columnIndex }) {
			if (column.labelClassName == 'ChangeColor') {
				return 'color:#1296db';
			} else {
				return '';
			}
		},
		// 获取套餐信息
		packageList_Get() {
			this.MK.Request('/Publics/CodePackageMaintain/PackageList_Get', 'get', this.pager).then(res => {
				if (res.code == 0) {
					this.tableData = res.data;
					this.pager.count = res.data.length;
					this.statusdefine = res.statusdefine;
				}
			});
		},
		// 根据套餐信息获取套餐介绍
		packageIntroduction_Get(id) {
			this.MK.Request('/Publics/CodePackageMaintain/PackageIntroduction_Get', 'get', { packageid: id }).then(res => {
				this.userdata = res.data;
			});
		},
		// 复制
		Copy(row, url, Tooltip, key, handler) {
			let cloneRow = JSON.parse(JSON.stringify(row));
			cloneRow.operatetype = '复制';
			cloneRow.createid = this.info.userid;
			this.$prompt(`请输入${Tooltip}`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /\S/,
				inputErrorMessage: `${Tooltip}不能为空`
			})
				.then(({ value }) => {
					cloneRow[key] = value;
					this.MK.Request(url, 'post', cloneRow).then(res => {
						if (res.code == 0) {
							this.$message({
								type: 'success',
								message: res.msg
							});
							handler();
						}
					});
				})
				.catch(() => {});
		},
		// 套餐状态
		getStatus(text) {
			let data = [
				{
					text: '暂存',
					type: 'warning'
				},
				{ text: '删除', type: 'danger' },
				{
					text: '保存',
					type: 'primary'
				},
				{
					text: '提交',
					type: 'primary'
				},
				{
					text: '撤销',
					type: 'danger'
				},
				{
					text: '审核',
					type: 'success'
				},
				{
					text: '反审核',
					type: 'info'
				},
				{
					text: '上架',
					type: 'success'
				},
				{
					text: '下架',
					type: 'warning'
				}
			];
			for (let index = 0; index < data.length; index++) {
				if (data[index].text == text) {
					return data[index].type;
				}
			}
			return 'primary';
		},
		// 表格数字过滤
		tabelNumberFilter(row, col, filterString, index) {
			let num = filterString;
			if (isNaN(parseFloat(num))) {
				return 0.0;
			} else {
				return num
					? (isNaN(parseFloat(num.toString().replace(/,/g, ''))) ? 1 : parseFloat(num.toString().replace(/,/g, '')))
							.toFixed(2)
							.toString()
							.replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
								return $1 + ',';
							})
					: '';
			}
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
			opt.type = 'package';
			this.MK.Request(url, 'post', opt).then(res => {
				if (res.code == 0) {
					this.$message({
						type: 'success',
						message: res.msg
					});
					this.packageList_Get();
				}
			});
		}
	}
};
</script>

<style scoped></style>
