<template>
  <vxe-modal
    v-model="importModal"
    title="导入"
    width="500"
    height="460"
    :show-footer="true"
  >
    <el-steps
      style="width: 300px; margin: 0 auto"
      :active="active"
      finish-status="success"
    >
      <el-step title="下载模板" @click.native="handleImportStep(0)"></el-step>
      <el-step title="导入数据" @click.native="handleImportStep(1)"></el-step>
    </el-steps>
    <template v-if="active === 0">
      <el-form
        style="width: 400px; margin: 30px auto"
        :model="templateInfo"
        :rules="rules"
        ref="importModal"
        label-width="60px"
      >
        <!-- <el-form-item label="机构" prop="schoolid">
          <el-select
            style="width: 260px"
            placeholder="按机构查询"
            :clearable="true"
            v-model="templateInfo.schoolid"
            @change="handleChangeSchool"
          >
            <el-option
              v-for="item in schoolList"
              :key="item.orgid"
              :label="item.orgname"
              :value="item.orgid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="classid">
          <el-select
            style="width: 260px"
            clearable
            :disabled="!templateInfo.schoolid"
            :placeholder="templateInfo.schoolid ? '请选择部门' : '请先选择机构'"
            v-model="templateInfo.classid"
          >
            <el-option
              v-for="item in classList"
              :key="item.orgid"
              :label="item.orgname"
              :value="item.orgid"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button
            style="width: 260px; margin-left: 0px"
            type="primary"
            icon="el-icon-download"
            @click="handleDownloadTep"
            >下载模板</el-button
          >
        </el-form-item>
      </el-form>
    </template>
    <template v-if="active === 1">
      <el-upload
        class="upload-demo"
        style="width: 380px; margin: 0 auto"
        drag
        action="#"
        :http-request="httpRequest"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          只能上传xlsx文件，且不超过2MB
        </div>
      </el-upload>
    </template>
    <div slot="footer" class="footer">
      <el-button-group>
        <el-button type="warning" @click="importModal = false">关闭</el-button>
      </el-button-group>
    </div>
  </vxe-modal>
</template>
  <script>
export default {
  name: "import-data",
  props:{
    url:'',
    parameter:{}
  },
  data() {
    return {
      active:0,
      importModal: false,
      templateInfo: {
        schoolid: "",
        classid: "",
      },
      schoolList: [],
      classList: [],
      rules:{}
    };
  },
  methods: {
    show(){
      this.importModal = true;
    },
    handleImportStep(val){
      this.active = val;
    },
    handleChangeSchool(val) {
      this.templateInfo.classid = "";
      this.classByAccount_get(val);
    },
    // 根据当前账号的学校获取班级数据
    classByAccount_get(schoolid) {
      let arr = this.info.listhospitalinfo[0].listorgan.filter((item) => {
        if (item.isdept == "1") {
          return item;
        }
      });
      this.classList = arr.filter((item) => {
        if (item.forgid == schoolid) {
          return item;
        }
      });
    },
    // 上传文件
    httpRequest(data) {
      if(this.url == ''){
        this.$message.error("请配置导入接口");
        return;
      }
      console.log(data);
      const isXlsx =
        data.file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || "application/vnd.ms-excel";
      const isLt2M = data.file.size / 1024 / 1024 < 2;
      if (!isXlsx) {
        this.$message.error("只能上传xlsx文件!");
      } else if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 2MB!");
      } else {
        // 转base64
        this.getBase64(data.file).then((resBase64) => {
          this.fileBase64 = resBase64.split(",")[1]; //直接拿到base64信息
          this.MK.Request(this.url, "post", {
            xlsxBase64String: resBase64.split(",")[1],
            ...this.parameter
          }).then((res) => {
            if (res.code == 0) {
              this.$message.success(`文件上传成功，${res.msg}`);
              this.MemberInfo_Get();
            }
          });
        });
      }
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        let fileResult = "";
        reader.readAsDataURL(file); //开始转
        reader.onload = function () {
          fileResult = reader.result;
        }; //转 失败
        reader.onerror = function (error) {
          reject(error);
        }; //转 结束  咱就 resolve 出去
        reader.onloadend = function () {
          resolve(fileResult);
        };
      });
    },
    //下载模板
    handleDownloadTep() {
      this.$refs.importModal.validate(valid => {
        if (valid) {
          this.MK.Request("/Publics/MemberManage/Portal/Template", "get", {
          }).then(res => {
            // 返回的base64转xlsx，创建a链接下载
            var raw = window.atob(res.result.xlsxBase64String);
            var uInt8Array = new Uint8Array(raw.length);
            for (var i = 0; i < raw.length; i++) {
              uInt8Array[i] = raw.charCodeAt(i);
            }
            const link = document.createElement("a");
            const blob = new Blob([uInt8Array], {
              type: "application/vnd.ms-excel"
            });
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", res.result.xlsxFileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
        }
      });
    }, 
  },
};
</script>