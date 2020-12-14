<template>
  <!-- 各类信息介绍模块 -->
  <el-drawer :visible.sync="drawer" :direction="direction" size="100%">
    <!-- 头部信息 -->
    <div slot="title">
      {{ introData.category }}介绍 - [
      <span style="color: red;">{{ introData.name }}</span>
      ]
    </div>
    <el-container style="background:#f5f5f5;">
      <el-main style="padding: 0">
        <div class="aside">
          <div class="left">
            <el-form :model="infoData" ref="info" label-width="80px">
              <el-form-item label="介绍标题">
                <el-input clearable v-model="infoData.title" placeholder="请输入介绍标题" />
              </el-form-item>
              <el-form-item :label="introData.category + '照片'">
                <img-upload
                  @isShowComponent="isShowComponent"
                  :is-delete="true"
                  :width="160"
                  :height="160"
                  :limit="1"
                  :value="picUrl"
                  @input="handlePic"
                  :uploadByCamera="true"
                ></img-upload>
              </el-form-item>
              <el-form-item v-if="introData.category != '人员'" :label="introData.category + '地址'">
                <el-input
                  type="textarea"
                  v-model="infoData.address"
                  :placeholder="'请输入' + introData.category + '地址'"
                />
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input clearable v-model="infoData.mobile" placeholder="请输入联系电话" />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div v-if="isShow">
          <d2-quill
            :placeholder="placeholder"
            useCustomImageHandler
            @imageAdded="handleImageAdded"
            v-model="infoData.richtext"
          ></d2-quill>
        </div>
      </el-main>
    </el-container>
    <div v-if="isShow" class="lq_drawer__footer">
      <el-button type="success" @click="handleSubmit">提 交</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import axios from "axios";
import util from "@/libs/util.js";
import imgUpload from "@/components/mk-form/Upload/index.vue";
export default {
  props: {
    introData: {
      type: Object,
      default: () => {}
    },
    direction: {
      type: String,
      default: "rtl"
    },
    placeholder: {
      type: String,
      default: "信息介绍"
    }
  },
  data() {
    return {
      drawer: false,
      isShow: true,
      picUrl: [],
      infoData: {
        title: "",
        picture: "",
        address: "",
        mobile: "",
        richtext: ""
      },
		fileName:'Images_INTRO'
    };
  },
  components: {
    imgUpload
  },
  methods: {
    // 打开抽屉
    async open() {
      this.drawer = true;
    },
    // 关闭抽屉
    close() {
      this.drawer = false;
      this.infoData = {
        title: "",
        picture: "",
        address: "",
        mobile: "",
        richtext: ""
      };
    },
    isShowComponent(val) {
      this.isShow = val;
    },
    // 提交
    handleSubmit() {
      let data = {};
      data.category = this.introData.category;
      data.introid = this.introData.introid;
      data.introinfo = this.infoData;
      console.log(data);
      this.introInfo_Post(data);
    },
    // 维护介绍信息
    introInfo_Post(data) {
      this.MK.Request("/Publics/Common/Dic/IntroInfo", "post", data).then(
        res => {
          this.$message.success(res.msg);
          this.drawer = false;
        }
      );
    },
    // 查询介绍信息
    introInfo_Get() {
      const data = {
        category: this.introData.category,
        introid: this.introData.introid
      };
      this.MK.Request("/Publics/Common/Dic/IntroInfo", "get", data).then(
        res => {
          this.infoData = res.data[0] ? JSON.parse(res.data[0].introinfo) : {};
          this.picUrl = this.infoData.picture
            ? this.infoData.picture.split(",").map(item => ({ url: item }))
            : [];
          console.log("ooooooojjjbbbvbvbvbvbvbvbvbvbv");
          console.log(this.picUrl);
          console.log(this.infoData.picture);
        }
      );
    },
    // 照片提交
    handlePic(data) {
      if (data[0]) {
        this.infoData.picture = data[0].url;
      } else {
        this.infoData.picture = "";
      }
    },
    //编辑器上传图片
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      this.Editor = Editor;
      this.cursorLocation = cursorLocation;
      this.resetUploader = resetUploader;
      this.imageDeal(file, this.EditorUplaod);
    },
    EditorUplaod(base64) {
      let base64Str = base64.replace("data:image/jpeg;base64,", "");
      this.resetUploader();
      // axios
      // 	.post('/Publics/Common/UpLoadImags', {
      // 		base64Arr: [base64Str],
      // 		fileName: this.fileName
      // 	})
      // 	.then(response => {
      // 		let data = response.data.result.data;
      // 		var path = '';
      // 		data.forEach(key => {
      // 			path = key;
      // 		});
      // 		let url = this.publicUrl  + '/' + this.fileName + '/' + path;
      // 		this.Editor.insertEmbed(this.cursorLocation, 'image', url);
      // 		this.resetUploader();
      // 	})
      // 	.catch(error => {
      // 		console.log(error);
      // 	});
      // -------------
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
      console.log("执行缩放程序,bili=" + bili);
      //处理缩放，转格式
      let _img = new Image();
      _img.src = base64;
      _img.onload = function() {
        let _canvas = document.createElement("canvas");
        let w = this.width / bili;
        let h = this.height / bili;
        _canvas.setAttribute("width", w);
        _canvas.setAttribute("height", h);
        _canvas.getContext("2d").drawImage(this, 0, 0, w, h);
        let base64 = _canvas.toDataURL("image/jpeg");
        _canvas.toBlob(function(blob) {
          console.log("执行缩放后,base64=" + base64.length);
          if (blob.size > 1024 * 100) {
            _this.compress(base64, bili, callback);
          } else {
            callback(base64, blob);
          }
        }, "image/jpeg");
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
    drawer(val) {
      if (!val) {
        this.$emit("update:introdata", {});
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
  position: relative;
}
.lq_drawer__footer {
  position: absolute;
  bottom: 10px;
  width: 100%;
  text-align: center;
  background-color: #f5f5f5;
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
</style>
