<template>
        <el-form
          label-width="120px"
          :model="fromData"
          :rules="rules"
          ref="fromData"
          :disabled="fromData.status > 2"
        >
          <el-form-item label="优惠券名称" prop="couponname">
            <el-input placeholder="" v-model="fromData.couponname" />
          </el-form-item>
          <el-form-item label="优惠券描述">
            <el-input
              placeholder=""
              v-model="fromData.note"
              type="textarea"
              :rows="3"
            />
          </el-form-item>

          <el-form-item label="优惠券类型" prop="coupontype">
            <mk-select
              url="1"
              :globalFn="true"
              :param="{ codetype: '优惠券类型' }"
              :filter="['bzname', 'filterstr']"
              width="160px"
              label="bzname"
              val="bzcode"
              placeholder="优惠券类型"
              v-model="fromData.coupontype"
              @change="getCoupontype"
            ></mk-select>
          </el-form-item>
          <!-- 1 项目 2 折扣 3满减 4立减 -->
          <template
            v-if="
              fromData.coupontype == 1 ||
                fromData.coupontype == 3 ||
                fromData.coupontype == 4
            "
          >
            <el-form-item label="券面额" prop="discountamount">
              <el-input-number
                placeholder=""
                v-model="fromData.discountamount"
                :precision="2"
                :min="0"
                :step="100"
              ></el-input-number>
            </el-form-item>
          </template>
          <template
            v-if="
              fromData.coupontype == 1 ||
                fromData.coupontype == 3 ||
                fromData.coupontype == 2
            "
          >
            <el-form-item label="满减额" prop="reduceamount">
              <el-input-number
                placeholder=""
                v-model="fromData.reduceamount"
                :precision="2"
                :min="0"
                :step="100"
              ></el-input-number>
            </el-form-item>
          </template>
          <template v-if="fromData.coupontype == 2">
            <el-form-item label="折扣比例" prop="discountratio">
              <el-input-number
                placeholder=""
                v-model="fromData.discountratio"
                :max="100"
                :min="0"
                :step="10"
                :precision="0"
              ></el-input-number>
              <span class="tipSmall">请输入0-100之间的整数</span>
            </el-form-item>
          </template>

          <el-form-item label="允许分享" prop="allowshare">
            <el-switch
              label=""
              v-model="fromData.allowshare"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item label="发放总量">
            <el-input-number
              placeholder=""
              v-model="fromData.totalquantity"
              :min="1"
              step-strictly
            ></el-input-number>
          </el-form-item>
          <el-form-item label="生效日期" prop="effectivedate">
            <el-date-picker
              placeholder=""
              v-model="fromData.effectivedate"
              :picker-options="startDatePicker"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="失效日期" prop="effectivedate">
            <el-date-picker
              placeholder=""
              v-model="fromData.expirationdate"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="优惠券图片">
              <img-upload
                :is-delete="memberRead ? false : true"
                :width="178"
                :height="178"
                :limit="1"
                @input="handleMemberPhotoInput"
                img-style="2"
                :is-empty="isPortraitEmpty"
                :uploadByCamera="false"
                :value="fromData.img"
              ></img-upload>
            </el-form-item> -->
        </el-form>
</template>

<script>
import imgUpload from "@/components/mk-form/Upload/index.vue";

export default {
  name: "couponMaintain",
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  components: { imgUpload },
  data() {
    return {
      startDatePicker: this.beginDate(),
      pickerOptions: this.endDate(),
      memberRead: false,
      isPortraitEmpty: false,
      imageUrl: "",
      fromData: {
        operatetype: "C",
        couponid: -1,
        allowshare: 0,
        couponname: "",
        coupontype: "1",
        discountamount: 0.0,
        effectivedate: "",
        enterid: "",
        expirationdate: "",
        note: "",
        orderno: 0,
        reduceamount: 0.0,
        status: 0,
        totalquantity: 0,
        img: [],
        CouponMatch: [],
        discountratio: 0
      },
      rules: {
        couponname: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" }
        ],
        allowshare: [
          { required: true, message: "请选择是否分享", trigger: "blur" }
        ],
        coupontype: [
          { required: true, message: "请选择类型", trigger: "blur" }
        ],
        effectivedate: [
          { required: true, message: "请选择时间", trigger: "blur" }
        ],
        reduceamount: [
          { required: false, message: "请输入满减额", trigger: "blur" }
        ],
        discountratio: [
          { required: false, message: "请输入0-100之间的整数", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    getCoupontype() {
      //1 项目 2 折扣 3满减 4立减
      //discountratio 折扣 reduceamount 满减 discountamount券面额
      let type = this.fromData.coupontype;
      if (type == "1" || type == "3") {
        this.fromData.discountratio = 0;
      } else if (type == "4") {
        this.fromData.reduceamount = 0.0;
        this.fromData.discountratio = 0.0;
      } else if (type == "2") {
        this.fromData.reduceamount = 0.0;
        this.fromData.discountamount = 0.0;
      }
    },
    //控制开始时间
    beginDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.fromData.expirationdate) {
            //如果结束时间不为空，则小于结束时间
            return (
              new Date(self.fromData.expirationdate).getTime() <
                time.getTime() + 1000 * 3600 * 24 || time.getTime() < Date.now()
            );
          } else {
            return time.getTime() < Date.now(); //开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    },
    //控制结束时间
    endDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.fromData.effectivedate) {
            //如果开始时间不为空，则结束时间大于开始时间
            return (
              new Date(self.fromData.effectivedate).getTime() >
                time.getTime() || time.getTime() - 1000 * 3600 * 24 < Date.now()
            );
          } else {
            return time.getTime() - 1000 * 3600 * 24 < Date.now(); //开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    },
    // 会员头像
    handleMemberPhotoInput(data) {
      console.log(data, "img");
      if (data[0]) {
        this.fromData.img = { url: data[0].url };
      } else {
        this.fromData.img = {};
      }
    }
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style scoped>
>>> .el-tabs--top {
  height: calc(100% - 41px);
}
>>> .el-date-editor .el-range-separator {
  width: 8%;
}
>>> .el-select-dropdown__item span {
  width: 20px;
  height: 20px;
  border: 1px solid red;
}
.mr20 {
  margin-right: 20px !important;
}
.base-info-form {
  width: 1220px;
  height: 700px;
  /* border: 1px solid #dcdfe6; */
  margin: 10px auto 0;
  padding: 10px 10px 0 10px;
  border-radius: 8px;
  position: relative;
}
.inputLong {
  width: 670px;
}
.inputMid {
  width: 540px;
}
.inputShort {
  width: 280px;
}
.underLine {
  text-decoration: underline;
  color: #1296db;
  font-weight: bold;
  cursor: pointer;
}
.biaoqian {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}
.biaoqian > i {
  font-size: 30px !important;
  cursor: pointer;
}
.tipSmall {
  color: red;
  font-size: 12px;
  padding-right: 12px;
}
</style>
