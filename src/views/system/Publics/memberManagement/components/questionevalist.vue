<template>
<!-- 根据会员获取问卷评估信息组件 -->
  <el-container>
    <el-table :data="questionnaireList" highlight-current-row border height="100%">
      <el-table-column
        width="160"
        align="center"
        label="问卷日期"
        sortable
        prop="membertime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        width="160"
        label="健康问卷"
        sortable
        align="center"
        show-overflow-tooltip
        prop="subclassname"
      >
      </el-table-column>
      <el-table-column
        width="120"
        label="来源"
        sortable
        align="center"
        show-overflow-tooltip
        prop="sourcetag"
      >
        <!-- sourcetag:0 医生 1患者 -->
        <template slot-scope="scope">{{scope.row.sourcetag == 0 ? '医生' : '患者'}}</template>
      </el-table-column>
      <el-table-column
        width="120"
        align="center"
        show-overflow-tooltip
        label="状态"
        sortable
        prop="statusdisplay"
      >
        <template slot-scope="scope">
          <el-tag
            :type="GetStatusDispaly(scope.row.status)"
            disable-transitions
          >{{ scope.row.statusdisplay }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="126"
        align="center"
        sortable
        label="评估人"
        show-overflow-tooltip
        prop="useidname"
      ></el-table-column>
      <el-table-column
        width="160"
        align="center"
        sortable
        label="评估时间"
        show-overflow-tooltip
        prop="parsingtime"
      ></el-table-column>
      <el-table-column
        width="200"
        align="center"
        sortable
        label="人群分类"
        show-overflow-tooltip
        prop="riskinfo"
      ></el-table-column>
      <el-table-column
        width="126"
        align="center"
        sortable
        label="发布人"
        show-overflow-tooltip
        prop="releasename"
      ></el-table-column>
      <el-table-column
        width="160"
        align="center"
        sortable
        label="发布时间"
        show-overflow-tooltip
        prop="releasetime"
      ></el-table-column>
      <el-table-column align="center" width="100" fixed="right" label="操作">
        <template slot-scope="scope">
          <div class="tableBtn">
            <el-link
              @click="edcclasscrf_Get(scope.row)"
              title="问卷评估"
              :underline="false"
              type="warning"
              icon="el-icon-question"
            ></el-link>
            <el-link
              title="方案发布"
              @click="rowPlay(scope.row)"
              :underline="false"
              type="primary"
              :disabled="scope.row.status == 3 || scope.row.status == 0"
              :icon="scope.row.status == 3 ? 'el-icon-video-pause' : 'el-icon-video-play'"
            ></el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <vxe-modal v-model="drawer" resize ref="drawer" width="1000" height="800">
      <div slot="title">
        问卷评估 - [
        <span
          style="color:red;"
        >会员等级 ： {{memberBasicinfo.memberlevel_display}} 会员卡号：{{memberBasicinfo.memberno}} 会员姓名：{{memberBasicinfo.membername}} 会员性别：{{memberBasicinfo.sex_dispalay}} 会员年龄：{{memberBasicinfo.age}}</span> ]
      </div>
      <SplitPane :min-percent="20" :default-percent="50" split="vertical">
        <template slot="paneL">
          <el-container>
            <el-header
              style="padding: 0 10px !important;background: #84d2cf;height: 40px !important;min-height:40px !important;"
            >问卷信息查看</el-header>

            <el-main style="padding:0;">
              <el-container>
                <el-main style="padding:0;">
                  <mk-tabs-crf ref="tabscrf" :edit="(sourcetag != 1) && !(classcrfdata.status == 3 || classcrfdata.status == 1 || classcrfdata.status == 2)" ></mk-tabs-crf>
                </el-main>
                <el-footer style="justify-content: center;border-top:1px solid #ccc !important;">
                  <el-button type="primary" :disabled="classcrfdata.status == 3 || classcrfdata.status == 1 || classcrfdata.status == 2" @click="read">问卷已阅</el-button>
                </el-footer>
              </el-container>
            </el-main>
          </el-container>
          <!-- <collapse-list :list="toFormList" @change="formChange" :key="key"></collapse-list> -->
        </template>
        <template slot="paneR">
          <el-container style="border:1px solid #cfd7e5;">
            <el-header
              height="40px"
              style="padding: 0 10px !important;background: #84d2cf;height: 40px !important;min-height:40px !important;"
            >风险类型判定</el-header>
            <el-main style="padding:0;">
              <el-container>
                <el-header style="padding: 0 10px !important;height: 40px !important;">
                  <div style="width:calc(100% - 228px)">
                    <el-tabs closable @tab-remove="removeRiskTab" class="riskTabs">
                      <el-tab-pane
                        :disabled="classcrfdata.status == 3"
                        :key="item.risktypeid"
                        v-for="item in lstRiskList"
                        :label="item.riskname + item.levelname"
                        :name="item.risktypeid.toString()"
                      ></el-tab-pane>
                    </el-tabs>
                  </div>
                  <div>
                    <el-button
                      type="primary"
                      title="添加风险"
                      @click="addRiskTab"
                      :disabled="classcrfdata.status == 3"
                    >添加</el-button>
                    <el-button
                      type="success"
                      icon="el-icon-position"
                      @click="PEHealthPrograme_Create"
                      :disabled="classcrfdata.status == 3"
                    >生成体检方案</el-button>
                  </div>
                </el-header>
                <el-main style="padding:0;">
                  <el-container>
                    <el-header
                      style="padding: 0 10px !important;height: 40px !important;margin-top:2px;"
                    >
                      <el-tabs
                        :stretch="true"
                        v-model="programetype"
                        @tab-click="handleProgrameClick"
                        style="width:100%;border-top:2px solid #E4E7ED !important;"
                      >
                        <el-tab-pane
                          v-for="item in programeNameList"
                          :key="item.programetype"
                          :label=" `${item.programename}（${item.totalfree}）`"
                          :name="item.programetype"
                        ></el-tab-pane>
                      </el-tabs>
                    </el-header>
                    <el-main style="padding:0;">
                      <el-container>
                        <el-aside width="130px" style="padding:0;">
                          <div style="height:calc(100% - 100px)">
                            <el-tabs
                              v-model="deptid"
                              tab-position="left"
                              class="deptList"
                              @tab-click="handleDeptClick"
                              style="height:100%;width:130px;"
                            >
                              <el-tab-pane
                                v-for="item in deptList"
                                :key="item.deptid"
                                :label="item.deptname"
                                :name="item.deptid.toString()"
                              ></el-tab-pane>
                            </el-tabs>
                          </div>
                          <div style="text-align:center;border-right: 2px solid #e4e7ed;">
                            <el-button
                              style="margin-bottom:10px;"
                              @click="AddPorject"
                              :disabled="classcrfdata.status == 3"
                            >添加项目</el-button>
                            <el-button
                              type="danger"
                              style="margin-left:0 !important;"
                              @click="removeProject"
                              :disabled="SelectionGroupList.length == 0 || classcrfdata.status == 3"
                            >移除项目</el-button>
                          </div>
                        </el-aside>
                        <el-main style="padding:0;">
                          <el-table
                            :data="datagroupList"
                            @selection-change="handleSelectionGroupChange"
                            highlight-current-row
                            border
                            ref="refTable"
                            height="100%"
                          >
                            <el-table-column type="selection" align="center" width="50"></el-table-column>
                            <el-table-column type="expand">
                              <template slot-scope="scope">
                                <el-table :data="scope.row.dataitem" :show-header="false">
                                  <el-table-column
                                    label="风险分类描述"
                                    show-overflow-tooltip
                                    align="left"
                                    prop="itemname"
                                  ></el-table-column>
                                </el-table>
                              </template>
                            </el-table-column>
                            <el-table-column prop="groupname" show-overflow-tooltip label="组合名称"></el-table-column>
                            <el-table-column
                              prop="groupfree"
                              show-overflow-tooltip
                              align="right"
                              label="组合金额"
                            ></el-table-column>
                            <el-table-column
                              prop="groupname"
                              show-overflow-tooltip
                              align="center"
                              label="适用性别"
                            >
                              <template slot-scope="scope">
                                <span
                                  class="fa"
                                  style="font-size:16px;margin-right:6px;"
                                  :title="scope.row.limitsex == 1 ? '限制男性' : scope.row.limitsex == 2 ? '限制女性' : '不限制'"
                                  :class="[scope.row.limitsex == '1' ? 'fa-mars primary' : scope.row.limitsex == '2' ? 'fa-venus danger' : 'fa-genderless warning']"
                                ></span>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-main>
                      </el-container>
                    </el-main>
                  </el-container>
                </el-main>
              </el-container>
            </el-main>
            <el-footer style="justify-content: center;">
              <el-button-group>
                <el-button
                  type="success"
                  :disabled="classcrfdata.status == 3"
                  @click="SaveConfirm"
                >评估确定</el-button>
                <el-button
                  type="primary"
                  :disabled="classcrfdata.status == 0 || classcrfdata.status == 3"
                  @click="SavePlay"
                >评估发布</el-button>
                <el-button type="warning" @click="drawer=false">取消</el-button>
              </el-button-group>
            </el-footer>
          </el-container>
        </template>
      </SplitPane>
    </vxe-modal>
       <!-- 组合添加 -->
    <vxe-modal ref="GroupModal" v-model="GroupModal" title="组合添加" :showFooter="true" width="800" height="600">
      <el-container>
        <el-aside width="130px" style="padding:0;">
          <el-tabs
            v-model="deptidAdd"
            tab-position="left"
            class="deptList"
            @tab-click="handleAddDeptClick"
            style="height:100%;width:130px;"
          >
            <el-tab-pane key="-1" label="全部" name="-1"></el-tab-pane>
            <el-tab-pane
              v-for="item in AddDeptList"
              :key="item.deptid"
              :label="item.deptname"
              :name="item.deptid.toString()"
            ></el-tab-pane>
          </el-tabs>
        </el-aside>
        <el-main>
          <el-table
            :data="AddGroupListUpdate"
            border
            stripe
            @selection-change="handleSelectionAddGroupChange"
            @expand-change="AddGroupFoldChange"
            :row-key="getAddGroupRowKeys"
            :expand-row-keys="expandsAddGroup"
            ref="refTable"
            height="100%"
          >
            <el-table-column type="selection" align="center" width="50"></el-table-column>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-table :data="AddGroupDetail" border :show-header="false">
                  <el-table-column prop="itemname"></el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="groupname" label="组合名称"></el-table-column>
            <el-table-column prop="groupfree" align="right" label="组合金额"></el-table-column>
            <el-table-column prop="groupname" align="center" label="适用性别">
              <template slot-scope="scope">
                <span
                  class="fa"
                  style="font-size:16px;margin-right:6px;"
                  :title="scope.row.limitsex == 1 ? '限制男性' : scope.row.limitsex == 2 ? '限制女性' : '不限制'"
                  :class="[scope.row.limitsex == '1' ? 'fa-mars primary' : scope.row.limitsex == '2' ? 'fa-venus danger' : 'fa-genderless warning']"
                ></span>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>

      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="success" @click="GroupSumbit">提交</el-button>
          <el-button type="warning" @click="GroupClose">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
    <!-- 风险分类添加 -->
    <vxe-modal ref="cateModal" v-model="cateModal" :showFooter="true" title="风险添加"  width="1200" height="800">
      <div slot="header">
        风险添加 -
        [
        <span
          style="color:red;"
        >会员等级 ： {{memberBasicinfo.memberlevel_display}} 会员卡号：{{memberBasicinfo.memberno}} 会员姓名：{{memberBasicinfo.membername}} 会员性别：{{memberBasicinfo.sex_dispalay}} 会员年龄：{{memberBasicinfo.age}}</span> ]
      </div>
      <SplitPane :min-percent="20" :default-percent="40" split="vertical">
        <template slot="paneL">
          <el-container>
            <el-header
              style="padding: 0 10px !important;background: #84d2cf;height: 40px !important;min-height:40px !important;justify-content: space-between;"
            >
              <div>未添加</div>
              <div>
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="!subRow.levelid"
                  @click="AddRiskData"
                >添加</el-button>
              </div>
            </el-header>
            <el-main style="padding:0;">
              <el-table
                v-loading="pictLoading"
                highlight-current-row
                border
                :data="physicalsList"
                :row-key="getRowKeys"
                ref="refTable"
                :expand-row-keys="expands"
                @expand-change="rowChange"
                @row-click="riskRowClick"
                stripe
                height="100%"
              >
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <div style>
                      <el-scrollbar style="height:100%;">
                        <el-table
                          highlight-current-row
                          :data="risklevelList"
                          @row-click="levelRowClick"
                          :show-header="false"
                        >
                          <el-table-column
                            label="风险分类等级"
                            show-overflow-tooltip
                            align="left"
                            prop="levelname"
                          >
                            <template slot-scope="scope">
                              <div style="padding-left:60px;">
                                <el-radio
                                  v-model="radio"
                                  :label="scope.row.levelid"
                                  style="margin-right:0 !important;"
                                >
                                  <span class="el-radio__label"></span>
                                </el-radio>
                                <span style="color:#000;">类型：</span>
                                <span>{{scope.row.levelname}}</span>
                              </div>
                            </template>
                          </el-table-column>
                          <el-table-column
                            label="风险分类描述"
                            show-overflow-tooltip
                            align="left"
                            prop="levelnote"
                          >
                            <template slot-scope="scope">
                              <div style="padding-left:60px;">
                                <span style="color:#000;">描述：</span>
                                <span>{{scope.row.levelnote}}</span>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-scrollbar>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="风险分类名称" show-overflow-tooltip align="left" prop="riskname"></el-table-column>
                <el-table-column align="center" show-overflow-tooltip prop="status" label="状态">
                  <template slot-scope="scope">
                    <el-tag
                      :type="GetOpenAndStoptatusType(scope.row.status)"
                      disable-transitions
                    >{{ scope.row.statusdisplay }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
          </el-container>
        </template>
        <template slot="paneR">
          <el-container>
            <el-header
              style="padding: 0 10px !important;background: #84d2cf;height: 40px !important;min-height:40px !important;justify-content: space-between;"
            >
              <div>已添加</div>
              <div>
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="cateList.length == 0"
                  @click="handleDel"
                >移除</el-button>
              </div>
            </el-header>
            <el-main style="padding:0;">
              <el-table
                :data="lstRiskCloneList"
                highlight-current-row
                border
                @selection-change="cateHandleSelectionChange"
                height="100%"
                style="width: 100%"
              >
                <el-table-column align="center" type="selection" width="55"></el-table-column>
                <el-table-column label="风险分类" show-overflow-tooltip prop="riskname"></el-table-column>
                <el-table-column label="风险等级" show-overflow-tooltip prop="levelname"></el-table-column>
              </el-table>
            </el-main>
          </el-container>
        </template>
      </SplitPane>
      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="success" @click="riskSumbit">提交</el-button>
          <el-button type="warning" @click="cateClose">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
  </el-container>
</template>
<script>
export default {
  name: "questioneva-list",
  props: {
    userData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      cateModal:false,
      GroupModal:false,
      crfid: "",
      radio: null,
      deptidAdd: "-1",
      deptid: null,
      pictLoading: true,
      tabCrfIndex: "",
      copylstRiskList: [],
      lstRiskCloneList: [],
      tabRiskIndex: 0,
      cateList: [],
      physicalsList: [],
      getRowKeys(row) {
        return row.riskid;
      },
      getRroupRowKeys(row) {
        return row.groupid;
      },
      getAddGroupRowKeys(row) {
        return row.groupid;
      },
      expands: [],
      expandsAddGroup: [],
      parentRow: {},
      subRow: {},
      evaluateid: null, //评估id
      classcrfdata: {},
      edit: true,
      sourcetag: "1", //来源 0医生 1患者
      drawer: false,
      AddModal: false,
      memberBasicinfo: {}, //个人信息
      questionnaireList:[],
      lstRiskList: [],
      toFormList: [],
      programeNameList: [],
      programetype: "", //方案类型
      AddDeptList: [],
      AddGroupDetail: [],
      AddGroupList: [],
      deptList: [], //生成方案科室数据
      datagroupList: [], //科室对应的组合
      dataitemList: [], //组合对应的明细
      SelectionGroupList: [], //组合选中
      SelectionAddGroupList: [], //添加项目组合选中
      curRow: {},
      questionList: [],
      evaluateid: null, //评估id
      sourcetag: "1", //来源 0医生 1患者
      param:{}
    };
  },
  computed: {
    AddGroupListUpdate() {
      if (this.deptidAdd != "-1") {
        return this.AddGroupList.filter(item => this.deptidAdd == item.deptid);
      } else {
        return this.AddGroupList;
      }
    }
  },
  methods: {
    //清除
    clear(){
      this.questionnaireList = [];
    },
    // 根据会员id获取体检问卷列表
    getData(param) {
      this.$nextTick(() => {
        param.memberid = this.userData.memberid;
        param.status = param.status === "" ? undefined : param.status;
        param.hospitalid = this.info.hospitalid;
        this.param = param;
        this.MK.Request(
          "/Hcrm/QuestionnaireEvaluate/PEQuestionnaire_Get",
          "get",
          param
        ).then(res => {
          if (res.code == 0) {
            this.questionnaireList = res.data;
          }
        });
      })
    },
    //  根据评估id(evaluateid)获取对应的问卷评估明细信息[包含：问卷,人群类型,体检方案信息]
    async edcclasscrf_Get(row) {
      let res = await this.PECheckupPlan_Get(row.evaluateid, "0");
      if (res.code == 0) {
        this.deptList = res.data;
      }
      this.classcrfdata = row;
      this.sourcetag = row.sourcetag;
      this.evaluateid = row.evaluateid;
      this.MK.Request(
        "/Hcrm/QuestionnaireEvaluate/PEDetailByEvaluateid_Get",
        "get",
        row
      ).then(res => {
        if (res.code == 0) {
          this.drawer = true;
          this.$refs.drawer.maximize();
          this.lstRiskList = res.lstRisk;
          this.memberBasicinfo = res.memberBasicinfo;
          this.programeNameList = res.programeName;
          this.$refs.tabscrf.CRFillJsonBysubclassid_Get({
            collectionid: this.classcrfdata.collectionid,
            memberid: this.memberBasicinfo.memberid,
            subclassid: this.classcrfdata.subclassid
          });
        }
      });
    },

    // 根据评估id(evaluateid)和方案类型(programetype)获取对应的体检方案
    PECheckupPlan_Get(evaluateid, programetype) {
      return this.MK.Request(
        "/Hcrm/QuestionnaireEvaluate/PECheckupPlan_Get",
        "get",
        {
          evaluateid,
          programetype
        }
      );
    },
    //已阅操作
    read() {
      this.crfSave();
    },
    //表单保存
    crfSave() {
      this.$refs.tabscrf.getData(this.classcrfdata.collectionid).then(res => {
        if (res) {
          //表单提交保存
          this.$refs.tabscrf.saveData(res).then(async data => {
            //调用阅读操作
            let res = await this.PEQuestionnaireEvaluate_Deal(1);
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: res.msg
              });
              //手动改状态
              this.classcrfdata.status = 1;
              this.PEevaluaterisk_Get(this.evaluateid);
            }
          });
        }
      });
    },
    //获取风险类型数据
    PEevaluaterisk_Get(evaluateid) {
      this.MK.Request("/Hcrm/QuestionnaireEvaluate/PEevaluaterisk_Get", "get", {
        evaluateid
      }).then(res => {
        if (res.code == 0) {
          this.lstRiskList = res.data;
        }
      });
    },
    //row行点击发布
    rowPlay(row) {
      this.$confirm(`确认要发布, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let sendData = {
          evaluateid: row.evaluateid,
          memberid: row.memberid,
          status: 3,
          createuserid: this.info.userid
        };
        this.MK.Request(
          "/Hcrm/QuestionnaireEvaluate/PEQuestionnaireEvaluate_Deal",
          "post",
          sendData
        ).then(res => {
          this.getData(this.param);
        });
      });
    },
    //评估确定
    async SaveConfirm() {
      let res = await this.PEQuestionnaireEvaluate_Deal(2);
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.classcrfdata.status = 2;
        this.drawer = false;
      } else {
        return;
      }
    },
    //评估发布
    async SavePlay() {
      let res = await this.PEQuestionnaireEvaluate_Deal(3);
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.drawer = false;
      } else {
        return;
      }
    },
    PEQuestionnaireEvaluate_Deal(status) {
      let sendData = {
        evaluateid: this.evaluateid,
        memberid: this.userData.memberid,
        status: status,
        createuserid: this.info.userid
      };
      return this.MK.Request(
        "/Hcrm/QuestionnaireEvaluate/PEQuestionnaireEvaluate_Deal",
        "post",
        sendData
      ).then(res => {
        if(res.code == 0){
          this.getData(this.param);
          return res;
        }
      });
    },
     //根据问卷评填写结果生成体检方案
    PEHealthPrograme_Create() {
      let sendData = {
        memberid: this.userData.memberid,
        subclassid: this.classcrfdata.subclassid,
        evaluateid: this.evaluateid,
        limitsex: this.memberBasicinfo.sex
      };
      this.MK.Request(
        "/Hcrm/QuestionnaireEvaluate/PEHealthPrograme_Create",
        "post",
        sendData
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.PEProgrameMain_Get(
            this.userData.memberid,
            this.evaluateid
          );
          this.handleProgrameClick({ name: "0" });
        }
      });
    },
     //医生新增问卷
    healthprograminfo_Add() {
      this.MK.Request(
        "/Hcrm/QuestionnaireEvaluate/PEQuestionnaire_Add",
        "post",
        this.userData
      ).then(async res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
         this.getData(this.param);
        }
      });
    },
    //风险分类关闭
    cateClose() {
      this.$refs.cateModal.close();
    },
    //组合关闭
    GroupClose() {
      this.$refs.GroupModal.close();
    },
    async addRiskTab(tabRiskIndex) {
      this.$refs.cateModal.open();
      this.lstRiskCloneList = JSON.parse(JSON.stringify(this.lstRiskList));
      let res = await this.risktypeinfo_Get();
      if (res.code == 0) {
      }

      // let newTabName = ++this.tabRiskIndex + "";
      // this.lstRiskList.push({
      //   riskname: "New Tab",
      //   risktypeid: newTabName
      // });
    },
    //删除
    removeRiskTab(targetName) {
      this.$confirm("确定要删除吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let tabs = this.lstRiskList;
          tabs.forEach(async item => {
            if (item.risktypeid == targetName) {
              item.evaluatetype = "0";
              item.evaluateid = this.evaluateid;
              let res = await this.PEevaluaterisk_Del(item);
              if (res.code == 0) {
                this.lstRiskList = tabs.filter(
                  tab => tab.risktypeid != targetName
                );
              }
            }
          });
        })
        .catch(() => {});
    },
    //风险等级数据删除
    PEevaluaterisk_Del(data) {
      return this.MK.Request(
        "/Hcrm/QuestionnaireEvaluate/PEevaluaterisk_Del",
        "post",
        data
      );
    },
    riskRowClick(row) {
      this.$refs.refTable.toggleRowExpansion(row);
    },
    //折叠事件
    async rowChange(row, expandedRows) {
      //	每次只展开一个扩展列表
      this.pictLoading = true;
      var that = this;
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          let res = await this.risklevel_Get(row.riskid);
          if (res.code == 0) {
            this.radio = null;
            this.parentRow = row;
            this.risklevelList = res.data;
            this.$nextTick(() => {
              this.pictLoading = false;
              this.expands.push(row.riskid);
            });
          }
        }
      } else {
        this.pictLoading = false;
        this.expands = [];
        this.parentRow = {};
        this.subRow = {};
      }
    },
    //等级行单击
    levelRowClick(row) {
      this.subRow = row;
      this.radio = row.levelid;
      this.AddRiskData();
    },
    //添加风险分类
    AddRiskData() {
      this.copylstRiskList = JSON.parse(JSON.stringify(this.lstRiskCloneList));
      let data = { ...this.parentRow, ...this.subRow };
      data.risktypeid = data.riskid;
      //判断是否重复
      let isRepeat = this.copylstRiskList.some(
        item => item.risktypeid == data.riskid
      );
      //查找重复项元素位置
      let index = this.copylstRiskList.findIndex(
        item => item.risktypeid == data.riskid
      );
      if (!isRepeat) {
        this.copylstRiskList.push(JSON.parse(JSON.stringify(data)));
      } else {
        this.copylstRiskList.splice(index, 1, JSON.parse(JSON.stringify(data)));
      }
      this.lstRiskCloneList = this.copylstRiskList;
    },
    cateHandleSelectionChange(val) {
      this.cateList = val;
    },
    //获取体检方案新增组合信息
    PEGroupInfo_Get() {
      let sendData = {
        hospitalid: this.info.hospitalid,
        evaluateid: this.evaluateid,
        memberid: this.userData.memberid,
        programetype: this.programetype
      };
      this.MK.Request(
        "/Hcrm/QuestionnaireEvaluate/PEGroupInfo_Get",
        "get",
        sendData
      ).then(res => {
        let data = res.data;
        this.AddDeptList = this.repeatRemove(data, "deptid");
        console.log(this.AddDeptList);
        this.AddGroupList = res.data;
      });
    },
    //添加项目组合 选中事件
    handleSelectionAddGroupChange(val) {
      this.SelectionAddGroupList = val;
    },
    //添加项目组合科室点击事件
    handleAddDeptClick(tab) {
      this.deptidAdd = tab.name;
    },
    //添加项目组合 折叠事件
    async AddGroupFoldChange(row, expandedRows) {
      if (expandedRows.length) {
        this.expandsAddGroup = [];
        if (row) {
          let res = await this.PEItemDetail_Get(row.deptid, row.groupid);
          if (res.code == 0) {
            this.AddGroupDetail = res.data;
            this.expandsAddGroup.push(row.groupid);
          }
        }
      }
    },
    //根据院区id，科室id，组合id获取对应的体检明细项目
    PEItemDetail_Get(deptid, groupid) {
      return this.MK.Request("/Hcrm/PEPrograme/PEItemDetail_Get", "get", {
        hospitalid: this.info.hospitalid,
        deptid: deptid,
        groupid: groupid
      });
    },
    //数组去重
    repeatRemove(data, id) {
      let obj = {};
      let Arr = data.reduce((cur, next) => {
        obj[next[id]] ? "" : (obj[next[id]] = true && cur.push(next));
        return cur;
      }, []);
      return Arr;
    },
    //组合提交
    GroupSumbit() {
      this.PEQuestionnaireEvaluateItem_Add();
    },
    //问卷评估体检方案新增体检组合信息 ****
    PEQuestionnaireEvaluateItem_Add() {
      let sendData = {
        hospitalid: this.info.hospitalid,
        evaluateid: this.evaluateid,
        memberid: this.userData.memberid,
        programetype: this.programetype,
        sourceenquiryid: this.classcrfdata.subclassid,
        sourcetag: this.classcrfdata.sourcetag,
        lstDetal: this.SelectionAddGroupList
      };
      this.MK.Request(
        "/Hcrm/QuestionnaireEvaluate/PEQuestionnaireEvaluateItem_Add",
        "post",
        sendData
      ).then(async res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.$refs.GroupModal.close();
          let result = await this.PEProgrameMain_Get(
            this.userData.memberid,
            this.evaluateid
          );
          let resdept = await this.PECheckupPlan_Get(
            this.evaluateid,
            this.programetype
          );
          if (resdept.code == 0) {
            this.deptList = resdept.data;
            this.handleDeptClick({ name: this.deptid });
          }
        }
      });
    },
    //根据评估id(evaluateid)和会员id(memberid) 获取对应的体检方案信息(概要信息--体检方案和对应的金额信息)
    PEProgrameMain_Get(memberid, evaluateid) {
      return this.MK.Request(
        "/Hcrm/QuestionnaireEvaluate/PEProgrameMain_Get",
        "get",
        {
          memberid,
          evaluateid
        }
      ).then(res => {
        if (res.code == 0) {
          this.programeNameList = res.programeName;
          return res;
        } else {
          return false;
        }
      });
    },
    //移除项目
    removeProject() {
      this.PEQuestionnaireEvaluateItem_Del();
    },
    // 问卷评估体检方案移除项目信息 ****
    PEQuestionnaireEvaluateItem_Del() {
      let sendData = {
        hospitalid: this.info.hospitalid,
        evaluateid: this.evaluateid,
        memberid: this.userData.memberid,
        programetype: this.programetype,
        sourceenquiryid: this.classcrfdata.subclassid,
        sourcetag: this.classcrfdata.sourcetag,
        lstDetal: this.SelectionGroupList
      };
      this.MK.Request(
        "/Hcrm/QuestionnaireEvaluate/PEQuestionnaireEvaluateItem_Del",
        "post",
        sendData
      ).then(async res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.SelectionGroupList = [];
          this.datagroupList = [];
          let result = await this.PEProgrameMain_Get(
            this.userData.memberid,
            this.evaluateid
          );
          let resdept = await this.PECheckupPlan_Get(
            this.evaluateid,
            this.programetype
          );
          if (resdept.code == 0) {
            this.deptList = resdept.data;
          }
          // this.handleProgrameClick({ name: this.programetype });
          this.handleDeptClick({ name: this.deptid });
        }
      });
    },
    //添加
    AddPorject() {
      this.deptidAdd = "-1";
      this.PEGroupInfo_Get();
      this.$refs.GroupModal.open();
    },
    //风险类型移除
    handleDel() {
      let val = this.cateList;
      if (val) {
        val.forEach((item, index) => {
          this.lstRiskCloneList.forEach((key, kindex) => {
            if (item.risktypeid == key.risktypeid) {
              this.lstRiskCloneList.splice(kindex, 1);
            }
          });
        });
      }
    },
    //编辑会员对应的风险类型及等级
    riskSumbit() {
      let sendData = {
        evaluateid: this.evaluateid, //评估id
        evaluatetype: 0, //评估类型 0：问卷评估 1：体检评估
        lstevaluaterisk: this.lstRiskCloneList
      };
      this.MK.Request(
        "/Hcrm/QuestionnaireEvaluate/PEevaluaterisk_Edit",
        "post",
        sendData
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.lstRiskList = JSON.parse(JSON.stringify(this.lstRiskCloneList));
          this.cateClose();
        }
      });
    },
    //查询风险类型信息
    risktypeinfo_Get() {
      return this.MK.Request("/Hcrm/Risktypeinfo/risktypeinfo_Get", "get", {
        tag: 1
      }).then(res => {
        if (res.code == 0) {
          this.physicalsList = res.data;
          this.pictLoading = false;
          return res;
        }
      });
    },
    //根据风险类型id查询风险等级
    risklevel_Get(riskid) {
      return this.MK.Request("/Hcrm/Risktypeinfo/risklevel_Get", "get", {
        risktypeid: riskid,
        condition: "",
        tag: 1
      });
    },
    async handleProgrameClick(tab) {
      let programetype = tab.name;
      this.programetype = tab.name;
      let evaluateid = this.evaluateid;
      this.datagroupList = [];
      this.deptid = null;
      let res = await this.PECheckupPlan_Get(evaluateid, programetype);
      if (res.code == 0) {
        this.deptList = res.data;
      }
    },
    //科室点击事件
    handleDeptClick(tab) {
      this.deptid = tab.name;
      this.getGroupList(tab.name);
    },
    //
    getGroupList(id) {
      if (this.deptList.length == 0) return;
      this.deptList.forEach(item => {
        if (item.deptid == id) {
          this.datagroupList = JSON.parse(JSON.stringify(item.datagroup));
        }
      });
    },
    //组合选中事件
    handleSelectionGroupChange(val) {
      this.SelectionGroupList = val;
    },

    //获取组合明细
    getGroupDetail(data) {
      let Arr = [];
      data.forEach(item => {
        if (item.dataitem) {
          item.dataitem.forEach(key => {
            Arr.push(key);
          });
        }
      });
      return Arr;
    },
  }
};
</script>
<style  scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}
>>> .el-drawer__header {
  margin-bottom: 10px;
  background: #f0f0f0;
  padding: 10px;
}
>>> .el-tabs__content {
  height: 100%;
}
.theme-navyblue .el-tabs__item.is-active {
  background: #fff !important;
  color: #409eff !important;
}
.riskTabs >>> .el-tabs__nav-wrap::after,
.riskTabs >>> .el-tabs__active-bar {
  height: 0;
}
.riskTabs >>> .el-tabs__item.is-active {
  color: #666;
}
/*  */
.riskTabs >>> .el-tabs__item {
  background: #f5f5f5;
  margin: 0 6px;
  border-radius: 6px;
}
.riskTabs >>> .el-tabs__item:hover {
  color: #666;
}
.riskTabs >>> .el-tabs__item.is-top:nth-child(2) {
  padding: 0 20px !important;
}
.riskTabs >>> .el-tabs__item.is-top:last-child {
  padding-right: 10px;
}
.deptList >>> .el-tabs__item.is-left {
  text-align: center;
}
.deptList >>> .el-tabs__header {
  width: 130px;
}
.deptList >>> .el-tabs__nav-wrap {
  width: 100%;
}
</style>
