<template>
  <div class="bigbox">
    <div class="phoneContent">
      <!-- 富文本 -->
      <div v-html="newActivityForm.contents" class="ql-editor"></div>
      <!-- 表单 -->
      <template v-if="newActivityForm.discrf==1">
        <div class="crfConten">
          <fm-generate-form :edit="true" :data="jsonData" ref="generateForm" :key="jsonData.key"></fm-generate-form>
        </div>
      </template>
      <!-- 注册 -->
     <!-- <div
        class="registerBox"
        v-if="newActivityForm.disreg==1"
        :style="{background: !!newActivityForm.regbackpic?'url( '+ newActivityForm.regbackpic +')':'#005bea',backgroundSize: 'cover'}"
      >
        <div class="box1">
          <p class="titel">
            <span>快速注册</span>
          </p>
          <el-form ref="regForm" :model="regForm" :rules="rules">
            <el-form-item prop="membername">
              <el-input v-model="regForm.membername" placeholder="请输入您的姓名"></el-input>
            </el-form-item>
            <el-form-item prop="sex">
				<mk-select
				  v-model="regForm.sex"
				  placeholder="请选择性别"
				  :datas="[{bzname:'男',bzcode:'1'},{bzname:'女',bzcode:'2'}]"
				  :filter="['bzname']"
				  label="bzname"
				  val="bzcode"
				/>
            </el-form-item>
            <el-form-item prop="age">
              <el-input v-model.number="regForm.age" type="number" placeholder="请输入您的年龄"></el-input>
            </el-form-item>
            <el-form-item prop="mobiletel">
              <el-input v-model.number="regForm.mobiletel" type="number" placeholder="请输入您的手机号码"></el-input>
            </el-form-item>
          </el-form>
          <div class="regButton" @click="submit('regForm')">提交</div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
// window._bd_share_config = {
//   common: {
//     bdSnsKey: {},
//     bdText: "",
//     bdMini: "1",
//     bdMiniList: ["tsina", "weixin", "mail", "linkedin", "copy", "print"],
//     bdPic: "",
//     bdStyle: "0",
//     bdSize: "32"
//   },
//   slide: { type: "slide", bdImg: "3", bdPos: "left", bdTop: "100" }
// };
// with (document)
//   (0)[
//     ((getElementsByTagName("head")[0] || body).appendChild(
//       createElement("script")
//     ).src =
//       "http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=" +
//       ~(-new Date() / 36e5))
//   ];
// </script>

// <script>
import util from "@/libs/util.js";
import axios from "axios";
import to from "await-to-js";
// import { param } from "../../../../public/lib/UEditor/third-party/jquery-1.10.2";
export default {
  name: "phone",
  data() {
    // 手机号验证
    const checkmobiletel = (rule, value, callback) => {
      const mobiletelReg = /^1[3|4|5|6|7|8][0-9]{9}$/;
      if (!value) {
        return callback(new Error("联系手机不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字"));
        } else {
          if (mobiletelReg.test(value)) {
            callback();
          } else {
            callback(new Error("联系电话格式不正确"));
          }
        }
      }, 200);
    };
    // 年龄验证
    const checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("不能为空"));
      }
      if (0 > value || 120 < value) {
        return callback(new Error("请输入正确的年龄"));
      }
      callback();
    };
    return {
      regForm: {
        sex: "",
        membername: "",
        age: "",
        mobiletel: "",
        birthday: "",
        sourceid: 3, //来源于活动，固定传参
        sourcenote: "", //活动名称
        idtype: "2", //证件类型 默认为护照
        idnumber: "", //证件号码 默认为手机号
        cardno: "", //卡号 默认手机号
        cardtypeid: "2", //卡类型，默认磁条卡
        operatetype: "C"
      },
      rules: {
        membername: [
          { required: true, message: "请填写姓名", trigger: "blur" }
        ],
        age: [
          {
            required: true,
            trigger: "blur",
            message: "请填写正确的年龄",
            validator: checkAge
          }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        mobiletel: [
          {
            required: true,
            validator: checkmobiletel,
            trigger: "blur"
          }
        ]
      },

      data: {
        rows: 10,
        page: 1,
        count: 0,
        condition: "",
        hospitalid: 1
      },
      hospitalid: "",
      newActivityForm: {
        disreg: 1,
        discrf: 1
      },
      crfClass: {
        classid: 100016,
        classname: "营销活动表单",
        subclassid: 100054,
        subclassname: "会员关注采集"
      },
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
      activeData: {}
    };
  },
  mounted() {
    this.getList(this.$route.params);
    this.hospitalid = this.$route.params.hospitalid;
  },
  methods: {
    async submit(formName) {
      console.log(this.activeData);
      if (this.activeData.discrf == 1) {
        let [err, resdata] = await to(this.$refs.generateForm.getData());
        if (!resdata) {
          return;
        }
      }
      this.$refs.regForm.validate(valid => {
        if (valid) {
          let newYear = new Date().getFullYear();
          this.regForm.birthday = newYear - this.regForm.age + "0101";
          this.regForm.idnumber = this.regForm.mobiletel; //证件号码 默认为手机号
          this.regForm.cardno = this.regForm.mobiletel; //卡号 默认手机号

          this.MK.Request(
            "/Publics/MemberManage/BasicInfo",
            "post",
            this.regForm
          ).then(res => {
            if (res.code == 0) {
              if(this.activeData.discoupon==1){
                  this.ReceiveCoupon(res.result)
                }
              if (this.activeData.discrf == 1) {
                this.crf_post(res.result);
              } else {
                this.$message.success("注册成功!");
                this.regFormInit();
              }
            }
          });
        } else {
          return false;
        }
      });
    },
    //领取优惠券
    ReceiveCoupon(memberid) {
      let opt = {
        operatetype: "C",
        couponid: this.activeData.couponid,
        eventid: this.activeData.eventid,
        memberid: memberid
      };
      this.MK.Request("/Publics/CouponManage/ReceiveCoupon", "post", opt).then(
        res => {
          if (res.code == 0) {
            console.log(res.data);
            setTimeout(() => {
              this.$message.success(res.msg)
            }, 2000);
          }
        }
      );
    },
    CRFillJsonBysubclassid_Get(userid) {
      let opt = {
        hospitalid: this.hospitalid,
        collectionid: 1,
        memberid: userid,
        classid: this.crfClass.classid,
        classname: this.crfClass.classname,
        subclassid: this.crfClass.subclassid,
        subclassname: this.crfClass.subclassname,
        crfid: this.newActivityForm.crfid,
        crfname: this.newActivityForm.crfname,
        createid: userid,
        formtype: 2
      };
      this.MK.Request("/Publics/CRFMaintain/CRFFill_ADD", "post", opt).then(
        res => {
          if (res.code == 0) {
            console.log(res.data);
          }
        }
      );
    },
    async crf_post(userid) {
      let [err, res] = await to(this.$refs.generateForm.getData());
      let opt = {
        hospitalid: this.hospitalid,
        collectionid: 1,
        memberid: userid,
        classid: this.crfClass.classid,
        classname: this.crfClass.classname,
        subclassid: this.crfClass.subclassid,
        subclassname: this.crfClass.subclassname,
        crfid: this.newActivityForm.crfid,
        crfname: this.newActivityForm.crfname,
        createid: userid,
        filljson: res.sendData
      };
      this.MK.Request("/Publics/CRFMaintain/CRFFill_ADD", "post", opt).then(
        res => {
          if (res.code == 0) {
            this.$message.success("提交成功!");
            this.regFormInit();
          }
        }
      );
    },
    regFormInit() {
      this.regForm = {
        sex: "",
        membername: "",
        age: "",
        mobiletel: "",
        birthday: "",
        sourceid: 3, //来源于活动，固定传参
        sourcenote: "", //活动名称
        idtype: "2", //证件类型 默认为护照
        idnumber: "", //证件号码 默认为手机号
        cardno: "", //卡号 默认手机号
        cardtypeid: "2", //卡类型，默认磁条卡
        operatetype: "C"
      };
    },
    getList(params) {
      console.log(params);
      this.MK.Request("/Publics/Common/Dic/HospitalEventsByeventid", "get", {
        eventid: params.eventid
      }).then(res => {
        if (res.code == 0) {
          let item = res.data[0];
          this.activeData = item;
          window.document.title = item.eventname;
          this.regForm.sourcenote = item.eventname;
          if (item.discrf == 1) {
            this.CRFJsonBycrfid_Get(item);
          }

          this.newActivityForm = item;
        }
      });
    },
    //获取模板
    CRFJsonBycrfid_Get(item) {
      this.newActivityForm["crfname"] = item.crfname;
      this.newActivityForm["crfid"] = parseInt(item.crfid);
      this.MK.Request("/Publics/CRFMaintain/josnformatBycrfid", "get", {
        userid: util.cookies.get("uuid"),
        crfid: item.crfid,
        formtype: 2
      }).then(res => {
        let resData = res.josnformat;
        this.jsonData.list = resData.list;
        this.jsonData.config=resData.config;
        this.$nextTick(() => {
          this.jsonData.key = new Date().getTime();
        });
      });
    }
  }
};
</script>

<style  scoped>


.bigbox {
  width: 100%;
  min-height: 100vh;
  background: #f1f1f1;
  text-align: center;
}
.registerBox {
  background-size: cover !important;
  width: 100%;
  /* height: 350px; */
  padding: 5% 0;
  text-align: center;
  padding-top: 15px;
}
.registerBox .box1 {
  width: 90%;
  margin: 0px auto;
  border-radius: 20px;
  height: auto;
  padding: 5%;
  background: rgba(255, 255, 255, 0);
  color: #fff;
}
.registerBox .box1 .regInput {
  padding: 8px 10px;
  margin-top: 20px;
  border-radius: 20px;
  border: 1px solid #fff;
  background: #fff;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}
.registerBox .box1 .regInput:focus {
  outline: none;
  border: #005bea 1px solid;
  box-shadow: 0 0 2px 0 #04befe;
}
.registerBox .box1 .regButton {
  width: 99%;
  padding: 1.65% 0;
  margin-top: 10%;
  display: block;
  outline: none;
  border-radius: 20px;
  margin-left: auto;
  margin-right: auto;
  background-image: linear-gradient(to right, #4481eb 0%, #04befe 100%);
}
.registerBox .box1 .titel {
  text-align: center;
  margin-bottom: 20px;
}
.registerBox .box1 .titel span {
  padding: 0 10px;
  color: #07acb6;
}
.registerBox .box1 .titel::before,
.registerBox .box1 .titel::after {
  content: "";
  width: 20px;
  height: 12.5px;
  display: inline-block;
  background: url("../activeH5/imgs/title.png");
  background-repeat: no-repeat;
  background-size: contain;
}

/* .phone {
  margin: 0 auto;
  position: relative;
  background: #111;
  border-radius: 55px;
  box-shadow: 0px 0px 0px 2px #aaa;
  width: 320px;
  height: 568px;
  padding: 105px 25px;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  margin: 10px auto !important;
  transform: scale(0.9);
} */
.phoneContent {
  height: 100%;
  overflow-y: auto;
  background: #fff;
  max-width: 900px;
  margin: 0 auto;
  /* margin-top: 20px; */
}
</style>
<style scoped>
>>> .ql-editor {
  min-height: 0px;
  height: auto;
}
.crfConten{
  text-align: left;
}
.crfConten >>> .el-container {
  height: auto !important;
}
>>> .ql-editor img {
  max-width: 100%;
  min-width: 100%;
}
</style>