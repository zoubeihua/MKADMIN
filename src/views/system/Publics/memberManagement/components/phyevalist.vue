<template>
<el-container>
  <!-- 根据会员获取体检评估信息组件 -->
  <el-table stripe :data="questionnaireList" highlight-current-row border height="100%">
    <el-table-column
      sortable
      width="160"
      align="center"
      label="体检日期"
      prop="examdate"
      show-overflow-tooltip
    ></el-table-column>
    <el-table-column
      sortable
      width="160"
      label="体检机构"
      align="center"
      show-overflow-tooltip
      prop="orgidname"
    >
      <!-- <template slot-scope="scope">
              <el-link
                type="primary"
                :underline="false"
                @click="subclassClick(scope.row)"
              >{{scope.row.subclassname}}</el-link>
      </template>-->
    </el-table-column>
    <el-table-column
      sortable
      width="100"
      label="来源"
      align="center"
      show-overflow-tooltip
      prop="sourcetag"
    >
      <!-- sourcetag:0 医生 1患者 -->
      <template slot-scope="scope">{{scope.row.sourcetag == 0 ? '医生' : '患者'}}</template>
    </el-table-column>
    <el-table-column
      width="120"
      sortable
      align="center"
      show-overflow-tooltip
      label="状态"
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
      sortable
      width="126"
      align="center"
      label="评估人"
      show-overflow-tooltip
      prop="doctorname"
    ></el-table-column>
    <el-table-column
      sortable
      width="160"
      align="center"
      label="评估时间"
      show-overflow-tooltip
      prop="doctortime"
    ></el-table-column>
    <el-table-column
      width="200"
      sortable
      align="center"
      label="人群分类"
      show-overflow-tooltip
      prop="riskinfo"
    ></el-table-column>
    <el-table-column
      width="126"
      sortable
      align="center"
      label="发布人"
      show-overflow-tooltip
      prop="releasename"
    ></el-table-column>
    <el-table-column
      width="160"
      sortable
      align="center"
      label="发布时间"
      show-overflow-tooltip
      prop="releasetime"
    ></el-table-column>
    <el-table-column align="center" width="100" fixed="right" label="操作">
      <template slot="header">
        <span class="primary">操作</span>
      </template>
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
              style="padding: 0 10px !important;background: #84d2cf;height: 40px !important;justify-content: space-between;"
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
              style="padding: 0 10px !important;background: #84d2cf;height: 40px !important;justify-content: space-between;"
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

    <vxe-modal v-model="drawer" resize ref="drawer" width="1000" height="800">
      <div slot="title">
        体检评估 - [
        <span
          style="color:red;"
        >会员等级 ： {{memberBasicinfo.memberlevel_display}} 会员卡号：{{memberBasicinfo.memberno}} 会员姓名：{{memberBasicinfo.membername}} 会员性别：{{memberBasicinfo.sex_dispalay}} 会员年龄：{{memberBasicinfo.age}}</span> ]
      </div>
      <SplitPane :min-percent="20" :default-percent="50" split="vertical">
        <template slot="paneL">
          <el-container>
            <el-header
              style="padding: 0 10px !important;background: #84d2cf;height: 40px !important;min-height:40px !important;"
            >体检信息查看</el-header>

            <el-main style="padding:0;">
              <el-container>
                <el-main style="padding:0;">
                  <el-main style="padding:0;">
                    <mk-tabs-crf ref="tabscrf" :edit="!(classcrfdata.status == 3 || classcrfdata.status == 2 || classcrfdata.status == 1)" @change="tabsrfChange"></mk-tabs-crf>
                  </el-main>
                </el-main>
                <el-footer style="justify-content: center;border-top:1px solid #ccc !important;">
                  <el-button type="primary" :disabled="classcrfdata.status == 3 || classcrfdata.status == 2  || classcrfdata.status == 1" @click="read">问卷已阅</el-button>
                </el-footer>
              </el-container>
            </el-main>
          </el-container>
        </template>
        <template slot="paneR">
          <el-container style="border:1px solid #cfd7e5;">
            <el-header
              height="40px"
              style="padding: 0 10px !important;background: #84d2cf;height: 40px !important;min-height:40px !important;"
            >风险类型判定</el-header>
            <el-main style="padding:0;">
              <el-container>
                <el-header
                  style="padding: 0 10px !important;height: 46px !important;border-bottom:1px solid #ccc !important;"
                >
                  <div style="width:calc(100% - 240px)">
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
                      :disabled="classcrfdata.status == 3"
                      @click="addRiskTab"
                    >添加风险</el-button>
                    <el-button
                      type="success"
                      :disabled="classcrfdata.status == 3"
                      @click="PEHealthPrograme_Create"
                    >生成健康方案</el-button>
                  </div>
                </el-header>
                <el-main style="padding:0;">
                  <el-container>
                    <el-header
                      style="padding: 0 10px !important;height: 46px !important;border-bottom:1px solid #ccc !important;"
                    >
                      <div style="width:calc(100% - 240px)">
                        <el-input
                          :disabled="classcrfdata.status == 3"
                          v-model="programename"
                          placeholder="请输入内容"
                        >
                          <template slot="prepend">方案名称</template>
                        </el-input>
                      </div>
                      <div>
                        <quote-programme
                          :disabled="classcrfdata.status == 3"
                          @push="pushProgramme"
                          @replace="replaceProgramme"
                          style="margin-right:10px;"
                        >引用方案</quote-programme>
                        <quote-knowledge-base
                          type="success"
                          v-model="programcontent"
                          :disabled="classcrfdata.status == 3"
                          style="width:126px;"
                        >引用知识库</quote-knowledge-base>
                      </div>
                    </el-header>
                    <el-main style="padding:0;">
                      <vue-editor
                        style="height:calc(100% - 48px)"
                        v-model="programcontent"
                        class="fm-editor"
                      ></vue-editor>
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
                  :disabled="classcrfdata.status == 3 || classcrfdata.status == 0"
                  @click="SavePlay"
                >评估发布</el-button>
                <el-button type="warning" @click="drawer=false">取消</el-button>
              </el-button-group>
            </el-footer>
          </el-container>
        </template>
      </SplitPane>
    </vxe-modal>
</el-container>
</template>
<script>
import { VueEditor } from "vue2-editor";
import QuoteProgramme from "@/views/HCRM/healthManagement/components/quoteprogramme";
import QuoteKnowledgeBase from "@/views/HCRM/healthManagement/components/quoteknowledgebase";
export default {
  name:'payeva-list',
  props: {
    userData: {
      type: Object,
      default: () => {}
    }
  },
  components:{
    VueEditor,
    QuoteProgramme,
    QuoteKnowledgeBase
  },
  data() {
    return {
      cateModal:false,
      programename: "", //方案名称
      programcontent: "", //方案内容
      radio: null,
      pictLoading: true,
      copylstRiskList: [],
      lstRiskCloneList: [],
      cateList: [],
      physicalsList: [],
      getRowKeys(row) {
        return row.riskid;
      },
      expands: [],
      parentRow: {},
      subRow: {},
      evaluateid: null, //评估id
      classcrfdata: {},
      sourcetag: "1", //来源 0医生 1患者
      drawer: false,
      memberRow: {},
      memberBasicinfo: {}, //个人信息
      lstRiskList: [],
      questionnaireList: [], //体检信息
      param:{}
    }
  },
  methods:{
    clear(){
      this.questionnaireList = [];
    },
    // 根据会员信息获取体检问卷列表
    getData(param) {
      this.$nextTick(() => {
        param.memberid = this.userData.memberid;
        param.hospitalid = this.info.hospitalid;
        this.param = param;
        return this.MK.Request(
          "/Hcrm/ExamEvaluate/ExamEvaluatelist_Get",
          "get",
          param
        ).then(res => {
          if (res.code == 0) {
            this.questionnaireList = res.data;
            return res;
          }
        });
      })
    },
     //追加方案
    pushProgramme(data) {
      this.programcontent += data.programcontent;
      this.programename += data.programename;
    },
    //替换方案
    replaceProgramme(data) {
      this.programcontent = data.programcontent;
      this.programename = data.programename;
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
            let res = await this.PEQuestionnaireEvaluate_Deal(1);
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: res.msg
              });
              this.classcrfdata.status = 1;
              this.getData(this.param);
              this.PEevaluaterisk_Get(this.evaluateid);
            }
          });
        }
      });
    },
    //表单tabs点击事件
    tabsrfChange(tab) {},
    //评估确定
    SaveConfirm() {
      let sendData = {
        operatetype: "",
        memberid: this.userData.memberid,
        evaluateid: this.evaluateid,
        sourcesubclassid: this.classcrfdata.subclassid,
        sourceexameid: this.classcrfdata.exameid,
        note: "",
        limitsex: this.memberBasicinfo.sex,
        doctorid: this.info.userid,
        programename: this.programename,
        programcontent: this.programcontent
      };
      this.MK.Request(
        "/Hcrm/ExamEvaluate/ExamEvaluateHealthProgram_save",
        "post",
        sendData
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.classcrfdata.status = 2;
          this.drawer = false;
          this.getData(this.userData.memberid);
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
          sourceexameid: row.exameid,
          sourcesubclassid: row.subclassid,
          status: status,
          createuserid: this.info.userid,
          status: 3
        };
        this.MK.Request(
          "/Hcrm/ExamEvaluate/ExamEvaluate_Deal",
          "post",
          sendData
        ).then(async res => {
          this.getData(this.param);
        });
      });
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
        sourceexameid: this.classcrfdata.exameid,
        sourcesubclassid: this.classcrfdata.subclassid,
        status: status,
        createuserid: this.info.userid
      };
      return this.MK.Request(
        "/Hcrm/ExamEvaluate/ExamEvaluate_Deal",
        "post",
        sendData
      ).then(res => {
        if(res.code == 0){
          this.getData(this.param);
          return res;
        }
      });
    },
    //
    //(体检评估)生成健康方案
    PEHealthPrograme_Create() {
      let sendData = {
        memberid: this.userData.memberid,
        evaluateid: this.evaluateid,
        sourcesubclassid: this.classcrfdata.subclassid,
        sourceexameid: this.classcrfdata.exameid,
        note: "",
        limitsex: this.memberBasicinfo.sex,
        doctorid: this.info.userid
      };
      this.MK.Request(
        "/Hcrm/ExamEvaluate/ExamEvaluateHealthProgram_create",
        "post",
        sendData
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.programcontent = "";
          this.programename = "";
          let resData = res.programeInfo;
          let programenameArr = [];
          let programcontentArr = [];
          resData.forEach(item => {
            programenameArr.push(item.programname);
            this.programcontent += item.programcontent;
          });
          this.programename = programenameArr.join(",");
        }
      });
    },
    //风险分类关闭
    cateClose() {
      this.$refs.cateModal.close();
    },
    //(体检评估)根据评估id(evaluateid)获取对应的风险分类和等级信息
    PEevaluaterisk_Get(evaluateid) {
      return this.MK.Request("/Hcrm/ExamEvaluate/ExamEvaluaterisk_Get", "get", {
        evaluateid
      }).then(res => {
        if (res.code == 0) {
          this.lstRiskList = result.data;
          return res;
        }
      });
    },
    async addRiskTab() {
      this.lstRiskCloneList = JSON.parse(JSON.stringify(this.lstRiskList));
      let res = await this.risktypeinfo_Get();
      if (res.code == 0) {
         this.$refs.cateModal.open();
      }
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
              item.evaluatetype = "1";
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
    //
    PEevaluaterisk_Del(data) {
      return this.MK.Request(
        "/Hcrm/ExamEvaluate/ExamEvaluaterisk_Del",
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
    //数组去重
    repeatRemove(data, id) {
      let obj = {};
      let Arr = data.reduce((cur, next) => {
        obj[next[id]] ? "" : (obj[next[id]] = true && cur.push(next));
        return cur;
      }, []);
      return Arr;
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
        evaluatetype: 1, //评估类型 0：问卷评估 1：体检评估
        lstevaluaterisk: this.lstRiskCloneList
      };
      this.MK.Request(
        "/Hcrm/ExamEvaluate/ExamEvaluaterisk_Edit",
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
    //根据评估id(evaluateid)获取对应的体检评估明细信息[包含：问卷,人群类型,体检方案信息]
    async edcclasscrf_Get(row) {
      this.classcrfdata = row;
      this.sourcetag = row.sourcetag;
      this.evaluateid = row.evaluateid;
      this.MK.Request(
        "/Hcrm/ExamEvaluate/ExamEvaluateDetail_Get",
        "get",
        row
      ).then(res => {
        if (res.code == 0) {
          this.drawer = true;
          this.$refs.drawer.maximize();
          this.lstRiskList = res.lstRisk;
          this.memberBasicinfo = res.memberBasicinfo;
          this.ExamEvaluateHealthProgram_Get();
          this.$refs.tabscrf.CRFillJsonBysubclassid_Get({
            collectionid: this.classcrfdata.collectionid,
            memberid: this.memberBasicinfo.memberid,
            subclassid: this.classcrfdata.subclassid
          });
        }
      });
    },
    // 根据会员健康方案id(memberprogramid)获取方案内容;
    ExamEvaluateHealthProgram_Get(){
      this.MK.Request('/Hcrm/ExamEvaluate/ExamEvaluateHealthProgram_Get','get',{
        memberprogramid:this.evaluateid
      })
      .then(res => {
        if(res.code == 0){
          this.programename = res.programname;//方案名称
          this.programcontent = res.programcontent; //方案内容
        }
      })
    },
    //时间范围更改事件
    dateRangeChange(val, memberid) {
      if (val == null) {
        this.form1.membertimebegin = "";
        this.form1.membertimeend = "";
        this.form.membertimebegin = "";
        this.form.membertimeend = "";
      } else {
        this.form1.membertimebegin = val[0];
        this.form1.membertimeend = val[1];
        this.form.membertimebegin = val[0];
        this.form.membertimeend = val[1];
      }

    },
    //
    // stateChange(val, memberid) {
    //   if (memberid == "") {
    //     this.$message({
    //       type: "error",
    //       message: "请先选择会员"
    //     });
    //     // this.form1.status = "-1";
    //     return;
    //   }
    //   this.PEQuestionnaire_Get(memberid);
    // },
  }
}
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
