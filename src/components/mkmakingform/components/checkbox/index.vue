<template>
  <div>
    <div>
      <el-checkbox-group
        v-model="value.value"
        @change="handleCheckedChange"
        :style="{width: isTable ? '100%' : element.options.width}"
        :disabled="!edit || element.options.disabled"
      >
        <div
          v-for="(item, index) in element.options.options"
          :key="index"
          :style="{display: element.options.inline ? 'inline-block' : 'block'}"
        >
          <el-checkbox
            :label="item.value"
            :key="item.value + index"
          >{{element.options.showLabel ? item.label : item.value}}</el-checkbox>
          <el-input
            v-show="item.inputbox && item.checked"
            style="width:120px;"
            v-model="value.remark[item.value]"
            @input="onInput($event,item)"
          ></el-input>
        </div>
      </el-checkbox-group>
    </div>
    <div v-if="element.options.score == 1 && element.options.scoreHidden">
      <el-alert type="success" :closable="false">
        <div slot="title" style="font-size:16px;">评分：{{value.score}}</div>
      </el-alert>
    </div>
  </div>
</template>
<script>
export default {
  name: "m-checkbox",
  props: ["element", "value", "isTable", "edit"],
  data() {
    return {
      options: []
    };
  },
  created() {},
  methods: {
    handleCheckedChange(val) {
      this.$emit("input", { ...this.value, value: val });
    },
    onInput(val, item) {
      this.value.remark[item.value] = val;
      console.log(this.value.remark);
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log(val.value);
        let vals = val.value;
        let score = 0;
        this.options = [];
        for (let i = 0; i < this.element.options.options.length; i++) {
          let Arr = this.element.options.options[i];
          this.$set(Arr, "checked", false);
          for (let j = 0; j < vals.length; j++) {
            if (Arr.value == vals[j]) {
              this.options.push(Arr);
              if (this.element.options.score == 1) {
                score += Arr.SCORE;
              }
              this.$set(Arr, "checked", true);
            }
          }
          if (Arr.inputbox) {
            if (Arr.checked) {
              this.value.remark[Arr.value] = val.remark[Arr.value];
            } else {
              this.value.remark[Arr.value] = undefined;
            }
          }
        }

        this.value.score = score;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
