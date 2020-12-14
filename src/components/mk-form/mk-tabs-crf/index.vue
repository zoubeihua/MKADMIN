<template>
	<div style="height:100%">
		<mk-empty v-if="toFormList.length == 0" style="padding-top:200px;"></mk-empty>
		<el-tabs style="width:100%;height:calc(100% - 40px)" v-else class="CRF" v-model="crfid" @tab-click="handleCrfClick">
			<el-tab-pane style="height:100% " v-for="item in toFormList" :key="item.crfid" :label="item.crfname" :name="item.crfid.toString()">
				<span slot="label">
					<el-tooltip class="item" effect="dark" v-if="item.isErro" content="表单效验失败" placement="top-start">
						<span>
							<i class="el-icon-info danger"></i>
							{{ item.crfname }}
						</span>
					</el-tooltip>
					<span v-else>{{ item.crfname }}</span>
				</span>
				<el-scrollbar style="height:100%;width:100%;">
					<fm-generate-form :edit="edit" :data="item.jsonformat" :value="item.filljson" :ref="'generateForm' + item.crfid" :key="item.crfid"></fm-generate-form>
				</el-scrollbar>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import to from 'await-to-js';
export default {
	name: 'mktabscrf',
	props: {
		list: {
			type: Array,
			default: () => []
		},
		edit: {
			type: Boolean,
			default: () => true
		},
		// 是否为营销活动
		event: {
			type: Boolean,
			default: () => false
		}
	},
	data() {
		return {
			crfid: '',
			toFormList: [],
			param: {}
		};
	},
	watch: {
		edit(val) {}
	},
	methods: {
		handleCrfClick(tab) {
			this.$emit('change', tab.name);
		},
		//根据问卷id(subclassid)获取对应的表单和json信息
		CRFillJsonBysubclassid_Get(param) {
			return new Promise(resolve => {
				let url = this.event ? '/Publics/CRFMaintain/CRFillJsonBysubclassidandcrfid_Get' : '/Publics/CRFMaintain/CRFillJsonBysubclassid_Get';
				this.param = param;
				let sendData = {};
				sendData.formtype = 1;
				sendData.hospitalid = this.info.hospitalid;
				sendData.memberid = param.memberid;
				sendData.subclassid = param.subclassid;
				sendData.collectionid = param.collectionid;
				if (this.event) {
					sendData.crfid = param.eventCrfid
				}
				this.MK.Request(url, 'get', sendData).then(res => {
					if (res.code == 0) {
						this.toFormList = res.lstCRFinfo;
						this.toFormList.forEach(item => {
							this.$set(item, 'isErro', false);
						});
						if (this.toFormList.length > 0) {
							this.crfid = this.toFormList[0].crfid + '';
						}
						resolve(res);
					} else {
						this.toFormList = [];
						//内容为空时
						resolve(res);
					}
				});
			});
		},
		// CRF表单填写保存(传数组)
		saveData(list) {
			return new Promise(resolve => {
				this.MK.Request('/Publics/CRFMaintain/CRFFillArray_ADD', 'post', { lstDetail: list }).then(res => {
					if (res.code == 0) {
						this.$message({
							type: 'success',
							message: res.msg
						});
						res.list = list;
						resolve(res);
					}
				});
			});
		},
		//获取表单填写数据
		getData(collectionid) {
			return new Promise(async resolve => {
				let res = await this.isErro(collectionid);
				if (res) {
					resolve(res);
				} else {
					this.$message({
						type: 'error',
						message: '表单效验失败'
					});
					resolve(res);
				}
			});
		},
		async isErro(collectionid) {
			let CRFLIST = this.toFormList;
			let flag = []; //储存表单对应效验结果true为通过 false效验失败
			let lstDetail = [];
			for (let i = 0; i < CRFLIST.length; i++) {
				let [err, res] = await to(this.$refs[`generateForm${CRFLIST[i].crfid}`][0].getData());
				if (res) {
					flag[i] = true;
					let opt = {
						hospitalid: this.info.hospitalid,
						collectionid: collectionid,
						memberid: this.param.memberid,
						classid: CRFLIST[i].classid,
						classname: CRFLIST[i].classname,
						subclassid: CRFLIST[i].subclassid,
						subclassname: CRFLIST[i].subclassname,
						crfid: CRFLIST[i].crfid,
						crfname: CRFLIST[i].crfname,
						createid: this.info.userid,
						filljson: res.sendData
					};
					lstDetail.push(opt);
					this.setErro(CRFLIST, 'crfid', CRFLIST[i].crfid, false);
				} else {
					flag[i] = false;
					this.setErro(CRFLIST, 'crfid', CRFLIST[i].crfid, true);
				}
			}
			let isErro = flag.some(key => key == false);
			if (isErro) {
				return false;
			} else {
				return lstDetail;
			}
		},
		//设置错误标志
		setErro(list, key, id, flag) {
			list.forEach(item => {
				if (item[key] == id) {
					this.$set(item, 'isErro', flag);
				}
			});
		}
	}
};
</script>
<style scoped>
.CRF >>> .el-tabs__content {
	height: 100%;
}
>>> .el-scrollbar__wrap {
	overflow-x: hidden;
}
</style>
