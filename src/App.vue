<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import util from "@/libs/util";
export default {
  name: "app",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  watch: {
    "$i18n.locale": "i18nHandle",
  },
  created() {
    this.i18nHandle(this.$i18n.locale);
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
    i18nHandle(val, oldVal) {
      util.cookies.set("lang", val);
      document.querySelector("html").setAttribute("lang", val);
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/style/public-class.scss";
.tableBtn {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tableBtn i {
  font-size: 18px;
  margin: 0 4px;
}
.tableBtn i.bianji {
  font-size: 16px;
}
.el-container{
  height: 100% !important;
}
</style>
