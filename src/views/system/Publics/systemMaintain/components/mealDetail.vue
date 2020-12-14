<template>
	<el-drawer :visible.sync="drawer" direction="rtl" size="100%">
		<div slot="title">
			<span>
				套餐明细维护 [
				<span style="color:red">{{ typeForm.packagename }}</span>
				]
			</span>
		</div>
		<el-container style="background:#f5f5f5;">
			<!-- 分类模态框 -->
			<type ref="type"  :userData.sync="typeForm" :method="packageclassify_Get" />
			<el-header>
				<el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd" v-if="userData.statusdisplay == '暂存'">添加套餐分类</el-button>
				<el-button
					:disabled="!isNodeClick"
					type="success"
					icon="el-icon-top"
					@click="MoveUp(curPackage.index, curPackage, typeList, 'packageid', 'orderno', 'classifyid', '/Publics/Common/Dic/OrdrByMove', 'classify')"
				>
					套餐分类上移
				</el-button>
				<el-button
					:disabled="!isNodeClick"
					type="danger"
					icon="el-icon-bottom"
					@click="MoveDow(curPackage.index, curPackage, typeList, 'packageid', 'orderno', 'classifyid', '/Publics/Common/Dic/OrdrByMove', 'classify')"
				>
					套餐分类下移
				</el-button>
			</el-header>
			<el-main style="margin-bottom:50px;">
				<el-card class="card">
					<SplitPane :min-percent="20" :default-percent="20" split="vertical">
						<template slot="paneL">
							<el-tree
								:data="treeData"
								:props="defaultProps"
								node-key="classifyid"
								:indent="10"
								:accordion="true"
								:current-node-key="0"
								:highlight-current="true"
								:default-expand-all="true"
								@node-click="handleNodeClick"
								@node-contextmenu="handleRightClick"
								ref="detailTree"
							>
								<span class="custom-tree-node" style="margin:10px;" slot-scope="{ node, data }">
									<span>
										<span>{{ data.name }}</span>
									</span>
								</span>
							</el-tree>
						</template>
						<template slot="paneR">
							<!-- 套餐总额 -->
							<div v-if="curPackage.children || !typeList.length">
								<el-table
									:data="detailTotalTableData"
									:show-header="false"
									border
									height="65vh"
									stripe
									:header-cell-style="cellStyle"
									:highlight-current-row="true"
									:summary-method="getSummaries"
									:show-summary="true"
									sum-text="合计"
									ref="detailTotalTableData"
								>
									<el-table-column align="left" prop>
										<template slot-scope="scope">
											原价 - {{ scope.row.itemtypename }}
										</template>
									</el-table-column>
									<el-table-column align="center" prop="originalprice" :formatter="tableNumberFilter" />
									<el-table-column align="center" width="100">
										<template slot-scope="scope">
											<el-select :disabled="userData.statusdisplay != '暂存'" v-model="scope.row.operator" @change="handleChangeOperator(scope.$index, scope.row)">
												<el-option v-for="item in operator" :label="item" :value="item" :key="item" />
											</el-select>
										</template>
									</el-table-column>
									<el-table-column align="left">
										<template slot-scope="scope">
											<el-input :disabled="userData.statusdisplay != '暂存'" v-model="scope.row.discountprice" @change="handleChangeDiscount(scope.$index, scope.row)" />
										</template>
									</el-table-column>
									<el-table-column align="left">
										<template slot-scope="scope">
											折后金额
										</template>
									</el-table-column>
									<el-table-column prop="discount">
										<template slot-scope="scope">
											<el-input :disabled="true" v-model="scope.row.discount" />
										</template>
									</el-table-column>
									<el-table-column align="left">
										<template slot-scope="scope">
											成本价 - {{ scope.row.itemtypename }}
										</template>
									</el-table-column>
									<el-table-column align="left" prop="costprice" :formatter="tableNumberFilter" />
									<el-table-column align="left" prop>
										<template slot-scope="scope">
											套餐价 - {{ scope.row.itemtypename }}
										</template>
									</el-table-column>
									<el-table-column align="left" prop="packageprice" :formatter="tableNumberFilter" />
								</el-table>
							</div>
							<!-- 套餐明细表格 -->
							<el-table v-else :data="tableData" border height="65vh" stripe :header-cell-style="cellStyle" :highlight-current-row="true" @row-click="handleRowClick" ref="table">
								<el-table-column sortable show-overflow-tooltip align="center" label="项目类别" prop="itemtypename" />
								<el-table-column sortable show-overflow-tooltip align="center" label="项目名称" prop="itemname" />
								<el-table-column sortable show-overflow-tooltip align="center" label="数量" prop="amount" />
								<el-table-column sortable show-overflow-tooltip align="center" label="原价" prop="originalprice" :formatter="tableNumberFilter" />
								<el-table-column sortable show-overflow-tooltip align="center" label="成本价" prop="costprice" :formatter="tableNumberFilter" />
								<el-table-column sortable show-overflow-tooltip align="center" label="套餐价" prop="packageprice" :formatter="tableNumberFilter" />
								<el-table-column sortable show-overflow-tooltip align="center" label="规格" prop="specification" />
								<el-table-column sortable show-overflow-tooltip align="center" label="单位" prop="unit" />
								<el-table-column align="center" label="操作" label-class-name="ChangeColor">
									<template slot="header">
										<el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAddMealDetail" v-if="userData.statusdisplay == '暂存'">增加明细</el-button>
									</template>
									<template slot-scope="scope">
										<div class="tableBtn">
											<el-link v-if="userData.statusdisplay == '暂存'" title="编辑" :underline="false" type="warning" @click="handleEdit(scope.row, 0)">
												<i class="mkfont bianji1"></i>
											</el-link>
											<el-link v-if="userData.statusdisplay == '暂存'" title="删除" :underline="false" type="danger" @click="handleEdit(scope.row, 1)">
												<i class="mkfont trasch"></i>
											</el-link>
											<el-link
												title="上移"
												:underline="false"
												type="success"
												@click="MoveUp(scope.$index, scope.row, tableData, 'packageid', 'orderno', 'classifyid', '/Publics/Common/Dic/OrdrByMove', 'detail')"
											>
												<i class="mkfont shangyi"></i>
											</el-link>
											<el-link
												title="下移"
												:underline="false"
												type="danger"
												@click="MoveDow(scope.$index, scope.row, tableData, 'packageid', 'orderno', 'classifyid', '/Publics/Common/Dic/OrdrByMove', 'detail')"
											>
												<i class="mkfont xiayi"></i>
											</el-link>
										</div>
									</template>
								</el-table-column>
							</el-table>
						</template>
					</SplitPane>
				</el-card>
				<!-- 套餐明细模态框 -->
				<vxe-modal v-model="modal" width="1280" height="840" :show-footer="true" @close="detailClose" resize fullscreen>
					<div slot="title">
						<span>添加套餐明细</span>
						<span v-if="curPackage.classifyid">
							[
							<span style="color:red">{{ curPackage.name }}</span>
							]
						</span>
					</div>
					<el-container v-if="isNewDetail">
						<el-header>
							<el-form :inline="true">
								<el-form-item>
									<el-input clearable style="width:300px" @keyup.enter.native="code_iteminfo_Get" @clear="code_iteminfo_Get" v-model="pager.condition" placeholder="按项目名称查找" />
								</el-form-item>
								<el-form-item>
									<el-button-group>
										<el-button type="primary" icon="el-icon-search" @click="code_iteminfo_Get">查询</el-button>
									</el-button-group>
								</el-form-item>
							</el-form>
							
						</el-header>
						<el-main style="padding: 0;">
							<el-table
								:data="detailTableData"
								border
								stripe
								height="100%"
								:header-cell-style="cellStyle"
								:highlight-current-row="true"
								@row-click="handleRowClick"
								@selection-change="handleSelectionChange"
								ref="tableDetail"
							>
								<el-table-column align="center" type="selection" width="55" />
								<el-table-column sortable show-overflow-tooltip align="center" label="项目类别" prop="itemtypename" />
								<el-table-column sortable show-overflow-tooltip align="center" label="项目名称" prop="itemname" />
								<el-table-column sortable show-overflow-tooltip align="center" label="原价" prop="price" :formatter="tableNumberFilter" />
								<el-table-column sortable show-overflow-tooltip align="center" label="成本价" prop="costprice" :formatter="tableNumberFilter" />
								<el-table-column sortable show-overflow-tooltip align="center" label="规格" prop="specification" />
								<el-table-column sortable show-overflow-tooltip align="center" label="单位" prop="unit" />
							</el-table>
						</el-main>
						<el-footer>
							<mk-page :pager="pager" @query="code_iteminfo_Get" />
						</el-footer>
					</el-container>
					
					<el-form v-else :model="form" ref="form" :rules="rules" label-width="120px" style="padding-right: 60px">
						<el-form-item label="项目类型" prop="itemtype">
							<el-select :disabled="true" v-model="form.itemtype"><el-option :label="form.itemtypename" :value="form.itemtype" /></el-select>
						</el-form-item>
						<el-form-item label="项目名称" prop="itemname"><el-input v-model="form.itemname" :disabled="true" placeholder="请输入项目名称" /></el-form-item>
						<el-form-item label="数量" prop="amount"><el-input v-model="form.amount" placeholder="请输入数量" /></el-form-item>
						<el-form-item label="原价" prop="originalprice">
							<el-input v-model="form.originalprice" placeholder="请输入原价">
								<template slot="append">
									元
								</template>
							</el-input>
						</el-form-item>
						<el-form-item label="套餐价" prop="packageprice">
							<el-input v-model="form.packageprice" placeholder="请输入套餐价">
								<template slot="append">
									元
								</template>
							</el-input>
						</el-form-item>
						<el-form-item label="折扣价" prop="costprice">
							<el-input v-model="form.costprice" placeholder="请输入折扣价">
								<template slot="append">
									元
								</template>
							</el-input>
						</el-form-item>
						<el-form-item label="规格"><el-input v-model="form.specification" :disabled="true" /></el-form-item>
						<el-form-item label="单位"><el-input v-model="form.unit" :disabled="true" /></el-form-item>
					</el-form>
					<div slot="footer" class="footer">
						<el-button-group>
							<el-button type="primary" @click="handleSumbit">提交</el-button>
							<el-button type="warning" @click="detailClose">关闭</el-button>
						</el-button-group>
					</div>
				</vxe-modal>
			</el-main>
		</el-container>
		<div v-if="curPackage.children" class="lq_drawer__footer">
			<el-button
				:type="getType(item.operate)"
				@click="codePackageMain_Post(item.operate)"
				v-for="(item, index) in btnDefine"
				:key="index"
				v-if="item.sourcestatus == userData.status"
			>
				{{ item.operate }}
			</el-button>
			<el-button type="info" @click="close">取消</el-button>
		</div>
	</el-drawer>
</template>

<script>
import Type from './mealDetail-type';
export default {
	name: 'mealDetail',
	props: {
		userData: {
			type: Object,
			default: () => {}
		},
		method: {
			type: Function,
			default: null
		},
		btnDefine: {
			type: Array,
			default: null
		}
	},
	data() {
		return {
			drawer: false,
			isNewDetail: true,
			isNodeClick: true,
			operator: ['-', '*', '='],
			typeForm: {},
			defaultProps: {
				children: 'children',
				label: 'name'
			},
			treeData: [],
			tableData: [],
			detailTableData: [],
			pager:{
				count: 0,
				page: 1,
				rows: 20,
				condition: ''
			},
			typeList: [],
			form: {
				amount: 1,
				costprice: '',
				itemname: '',
				itemtype: '',
				itemtypename: '',
				orderno: '-1',
				originalprice: '',
				specification: '次',
				packageprice: '',
				unit: '次'
			},
			rules: {
				itemtype: [{ required: true, message: '请选择项目类别', trigger: 'change' }],
				amount: [{ required: true, message: '请输入数量', trigger: 'blur' }],
				originalprice: [{ required: true, message: '请输入原价', trigger: 'blur' }],
				packageprice: [{ required: true, message: '请输入套餐价', trigger: 'blur' }],
				costprice: [{ required: true, message: '请输入折扣价', trigger: 'blur' }]
			},
			modal: false,
			curPackage: {},
			operatetype: 'C',
			detailArr: [],
			detailTotalTableData: []
		};
	},
	components: {
		Type
	},
	created() {
		
	},
	methods: {
		handleAdd() {
			this.$refs.type.open();
			this.$refs.type.init();
		},
		async open() {
			this.drawer = true;
		},
		close() {
			this.drawer = false;
			this.$emit('update:userdata', {});
		},
		detailClose() {
			this.modal = false;
		},
		// 折扣change
		handleChangeDiscount(index, row) {
			var exp = /^(([0-9]\d*)|\d)(\.\d{1,2})?$/;
			if (exp.test(this.detailTotalTableData[index].discountprice)) {
				// 运算为‘=’ 直接得出结果
				if (row.operator != '=') {
					this.detailTotalTableData[index].discount =
						this.detailTotalTableData[index].operator == '-'
							? row.originalprice < row.discountprice
								? 0
								: eval(row.originalprice + row.operator + row.discountprice)
							: eval(row.originalprice + row.operator + row.discountprice);
				} else {
					this.detailTotalTableData[index].discount = row.discountprice;
				}
			} else {
				this.$message({
					message: '请输入数字',
					type: 'warning'
				});
			}
			// 计算套餐、成本、原价、折扣总价
			var packageamount = this.arrSummary(this.detailTotalTableData.map(item => item.packageprice));
			var costamount = this.arrSummary(this.detailTotalTableData.map(item => item.costprice));
			var originalamount = this.arrSummary(this.detailTotalTableData.map(item => item.originalprice));
			var discount = this.arrSummary(this.detailTotalTableData.map(item => Number(item.discount)));
			this.userData.packageamount = packageamount;
			this.userData.costamount = costamount;
			this.userData.originalamount = originalamount;
			this.userData.discount = discount;
		},
		// 递归套餐各类金额
		arrSummary(arr) {
			var len = arr.length;
			if (len == 0) {
				return 0;
			} else if (len == 1) {
				return arr[0];
			} else {
				return arr[0] + this.arrSummary(arr.slice(1));
			}
		},
		// 运算符change
		handleChangeOperator(index, row) {
			console.log('运算符', index, row);
			this.$nextTick(() => {
				this.detailTotalTableData[index].operator = row.operator;
			});
			// 运算为‘=’ 直接得出结果
			if (row.operator != '=') {
				this.detailTotalTableData[index].discount =
					this.detailTotalTableData[index].operator == '-'
						? row.originalprice < row.discountprice
							? 0
							: eval(row.originalprice + row.operator + row.discountprice)
						: eval(row.originalprice + row.operator + row.discountprice);
			} else {
				this.detailTotalTableData[index].discount = row.discountprice;
			}
		},
		// 合计
		getSummaries(param) {
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '原价总价';
					return;
				}
				if (index === 4) {
					sums[index] = '折后总价';
					return;
				}
				if (index === 6) {
					sums[index] = '成本总价';
					return;
				}
				if (index === 8) {
					sums[index] = '套餐总价';
					return;
				}
				const values = data.map(item => Number(item[column.property]));
				if (!values.every(value => isNaN(value))) {
					sums[index] = values.reduce((prev, curr) => {
						const value = Number(curr);
						if (!isNaN(value)) {
							return prev + curr;
						} else {
							return prev;
						}
					}, 0);
					sums[index] += ' 元';
				} else {
					sums[index] = '';
				}
			});

			return sums;
		},
		// 树形结构左击
		handleNodeClick(data) {
			console.log('click', data);
			if (!data.children) {
				this.isNodeClick = true;
			} else {
				this.isNodeClick = false;
			}
			
			this.curPackage = data;
			if (data.name != this.typeForm.packagename) {
				var params = {
					classifyid: data.classifyid,
					packageid: data.packageid
				};
			} else {
				var params = {
					classifyid: '-1',
					packageid: this.typeForm.packageid
				};
			}
			this.packagedetailList_Get(params);
		},
		// 树形结构右击
		handleRightClick() {},
		// 编辑明细
		handleEdit(row, key) {
			console.log(row);
			this.form = row;
			this.form.itemtype = row.itemtype.toString();
			this.form.specification = '次';
			this.form.unit = '次';
			this.detailArr.push(row);
			if (key == 0) {
				this.isNewDetail = false;
				this.modal = true;
				this.operatetype = 'U';
			}
			if (key == 1) {
				this.operatetype = 'D';
				this.Packagedetail_Post();
			}
		},
		// 提交套餐明细
		handleSumbit() {
			this.Packagedetail_Post();
			// let data = this.form;
			// this.$refs.form.validate(valid => {
			//   if (valid) {
			//     this.Packagedetail_Post(data);
			//   }
			// });
		},
		// 套餐明细状态
		handleMealStatus(key) {
			console.log(key);
		},
		// 选择收费项目匹配内容
		handleChangeItem(val) {
			console.log(val);
			this.form.itemname = val.itemname;
			this.form.originalprice = val.price;
		},
		// 行点击
		handleRowClick(row) {
			console.log(row);
		},
		// 明细多选
		handleSelectionChange(rows) {
			if (rows) {
				this.detailArr = rows;
				console.log(rows);
			}
		},
		// 表格列头样式
		cellStyle({ row, column, rowIndex, columnIndex }) {
			if (column.labelClassName == 'ChangeColor') {
				return 'color:#1296db';
			} else {
				return '';
			}
		},
		// 打开明细模态框
		handleAddMealDetail() {
			this.modal = true;
			this.pager.condition = '';
			this.isNewDetail = true;
			this.operatetype = 'C';
			this.code_iteminfo_Get();
		},
		// 套餐维护
		codePackageMain_Post(operatetype) {
			let data = this.userData;
			data.operatetype = operatetype;
			this.MK.Request('/Publics/CodePackageMaintain/CodePackageMaintain_Post', 'post', data).then(res => {
				if (res.code == 0) {
					this.$message({
						message: res.msg,
						type: 'success'
					});
					this.drawer = false;
					this.method();
				}
			});
		},
		// 套餐明细维护
		Packagedetail_Post() {
			let params = {};
			params.operatetype = this.operatetype;
			params.classifyid = this.curPackage.classifyid;
			params.packageid = this.curPackage.packageid;
			params.classifyname = this.curPackage.name;
			params.lstPackDetail = this.detailArr;
			this.MK.Request('/Publics/CodePackageMaintain/Packagedetail_Post', 'post', params).then(res => {
				if (res.code == 0) {
					this.$message({
						message: res.msg,
						type: 'success'
					});
					this.modal = false;
					let params = {
						classifyid: this.curPackage.classifyid,
						packageid: this.curPackage.packageid
					};
					this.packagedetailList_Get(params);
				}
			});
		},
		// 获取分类
		packageclassify_Get(id) {
			this.MK.Request('/Publics/CodePackageMaintain/Packageclassify_Get', 'get', { packageid: this.typeForm.packageid || id }).then(res => {
				res.data.map((item, index) => (item.index = index));
				this.typeList = res.data;
				console.log('/Publics/CodePackageMaintain/Packageclassify_Get')
				console.log(res)
				this.treeData = [
					{
						name: this.typeForm.packagename,
						children: this.typeList
					}
				];
				this.$nextTick(() => {
					this.$refs.detailTree.setCurrentKey(this.typeList[0].classifyid);
				});
				let params = {
					classifyid: this.typeList[0].classifyid,
					packageid: this.typeForm.packageid
				};
				this.packagedetailList_Get(params);
			});
		},
		// 获取明细
		packagedetailList_Get(data) {
			this.MK.Request('/Publics/CodePackageMaintain/PackagedetailList_Get', 'get', data).then(res => {
				if (data.classifyid == '-1') {
					res.data.map(item => {
						item.operator = this.operator[0];
						item.discount = 0;
					});
					this.detailTotalTableData = res.data;
				}
				this.tableData = res.data;
			});
		},
		// 获取收费项目
		code_iteminfo_Get() {
			this.MK.Request('/Publics/CodePackageMaintain/code_iteminfo_Get', 'get', {
				hospitalid: this.info.hospitalid,
				...this.pager
			}).then(res => {
				res.data.map(item => (item.originalprice = item.price));
				this.detailTableData = res.data;
				this.pager.count = res.count;
			});
		},
		//上移
		MoveUp(index, row, list, id, orderno, classid, url, key) {
			if (index == 0) {
				this.$message({
					type: 'error',
					message: '当前为第一行,不能上移!'
				});
				return;
			}
			var PreRow = list[index - 1];
			this.MoveUpAndDown(row, PreRow, id, classid, orderno, url, key);
		},
		//下移
		MoveDow(index, row, list, id, orderno, classid, url, key) {
			if (index + 1 == list.length) {
				this.$message({
					type: 'error',
					message: '当前为最后一行,不能下移!'
				});
				return;
			}
			var NextRow = list[index + 1];
			this.MoveUpAndDown(row, NextRow, id, orderno, classid, url, key);
		},
		MoveUpAndDown(Currentrow, NextRow, id, orderno, classid, url, key) {
			let opt = {};
			opt['currentid'] = Currentrow[id];
			opt['current' + orderno] = Currentrow[orderno];
			opt['currentid2'] = Currentrow[classid];
			opt['nextid'] = NextRow[id];
			opt['next' + orderno] = NextRow[orderno];
			opt['nextid2'] = NextRow[classid];
			if (opt.currentorderno == opt.nextorderno) {
				opt.currentorderno = 1;
				opt.nextorderno = 2;
			}
			if (key == 'classify') {
				opt.type = 'packageclassify';
			}
			if (key == 'detail') {
				opt.type = 'packagedetail';
			}
			this.MK.Request(url, 'post', opt).then(res => {
				if (res.code == 0) {
					this.$message({
						type: 'success',
						message: res.msg
					});
					this.isNodeClick = false;
					if (key == 'detail') {
						let params = {
							classifyid: this.curPackage.classifyid || this.typeList[0].classifyid,
							packageid: this.curPackage.packageid || this.userData.packageid
						};
						this.packagedetailList_Get(params);
					}
					if (key == 'classify') {
						this.packageclassify_Get();
					}
				}
			});
		},
		// 金额过滤
		tableNumberFilter(row, col, filterString, index) {
			let num = filterString;
			if (isNaN(parseFloat(num)) || num == 0) {
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
		//可以有的操作:暂存,删除,保存,提交,撤销,审核,反审核,上架,下架
		getType(text) {
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
		}
	},
	watch: {
		userData: {
			deep: true,
			immediate:true,
			handler(val) {
				this.typeForm = val;
			}
		},
		drawer(val) {
			if (!val) {
				this.$emit('update:userdata', {});
				this.detailTotalTableData = [];
				this.tableData = [];
			} else {
				this.packageclassify_Get();
				this.isNodeClick = false;
			}
		}
	}
};
</script>

<style scoped>
/* 解决table合计行需要打开/关闭开发者工具才显示 */
.el-table {
	overflow: visible !important;
}
>>> .el-drawer__header {
	margin: 0 !important;
	padding: 5px 20px !important;
	background: #8ddba5;
	color: white;
}
.lq_drawer__footer {
	position: fixed;
	bottom: 10px;
	width: 100%;
	text-align: center;
}
>>> .el-table__header tr,
.el-table__header th {
	padding: 0;
	height: 53px;
}
>>> .el-tree-node__label {
	font-size: 18px;
	margin-bottom: 5px;
}
>>> .el-tree-node__content {
	font-size: 16px;
	margin-bottom: 10px;
}
.el-tree-node:focus > .el-tree-node__content {
	background-color: red !important;
}
.el-menu-vertical {
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	border-radius: 4px;
	z-index: 100;
}
.el-menu-vertical i {
	color: #777777;
	margin-right: 12px;
}
.card {
	height: 78vh;
}
.footer {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
