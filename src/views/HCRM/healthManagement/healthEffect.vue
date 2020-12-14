<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true">
        <el-form-item>
          <mk-select
            style="width:180px;"
            v-model="form.memberlevel"
            multiple
            collapse-tags
            url="/Publics/MemberManage/Memberlevel"
            @change="BasicInfo()"
            placeholder="请选择会员等级"
            :filter="['name']"
            label="name"
            val="levelid"
          ></mk-select>
        </el-form-item>
        <el-form-item label="计划日期">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="daterange"
            type="daterange"
            align="right"
            unlink-panels
            @change="dateRangeChange($event,AddQuestionForm.memberprogramid)"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <mk-select
            style="width:160px;"
            v-model="form.planuserid"
            url="/Publics/Common/UserInfo"
            :param="{tag:1,hospitalid:info.hospitalid}"
            @change="BasicInfo()"
            placeholder="请选计划执行人"
            :filter="['name']"
            label="name"
            val="userid"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <mk-select
            style="width:160px;"
            v-model="form.releaseuserid"
            url="/Publics/Common/UserInfo"
            :param="{tag:1,hospitalid:info.hospitalid}"
            @change="BasicInfo()"
            placeholder="请选发布人"
            :filter="['name']"
            label="name"
            val="userid"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <mk-select
            style="width:160px;"
            v-model="form.exeuserid"
            url="/Publics/Common/UserInfo"
            :param="{tag:1,hospitalid:info.hospitalid}"
            @change="BasicInfo()"
            placeholder="请选实际执行人"
            :filter="['name']"
            label="name"
            val="userid"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <mk-select
            v-model="form.status"
            url="1"
            :globalFn="true"
            :param="{ codetype: '健康方案实施状态' }"
            :filter="['bzname','filterstr']"
            width="160px"
            label="bzname"
            val="bzcode"
            placeholder="请选择实施状态"
            @change="BasicInfo"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <el-input
            style="width:300px;"
            clearable
            @keyup.enter.native="BasicInfo"
            v-model="form.condition"
            placeholder="按会员卡号 / 姓名 / 拼音 / 联系电话查询"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox
            true-label="1"
            false-label="0"
            v-model="form.mycustomer"
            @change="BasicInfo"
          >我的会员</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="BasicInfo">查询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <SplitPane :min-percent="28" :default-percent="28" split="vertical">
      <template slot="paneL">
        <el-container>
          <el-table
            border
            stripe
            :data="memberTableData"
            @row-click="memberRowClick"
            highlight-current-row
            height="100%"
          >
            <el-table-column label="会员卡号" sortable show-overflow-tooltip prop="cardno"></el-table-column>
            <el-table-column label="会员姓名" sortable align="center" prop="membername">
              <template slot-scope="scope">
                <div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="scope.row.sex == 1 ? '男' : '女'"
                    placement="left"
                  >
                    <i
                      :class="['mkfont', scope.row.sex == 1 ? 'nan' : scope.row.sex == 2 ? 'nv' : 'weizhi']"
                      :style="{color: scope.row.sex == 1 ? '#6DCEFA' : scope.row.sex == 2 ? '#F37E7D' : '' }"
                    ></i>
                  </el-tooltip>
                  <span style="min-width:60px;display:inline-block;">{{scope.row.membername}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="等级" prop="memberlevel_display" width="80" sortable :sort-method="rowSort">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.memberlevel_display"
                  placement="right"
                >
                  <i
                    :class="['mkfont', scope.row.icon ? scope.row.icon.split(',')[0] : '']"
                    :style="{color: scope.row.icon ? scope.row.icon.split(',')[1] : '', fontSize: 28 + 'px'}"
                  ></i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" label="会员手机" sortable prop="mobiletel" :formatter="(i=>{return PhoneFormat(i,'mobiletel')})"></el-table-column>
          </el-table>
          <el-footer>
            <mk-page :pager="form" @query="BasicInfo()" />
          </el-footer>
        </el-container>
      </template>
      <template slot="paneR">
        <SplitPane :min-percent="40" :default-percent="40" split="vertical">
          <template slot="paneL">
            <el-table
              border
              stripe
              :data="memberHealthTableData"
              highlight-current-row
              height="100%"
              @row-click="memberHealthRowClick"
            >
              <el-table-column
                show-overflow-tooltip
                align="center"
                sortable
                label="健康管理方案"
                prop="programename"
                width="160"
              />
              <el-table-column show-overflow-tooltip align="center" sortable label="状态">
                <template slot-scope="scope">
                  <el-tag
                    :type="GetStatusDispaly(scope.row.status)"
                    disable-transitions
                  >{{ scope.row.statusdisplay }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                align="center"
                sortable
                label="发布人"
                prop="doctoridname"
              />
              <el-table-column
                show-overflow-tooltip
                align="center"
                sortable
                label="发布时间"
                prop="doctortime"
              />
            </el-table>
          </template>
          <template slot="paneR">
            <el-table
              stripe
              border
              :data="memberHealthPlanTableData"
              highlight-current-row
              height="100%"
            >
              <el-table-column
                show-overflow-tooltip
                align="center"
                sortable
                label="实施内容"
                prop="followupname"
              />
              <el-table-column
                show-overflow-tooltip
                align="center"
                sortable
                label="计划日期"
                prop="plantime"
              />
              <el-table-column
                show-overflow-tooltip
                align="center"
                sortable
                label="计划执行人"
                prop="planusername"
              />
              <el-table-column show-overflow-tooltip align="center" sortable label="状态">
                <template slot-scope="scope">
                  <el-tag
                    :type="GetEvaluateDisplay(scope.row.status)"
                    disable-transitions
                  >{{ scope.row.statusdisplay }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                align="center"
                sortable
                label="备注"
                prop="remark"
              />
              <el-table-column align="center">
                <template slot="header">
                  <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline " @click="handleOpenDetailModal">增加实施明细</el-button>
                </template>
                <template slot-scope="scope">
                  <div class="tableBtn">
                    <el-link
                      title="查看方案"
                      :underline="false"
                      type="warning"
                      @click="handleRowPlanOperate(scope.row,'effect')"
                    >
                      <i class="mkfont fangan" />
                    </el-link>
                    <el-link
                      title="查看明细"
                      :underline="false"
                      type="primary"
                      @click="handleRowPlanOperate(scope.row,'detail')"
                    >
                      <i class="mkfont xiangmu1" />
                    </el-link>
                    <el-link
                      :title="scope.row.status == 1 ? '已发布' : '发布'"
                      :underline="false"
                      type="success"
                      :disabled="scope.row.status == 1"
                      @click="handleRowPlanOperate(scope.row,'F')"
                    >
                      <i class="mkfont tijiao" />
                    </el-link>
                    <el-link
                      :title="scope.row.status == 1 ? '已发布，无法删除' : '删除明细'"
                      :underline="false"
                      type="danger"
                      :disabled="scope.row.status == 1"
                      @click="handleRowPlanOperate(scope.row,'D')"
                    >
                      <i class="mkfont trasch" />
                    </el-link>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </SplitPane>
      </template>
    </SplitPane>
    <!-- 明细模态框 -->
    <vxe-modal v-model="detailModal" width="540" height="auto" :show-footer="true">
      <div slot="title">
        {{!detailFormRead ? "新增实施" : "查看明细"}} - [
        <span
          style="color:red"
        >会员等级：{{memberRow.memberlevel_display}} 会员姓名：{{memberRow.membername}}</span>
        ]
      </div>
      <el-form :model="detailForm" ref="detailForm" :rules="detailRule" label-width="110px">
        <el-form-item label="问卷名称" prop="subclassid">
          <el-select
            style="width:320px"
            v-model="detailForm.subclassid"
            :disabled="detailFormRead"
            @change="handleMatchFollowupname"
          >
            <el-option
              v-for="item in edcSubClassList"
              :key="item.subclassname"
              :label="item.subclassname"
              :value="item.subclassid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="实施内容">
          <el-input style="width:320px" :disabled="true" v-model="detailForm.followupname" />
        </el-form-item>
        <el-form-item label="计划人" prop="planuserid">
          <mk-select
            style="width:320px;"
            v-model="detailForm.planuserid"
            :disabled="detailFormRead"
            url="/Publics/Common/UserInfo"
            :param="{tag:1,hospitalid:info.hospitalid}"
            placeholder="请选择计划人"
            :filter="['name']"
            label="name"
            val="userid"
          ></mk-select>
        </el-form-item>
        <el-form-item label="计划日期" prop="plantime">
          <el-date-picker
            :disabled="detailFormRead"
            style="width:320px;"
            v-model="plandate"
            type="date"
            placeholder="选择日期"
            :picker-options="expireTimeOption"
            @change="handleChangePlanDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            :disabled="detailFormRead"
            style="width:320px"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6}"
            v-model="detailForm.remark"
            placeholder
          />
        </el-form-item>
      </el-form>
      <el-button-group slot="footer" class="footer" v-if="!detailFormRead" style="margin: 15% 0 0 40%;">
        <el-button type="success" @click="handleSubmitForm('C')">提交</el-button>
        <el-button type="warning" @click="detailModal = false">取消</el-button>
      </el-button-group>
    </vxe-modal>
    <!-- 查看方案模态框 -->
    <vxe-modal v-model="effectModal" ref="effectModal" width="960" height="auto" resize fullscreen>
      <div slot="title">
        方案查看 - [
        <span
          style="color:red"
        >会员等级：{{memberRow.memberlevel_display}} 会员姓名：{{memberRow.membername}}</span>
        ]
      </div>
      <el-container>
        <el-header>
          <el-input :disabled="true" v-model="programname" placeholder>
            <template slot="prepend">方案名称</template>
          </el-input>
        </el-header>
        <el-main>
          <vue-editor style="height:calc(100% - 48px)" v-model="programcontent" class="fm-editor"></vue-editor>
        </el-main>
      </el-container>
    </vxe-modal>
  </d2-container>
</template>

<script>
import { VueEditor } from "vue2-editor";
export default {
  name: "healthEffect",
  data() {
    return {
      plandate: "", // 计划日期-未处理前
      programcontent: "",
      programname: "",
      newDetail: true,
      detailFormRead: false, // 查看明细
      detailModal: false,
      effectModal: false,
      detailRule: {
        subclassid: [
          { required: true, message: "请选择随访问卷名称", trigger: "change" }
        ],
        exeuserid: [
          { required: true, message: "请选择随执行人", trigger: "change" }
        ],
        planuserid: [
          { required: true, message: "请选择计划人", trigger: "change" }
        ],
        releaseuserid: [
          { required: true, message: "请选择发布人", trigger: "change" }
        ],
        plantime: [
          { required: true, message: "请选择计划日期", trigger: "blur" }
        ]
      },
      detailForm: {
        // serialnumber: "", //key
        // exeuserid: "", // 执行人id
        followupname: "", //随访名称
        memberid: "",
        memberprogramid: "", // 健康方案表
        planuserid: "", // 计划人id
        plantime: "", // 计划日期
        // releaseuserid: "", // 计划发布人id
        remark: "", // 备注
        status: "", // 状态
        subclassid: "", // 问卷id
        subclassname: "" // 问卷名称
      },
      memberRow: {},
      memberHealthRow: {},
      memberHealthPlanRow: {},
      // 健康方案实施维护(查询会员列表信息)
      form: {
        createuserid: "", //当前登录账户ID
        plantimeBegin: "", //问卷开始时间
        plantimeEnd: "", //问卷结束时间
        memberlevel: [], //会员等级ID 传一个数组;[1000002,1000003,1000004]
        status: "", //问卷状态 0：未评 1：已评 2：未发布方案 3：已发布方案
        planuserid: "", //计划人id
        exeuserid: "", //执行人id
        releaseuserid: "", //发布人id
        mycustomer: "", //1:表是我的客户; 0:不限制;
        condition: "",
        page: 1,
        rows: 20,
        tag: 0,
        hospitalid: "",
        count: 0
      },
      // 头部查询框信息
      AddQuestionForm: {
        memberid: "",
        memberprogramid: "",
        sourcetag: 0,
        status: 0,
        subclassid: "",
        userid: ""
      },
      // (健康方案实施维护)根据会员id获取健康方案实施列表信息(根据:memberid)
      memberHealth: {
        memberid: "",
        condition: "",
        page: 1,
        row: 20,
        tag: 0,
        hospitalid: "",
        count: 0
      },
      memberHealthPlan: {
        memberid: "",
        memberprogramid: "",
        condition: "",
        page: 1,
        row: 20,
        tag: 0,
        hospitalid: "",
        count: 0
      },
      memberEffect: {
        memberid: "",
        condition: "",
        page: 1,
        row: 20,
        tag: 0,
        hospitalid: "",
        count: 0
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      // 日期选择范围——只可选择当前日期之后
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() <= Date.now();
        }
      },
      daterange: "", //日期范围
      memberTableData: [],
      memberHealthTableData: [],
      memberHealthPlanTableData: [],
      memberEffectTableData: [],
      edcSubClassList: [], // edc小类列表
      rowClickMemberid: "",
      planBtnIsAble: true
    };
  },
  components: {
    VueEditor
  },
  created() {
    this.form.createuserid = this.info.userid;
    this.memberEffect.createuserid = this.info.userid;
    this.form.hospitalid = this.info.hospitalid;
    this.memberEffect.hospitalid = this.info.hospitalid;
    this.memberHealth.hospitalid = this.info.hospitalid;
    this.memberHealthPlan.hospitalid = this.info.hospitalid;
    this.init();
    this.edcSubClass_Get();
    this.BasicInfo();
  },
  methods: {
    init() {
      this.memberRow = {};
      this.memberHealthRow = {};
      this.memberHealthPlanRow = {};
    },
    async open() {
      this.effectModal = true;
      //每次打开强制最大化
      this.$refs.effectModal.maximize();
    },
    // 表格行排序
    rowSort(a,b) {
      // console.log(a,b)
      let sort1 = a.memberlevel
      let sort2 = b.memberlevel
      return sort1 - sort2
    },
    //会员信息表格行事件
    memberRowClick(row) {
      this.memberHealthList_Get(row.memberid);
      this.memberRow = row;
      this.AddQuestionForm.memberid = row.memberid;
      this.memberHealthPlanTableData = [];
      console.log("当前会员信息:", this.memberRow);
    },
    // 会员健康方案表格行事件
    memberHealthRowClick(row) {
      this.memberHealthRow = row;
      this.AddQuestionForm.memberprogramid = row.memberprogramid;
      this.memberHealthPlanList_Get(row.memberid, row.memberprogramid);
      console.log(
        "当前会员健康方案信息:",
        this.memberHealthRow.memberprogramid
      );
    },
    // 问卷名称匹配随访名称
    handleMatchFollowupname(val) {
      this.detailForm.followupname = this.edcSubClassList.filter(item => {
        if (item.subclassid == val) {
          return item;
        }
      })[0].subclassname;
    },
    // 打开添加明细弹窗
    handleOpenDetailModal() {
      this.detailFormRead = false;
      if (!this.memberHealthRow.memberprogramid) {
        this.$message({
          message: "请选择健康管理方案",
          type: "warning"
        });
        return;
      }
      this.$refs.detailForm.clearValidate();
      this.$refs.detailForm.resetFields();
      this.detailModal = true;
      this.detailForm.subclassid = "";
      this.detailForm.followupname = "";
      this.detailForm.planuserid = "";
      this.detailForm.plantime = "";
      this.plandate = "";
      this.detailForm.remark = "";
    },
    // 提交
    handleSubmitForm(key) {
      this.$refs.detailForm.validate(valid => {
        if (valid) {
          this.programPlan_Operate(key, 0);
        }
      });
    },
    // 健康方案计划操作
    handleRowPlanOperate(row, key) {
      console.log(row, key);
      this.memberHealthPlanRow = row;
      if (key == "detail") {
        this.$refs.detailForm.clearValidate();
        this.$refs.detailForm.resetFields();
        this.detailModal = true;
        this.detailFormRead = true;
        this.detailForm.remark = row.remark;
        this.detailForm.followupname = row.followupname;
        this.detailForm.subclassid = row.subclassname;
        this.detailForm.planusername = row.planusername;
        this.detailForm.planuserid = row.planusername;
        this.plandate = new Date(row.plantime);
      } else if (key == "effect") {
        this.effectModal = true;
        this.memberEffect_Get(row.memberprogramid);
      } else {
        this.programPlan_Operate(key, row.status);
        this.detailFormRead = false;
      }
    },
    // 计划日期 格式处理
    handleChangePlanDate(date) {
      const year = date.getFullYear();
      const month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      this.detailForm.plantime = `${year}-${month}-${day}`;
    },
    //时间范围更改事件
    dateRangeChange(val, memberid) {
      if (memberid == "") {
        this.$message({
          type: "error",
          message: "请先选择健康方案"
        });
        this.daterange = "";
        this.form.doctortimeBegin = "";
        this.form.doctortimeEnd = "";
        return;
      }
      if (val == null) {
        this.form.doctortimeBegin = "";
        this.form.doctortimeEnd = "";
      } else {
        this.form.doctortimeBegin = val[0];
        this.form.doctortimeEnd = val[1];
      }
    },
    stateChange(val, memberid) {
      if (memberid == "") {
        this.$message({
          type: "error",
          message: "请先选择健康方案"
        });
        return;
      }
    },
    // 健康方案实施维护(查询会员列表信息)
    BasicInfo() {
      this.memberHealthTableData = [];
      this.memberHealthPlanTableData = [];
      this.MK.Request(
        "/Hcrm/ProgramPlanExecute/ProgramPlanMemberList_Get",
        "get",
        this.form
      ).then(res => {
        if (res.code == 0) {
          this.memberTableData = res.data;
          this.form.count = res.count;
        }
      });
    },
    // 方案集合查看id
    memberEffect_Get(id) {
      this.memberEffect.memberprogramid = id;
      id || this.memberHealthPlanRow.memberprogramid;
      this.MK.Request(
        "/Hcrm/ExamEvaluate/ExamEvaluateHealthProgram_Get",
        "get",
        { memberprogramid: id }
      ).then(res => {
        if (res.code == 0) {
          this.programcontent = res.programcontent;
          this.programname = res.programname;
        }
      });
    },
    // 根据会员id获取健康方案列表信息
    memberHealthList_Get(id) {
      this.memberHealth.memberid = id;
      this.MK.Request(
        "/Hcrm/ProgramPlanExecute/healthprogramList_Get",
        "get",
        this.memberHealth
      ).then(res => {
        if (res.code == 0) {
          this.memberHealthTableData = res.data;
          this.memberHealth.count = res.count;
          if (res.data.length == 0) {
            this.memberHealthPlanTableData = [];
          }
        }
      });
    },
    // (健康方案实施维护)根据会员id获取健康方案实施列表信息(根据:memberid)
    memberHealthPlanList_Get(memberid, memberprogramid) {
      this.memberHealthPlan.memberid = memberid;
      this.memberHealthPlan.memberprogramid = memberprogramid;
      this.MK.Request(
        "/Hcrm/ProgramPlanExecute/ProgramPlanList_Get",
        "get",
        this.memberHealthPlan
      ).then(res => {
        if (res.code == 0) {
          this.memberHealthPlanTableData = res.data;
          this.memberHealthPlan.count = res.count;
        }
      });
    },
    // 获取edc小类信息
    edcSubClass_Get() {
      this.MK.Request("/Publics/CRFClassMaintain/edcsubclassinfo_Get", "get", {
        classid: 100001
      }).then(res => {
        if (res.code == 0) {
          this.edcSubClassList = res.data;
        }
      });
    },
    // 实施方案操作
    programPlan_Operate(key, status) {
      const data = this.detailForm;
      data.memberid = this.memberRow.memberid;
      data.subclassname = this.detailForm.subclassid
        ? this.edcSubClassList.filter(item => {
            if (
              item.subclassid == this.detailForm.subclassid ||
              item.subclassname == this.detailForm.subclassid
            ) {
              return item;
            }
          })[0].subclassname
        : "";
      data.memberprogramid = this.memberHealthRow.memberprogramid;
      data.operatetype = key;
      data.status = status;
      if (key == "D" || key == "F") {
        data.followupname = this.memberHealthPlanRow.followupname;
        data.serialnumber = this.memberHealthPlanRow.serialnumber;
        data.subclassname = this.memberHealthPlanRow.subclassname;
        data.subclassid = this.memberHealthPlanRow.subclassid;
        data.planusername = this.memberHealthPlanRow.planusername;
        data.plantime = this.memberHealthPlanRow.plantime;
        data.planuserid = this.memberHealthPlanRow.planuserid;
        data.releaseuserid = this.info.userid;
      }
      this.MK.Request(
        "/Hcrm/ProgramPlanExecute/ProgramPlan_Post",
        "post",
        data
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.detailModal = false;
          this.memberHealthPlanList_Get(
            this.memberHealthRow.memberid,
            this.memberHealthRow.memberprogramid
          );
        }
      });
    }
  },
  watch: {
    memberRow(oldval, newval) {
      if (oldval != newval) {
        this.memberHealthRow.memberprogramid = "";
      }
    }
  }
};
</script>

<style scoped>
	.footer {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>