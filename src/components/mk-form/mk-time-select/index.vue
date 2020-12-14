<template>
  <div>
    <div class="el-select" @click="Inputfocus">
      <div class="el-select__tags" ref="selectTags">
        <span>
          <el-tag
            v-for="(tag,index) in timeTags"
            :disable-transitions="false"
            @close="tagClose(index)"
            :key="index"
            closable
            size="small"
            type="success"
          >{{tag}}</el-tag>
        </span>
      </div>
      <div class="el-input el-input--suffix" :class="{'is-disabled' : disabled}">
        <input
          type="text"
          readonly="readonly"
          :disabled="disabled"
          @focus="show"
          ref="focus"
          v-clickoutside="handleClose"
          :style="{height:inputH + 'px'}"
          autocomplete="off"
          placeholder
          class="el-input__inner"
        />
      </div>
    </div>
    <div ref="listWrap" v-show="visible">
      <select-time
        :visible="visible"
        @confirm="change"
        @close="visible = false"
        :timeArrowControl="true"
      ></select-time>
    </div>
  </div>
</template>
<script>
import Clickoutside from "./clickoutside";
import SelectTime from "./time";
export default {
  name: "mk-time-select",
  components: {
    SelectTime
  },
  directives: { Clickoutside },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      visible: false,
      time: "",
      inputH: 40,
      timeTags: this.value,
      curTags: this.value,
      selectableRange: [],
      currentScrollbar: null,
      date: new Date()
    };
  },
  computed: {
    popperElm() {
      return this.$refs.listWrap;
    }
  },
  watch: {
    value(val) {
      this.timeTags = val;
      this.curTags = val;
      this.$nextTick(() => {
        setTimeout(() => {
          let HeightInput = this.$refs.selectTags.offsetHeight;
          if (HeightInput < 40) {
            this.inputH = 40;
          } else {
            this.inputH = HeightInput;
          }
        }, 350);
      });
    },
    timeTags(val) {
      this.$emit("input", val);
    }
  },
  created() {},
  mounted() {},
  methods: {
    Inputfocus() {
      this.$refs.focus.focus();
    },
    handleClose() {
      if (!this.visible) return;
      this.visible = false;
    },
    tagClose(index) {
      this.timeTags.splice(index, 1);
      this.curTags.splice(index, 1);
      this.$nextTick(() => {
        setTimeout(() => {
          let HeightInput = this.$refs.selectTags.offsetHeight;
          if (HeightInput < 40) {
            this.inputH = 40;
          }
        }, 400);
        this.$emit("input", this.timeTags);
      });
    },
    show() {
      this.visible = true;
    },
    hiden() {
      this.visible = false;
    },
    change(date, HM, visible, first) {
      this.visible = false;
      this.curTags.push(HM);
      var res = this.curTags.filter(function(item, index, array) {
        return array.indexOf(item) === index;
      });
      this.timeTags = res;
      this.$emit("input", this.timeTags);
      this.$nextTick(() => {
        let HeightInput = this.$refs.selectTags.offsetHeight;
        if (HeightInput > 40) {
          this.inputH = HeightInput;
        }
      });
    },
    SelectRange(start, end) {
      console.log(start, end);
    }
  }
};
</script>
<style  scoped>
>>> .el-tag.el-tag--success .el-tag__close {
  color: #f0f9eb;
}
</style>
