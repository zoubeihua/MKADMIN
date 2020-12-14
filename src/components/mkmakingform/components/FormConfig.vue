<template>
	<div class="form-config-container">
		<el-form label-position="top" size="small">
			<el-form-item label="页眉 (PC 894*250 | M 750*500)">
				<div>
					<el-input v-model="data.headerImg" clearable></el-input>
				</div>
				<div>
					<p>上传</p>
					<el-upload ref="upload_img_headerImg" class="avatar-uploader" action="" :show-file-list="false" :http-request="(res) => {uploadSectionFile(res,'headerImg')}">
						<img v-if="headerImg" :src="headerImg" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</div>

			</el-form-item>
			<el-form-item label="页脚 (PC 894*250 | M 750*500)">
				<div>
					<el-input v-model="data.footerImg" clearable></el-input>
				</div>
				<div>
					<p>上传</p>
					<el-upload ref="upload_img_footerImg" class="avatar-uploader" action="" :show-file-list="false" :http-request="(res) => {uploadSectionFile(res,'footerImg')}">
						<img v-if="footerImg" :src="footerImg" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</div>

			</el-form-item>
			<el-form-item label="标签对齐方式">
				<el-radio-group v-model="data.labelPosition">
					<el-radio-button label="left">左对齐</el-radio-button>
					<el-radio-button label="right">右对齐</el-radio-button>
					<el-radio-button label="top">顶部对齐</el-radio-button>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="表单标签宽度">
				<el-input-number v-model="data.labelWidth" :min="0" :max="200" :step="10"></el-input-number>
			</el-form-item>

			<el-form-item label="组件尺寸">
				<el-radio-group v-model="data.size">
					<el-radio-button label="medium">medium</el-radio-button>
					<el-radio-button label="small">small</el-radio-button>
					<el-radio-button label="mini">mini</el-radio-button>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="自定义Class">
				<el-input v-model="data.customClass" clearable></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		props: ['data'],
		data() {
			return {
				footerImg: this.data.footerImg,
				headerImg: this.data.headerImg
			}
		},
		watch:{
			footerImg(val){
				this.$emit('update:data.footerImg',val);
			},
			'data.footerImg'(val){
				this.footerImg = val;
			},
			headerImg(val){
				this.$emit('update:data.headerImg',val);
			},
			'data.headerImg'(val){
				this.headerImg = val;
			}
		},
		methods: {
			uploadSectionFile: function(params, type) {
				// 自定义上传方法
				// console.log(params);
				var that = this,
					file = params.file, //获取上传的文件
					fileType = file.type, //获取文件类型
					isImage = fileType.indexOf('image') != -1; // 判断是否是图片类型


				if (!isImage) { // 文件格式
					alert("请选择图片文件！");
					that.$refs.upload_img_[type].uploadFiles = []; //不符合就清空已选择的图片
					return;
				}
				if (isImage) {
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = (async (res) => {
						let Base64 = res.target.result
						let base64Arr = ''
						//压缩
						let dealBase64 = await this.dealImage(Base64, 750)
						if (dealBase64.includes('data:image/png;base64,')) {
							base64Arr = dealBase64.replace('data:image/png;base64,', '')
						} else {
							base64Arr = dealBase64.replace('data:image/jpeg;base64,', '')
						}
						let result = await this.uploadFile(base64Arr);
						if (result.code == 0) {
							let file = result.data[0];
							let url = this.publicUrl + '/CRFBG/' + file;
							if (type == 'footerImg') {
								this.footerImg = url;
								this.data.footerImg = url;
							} else {
								this.headerImg = url;
								this.data.headerImg = url;
							}
						}
					})

				}
			},
			uploadFile(base64Arr) {
				return this.MK.Request('/Publics/Common/UpLoadImags', 'post', {
					base64Arr: [base64Arr],
					fileName: 'CRFBG'
				})
			},
			dealImage(base64, w) {
				return new Promise((resolve, reject) => {
					var newImage = new Image();
					var quality = 0.6; //压缩系数0-1之间
					newImage.src = base64;
					newImage.setAttribute("crossOrigin", 'Anonymous'); //url为外域时需要
					var imgWidth, imgHeight;
					newImage.onload = function() {
						imgWidth = this.width;
						imgHeight = this.height;
						var canvas = document.createElement("canvas");
						var ctx = canvas.getContext("2d");
						if (Math.max(imgWidth, imgHeight) > w) {
							if (imgWidth > imgHeight) {
								canvas.width = w;
								canvas.height = w * imgHeight / imgWidth;
							} else {
								canvas.height = w;
								canvas.width = w * imgWidth / imgHeight;
							}
						} else {
							canvas.width = imgWidth;
							canvas.height = imgHeight;
							quality = 0.6;
						}
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
						var base64 = canvas.toDataURL("image/jpeg", quality); //压缩语句
						// 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
						// while (base64.length / 1024 > 150) {
						// 	quality -= 0.01;
						// 	base64 = canvas.toDataURL("image/jpeg", quality);
						// }
						// 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
						// while (base64.length / 1024 < 50) {
						// 	quality += 0.001;
						// 	base64 = canvas.toDataURL("image/jpeg", quality);
						// }
						resolve(base64); //必须通过回调函数返回，否则无法及时拿到该值
					}
				})

			}
		}
	}
</script>
<style scoped>
	::v-deep .avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	::v-deep .avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>
