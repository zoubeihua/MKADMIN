<template>
  <el-dialog :fullscreen="true" :visible.sync="drawer" @close="close">
    <div slot="title">
      会员视图 - [
      <span
        style="color:red;"
      >会员等级 ： {{memberBasicinfo.memberlevel_display}} 会员卡号：{{memberBasicinfo.memberno}} 会员姓名：{{memberBasicinfo.membername}} 性别：{{memberBasicinfo.sex_dispalay}} 年龄：{{memberBasicinfo.age}}</span> ]
    </div>
    <el-container>
      <el-aside style="background-color:#545c64;" width="200px">
        <el-scrollbar style="height:100%;">
          <mk-menu @change="menuChange" default-active="baseinfo"	 background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :list="menuData" v-if="drawer"></mk-menu>
        </el-scrollbar>
      </el-aside>
      <el-main style="padding:0;" >
        <!-- 基本信息 -->
        <base-info :userData="memberBasicinfo" v-if="curPage === 'baseinfo'"></base-info>
        <!-- 会员权益 -->
        <member-shipinterests :userData="memberBasicinfo" v-else-if="curPage === 'membershipinterests'"></member-shipinterests>
        <!-- 会员缴费 -->
        <member-payment :userData="memberBasicinfo" v-else-if="curPage === 'memberpayment'"></member-payment>
        <!-- 就诊记录 -->
        <visitre-cords :userData="memberBasicinfo" v-else-if="curPage === 'visitrecords'"></visitre-cords>
        <!-- 问卷评估 -->
        <question-eva  :userData="memberBasicinfo" v-else-if="curPage === 'questioneva'"></question-eva>
        <!-- 体检评估 -->
        <phy-eva :userData="memberBasicinfo" v-else-if="curPage === 'phyeva'"></phy-eva>
        <!-- 健康方案 -->
        <health-pro  :userData="memberBasicinfo" v-else-if="curPage === 'healthpro'"></health-pro>
        <!-- 服务记录 -->
        <srv-record :userData="memberBasicinfo" v-else-if="curPage === 'srvrecord'"></srv-record>
        <!-- 方案实施 -->
        <pro-force  :userData="memberBasicinfo" v-else-if="curPage === 'proforce'"></pro-force>
        <mk-empty v-else style="margin-top:100px;"></mk-empty>
      </el-main>
    </el-container>
  </el-dialog>
</template>
<script>
import MkMenu from "@c/mk-form/mk-menu";
import { menuData } from "./menudata";
import BaseInfo from "./page/baseinfo";
import HealthPro from "./page/healthpro";
import MemberPayment from "./page/memberpayment";
import MemberShipinterests from "./page/membershipinterests";
import PhyEva from "./page/phyeva";
import ProForce from "./page/proforce";
import QuestionEva from "./page/questioneva";
import SrvRecord from "./page/srvrecord";
import VisitreCords from "./page/visitrecords";
import dayjs from "dayjs";
export default {
  name: "memberview",
  props: {
    userdata: {
      type: Object,
      default: () => {}
    },
    value:{
      type:Boolean,
      default:() => false
    }
  },
  components: {
    MkMenu,
    BaseInfo,
    HealthPro,
    MemberPayment,
    MemberShipinterests,
    PhyEva,
    ProForce,
    QuestionEva,
    SrvRecord,
    VisitreCords
  },
  data() {
    return {
      curPage: "",
      drawer: this.value,
      memberBasicinfo: {},
      isCollapse: false,
      menuData
    };
  },
  methods: {
    menuChange(path) {
      this.curPage = path;
    },
    //关闭
    close() {
      this.drawer = false;
      this.$emit("update:userdata", {});
    },
  },
  watch: {
    userdata: {
      deep: true,
      handler(val) {
        this.memberBasicinfo = val;
      }
    },
    drawer(val){
      if(val){
        this.curPage = "baseinfo"
      }else{
        this.curPage = ""
      }
      this.$emit('input',val)
    },
    value(val){
      this.drawer = val;
    }
  }
};
</script>
<style  scoped>
>>> .el-scrollbar__wrap {
  overflow-x: hidden;
}
>>> .el-dialog__body{
height:calc(100% - 56px)
}
>>> .el-menu{
  border:0
}
</style>
