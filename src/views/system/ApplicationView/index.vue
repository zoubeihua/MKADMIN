<template>
	<div class="bg">
		<div class="header">
			<div class="userName">
			<!-- 	当前院区：{{curHospitalidName}} -->
				<el-dropdown @command="handleCommandHospital">
					<span class="el-dropdown-link">
						当前院区：{{curHospitalidName}}<i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item :command="item.hospitalid" v-for="(item,index) in info.listhospitalinfo" :key="index">{{item.hospitalname}}</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-dropdown @command="handleCommandWorkGroupInfo" style="margin-left: 40px;" v-if="listworkgroupinfo.length > 0">
					<span class="el-dropdown-link">
						当前工作组：{{curWorkgName}}<i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item :command="item.wgid" v-for="(item,index) in listworkgroupinfo" :key="index">{{item.wgname}}</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
			<div>
				<div class="userName">
					<span>{{info.name}} </span>
					<i title="退出" @click="singOut" class="el-icon-switch-button out"></i>
				</div>
			</div>
		</div>
		<div style="height:calc(100% - 60px);background: #eee;">
			<el-scrollbar style="height:100%;">
				<div class="content">
					<div class="item" @click="jump(item)" v-for="(item,index) in listappinfo" :key="index">
						<div class="modName">
							{{item.appname}}
						</div>
					</div>
				</div>

			</el-scrollbar>
		</div>
	</div>
</template>
<script>
	import {
		mapState,
		mapActions
	} from "vuex";
	import util from "@/libs/util.js";
	export default {
		name: 'application',
		...mapState("d2admin/user", ["info"]),
		data() {
			return {
				appList: [],
				rightForm: {
					userid: "",
					type: "0", //查询类型 默认 -1 全部 0 已授权 1未授权
					manageid: "",
					tag: 1,
					hospitalid: "",
					orderby: ""
				},
				wgid:'',//工作组id
				wgname:'',//工作组名称
			}
		},
		created() {
		},
		computed: {
			//当前院区名称
			curHospitalidName() {
				try{
					if(this.info.listhospitalinfo.length > 0){
						return this.info.listhospitalinfo[this.curHospitalIndex].hospitalname;
					}else{
						return '院区异常重新登录';
					}
				}catch(e){
					//TODO handle the exception
					return '请选择院区'
				}
			},
			//医院简称
			curShortName(){
				try{
					if(this.info.listhospitalinfo.length > 0){
						return this.info.listhospitalinfo[this.curHospitalIndex].shortname;
					}else{
						return '医院简称异常重新登录';
					}
				}catch(e){
					//TODO handle the exception
					return '暂无医院简称'
				}
			},
			//当前院区索引
			curHospitalIndex() {
				try{
					return this.info.listhospitalinfo.findIndex(item => item.hospitalid == this.info.hospitalid) || 0;
				}catch(e){
					//TODO handle the exception
					return 0
				}
			},
			//当前工作组名称
			curWorkgName(){
				if(this.listworkgroupinfo.length > 0){
					return this.listworkgroupinfo[this.curWorkgIndex].wgname;
				}
			},
			//当前工作组索引
			curWorkgIndex(){
				if(this.info.wgid){
					if(this.listworkgroupinfo.length > 0){
						return this.listworkgroupinfo.findIndex(item => item.wgid == this.info.wgid) || 0;
					}else{
						return 0;
					}
				}else{
					return 0;
				}
				 
			},
			//工作组列表
			listworkgroupinfo(){
				try{
					if(this.info.listhospitalinfo.length > 0){
						return this.info.listhospitalinfo[this.curHospitalIndex].listworkgroupinfo;
					}else{
						return [];
					}
				}catch(e){
					//TODO handle the exception
					return [];
				}
			},
			//应用列表
			listappinfo(){
				try{
					if(this.info.listhospitalinfo.length > 0){
						return this.info.listhospitalinfo[this.curHospitalIndex].listappinfo;
					}else {
						return [];
					}
				}catch(e){
					//TODO handle the exception
					return [];
				}
			}
		},
		methods: {
			...mapActions('d2admin/account', ['logout']),
			...mapActions("d2admin/user", ["set"]),
			async jump(item) {
				const loading = this.$loading({
					lock: true,
					text: '正在加载应用',
					spinner: 'el-icon-loading',
					background: 'rgba(255, 255, 255, 0.5)'
				});
				
				setTimeout(() => {
					let appid = item.appid;
					let appname = item.appname;
					let hospitalid = this.info.listhospitalinfo[this.curHospitalIndex].hospitalid;
					let hospitalname = this.curHospitalidName;
					let shortname = this.curShortName;
					let wgid = '',wgname= ''
					if(this.listworkgroupinfo.length){
						wgid = this.listworkgroupinfo[this.curWorkgIndex].wgid;
						wgname = this.listworkgroupinfo[this.curWorkgIndex].wgname;
					}
					this.set({...this.info,...item,hospitalname,hospitalid,wgid,wgname,shortname,appid,appname});
					util.cookies.set('token', this.info.userid);
					this.$router.replace(this.$route.query.redirect || '/');
					loading.close();
				},1500)
			},
			//切换院区
			handleCommandHospital(val) {
				let hospitalid = val;
				let wgid = '';
				let wgname = '';
				let appid = '';
				let appname = '';
				let userinfo = {...this.info,hospitalid,wgid,wgname,appid,appname};
				this.set(userinfo);
				this.$nextTick(() => {
					let hospitalname = this.curHospitalidName
					let shortname = this.curShortName;
					if(this.listworkgroupinfo.length > 0){
						wgid = this.listworkgroupinfo[this.curWorkgIndex].wgid;
						wgname = this.listworkgroupinfo[this.curWorkgIndex].wgname;
					}else{
						wgid = '';
						wgname = '';
					}
					let userinfo = {...this.info,hospitalname,shortname,wgid,wgname};
					this.set(userinfo);
				});
			},
			//切换工作组
			handleCommandWorkGroupInfo(val){
				let wgid = val;
				let wgname = this.curWorkgName;
				let appid = '';
				let appname = '';
				let userinfo = {...this.info,wgid,wgname,appid,appname};
				this.set(userinfo);
				this.$nextTick(() => {
					if(this.listworkgroupinfo.length > 0){
						wgid = this.listworkgroupinfo[this.curWorkgIndex].wgid;
						wgname = this.listworkgroupinfo[this.curWorkgIndex].wgname;
					}else{
						wgid = '';
						wgname = '';
					}
					let userinfo = {...this.info,wgid,wgname,appid,appname};
					this.set(userinfo);
				})
			},
			singOut() {
				this.logout({
					confirm: true
				})
			}
		},

	}
</script>
<style scoped>
	.bg {
		width: 100%;
		height: 100%;
		background-size: cover;
		/* background-image:url(./img/bg.png); */
		background-repeat: no-repeat;
		background-attachment: fixed;
	}

	>>>.el-scrollbar__wrap {
		overflow-x: hidden !important;
	}

	.header {
		height: 60px;
		padding: 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #545c64;
	}

	.header .userName {
		font-size: 22px;
		color: #ffd04b;
	}

	.header .el-dropdown-link {
		cursor: pointer;
		font-size: 22px;
		color: #ffd04b;
	}

	.el-icon-arrow-down {
		font-size: 20px;
	}

	.out {
		cursor: pointer;
		margin-left: 10px;
		font-size: 22px;
	}

	.content {
		padding: 20px;
		box-sizing: border-box;
		width: 100%;
		display: flex;
		/* justify-content: space-between; */
	}

	.content .item {
		cursor: pointer;
		align-items: center;
		justify-content: space-around;
		display: flex;
		flex-direction: column;
		width: 300px;
		height: 200px;
		/* background: rgba(90, 191, 246, 0.7); */
		background: #fff;
		transition: all .5s;
	}

	.content .item+.item {
		margin-left: 20px;
	}

	.content .item .icon i {
		font-size: 80px;
		color: #fff;
	}

	.content .item .modName {
		font-size: 20px;
		color: #666;
	}

	.content .item:hover {
		transform: scale(1.1);
		/* background: #5abff6; */
	}
</style>
