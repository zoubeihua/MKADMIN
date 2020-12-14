<template>
	<vxe-modal v-model="modal" ref="modal" width="720" height="auto" :showFooter="true" @close="close">
		<div slot="title">
			角色维护
			<span v-if="userData.userid">
				- [
				<span style="color:red;">{{ userData.hospitalname }} - {{ userData.name }} - {{ userData.stafftype_display }}</span>
				]
			</span>
		</div>
		<el-transfer
			style="text-align: left; display: inline-block"
			v-model="form.deptid"
			filterable
			filter-placeholder="按角色查询"
			:titles="['未选择角色', '已选择角色']"
			:format="{
				noChecked: '${total}',
				hasChecked: '${checked}/${total}'
			}"
			@left-check-change="handleDelete"
			@right-check-change="handleAdd"
			:data="roleData"
		>
			<span slot-scope="{ option }">{{ option.label }}</span>
		</el-transfer>
		<div slot="footer" class="footer">
			<el-button-group>
				<el-button type="warning" @click="close">关闭</el-button>
			</el-button-group>
		</div>
	</vxe-modal>
</template>

<script>
export default {
	props: {
		userData: {
			type: Object,
			default: () => {}
		},
		methods: {
			type: Function,
			default: null
		}
	},
	computed: {},
	data() {
		return {
			modal: false,
			form: {
				deptid: []
			},
			roleData: [],
			selectedArr:[],
			roleUserList:[]
		};
	},
	mounted() {},
	methods: {
		async open() {
			this.modal = true;
			this.roleInfo_Get();
		},
		close() {
			this.modal = false;
		},
		// 穿梭框左边
		handleDelete(key, direction, keyarr) {
			console.log("左边：",key, direction, keyarr);
			this.selectedArr = key
			var role = {}
			for (var index in this.selectedArr) {
				for(var i = 0; i < this.roleData.length; i++) {
					if(this.selectedArr[index] == this.roleData[i].key) {
						role = this.roleData[i]
						this.roleUsers_Post(role,"C")
					}
				}
			}
		},
		// 穿梭框右边
		handleAdd(key, direction, keyarr) {
			console.log("右边：",key, direction, keyarr);
			this.selectedArr = key
			var role = {}
			for (var index in this.selectedArr) {
				for(var i = 0; i < this.roleData.length; i++) {
					if(this.selectedArr[index] == this.roleData[i].key) {
						role = this.roleData[i]
						this.roleUsers_Post(role,"D")
					}
				}
			}
		},
		roleUsers_Post(role,key) {
			let data = {};
			data.roleid = role.key;
			data.rolename = role.label;
			data.userarr = [
				{
					userid: this.userData.userid,
					name: this.userData.name
				}
			];
				data.operatetype = key;
			this.MK.Request('/Publics/Common/Role/Users', 'post', data).then(res => {
				if (res.code == 0) {
					this.$message({
						message: res.msg,
						type: 'success'
					});
					this.roleUsers_Get(this.userData.userid)
					this.methods();
				}
			});
		},
		roleUsers_Get(userid) {
			this.form.deptid=[]
			this.MK.Request("/Publics/Common/User/Role",'get',{
				userid: userid,
				type: 0
			}).then(res => {
				this.$emit('roleList',res.data)
				res.data.forEach(item => {
					this.form.deptid.push(item.roleid);
				});
			})
		},
		roleInfo_Get() {
			this.MK.Request('/Publics/Common/Role', 'get', {
				hospitalid: this.userData.hospitalid
			}).then(res => {
				res.data.forEach(item => {
					this.roleData.push({
						label: item.rolename,
						key: item.roleid
					});
				});
			});
		}
	},
	watch: {
		modal(val) {
			if (!val) {
				this.$emit('update:userdata', {});
				this.roleData = [];
				
			}
		}
	}
};
</script>

<style scoped>
.footer {
	display: flex;
	flex-direction: column;
	align-items: center;
}
>>> .el-transfer-panel {
	width: 260px;
}
>>> .el-transfer-panel .el-transfer-panel__header {
	background: rgb(132, 210, 207);
}
>>> .el-transfer-panel__body {
	height: 500px;
}
>>> .el-transfer-panel__list.is-filterable {
	height: 500px;
}
</style>
