<template>
	<d2-container>
		<template slot="header">
			<el-form :inline="true">
				<el-form-item>
					<mk-select
						v-model="area"
						style="width: 88.5vw;"
						placeholder="请选择院区"
						url="/Publics/Common/Dic/HospitalInfo"
						:filter="['hospitalname', 'filterstr']"
						label="hospitalname"
						val="hospitalid"
						@change="handleChangeHosp"
					></mk-select>
				</el-form-item>
				<!-- <el-form-item><el-input type="textarea" @focus="focus" v-el-input-focus v-model="area"></el-input></el-form-item> -->
			</el-form>
		</template>
		<SplitPane v-if="area" :min-percent="10" :default-percent="10" split="vertical">
			<template slot="paneL">
				<el-table :data="staffTableData" stripe border highlight-current-row @row-click="handleRowClickL">
					<el-table-column show-overflow-tooltip align="left" label="人员类型" prop="bzname" />
				</el-table>
			</template>
			<template slot="paneR">
				<el-tabs type="card" v-model="activeName">
					<!-- tabs循环 -->
					<el-tab-pane v-for="item in tabs" :label="item.label" :name="item.name" :key="item.label">
						<el-table
							stripe
							border
							highlight-current-row
							@row-click="handleRowClickR"
							@selection-change="handleSelectionChange"
							v-if="activeTableData[activeName]"
							:data="activeTableData[activeName].list"
						>
							<el-table-column align="center" type="selection" width="55" />
							<!-- column循环 -->
							<el-table-column show-overflow-tooltip align="left" v-for="x in activeTableData[activeName].rowInfo" :key="x.label" :label="x.label" :prop="x.prop" />
						</el-table>
					</el-tab-pane>
				</el-tabs>
			</template>
		</SplitPane>
	</d2-container>
</template>

<script>
export default {
	name: 'peopleTypeRules',
	data() {
		return {
			area: '',
			activeName: '0',
			activeTableData: [], //当前tab的数据，请求数据要根据tabs里面的顺序
			tabs: [
				{
					label: '适应权限',
					name: '0'
				},
				{
					label: '适应角色',
					name: '1'
				}
			],
			staffTableData: [] // 人员grid
		};
	},
	components: {},
	created() {
		this.$watch(
			'activeName',
			newVal => {
				console.log(newVal);
			},
			{ immediate: 1000 }
		);
		this.roleInfo_Get();
		let obj = {};
		obj.list = [
			{
				value: 'jmcf',
				label: '精麻处方权'
			},
			{
				value: 'jzcf',
				label: '急诊处方权'
			},
			{
				value: 'mzcf',
				label: '门诊处方权'
			},
			{
				value: 'mzq',
				label: '麻醉权'
			},
			{
				value: 'sszd',
				label: '手术主刀权'
			},
			{
				value: 'sszg',
				label: '手术资格权'
			},
			{
				value: 'zycf',
				label: '住院处方权'
			}
		];
		obj.rowInfo = [
			{
				label: '处方权限',
				prop: 'label'
			}
		];
		this.activeTableData.push(obj);
	},
	methods: {
		focus() {
			this.$message.success('你好')
		},
		// 假·切换院区时达到数据交互的效果
		handleChangeHosp(val) {
			if (val.hospitalid) {
				this.staffInfo_Get();
			}
		},
		handleSelectionChange(val) {
			console.log('selected', val);
		},
		handleRowClickL(row) {
			console.log('L', row);
		},
		handleRowClickR(row) {
			console.log('R', row);
		},
		staffInfo_Get() {
			this.MK.Request('/Publics/Common/Dic/StandCode', 'get', { codetype: '人员类型' }).then(res => {
				this.staffTableData = res.data;
			});
		},
		roleInfo_Get() {
			this.MK.Request('/Publics/Common/Role', 'get', { status: 1 }).then(res => {
				let obj = {};
				// 定义所需的数据结构
				obj.list = res.data;
				obj.rowInfo = [
					{
						label: '角色名称',
						prop: 'rolename'
					},
					{
						label: '角色描述',
						prop: 'note'
					}
				];
				this.activeTableData.push(obj);
			});
		}
	}
};
</script>

<style scoped></style>
