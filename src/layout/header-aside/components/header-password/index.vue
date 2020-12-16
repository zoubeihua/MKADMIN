<template>
  <div>
    <vxe-modal
      v-model="Modal"
      title="修改密码"
      width="560"
      height="430"
      @close="close"
      min-width="400"
      min-height="320"
      resize
      :showFooter="true"
    >
      <template>
        <el-container>
          <el-form
            :model="ruleForm"
            :rules="rules"
            status-icon
            ref="ruleForm"
            label-width="100px"
            style="width: 100%;"
          >
            <el-form-item label="用户名" prop="loginname">
              <el-input v-model="info.loginname" disabled></el-input>
            </el-form-item>
            <el-form-item label="旧密码" prop="oldpassword">
              <el-input
                :type="iptOldType ? 'text' : 'password'"
                v-model="ruleForm.oldpassword"
                minlength="1"
                maxlength="64"
              >
                <i
                  slot="suffix"
                  class="el-icon-view"
                  :class="[iptNewType ? 'success' : '']"
                  @click="handleRead('old')"
                ></i>
              </el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newpassword">
              <el-input
                :type="iptNewType ? 'text' : 'password'"
                v-model="ruleForm.newpassword"
                autocomplete="off"
                 minlength="1"
                maxlength="64"
              >
                <i
                  slot="suffix"
                  class="el-icon-view"
                  :class="[iptNewType ? 'success' : '']"
                  @click="handleRead('new')"
                ></i>
              </el-input>
              <!-- <el-input :type=" iptNewType ? 'text' : 'password' " v-model="ruleForm.newPassword">
                <el-button slot="append" icon="el-icon-view" @click="handleRead('new')"></el-button>
              </el-input> -->
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmpassword">
              <el-input
                :type="iptConfType ? 'text' : 'password'"
                v-model="ruleForm.confirmpassword"
                autocomplete="off"
                 minlength="1"
                maxlength="64"
              >
                <i
                  slot="suffix"
                  class="el-icon-view"
                  :class="[iptConfType ? 'success' : '']"
                  @click="handleRead('conf')"
                ></i>
              </el-input>
            </el-form-item>
          </el-form>
        </el-container>
      </template>
       <div slot="footer" style="text-align:center;">
         <el-button type="primary" @click="submitForm('ruleForm')"
                >提交</el-button
              >
       </div>
    </vxe-modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import MD5 from "@/libs/util.md5.js";
export default {
  data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.newpassword !== '') {
            this.$refs.ruleForm.validateField('confirmpassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.newpassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      tooltipContent: "修改密码",
      Modal: false,
      iptOldType: false, // 旧密码输入框type
      iptNewType: false, // 新密码输入框type
      iptConfType: false, // 确认密码输入框type
      ruleForm: {
        loginname:"",
        operatetype: "U",
        oldpassword: "",
        newpassword: "",
        confirmpassword: "",
        version: 0
      },
      rules: {
        oldpassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" }
        ],
        newpassword: [
          { required: true, validator: validatePass,  trigger: "blur" }
        ],
        confirmpassword: [
          { required: true, validator: validatePass2,  trigger: "blur" }
        ]
      }
    };
  },
  created(){
  },
  computed: {
    ...mapState("d2admin/user", ["info"])
  },
  methods: {
    handleClick() {
      this.Modal = true;
    },
    handleRead(val) {
      if (val === "old") {
        this.iptOldType = !this.iptOldType;
      }
      if (val === "new") {
        this.iptNewType = !this.iptNewType;
      }
      if (val === "conf") {
        this.iptConfType = !this.iptConfType;
      }
    },
    Md5Encrypt32(val){
      val =val+""
      return val.MD5(32).toUpperCase();
    },
    getCurPwd(name,password){
      let username = this.Md5Encrypt32(name).substring(2, 18);
      let pwd = this.Md5Encrypt32(password).substring(2, 18);
      // let curPwd =  (username + pwd);
      return this.Md5Encrypt32(pwd);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data={
            loginname:this.info.loginname,
            newpassword:this.getCurPwd(this.info.userid+"",this.ruleForm.newpassword),
            oldpassword:this.getCurPwd(this.info.userid+"",this.ruleForm.oldpassword),
           confirmpassword:this.getCurPwd(this.info.userid+"",this.ruleForm.confirmpassword)
          }
          // data.loginname=this.info.loginname;
          // data.newpassword=this.getCurPwd(this.info.userid+"",this.ruleForm.newpassword)
          //  data.oldpassword=this.getCurPwd(this.info.userid+"",this.ruleForm.oldpassword)
          //  data.confirmpassword=this.getCurPwd(this.info.userid+"",this.ruleForm.confirmpassword)

          // return
          this.MK.Request(
            "/Publics/Common/UserChangePassword",
            "post",
            data
          ).then(res => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: res.msg
              });
              this.Modal = false;
              this.$refs[formName].resetFields();
            }
          });
        } else {
          return false;
        }
      });
    },
    close(){
      this.$refs['ruleForm'].resetFields();
       this.iptOldType= false;// 旧密码输入框type
      this.iptNewType= false;// 新密码输入框type
      this.iptConfType= false;// 确认密码输入框type
    }
  }
};
</script>

<style scoped></style>
