<template>
	<SplitPane :min-percent="30" :default-percent="30" split="vertical" style="height:100%">
		<template slot="paneL">
			<el-container>
				<el-header class="el-header-lq">
					<el-tabs type="card" @tab-click="handleClick" value="1">
						<!-- ---------------------- -->
						<el-tab-pane label="已添加" name="1"> </el-tab-pane>
					</el-tabs>
				</el-header>
				<el-main style="padding:0">
					<el-table border highlight-current-row stripe :data="selectedData" ref="selectedData" height="100%" @select-all="
              selectAll(
                $event,
                $event.matchtype,
                'matchitem',
                'matchitemname',
                'selectedData'
            )
            "
					 @select="
              (selection, row) =>
                handleSelectionChange(
                  row.matchtype,
                  selection,
                  row, 
                  'matchitem',
                  'matchitemname',
                  'selectedData',
                  '1',
									'left'
                )
            ">
						<el-table-column type="selection" width="55" :selectable="checkboxT" />
						<el-table-column label="适应类型" prop="matchtypename"></el-table-column>
						<el-table-column label="适应条件" prop="matchitemname"></el-table-column>
					</el-table>
				</el-main>
				<el-footer>
					<mk-page :pager="sPager" @query="getSelectedData" />
				</el-footer>
			</el-container>
		</template>
		<template slot="paneR">
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="height:100%">
				<!-- ----------适应项目------------ -->
				<el-tab-pane label="适应项目类别" name="1" style="height:100%">
					<el-table border highlight-current-row stripe ref="projectTypeData" :data="projectTypeData" @select-all="
              selectAll(
                $event,
                '1',
                'itemtypeid',
                'itemtypename',
                'projectTypeData'
              )
            "
					 @select="
              (selection, row) =>
                handleSelectionChange(
                  '1',
                  selection,
                  row,
                  'itemtypeid',
                  'itemtypename',
                  'projectTypeData',
                  '1'
                )
            "
					 height="100%">
						<el-table-column type="selection" width="55" :selectable="checkboxT" />
						<el-table-column label="类别id" prop="itemtypeid"></el-table-column>
						<el-table-column label="项目类别" prop="itemtypename"></el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- ----------适应项目------------ -->
				<el-tab-pane label="适应项目" name="0" style="height:100%">
					<SplitPane :min-percent="30" :default-percent="30" split="vertical" style="height:100%">
						<template slot="paneL" style="height:100%">
							<el-container style="height:100%">
								<el-main>
									<el-table border highlight-current-row stripe :data="projectTypeData" @row-click="getProject" height="100%">
										<!-- <el-table-column
                      label="类别id"
                      prop="itemtypeid"
                    ></el-table-column> -->
										<el-table-column label="项目类别" prop="itemtypename"></el-table-column>
									</el-table>
								</el-main>
							</el-container>
						</template>
						<template slot="paneR">
							<el-container>
								<el-header>
									<el-form inline>
										<el-form-item label="">
											<el-input v-model="pPager.itemname" placeholder="按名称查找" @keyup.enter.native="getProject(projectRow)"></el-input>
										</el-form-item>
										<el-form-item label="">
											<el-button @click="getProject(projectRow)">查询</el-button>
										</el-form-item>
									</el-form>
								</el-header>
								<el-main style="padding:0">
									<el-table border highlight-current-row stripe ref="projectData" :data="projectData" height="100%" @select-all="
                      selectAll(
                        $event,
                        '0',
                        'itemid',
                        'itemname',
                        'projectData'
                      )
                    "
									 @select="
                      (selection, row) =>
                        handleSelectionChange(
                          '0',
                          selection,
                          row,
                          'itemid',
                          'itemname',
                          'projectData',
                          '1'
                        )
                    ">
										<el-table-column type="selection" width="55" :selectable="checkboxT" />
										<el-table-column label="项目名称" prop="itemname"></el-table-column>
										<el-table-column label="单价/元" prop="price" :formatter="(i=>projectAmountsTabel(i,'price'))"></el-table-column>
									</el-table>
								</el-main>
								<el-footer>
									<mk-page :pager="pPager" @query="getProject(projectRow)" />
								</el-footer>
							</el-container>
						</template>
					</SplitPane>
				</el-tab-pane>
				<!-- ----------适应院区------------ -->
				<el-tab-pane label="适应院区" name="2">
					<el-container>
						<el-main>
							<el-table ref="hospitalData" :data="hospitalData" @select-all="
                  selectAll(
                    $event,
                    '2',
                    'hospitalid',
                    'hospitalname',
                    'hospitalData'
                  )
                "
							 @select="
                  (selection, row) =>
                    handleSelectionChange(
                      '2',
                      selection,
                      row,
                      'hospitalid',
                      'hospitalname',
                      'hospitalData',
                      '1'
                    )
                "
							 border highlight-current-row stripe>
								<el-table-column type="selection" width="55" :selectable="checkboxT" />
								<el-table-column show-overflow-tooltip align="center" label="院区ID" prop="hospitalid" />

								<el-table-column show-overflow-tooltip align="center" label="院区名称" prop="hospitalname" />
								<el-table-column show-overflow-tooltip align="center" label="院区简称" prop="shortname" />
								<!-- <el-table-column
                  show-overflow-tooltip
                  align="center"
                  label="状态"
                  width="80"
                  prop="status"
                >
                </el-table-column> -->
							</el-table>
						</el-main>
					</el-container>
				</el-tab-pane>
				<!-- ----------适应人员------------ -->
				<el-tab-pane label="适应会员类型" name="3">
					<el-table ref="memberTypeData" :data="memberTypeData" @select-all="
              selectAll($event, '3', 'membertypeid', 'name', 'memberTypeData')
            "
					 @select="
              (selection, row) =>
                handleSelectionChange(
                  '3',
                  selection,
                  row,
                  'membertypeid',
                  'name',
                  'memberTypeData',
                  '1'
                )
            "
					 border highlight-current-row stripe>
						<el-table-column type="selection" width="55" :selectable="checkboxT" />
						<el-table-column label="会员类型" prop="name"></el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="会员等级" name="4">
					<el-table ref="memberLevelData" :data="memberLevelData" @select-all="
              selectAll($event, '4', 'levelid', 'name', 'memberLevelData')
            "
					 @select="
              (selection, row) =>
                handleSelectionChange(
                  '4',
                  selection,
                  row,
                  'levelid',
                  'name',
                  'memberLevelData',
                  '1'
                )
            "
					 border highlight-current-row stripe>
						<el-table-column type="selection" width="55" :selectable="checkboxT" />
						<el-table-column label="会员等级" prop="name"></el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</template>
	</SplitPane>
</template>
<script>
	import {
		activate
	} from "../../../../../../public/lib/UEditor/third-party/zeroclipboard/ZeroClipboard";
	export default {
		props: {
			row: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				hospitalData: [],
				memberTypeData: [],
				memberLevelData: [],
				projectData: [],
				projectTypeData: [],
				selectedData: [],
				activeName: "1",
				projectRow: [], //临时
				pPager: {
					page: 1,
					rows: 20,
					count: 0,
					itemname: ""
				},
				sPager: {
					page: 1,
					rows: 20,
					count: 0
				}
			};
		},
		mounted() {
			this.mountFun()
			// this.getSelectedData();
			// //获取院区列表
			// this.HospitalInfo();
			// //获取项目类别列表
			// this.ItemBaseType_get();
			// this.Membertype();
			// this.Memberlevel();
		},
		methods: {
			async mountFun() {
				let res = await this.getSelectedData();
				//获取院区列表
				this.HospitalInfo();
				//获取项目类别列表
				this.ItemBaseType_get();
				this.Membertype();
				this.Memberlevel();
			},
			async getSelectedData() {
				let list = await this.getCouponMatch("");
				let listdata = list.data;
				this.selectedData = list.data;
				this.sPager.count = list.count;
				this.selectedData.forEach(item => {
					item.checkStatus = true;
					this.$nextTick(() => {
						this.$refs["selectedData"].toggleRowSelection(item, true);
					});
				});
			},
			getCouponMatch(matchtype) {
				let data = {
					couponid: this.row.couponid,
					tag: 1,
					hospitalid: this.info.hospitalid,
					matchtype: matchtype
				};
				if (matchtype == "") {
					data = {
						couponid: this.row.couponid,
						hospitalid: this.info.hospitalid,
						...this.sPager
					};
				}
				return this.MK.Request("/Publics/CouponManage/CouponMatch", "get", data);
			},
			//获取会员等级列表/Publics/MemberManage/Memberlevel
			async Memberlevel() {
				let list = await this.getCouponMatch("4");
				this.MK.Request("/Publics/MemberManage/Memberlevel", "get", {
					hospitalid: this.info.hospitalid,
					tag: 1
				}).then(res => {
					if (res.code == 0) {
						this.memberLevelData = this.addKey(res.data, list, "levelid");
						this.$nextTick(() => {
							this.checkedRows(this.memberLevelData, "memberLevelData");
						});
					}
				});
			},
			//获取会员类别列表
			async Membertype() {
				let list = await this.getCouponMatch("3");
				this.MK.Request("/Publics/MemberManage/Membertype", "get", {
					hospitalid: this.info.hospitalid,
					tag: 1
				}).then(res => {
					if (res.code == 0) {
						this.memberTypeData = this.addKey(res.data, list, "membertypeid");
						this.$nextTick(() => {
							this.checkedRows(this.memberTypeData, "memberTypeData");
						});
					}
				});
			},
			//获取项目类别列表
			async ItemBaseType_get() {
				let list = await this.getCouponMatch("1");
				this.MK.Request("/Publics/ItemManage/ItemBaseType", "get", {
					hospitalid: this.info.hospitalid,
					tag: 1
				}).then(res => {
					if (res.code == 0) {
						this.projectTypeData = this.addKey(res.data, list, "itemtypeid");
						this.$nextTick(() => {
							this.checkedRows(this.projectTypeData, "projectTypeData");
						});
					}
				});
			},
			//
			async HospitalInfo() {
				let list = await this.getCouponMatch("2");
				this.MK.Request(
					"/Publics/Common/Dic/HospitalInfo",
					"get",
					this.pager
				).then(res => {
					if (res.code == 0) {
						// this.addKey(res.data);
						this.hospitalData = this.addKey(res.data, list, "hospitalid");
						this.$nextTick(() => {
							this.checkedRows(this.hospitalData, "hospitalData");
						});
					}
				});
			},
			//适应项目
			async getProject(row) {
				this.projectRow = row;
				let list = await this.getCouponMatch("0");
				this.MK.Request("/Publics/ItemManage/ItemInfo", "get", {
					itemtype: this.projectRow.itemtypeid,
					tag: 0,
					hospitalid: this.info.hospitalid,
					...this.pPager
				}).then(res => {
					if (res.code == 0) {
						this.pPager.count = res.count;
						this.projectData = this.addKey(res.data, list, "itemid");
						this.$nextTick(() => {
							this.checkedRows(this.projectData, "projectData");
						});
					}
				});
			},
			// selectAll($event, '4', 'levelid', 'name', 'memberLevelData')
			selectAll(list, matchtype, matchitem, matchitemname, tabelRef) {
				let listData = this[tabelRef];
				let status = list.length == 0 ? "3" : "2";
				for (let i = 0; i < listData.length; i++) {
					if (status == "3" && listData[i].checkStatus == true) {
						this.handleSelectionChange(
							matchtype,
							list,
							listData[i],
							matchitem,
							matchitemname,
							tabelRef,
							status
						);
					}
					if (status == "2" && listData[i].checkStatus == false) {
						this.handleSelectionChange(
							matchtype,
							list,
							listData[i],
							matchitem,
							matchitemname,
							tabelRef,
							status
						);
					}
				}
			},
			//修改
			handleSelectionChange(
				matchtype,
				selection,
				rows,
				matchitem,
				matchitemname,
				tabelRef,
				checkStatus,
				oper
			) {
				let a = this.getDicStandarDcode("优惠券适应类型");
				console.log(rows)
				let data = {
					couponid: this.row.couponid,
					matchitem: rows[matchitem],
					matchtype: matchtype,
					matchitemname: rows[matchitemname],
					matchtypename: ''
				};

				//2全选 3全不选  1是单选
				if (checkStatus == 2) {
					data.operatetype = "C";
				} else if (checkStatus == 3) {
					data.operatetype = "D";
				} else {
					data.operatetype = rows.checkStatus ? "D" : "C";
				}

				a.forEach(item => {
					if (item.bzcode == matchtype) {
						data.matchtypename = item.bzname;
					}
				});
				if (matchtype == undefined) {
					data.matchtypename = rows['matchtypename']
					data.matchtype = rows['matchtype']
				}
				this.MK.Request("/Publics/CouponManage/CouponMatch", "post", data).then(
					async res => {
						if (res.code == 0) {
							rows.checkStatus = !rows.checkStatus;
							this.$message.success(res.msg);
							let result = await this.getSelectedData();
							if(oper == 'left'){
								
								switch (matchtype) {
									case 0:
										this.ItemBaseType_get()
										break;
									case 1:
										this.ItemBaseType_get()
										break;
									case 2:
										this.HospitalInfo()
										break;
									case 3:
										this.Membertype()
										break;
									case 4:
										this.Memberlevel()
										break;
								
								}
							}
						} else {
							this.$refs[tabelRef].toggleRowSelection(rows, rows.checkStatus);
						}
					}
				);
			},

			handleClick() {
				// this.getSelectedData();
				//获取院区列表
				// this.HospitalInfo();
				// //获取项目类别列表
				// this.ItemBaseType_get();
				// this.Membertype();
				// this.Memberlevel();
				switch (this.activeName) {
					case '0':
						this.ItemBaseType_get()
						break;
					case '1':
						this.ItemBaseType_get()
						break;
					case '2':
						this.HospitalInfo()
						break;
					case '3':
						this.Membertype()
						break;
					case '4':
						this.Memberlevel()
						break;

				}
			},
			//循环递归
			checkedRows(data, table) {
				Array.from(data).forEach(row => {
					if (row.checkStatus) {
						this.$refs[table].toggleRowSelection(row, true);
					} else {
						this.$refs[table].toggleRowSelection(row, false);
					}
				});
			},
			addKey(tableList, lists, id) {
				let list = lists.data;
				if (list.length == 0) {
					tableList.forEach(item => {
						item.checkStatus = false;
					});
					return tableList;
				}
				if (tableList.length == 0) {
					return [];
				}
				for (let i = 0; i < tableList.length; i++) {
					for (let k = 0; k < list.length; k++) {
						if (list[k].matchitem == tableList[i][id]) {
							tableList[i].checkStatus = true;
							break;
						} else if (list[k].matchitem !== tableList[i][id]) {
							tableList[i].checkStatus = false;
						}
					}
				}
				return tableList;
			},
			//复选框
			checkboxT(row, index) {
				return 1;
				//判断是否可以选中，0：不可选，1:可选
				//   if (row.status == 1) {
				//     return 0;
				//   } else {
				//     return 1;
				//   }
			}
		}
	};
</script>
<style scoped>
	.el-header-lq {
		height: auto !important;
		padding: 0px !important;
		padding-top: 0px !important;
		min-height: 0px !important;
	}

	>>>.el-tabs__content {
		height: calc(100% - 42px);
	}
</style>
