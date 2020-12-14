<template>
	<d2-container>
		<SplitPane :min-percent="20" :default-percent="35" split="vertical">
		  <template slot="paneL">
		    <el-container>
		      <el-header>
		        <el-form :inline="true" class="headerFrom">
		          <el-form-item>
		            <el-input
		              v-model="form.condition"
		              style="width:260px"
		              @keyup.enter.native="RefreshList"
		              placeholder="按名称、输入码进行查询"
		            ></el-input>
		          </el-form-item>
		          <el-form-item>
		            <el-button-group>
		              <el-button type="primary" @click="RefreshList">查询</el-button>
		            </el-button-group>
		          </el-form-item>
		        </el-form>
		      </el-header>
		      <el-main style="padding:0;">
		        <el-table
		          :data="hospitalList"
		          stripe
		          border
		          @row-click="tableRowClick"
		          highlight-current-row
		          @sort-change="(({column}) => {sortColumn(column,'/Publics/Common/Dic/HospitalInfo',form,sortChange)})"
		          height="100%"
		        >
				<el-table-column
				  label="ID"
				  sortable="custom"
				  width="100"
				  show-overflow-tooltip
				  prop="hospitalid"
				></el-table-column>
		          <el-table-column
		            label="院区"
		            sortable="custom"
		            show-overflow-tooltip
		            prop="hospitalname"
		          ></el-table-column>
		        </el-table>
		      </el-main>
		      <el-footer>
		        <mk-page :pager="form" @query="RefreshList" />
		      </el-footer>
		    </el-container>
		  </template>
		  <template slot="paneR">
			<el-transfer v-model="curAppinfos" @change="handleChange" :props="{key: 'appid',label: 'appname'}" :titles="['未对应','已对应']" :data="AppinfoList"></el-transfer>
		  </template>
		</SplitPane>
	</d2-container>
		  
</template>

<script>
	export default {
		name:"hospitalToApp",
		data(){
			return {
				hospitalList:[],
				hospitalid:'',
				form:{
					condition:'',
					page:1,
					rows:20,
					count:0,
					hospitalid:'',
					orderby:''
				},
				AppinfoList:[],
				curAppinfos:[]
			}
		},
		created() {
			this.RefreshList();
		},
		methods:{
			//获取页面数据
			RefreshList() {
			  this.sortColumn(
			    { sortable: "none" },
			    "/Publics/Common/Dic/HospitalInfo",
			    this.form,
			    res => {
			      this.sortChange(res);
			    }
			  );
			},
			sortChange(res) {
			  if (res.code == 0) {
			    this.hospitalList = res.data;
			    this.form.count = res.count;
			  }
			},
			tableRowClick(row){
				this.hospitalid = row.hospitalid;
				this.getHToApp(row.hospitalid,-1)
				this.getHToApp(row.hospitalid,0)
				
			},
			//获取院区对应应用
			getHToApp(hospitalid,type){ //-1 全部 0 已对应 1未对应
				let sendData = {
					hospitalid:hospitalid,
					type:type
				}
				this.MK.Request(
					"/Publics/Common/Dic/HospitalInfo/Appinfo",
					"GET",
					sendData
				)
				.then(res => {
					if(res.code == 0){
						if(type == 0){
							this.curAppinfos = this._zipObject(res.data,'appid')
							console.log(this.curAppinfos)
						}
						if(type == -1){
							this.AppinfoList = res.data;
						}
					}
				})
			},
			_zipObject(arr, key) {
			  return arr.map(item => item[key]);
			},
			 handleChange(value, direction, movedKeys) {
				console.log(value, direction, movedKeys);
				let sendData = {
					operatetype:direction =='right' ? 'C' : 'D',
					hospitalid:this.hospitalid,
					arrappid:movedKeys
				};
				this.setAppinfo(sendData)
			},
			//院区对应应用 删除/保存/Publics/Common/Dic/HospitalInfo/Appinfo
			setAppinfo(sendData){
				this.MK.Request(
					"/Publics/Common/Dic/HospitalInfo/Appinfo",
					"post",
					sendData
				).then(res => {
					if(res.code == 0){
						this.$message.success(res.msg)
					}
				})
			}
			//应用信息查询
			// getAppinfo(){
			// 	let sendData = {
			// 		tag:1
			// 	}
			// 	this.MK.Request(
			// 		"/Publics/Common/Dic/Appinfo",
			// 		"GET",
			// 		sendData
			// 	)
			// 	.then(res => {
			// 		if(res.code == 0){
			// 			this.AppinfoList = res.data;
			// 		}
			// 	})
			// }
		}
	}
</script>

<style lang="scss" scoped>
    ::v-deep .el-transfer{
		height: 100% !important;
		
	}
	::v-deep .el-transfer .el-transfer-panel{
		height: 100% !important;
		width: 36%
		// calc(30% - 180px)
	}
</style>
