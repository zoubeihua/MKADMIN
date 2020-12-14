<template>
	<d2-container>
		<template slot="header">
			<el-input class="inputSearch mr20" v-model="pagerMember.cardno" placeholder="按会员卡号查询" @blur="MemberInfo_Get()" @keyup.enter.native="MemberInfo_Get()" />
			<el-input class="inputSearch mr20" v-model="pagerMember.membername" placeholder="按会员姓名查询" @blur="MemberInfo_Get()" @keyup.enter.native="MemberInfo_Get()" />
			<el-input class="inputSearch mr20" v-model="pagerMember.idnumber" placeholder="按证件号码查询" @blur="MemberInfo_Get()" @keyup.enter.native="MemberInfo_Get()" />
			<el-input class="inputSearch mr20" v-model="pagerMember.mobiletel" placeholder="按注册的手机号查询" @blur="MemberInfo_Get()" @keyup.enter.native="MemberInfo_Get()" />
			<el-date-picker
				class="mr20"
				v-model="saleDate"
				value-format="yyyy-MM-dd"
				type="daterange"
				align="right"
				unlink-panels
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:picker-options="pickerOptions"
				@change="handleChangeDate"
			></el-date-picker>
			<el-button style type="primary" @click="MemberInfo_Get()" icon="el-icon-search" @keyup.enter.native="MemberInfo_Get()">查询</el-button>
		</template>
		<SplitPane :min-percent="40" :default-percent="40" split="vertical">
			<template slot="paneL">
				<el-container>
					<el-table :data="memberInfoTableData" stripe border @row-click="handleRowClickLeft" highlight-current-row >
						<el-table-column show-overflow-tooltip align="center" label="会员卡号" prop="cardno" />
						<el-table-column show-overflow-tooltip align="center" label="会员姓名" prop="membername" />
						<el-table-column show-overflow-tooltip align="center" label="注册手机" prop="mobiletel" />
						<el-table-column show-overflow-tooltip align="center" label="证件号码" width="200" prop="idnumber" />
						<el-table-column show-overflow-tooltip align="center" label="开户日期">
							<template slot-scope="scope">
								{{ dateFormat(scope.row.operatetime) }}
							</template>
						</el-table-column>
					</el-table>
					<el-footer><mk-page :pager="pagerMember" @query="MemberInfo_Get()" /></el-footer>
				</el-container>
			</template>
			<template slot="paneR">
				<el-container>
					<el-table :data="curMemberMealTableData" show-summary sum-text="总计" stripe border @row-click="handleRowClickRight">
						<el-table-column align="center" label="套餐名称" prop="packagename" />
						<el-table-column align="center" label="套餐分类" prop="classifyname" />
						<el-table-column align="center" label="项目名称" prop="itemname" />
						<el-table-column align="center" label="套餐数量" prop="packagecount" />
						<el-table-column align="center" label="已用数量" prop="occurcount" />
						<el-table-column align="center" label="剩余数量" prop="lavecount" />
						<el-table-column align="center" label="生效日期">
							<template slot-scope="scope">
								{{ dateFormat(scope.row.effectivedate) }}
							</template>
						</el-table-column>
						<el-table-column align="center" label="失效日期">
							<template slot-scope="scope">
								{{ dateFormat(scope.row.expirationdate) }}
							</template>
						</el-table-column>
					</el-table>
					<el-footer><mk-page :pager="pagerMemberMeal" /></el-footer>
				</el-container>
			</template>
		</SplitPane>
	</d2-container>
</template>

<script>
export default {
	name: 'memberMeal',
	computed: {},
	data() {
		return {
			saleDate: '',
			// 会员信息表格分页
			pagerMember: {
				count: 0,
				page: 1,
				rows: 20,
				condition: '',
				cardno: '',
				membername: '',
				idnumber: '',
				mobiletel: '',
				begindate: '',
				enddate: ''
			},
			// 当前会员套餐表格分页
			pagerMemberMeal: {
				count: 0,
				page: 1,
				rows: 10,
				condition: ''
			},
			// 会员信息表格
			memberInfoTableData: [],
			// 当前选中会员的套餐信息表格
			curMemberMealTableData: [],
			// 日期选择
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
			}
		};
	},
	created() {
		this.MemberInfo_Get();
	},
	methods: {
		handleChangeDate(val) {
			if (val) {
				this.pagerMember.begindate = val[0];
				this.pagerMember.enddate = val[1];
			} else {
				this.pagerMember.begindate = "";
				this.pagerMember.enddate = ""
			}
			this.MemberInfo_Get();
		},
		// 左边表格行点击
		handleRowClickLeft(row) {
			console.log('左边', row);
			this.curMemberMealTableData = []
			this.UseDetail_Get(row.saleid);
		},
		// 右边表格行点击
		handleRowClickRight(row) {
			console.log('右边', row);
		},
		MemberInfo_Get() {
			this.MK.Request('/Hcrm/PackageService/Package/Members', 'get', this.pagerMember).then(res => {
				this.memberInfoTableData = res.data;
				this.pagerMember.count = res.count;
			});
		},
		UseDetail_Get(saleid) {
			this.pagerMemberMeal.saleid = saleid;
			this.MK.Request('/Hcrm/PackageService/Package/UseDetail', 'get', this.pagerMemberMeal).then(res => {
				this.curMemberMealTableData = res.data;
				this.pagerMemberMeal.count = res.count;
			});
		},
		// 时间过滤日期
		dateFormat(date) {
			const year = new Date(date).getFullYear();
			const month = new Date(date).getMonth() + 1 < 10 ? '0' + (new Date(date).getMonth() + 1) : new Date(date).getMonth() + 1;
			const day = new Date(date).getDate() < 10 ? '0' + new Date(date).getDate() : new Date(date).getDate();
			return `${year}-${month}-${day}`;
		}
	}
};
</script>

<style scoped>
.mr20 {
	margin-right: 20px;
}
.inputSearch {
	width: 180px;
}
</style>
