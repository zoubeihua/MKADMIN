<template>
  <el-drawer
    :visible.sync="newActivityModal"
    :append-to-body="true"
    direction="rtl"
    size="100%"
    ref="drawer"
    :before-close="close"
  >
    <div slot="title">
      <span>营销活动维护</span>
    </div>
    <!-- ----------------------步骤条------------------ -->
    <el-steps :active="active">
      <!-- <el-step title="基本信息" icon="el-icon-edit" @click.native="(active=0)"></el-step> -->
      <!-- <el-step title="活动内容" @click.native="nextStep('newActivityForm')"></el-step> -->
    </el-steps>
    <!-- ----------------------第一步骤------------------ -->
    <template v-if="active == 1">
      <el-container>
        <el-form
          :model="newActivityForm"
          ref="newActivityForm"
          :rules="newActivityRule"
          label-width="100px"
          style="width:70%;margin:20px auto 0;"
        >
          <el-form-item label="活动名称" prop="eventname">
            <el-input
              class="input"
              style="width:100%;"
              v-model="newActivityForm.eventname"
              placeholder="请输入活动名称"
            />
          </el-form-item>
          <el-form-item label="注册模块" prop="disreg">
            <el-radio-group v-model="newActivityForm.disreg" @change="discrfChange">
              <el-radio :label="0">不展示</el-radio>
              <el-radio :label="1">展示</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- CRF -->
          <el-row v-if="newActivityForm.disreg==1">
            <el-col :span="6">
              <el-form-item label="CRF模块" prop="discrf">
                <el-radio-group v-model="newActivityForm.discrf">
                  <el-radio :label="0">不展示</el-radio>
                  <el-radio :label="1">展示</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="18" v-if="newActivityForm.discrf">
              <el-form-item label="关联CRF" prop="crfname">
                <el-select
                  v-model="newActivityForm['crfname']"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="CRFremoteMethod"
                  :loading="CRFloading"
                  @change="CRFJsonBycrfid_Get"
                >
                  <el-option
                    v-for="item in CRFoptions"
                    :key="item.crfid"
                    :label="item.crfname"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 优惠券 -->
          <el-row>
            <el-col :span="6">
              <el-form-item label="优惠券模块" prop="discoupon">
                <el-radio-group v-model="newActivityForm.discoupon">
                  <el-radio :label="0">不展示</el-radio>
                  <el-radio :label="1">展示</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="18" v-if="newActivityForm.discoupon">
              <el-form-item label="关联优惠券" prop="couponname">
                <el-select
                  v-model="newActivityForm.couponname"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  value-key="couponid"
                  @change="getCouponname"
                >
                  <el-option
                    v-for="item in couponOptions"
                    :key="item.couponid"
                    :label="item.couponname"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

<!--          <el-form-item label="注册背景" prop="regbackpic">
            <img-upload
              style="margin-right:20px;"
              :is-delete="true"
              @input="handleUploadInput"
              :value="picUrl"
              img-style="1"
              :limit="1"
              :is-empty="isEmpty"
              :uploadByCamera="false"
              :cutWidth="375"
              :cutHeight="388"
            ></img-upload>
          </el-form-item> -->
          <el-form-item label="开始日期" prop="begintime">
            <el-date-picker
              placeholder
              v-model="newActivityForm.begintime"
              
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" prop="endtime">
            <el-date-picker
              placeholder
              v-model="newActivityForm.endtime"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <!--  -->
          <el-form-item label="活动负责人" prop="handuername">
            <mk-select-table
              ref="mkTable"
              :v-show-header="true"
              v-model="newActivityForm.handuername"
              label="name"
              url="/Publics/Common/UserInfo"
              placeholder="按会员手机号、卡号、姓名查询"
              :params="params"
              :columns="columns"
              @change="handleChangeHanduernameid"
            >
              <div slot="header">
                <el-form :inline="true">
                  <el-form-item>
                    <el-input
                      class="mr20"
                      style="width:300px"
                      type="text"
                      clearable
                      v-model="params.condition"
                      @keyup.enter.native="search"
                      placeholder="按会员工号 / 姓名 / 输入码查询"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </mk-select-table>
          </el-form-item>
        </el-form>
      </el-container>
    </template>
    <!-- ----------------------第二步骤------------------ -->
    <template v-if="active == 0">
      <div class="detailBlock">
        <div class="leftBlock">
          <d2-quill
            placeholder="活动介绍"
            useCustomImageHandler
            @imageAdded="handleImageAdded"
            v-model="newActivityForm.contents"
          ></d2-quill>
        </div>
        <div class="rightBlock">
          <phone :newActivityForm="newActivityForm" :jsonData="jsonData" />
        </div>
      </div>
    </template>
    <!--  -->
    <div class="lq_drawer__footer">
      <el-button-group>
        <el-button type="primary" @click="nextStep('newActivityForm')" v-if="active==0">下一步</el-button>
        <!-- <el-button type="primary" @click="(active=0)" v-if="active==1">上一步</el-button> -->
        <el-button type="primary" @click="sumbit('newActivityForm')" v-if="active==1">提交</el-button>
        <el-button type="warning" @click="close">取消</el-button>
      </el-button-group>
    </div>
  </el-drawer>
</template>
<script>
import phone from "./phone";
import imgUpload from "@/components/mk-form/Upload/index.vue";
import util from "@/libs/util.js";
import * as MKPublic from "@/libs/utilMkPublic.js";
export default {
  name: "activity",
  components: { phone, imgUpload },
  data() {
    var checkCouponname = (rule, value, callback) => {
      if (this.newActivityForm.discoupon == 1) {
        if (!value) {
          return callback(new Error("请选择优惠券"));
        }
      }
      callback();
    };
    var checkCrf = (rule, value, callback) => {
      if (this.newActivityForm.discrf == 1) {
        if (!value) {
          return callback(new Error("请选择CRF"));
        }
      }
      callback();
    };
    return {
      picUrl: [],
      startDatePicker: this.beginDate(),
      pickerOptions: this.endDate(),
      fileName: "Images_CRF",
      jsonData: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
          customClass: ""
        },
        key: new Date().getTime()
      },
      couponOptions: [],
      CRFoptions: [],
      loading: false, //
      CRFloading: false,
      active: 1,
      newActivityModal: false,
      params: {
        condition: "",
        type: "0"
      },
      columns: [
        {
          label: "姓名",
          prop: "name",
          align: "center",
          width: ""
        },
        {
          label: "性别",
          prop: "sex_dispalay",
          align: "center",
          width: ""
        },
        {
          label: "人员类型",
          prop: "stafftype_display",
          align: "center",
          width: ""
        },
        {
          label: "院区",
          prop: "hospitalname",
          align: "center",
          width: ""
        },
        {
          label: "科室",
          prop: "deptname",
          align: "center",
          width: ""
        }
      ],
      newActivityForm: {
        operatetype: "C", //操作类型 部分接口新增修改删除不单独,一个post搞定 C:新增 U:修改 D:删除 默认为C新增
        eventid: 0, //活动id
        begintime: "", //活动开始时间
        endtime: "", //活动结束时间
        eventname: "", //活动名称
        handuername: "",
        handuserid: "", //负责人id
        handuserno: "", //
        operatetime: "",
        operateuserid: "", //操作人id
        operateusername: "", //操作人姓名 operateuserno: "",
        status: 0,
        contents: "", //活动信息
        discoupon: 1,
        couponid: "",
        couponname: "",
        discrf: 1,
        crfid: "",
        crfname: "",
        disreg: 1,
        regbackpic: ""
      },
      crfClass: {
        classid: 100016,
        classname: "营销活动表单",
        subclassid: 100054,
        subclassname: "会员关注采集"
      },
      isEmpty: true,
      daterange: [], //日期范围
      newActivityRule: {
        eventname: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        handuername: [
          { required: true, message: "请选择活动负责人", trigger: "change" }
        ],
        discrf: [{ required: true, message: "必选项", trigger: "change" }],
        discoupon: [{ required: true, message: "必选项", trigger: "change" }],
        disreg: [{ required: true, message: "必选项", trigger: "blur" }],
        begintime: [
          { required: true, message: "请选择时间", trigger: "change" }
        ],
        endtime: [{ required: true, message: "请选择时间", trigger: "change" }],
        couponname: [{ validator: checkCouponname, trigger: "change" }],
        crfname: [{ validator: checkCrf, trigger: "change" }]
      },
      curImgUrl: ""
    };
  },
  created() {},
  methods: {
    discrfChange(value) {
      if (value === 0) {
        this.newActivityForm.discrf = 0;
        this.newActivityForm.crfid = "";
        this.newActivityForm.crfname = "";
      }
    },
    //控制开始时间
    beginDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.newActivityForm.endtime) {
            //如果结束时间不为空，则小于结束时间
            return (
              new Date(self.newActivityForm.endtime).getTime() <
                time.getTime() + 1000 * 3600 * 24 || time.getTime() < Date.now()
            );
          } else {
            return time.getTime() < Date.now(); //开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    },
    //控制结束时间
    endDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.newActivityForm.begintime) {
            //如果开始时间不为空，则结束时间大于开始时间
            return (
              new Date(self.newActivityForm.begintime).getTime() >
                time.getTime() || time.getTime() - 1000 * 3600 * 24 < Date.now()
            );
          } else {
            return time.getTime() - 1000 * 3600 * 24 < Date.now(); //开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    },
    //下一步
    nextStep(formName) {
      this.$refs.newActivityForm.validate(valid => {
        if (valid) {
          this.active = 1;
        } else {
          return false;
          // this.$message.error("请完善表单");
        }
      });
    },
    //查找活动负责人
    search() {
      this.$refs.mkTable.getData();
    },
    //打开弹框
    open(operatetype) {
      this.$nextTick(() => {
        if (!!this.newActivityForm.eventid) {
          this.getCntents(operatetype);
        } else {
          this.newActivityModal = true;
          this.newActivityForm.operatetype = operatetype;
        }
      });
    },
    getCntents(operatetype) {
      this.MK.Request("/Publics/Common/Dic/HospitalEventsByeventid", "get", {
        eventid: this.newActivityForm.eventid
      }).then(res => {
        if (res.code == 0) {
          this.newActivityModal = true;
          this.newActivityForm.operatetype = operatetype;
          if (res.data.length !== 0) {
            // console.log(res.data);
            let item = res.data[0];
            this.newActivityForm.contents = item.contents || "";
          } else {
            this.newActivityForm.contents = "";
          }
		 // this.newActivityForm.regbackpic = this.newActivityForm.regbackpic ? this.newActivityForm.regbackpic.split(',').map(item => ({ url: item })) : '';
          console.log(this.newActivityForm);
        }
      });
    },
    //初始化
    initForm() {
      this.newActivityForm = {
        operatetype: "C", //操作类型 部分接口新增修改删除不单独,一个post搞定 C:新增 U:修改 D:删除 默认为C新增
        eventid: 0, //活动id
        begintime: "", //活动开始时间
        endtime: "", //活动结束时间
        eventname: "", //活动名称
        handuername: "",
        handuserid: "", //负责人id
        handuserno: "", //
        operatetime: "",
        operateuserid: "", //操作人id
        operateusername: "", //操作人姓名 operateuserno: "",
        status: 0,
        contents: "", //活动信息
        discoupon: 1,
        couponid: "",
        couponname: "",
        discrf: 1,
        crfid: "",
        crfname: "",
        disreg: 1,
        regbackpic: ""
      };
    },
    //关闭弹框
    close() {
      this.active = 1;
      this.picUrl = [];
      this.daterange = [];
      this.initForm();
      this.newActivityModal = false;
      //父组件刷新
      this.$emit("close");
    },
    //获取负责人id
    handleChangeHanduernameid(row) {
      this.newActivityForm.handuserid = row.userid;
    },
    getCouponname(item) {
      this.newActivityForm.couponid = item.couponid;
      this.newActivityForm.couponname = item.couponname;
    },
    //远程搜索优惠券
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.getCoputon(query);
        }, 200);
      } else {
        this.couponOptions = [];
      }
    },
    //获取优惠券列表
    getCoputon(query) {
      this.MK.Request("/Publics/CouponManage/Coupon", "get", {
        page: 1,
        rows: 20,
        status: "5",
        hospitalid: this.info.hospitalid,
        condition: query
      }).then(res => {
        this.couponOptions = res.data;
      });
    },
    //CRF远程搜索
    CRFremoteMethod(query) {
      if (query !== "") {
        this.CRFloading = true;
        setTimeout(() => {
          this.CRFloading = false;
          this.getCrf(query);
        }, 200);
      } else {
        this.CRFoptions = [];
      }
    },
    //获取CRF列表
    getCrf(query) {
      // this.MK.Request("Publics/CRFMaintain/CRFForm_Get", "get", {
      this.MK.Request(
        "/Publics/CRFClassMaintain/crfListBySubclassidHavePage_Get",
        "get",
        {
          subclassid: this.crfClass.subclassid,
          page: 1,
          rows: 20,
          hospitalid: this.info.hospitalid,
          condition: query
        }
      ).then(res => {
        this.CRFoptions = res.data;
      });
    },
    //提交
    sumbit() {
      this.HospitalEvents();
    },
    //获取模板
    CRFJsonBycrfid_Get(item) {
      this.newActivityForm["crfname"] = item.crfname;
      this.newActivityForm["crfid"] = parseInt(item.crfid);
      this.MK.Request("/Publics/CRFMaintain/josnformatBycrfid", "get", {
        userid: util.cookies.get("uuid"),
        crfid: item.crfid,
        formtype: 2,
        hospitalid: this.info.hospitalid,
        memberid: -1
      }).then(res => {
        let resData = res.josnformat;
        this.jsonData.list = resData.list;
        this.jsonData.config=resData.config;
        this.$nextTick(() => {
          this.jsonData.key = new Date().getTime();
        });
      });
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
          // console.log("执行缩放后,base64=" + base64.length);
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
    },
    //活动新增编辑事件
    HospitalEvents() {
      let cloneData = JSON.parse(JSON.stringify(this.newActivityForm));
      if (cloneData.discrf === 0) {
        cloneData.crfid = "";
        cloneData.crfname = "";
      }
      if (cloneData.discoupon === 0) {
        cloneData.couponid = "";
        cloneData.couponname = "";
      }
      if (cloneData.operatetype == "C") {
        delete cloneData.eventid;
        delete cloneData.operatetime;
      }
      cloneData.operateuserid = this.info.userid;
      cloneData.operateusername = this.info.name;
      this.MK.Request(
        "/Publics/Common/Dic/HospitalEvents",
        "post",
        cloneData
      ).then(res => {
        if (res.code == 0) {
          this.$message.success(res.msg);
          //   this.refreshList();
          this.newActivityModal = false;
          this.close();
        }
      });
    },
    // 修改上传的图片
    handleUploadInput(data) {
      let url = data.map(item => item.url);
      this.newActivityForm.regbackpic = url[0];
    }
  }
};
</script>
<style scoped>
>>> .el-steps--horizontal {
  white-space: nowrap;
  width: 500px;
  margin-left: auto;
  margin-right: auto;
}

>>> .el-drawer__header {
  margin: 0 !important;
  padding: 5px 20px !important;
  background: #8ddba5;
  color: white;
}
.lq_drawer__footer {
  position: fixed;
  bottom: 10px;
  width: 100%;
  text-align: center;
}
>>> .el-drawer__body {
  height: 100%;
}
>>> .quillWrapperS .ql-toolbar.ql-snow {
  width: calc(100% - 400px) !important;
  z-index: 999999999999;
}

p {
  margin: 0;
  padding: 0;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
</style>
<style scoped lang="scss">
.detailBlock {
  width: 100%;
  overflow: hidden;
}
.leftBlock {
  float: left;
  width: calc(100% - 400px);
}
.rightBlock {
  float: right;
  width: 400px;
}
</style>