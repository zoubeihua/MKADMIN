<template>
	<el-drawer :visible.sync="drawer" direction="rtl" size="100%">
		<div slot="title">
			<span>{{ form.packageid ? '编辑套餐' : '新建套餐' }}</span>
			<span v-if="form.packageid">
				[
				<span style="color:red">{{ form.packagename }}</span>
				]
			</span>
		</div>
		<el-container style="background:#f5f5f5;">
			<el-main style="padding: 0">
				<div class="aside">
					<div class="left">
						<el-form :model="form" ref="form" :rules="rules" :inline="true" label-width="135px">
							<el-form-item label="套餐名称" prop="packagename"><el-input :disabled="userData.status != 0" class="input" v-model="form.packagename" placeholder="请输入套餐名称" /></el-form-item>
							<el-form-item label="套餐类型" prop="packagetype">
								<mk-select
									:disabled="userData.status != 0"
									v-model="form.packagetype"
									url="1"
									:globalFn="true"
									:clearable="false"
									:param="{ codetype: '套餐类型' }"
									:filter="['bzname']"
									:width="input"
									label="bzname"
									val="bzcode"
									@keyup.enter.native="enterEvent"
								/>
							</el-form-item>
							<el-form-item label="销售开始时间" prop="effectivedate">
								<el-date-picker
								:disabled="userData.status != 0"
									v-model="form.effectivedate"
									class="input"
									type="datetime"
									placeholder="请选择开始时间"
									format="yyyy-MM-dd HH:mm:ss"
									value-format="yyyy-MM-dd HH:mm:ss"
									@change="handleChangeDate"
								></el-date-picker>
							</el-form-item>
							<el-form-item label="销售截止时间" prop="expirationdate">
								<el-date-picker
								:disabled="userData.status != 0"
									v-model="form.expirationdate"
									class="input"
									type="datetime"
									placeholder="请选择截止时间"
									format="yyyy-MM-dd HH:mm:ss"
									value-format="yyyy-MM-dd HH:mm:ss"
								></el-date-picker>
							</el-form-item>
							<el-form-item label="套餐备注" prop>
								<el-input :disabled="userData.status != 0" v-model="form.packagenote" class="input" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="请输入内容"></el-input>
							</el-form-item>
						</el-form>
					</div>
				</div>
				<div class="appmsg_input_area">
					<d2-quill v-if="userData.status == 0" placeholder="套餐介绍" useCustomImageHandler @imageAdded="handleImageAdded" v-model="form.packageIntroduction"></d2-quill>
					<div class="transfer" v-else>
						<div v-html="form.packageIntroduction">{{ form.packageIntroduction }}</div>
					</div>
				</div>
			</el-main>
		</el-container>
		<div class="lq_drawer__footer">
			<el-button type="success" v-if="userData.status == 0" @click="handleSubmit">提 交</el-button>
			<el-button type="info" @click="close">取 消</el-button>
		</div>
	</el-drawer>
</template>

<script>
import axios from 'axios';
import util from '@/libs/util.js';
export default {
	name: 'mealMaintain',
	props: {
		userData: {
			type: Object,
			default: () => {}
		},
		method: {
			type: Function,
			default: null
		}
	},
	data() {
		return {
			operatetype: '保存',
			drawer: false,
			input: '300px',
			fileName: 'Images_RichText',
			form: {
				packagename: '', // 套餐名称
				packagetype: '', // 套餐类型
				packageamount: 0, //套餐金额
				costamount: 0, // 成本金额
				discount: 0, // 折扣金额
				originalamount: 0, // 原价金额
				effectivedate: '', // 开始时间
				expirationdate: '', // 结束时间
				packagenote: '', // 备注
				packageIntroduction: '' //介绍
			},
			rules: {
				packagename: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }],
				packagetype: [{ required: true, message: '请选择套餐类型', trigger: 'change' }],
				// packageamount: [
				//   { required: true, message: "请输入套餐金额", trigger: "blur" }
				// ],
				// costamount: [
				//   { required: true, message: "请输入成本金额", trigger: "blur" }
				// ],
				// discount: [
				//   { required: true, message: "请输入折扣金额", trigger: "blur" }
				// ],
				// originalamount: [
				//   { required: true, message: "请输入原价金额", trigger: "blur" }
				// ],
				effectivedate: [{ required: true, message: '请选择销售开始时间', trigger: 'change' }],
				expirationdate: [{ required: true, message: '请选择销售截止时间', trigger: 'change' }]
			}
		};
	},
	methods: {
		init() {
			this.$refs.form.clearValidate();
			this.$refs.form.resetFields();
			this.operatetype = '保存';
			this.form = {
				packagename: '', // 套餐名称
				packagetype: '', // 套餐类型
				packageamount: 0, //套餐金额
				costamount: 0, // 成本金额
				discount: 0, // 折扣金额
				originalamount: 0, // 原价金额
				effectivedate: '', // 开始时间
				expirationdate: '', // 结束时间
				packagenote: '', // 备注
				packageIntroduction: '' //介绍
			};
		},
		async open() {
			this.drawer = true;
		},
		close() {
			this.drawer = false;
			this.$emit('update:userdata', {});
		},
		enterEvent() {},
		handleChangeDate(val) {
			console.log(val);
		},
		handleSubmit() {
			let data = JSON.parse(JSON.stringify(this.form));
			if (this.operatetype == '保存') {
				data.packageid = '-1';
				data.orderno = '-1';
				data.status = '0';
			}
			data.enterid = this.info.userid;
			data.operatetype = this.operatetype;
			if (this.form.packageIntroduction) {
				this.$refs.form.validate(valid => {
					if (valid) {
						this.codePackageMain_Post(data);
					}
				});
			} else {
				this.$message({
					message: '请完善套餐介绍',
					type: 'warning'
				});
			}
		},
		// <<<<<<<<<<Api>>>>>>>>>>
		// 套餐维护
		codePackageMain_Post(data) {
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

		// <<<<<<<<<<Api>>>>>>>>>>
		//编辑器上传图片
		handleImageAdded(file, Editor, cursorLocation, resetUploader) {
			this.Editor = Editor;
			this.cursorLocation = cursorLocation;
			this.resetUploader = resetUploader;
			this.imageDeal(file, this.EditorUplaod);
		},
		EditorUplaod(base64) {
			// this.Editor.insertEmbed(this.cursorLocation, "image", base64);
			let base64Str = base64.replace('data:image/jpeg;base64,', '');
			this.resetUploader();
			this.MK.Request("/Publics/Common/UpLoadImags", "post", {
        base64Arr: [base64Str],
        fileName: this.fileName
      })
        .then(response => {
          console.log(response);
          let data = response.data;
          var path = "";
          data.forEach(key => {
            path = key;
          });
          let url = this.publicUrl + "/" + this.fileName + "/" + path;
          this.Editor.insertEmbed(this.cursorLocation, "image", url);
          this.resetUploader();
        })
        .catch(error => {
          console.log(error);
        });
		},
		compress(base64, bili, callback) {
			let _this = this;
			console.log('执行缩放程序,bili=' + bili);
			//处理缩放，转格式
			let _img = new Image();
			_img.src = base64;
			_img.onload = function() {
				let _canvas = document.createElement('canvas');
				let w = this.width / bili;
				let h = this.height / bili;
				_canvas.setAttribute('width', w);
				_canvas.setAttribute('height', h);
				_canvas.getContext('2d').drawImage(this, 0, 0, w, h);
				let base64 = _canvas.toDataURL('image/jpeg');
				_canvas.toBlob(function(blob) {
					console.log('执行缩放后,base64=' + base64.length);
					if (blob.size > 1024 * 100) {
						_this.compress(base64, bili, callback);
					} else {
						callback(base64, blob);
					}
				}, 'image/jpeg');
			};
		},
		imageDeal(file, returnBase64) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				let base64 = reader.result;
				let bili = 2;
				this.compress(base64, bili, returnBase64);
			};
		}
	},
	watch: {
		userData: {
			deep: true,
			handler(val) {
				this.form = val;
				this.form.packagetype = val.packagetype.toString();
			}
		},
		drawer(val) {
			if (!val) {
				this.$emit('update:userdata', {});
			}
		}
	}
};
</script>

<style scoped>
>>> .el-drawer__header {
	margin: 0 !important;
	padding: 5px 20px !important;
	background: #8ddba5;
	color: white;
}
>>> .el-textarea__inner::-webkit-input-placeholder {
	/* WebKit browsers 适配谷歌 */
	color: #c2c2c2;
}

>>> .el-textarea__inner:-moz-placeholder {
	/* Mozilla Firefox 4 to 18 适配火狐 */
	color: #c2c2c2;
}

>>> .el-textarea__inner::-moz-placeholder {
	/* Mozilla Firefox 19+ 适配火狐 */
	color: #c2c2c2;
}

>>> .el-textarea__inner:-ms-input-placeholder {
	/* Internet Explorer 10+  适配ie*/
	color: #c2c2c2;
}
>>> .quillWrapperS .ql-container {
	width: 68% !important;
	margin-left: 30% !important;
}
.lq_drawer__footer {
	position: fixed;
	bottom: 10px;
	width: 100%;
	text-align: center;
}
.input {
	width: 300px;
}
.aside {
	position: fixed;
	margin-top: 44px;
	box-sizing: content-box;
	padding: 18px 2%;
	height: calc(100vh - 160px);
	width: 26%;
}
.left {
	padding: 10px;
	width: 100%;
	height: 100%;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	background: #fff;
	border-radius: 20px;
}
.transfer {
	position: fixed;
	left: calc(32%);;
	margin-top: 60px;
	box-sizing: content-box;
	padding: 18px 2%;
	height: calc(100vh - 200px);
	width: 60%;
	background-color: #FFFFFF;
}
</style>
