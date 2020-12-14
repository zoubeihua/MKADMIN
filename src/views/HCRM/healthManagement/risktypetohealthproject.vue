<template>
  <d2-container>
    <!-- <template slot="header">
      <div style="width:100%;display: flex;justify-content: space-between;">
        <div></div>
        <el-form :inline="true">
          <el-form-item>
            <el-button icon="el-icon-circle-plus-outline" type="primary" @click="Add">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>-->
    <SplitPane :min-percent="20" :default-percent="30" split="vertical">
      <template slot="paneL">
        <el-container>
          <el-table
            :data="memberUserInfoList"
            :row-key="getRowKeys"
            ref="refTable"
            :expand-row-keys="expands"
            @expand-change="rowChange"
            @row-click="riskRowClick"
            stripe
            border
            height="100%"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-table
                  highlight-current-row
                  :data="risklevelList"
                  stripe
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
              </template>
            </el-table-column>
            <el-table-column label="风险分类名称" show-overflow-tooltip align="left" prop="riskname"></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="status" label="状态">
              <template slot="header" slot-scope="scope">
                <div style="padding:9px 0;line-height:1">状态</div>
              </template>
              <template slot-scope="scope">
                <el-tag
                  :type="GetOpenAndStoptatusType(scope.row.status)"
                  disable-transitions
                >{{ scope.row.statusdisplay }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-container>
      </template>
      <template slot="paneR">
        <el-container>
          <el-table :data="physicalCheckupList" stripe height="100%" border highlight-current-row>
            <el-table-column label="方案ID" width="80" show-overflow-tooltip prop="programid" />
            <el-table-column label="方案名称" show-overflow-tooltip align="center" prop="programname" />
            <el-table-column label="方案描述" show-overflow-tooltip align="center" prop="programnote"></el-table-column>
            <el-table-column label="适用性别" show-overflow-tooltip align="center" prop="limitsex">
              <template slot-scope="scope">
                <span
                  class="fa"
                  style="font-size:16px;margin-right:6px;"
                  :title="scope.row.limitsex == 1 ? '适用男性' : scope.row.limitsex == 2 ? '适用女性' : '男女通用'"
                  :class="[scope.row.limitsex == '1' ? 'fa-mars primary' : scope.row.limitsex == '2' ? 'fa-venus danger' : 'fa-genderless warning']"
                ></span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="限制年龄"
              show-overflow-tooltip
              align="center"
              prop="agerange"
              :formatter="checkAgerange"
            />-->
            <el-table-column align="center" show-overflow-tooltip prop="status" label="状态">
              <template slot-scope="scope">
                <el-tag
                  :type="GetOpenAndStoptatusType(scope.row.status)"
                  disable-transitions
                >{{ scope.row.statusdisplay }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" width="160" fixed="right">
              <template slot="header" slot-scope="scope">
                <el-button icon="el-icon-circle-plus-outline" size="small" type="primary" @click="Add">添加</el-button>
              </template>
              <template slot-scope="scope">
                <div class="tableBtn">
                  <el-link
                    title="编辑"
                    @click="Edit(scope.row)"
                    :underline="false"
                    type="primary"
                    icon="mkfont bianji1"
                  ></el-link>
                  <el-link
                    :title="scope.row.status != 1 ? '启用' : '停用'"
                    @click="Examine(scope.row,'/Hcrm/Healthprograminfo/healthprograminfo_StopAndOpen','停用','启用',PEPrograme_Get)"
                    :underline="false"
                    type="primary"
                    :icon="scope.row.status != 1 ? 'mkfont qiyong' : 'mkfont tingyong_line'"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                  ></el-link>
                  <el-link
                    title="上移"
                    @click="MoveUp(scope.$index,scope.row,physicalCheckupList,'programid','orderno',PEPrograme_Get,'/Hcrm/Healthprograminfo/healthprograminfo_UpAndDown')"
                    :underline="false"
                    type="primary"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                    icon="mkfont shangyi"
                  ></el-link>
                  <el-link
                    title="下移"
                    @click="MoveDow(scope.$index,scope.row,physicalCheckupList,'programid','orderno',PEPrograme_Get,'/Hcrm/Healthprograminfo/healthprograminfo_UpAndDown')"
                    :underline="false"
                    type="primary"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                    icon="mkfont xiayi"
                  ></el-link>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column
      align="right">
      <template slot="header" slot-scope="scope">
         <el-button icon="el-icon-circle-plus-outline" type="primary" @click="Add">添加</el-button>
      </template>

            </el-table-column>-->
          </el-table>
          <el-footer>
            <mk-page :pager="pagerphysicalCheckup" @query="PEPrograme_Get" />
          </el-footer>
        </el-container>
      </template>
    </SplitPane>
    <!-- 方案查看 -->
    <vxe-modal v-model="planCheckModal" :showFooter="true" title="方案查看" width="540" height="460">
      <div class="checkPlan">
        <div class="name">方案名称：</div>
        <div>{{AddForm.programname}}</div>
      </div>
      <div class="checkPlan">
        <div class="name">适用性别：</div>
        <div v-if="AddForm.limitsex!=0">{{AddForm.limitsex==1?'适用女性':'适用女性'}}</div>
        <div v-else>不限性别</div>
      </div>
      <!-- <div class="checkPlan">
        <div class="name">年龄限制：</div>
        <div>{{AddForm.agerange == "-1" ? "不限年龄" : AddForm.agerange}}</div>
      </div>-->
      <div class="checkPlan">
        <div class="name">方案描述：</div>
        <div>{{AddForm.programnote}}</div>
      </div>
      <div class="checkPlan">
        <div class="name">方案描述：</div>
        <div class="content">
          <div class="ql-editor" v-html="AddForm.programcontent"></div>
        </div>
      </div>
    </vxe-modal>
    <!-- 新增表单弹框 -->
    <vxe-modal v-model="AddModal" :showFooter="true" @close="colseModel" width="99%" height="95vh">
      <div slot="title" style="display:flex;align-items:center;">
        <span style="flex-basis: 140px;">健康体检方案维护</span>
        <span style="color:red;">[{{parentRow.riskname}} - {{subRow.levelname}}]</span>
      </div>
      <SplitPane :min-percent="20" :default-percent="30" split="vertical">
        <template slot="paneL">
          <el-form :model="AddForm" :rules="rules" ref="AddForm" label-width="auto" v-if="AddModal">
            <el-form-item label="方案名称" prop="programname">
              <el-input class="input" v-model="AddForm.programname" placeholder="请输入方案名称"></el-input>
            </el-form-item>
            <el-form-item label="方案描述" prop="programnote">
              <el-input
                type="textarea"
                resize="none"
                :rows="2"
                v-model="AddForm.programnote"
                placeholder="描述"
              ></el-input>
            </el-form-item>
            <el-form-item label="适用性别" prop="limitsex">
              <mk-select
                v-model="AddForm.limitsex"
                :isSlot="true"
                placeholder="请选择"
                :datas="getDicStandarDcode('适用性别')"
                :filter="['bzname']"
                label="bzname"
                val="bzcode"
              >
                <template v-slot:option="{item:item}">
                  <span
                    class="fa"
                    style="margin-right:6px;"
                    :class="[item.bzcode== '1' ? 'fa-mars primary' : item.bzcode == '2' ? 'fa-venus danger' : 'fa-genderless warning']"
                  ></span>
                  <span>{{item.bzname}}</span>
                </template>
              </mk-select>
            </el-form-item>
            <!-- <el-form-item label="年龄范围" prop="agerange">
          <range-input v-model="AddForm.agerange"></range-input>
            </el-form-item>-->
          </el-form>
        </template>
        <template slot="paneR">
          <el-container>
            <el-header>
              <quote-programme
                @push="pushProgramme"
                @replace="replaceProgramme"
                style="margin-right:10px;"
              >引用方案</quote-programme>
              <quote-knowledge-base
                type="success"
                v-model="AddForm.programcontent"
                style="width:126px;"
              >引用知识库</quote-knowledge-base>
            </el-header>
            <el-main style="padding:0;">
              <vue-editor
                v-model="AddForm.programcontent"
                style="height:calc(100% - 52px)"
                :editor-toolbar="customToolbar"
                class="fm-editor"
              ></vue-editor>
            </el-main>
          </el-container>
        </template>
      </SplitPane>

      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="primary" @click="submitAddForm">提交</el-button>
          <el-button type="warning" @click="colseModel">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
  </d2-container>
</template>
<script>
import { VueEditor } from "vue2-editor";
import RangeInput from "./components/rangeinput";
import QuoteProgramme from "./components/quoteprogramme";
import QuoteKnowledgeBase from "./components/quoteknowledgebase";
export default {
  name: "healthplan",
  components: {
    RangeInput,
    VueEditor,
    QuoteProgramme,
    QuoteKnowledgeBase
  },
  data() {
    return {
      submitType: 0, //提交类型 0新增 1编辑
      AddModal: false,
      planCheckModal: false,
      radio: null, //
      expands: [],
      parentRow: {},
      subRow: {},
      getRowKeys(row) {
        return row.riskid;
      },
      //富文本工具栏
      customToolbar: [
        [
          "bold",
          "italic",
          "underline",
          "strike",
          { color: [] },
          { background: [] },
          { align: [] },
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" }
        ],
        [{ font: [] }, { header: [1, 2, 3, 4, 5, 6, false] }],
        [{ script: "sub" }, { script: "super" }],
        ["link", "image", "blockquote", "code-block"],
        [{ direction: "rtl" }],
        ["clean"]
      ],
      pagermemberUserInfo: {
        condition: "",
        count: 0,
        page: 1,
        rows: 20,
        tag: 1 //tag:1 不分页,查询所有 0:分页 (默认:0)
      },
      pagerphysicalCheckup: {
        count: 0,
        page: 1,
        rows: 20,
        condition: ""
      },
      memberUserInfoList: [],
      AddForm: {
        programid: 0,
        agerange: "",
        levelid: 0,
        limitsex: "0",
        orderno: 0,
        programcontent: "",
        programname: "",
        programnote: "",
        risktypeid: 0,
        status: 0
      },
      rules: {
        programname: [
          { required: true, message: "请输入方案名称", trigger: "blur" }
        ],
        programnote: [
          { required: true, message: "请输入方案描述", trigger: "blur" }
        ],
        programcontent: [
          { required: true, message: "请输入方案详情", trigger: "blur" }
        ]
      },
      risklevelList: [],
      physicalCheckupList: []
    };
  },
  created() {
    this.refreshmemberUserInfo();
  },
  methods: {
    //追加方案
    pushProgramme(data) {
      console.log(JSON.parse(JSON.stringify(this.AddForm)));
      this.AddForm.programcontent += data.programcontent;
      this.AddForm.programname += data.programename;
    },
    //替换方案
    replaceProgramme(data) {
      this.AddForm.programcontent = data.programcontent;
      this.AddForm.programname = data.programename;
    },
    tableBtn() {
      this.flag = !this.flag;
    },
    riskRowClick(row) {
      this.$refs.refTable.toggleRowExpansion(row);
    },
    colseModel() {
      this.AddModal = false;
      this.submitType = 0;
      this.AddForm = {
        programid: 0,
        agerange: "",
        levelid: 0,
        limitsex: "0",
        orderno: 0,
        programcontent: "",
        programname: "",
        programnote: "",
        risktypeid: 0,
        status: 0
      };
    },
    //添加
    Add() {
      if (!this.subRow.levelid) {
        this.$message({
          type: "info",
          message: "请选择风险等级"
        });
        return;
      }
      this.submitType = 0;
      this.AddModal = true;
    },
    //新增体检方案方案(新增：programid,orderno,status不用传值)
    PEPrograme_Add() {
      this.AddForm.risktypeid = this.parentRow.riskid;
      this.AddForm.agerange =
        this.AddForm.agerange == "" ? "-1" : this.AddForm.agerange;
      this.AddForm.levelid = this.subRow.levelid;
      this.MK.Request(
        "/Hcrm/Healthprograminfo/healthprograminfo_Add",
        "post",
        this.AddForm
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.PEPrograme_Get();
          this.colseModel();
        }
      });
    },
    submitAddForm() {
      this.$refs.AddForm.validate(valid => {
        if (valid) {
          if (this.submitType == 0) {
            this.PEPrograme_Add();
          } else {
            this.PEPrograme_Edit();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //MyRegion 体检方案id(programid)获取对应的方案明细信息
    PEProgrameDetail_Get(programid) {
      return this.MK.Request(
        "/Hcrm/Healthprograminfo/healthprogramContent_Get",
        "get",
        programid
      );
    },
    //编辑
    async Edit(row) {
      this.submitType = 1;
      const programid = row.programid;
      let res = await this.PEProgrameDetail_Get({ programid });
      if (res.code == 0) {
        this.AddForm = { ...this.AddForm, ...res.data };
        this.AddForm.programcontent =
          this.AddForm.programcontent == null
            ? ""
            : this.AddForm.programcontent;
        this.AddModal = true;
      }
    },
    //编辑体检方案方案
    PEPrograme_Edit() {
      this.MK.Request(
        "/Hcrm/Healthprograminfo/healthprograminfo_Edit",
        "post",
        this.AddForm
      ).then(res => {
        if (res.code == 0) {
          this.PEPrograme_Get();
          this.colseModel();
        }
      });
    },
    //折叠事件
    async rowChange(row, expandedRows) {
      //	每次只展开一个扩展列表
      var that = this;
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          let res = await this.risklevel_Get(row.riskid);
          if (res.code == 0) {
            this.radio = null;
            this.parentRow = row;
            this.risklevelList = res.data.filter(item => item.status != 99);
            this.$nextTick(() => {
              this.expands.push(row.riskid);
            });
          }
        }
      } else {
        this.expands = [];
        this.parentRow = {};
        this.subRow = {};
      }
    },
    //根据风险类型id查询风险等级
    risklevel_Get(riskid) {
      return this.MK.Request("/Hcrm/Risktypeinfo/risklevel_Get", "get", {
        risktypeid: riskid,
        condition: "",
        tag: 1
      });
    },
    //查询风险类型信息
    refreshmemberUserInfo() {
      this.MK.Request(
        "/Hcrm/Risktypeinfo/risktypeinfo_Get",
        "get",
        this.pagermemberUserInfo
      ).then(res => {
        if (res.code == 0) {
          this.memberUserInfoList = res.data;
        }
      });
    },
    // 根据风险类型，风险等级获取对应的体检方案
    PEPrograme_Get() {
      if (!this.subRow.levelid) {
        this.$message({
          type: "info",
          message: "请选择风险等级"
        });
        return;
      }
      this.pagerphysicalCheckup.risktypeid = this.parentRow.riskid;
      this.pagerphysicalCheckup.levelid = this.subRow.levelid;
      this.MK.Request(
        "/Hcrm/Healthprograminfo/healthprogram_Get",
        "get",
        this.pagerphysicalCheckup
      ).then(res => {
        if (res.code == 0) {
          this.physicalCheckupList = res.data;
          this.pagerphysicalCheckup.count = res.count;
        }
      });
    },
    //等级行单击
    levelRowClick(row) {
      this.radio = row.levelid;
      this.subRow = row;
      this.PEPrograme_Get();
    }
  }
};
</script>
<style  scoped>
>>> .el-table__expanded-cell[class*="cell"] {
  padding: 0 !important;
}
</style>
