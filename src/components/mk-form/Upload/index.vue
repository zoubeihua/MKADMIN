<template>
	<div
		class="fm-uplaod-container"
		:style="{ display: uploadByCamera && limit == 1 ? 'flex' : 'inherit', flexDirection: uploadByCamera && limit == 1 ? 'column' : '' }"
		:id="uploadId"
	>
		<draggable class="drag-img-list" v-model="fileList" v-bind="{ group: uploadId, ghostClass: 'ghost', animation: 200 }" :no-transition-on-drag="true">
			<div
				:id="item.key"
				:style="{ width: width + 'px', height: height + 'px' }"
				:class="{ uploading: item.status == 'uploading', 'is-success': item.status == 'success', 'is-diabled': disabled }"
				:imgStyle="imgStyle"
				class="upload-file"
				v-for="item in fileList"
				:key="item.url"
			>
				<img :src="item.url" />

				<el-progress v-if="item.status == 'uploading'" :width="miniWidth * 0.9" class="upload-progress" type="circle" :percentage="item.percent"></el-progress>

				<label class="item-status" v-if="item.status == 'success'"><i class="el-icon-upload-success el-icon-check"></i></label>

				<div class="uplaod-action" :style="{ height: miniWidth / 4 + 'px' }" v-if="!disabled">
					<i class="iconfont icon-tupianyulan" title="预览" @click="handlePreviewFile(item.key)" :style="{ 'font-size': miniWidth / 8 + 'px' }"></i>
					<i v-if="isEdit" class="iconfont icon-sync1" title="替换" @click="handleEdit(item.key)" :style="{ 'font-size': miniWidth / 8 + 'px' }"></i>
					<i v-if="isDelete && fileList.length > min" class="iconfont icon-delete" title="删除" @click="handleRemove(item.key)" :style="{ 'font-size': miniWidth / 8 + 'px' }"></i>
				</div>
			</div>
		</draggable>

		<div
			class="el-upload el-upload--picture-card"
			:class="{ 'is-disabled': disabled }"
			v-show="(!isQiniu || (isQiniu && token)) && fileList.length < limit"
			:style="{ width: width + 'px', height: height + 'px' }"
			@click.self="handleAdd"
			v-if="!readonly"
		>
			<i class="el-icon-plus" @click.self="handleAdd" :style="{ fontSize: miniWidth / 4 + 'px', marginTop: -miniWidth / 8 + 'px', marginLeft: -miniWidth / 8 + 'px' }"></i>
			<input
				accept="image/*"
				v-if="multiple"
				multiple
				ref="uploadInput"
				@change="handleChange"
				type="file"
				:style="{ width: 0, height: 0 }"
				name="file"
				class="el-upload__input upload-input"
			/>
			<input accept="image/*" v-else ref="uploadInput" @change="handleChange" type="file" :style="{ width: 0, height: 0 }" name="file" class="el-upload__input upload-input" />
		</div>
		<!-- 设置 uploadByCamera 为true 可打开系统摄像头模块 通过拍照上传图片 -->
		<el-button type="primary" v-if="uploadByCamera && fileList.length < limit" :style="{ width: width + 'px', marginTop: 5 + 'px' }" @click="handleOpenModal">拍照上传</el-button>
		<!-- 摄像头 -->
		<vxe-modal v-model="cameraModal" title="" width="640" height="720">
			<div slot="title">
				<el-link :underline="false">摄像头</el-link>
				<el-link href="http://wechat.mu-kang.com:5183/update_Data/读卡服务.exe" target="_blank" icon="el-icon-download" type="primary" v-if="isLocalDrive">驱动下载</el-link>
			</div>
			<div style="width:600px;height:600px;">
				<div>
					<el-button v-if="!isLocalDrive" :type="cameraStatus == 0 ? 'primary' : 'danger'" @click="handleCamera">{{ cameraStatus == 0 ? '开启摄像头' : '关闭摄像头' }}</el-button>
					<el-button type="success" @click="handleTakePhoto" v-if="cameraStatus == 1">拍照</el-button>
				</div>
				<div style="width:600px;display:flex;justify-content:space-between;">
					<video id="myVideo" autoplay="autoplay" v-show="mediaStreamTrack" width="100%" height="600"></video>
					<!-- <canvas id="canvas" width="600px" height="160px" v-if="!cameraStatus == 0"></canvas> -->
					<canvas id="canvas" width="600px" height="600px" v-show="false"></canvas>
				</div>
			</div>
			<!-- <el-button
        v-if="!cameraStatus == 0"
        style="position: relative; bottom: -30px; left:42%"
        type="primary"
        @click="handleComfirmPhoto"
      >确认</el-button>-->
		</vxe-modal>
		<vxe-modal v-model="cutImgModel" title="图片裁剪" width="810" height="600">
			<mkCropper
				v-model="cutImgModel"
				ref="imgCutterModal"
				label="裁剪本地图片"
				:crossOrigin="true"
				crossOriginHeader="*"
				rate
				toolBgc="none"
				:isModal="false"
				:showChooseBtn="false"
				:lockScroll="true"
				:boxWidth="775"
				:boxHeight="458"
				:cutWidth="cutWidth"
				:cutHeight="cutHeight"
				:sizeChange="true"
				:moveAble="true"
				:originalGraph="true"
				@close="cutClose"
				@cutDown="cutDown"
			></mkCropper>
		</vxe-modal>
	</div>
</template>

<script>
import Viewer from 'viewerjs';
import Draggable from 'vuedraggable';
import MD5 from '@/libs/util.md5.js';
import * as qiniu from 'qiniu-js';
import axios from 'axios';
import { string } from 'clipboard';
import mkCropper from '../mk-cropper/index';
require('viewerjs/dist/viewer.css');
export default {
	components: {
		Draggable,
		mkCropper
	},
	props: {
		value: {
			type: Array,
			default: () => []
		},
		width: {
			type: Number,
			default: 100
		},
		height: {
			type: Number,
			default: 100
		},
		token: {
			type: String,
			default: ''
		},
		domain: {
			type: String,
			default: ''
		},
		multiple: {
			type: Boolean,
			default: false
		},
		limit: {
			type: Number,
			default: 9
		},
		isQiniu: {
			type: Boolean,
			default: false
		},
		isDelete: {
			type: Boolean,
			default: false
		},
		min: {
			type: Number,
			default: 0
		},
		meitu: {
			type: Boolean,
			default: false
		},
		isEdit: {
			type: Boolean,
			default: false
		},
		action: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		readonly: {
			type: Boolean,
			default: false
		},
		imgStyle: {
			type: String,
			default: ''
		},
		isEmpty: {
			type: Boolean,
			default: false
		},
		uploadByCamera: {
			type: Boolean,
			default: false
		},
		cutWidth: {
			type: Number,
			default: 300
		},
		cutHeight:{
			type: Number,
			default: 250
		},
	},
	data() {
		return {
			// cutWidth: 300,
			// cutHeight: 250,
			cutImgModel: false,
			UploadClass: 'Images_MemberCertificate',
			fileList: this.value.map(item => {
				return {
					...item,
					key: item.key ? item.key : (new Date().getTime() + '').MD5().toUpperCase()
				};
			}),
			viewer: null,
			uploadId: 'upload_' + new Date().getTime(),
			editIndex: -1,
			meituIndex: -1,
			cameraModal: false,
			cameraStatus: 0,
			mediaStreamTrack: null, //视频对象
			base64codeFromCamera: '',
			fromCamera: false,
			imgBase64arr: []
		};
	},
	computed: {
		miniWidth() {
			if (this.width > this.height) {
				return this.height;
			} else {
				return this.width;
			}
		}
	},
	methods: {
		compress(base64, bili, file, key, callback) {
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
					if (blob.size > 1024 * 1024) {
						this.compress(base64, bili, file, key, callback);
					} else {
						callback(base64, blob, key);
					}
				}, 'image/jpeg');
			};
		},
		handleChange() {
			let _this = this;
			this.imageDeal((res, file, key) => {
				// this.uplaodAction(res, file, key);
				this.fromCamera = true;
				var image = new Image();
				image.src = res;
				image.onload = function() {
					var width = image.width;
					var height = image.height;
					_this.cutImgModel = true;
					_this.$nextTick(() => {
						_this.$refs.imgCutterModal.handleOpen({
							name: 'img.png',
							src: res,
							width: width,
							height: height
						});
					});
				};
				// console.log(res, file, key)
			});
		},
		imageDeal(returnBase64) {
			const files = this.$refs.uploadInput.files;
			console.log(this.$refs.uploadInput.files);
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const reader = new FileReader();
				const key = (new Date().getTime() + '').MD5().toUpperCase();
				reader.readAsDataURL(file);
				reader.onload = () => {
					let base64 = reader.result;
					let bili = 2;
					console.log('压缩前：' + base64.length);
					// if (this.editIndex >= 0) {
					//   this.$set(this.fileList, this.editIndex, {
					//     key,
					//     url: reader.result,
					//     percent: 0,
					//     status: "uploading"
					//   });

					//   this.editIndex = -1;
					// } else {
					//   this.fileList.push({
					//     key,
					//     url: reader.result,
					//     percent: 0,
					//     status: "uploading"
					//   });
					// }

					this.$nextTick(() => {
						if (this.isQiniu) {
							this.uplaodAction2(reader.result, file, key);
						} else {
							this.compress(base64, bili, file, key, returnBase64);
							// this.uplaodAction(reader.result, file, key);
						}
					});
				};
			}
			this.$refs.uploadInput.value = [];
		},
		uplaodAction(res, file, key) {
			let base64Str = this.fromCamera ? res.replace('data:image/png;base64,', '') : res.replace('data:image/jpeg;base64,', '');
			 //let changeIndex = this.fileList.findIndex(item => item.key === key);
			// axios({
			// 	method: 'post',
			// 	url: '/Publics/Common/UpLoadImags',
			// 	data: {
			// 		base64Arr: [base64Str],
			// 		fileName: this.imgStyle == '1' ? this.UploadClass : 'Images_MemberPhoto'
			// 	}
			// })
				this.MK.Request('/Publics/Common/UpLoadImags', 'post', {
					base64Arr: [base64Str],
					fileName: this.imgStyle == '1' ? this.UploadClass : 'Images_MemberPhoto'
				}).then(response => {
					let data = response.data;
					var path = '';
					data.forEach(key => {
						path = key;
					});
					let uplaodPath = this.imgStyle == '1' ? this.UploadClass : 'Images_MemberPhoto';
					let url = this.publicUrl + '/' + uplaodPath + '/' + path;
					if (this.limit == 1) {
						this.$set(this.fileList, 0, {
							...this.fileList[0],
							url: url,
							percent: 100
						});
					} else {
						this.$set(this.fileList, this.fileList.findIndex(item => item.key === key), {
							...this.fileList[this.fileList.findIndex(item => item.key === key)],
							url: url,
							percent: 100
						});
					}
					setTimeout(() => {
						if (this.limit == 1) {
							this.$set(this.fileList, 0, {
								...this.fileList[0],
								status: 'success'
							});
						} else {
							this.$set(this.fileList, this.fileList.findIndex(item => item.key === key), {
								...this.fileList[this.fileList.findIndex(item => item.key === key)],
								status: 'success'
							});
						}
						this.$emit('input', this.fileList);
					}, 200);
				})
				.catch(error => {
					this.$set(this.fileList, this.fileList.findIndex(item => item.key === key), {
						...this.fileList[this.fileList.findIndex(item => item.key === key)],
						status: 'error'
					});
					this.fileList.splice(this.fileList.findIndex(item => item.key === key), 1);
				});
			return;

			// console.log(this.fileList.findIndex(item => item.key === key));
			// this.$set(
			//   this.fileList,
			//   this.fileList.findIndex(item => item.key === key),
			//   {
			//     ...this.fileList[this.fileList.findIndex(item => item.key === key)],
			//     url: res,
			//     percent: 100
			//   }
			// );
			// setTimeout(() => {
			//   this.$set(
			//     this.fileList,
			//     this.fileList.findIndex(item => item.key === key),
			//     {
			//       ...this.fileList[this.fileList.findIndex(item => item.key === key)],
			//       status: "success"
			//     }
			//   );
			//   this.$emit("input", this.fileList);
			// }, 200);
			// return;

			return;
			axios({
				url: '/Publics/Common/UpLoadImags',
				method: 'post',
				onUploadProgress: function(progressEvent) {
					//原生获取上传进度的事件
					console.log('progress', progressEvent);
					if (progressEvent.lengthComputable) {
						//属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
						//如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
					}
				},
				data: {
					base64Arr: [base64Str],
					fileName: 'InformedConsent'
				}
			})
				.then(response => {
					let data = response.data.data;
					var path = '';
					data.forEach(key => {
						path = key;
						// let index = key.lastIndexOf("Images_Data");
						// path = key.substring(index, key.length);
					});
					let url = this.publicUrl + path;
					this.$set(this.fileList, this.fileList.findIndex(item => item.key === key), {
						...this.fileList[this.fileList.findIndex(item => item.key === key)],
						url: url,
						percent: 100
					});
					setTimeout(() => {
						this.$set(this.fileList, this.fileList.findIndex(item => item.key === key), {
							...this.fileList[this.fileList.findIndex(item => item.key === key)],
							status: 'success'
						});
						this.$emit('input', this.fileList);
					}, 200);
				})
				.catch(error => {
					this.$set(this.fileList, this.fileList.findIndex(item => item.key === key), {
						...this.fileList[this.fileList.findIndex(item => item.key === key)],
						status: 'error'
					});
					this.fileList.splice(this.fileList.findIndex(item => item.key === key), 1);
				});
		},
		uplaodAction2(res, file, key) {
			const _this = this;
			const observable = qiniu.upload(
				file,
				key,
				this.token,
				{
					fname: key,
					mimeType: []
				},
				{
					useCdnDomain: true,
					region: qiniu.region.z2
				}
			);
			observable.subscribe({
				next(res) {
					_this.$set(_this.fileList[_this.fileList.findIndex(item => item.key === key)], 'percent', parseInt(res.total.percent));
				},
				error(err) {
					_this.$set(_this.fileList, _this.fileList.findIndex(item => item.key === key), {
						..._this.fileList[_this.fileList.findIndex(item => item.key === key)],
						status: 'error'
					});
					_this.fileList.splice(_this.fileList.findIndex(item => item.key === key), 1);
				},
				complete(res) {
					_this.$set(_this.fileList, _this.fileList.findIndex(item => item.key === key), {
						..._this.fileList[_this.fileList.findIndex(item => item.key === key)],
						url: _this.domain + res.key,
						percent: 100,
						...res
					});
					setTimeout(() => {
						_this.$set(_this.fileList, _this.fileList.findIndex(item => item.key === key), {
							..._this.fileList[_this.fileList.findIndex(item => item.key === key)],
							status: 'success'
						});
						_this.$emit('input', _this.fileList);
					}, 200);
				}
			});
		},
		handleRemove(key) {
			this.fileList.splice(this.fileList.findIndex(item => item.key === key), 1);
			this.$nextTick(() => {
				this.$emit('input', this.fileList);
			});
		},
		handleEdit(key) {
			this.editIndex = this.fileList.findIndex(item => item.key === key);

			this.$refs.uploadInput.click();
		},
		handleMeitu(key) {
			this.$emit('on-meitu', this.fileList.findIndex(item => item.key === key));
		},
		handleAdd() {
			if (!this.disabled) {
				this.editIndex = -1;
				this.$refs.uploadInput.click();
			}
		},
		handlePreviewFile(key) {
			this.viewer && this.viewer.destroy();
			this.uploadId = 'upload_' + new Date().getTime();

			console.log(this.viewer);
			this.$nextTick(() => {
				this.viewer = new Viewer(document.getElementById(this.uploadId));
				this.viewer.view(this.fileList.findIndex(item => item.key === key));
			});
		},
		handleOpenModal() {
			if (this.isLocalDrive) {
				this.CaptureImage();
			}
		},
		handleCamera() {
			if (this.isLocalDrive) {
				this.CaptureImage();
			} else {
				if (this.cameraStatus == 0) {
					this.cameraStatus = 1;
					let constraints = {
						video: {
							width: 600,
							height: 600
						},
						audio: true
					};
					//获得video摄像头
					let video = document.getElementById('myVideo');
					let promise = navigator.mediaDevices.getUserMedia(constraints);
					promise.then(mediaStream => {
						this.mediaStreamTrack = typeof mediaStream.stop === 'function' ? mediaStream : mediaStream.getTracks()[1];
						video.srcObject = mediaStream;
						video.play();
					});
				} else {
					this.cameraStatus = 0;
					this.mediaStreamTrack.stop();
					this.mediaStreamTrack = null;
				}
			}
		},
		//
		CaptureImage() {
			let _this = this;
			_this.fromCamera = true;
			axios
				.get(this.capImgURL, {
					timeout: 99999999999
				})
				.then(response => {
					let res = response.data;
					if (res.code == 0) {
						let newImg = new Image();
						newImg.src = 'data:image/png;base64,' + res.result.data.ImageBase64;
						newImg.onload = function() {
							let width = newImg.width;
							let height = newImg.height;
							console.log(width, height);
							_this.cutImgModel = true;
							_this.$nextTick(() => {
								_this.$refs.imgCutterModal.handleOpen({
									name: 'img.png',
									src: newImg.src,
									width: width,
									height: height
								});
							});
						};
					}
				})
				.catch(error => {
					this.$alert('请检查服务驱动是否开启', '提示', {
						confirmButtonText: '确定',
						callback: action => {
							this.cameraModal = true;
						}
					});
				});
		},
		handleTakePhoto() {
			let video = document.getElementById('myVideo');
			let canvas = document.getElementById('canvas');
			let ctx = canvas.getContext('2d');
			ctx.drawImage(video, 0, 0, 600, 600);
			// toDataURL  ---  可传入'image/png'---默认, 'image/jpeg'
			let img = document.getElementById('canvas').toDataURL();
			// 这里的img就是得到的图片
			this.base64codeFromCamera = img;
			console.log(img);
			this.cutImgModel = true;
			this.$nextTick(() => {
				this.$refs.imgCutterModal.handleOpen({
					name: '1.png',
					src: img,
					width: 600,
					height: 600
				});
			});
			this.fromCamera = true;

			// console.log("img-----", img);
		},
		//取消回调
		cutClose() {
			this.cutImgModel = false;
			this.cameraStatus = 0;
			this.mediaStreamTrack && this.mediaStreamTrack.stop();
			this.mediaStreamTrack = null;
			this.cameraModal = false;
		},
		//裁剪完图片回调
		cutDown(opt) {
			var res, file;
			let key = (new Date().getTime() + '').MD5().toUpperCase();
			res = opt.dataURL;
			this.uplaodAction(res, file, key);
			this.mediaStreamTrack && this.mediaStreamTrack.stop();
			this.mediaStreamTrack = null;
			this.cameraStatus = 0;
			this.cameraModal = false;
		},
		handleComfirmPhoto() {
			var res, file;
			let key = (new Date().getTime() + '').MD5().toUpperCase();
			res = this.base64codeFromCamera;
			this.uplaodAction(res, file, key);
			this.mediaStreamTrack.stop();
			this.cameraStatus = 0;
			this.cameraModal = false;
		}
	},
	watch: {
		value(val) {
			this.fileList = this.value.map(item => {
				return {
					...item,
					key: item.key ? item.key : (new Date().getTime() + '').MD5().toUpperCase()
				};
			});
		},
		isEmpty(val) {
			if (val) {
				this.fileList = [];
			}
		},
		cameraModal(val) {
			if (!val) {
				this.mediaStreamTrack && this.mediaStreamTrack.stop();
				this.mediaStreamTrack = null;
				this.cameraStatus = 0;
				this.fromCamera = false;
			}
		},
		// 富文本层级太高会覆盖裁剪，加了一个显示隐藏组件的判断
		cutImgModel(val) {
			if (val) {
				this.$emit('isShowComponent', false);
			} else {
				this.$emit('isShowComponent', true);
			}
		},
		cameraModal(val) {
			if (val) {
				this.$emit('isShowComponent', false);
			} else {
				this.$emit('isShowComponent', true);
			}
		}
	}
};
</script>

<style lang="scss">
.fm-uplaod-container {
	.is-disabled {
		position: relative;

		&::after {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			// background: rgba(0,0,0,.1);
			content: '';
			display: block;
			cursor: not-allowed;
		}
	}

	.upload-file {
		margin: 0 10px 0px 0;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		// background: #fff;
		overflow: hidden;
		background-color: #fff;
		border: 1px solid #c0ccda;
		border-radius: 6px;
		box-sizing: border-box;
		position: relative;
		vertical-align: top;

		&:hover {
			.uplaod-action {
				display: flex;
			}
		}

		.uplaod-action {
			position: absolute;
			// top: 0;
			// height: 30px;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba(0, 0, 0, 0.6);
			display: none;
			justify-content: center;
			align-items: center;

			i {
				color: #fff;
				cursor: pointer;
				margin: 0 5px;
			}
		}

		&.is-success {
			.item-status {
				position: absolute;
				right: -15px;
				top: -6px;
				width: 40px;
				height: 24px;
				background: #13ce66;
				text-align: center;
				transform: rotate(45deg);
				box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);

				& > i {
					font-size: 12px;
					margin-top: 11px;
					color: #fff;
					transform: rotate(-45deg);
				}
			}
		}

		&.uploading {
			&:before {
				display: block;
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: rgba(0, 0, 0, 0.3);
			}
		}

		.upload-progress {
			position: absolute;

			.el-progress__text {
				color: #fff;
				font-size: 16px !important;
			}
		}

		img {
			max-width: 100%;
			max-height: 100%;
			vertical-align: middle;
		}
	}

	.el-upload--picture-card {
		position: relative;
		overflow: hidden;

		.el-icon-plus {
			position: absolute;
			top: 50%;
			left: 50%;
		}
	}

	.upload-input {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: block;
		opacity: 0;
		cursor: pointer;
	}

	.drag-img-list {
		display: inline;

		.ghost {
			position: relative;

			&::after {
				width: 100%;
				height: 100%;
				display: block;
				content: '';
				background: #fbfdff;
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				border: 1px dashed #3bb3c2;
			}
		}

		& > div {
			cursor: move;
		}
	}
}

.viewer-container {
	z-index: 9999 !important;
}
</style>
