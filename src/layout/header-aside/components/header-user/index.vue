<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{
      info.name ? `你好 ${info.name}` : "未登录"
    }}</span>
    <d2-header-password ref="password" />
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5" />
        注销
      </el-dropdown-item>
      <el-dropdown-item @click.native="password">
        <d2-icon name="key" class="d2-mr-5" />
        修改密码
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { get } from 'lodash'
import { mapState, mapActions } from "vuex";
import d2HeaderPassword from "../header-password";
import util from "@/libs/util.js";
import setting from '@/setting.js'
import store from '@/store/index'
export default {
  computed: {
    ...mapState("d2admin/user", ["info"]),
  },
  components:{
    d2HeaderPassword
  },
  created() {
    if (!this.info.name || this.info.name == "未登录") {
      util.cookies.remove("token");
      util.cookies.remove("uuid");
      util.cookies.remove("auth");
      this.set({});
      this.closeAll();
      // 跳转路由
      this.$router.push({
        name: "login",
      });
    }
  },
  methods: {
    ...mapActions("d2admin/account", ["logout"]),
    ...mapActions("d2admin/user", ["set"]),
    ...mapActions("d2admin/page", ["closeAll"]),
    /**
     * @description 登出
     */
    logOff() {
      this.logout({
        confirm: true,
      });
      store.dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'page.opened',
        value:  get(setting, 'page.opened', []),
        user: true
      }, { root: true })
    },
    password(){
      this.$refs.password.handleClick()
    }
  },
};
</script>
