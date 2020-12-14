<template>
  <el-input type="text" v-bind:value="showValue(value)" @input="updateValue($event)" />
</template>

<script>
export default {
  props: ["value"],
  methods: {
    showValue(value) {
      if (!!!value) {
        return "0";
      }
      return (value + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
    },
    updateValue(el) {
      var value = el;
      value = value
        .replace(/[^\d.]/g, "")
        .replace(/\.{2,}/g, ".")
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".")
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      if (value.indexOf(".") < 0 && value != "") {
        //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (value.substr(0, 1) == "0" && value.length == 2) {
          value = value.substr(1, value.length);
        }
      }
      value = value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");

      this.$emit("input", value);
    }
  }
};
</script>
