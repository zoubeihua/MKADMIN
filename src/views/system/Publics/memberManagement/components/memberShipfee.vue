<template>
  <vxe-modal
    v-model="modal"
    ref="modal"
    resize
    :showFooter="true"
    fullscreen
    width="1680"
    height="940"
    @close="close"
    @zoom="handleZoom"
  >
    <div slot="title">
      会费缴纳 - [
      <span
        style="color:red;"
      >会员等级：{{userData.memberlevel_display}} 会员卡号：{{userData.cardno}} 会员姓名：{{userData.membername}} 性别：{{userData.sex_dispalay}} 年龄：{{userData.age}}</span>
      ]
    </div>
    <SplitPane :min-percent="50" :default-percent="50" split="vertical">
      <!-- 会费信息 -->
      <template slot="paneL">
        <div>
          <el-form
            :model="shipfeeForm"
            ref="shipfeeForm"
            :rules="shipfeeFormRule"
            label-width="100px"
            style="width:100%"
            :inline="true"
          >
            <el-form-item label="会员卡号">
              <el-input
                :class="[modalShrink ?'inputShrink' : 'inputMax']"
                :disabled="true"
                v-model="userData.cardno"
              />
            </el-form-item>
            <el-form-item label="会员姓名">
              <el-input
                :class="[modalShrink ?'inputShrink' : 'inputMax']"
                :disabled="true"
                v-model="userData.membername"
              />
            </el-form-item>
            <el-form-item label="会员类型">
              <el-input
                :class="[modalShrink ?'inputShrink' : 'inputMax']"
                :disabled="true"
                v-model="userData.membertype_display"
              />
            </el-form-item>
            <el-form-item label="当前等级">
              <el-input
                :class="[modalShrink ?'inputShrink' : 'inputMax']"
                :disabled="true"
                v-model="userData.memberlevel_display"
              />
            </el-form-item>
            <el-form-item label="生效日期">
              <el-input
                :class="[modalShrink ?'inputShrink' : 'inputMax']"
                :disabled="true"
                :value="userData.fee_effectivedate ? dateFormat(userData.fee_effectivedate): ''"
              />
            </el-form-item>
            <el-form-item label="失效日期">
              <el-input
                :class="[modalShrink ?'inputShrink' : 'inputMax']"
                :disabled="true"
                :value="userData.fee_expirationdate ? dateFormat(userData.fee_expirationdate) : ''"
              />
            </el-form-item>
            <el-form-item label="缴纳等级" class="custom_label" prop="levelid">
              <mk-select
                :class="[modalShrink ?'inputShrink' : 'inputMax']"
                v-model="shipfeeForm.levelid"
                url="/Publics/MemberManage/Memberlevel"
                :param="{hospitalid:info.hospitalid}"
                placeholder="请选择缴纳等级"
                :filter="['name']"
                label="name"
                val="levelid"
                @change="handleChangeLevel"
              ></mk-select>
            </el-form-item>
            <el-form-item label="生效日期">
              <el-input
                :class="[modalShrink ?'inputShrink' : 'inputMax']"
                :disabled="true"
                :value="assignDateAddOneDay(dateFormat(userData.fee_expirationdate))"
              />
            </el-form-item>
            <el-form-item label="失效日期">
              <el-input
                :class="[modalShrink ?'inputShrink' : 'inputMax']"
                :disabled="true"
                :value="assignDateAddOneYear(assignDateAddOneDay(dateFormat(userData.fee_expirationdate)))"
              />
            </el-form-item>
            <div>
              <div
                class="payment_tip"
                :class="[ modalShrink ? 'payment_bar_shrink' : 'payment_bar_max' ]"
              >
                <span>每次支付最多可选两种支付方式</span>
              </div>
              <div class="payment_item">
                <div class="payment_icon">
                  <img
                    style="margin-right:90px"
                    src="../../../../../../public/image/theme/line/logo/cash.png"
                  />
                  <img
                    style="margin-right:70px"
                    src="../../../../../../public/image/theme/line/logo/yinlian.png"
                  />
                  <img src="../../../../../../public/image/theme/line/logo/alipay.png" />
                  <img src="../../../../../../public/image/theme/line/logo/wxpay.png" />
                </div>
                <el-checkbox-group
                  v-model="checkedPayment"
                  :min="0"
                  :max="2"
                  @change="handleCheckboxChange"
                >
                  <el-checkbox
                    style="margin-right:90px;"
                    v-for="item in paymenttypeArr"
                    :label="item.bzname"
                    :key="item.bzcode"
                  >{{item.bzname}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="payment_item">
                <el-form-item label="应缴金额">
                  <el-input style="width:500px" :disabled="true" v-model="shipfeeForm.membership">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="checkedPayment[0]" prop="payamount" v-if="checkedPayment[0]">
                  <el-input class="input_bg" style="width:500px" v-model="shipfeeForm.payamount">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="checkedPayment[1]" prop="payamount2" v-if="checkedPayment[1]">
                  <el-input class="input_bg" style="width:500px" v-model="shipfeeForm.payamount2">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </template>
      <!-- 会费相关权益 -->
      <template slot="paneR">
        <el-container>
          <!-- <el-main> -->
          <el-tabs v-model="activeName" >
            <el-tab-pane label="当前权益" name="first">
              <el-table :data="curRightsTableData" stripe border highlight-current-row height="calc(100% - 40px)">
                <el-table-column
                  show-overflow-tooltip
                  align="left"
                  label="名称"
                  prop="rightsname"
                  width="300"
                />
                <el-table-column
                  show-overflow-tooltip
                  align="center"
                  label="规格"
                  prop="specification"
                />
                <el-table-column show-overflow-tooltip align="center" label="单位" prop="unit" />
                <el-table-column
                  show-overflow-tooltip
                  align="center"
                  label="单价"
                  :formatter="(i=>projectAmountsTabel(i,'price'))"
                  prop="price"
                />
                <el-table-column
                  show-overflow-tooltip
                  align="center"
                  label="权益数量"
                  prop="rightsamount"
                />
                <el-table-column
                  show-overflow-tooltip
                  align="center"
                  label="剩余"
                  prop="unusedamount"
                />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="缴纳权益" name="second">
              <el-table :data="paymentRightsTableData" stripe highlight-current-row height="calc(100% - 40px)">
                <el-table-column
                  show-overflow-tooltip
                  align="left"
                  label="名称"
                  prop="itemname"
                  width="300"
                />
                <el-table-column
                  show-overflow-tooltip
                  align="center"
                  label="规格"
                  prop="specification"
                />
                <el-table-column show-overflow-tooltip align="center" label="单位" prop="unit" />
                <el-table-column
                  show-overflow-tooltip
                  align="center"
                  label="单价"
                  :formatter="(i=>projectAmountsTabel(i,'price'))"
                  prop="price"
                />
                <el-table-column show-overflow-tooltip align="center" label="权益数量" prop="amount" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="查看知情同意书" name="third" style="overflow:auto;">
              <div style="overflow:auto;height:100%">
              <el-checkbox v-model="isPrint" />
              <span>&nbsp;打印知情同意书</span>
              <consent-doc style="height:calc(100% - 21px)" :userData.sync="userData" />
              </div>
            </el-tab-pane>
          </el-tabs>
          <!-- </el-main> -->
          <el-footer>
            <!-- 当前权益 -->
            <mk-page v-if="activeName == 'first'" :pager="curRights" @query="refreshCurRights" />
            <!-- 缴纳权益 -->
            <mk-page
              v-if="activeName == 'second'"
              :pager="paymentRights"
              @query="refreshPaymentRights"
            />
          </el-footer>
        </el-container>
      </template>
    </SplitPane>
    <div slot="footer" style="text-align:center">
      <el-button type="success" @click="Submit">提交</el-button>
      <el-button type="warning" @click="close">取消</el-button>
    </div>
  </vxe-modal>
</template>

<script>
// 金额校验
const money = (rule, value, callback) => {
  var reg = /^\d+.?\d{0,2}$/;
  if (!value) {
    return callback(new Error("金额不能为空"));
  }
  setTimeout(() => {
    if (isNaN(value)) {
      callback(new Error("请输入数字值"));
    } else {
      if (!reg.test(value)) {
        callback(new Error("小数点后最多保留两位"));
      } else {
        callback();
      }
    }
  }, 100);
};
import ConsentDoc from "./consentDoc";
import utils from "@/minxins/util.js";
export default {
  name: "memberShipfee",
  props: {
    userData: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [utils],
  data() {
    return {
      isPrint: false,
      memberBasicinfo: {},
      modal: false,
      modalShrink: false,
      curLv: "",
      inputWidth: 0,
      activeName: "first",
      curRightsTableData: [],
      paymentRightsTableData: [],
      paymenttypeArr: [],
      checkedPayment: [],
      curRights: {
        rows: 20,
        page: 1,
        tag: 0,
        count: 0
      },
      paymentRights: {
        rows: 20,
        page: 1,
        tag: 0,
        count: 0
      },
      shipfeeForm: {
        effect: "",
        membership: "", // 应缴金额
        actualfee: "", // 实际缴纳金额
        month: 12, // 当前默认12个月
        membertypeid: "", // 缴费后的会员类型
        levelid: "", // 缴费后的会员等级
        memberid: "", // 会员id
        paymenttype: "", // 支付类型1
        payamount: "",
        paymenttype2: "", // 支付类型2
        payamount2: "",
        printreceipt: 0 // 打印收据、次数
      },
      shipfeeFormRule: {
        payamount: [{ required: true, validator: money, trigger: "blur" }],
        payamount2: [{ required: true, validator: money, trigger: "blur" }],
        levelid: [
          { required: true, message: "请选择需要缴纳的等级", trigger: "change" }
        ],
        paymenttype: [
          { required: true, message: "请选择支付方式", trigger: "change" }
        ]
      }
    };
  },
  components: {
    ConsentDoc
  },
  created() {
    this.paymenttypeArr = this.getDicStandarDcode("支付方式");
  },
  methods: {
    async open() {
      this.modal = true;
      this.$refs.modal.maximize();
      this.$refs.shipfeeForm.resetFields();
      this.$refs.shipfeeForm.clearValidate();
    },
    close() {
      this.modal = false;
      this.$emit("update:userdata", {});
    },
    handleCheckboxChange(val) {
      if (val[0]) {
        this.shipfeeForm.paymenttype = this.paymenttypeArr.filter(item => {
          if (item.bzname == val[0]) {
            return item;
          }
        })[0].bzcode;
      } else {
        this.shipfeeForm.paymenttype = "";
        this.shipfeeForm.payamount = "";
      }
      if (val[1]) {
        this.shipfeeForm.paymenttype2 = this.paymenttypeArr.filter(item => {
          if (item.bzname == val[1]) {
            return item;
          }
        })[0].bzcode;
      } else {
        this.shipfeeForm.paymenttype2 = "";
        this.shipfeeForm.payamount2 = "";
      }
      console.log(val, this.shipfeeForm);
    },
    // 模态框改变尺寸
    handleZoom(type, e) {
      if (type.type == "revert") {
        this.modalShrink = true;
      } else {
        this.modalShrink = false;
      }
    },
    Submit() {
      if (!this.checkedPayment.length) {
        this.$message({
          message: "请至少选择一种支付方式",
          type: "warning"
        });
      } else {
        this.MemberShipfee_Post();
      }
    },
    // 提交
    MemberShipfee_Post() {
      let data = {};
      data.actualfee =
        Number(this.shipfeeForm.payamount) +
        Number(this.shipfeeForm.payamount2);
      data.membership = this.shipfeeForm.membership;
      data.month = this.shipfeeForm.month;
      data.membertypeid = this.memberBasicinfo.membertypeid || 3;
      data.memberid = this.memberBasicinfo.memberid;
      data.paymenttype = this.shipfeeForm.paymenttype;
      data.payamount = this.shipfeeForm.payamount;
      if (this.checkedPayment.length == 2) {
        data.paymenttype2 = this.shipfeeForm.paymenttype2;
        data.payamount2 = this.shipfeeForm.payamount2;
      }
      data.printreceipt = this.shipfeeForm.printreceipt;
      data.levelid = this.shipfeeForm.levelid;
      this.$refs.shipfeeForm.validate(valid => {
        if (valid) {
          this.MK.Request(
            "/Hcrm/MemberService/MemberShipFee",
            "post",
            data
          ).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.modal = false;
              this.$emit("refresh");
            }
          });
        }
      });
    },
    refreshCurRights() {
      this.CurMemberRights_Get(this.memberBasicinfo.memberid);
    },
    refreshPaymentRights() {
      this.PaymentRights_Get(this.curLv, this.memberBasicinfo.membertype);
    },
    handleChangeLevel(val) {
      if (val.levelid) {
        this.activeName = "second";
        this.curLv = val.levelid;
        this.PaymentRights_Get(val.levelid, this.memberBasicinfo.membertype);
        this.MemberShipfee_Get(val.levelid);
      } else {
        this.activeName = "first";
        this.paymentRightsTableData = [];
        this.paymentRights.count = 0;
        this.shipfeeForm.membership = "";
      }
    },
    // 获取缴纳权益
    PaymentRights_Get(levelid, membertypeid) {
      this.paymentRights.levelid = levelid;
      this.paymentRights.membertypeid = membertypeid || 3;
      this.paymentRights.hospitalid = this.info.hospitalid;

      this.MK.Request(
        "/Publics/MemberManage/MemberRightsDefinition",
        "get",
        this.paymentRights
      ).then(res => {
        this.paymentRightsTableData = res.data;
        this.paymentRights.count = res.count;
      });
    },
    // 当前会员权益
    CurMemberRights_Get(memberid) {
      this.curRights.memberid = memberid;
      this.MK.Request(
        "/Hcrm/MemberService/MemberRights",
        "get",
        this.curRights
      ).then(res => {
        this.curRightsTableData = res.data;
        this.curRights.count = res.count;
      });
    },
    MemberShipfee_Get(memberid) {
      this.MK.Request("/Publics/MemberManage/Membershipfee", "get", {
        memberid,
        hospitalid: this.info.hospitalid
      }).then(res => {
        let fee = res.data.filter(item => {
          if (item.levelid == this.shipfeeForm.levelid) {
            return item;
          }
        })[0].membership;
        this.shipfeeForm.membership = fee;
      });
    },
    // 日期格式化
    dateFormat(date) {
      if (date) {
        var year = date.substr(0, 4);
        var month = date.substr(4, 2);
        var day = date.substr(6);
        return `${year}-${month}-${day}`;
      } else if (date == null || date == "") {
        const year = new Date().getFullYear();
        const month =
          new Date().getMonth() + 1 < 10
            ? "0" + (new Date().getMonth() + 1)
            : new Date().getMonth() + 1;
        const day =
          new Date().getDate() < 10
            ? "0" + new Date().getDate()
            : new Date().getDate();
        return `${year}-${month}-${day}`;
      }
    },
    // 时间戳转化
    getDate(date) {
      const year = new Date(date).getFullYear();
      const month =
        new Date(date).getMonth() + 1 < 10
          ? "0" + (new Date(date).getMonth() + 1)
          : new Date(date).getMonth() + 1;
      const day =
        new Date(date).getDate() < 10
          ? "0" + new Date(date).getDate()
          : new Date(date).getDate();
      return `${year}-${month}-${day}`;
    },
    // 指定日期加一天
    assignDateAddOneDay(date) {
      let newDate = new Date(date);
      newDate = newDate.setDate(newDate.getDate() + 1);
      newDate = new Date(newDate);
      return this.getDate(newDate);
    },
    // 指定日期加一年
    assignDateAddOneYear(date) {
      let newDate = new Date(date);
      newDate.setFullYear(newDate.getFullYear() + 1);
      newDate = new Date(newDate);
      return this.getDate(newDate);
    }
  },
  watch: {
    userData: {
      deep: true,
      handler(val) {
        this.memberBasicinfo = val;
      }
    },
    modal(val) {
      if (!val) {
        this.shipfeeForm.levelid = "";
        this.shipfeeForm.membership = "";
        this.shipfeeForm.paymenttype = "";
        this.shipfeeForm.payamount = "";
        this.shipfeeForm.paymenttype2 = "";
        this.shipfeeForm.payamount2 = "";
        this.checkedPayment = [];
        // this.$emit("update:userdata", {});
      }
    }
  }
};
</script>

<style scoped>
.inputShrink {
  width: 150px;
}
.inputMax {
  width: 180px;
}
.payment_bar_max {
  width: 920px;
}
.payment_bar_shrink {
  width: 810px;
}
.custom_label >>> .el-form-item__label {
  color: red;
}
.input_bg >>> .el-input__inner {
  background-color: #67c23a;
}
>>> .el-input-group__prepend {
  width: 100px !important;
  text-align: center;
}
.payment_tip {
  height: 40px;
  border-radius: 4px;
  line-height: 40px;
  text-align: center;
  background-color: #303133;
  opacity: 0.8;
  color: #ffffff;
  font-size: 18px;
  margin: 20px 0;
  width: 100%;
}
.payment_item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}
.payment_icon img {
  margin-right: 80px;
  cursor: pointer;
}
>>>.el-tab-pane,>>>.el-tabs__content,>>>.el-tabs{
  height: 100%;
}
</style>