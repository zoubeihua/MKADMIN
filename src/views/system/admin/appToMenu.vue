<template>
	<d2-container>
		<SplitPane :min-percent="20" :default-percent="35" split="vertical">
			<template slot="paneL">
				<el-container>
					<el-header>
						<el-form :inline="true" class="headerFrom">
							<el-form-item>
								<el-input v-model="form.condition" style="width:260px" @keyup.enter.native="RefreshList" placeholder="按名称、输入码进行查询"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button-group>
									<el-button type="primary" @click="RefreshList">查询</el-button>
								</el-button-group>
							</el-form-item>
						</el-form>
					</el-header>
					<el-main style="padding:0;">
						<el-table :data="appList" stripe border @row-click="tableRowClick" highlight-current-row @sort-change="(({column}) => {sortColumn(column,'/Publics/Common/Dic/Appinfo',form,sortChange)})"
						 height="100%">
							<el-table-column label="ID" sortable="custom" width="100" show-overflow-tooltip prop="appid"></el-table-column>
							<el-table-column label="应用" sortable="custom" show-overflow-tooltip prop="appname"></el-table-column>
						</el-table>
					</el-main>
				</el-container>
			</template>
			<template slot="paneR">
				<table-menu ref="permissions" url="/Publics/Common/Dic/Appinfo/Menuinfo" accesstype="菜单权限" @change="permissionsChange" />
			</template>
		</SplitPane>
	</d2-container>

</template>

<script>
	import tableMenu from "./components/tableMenu.vue";
	export default {
		name: "appToMenu",
		data() {
			return {
				appList: [],
				form: {
					condition: '',
					tag: 1,
					hospitalid: '',
					orderby: ''
				},
				rightForm:{
					appid:'',
					type:'-1'//查询类型 默认 -1 全部 0 已对应 1未对应
				}
			}
		},
		components:{
			tableMenu
		},
		created() {
			this.RefreshList();
		},
		methods: {
			//获取页面数据
			RefreshList() {
				this.sortColumn({
						sortable: "none"
					},
					"/Publics/Common/Dic/Appinfo",
					this.form,
					res => {
						this.sortChange(res);
					}
				);
			},
			sortChange(res) {
				if (res.code == 0) {
					this.appList = res.data;
					this.form.count = res.count;
				}
			},
			tableRowClick(row) {
				//获取应该对应的菜单
				this.rightForm.appid = row.appid;
				this.$refs.permissions.getAuthInfo(this.rightForm);
			},
			permissionsChange(selected,val,list) {
			  let Selects = val;
			  let operatetype = "C";
			  if(selected){
			    operatetype = "C"
			  }else{
			    operatetype = "D"
			  }
			  let sendData = {
			    operatetype: operatetype,
			    appid:this.rightForm.appid,
			    arrmenuid: val
			  };
			    this.MK.Request("/Publics/Common/Dic/Appinfo/Menuinfo", "post", sendData).then(
			    res => {
			      if (res.code == 0) {
			        this.$message({
			          type: "success",
			          message: res.msg
			        });
			       this.$refs.permissions.getAuthInfo();
			      };
			    }
			  );
			},
			_zipObject(arr, key) {
				return arr.map(item => item[key]);
			},
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .el-transfer {
		height: 100% !important;

	}
	::v-deep .el-form-item--mini .el-radio,::v-deep .el-form-item--medium .el-radio, ::v-deep .el-form-item--small .el-radio {
	   line-height: inherit !important;
	 }
	::v-deep .el-transfer .el-transfer-panel {
		height: 100% !important;
		width: 36% // calc(30% - 180px)
	}
</style>
