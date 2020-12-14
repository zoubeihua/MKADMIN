<template>
	<el-container>
		<el-aside width="auto" style="background:#FAFAFA;">
			<!--      <el-tabs tab-position="left" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          :disabled="righttableListList.length == 0"
          :label="item.bzname"
          :name="item.bzcode"
          v-for="(item,index) in appList"
          :key="index"
        ></el-tab-pane>
      </el-tabs> -->
		</el-aside>
		<el-main style="padding:0;">
			<el-container>
				<el-header>
					<el-form :inline="true" class="headerFrom">
						<el-form-item>
							<el-radio-group v-model="form.type" @change="getAuthInfo(form)">
								<el-radio label="-1" border>全部</el-radio>
								<el-radio label="0" border>已授权</el-radio>
								<el-radio label="1" border>未授权</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item>
							<el-input
								:disabled="righttableListList.length == 0"
								v-model="form.condition"
								style="width:300px"
								@keyup.enter.native="getAuthInfo(form)"
								placeholder="按名称、输入码进行查询"
							></el-input>
						</el-form-item>
						<el-form-item>
							<el-button-group>
								<el-button :disabled="righttableListList.length == 0" type="primary" @click="getAuthInfo(form)">查询</el-button>
								<slot></slot>
								<!-- <el-button :disabled="righttableListList.length == 0" type="primary" @click="saveAuth">保存</el-button> -->
							</el-button-group>
						</el-form-item>
					</el-form>
				</el-header>
				<el-main style="padding:0;">
					<el-table
						:data="tableList"
						style="width: 100%;"
						height="99%"
						row-key="menuid"
						@row-click="ClickRow"
						ref="ProductTypes"
						@select="handleSelectionChange"
						@select-all="selectAll"
						stripe
						sortable
						border
						default-expand-all
						highlight-current-row
						:tree-props="{
							children: 'children',
							hasChildren: 'hasChildren'
						}"
					>
						<el-table-column width="100" align="center">
							<div slot="header" slot-scope="scope">
								<el-link :underline="false" :disabled="righttableListList.length == 0" :icon="isExpandAll ? 'el-icon-caret-bottom' : 'el-icon-caret-top'" @click="expand">
									{{ isExpandAll ? '全部收起' : '全部展开' }}
								</el-link>
							</div>
						</el-table-column>
						<el-table-column type="selection" align="center" width="55" :selectable="checkboxT" label-class-name="selectionNone"></el-table-column>
						<!-- <el-table-column label="初始选择" width="85" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  label
                  name="type"
                  disabled
                  v-model="scope.row.loadCheckd"
                  :class="[scope.row.accessstatus === 0 ? '' : 'unselected']"
                ></el-checkbox>
              </template>
            </el-table-column>-->
						<el-table-column prop="accessname" show-overflow-tooltip label="菜单"></el-table-column>
					</el-table>
				</el-main>
			</el-container>
		</el-main>
	</el-container>
</template>
<script>
export default {
	name: 'permissions',
	props: {
		value: '',
		url: '',
		pageName: '',
		accesstype: {
			type: String,
			default: '全部'
		}
	},
	data() {
		return {
			isExpandAll: true,
			activeName: '1',
			form: {
				type: '-1' //默认 -1 全部 0 已授权 1未授权
			},
			righttableListList: [],
			appList: []
		};
	},
	watch: {
		value: {
			deep: true,
			handler(val) {
				this.$emit('input', val);
				// this.getAuthInfo(val);
			}
		}
	},
	computed: {
		tableList() {
			return this.righttableListList.filter(item => item.accesstype == this.activeName);
		}
	},
	created() {
		this.appList = this.getDicStandarDcode('accesstype').filter(item => {
			if (this.accesstype == '全部') {
				return item;
			}
			if (this.accesstype == item.bzname) {
				return item;
			}
		});

		console.log(this.appList);
	},
	methods: {
		//复选框
		checkboxT(row, index) {
			if (row.source == '角色') {
				return 0;
			} else {
				return 1;
			}
		},
		//获取对应的权限信息
		getAuthInfo(val) {
			if (Object.keys(this.form).length == 1) {
				this.form = val;
			}
			this.sortColumn({ sortable: 'none' }, this.url, this.form, res => {
				this.sortUserChange(res);
			});
		},
		sortUserChange(res) {
			if (res.code == 0) {
				this.righttableListList = res.data;
				this.setArr(this.righttableListList);
				this.$nextTick(() => {
					this.checkedRows(this.righttableListList);
				});
			}
		},
		//将字符串改为布尔值 Boolean
		setArr(arr) {
			for (let value of arr) {
				this.$set(value, 'checkedAll', value.accessstatus == 0 ? false : true);
				this.$set(value, 'loadCheckd', value.accessstatus == 0 ? false : true);
				if (value.children && value.children.length) {
					this.setArr(value.children);
				}
			}
		},
		//选中递归
		checkedRows(data) {
			Array.from(data).forEach(row => {
				if (row.accessstatus != 0) {
					this.$refs.ProductTypes.toggleRowSelection(row, true);
				} else {
					this.$refs.ProductTypes.toggleRowSelection(row, false);
				}
				if (row.children && row.children.length) this.checkedRows(row.children);
			});
		},
		handleClick(tab) {
			this.$nextTick(() => {
				this.checkedRows(this.righttableListList);
			});
		},
		ClickRow(row) {
			// this.rows = this.$refs.ProductTypes.selection;
			// let checkrow = [];
			// checkrow.push(row);
			// if (row.checkedAll == true) {
			//   this.clearRow(checkrow);
			// } else {
			//   this.checkRow(checkrow);
			// }
		},
		//点击复选框事件
		handleSelectionChange(select, row) {
			let selected = select.length && select.indexOf(row) !== -1;
			// this.rows = this.$refs.ProductTypes.selection; //获取表格中所有选中的数据
			let checkrow = [];
			checkrow.push(row);
			if (row.checkedAll == true) {
				if (select == 1) {
					this.$refs.ProductTypes.toggleRowSelection(row, false);
				}
				this.clearRow(checkrow);
			} else {
				if (select == 1) {
					this.$refs.ProductTypes.toggleRowSelection(row, true);
				}
				this.checkRow(checkrow);
			}

			let treeFindPathList = this.treeFindPath(this.tableList, data => data === row); //返回当前操作节点和关联的父节点
			// console.log("treeFindPathList");
			// console.log(treeFindPathList);
			if (treeFindPathList.length > 0) {
				let curArr = [];
				if (treeFindPathList.length == 1) {
					// 当前只有一个节点
					if (treeFindPathList[0].children && treeFindPathList[0].children.length) {
						let partId = this._zipObject(treeFindPathList, 'menuid');
						let childrenId = this._zipObject(treeFindPathList[0].children, 'menuid');
						curArr = [...partId, ...childrenId];
						this.$emit('change', selected, curArr, treeFindPathList); //selected  true就是选中，0或者false是取消选中
					} else {
						let partId = this._zipObject(treeFindPathList, 'menuid');
						curArr = partId;
						this.$emit('change', selected, curArr, treeFindPathList); //selected  true就是选中，0或者false是取消选中
					}
				}
				if (treeFindPathList.length > 1) {
					//当前节点有多个节点父子 关联节点
					let curArr = [];
					let newPathList = this._zipObject(treeFindPathList, 'menuid');
					console.log('newPathList');
					console.log(newPathList);
					let partId = newPathList[0];
					let childrenId = newPathList[1];
					curArr = [...[partId], ...[childrenId]];
					if (newPathList.length == 3) {
						curArr.push(newPathList[2]);
					}
					console.log(curArr);
					if (selected) {
						this.$emit('change', selected, curArr, treeFindPathList); //selected  true就是选中，0或者false是取消选中
					} else {
						this.$emit('change', selected, [newPathList[newPathList.length - 1]], treeFindPathList); //selected  true就是选中，0或者false是取消选中
					}

					let isTrue = false; //判断当前点击节点的选中状态
					for (let i = 0; i < treeFindPathList.length; i++) {
						if (i == treeFindPathList.length - 1) {
						} else {
							if (treeFindPathList[treeFindPathList.length - 1].checkedAll) {
								//如果点击的子节点状态为选中状态那么关联的所有父节点都选中
								console.log(i);
								treeFindPathList[i].checkedAll = true;
								this.$refs.ProductTypes.toggleRowSelection(treeFindPathList[i], true);
							}
						}
					}
				}
			}
		},
		//找父节点
		treeFindPath(tree, func, path = []) {
			if (!tree) return [];
			for (const data of tree) {
				// 这里按照你的需求来存放最后返回的内容
				path.push(data);
				if (func(data)) return path;
				if (data.children && data.children.length) {
					const findChildren = this.treeFindPath(data.children, func, path);
					if (findChildren.length) return findChildren;
				}
				path.pop();
			}
			return [];
		},
		//全选
		selectAll(selection) {
			let isTrue = this.mapIsTrue(this.tableList);
			if (!isTrue) {
				this.checkRow(this.tableList);
			} else {
				this.clearRow(this.tableList);
			}
		},
		mapIsTrue(list) {
			let flag = true;
			Array.from(list).forEach(row => {
				if (row.checkedAll == false) {
					flag = false;
				}
				if (row.children && row.children.length) {
					//有子集就递归  没子集了就不循环了
					this.mapIsTrue(row.children);
				}
			});
			return flag;
		},
		//取消选中递归
		clearRow(data) {
			Array.from(data).forEach(row => {
				row.checkedAll = false; //给这行数据设置一个选中字段为false
				this.$refs.ProductTypes.toggleRowSelection(row, false);
				if (row.children && row.children.length) this.clearRow(row.children); //有子集就递归  没子集了就不循环了
			});
		},
		//选中递归
		checkRow(data) {
			Array.from(data).forEach(row => {
				row.checkedAll = true; //选中是字段值为true
				this.$refs.ProductTypes.toggleRowSelection(row, true);
				if (row.children && row.children.length) this.checkRow(row.children);
			});
		},
		cellStyle: function({ row, column, rowIndex, columnIndex }) {
			if (columnIndex === 1) {
				//指定坐标 选择,中心编号 蓝色;
				return 'selectionNone';
			} else {
				return '';
			}
		},
		//保存
		saveAuth() {
			this.$emit('change', this._zipObject(this.$refs.ProductTypes.selection, 'menuid'));
		},
		_zipObject(arr, key) {
			return arr.map(item => item[key]);
		},
		expand() {
			this.isExpandAll = !this.isExpandAll;
			for (let row of this.tableList) {
				setTimeout(_ => {
					this.$refs.ProductTypes.toggleRowExpansion(row,this.isExpandAll);
				}, 200);
			}
		}
	}
};
</script>
<style scoped>
::v-deep .el-tabs--left .el-tabs__header.is-left {
	margin-right: 2px;
}
.unselected ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner::after {
	cursor: not-allowed;
	border-color: red;
}
::v-deep th.el-table-column--selection.is-leaf.selectionNone .cell {
	display: none !important;
}
.headerFrom >>> .el-form-item--medium .el-radio {
	line-height: 1 !important;
}
</style>
