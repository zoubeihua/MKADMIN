<template>
  <el-container>
    <el-main style="padding:0;">
      <el-form
        style="margin-top:0;"
        label-width="80px"
        :model="planSthItem"
        :rules="sthRules"
        ref="sthRules"
        :disabled="disabled"
      >
        <el-form-item label="事件名称" prop="visiteventname">
          <el-input
            placeholder="请输入事件名称"
            v-model="planSthItem.visiteventname"
          />
        </el-form-item>
      </el-form>
      <el-card class="box-card" style="min-height:200px">
        <div slot="header" class="clearfix">
          <span>事件时间</span>
        </div>
        <template>
          <el-form label-width="100px" :disabled="disabled">
            <el-form-item label="距离上次随访">
              <el-input-number
                :min="0"
                step-strictly
                label="描述文字"
                v-model="planSthItem.lasttime"
                @change="getIntervalnum"
              ></el-input-number>

              <mk-select
                placeholder="请选择"
                :datas="getDicStandarDcode('随访间隔单位')"
                :filter="['bzname', 'bzname']"
                label="bzname"
                val="bzcode"
                v-model="planSthItem.lasttimeunit"
                style="width:80px;marginLeft:6px"
                @change="getIntervalnum"
              ></mk-select>
            </el-form-item>
            <el-form-item label="">
              <div slot="label">
                <el-checkbox
                  v-model="planSthItem.cycledispaly"
                  true-label="是"
                  false-label="否"
                  @change="grtCycleamount"
                  >循环周期</el-checkbox
                >
              </div>
              <el-input-number
                v-if="planSthItem.cycledispaly == '是'"
                step-strictly
                v-model="planSthItem.cycleamount"
                :min="1"
                @change="getCycled"
              ></el-input-number
              ><span
                v-if="planSthItem.cycledispaly == '是'"
                style="width:100px;margin:0 10px 0 10px"
                >次</span
              >
            </el-form-item>
            <el-form-item label="提前发送">
              <el-input-number
                :min="0"
                label
                step-strictly
                v-model="planSthItem.inadvance"
                @change="getInadvancedispaly"
              ></el-input-number>
              <mk-select
                placeholder="请选择"
                :clearable="false"
                :datas="[{ bzname: '天', bzcode: '0' }]"
                :filter="['bzname', 'bzname']"
                label="bzname"
                v-model="sendData"
                val="bzcode"
                style="width:80px;marginLeft:6px"
              ></mk-select>
              <el-time-picker
                style="width:120px;marginLeft:6px"
                v-model="planSthItem.fixedtime"
                placeholder="时间点"
                value-format="HH:mm:ss"
              ></el-time-picker>
            </el-form-item>
          </el-form>
        </template>
      </el-card>
      <!-- 事件任务 -->
      <template>
        <el-card class="box-card" style="min-height:240px">
          <div slot="header" class="clearfix">
            <span>自动任务</span>
          </div>
          <el-form :disabled="disabled">
            <el-form-item label="事件类型">
              <mk-select
                placeholder="请选择事件类型"
                :datas="getDicStandarDcode('随访事件类型')"
                :filter="['bzname', 'bzname']"
                label="bzname"
                val="bzcode"
                v-model="planSthItem.eventtype"
                @change="redioSelect($event)"
              ></mk-select>
            </el-form-item>
            <el-form-item>
              <div class="radioBox-lq" v-if="planSthItem.eventtype == 1">
                <span class="mlr10"><span style="color: #F56C6C;margin-right: 4px;">*</span>复诊通知</span>
               <el-input
                  placeholder="请输入复诊通知内容"
                  v-model="planSthItem.referralremind"
                  type="textarea"
                  :rows="4"
                  resize="none"
				  ref="textareaReferral"
                />
              </div>
              <div class="radioBox-lq" v-if="planSthItem.eventtype == 2">
                <span class="mlr10">用药提醒</span>
                <el-input
                  placeholder="请输入用药相关的提醒内容"
                  v-model="planSthItem.medicalremind"
                  type="textarea"
                  :rows="4"
                  resize="none"
                />
              </div>
              <div class="radioBox-lq" v-if="planSthItem.eventtype == 3">
                <span class="mlr10">健康宣教</span>
                <health
                  @func="gethealth"
                  placeholder="请选择健康宣教的文章"
                  :model="planSthItem.healthmissiontitle"
                />
              </div>
              <div class="radioBox-lq" v-if="planSthItem.eventtype == 4">
                <el-form class="sthTaskFrom" :disabled="disabled">
                  <el-form-item label>
                    <div>
                      <div class="fromSpan">
                        医生问卷调查
                      </div>
                      <div class="colBlock">
                        <edcList
                          @select="getQuestionItem"
                          :Tag="2"
                          :key="2"
                          placeholder="请选择随访记录的表单"
                          :model="planSthItem.doctorform_name"
                        />
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label>
                    <div>
                      <div class="fromSpan">
                        患者问卷调查
                      </div>
                      <div class="colBlock">
                        <edcList
                          placeholder="请选择问卷调查的表单"
                          @select="getQuestionItem"
                          :Tag="1"
                          :key="1"
                          :model="planSthItem.questionnaire_name"
                        />
                      </div>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </template>
    </el-main>
  </el-container>
</template>
<script>
import health from "./health";
import edcList from "./edcList";
export default {
  components: { health, edcList },
  props: ["datas", "disabled"],
  data() {
    return {
      sendData: "0",
      checked: false,
      planSthItem: {
        visiteventid: -1,
        visitprogramid: undefined,
        visiteventname: "",
        noticeremind: 1,
        noticereminddispaly: "否",
        lasttime: 0,
        lasttimeunit: "1",
        interval: "0天",
        cycleamount: 1,
        cycledispaly: "否",
        inadvance: 1,
        inadvancedispaly: "1天",
        fixedtime: "10:00:00",
        medicalremind: "",
        referralremind: "请按时到医院复诊",
        healthmission: -1,
        healthmissiontitle: "",
        questionnaire: -1,
        questionnaire_name: "",
        doctorform: -1,
        doctorform_name: "",
        eventtype: "1"
      },
      sthRules: {
        visiteventname: [
          { required: true, message: "请输入事件名称", trigger: "change" }
        ]
      },
      radioOptions: [
        { value: 0, label: "复诊通知" },
        { value: 1, label: "用药提醒" },
        { value: 2, label: "健康宣教" }
      ]
    };
  },
  watch: {
    datas: function(val) {
      this.planSthItem = {...val};
    }
  },
  created() {
    this.planSthItem = {...this.planSthItem,...this.datas};
	
	console.log(this.planSthItem)
    if (!this.datas) {
      this.initItem();
    }
  },
  mounted() {
	this.$nextTick(() => {
		setTimeout(() => {
			this.$refs.textareaReferral.focus();
		},500)
	})
  	
  },
  methods: {
    //tab切换事件
    handleTabsClick(val) {
      if (val.name == 2) {
        this.planSthItem.eventtype = 4;
      }
    },
    initItem() {
      this.planSthItem = {
        visiteventid: -1,
        visitprogramid: undefined,
        visiteventname: "",
        noticeremind: 1,
        noticereminddispaly: "否",
        lasttime: 0,
        lasttimeunit: "1",
        interval: "0天",
        cycleamount: 1,
        cycledispaly: "否",
        inadvance: 1,
        inadvancedispaly: "1天",
        fixedtime: "10:00:00",
        medicalremind: "",
        referralremind: "请按时到医院复诊",
        healthmission: -1,
        healthmissiontitle: "",
        questionnaire: -1,
        questionnaire_name: "",
        doctorform: -1,
        doctorform_name: "",
        eventtype: "1"
      };
    },
    getQuestionItem(item, tag) {
      if (tag == 2) {
        this.planSthItem.doctorform = item.subclassid;
        this.planSthItem.doctorform_name = item.subclassname;
      } else if (tag == 1) {
        this.planSthItem.questionnaire = item.subclassid;
        this.planSthItem.questionnaire_name = item.subclassname;
      }
    },
    redioSelect(i) {
      if (this.planSthItem.eventtype == -1) {
        this.planSthItem.medicalremind = "";
        this.planSthItem.healthmission = -1;
        this.planSthItem.healthmissiontitle = "";
        this.planSthItem.questionnaire = -1;
        this.planSthItem.questionnaire_name = "";
        this.planSthItem.doctorform = -1;
        this.planSthItem.doctorform_name = "";
      } else if (this.planSthItem.eventtype == 1) {
        this.planSthItem.noticeremind = 1;
        this.planSthItem.medicalremind = "";
        this.planSthItem.healthmission = -1;
        this.planSthItem.healthmissiontitle = "";
        this.planSthItem.questionnaire = -1;
        this.planSthItem.questionnaire_name = "";
        this.planSthItem.doctorform = -1;
        this.planSthItem.doctorform_name = "";
      } else if (this.planSthItem.eventtype == 2) {
        this.planSthItem.noticeremind = 1;
        this.planSthItem.referralremind = "";
        this.planSthItem.healthmission = -1;
        this.planSthItem.healthmissiontitle = "";
        this.planSthItem.questionnaire = -1;
        this.planSthItem.questionnaire_name = "";
        this.planSthItem.doctorform = -1;
        this.planSthItem.doctorform_name = "";
      } else if (this.planSthItem.eventtype == 3) {
        this.planSthItem.noticeremind = 1;
        this.planSthItem.referralremind = "";
        this.planSthItem.medicalremind = "";
        this.planSthItem.questionnaire = -1;
        this.planSthItem.questionnaire_name = "";
        this.planSthItem.doctorform = -1;
        this.planSthItem.doctorform_name = "";
      } else if (this.planSthItem.eventtype == 4) {
        this.planSthItem.noticeremind = 0;
        this.planSthItem.referralremind = "";
        this.planSthItem.medicalremind = "";
        this.planSthItem.healthmission = -1;
        this.planSthItem.healthmissiontitle = "";
      }
    },
    //验证-事件
    radioCheck() {
      let flag = true;
      this.$refs["sthRules"].validate(valid => {
        if (valid) {
          if (
            this.planSthItem.eventtype == 1 &&
            !this.planSthItem.referralremind
          ) {
            this.$message.error("请填写复诊通知");
            this.planSthItem.medicalremind = "";
            this.planSthItem.healthmission = -1;
            this.planSthItem.healthmissiontitle = "";
            this.$emit("Success", false);
            return (flag = false);
          } else if (
            this.planSthItem.eventtype == 2 &&
            !this.planSthItem.medicalremind
          ) {
            this.$message.error("请填写用药提醒");
            this.planSthItem.referralremind = "";
            this.planSthItem.healthmission = -1;
            this.planSthItem.healthmissiontitle = "";
            this.$emit("Success", false);
            return (flag = false);
          } else if (
            this.planSthItem.eventtype == 3 &&
            this.planSthItem.healthmission == -1
          ) {
            this.$message.error("请填写健康宣教");
            this.planSthItem.referralremind = "";
            this.planSthItem.medicalremind = "";
            this.$emit("Success", false);
            return (flag = false);
          } else if (
            this.planSthItem.eventtype == 4 &&
            this.planSthItem.doctorform == -1 &&
            this.planSthItem.questionnaire_name == ""
          ) {
            this.$message.error("请填写健康宣教");
            this.planSthItem.referralremind = "";
            this.planSthItem.medicalremind = "";
            this.$emit("Success", false);
            return (flag = false);
          } else {
            this.$emit("Success", true);
            return (flag = true);
          }
        } else {
          this.$emit("Success", false);
          return (flag = false);
        }
      });
      return flag;
    },
    getIntervalnum() {
      let interUnit = this.getDicStandarDcode("随访间隔单位");
      interUnit.map(item => {
        if (this.planSthItem.lasttimeunit == item.bzcode) {
          this.planSthItem.interval = ''+this.planSthItem.lasttime + item.bzname;
          console.log(this.planSthItem.interval)
        }
      });
    },
    getInadvancedispaly(){
      this.planSthItem.inadvancedispaly=this.planSthItem.inadvance+'天'
    },
    gethealth(item) {
      this.planSthItem.healthmission = item.newsid;
      this.planSthItem.healthmissiontitle = item.maintitle;
    },
    grtCycleamount(val) {
      if (val === "否") {
        this.planSthItem.cycleamount = 1;
      }else{
        this.planSthItem.cycleamount = 2;
      }
    },
    getCycled(){
      if(this.planSthItem.cycleamount==1){
        this.planSthItem.cycledispaly='否'
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 20px !important;
}
.box-card {
  margin-bottom: 10px;
  box-shadow: none;
  .el-form {
    margin-top: 0px;
  }
  .el-input {
    margin-right: 5px;
  }
}
.mlr10 {
  margin-left: 10px;
  margin-right: 10px;
}
.header-lq {
  height: 40px !important;
  min-height: 40px !important;
  padding: 0px !important;
  margin: 20px 0;
}
.radioBox-lq {
  margin: 10px 0;
}
.fromSpan {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px;
}
.colBlock {
  display: inline-block;
  width: calc(100% - 100px);
}
</style>
