<template>
  <div class="phone">
    <div class="statusbar"></div>
    <div class="phoneContent">
      <!-- 富文本 -->
      <!-- <div v-html="ActivityForm.contents" class="ql-editor"></div> -->
      <!-- 表单 -->
      <template v-if="ActivityForm.discrf==1">
        <div class="crfConten">
          <fm-generate-form :edit="true" :data="jsonData" ref="generateForm" :key="jsonData.key"></fm-generate-form>
        </div>
      </template>
      <!-- 注册 -->
<!--      <div
        class="registerBox"
        v-if="ActivityForm.disreg==1"
        :style="{background: !!ActivityForm.regbackpic?'url( '+ ActivityForm.regbackpic +')':'#005bea',backgroundSize: 'cover'}"
      >
        <div class="box1">
          <p class="titel">
            <span>快速注册</span>
          </p>
          <el-form ref="regForm" :model="regForm" :rules="rules">
            <el-form-item>
              <el-input v-model="regForm.membername" placeholder="请输入您的姓名"></el-input>
            </el-form-item>
            <el-form-item prop="sex">
              <mk-select
                placeholder="请选择性别"
                url="/Publics/Common/Dic/StandCode"
                :clearable="false"
                v-model="regForm.sex"
                :param="{ codetype: '性别' }"
                :filter="['bzname', 'filterstr']"
                label="bzname"
                val="bzcode"
              ></mk-select>
            </el-form-item>
            <el-form-item prop="age">
              <el-input v-model.number="regForm.age" type="number" placeholder="请输入您的年龄"></el-input>
            </el-form-item>
            <el-form-item prop="mobiletel">
              <el-input v-model.number="regForm.mobiletel" type="number" placeholder="请输入您的手机号码"></el-input>
            </el-form-item>
          </el-form>
          <div class="regButton">提交</div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "phone",
  props: {
    newActivityForm: {
      type: Object,
      default: () => {}
    },
    jsonData: {
      type: Object,
      default: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
          customClass: ""
        },
        key: new Date().getTime()
      }
    }
  },
  watch: {
    newActivityForm: {
      deep: true,
      handler(val) {
        this.ActivityForm = val;
      }
    }
  },
  mounted() {},
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
      callback();
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
      ActivityForm: this.newActivityForm,
      regForm: {
        sex: "",
        membername: "",
        age: "",
        mobiletel: "",
        birthday: "",
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
            message: "请输入手机号",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {}
};
</script>
<style scoped>
</style>
<style lang="scss" scoped>
.registerBox {
  width: 100%;
  padding: 5% 0;
  height: auto;
  text-align: center;

  padding-top: 15px;
  .box1 {
    width: 90%;
    margin: 0px auto;
    border-radius: 20px;
    height: auto;
    padding: 5%;
    background: rgba(255, 255, 255, 0);
    color: #fff;
    .regInput {
      padding: 8px 10px;
      margin-top: 20px;
      border-radius: 20px;
      border: 1px solid #fff;
      background: #fff;
      width: 90%;
      margin-left: auto;
      margin-right: auto;
      &:focus {
        outline: none;
        border: #005bea 1px solid;
        box-shadow: 0 0 2px 0 #04befe;
      }
    }
    .regButton {
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
    .titel {
      text-align: center;
      margin-bottom: 20px;
      span {
        padding: 0 10px;
        color: #07acb6;
      }

      &::before,
      &::after {
        content: "";
        width: 20px;
        height: 12.5px;
        display: inline-block;
        background: url("../images/title.png");
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }
}
.phone {
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
  .phoneContent {
    height: 100%;
    overflow-y: auto;
    background: #fff;
    margin-top: 20px;
  }
  ::-webkit-scrollbar {
    width: 0;
  }
  &::before {
    content: "";
    width: 60px;
    height: 10px;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    margin-left: -30px;
    background: #333;
    top: 50px;
  }
  &::after {
    content: "";
    position: absolute;
    width: 60px;
    height: 60px;
    left: 50%;
    margin-left: -30px;
    bottom: 20px;
    border-radius: 100%;
    box-sizing: border-box;
    border: 5px solid #333;
  }
  .statusbar {
    position: absolute;
    width: 320px;
    height: 20px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAAoCAIAAADhf9zeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6REEyN0EzRUU1QzM3MTFFNEE1ODA5RkNEOEU4MEU4ODYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REEyN0EzRUY1QzM3MTFFNEE1ODA5RkNEOEU4MEU4ODYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEQTI3QTNFQzVDMzcxMUU0QTU4MDlGQ0Q4RTgwRTg4NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEQTI3QTNFRDVDMzcxMUU0QTU4MDlGQ0Q4RTgwRTg4NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuHAU7gAAA6nSURBVHja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);
    left: 50%;
    margin-left: -160px;
    top: 100px;
    -webkit-background-size: 100% auto;
    background-size: 100% auto;
  }
}
</style>
<style scoped>
>>> .ql-editor {
  min-height: 0px;
  height: auto;
}
.crfConten >>> .el-container {
  height: auto !important;
}
>>> .ql-editor img {
  max-width: 100%;
  min-width: 100%;
}
</style>