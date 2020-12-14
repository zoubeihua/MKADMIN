<template>
  <d2-container>
    <SplitPane :min-percent="20" :default-percent="30" split="vertical">
      <template slot="paneL">
        <el-container>
          <el-table
            border
            stripe
            :data="memberUserInfoList"
            :row-key="getRowKeys"
            ref="refTable"
            :expand-row-keys="expands"
            @expand-change="rowChange"
            @row-click="riskRowClick"
            height="100%"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-table
                  stripe
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
              </template>
            </el-table-column>
            <el-table-column
              label="风险分类名称"
              sortable
              show-overflow-tooltip
              align="left"
              prop="riskname"
            ></el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop="status" label="状态">
               <template slot="header" slot-scope="scope">
                <div style="padding:13px 0;line-height:1">状态</div>
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
          <el-table stripe :data="physicalCheckupList" border height="100%">
            <el-table-column
              label="方案ID"
              sortable
              width="120"
              show-overflow-tooltip
              prop="programeid"
            />
            <el-table-column
              label="方案名称"
              sortable
              show-overflow-tooltip
              align="center"
              prop="programename"
            />
            <el-table-column
              label="方案类型"
              sortable
              show-overflow-tooltip
              align="center"
              prop="programetypedisplay"
            >
              <template slot-scope="scope">
                <span
                  class="fa fa-circle"
                  style="margin-right:6px;"
                  :class="[scope.row.programetype == 0 ? 'info' : scope.row.programetype == 1 ? 'primary' : scope.row.programetype == 2 ? 'warning' : 'danger']"
                ></span>
                <span>{{scope.row.programetypedisplay}}</span>
              </template>
            </el-table-column>
            <el-table-column label="方案描述" show-overflow-tooltip align="center" prop="programenote"></el-table-column>
            <el-table-column
              label="适用性别"
              sortable
              width="120"
              show-overflow-tooltip
              align="center"
              prop="limitsex"
            >
              <template slot-scope="scope">
                <span
                  class="fa"
                  style="font-size:16px;margin-right:6px;"
                  :title="scope.row.limitsex == 1 ? '适用男性' : scope.row.limitsex == 2 ? '适用女性' : '男女通用'"
                  :class="[scope.row.limitsex == '1' ? 'fa-mars primary' : scope.row.limitsex == '2' ? 'fa-venus danger' : 'fa-genderless warning']"
                ></span>
              </template>
            </el-table-column>
             <el-table-column
              align="center"
              sortable
              width="100"
              show-overflow-tooltip
              prop="status"
              label="状态"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="GetOpenAndStoptatusType(scope.row.status)"
                  disable-transitions
                >{{ scope.row.statusdisplay }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot="header" slot-scope="scope">
                <el-button
                  icon="el-icon-circle-plus-outline"
                  size="medium"
                  type="primary"
                  @click="Add"
                >添加</el-button>
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
                    @click="Examine(scope.row,'/Hcrm/PEPrograme/PEPrograme_StopAndOpen','停用','启用',PEPrograme_Get)"
                    :underline="false"
                    type="primary"
                    :icon="scope.row.status != 1 ? 'mkfont qiyong' : 'mkfont tingyong_line'"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                  ></el-link>
                  <el-link
                    title="项目"
                    @click="project(scope.row)"
                    :underline="false"
                    type="danger"
                    icon="el-icon-folder"
                  ></el-link>
                  <el-link
                    title="上移"
                    @click="MoveUp(scope.$index,scope.row,physicalCheckupList,'programeid','orderno',PEPrograme_Get,'/Hcrm/PEPrograme/PEPrograme_UpAndDown')"
                    :underline="false"
                    type="primary"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                    icon="mkfont shangyi"
                  ></el-link>
                  <el-link
                    title="下移"
                    @click="MoveDow(scope.$index,scope.row,physicalCheckupList,'programeid','orderno',PEPrograme_Get,'/Hcrm/PEPrograme/PEPrograme_UpAndDown')"
                    :underline="false"
                    type="primary"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                    icon="mkfont xiayi"
                  ></el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-footer>
            <mk-page :pager="pagerphysicalCheckup" @query="PEPrograme_Get" />
          </el-footer>
        </el-container>
      </template>
    </SplitPane>
     <!-- liqian-高度auto -->
    <vxe-modal v-model="AddModal" :showFooter="true" @close="colseModel" width="540" height="auto">
      <div slot="title" style="display:flex;align-items:center;">
        <span style="flex-basis: 140px;">健康体检方案维护</span>
        <span style="color:red;">[{{parentRow.riskname}} - {{subRow.levelname}}]</span>
      </div>
      <el-form :model="AddForm" :rules="rules" ref="AddForm" label-width="auto" v-if="AddModal">
        <el-form-item label="方案名称" prop="programename">
          <el-input class="input" v-model="AddForm.programename" placeholder="请输入方案名称"></el-input>
        </el-form-item>
        <el-form-item label="预估金额" prop="programefree">
          <currency-input v-model="AddForm.programefree" placeholder="请输入预估金额"></currency-input>
        </el-form-item>
        <el-form-item label="方案描述" prop="programenote">
          <el-input
            type="textarea"
            resize="none"
            :rows="2"
            v-model="AddForm.programenote"
            placeholder="描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="方案类型" prop="programetype">
          <mk-select
            v-model="AddForm.programetype"
            :isSlot="true"
            placeholder="请选择"
            :datas="getDicStandarDcode('健康方案')"
            :filter="['bzname']"
            label="bzname"
            val="bzcode"
          >
            <template v-slot:option="{item:item}">
              <span
                class="fa fa-circle"
                style="margin-right:6px;"
                :class="[item.bzcode == 0 ? 'info' : item.bzcode == 1 ? 'primary' : item.bzcode == 2 ? 'warning' : 'danger']"
              ></span>
              <span>{{item.bzname}}</span>
            </template>
          </mk-select>
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
        <!-- <el-form-item label="内容" prop="programcontent">
          <vue-editor
            v-model="AddForm.programcontent"
            style
            :editor-toolbar="customToolbar"
            class="fm-editor"
          ></vue-editor>
        </el-form-item>-->
      </el-form>
      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="primary" @click="submitAddForm">提交</el-button>
          <el-button type="warning" @click="colseModel">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
    <project-cognate ref="project"></project-cognate>
  </d2-container>
</template>
<script>
import { VueEditor } from "vue2-editor";
import RangeInput from "./components/rangeinput";
import CurrencyInput from "./components/currencyinput";
import ProjectCognate from "./components/projectcognate";
export default {
  name: "physicalsplan",
  components: {
    RangeInput,
    VueEditor,
    CurrencyInput,
    ProjectCognate
  },
  data() {
    return {
      submitType: 0, //提交类型 0新增 1编辑
      AddModal: false,
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
        programeid: 0,
        agerange: "",
        createid: 0,
        levelid: 0,
        limitsex: "0",
        orderno: 0,
        programcontent: "-1",
        programefree: 0,
        programename: "",
        programenote: "",
        programetype: "",
        risktypeid: 0,
        status: 0
      },
      rules: {
        programetype: [
          { required: true, message: "请选择方案类型", trigger: "change" }
        ],
        programename: [
          { required: true, message: "请输入方案名称", trigger: "blur" }
        ],
        programcontent: [
          { required: true, message: "请输入方案内容", trigger: "blur" }
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
        programeid: 0,
        agerange: "",
        createid: this.info.userid,
        levelid: 0,
        limitsex: "0",
        orderno: 0,
        programcontent: "-1",
        programefree: 0,
        programename: "",
        programenote: "",
        programetype: "",
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
    //新增体检方案方案(新增：programeid,orderno,status不用传值)
    PEPrograme_Add() {
      this.AddForm.risktypeid = this.parentRow.riskid;
      this.AddForm.agerange =
        this.AddForm.agerange == "" ? "-1" : this.AddForm.agerange;
      this.AddForm.levelid = this.subRow.levelid;
      this.AddForm.createid = this.info.userid;
      this.MK.Request(
        "/Hcrm/PEPrograme/PEPrograme_Add",
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
    //MyRegion 体检方案id(programeid)获取对应的方案明细信息
    PEProgrameDetail_Get(programeid) {
      return this.MK.Request(
        "/Hcrm/PEPrograme/PEProgrameDetail_Get",
        "get",
        programeid
      );
    },
    //编辑
    async Edit(row) {
      this.submitType = 1;
      const programeid = row.programeid;
      let res = await this.PEProgrameDetail_Get({ programeid });
      if (res.code == 0) {
        const programcontent = res.programcontent;
        this.AddForm = { ...this.AddForm, ...res.data };
        this.AddModal = true;
      }
    },
    //编辑体检方案方案
    PEPrograme_Edit() {
      this.AddForm.programcontent = "-1";
      this.MK.Request(
        "/Hcrm/PEPrograme/PEPrograme_Edit",
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
    //项目
    project(row) {
      this.$refs.project.open(row);
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
            this.risklevelList = res.data;
            this.physicalCheckupList = [];
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
        "/Hcrm/PEPrograme/PEPrograme_Get",
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
