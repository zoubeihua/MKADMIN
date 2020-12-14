<template>
  <!-- 会员基本信息 -->
  <el-container>
    <el-main style="padding:0 0 0 20px;">
      <el-scrollbar style="height:100%;width:100%;">
        <el-row :gutter="20">
          <el-col :lg="16" :sm="24">
            <div class="card">
              <div class="card-header">
                <div class="card-title-wrap bar-primary">
                  <div class="card-title">个人信息</div>
                </div>
              </div>
              <div class="card-body">
                <div class="card-block">
                  <div class="align-self-center halfway-fab text-center">
                    <a
                      class="profile-image rounded-circle img-border gradient-summer width-100"
                    >
                      <img
                        v-if="userinfo.idphoto"
                        :src="userinfo.idphoto"
                        class="rounded-circle gradient-summer width-100"
                        alt="头像"
                      />
                      <img
                        v-else-if="userinfo.idphoto == '' && userinfo.sex == 1"
                        src="@/assets/imgs/touxiangnan.png"
                        class="rounded-circle gradient-summer width-100"
                        alt="头像"
                      />
                      <img
                        v-else
                        src="@/assets/imgs/touxiangnv.png"
                        class="rounded-circle gradient-summer width-100"
                        alt="头像"
                      />
                    </a>
                  </div>
                  <div class="text-center">
                    <span class="font-medium-2 text-uppercase">
                      <i
                        :class="[
                          'mkfont',
                          userinfo.sex == 1
                            ? 'nan primary'
                            : userinfo.sex == 2
                            ? 'nv danger'
                            : 'weizhi warning'
                        ]"
                      ></i>
                      {{ userinfo.membername }} - {{ userinfo.age }}
                    </span>
                    <!--  -->
                    <div class="warning infobox">
                      <div class="block">
                        <h5>
                          <!-- <i class="fa fa-rmb"></i> -->
                          {{ userinfo.balance }}
                        </h5>
                        <p>缴费金额</p>
                      </div>
                      <div class="block">
                        <h5>{{ userinfo.memberintegral }}</h5>
                        <p>会员积分</p>
                      </div>
                      <div class="block">
                        <h5>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="userinfo.memberlevel_display"
                            placement="top-start"
                          >
                            <img
                              v-if="userinfo.memberlevel == 1"
                              src="./img/pt.png"
                              alt="普通会员"
                              title="普通会员"
                              style="width:24px;margin:0 2px;vertical-align: middle;"
                            />
                            <img
                              v-if="userinfo.memberlevel == 2"
                              src="./img/by.png"
                              alt="白银会员"
                              title="白银会员"
                              style="width:24px;margin:0 2px;vertical-align: middle;"
                            />
                            <img
                              v-if="userinfo.memberlevel == 3"
                              src="./img/hj.png"
                              alt="黄金会员"
                              title="黄金会员"
                              style="width:24px;margin:0 2px;vertical-align: middle;"
                            />
                            <img
                              v-if="userinfo.memberlevel == 4"
                              src="./img/bj.png"
                              alt="铂金会员"
                              title="铂金会员"
                              style="width:24px;margin:0 2px;vertical-align: middle;"
                            />
                            <img
                              v-if="userinfo.memberlevel == 5"
                              src="./img/zs.png"
                              alt="钻石会员"
                              title="钻石会员"
                              style="width:24px;margin:0 2px;vertical-align: middle;"
                            />
                          </el-tooltip>
                        </h5>
                        <p>会员等级</p>
                      </div>
                      <!-- <span class="gjc gjc-danger">敏</span>
                      <span class="gjc gjc-primary">慢</span>-->
                    </div>
                  </div>
                  <div>
                    <!-- <p class="grey font-small-2">
                   <i class="fa fa-credit-card text-bold-500 primary"></i>
                      <el-tag size="mini">{{userinfo.cardtypeid_display}}</el-tag>
                      {{userinfo.cardno}}
                    </p>-->
                    <!-- <p class="grey font-small-2">
                      <i class="el-icon-user-solid text-bold-500 primary"></i>
                       {{userinfo.country_display}}
                    </p>-->
                    <!-- <p class="grey font-small-2">
                      <span class="text-bold-500 primary">
                        <i class="fa fa-vcard-o"></i>
                        {{userinfo.idtype_display}}
                      </span>
                      {{userinfo.idnumber}}

                    </p>-->
                    <!-- <p class="grey font-small-2">
                      <span class="text-bold-500 primary">
                        <i class="fa fa-mobile-phone" style="font-size:20px;"></i>
                      </span>
                      {{userinfo.mobiletel}}
                      <span
                        class="text-bold-500 primary"
                        style="margin-left:10px;"
                      >
                        <i class="fa fa-phone"></i>
                      </span>
                      {{userinfo.landline}}
                    </p>-->
                    <!-- <p class="grey font-small-2">
                      <span class="text-bold-500 primary">
                        <i class="fa fa-envelope-o"></i>
                      </span>
                      {{userinfo.email}}
                      <span
                        class="text-bold-500 primary"
                        style="margin-left:20px;"
                      >
                        <i class="fa fa-mobile-phone" style="font-size:20px;"></i>
                      </span>
                      {{userinfo.mobiletel}}
                      <span
                        class="text-bold-500 primary"
                        style="margin-left:20px;"
                      >
                        <i class="fa fa-phone"></i>
                      </span>
                      {{userinfo.landline}}
                    </p>-->
                    <div class="userinfobox">
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-credit-card"></i>
                          卡号
                        </span>
                        <el-tag size="mini">{{
                          userinfo.cardtypeid_display
                        }}</el-tag>
                        {{ userinfo.cardno }}
                      </p>
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-vcard-o"></i>
                          {{ userinfo.idtype_display }}
                        </span>
                        {{ userinfo.idnumber }}
                      </p>
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-envelope-o"></i>
                          邮箱
                        </span>
                        {{ userinfo.email }}
                      </p>
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-mobile-phone"></i>手机号
                        </span>
                        {{ userinfo.mobiletel }}
                      </p>
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-phone"></i>座机
                        </span>
                        {{ userinfo.landline }}
                      </p>
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="el-icon-s-flag"></i>国籍
                        </span>
                        {{ userinfo.country_display }}
                      </p>
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-empire"></i>婚姻状况
                        </span>
                        {{ userinfo.marriage_display }}
                      </p>
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-user-o"></i>民族
                        </span>
                        {{ userinfo.nation_display }}
                      </p>
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-calendar"></i>出生日期
                        </span>
                        {{ dateFormat(userinfo.birthday) }}
                      </p>
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-tint"></i>血型
                        </span>
                        {{ userinfo.bloodgroup_display }} 型
                      </p>
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-sun-o"></i>宗教信仰
                        </span>
                        {{ userinfo.religion_display }}
                      </p>
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-empire"></i>职业
                        </span>
                        {{ userinfo.profession_display }}
                      </p>
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-tint"></i>RH血型
                        </span>
                        {{ userinfo.bloodrh_display }}
                      </p>
                      <div class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-language"></i> 语种
                        </span>
                        <span class="tag-group">
                          <el-tag size="mini" type="danger">{{
                            userinfo.language_display
                          }}</el-tag>
                        </span>
                      </div>
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-map-marker"></i>居住地
                        </span>
                        {{ userinfo.currentaddress }}
                      </p>
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-tags"></i>来源
                        </span>
                        {{ userinfo.sourceid_display }}
                      </p>
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-empire"></i>工作单位
                        </span>
                        {{ userinfo.compangname }}
                      </p>
                      <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-map-marker"></i>现居住地址
                        </span>
                        {{ userinfo.currentprovince_display }}/{{
                          userinfo.currentcity_display
                        }}/{{ userinfo.currentcounty_display }}
                      </p>
                      <!-- <p class="grey font-small-2">
                        <span class="text-bold-500 primary">
                          <i class="fa fa-empire"></i>联系人
                        </span>

                      </p> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :lg="8" :sm="24">
            <div class="card">
              <div class="card-header">
                <div class="card-title-wrap bar-primary">
                  <div class="card-title">附加信息</div>
                </div>
              </div>
              <div class="card-body">
                <div class="card-block appendInfo">
                  <p class="grey font-small-2">
                    <span class="text-bold-500 primary">毕业学院</span>
                    {{ userinfo.graduatedschool }}
                  </p>
                  <p class="grey font-small-2">
                    <span class="text-bold-500 primary">学历</span>
                    {{ userinfo.highesteducation_display }}
                  </p>
                  <p
                    class="grey font-small-2"
                    style="display: inline-flex;align-items: center;margin:0"
                  >
                    <span class="text-bold-500 primary">个人信用</span>
                    <el-rate
                      :max="5"
                      disabled
                      :value="parseInt(this.userinfo.credits) + 1"
                      :texts="['未知', '差', '一般', '好', '非常好']"
                      show-text
                    ></el-rate>
                  </p>
                  <p class="grey font-small-2">
                    <span class="text-bold-500 primary">收入范围</span>
                    {{ userinfo.yearsalary_display }}
                  </p>
                  <p class="grey font-small-2">
                    <span class="text-bold-500 primary">个人偏好</span>
                    {{ userinfo.preference }}
                  </p>
                  <p class="grey font-small-2">
                    <span class="text-bold-500 primary">过敏史</span>
                    {{ userinfo.allergyhistory }}
                  </p>
                  <p class="grey font-small-2">
                    <span class="text-bold-500 primary">既往史</span>
                    {{ userinfo.pasthistory }}
                  </p>
                  <p class="grey font-small-2">
                    <span class="text-bold-500 primary">家族史</span>
                    {{ userinfo.genetichistory }}
                  </p>
                  <p class="grey font-small-2">
                    <span class="text-bold-500 primary">旅行史</span>
                    {{ userinfo.travelhistory }}
                  </p>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-header">
                <div class="card-title-wrap bar-primary">
                  <div class="card-title">证照信息</div>
                </div>
              </div>
              <div class="card-body">
                <div class="card-block">
                  <el-row :gutter="20">
                    <!--  -->
                    <el-col :lg="12" :sm="24" v-if="Certificates.length == 0">
                      <div class="licence primary-bg mk-hover primary-bg">
                        <img src="./img/gh.png" alt />
                        <div class="licence-header">
                          <!-- <div class="text-bold-500 white">{{item.idtype_display}}</div>
                          <div class="white">{{item.idnumber}}</div>-->
                        </div>
                        <div class="licence-footer">暂无上传证照</div>
                      </div>
                    </el-col>
                    <!--  -->
                    <el-col
                      :lg="12"
                      :sm="24"
                      v-for="(item, index) in Certificates"
                      :key="index"
                      v-if="!!Certificates"
                    >
                      <div
                        class="licence primary-bg mk-hover"
                        :class="[
                          item.idtype == 1
                            ? 'primary-bg'
                            : item.idtype == 2
                            ? 'success-bg'
                            : 'danger-bg'
                        ]"
                      >
                        <img src="./img/gh.png" alt />
                        <div class="licence-header">
                          <div class="text-bold-500 white">
                            {{ item.idtype_display }}
                          </div>
                          <div class="white">{{ item.idnumber }}</div>
                        </div>
                        <div
                          class="licence-footer"
                          @click="showImgPreview(item)"
                        >
                          查看证件照片
                          <!-- <el-image
                            style="width: 100%; height: 100%;opacity:0;"
                            :src="item.idpic"
                            :preview-src-list="[item.idpic,item.idpic2]"
                          ></el-image> -->
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-header">
                <div class="card-title-wrap bar-primary">
                  <div class="card-title">联系人</div>
                </div>
              </div>
              <div class="card-body">
                <div class="card-block">
                  <div class="addressbook" v-for="item in ContactPersonList">
                    <div class="book-img">
                      <img src="./img/head.png" alt srcset />
                    </div>
                    <div style="width:100%;">
                      <div class="addressname">
                        <div class="name">{{ item.contactname }}</div>
                        <div class="mobile">{{ item.contactship_display }}</div>
                      </div>
                      <div class="addres">
                        <!-- <i class="fa fa-child"></i> -->
                        <!-- <i class="fa fa-mobile-phone" style="font-size:20px"> </i> -->
                        {{ item.mobiletel }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>
<script>
import utils from "@/minxins/util.js";

export default {
  name: "baseinfo",
  props: {
    userData: {
      type: Object,
      default: () => {}
    },
    memberid: {
      type: Number,
      default: undefined
    }
  },
  // computed: {
  //   credits() {
  //     return parseInt(this.userinfo.credits) + 1;
  //   }
  // },
  data() {
    return {
      Certificates: [],
      ContactPersonList: [],
      userinfo: []
    };
  },
  created() {
    // /Publics/MemberManage/MemberInfo
    if (!!this.memberid) {
      this.getMemberInfo();
    } else {
      this.userinfo = this.userData;
    }
    this.getCertificate();
    this.ContactPerson();
  },
  methods: {
    getMemberInfo() {
      this.MK.Request("Publics/MemberManage/MemberInfo", "get", {
        memberid: this.memberid || this.userinfo.memberid,
        hospitalid: this.info.hospitalid
      }).then(res => {
        this.userinfo = res.data[0];
      });
    },
    showImgPreview(row) {
      let imgArr = [];
      if (row.idpic != "") {
        imgArr.push(row.idpic);
      }
      if (row.idpic2 != "") {
        imgArr.push(row.idpic2);
      }
      if (row.idpic == "" && row.idpic2 != "") {
        this.$message({
          type: "error",
          message: "没有证照资料"
        });
        return;
      }
      let obj = {
        url: "",
        mainBackground: "rgba(0,0,0,.2)",

        nowImgIndex: 0,
        multiple: true,
        imgList: imgArr
      };
      this.$mkImgPreview(obj);
    },
    ContactPerson() {
      this.MK.Request("Publics/MemberManage/ContactPerson", "get", {
        memberid: this.memberid || this.userinfo.memberid,
        condition: "",
        rows: 10,
        page: 1,
        tag: 1,
        hospitalid: this.info.hospitalid
      }).then(res => {
        this.ContactPersonList = res.data;
      });
    },
    //获取证照
    getCertificate() {
      let sendData = {
        hospitalid: this.info.hospitalid,
        tag: 1,
        condition: this.memberid || this.userinfo.memberid
      };
      this.MK.Request(
        "/Publics/MemberManage/Certificate",
        "get",
        sendData
      ).then(res => {
        if (res.code == 0) {
          this.Certificates = res.data;
        }
      });
    },
    // 日期格式化 传入值如 20200503
    dateFormat(date) {
      if (date) {
        var year = date.substr(0, 4);
        var month = date.substr(4, 2);
        var day = date.substr(6);
        return `${year}-${month}-${day}`;
      }
    }
  },
  watch: {}
};
</script>
<style scoped lang="scss">
.el-container {
  background-color: #eff0f5;
}
.card {
  border: 0;
  margin: 20px 0;
  -webkit-box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.01),
    0 15px 32px 0 rgba(0, 0, 0, 0.06);
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.01), 0 15px 32px 0 rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #ffffff;
  -webkit-background-clip: border-box;
  background-clip: border-box;
}
.card .card-header {
  padding: 1.5rem;
  border-bottom: none;
  background-color: transparent;
}
.card .card-header .card-title-wrap {
  margin-left: -1.5rem;
  padding-left: 1.5rem;
  border-left: 3px solid #e9ecef;
}
.card-header .bar-primary {
  border-color: #666ee8 !important;
}
.card-body {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 auto;
  -moz-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 1.25rem;
}
.card .card-body {
  padding: 0;
  height: auto;
}
.card .card-block {
  padding: 1rem 1.5rem 1.5rem;
}
.text-center {
  text-align: center !important;
}
.align-self-center {
  -webkit-align-self: center !important;
  -ms-flex-item-align: center !important;
  -ms-grid-row-align: center !important;
  align-self: center !important;
}
.rounded-circle {
  border-radius: 50% !important;
}
.profile-image {
  width: 100px;
  height: 100px;
  display: inline-block;
}
img.img-border {
  border: 5px solid #ffffff;
}
[class*="gradient-"] {
  background-repeat: repeat !important;
}
.width-100 {
  width: 100px !important;
  height: 100px !important;
}
.gradient-summer {
  background-image: -webkit-linear-gradient(45deg, #22c1c3, #fdbb2d);
  background-image: -moz- oldlinear-gradient(45deg, #22c1c3, #fdbb2d);
  background-image: -o-linear-gradient(45deg, #22c1c3, #fdbb2d);
  background-image: linear-gradient(45deg, #22c1c3, #fdbb2d);
  background-repeat: repeat-x;
}
.gjc {
  display: inline-block;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  text-align: center;
  line-height: 22px;
  border: 1px solid red;
  color: red;
  margin: 0 2px;
  font-size: 13px;
}
.gjc-primary {
  color: #409eff;
  border: 1px solid #409eff;
}
.gjc-danger {
  color: #f56c6c;
  border: 1px solid #f56c6c;
}
.text-bold-500 {
  font-weight: 500;
}
.white {
  color: #fff;
}
.font-small-2 {
  font-size: 15px;
}
.tag-group .el-tag {
  margin-left: 6px;
}
.licence {
  width: 100%;
  min-height: 100px;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  margin-bottom: 10px;
  transition: all 0.5s;
  cursor: pointer;
}
.licence img {
  position: absolute;
  right: -46px;
  top: 13px;
  opacity: 0.2;
}
.licence-header {
  padding: 10px;
}
.licence-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
}
.mk-hover:hover {
  transform: scale(1.1);
}
.addressbook {
  display: flex;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid #eee;
}
.book-img {
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.book-img img {
  width: 42px;
  height: 42px;
}
.addressname {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.addressname .name {
  font-size: 16px;
  color: #333;
}
.mobile,
.addres {
  padding-left: 6px;
  display: flex;
  align-items: center;
  color: #888;
}
.userinfobox .grey {
  width: 50%;
  display: inline-block;
  .text-bold-500 {
    display: inline-block;
    width: 6em;
    text-align: justify;
    text-align-last: justify;
    text-justify: distribute-all-lines;
    margin-right: 10px;
    // &::after {
    //   content: ":";
    // }
  }
}
.appendInfo .grey span.text-bold-500 {
  display: inline-block;
  width: 4em;
  text-align: justify;
  text-align-last: justify;
  text-justify: distribute-all-lines;
  margin-right: 10px;
  // &::after {
  //   content: ":";
  // }
}
.licence-footer {
  //position: relative;
  .el-image {
    position: absolute;
    width: 100%;
    height: 30px;
    opacity: 0;
    z-index: 99;
    left: 0;
  }
}
.infobox {
  width: 350px;
  margin: 20px auto;
  .block {
    width: 33.3%;
    display: inline-block;
    h5 {
      margin: 0;
      margin-bottom: 10px;
      font-size: 1.5rem;
    }
  }
}
</style>
