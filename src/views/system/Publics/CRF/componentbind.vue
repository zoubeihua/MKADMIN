<template>
  <d2-container>
    <template slot="header">
      <el-header height="120px">
        <!-- <el-form :inline="true" class="demo-form-inline"> -->
        <el-form :inline="true">
          <el-form-item label prop="resource" style="left:30px">
            <el-radio-group v-model="pager.typeTag" @change="refreshList()">
              <el-radio :label="0" :value="0">选项类型</el-radio>
              <el-radio :label="1" :value="1">评分类型</el-radio>
              <el-radio :label="2" :value="2">测值类型</el-radio>
              <el-radio :label="-1" :value="-1">全部</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="left:150px">
            <el-form-item label>
              <el-input
                clearable
                style="width:300px"
                v-model="pager.condition"
                placeholder="请输入数据源名称"
                @keyup.enter.native="refreshList"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-s-search"
                @click="refreshList"
                >查询</el-button
              >
            </el-form-item>
          </el-form-item>
        </el-form>
      </el-header>
    </template>
    <template>
      <el-table
        border
        :data="tableData"
        style="width: 100%;"
        height="100%"
        highlight-current-row
        @sort-change="changeTableSort"
      >
        <!--  @row-click="tableRowClick" -->
        <el-table-column prop label width="180" v-if="false"></el-table-column>
        <el-table-column
          v-if="false"
          prop="sourceid"
          label="数据源ID"
          :show-overflow-tooltip="true"
          width="300"
          align="center"
          sortable
        >
          <!-- <template scope="scope">{{scope.row.ORGIDNO}}{{scope.row.TESTNO}}</template> -->
        </el-table-column>
        <el-table-column
          prop="sourcekey"
          label="数据源名称"
          min-width="400"
          :show-overflow-tooltip="true"
          sortable
        ></el-table-column>
        <!-- <el-table-column prop="sourcevalue" label="数据源值" :show-overflow-tooltip="true"></el-table-column>-->
        <el-table-column
          prop="sourcevalue"
          v-if="false"
          label="数据源值"
          width="150"
          :show-overflow-tooltip="true"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          prop="scoretypeDispaly"
          label="是否评分"
          width="200"
          :show-overflow-tooltip="true"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          prop="measuretypeDispaly"
          label="测值类型"
          width="200"
          :show-overflow-tooltip="true"
          align="center"
          sortable
        ></el-table-column>

        <el-table-column
          prop="statusDispaly"
          label="状态"
          sortable
          :show-overflow-tooltip="true"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="GetLockstatusType(scope.row.status)"
              disable-transitions
            >
              {{ scope.row.statusDispaly }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="创建人"
          :show-overflow-tooltip="true"
          width="200"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          prop="createtime"
          label="创建时间"
          sortable
          :show-overflow-tooltip="true"
          align="center"
          width="160"
        ></el-table-column>
        <el-table-column width="200" align="center" fixed="right">
          <template slot="header">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addEvent"
              size="mini"
              plain
              >新建</el-button
            >
          </template>
          <template slot-scope="scope">
            <div class="tableBtn">
              <el-link
                :title="scope.row.status != 1 ? '启用' : '停用'"
                @click="checkEvent(scope.row)"
                :underline="false"
                :type="scope.row.status != 1 ? 'primary' : 'danger'"
                :icon="
                  scope.row.status != 1
                    ? 'mkfont qiyong'
                    : 'mkfont tingyong_line'
                "
              ></el-link>
              <!-- :disabled="scope.row.status !== 1" -->
              <el-link
                type="success"
                icon="el-icon-edit"
                @click="editEvent(scope.row)"
                title="修改"
              ></el-link>
              <el-link
                type="primary"
                icon="mkfont chakan"
                @click="search(scope.row)"
                title="查看"
              ></el-link>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
              prop="statusDISPLAY"
              label="状态"
              width="150"
              :show-overflow-tooltip="true"
              align="center"
            >
              <template scope="scope">
                <el-tag :type="GetTestsperType(scope.row.statusDISPLAY)" disable-transitions>
                  {{
                  scope.row.statusDISPLAY
                  }}
                </el-tag>
              </template>
        </el-table-column>-->
      </el-table>
    </template>
    <template slot="footer">
      <mk-page :pager="pager" @query="refreshList" />
    </template>
    <vxe-modal
      v-model="modal"
      title="绑定数据源维护"
      width="1000"
      height="640"
      ref="xModal"
      :showFooter="true"
      @zoom="resizeChange"
      min-width="400"
      min-height="400"
      resize
    >
      <table
        class="qtable"
        border="1"
        cellspacing="0"
        width="100%"
        height="100%"
        style="border: 1px solid #eee;border-collapse: collapse;"
      >
        <tr>
          <td style="text-align: center;width:120px;height:40px">
            <span style="color:red;">*</span> 绑定类型
          </td>
          <td colspan="2">
            <el-radio-group v-model="form1.typeTag" @change="tagChange">
              <el-radio :label="0" :value="0">选项类型</el-radio>
              <el-radio :label="1" :value="1">评分类型</el-radio>
              <el-radio :label="2" :value="2">测值类型</el-radio>
            </el-radio-group>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;width:120px;height:40px">
            <span style="color:red;">*</span> 数据名称
          </td>
          <td colspan="2">
            <div class="input-radius">
              <el-input
                clearable
                type="text"
                v-model="form1.sourcekey"
                style="width:100%; height:100%; border-radius: initial"
              />
            </div>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;width:120px;height:40px">
            <span style="color:red;">*</span> 输入码
          </td>
          <td colspan="2">
            <div class="input-radius">
              <el-input
                clearable
                type="text"
                v-model="form1.filterstr"
                style="width:100%;height:100%"
              />
            </div>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">
            <span style="color:red;">*</span> 数据原值
          </td>
          <td rowspan="2">
            <code-editor
              height="100%"
              width="100%"
              mode="sql"
              :key="key"
              v-model="form1.sourcevalue"
              v-if="modal"
            ></code-editor>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">
            <el-button
              type="danger"
              icon="el-icon-odometer"
              size="mini"
              round
              @click="handleSQLTest"
              >测试语句</el-button
            >
          </td>
        </tr>
        <tr>
          <td style="text-align: center;width:120px;height:40px">备注</td>
          <td colspan="2">
            <div class="input-radius">
              <el-input
                clearable
                type="text"
                v-model="form1.note"
                style="width:100%;height:100%"
              />
            </div>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;height:140px">维护说明</td>
          <td colspan="2" style="font-size:14px">
            <div v-html="sqlData.str"></div>
          </td>
        </tr>
      </table>

      <div slot="footer">
        <el-button type="success" @click="SaveModal">确认</el-button>
        <el-button type="danger" @click="CloseModal">取消</el-button>
      </div>
    </vxe-modal>
    <vxe-modal
      v-model="searchModal"
      title="绑定数据源维护"
      width="1000"
      height="640"
      ref="xModal"
      @zoom="resizeChange"
      min-width="400"
      min-height="400"
      resize
    >
      <table
        class="qtable"
        border="1"
        cellspacing="0"
        width="100%"
        height="100%"
        style="border: 1px solid #eee;border-collapse: collapse;"
      >
        <tr>
          <td style="text-align: center;width:120px;height:40px">绑定类型</td>
          <td colspan="2">
            <el-radio-group v-model="form1.typeTag" @change="tagChange">
              <el-radio :disabled="true" :label="0" :value="0"
                >选项类型</el-radio
              >
              <el-radio :disabled="true" :label="1" :value="1"
                >评分类型</el-radio
              >
              <el-radio :disabled="true" :label="2" :value="2"
                >测值类型</el-radio
              >
            </el-radio-group>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;width:120px;height:40px">数据名称</td>
          <td colspan="2">
            <div class="input-radius">
              <el-input
                clearable
                type="text"
                :readonly="true"
                v-model="form1.sourcekey"
                style="width:100%;height:100%"
              />
            </div>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;width:120px;height:40px">输入码</td>
          <td colspan="2">
            <div class="input-radius">
              <el-input
                clearable
                type="text"
                :readonly="true"
                v-model="form1.filterstr"
                style="width:100%;height:100%"
              />
            </div>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">数据原值</td>
          <td rowspan="2">
            <code-editor
              height="100%"
              width="100%"
              mode="sql"
              :key="key"
              v-model="form1.sourcevalue"
              v-if="searchModal"
            ></code-editor>
          </td>
        </tr>
        <tr>
          <td style=" text-align: center;">
            <el-button
              :disabled="true"
              type="danger"
              icon="el-icon-odometer"
              size="mini"
              round
              @click="handleSQLTest"
              >测试语句</el-button
            >
          </td>
        </tr>
        <tr>
          <td style="text-align: center;width:120px;height:40px">备注</td>
          <td colspan="2">
            <div class="input-radius">
              <el-input
                clearable
                type="text"
                :readonly="true"
                v-model="form1.note"
                style="width:100%;height:100%"
              />
            </div>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;height:140px">维护说明</td>
          <td colspan="2" style="font-size:14px">
            <div v-html="sqlData.str"></div>
          </td>
        </tr>
      </table>
    </vxe-modal>
  </d2-container>
</template>
<script>
import CodeEditor from "@c/mkmakingform/components/CodeEditor/index";
import util from "@/libs/util.js";
import { mapState, mapActions } from "vuex";
import sqlFormatter from "sql-formatter";
import * as MKPublic from "@/libs/utilMkPublic.js";
export default {
  computed: {
    ...mapState("d2admin/user", ["info"])
  },
  name: "system-admin-userInfoMaintenance_testper",
  components: { CodeEditor },
  data() {
    return {
      comPonentBindstatusArr: [], //状态过滤数组
      ruleForm: {
        resource: ""
      },
      //微服务架构认证
      Auth: {
        TESTPER: {
          app: "63b1657f3b0747d993d1b8a1a8fed742",
          mod: "crfssy"
        },
        Participantsper: {
          app: "82f4ba2f6e5c495bbc46c8dab377706d",
          mod: "yjryxx"
        },
        xxwh: {
          //机构管理
          app: "82f4ba2f6e5c495bbc46c8dab377706d",
          mod: "xmwh"
        },
        inspect: {
          app: "63b1657f3b0747d993d1b8a1a8fed742",
          mod: "zyglwh"
        }
      },
      key: new Date().getTime(),
      //对话框的
      modal: false,
      searchModal: false,
      typeTag: "1", // 1 新建 2 编辑
      disabled_Lognuid: false,
      bntSaveAndCreate: true,
      //按钮的
      btn: {
        btnEdit: true,
        btnCheck: true,
        btnRefuse: true
      },
      //分页
      pager: {
        count: 0,
        page: 1,
        rows: 20,
        condition: "",
        typeTag: -1
      },
      //
      form: {
        CURRENTLOGINUID: "", //当前登录人员ID
        RESEARCHID: "",
        RESEARCHNAME: "",
        TESTNO: "",
        TESTID: "",
        TESTNAME: "",
        NAMEPY: "",
        filterstr: "",
        DOCTOR: "",
        MOBILETEL: "",
        LANDLINE: "",
        EMAIL: "",
        LOCKstatus: "",
        LOCKstatusDISPLAY: "",
        status: "",
        statusDISPLAY: "",
        IDENTIFY: "",
        ORGID: "",
        LOGINUID: ""
      },
      form1: {
        sourcekey: "",
        filterstr: "",
        sourcevalue: "",
        createid: "",
        typeTag: "",
        note: "",
        tag: ""
      },
      //sql和维护说明
      sqlData: {},
      //table数据
      tableData: [],
      //form效验规则
      formRule: {
        TESTNAME: [
          { required: true, message: "请输入受试姓名", trigger: "blur" }
        ],
        LOGINUID: [
          { required: true, message: "请输入登录账户", trigger: "blur" }
        ],
        TESTNO: [
          { required: true, message: "请输入受试编号", trigger: "blur" }
        ],
        NAMEPY: [
          { required: true, message: "请输入姓名首拼", trigger: "blur" }
        ],
        DOCTOR: [
          { required: true, message: "请选择责任医生", trigger: "blur" }
        ],
        MOBILETEL: [
          {
            pattern: /^1[34578]{1}\d{9}$/,
            message: "请输入正确的移动电话",
            trigger: ["blur", "change"]
          }
        ],
        LANDLINE: [
          {
            pattern: /\d{3}-\d{8}|\d{4}-\d{7}/,
            message:
              "电话号码不正确,请输入形如 区号+电话号码的数字，如0901-2100222或010-11111111",
            trigger: ["blur", "change"]
          }
        ],
        EMAIL: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      },
      Maintenance0: `<ul>
        <li>1.数据值的维护一定是可以在当前数据库下能执行的语句。</li>
        <li>
          <div>
            2.语句说明如下：
          </div>
          <div>
            '1'   as  "value"      表示数据源的 value ；
          </div>
          <div>
            '正常'  as  <strong>"KEY"</strong>      表示数据源的 key ；
          </div>
          <div>
            'ZC'   as  <strong>"filterstr"</strong>     是为了下拉选择的时候方便查找定位 ；
          </div>
          <div>
            '-'  as  "评分"      表示该选项为评分类型下对应的分值，“-” 表示该选项不是评分类型
          </div>
        </li>
        <li>
          3.FROM DUAL 存在者数据库类型之间的替换，必要严格按这样些 之间不要多加空格
        </li>
      </ul>`,
      Maintenance1: `<ul>
        <li>1.数据值的维护一定是可以在当前数据库下能执行的语句。</li>
        <li>
          <div>
            2.语句说明如下：
          </div>
          <div>
            '1'   as  "value"      表示数据源的 value ；
          </div>
          <div>
            '依赖'  as  <strong>"KEY"</strong>      表示数据源的 key ；
          </div>
          <div>
            'YL'   as  <strong>"filterstr"</strong>    是为了下拉选择的时候方便查找定位 ；
          </div>
          <div>
            '0'  as  "SCORE"      表示该选项为评分类型下对应的分值，“-” 表示该选项不是评分类型
          </div>
        </li>
        <li>
          3.FROM DUAL 存在者数据库类型之间的替换，必要严格按这样些 之间不要多加空格
        </li>
      </ul>`,
      Maintenance2: `<ul>
        <li>1.数据值的维护一定是可以在当前数据库下能执行的语句。</li>
        <li>
          <div>
            2.语句说明如下：
          </div>
          <div>
            '1'   as  "value"      表示数据源的 value ；
          </div>
          <div>
            '依赖'  as  <strong>"KEY"</strong>      表示数据源的 key ；
          </div>
          <div>
            'YL'   as  <strong>"filterstr"</strong>    是为了下拉选择的时候方便查找定位 ；
          </div>
          <div>
            '0'  as  beginval 表示测值的输入范围的起始值
          </div>
          <div>
            '1000' as endval  表示测值的输入范围的截至值
          </div>
        </li>
        <li>
          3.FROM DUAL 存在者数据库类型之间的替换，必要严格按这样些 之间不要多加空格
        </li>
      </ul>`,
      sqlStr: {
        0: {
          sql:
            "select  '0'  as  VALUE,  '未查'  as  KEY,  'WC'  as  filterstr,  '-'  as  SCORE  FROM DUAL union  all select  '1'  as  VALUE,  '正常'  as  KEY,  'ZC'  as  filterstr,  '-'  as  SCORE  FROM DUAL union  all select  '2'  as  VALUE,  '异常'  as  KEY,  'YC'  as  filterstr,  '-'  as  SCORE  FROM DUAL",
          str: ""
        },
        1: {
          sql:
            "select  '1'  as  VALUE,  '依赖'  as  KEY,  'YL'  as  filterstr,  '0'  as  SCORE  FROM DUAL union  all select  '2'  as  VALUE,  '自理'  as  KEY,  'ZL'  as  filterstr,  '5'  as  SCORE  FROM DUAL",
          str: ""
        },
        2: {
          sql:
            "select  '106/mm3'  as  VALUE,  '106/mm3'  as  KEY,  '106/mm3'  as  filterstr,  '0'  as  beginval,    '1000' as endval  FROM DUAL union  all select  '1012/L'  as  VALUE,  '1012/L'  as  KEY,  '1012/L'  as  filterstr,  '0'  as  beginval,    '1000' as endval  FROM DUAL",
          str: ""
        }
      }
    };
  },
  created() {
    this.form.createid = util.cookies.get("uuid");
    this.form1.createid = util.cookies.get("uuid");
    this.form.CURRENTLOGINUID = util.cookies.get("uuid");
    this.form.RESEARCHID = this.info.RESEARCHID;
    //  MKPublic.Getstatus("停启用").then(res => {
    //    this.comPonentBindstatusArr = res;
    //  });
  },
  mounted() {
    this.refreshList();
    // this.initSqlData();
  },
  watch: {
    //根据机构名称获取输入码
    "form1.sourcekey": function(val) {
      // if (this.typeTag == "1") {
      this.form1.filterstr = util.py.firstChar(val).substr(0, 8);
      // }
    }
  },
  methods: {
    //过滤列头回调
    filterItemstatus(value, row) {
      return row.statusDispaly === value;
    },
    GetLockstatusType(status) {
      return this.GetOpenAndStoptatusType(status);
    },
    //测试语句
    handleSQLTest() {
      this.InspectSqlTest();
    },
    InspectSqlTest() {
      const url = "/Publics/CRFSource/CRFSourceSqlTest";
      this.MK.Request(
        url,
        "post",
        { sourcevalue: this.form1.sourcevalue },
        this.Auth.inspect
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg,
            duration: 1000
          });
        }
      });
    },
    //弹窗大小变化
    resizeChange({ type }, event) {
      this.key = new Date().getTime();
    },
    //初始化数据源之和维护说明
    initSqlData() {
      this.sqlData = this.sqlStr["0"];
      this.sqlData.str = this.Maintenance0;
      this.$nextTick(() => {
        this.key = new Date().getTime();
        var formatSql = sqlFormatter.format(this.sqlData.sql, {
          language: "sql",
          indent: ""
        });
        this.form1.sourcevalue = formatSql;
      });
    },
    //绑定类型更改事件
    tagChange(val) {
      if (this.typeTag == "1") {
        this.sqlData = this.sqlStr[val];
      }
      if (val == 0) {
        this.sqlData.str = this.Maintenance0;
      } else if (val == 1) {
        this.sqlData.str = this.Maintenance1;
      } else {
        this.sqlData.str = this.Maintenance2;
      }
      this.key = new Date().getTime();
      var formatSql = sqlFormatter.format(this.sqlData.sql, {
        language: "sql",
        indent: ""
      });
      this.form1.sourcevalue = formatSql;
    },
    SaveModal() {
      this.saveClose(this.typeTag);
    },
    CloseModal() {
      this.modal = false;
    },
    //新建数据源
    CRFSource_Add() {
      this.form1.tag = this.form1.typeTag;
      this.MK.Request(
        "/Publics/CRFSource/CRFSource_Post",
        "post",
        this.form1,
        this.Auth.TESTPER
      ).then(res => {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.refreshList();
        this.initForm1();
        this.CloseModal();
      });
    },
    //初始化form1表单
    initForm1: function() {
      this.form1 = {
        sourcekey: "",
        filterstr: "",
        sourcevalue: "",
        createid: util.cookies.get("uuid"),
        typeTag: "",
        note: "",
        tag: ""
      };
    },

    //初始化form表单
    initForm: function() {
      this.form.LOGINUID = "";
      this.form.RESEARCHID = this.info.RESEARCHID;
      this.form.TESTNO = "";
      this.form.TESTID = "";
      this.form.TESTNAME = "";
      this.form.NAMEPY = "";
      this.form.filterstr = "";
      this.form.DOCTOR = util.cookies.get("uuid"); //负责医生默认当前登录人;
      this.form.MOBILETEL = "";
      this.form.LANDLINE = "";
      this.form.EMAIL = "";
      this.form.LOCKstatus = "";
      this.form.LOCKstatusDISPLAY = "";
      this.form.status = "";
      this.form.statusDISPLAY = "";
      this.form.IDENTIFY = this.info.Identity;
      this.form.ORGID = this.info.LOGINORGID; //当前登录人员所属机构ID
      this.form.CURRENTLOGINUID = util.cookies.get("uuid");
      this.form.RESEARCHNAME = this.info.RESEARCHNAME;
      this.disabled_Lognuid = false;
      this.bntSaveAndCreate = true;
    },
    //新建按钮点击事件
    addEvent: function() {
      this.modal = true;
      this.typeTag = "1";
      this.disabled_Lognuid = false;
      this.bntSaveAndCreate = true;
      this.initForm1();
    },
    //编辑事件
    editEvent: function(row) {
      this.tableRowClick(row);
      this.modal = true;
      this.typeTag = "2";
      //    SCORETYPE='0';
      //    MEASURETYPE='0';  选项
      // SCORETYPE='1';
      //    MEASURETYPE='0'; 评分
      //  SCORETYPE='0';
      //    MEASURETYPE='1'; 测量
      let type;
      if (this.form1.SCORETYPE == "0" && this.form1.MEASURETYPE == "0") {
        type = 0; //选项
      }
      if (this.form1.SCORETYPE == "1" && this.form1.MEASURETYPE == "0") {
        type = 1; //评分
      }
      if (this.form1.SCORETYPE == "0" && this.form1.MEASURETYPE == "1") {
        type = 2; //测量
      }
      this.form1.typeTag = row.typeTag;
      this.tagChange(row.typeTag);
    },

    //typeTag="1" 新建 typeTag="2" 编辑;
    saveClose: function(typeTag) {
      //  sourcekey: "",
      //   filterstr: "",
      //   sourcevalue: "",
      //   createid: "",
      //   typeTag: "",
      //   note: ""
      if (this.form1.sourcekey == "") {
        this.$message({
          type: "error",
          message: "请填写数据源名称"
        });
        return;
      }
      if (this.form1.filterstr == "") {
        this.$message({
          type: "error",
          message: "请填写输入码"
        });
        return;
      }
      if (this.form1.sourcevalue == "") {
        this.$message({
          type: "error",
          message: "请填写数据源值"
        });
        return;
      }
      let url = "/Publics/CRFSource/CRFSource_Post";
      if (this.typeTag == "1") {
        //   url = "CRFSource_Add";
        this.form1.operatetype = "C";
      } else {
        //   url = "CRFSource_Edit";
        this.form1.operatetype = "U";
      }
      this.form1.tag = this.form1.typeTag;
      this.MK.Request(url, "post", this.form1, this.Auth.TESTPER).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
        }
        this.refreshList();
        this.initForm1();
        this.CloseModal();
      });
    },
    //关闭按钮
    closeModal: function() {
      this.modal = false;
      this.refreshList();
    },
    //表格排序
    changeTableSort(column) {
      this.pager.orderby =
        column.prop + " " + column.order.replace(/ending/g, "");
      this.refreshList();
    },
    //页面刷新
    refreshList: function() {
      this.MK.Request(
        "/Publics/CRFSource/CRFSourceList_Get",
        "get",
        this.pager,
        this.Auth.TESTPER
      ).then(res => {
        this.pager.count = res.count;
        this.tableData = res.data;
        this.btn.btnEdit = true;
        this.btn.btnCheck = true;
        this.btn.btnRefuse = true;
      });
    },
    //行点击事件
    tableRowClick: function(row) {
      this.btn.btnEdit = false;
      this.form1 = { ...this.form1, ...row };
      this.sqlData.sql = row.sourcevalue;
      var formatSql = sqlFormatter.format(this.sqlData.sql, {
        language: "sql",
        indent: ""
      });
      this.form1.sourcevalue = formatSql;
    },
    //启用 停止按钮点击事件
    checkEvent: function(row) {
      let status = row.status == 1 ? 0 : 1;
      //status:0:停用;1启用;
      //入参{sourcekey:数据源ID,status:0:停用;1启用;}
      let sourceid = row.sourceid;
      this.CRFSource_OpenAndStop({ sourceid, status });
    },
    CRFSource_OpenAndStop({ sourceid, status }) {
      this.MK.Request(
        "/Publics/CRFSource/CRFSource_OpenAndStop",
        "post",
        { sourceid, status },
        this.Auth.TESTPER
      ).then(res => {
        this.refreshList();
      });
    },

    //根据sourceid查看原件数据源
    search(row) {
      this.tableRowClick(row);
      this.searchModal = true;
      const { sourceid } = this.form1;
      this.CRFSourceBysourceid_Get({ sourceid });
      let type;
      if (this.form1.SCORETYPE == "0" && this.form1.MEASURETYPE == "0") {
        type = "0"; //选项
      }
      if (this.form1.SCORETYPE == "1" && this.form1.MEASURETYPE == "0") {
        type = "1"; //评分
      }
      if (this.form1.SCORETYPE == "0" && this.form1.MEASURETYPE == "1") {
        type = "2"; //测量
      }
      //this.form1.typeTag = type;
    },
    CRFSourceBysourceid_Get({ sourceid }) {
      this.MK.Request(
        "/Publics/CRFSource/CRFSourceOptions_Get",
        "get",
        { sourceid },
        this.Auth.TESTPER
      ).then(res => {});
    },
    //双击事件
    dblclick: function() {
      this.pager.condition = "";
    },
    
  }
};
</script>
<style scoped>
.input-radius >>> .el-input__inner {
  border-radius: 0px;
}
.qtable th {
  background: #f8f8f8;
}
* {
  list-style: none !important;
}
</style>
