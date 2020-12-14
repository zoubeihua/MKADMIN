<template>
  <!-- -这个是会员随访管理-添加方案的模版--主要是方便单个会员添加方案和批量添加方案 -->
  <el-container>
    <el-header>
      <div style="width:100%">
        <el-form
          label-width="120px"
          :rules="rules"
          ref="eventFrom"
          :model="eventFrom"
        >
          <el-form-item label="选择随访方案" prop="visitprogramid">
            <el-select
              v-model="eventFrom.visitname"
              placeholder="请选择随访方案"
              @change="getEventList"
              v-if="!disabled"
            >
              <el-option
                v-for="item in lstvisitprogramid"
                :key="item.visitprogramid"
                :value="item.visitprogramid"
                :label="item.visitname"
                :disabled="disabled"
                clearable
              ></el-option>
            </el-select>
            <el-select
              v-model="eventFrom.visitname"
              placeholder="请选择随访方案"
              v-if="disabled"
            >
              <el-option
                v-for="item in lstvisitprogramList"
                :key="item.visitprogramid"
                :value="item.visitprogramid"
                :label="item.visitname"
                :disabled="disabled"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="随访方案描述" prop="visitprogramnote">
            <el-input
              placeholder="请选择随访方案"
              v-model="eventFrom.visitprogramnote"
              disabled
            />
          </el-form-item>
          <el-form-item label="适应类型" class="fromItem">
            <mk-select
              multiple
              collapse-tags
              placeholder="方案就诊类型"
              :datas="getDicStandarDcode('就诊分类')"
              :filter="['bzname', 'bzname']"
              label="bzname"
              val="bzcode"
              v-model="lstapt.jzfl"
              retureType="1"
              :disabled="true"
            ></mk-select>
            <span class="fromSpan">适应病种</span>
            <mk-select
              multiple
              collapse-tags
              style="width:180px;"
              v-model="lstapt.sybz"
              url="/Publics/VisitPogramMaintain/visitadaptdiseaseList_Get"
              :param="{ condition: '' }"
              placeholder="方案适应病种"
              :filter="['diseasename']"
              label="diseasename"
              val="diseasecode"
              retureType="1"
              :disabled="true"
            />
            <span class="fromSpan">适应记账</span>
            <mk-select
              multiple
              collapse-tags
              style="width:190px;"
              v-model="lstapt.syjz"
              url="/Publics/Common/Dic/MemberBilling"
              placeholder="方案记账类型"
              :filter="['billingname']"
              label="billingname"
              val="billingcode"
              retureType="1"
              :disabled="true"
            />
          </el-form-item>
          <div>
            <div class="colBlock">
              <el-form-item label="随访开始时间">
                <el-select
                  v-model="timeOption"
                  placeholder="请选择"
                  style="width:180px;marginRight:10px"
                  @change="timeChange"
                  :disabled="disabled"
                >
                  <el-option
                    v-for="item in timeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="colBlock widthSmall" v-if="timeOption == 1">
              <el-form-item
                prop="plantime"
                style="marginLeft:-126px !important;"
              >
                <template>
                  <el-date-picker
                    :disabled="disabled"
                    v-model="eventFrom.plantime"
                    type="datetime"
                    placeholder="选择日期时间"
                    default-time="10:00:00"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  >
                  </el-date-picker>
                </template>
              </el-form-item>
            </div>
            <div class="colBlock widthSmall" v-if="timeOption == 0">
              <el-form-item
                prop="jzafterdays"
                style="marginLeft:-126px !important;"
              >
                <el-input-number
                  :disabled="disabled"
                  style="width:220px;"
                  :min="0"
                  v-model="eventFrom.jzafterdays"
                  step-strictly
                />
                <span style="marginLeft:10px">天</span>
              </el-form-item>
            </div>
          </div>
          <div>
            <div class="colBlock">
              <el-form-item label="随访人员类型" prop="usertype">
                <mk-select
                  placeholder="请选择随访人类型"
                  :datas="getDicStandarDcode('随访人类型')"
                  :filter="['bzname', 'bzname']"
                  label="bzname"
                  val="bzcode"
                  v-model="eventFrom.usertype"
                  style="width:180px;marginRight:10px"
                ></mk-select>
              </el-form-item>
            </div>
            <div class="colBlock widthSmall" style="marginLeft: -60px;">
              <el-form-item
                prop="planuserid"
                style="marginLeft:-66px !important;"
              >
                <el-select
                  v-model="eventFrom.planuserid"
                  placeholder="请选择随访人员"
                  style="width:220px"
                >
                  <el-option
                    v-for="item in customManagerList"
                    :key="item.userid"
                    :label="item.name"
                    :value="item.userid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </el-header>
    <el-main style="padding:0;">
      <el-table
        border
        highlight-current-row
        :data="planSthList"
        show-overflow-tooltip
        height="100%"
      >
        <el-table-column
          label="随访事件"
          align="center"
          prop="visiteventname"
          width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.visiteventname }}
            <template v-if="isTaskstatus">
              -
              <el-tag
                :type="GetvalidStatusType(scope.row.taskstatus)"
                disable-transitions
                >{{ scope.row.taskstatus ? "已生成" : "未生成" }}</el-tag
              >
            </template>
          </template>
        </el-table-column>
        <!-- <template  v-if="isTaskstatus">
        <el-table-column
          label="生成状态"
          show-overflow-tooltip
          prop="taskstatus"
         width="100px"
         align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="GetvalidStatusType(scope.row.taskstatus)"
              disable-transitions
              >{{ scope.row.taskstatus?'已生成':'未生成' }}</el-tag
            >
          </template>
        </el-table-column>
        </template> -->
        <el-table-column label="随访时间" align="center">
          <el-table-column label="间隔" prop="lasttime" width="70">
            <template slot-scope="scope">
              {{ scope.row.lasttime + scope.row.lasttimeunitdisplay }}
            </template>
          </el-table-column>
          <el-table-column
            label="提前"
            prop="inadvancedispaly"
            width="70"
          ></el-table-column>
          <el-table-column label="周期循环" prop="cycleamount" width="100">
            <template slot-scope="scope">
              {{ scope.row.cycledispaly }}
              <span v-if="scope.row.cycleamount > 1" class="primary">{{
                "【" + scope.row.cycleamount + "次】"
              }}</span>
            </template>

            <!-- <template slot-scope="scope">
              {{ scope.row.cycledispaly }}
              <span v-if="scope.row.cycleamount > 1">{{
                "(" + scope.row.cycleamount + "次)"
              }}</span>
            </template> -->
          </el-table-column>
        </el-table-column>
        <el-table-column label="随访任务" align="center">
          <el-table-column
            label="用药提醒"
            prop="medicalremind"
            width="200"
          ></el-table-column>
          <el-table-column
            label="复诊通知"
            prop="referralremind"
            width="200"
          ></el-table-column>
          <el-table-column
            label="健康宣教"
            prop="healthmissiontitle"
            width="200"
          ></el-table-column>
          <el-table-column
            label="患者问卷"
            prop="questionnaire_name"
            width="200"
          ></el-table-column>
          <el-table-column
            label="医生表单"
            prop="doctorform_name"
            width="200"
          ></el-table-column>
        </el-table-column>
        <el-table-column
          label="状态"
          sortable
          show-overflow-tooltip
          prop="statusdisplay"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-tag
              :type="GetvalidStatusType(scope.row.status)"
              disable-transitions
              >{{ scope.row.statusdisplay }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label align="center" fixed="right" width="200">
          <template slot="header">
            <el-button @click="VisitSthAdd" type="primary">添加</el-button>
          </template>
          <template slot-scope="scope">
            <div class="tableBtn">
              <el-link
                :title="scope.row.status != 1 ? '启用' : '停用'"
                @click="sthExamine(scope.$index)"
                :underline="false"
                type="primary"
                :icon="
                  scope.row.status != 1
                    ? 'mkfont qiyong'
                    : 'mkfont tingyong_line'
                "
                :disabled="scope.row.status == 3 || scope.row.status == 99"
              ></el-link>
              <el-link
                title="编辑"
                @click="VisitProgram_Edit(scope.row, 'sth', scope.$index)"
                :underline="false"
                :disabled="scope.row.status == 3 || scope.row.status == 99||scope.row.taskstatus==1"
                type="primary"
                icon="mkfont bianji1"
              ></el-link>
              <el-link
                title="删除"
                @click="sthDelte(scope.$index)"
                :underline="false"
                type="danger"
                :disabled="scope.row.status == 3 || scope.row.status == 99||scope.row.taskstatus==1"
                icon="mkfont trasch"
              ></el-link>
              <el-link
                title="上移"
                @click="sthMoveUp(scope.$index)"
                :underline="false"
                type="primary"
                :disabled="scope.row.status == 3 || scope.row.status == 99"
                icon="mkfont shangyi"
              ></el-link>
              <el-link
                title="下移"
                @click="sthMoveDow(scope.$index)"
                :underline="false"
                type="primary"
                :disabled="scope.row.status == 3 || scope.row.status == 99"
                icon="mkfont xiayi"
              ></el-link>
              <el-link
                title="查看"
                :underline="false"
                @click="look(scope.row)"
                type="primary"
                icon="el-icon-view"
              ></el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <vxe-modal
        v-model="isVisitSthModel"
        :showFooter="true"
        title="随访事件"
        width="50vw"
        height="auto"
        @close="VisitSthClose"
      >
        <!-- <div slot="title" v-if="isVisitSthEdit">
      随访事件 - [
      <span
        style="color:red;"
      >会员等级 ： {{rowdata.memberlevel_display}} 会员卡号：{{rowdata.memberno}} 会员姓名：{{rowdata.membername}} 性别：{{rowdata.sex_dispalay}} 年龄：{{rowdata.age}}</span> ]
    </div> -->

        <fllowUpEventPage
          :datas="planSthItem"
          ref="fllowUpEventPage"
          :disabled="isVisitSthEdit"
        />
        <!-- @Success="eventFromSuccess" -->
        <div slot="footer" style="text-align:center;">
          <el-button-group>
            <el-button type="primary" @click="submitAddSthForm">提交</el-button>
            <el-button @click="VisitSthClose">取消</el-button>
          </el-button-group>
        </div>
      </vxe-modal>
    </el-main>
  </el-container>
</template>
<script>
import fllowUpEventPage from "./fllowUpEventPage";
import util from "@/libs/util.js";
export default {
  components: { fllowUpEventPage },
  props: {
    lstvisitprogramid: Array,
    dataform: Object,
    disabled: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      rowdata: [],
      isTaskstatus: false,
      programItemType: "C",
      sthIndex: "", //事件所在列表的index
      isVisitSthEdit: false,
      eventFrom: {
        visitprogramid: undefined,
        visitname: "",
        visitprogramnote: "", //方案描述，
        usertype: "1",
        createid: util.cookies.get("uuid"), //当前登陆用户
        jzafterdays: -1, //就诊后多少天 :（如果选择了：指定开始时间, 传 -1）
        plantime: "", //指定开始时间
        planuserid: undefined, //计划随访人ID
        status: 1
      },
      planSthList: [], //事件列表
      planSthItem: {},
      timeOption: 0,
      timeValue: "",
      timeOptions: [
        {
          value: 0,
          label: "就诊后"
        },
        {
          value: 1,
          label: "指定时间"
        }
      ],
      personOptions: [
        {
          value: 1,
          label: "医生"
        },
        {
          value: 2,
          label: "客服"
        },
        {
          value: 3,
          label: "指定人员"
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      //工作人员
      customManagerList: [],
      lstvisitprogramList: [],
      lstapt: {
        memberlevel: [],
        syjz: "",
        sybz: "",
        falx: "",
        jzfl: ""
      },
      isVisitSthModel: false, //事件 弹框
      rules: {
        visitprogramid: [
          { required: true, message: "请输入方案名称", trigger: "blur" }
        ],
        usertype: [
          { required: true, message: "请选择随访人员类型", trigger: "change" }
        ],
        plantime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        timeOption: [
          { required: true, message: "请选择随访开始时间", trigger: "change" }
        ],
        planuserid: [
          { required: true, message: "请选择随访人", trigger: "blur" }
        ],
        jzafterdays: [
          { required: true, message: "请填写天数", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    dataform: function(val) {
      this.planSthList = val.lsteventtask;
      this.getTaskstatus();
      this.eventFrom = val;
      this.getLstapt(val.lstapt);
      // this.lstapt = val.lstapt;
    },
    lstvisitprogramid: function(val) {
      console.log(this.lstvisitprogramid);
    }
  },
  created() {
    if (!this.dataform) {
      this.init();
    } else {
      this.planSthList = this.dataform.lsteventtask;
      this.eventFrom = this.dataform;
      this.getLstapt(this.dataform.lstapt);
      this.getTaskstatus();
      // this.lstapt = this.dataform.lstapt;
    }

    this.initItem();
    this.Member_AccountManager_Get();
  },
  mounted() {
    if (this.disabled) {
      this.VisitProgramList_Get();
    }
  },
  methods: {
    removeTag(tag) {},
    init() {
      this.eventFrom = {
        visitprogramid: undefined,
        visitname: "",
        visitprogramnote: "", //方案描述，
        usertype: "1",
        createid: util.cookies.get("uuid"), //当前登陆用户
        jzafterdays: -1, //就诊后多少天 :（如果选择了：指定开始时间, 传 -1）
        plantime: "", //指定开始时间
        planuserid: undefined, //计划随访人ID
        status: 1
      };
      this.lstapt = {
        memberlevel: [],
        syjz: "",
        sybz: "",
        falx: ""
      };
    },
    timeChange() {
      if (this.timeOption == 0) {
        //就诊后
        this.eventFrom.plantim = "";
      } else if (this.timeOption == 1) {
        //指定时间
        this.eventFrom.jzafterdays = -1;
      }
    },
    //查询客户经理-责任人
    Member_AccountManager_Get() {
      this.MK.Request("Publics/Common/UserInfo", "get", {
        tag: 1
      }).then(res => {
        this.customManagerList = res.data;
      });
    },
    getEventList(visitprogramid) {
      this.eventFrom.visitprogramid = visitprogramid;
      this.MK.Request(
        "/Publics/VisitPogramMaintain/VisitProgramAndVisitEventTask_Get",
        "get",
        { visitprogramid: visitprogramid }
      ).then(res => {
        if (res.code == 0) {
          this.planSthList = res.data.lsteventtask;
          this.eventFrom.visitname = res.data.visitname;
          this.eventFrom.visitprogramnote = res.data.visitprogramnote;
          this.getLstapt(res.data.lstapt);
          this.getTaskstatus();
        }
      });
    },
    //sth add
    VisitSthAdd() {
      this.isVisitSthModel = true;
    },
    VisitSthClose() {
      this.isVisitSthModel = false;
      this.programItemType = "C";
      this.isVisitSthEdit = false;
      this.initItem();
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
        interval: "7天",
        cycleamount: 1,
        cycledispaly: "否",
        inadvance: 1,
        inadvancedispaly: "1天",
        fixedtime: "10:00:00",
        medicalremind: "",
        referralremind: "",
        healthmission: -1,
        healthmissiontitle: "",
        questionnaire: -1,
        questionnaire_name: "",
        doctorform: -1,
        doctorform_name: "",
        eventtype: "1"
      };
    },
    getTaskstatus() {
      console.log(this.planSthList);
      for (let item in this.planSthList[0]) {
        if (item == "taskstatus") {
          this.isTaskstatus = true;
        }
      }
    },
    //事件上移
    sthMoveUp(index) {
      if (index == 0) {
        this.$message.error("已经是第一个了哦");
        return;
      }
      this.planSthList[index] = this.planSthList.splice(
        index - 1,
        1,
        this.planSthList[index]
      )[0];
    },
    //事件下移
    sthMoveDow(index) {
      if (index == this.planSthList.length - 1) {
        this.$message.error("已经是最后一个了哦");
        return;
      }
      this.planSthList[index] = this.planSthList.splice(
        index + 1,
        1,
        this.planSthList[index]
      )[0];
    },
    //事件停用启用
    sthExamine(index) {
      if (this.planSthList[index].status == 0) {
        this.planSthList[index].status = 1;
        this.planSthList[index].statusdisplay = "启用";
      } else {
        this.planSthList[index].status = 0;
        this.planSthList[index].statusdisplay = "停用";
      }
    },
    //事件删除
    sthDelte(index) {
      this.planSthList.splice(index, 1);
    },
    //查询随访方案列表信息
    VisitProgramList_Get() {
      let form = {};
      form.hospitalid = this.info.hospitalid;
      form.createid = this.info.userid;
      form.tag = 1;
      this.MK.Request(
        "/Publics/VisitPogramMaintain/VisitProgramList_Get",
        "get",
        form
      ).then(res => {
        if (res.code == 0) {
          console.log(res.data);
          this.lstvisitprogramList = res.data;
        }
      });
    },
    //编辑
    VisitProgram_Edit(row, type, index) {
      this.programItemType = "U";
      this.planSthItem = row;
      this.sthIndex = index;
      this.planSthItem = this.planSthList[index];
      this.VisitSthAdd();
    },
    submitAddSthForm() {
      let radioModel = this.$refs.fllowUpEventPage.radioCheck();
      if (radioModel == false) {
        return;
      }
      this.planSthItem = this.$refs.fllowUpEventPage.planSthItem;
      if (this.programItemType == "C") {
        this.planSthItem.status = 1;
        this.planSthItem.statusdisplay = "启用";
        this.planSthList.push(this.planSthItem);
        this.VisitSthClose();
      } else if (this.programItemType == "U") {
        this.planSthList[this.sthIndex] = this.planSthItem;
        this.VisitSthClose();
      }
    },
    // eventFromSuccess(radioModel) {
    //   console.log(radioModel);
    //   if (radioModel == false) {
    //     return;
    //   }
    // },
    getLstapt(list) {
      console.log(list);
      // --0 适应类型 jzfl
      //  --1 适应病种 sybz
      //  --2 适应等级 memberlevel
      //  --3 适应记账 syjz
      this.lstapt = {
        memberlevel: [],
        syjz: [],
        sybz: [],
        jzfl: []
      };
      for (let i = 0; i < list.length; i++) {
        switch (list[i].adaptclass) {
          case 3:
            this.lstapt.syjz.push(list[i].adaptcode + "");
            break;
          case 1:
            this.lstapt.sybz.push(list[i].adaptcode);
            break;
          case 2:
            this.lstapt.memberlevel.push(list[i].adaptcode);
            break;
          case 0:
            this.lstapt.jzfl.push(list[i].adaptcode);
            break;
        }
      }
    },
    //
    // c查看事件
    //
    //sth add
    look(row) {
      (this.rowdata = row), (this.planSthItem = row);
      this.isVisitSthEdit = true;
      this.VisitSthAdd();
    }
  }
};
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 20px !important;
}
.fromItem {
  .el-select {
    max-width: 20%;
    width: 180px;
    display: inline-block;
  }
}
.fromSpan {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px;
}
.colBlock {
  display: inline-block;
  margin-right: 10px;
}
.widthSmall {
  .el-form-item__content {
    margin-left: 0px !important;
  }
}
</style>
