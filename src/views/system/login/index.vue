<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </div>
    <div class="page-login--layer page-login--layer-time" flex="main:center cross:center">{{time}}</div>
    <div class="page-login--layer">
      <div class="page-login--content" flex="dir:top main:justify cross:stretch box:justify">
        <div class="page-login--content-header">
          <p class="page-login--content-header-motto">时间是一切财富中最宝贵的财富</p>
        </div>
        <div class="page-login--content-main" flex="dir:top main:center cross:center">
          <!-- logo 会员管理 -->
          <!-- <h2 >上海鼎缘健康科技有限公司</h2> -->
          <img class="page-login--logo" :src="`${$baseUrl}image/login-logo.png`" />
          <!-- form -->
          <div class="page-login--form">
            <el-card shadow="never">
              <el-form
                ref="loginForm"
                label-position="top"
                :rules="rules"
                :model="formLogin"
                size="default"
              >
                <el-form-item prop="username">
                  <el-input
                    type="text"
                    @keyup.enter.native="tab('password')"
                    v-model="formLogin.username"
                    placeholder="用户名"
                  >
                    <d2-icon slot="prepend" name="user-circle" />
                    <!-- <i slot="prepend" class="fa fa-user-circle"></i> -->
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    ref="password"
                    @keyup.enter.native="tab('verifycode')"
                    v-model="formLogin.password"
                    placeholder="密码"
                  >
                    <d2-icon slot="prepend" name="keyboard-o" />
                  </el-input>
                </el-form-item>
                <el-form-item prop="verifycode">
                  <el-input
                    type="text"
                    @keyup.enter.native="submit"
                    ref="verifycode"
                    v-model="formLogin.verifycode"
                    placeholder="验证码"
                  >
                    <template slot="append">
                      <img class="login-code" @click="VerifyCode_Get" :src="verifyimg" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-button size="default" @click="submit" type="primary" class="button-login">登录</el-button>
              </el-form>
            </el-card>
          </div>
        </div>
        <div class="page-login--content-footer"></div>
      </div>
    </div>
    <!-- 		<el-dialog title="请选择院区\工作组" :visible.sync="dialogVisible" width="30%">
			<el-form ref="form" label-width="80px">
				<el-form-item label="院区">
					<mk-select v-model="hospitalid" :datas="hospitalidList" :filter="['accessname']" label="accessname" val="accessid"></mk-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="setHospitalid">确 定</el-button>
			</span>
    </el-dialog>-->
  </div>
</template>

<script>
import util from "@/libs/util.js";
import dayjs from "dayjs";
import { mapActions, mapState } from "vuex";
import localeMixin from "@/locales/mixin.js";
import MD5 from "@/libs/util.md5.js";
export default {
  mixins: [localeMixin],
  data() {
    return {
      timeInterval: null,
      time: dayjs().format("HH:mm:ss"),
      // 快速选择用户
      dialogVisible: false,
      users: [
        {
          name: "Admin",
          username: "admin",
          password: "admin"
        },
        {
          name: "Editor",
          username: "editor",
          password: "editor"
        },
        {
          name: "User1",
          username: "user1",
          password: "user1"
        }
      ],
      hospitalid: "",
      hospitalidList: [], //院区列表
      listworkgroupinfo: [], //工作组列表
      wgid: "", //工作组id
      appList: [],
      appid: "", //应用id
      userinfo: {},
      // 表单
      verifyimg: "",
      formLogin: {
        username: "",
        password: "",
        verifycode: "",
        verifycodekey: ""
      },
      // 表单校验
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        verifycode: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState("d2admin/user", ["info"])
  },
  created() {
    this.VerifyCode_Get();
  },
  mounted() {
    this.timeInterval = setInterval(() => {
      this.refreshTime();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
  },
  methods: {
    ...mapActions("d2admin/account", ["login"]),
    ...mapActions("d2admin/user", ["set"]),
    //回车焦点换行到下一个表单
    tab(el) {
      this.$refs[el].focus();
      this.$refs[el].select();
    },
    //获取验证码
    VerifyCode_Get() {
      console.log( this.MK)
      this.MK.Request("/Publics/Common/VerifyCode", "get", {}).then(res => {
        if (res.code == 0) {
          let data = res.data;
          this.formLogin.verifycodekey = data.key;
          this.verifyimg = `data:image/png;base64,${data.img}`;
        }
      });
    },
    change(e) {
      this.$forceUpdate();
    },
    refreshTime() {
      this.time = dayjs().format("HH:mm:ss");
    },
    /**
     * @description 接收选择一个用户快速登录的事件
     * @param {Object} user 用户信息
     */
    handleUserBtnClick(user) {
      this.formLogin.username = user.username;
      this.formLogin.password = user.password;
      this.submit();
    },
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 登录
          // 注意 这里的演示没有传验证码
          // 具体需要传递的数据请自行修改代码
          this.login({
            username: this.formLogin.username,
            password: this.getCurPwd(),
            verifycode: this.formLogin.verifycode,
            verifycodekey: this.formLogin.verifycodekey
          })
            .then(res => {
              console.log(res);
                this.userinfo = res;
                this.hospitalidList = res.listhospitalinfo;
                let isJump = this.isJump();
                console.log(isJump);
                this.setDataJump(isJump);
              
            })
            .catch(error=> {
              this.VerifyCode_Get();
            });
        } else {
          this.VerifyCode_Get();
          // 登录表单校验失败
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    //判断医院列表length长度如果是1 继续判断工作组列表长度如果length是1 继续判断应用列表长度如果全部为1 直接设置数据进入系统 否则跳入选择操作界面
    isJump() {
      let flag = 0;
      if (
        this.hospitalidList.length == 1 &&
        this.hospitalidList[0].listappinfo.length == 1
      ) {
        let hospitalid = this.hospitalidList[0].hospitalid;
        let hospitalname = this.hospitalidList[0].hospitalname;
        let shortname = this.hospitalidList[0].shortname;
        // let wgid = this.hospitalidList[0].listworkgroupinfo[0].wgid;
        // let wgname = this.hospitalidList[0].listworkgroupinfo[0].wgname;
        let wgid = "";
        let wgname = "";
        let appid = this.hospitalidList[0].listappinfo[0].appid;
        let appname = this.hospitalidList[0].listappinfo[0].appname;
        this.set({
          ...this.info,
          hospitalid,
          hospitalname,
          shortname,
          wgid,
          wgname,
          appid,
          appname
        });
        flag = 1;
      } else if (this.hospitalidList.length == 0) {
        flag = "没有授予对应的院区权限";
      } else if (this.hospitalidList[0].listappinfo.length == 0) {
        flag = "没有授予对应的应用权限";
      } else if (this.hospitalidList.length > 1) {
        // if(this.hospitalidList[0].listappinfo.length == 0) {
        // 	flag = '没有授予对应的应用权限'
        // }else{
        // let hospitalid = this.hospitalidList[0].hospitalid;
        // let hospitalname = this.hospitalidList[0].hospitalname;
        // let wgid = '';
        // let wgname = '';
        // let appid = this.hospitalidList[0].listappinfo[0].appid;
        // let appname = this.hospitalidList[0].listappinfo[0].appname;
        // this.set({...this.info,hospitalid,hospitalname,wgid,wgname,appid,appname});
        flag = 0;
        // }
      } else {
        flag = 0;
      }
      return flag;
    },
    setDataJump(flag) {
      //flag 1 直接跳转首页 0跳转到选择院区/工作组和应用界面
      if (flag == 1) {
        util.cookies.set("token", this.info.userid);
        this.$router.replace(this.$route.query.redirect || "/");
      } else if (flag == 0) {
        this.$router.replace(this.$route.query.redirect || "/application");
      } else {
        this.$message.error(flag);
      }
    },
    Md5Encrypt32(val) {
      return val.MD5(32).toUpperCase();
    },
    getCurPwd() {
      let username = this.Md5Encrypt32(this.formLogin.username).substring(
        2,
        18
      );
      let pwd = this.Md5Encrypt32(this.formLogin.password).substring(2, 18);
      let curPwd = username + pwd;
      return this.Md5Encrypt32(pwd);
    }
  }
};
</script>

<style lang="scss" scoped>
.page-login {
  @extend %unable-select;
  $backgroundColor: #f0f2f5;
  // ---
  background-color: $backgroundColor;
  height: 100%;
  position: relative;

  ::v-deep .el-dialog__body {
    padding: 30px 20px !important;
  }

  // 层
  .page-login--layer {
    @extend %full;
    overflow: auto;
  }

  .page-login--layer-area {
    overflow: hidden;
  }

  // 时间
  .page-login--layer-time {
    font-size: 24em;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }

  // 登陆页面控件的容器
  .page-login--content {
    height: 100%;
    min-height: 500px;
  }

  // header
  .page-login--content-header {
    padding: 1em 0;

    .page-login--content-header-motto {
      margin: 0px;
      padding: 0px;
      color: $color-text-normal;
      text-align: center;
      font-size: 12px;
    }
  }

  // main
  .page-login--logo {
    width: 240px;
    margin-bottom: 2em;
    margin-top: -8.5em;
  }

  // 登录表单
  .page-login--form {
    width: 280px;

    // 卡片
    .el-card {
      margin-bottom: 15px;
    }

    // 登录按钮
    .button-login {
      width: 100%;
    }

    // 输入框左边的图表区域缩窄
    .el-input-group__prepend {
      padding: 0px 14px;
    }

    .login-code {
      height: 40px - 2px;
      display: block;
      margin: 0px -20px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }

    // 登陆选项
    .page-login--options {
      margin: 0px;
      padding: 0px;
      font-size: 14px;
      color: $color-primary;
      margin-bottom: 15px;
      font-weight: bold;
    }

    .page-login--quick {
      width: 100%;
    }
  }

  // 快速选择用户面板
  .page-login--quick-user {
    @extend %flex-center-col;
    padding: 10px 0px;
    border-radius: 4px;

    &:hover {
      background-color: $color-bg;

      i {
        color: $color-text-normal;
      }

      span {
        color: $color-text-normal;
      }
    }

    i {
      font-size: 36px;
      color: $color-text-sub;
    }

    span {
      font-size: 12px;
      margin-top: 10px;
      color: $color-text-sub;
    }
  }

  // footer
  .page-login--content-footer {
    padding: 1em 0;

    .page-login--content-footer-locales {
      padding: 0px;
      margin: 0px;
      margin-bottom: 15px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;

      a {
        color: $color-text-normal;
        margin: 0 0.5em;

        &:hover {
          color: $color-text-main;
        }
      }
    }

    .page-login--content-footer-copyright {
      padding: 0px;
      margin: 0px;
      margin-bottom: 10px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;

      a {
        color: $color-text-normal;
      }
    }

    .page-login--content-footer-options {
      padding: 0px;
      margin: 0px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;

      a {
        color: $color-text-normal;
        margin: 0 1em;
      }
    }
  }

  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;

    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #fff;
      animation: animate 25s linear infinite;
      bottom: -200px;

      @keyframes animate {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }

        100% {
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }

      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }

      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }

      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }

      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }

      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }

      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }

      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }

      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }

      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }

      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
}
</style>
