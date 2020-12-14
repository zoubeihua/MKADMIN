<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true">
        <el-form-item label="大类">
          <mk-select
            v-model="classData.classid"
            label="classname"
            val="classid"
            :filter="['classname']"
            @change="classidChange"
            :datas="classList"
          />
        </el-form-item>
        <el-form-item label="小类">
          <mk-select
            :key="key"
            v-model="classData.subclassid"
            label="subclassname"
            val="subclassid"
            :filter="['subclassname']"
            @change="subclassChange"
            :datas="subClassList"
          />
        </el-form-item>
      </el-form>
      <div class="headerR">
        <el-button-group>
          <el-button
            icon="el-icon-search"
            type="primary"
            :disabled="!subRow.levelid"
            @click="seeSql"
          >查看SQL</el-button>
          <el-button icon="el-icon-circle-plus-outline" type="primary" @click="tableRowAdd">添加条件</el-button>
          <el-button
            icon="el-icon-s-opportunity"
            type="primary"
            :disabled="conditionList.length == 0"
            @click="generateSQL"
          >生成SQL</el-button>
        </el-button-group>
      </div>
    </template>
    <SplitPane :min-percent="20" :default-percent="30" split="vertical">
      <template slot="paneL">
        <el-table
          stripe
          :data="riskCateList"
          border
          :expand-row-keys="expands"
          :row-key="getRowKeys"
          ref="refTable"
          @expand-change="rowChange"
          highlight-current-row
          @row-click="riskRowClick"
          height="100%"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-table
                stripe
                :data="riskTypeList"
                @row-click="riskTypeRowClick"
                highlight-current-row
                height="100%"
                :show-header="false"
              >
                <el-table-column label="风险分类等级" show-overflow-tooltip align="left" prop="levelname">
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
                <el-table-column label="风险分类描述" show-overflow-tooltip align="left" prop="levelnote">
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
        </el-table>
      </template>
      <template slot="paneR">
        <el-container>
          <el-form :model="model" ref="form" size="mini" style="height:100%;margin-top:0;">
            <el-table  :data="model.conditionList" highlight-current-row border stripe height="100%">
              <el-table-column
                label="表单名称"
                sortable
                show-overflow-tooltip
                align="center"
                class-name="tableForm"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'conditionList.' + scope.$index + '.crfid'"
                    :rules="{ required: true, message: '表单名称不能为空', trigger: 'change'}"
                  >
                    <mk-select
                      size="mini"
                      v-model="scope.row.crfid"
                      :key="scope.row.key"
                      :filter="['crfname']"
                      label="crfname"
                      val="crfid"
                      @change="crfChange($event,conditionList,scope.$index)"
                      :datas="CRFList"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="项目名称"
                sortable
                show-overflow-tooltip
                align="center"
                class-name="tableForm"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'conditionList.' + scope.$index + '.fieldid'"
                    :rules="{ required: true, message: '项目名称不能为空', trigger: 'change'}"
                  >
                    <mk-select
                      size="mini"
                      v-model="scope.row.fieldid"
                      :key="scope.row.key"
                      :filter="['fieldname']"
                      label="fieldname"
                      val="fieldid"
                      @change="filedChange($event,conditionList,scope.$index)"
                      :datas="scope.row.filedlist"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="运算符"
                show-overflow-tooltip
                align="center"
                class-name="tableForm"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'conditionList.' + scope.$index + '.filedoperator'"
                    :rules="{ required: true, message: '运算符不能为空', trigger: 'change'}"
                  >
                    <mk-select
                      size="mini"
                      v-model="scope.row.filedoperator"
                      :key="scope.row.key"
                      :filter="['bzname']"
                      label="bzname"
                      val="bzcode"
                      :datas="getDicStandarDcode('运算符')"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="运算值"
                width="180"
                show-overflow-tooltip
                align="center"
                class-name="tableForm"
              >
                <!-- controltype radio checkbox time date select -->
                <template slot-scope="scope">
                  <template
                    v-if="scope.row.controltype == 'radio' || scope.row.controltype == 'select'"
                  >
                    <el-form-item
                      :prop="'conditionList.' + scope.$index + '.filedvalue'"
                      :rules="{ required: true, message: '运算值不能为空', trigger: 'change'}"
                    >
                      <mk-select
                        size="mini"
                        v-model="scope.row.filedvalue"
                        :key="scope.row.key"
                        :filter="['label']"
                        label="label"
                        val="value"
                        :datas="scope.row.filedvaluelist"
                      />
                    </el-form-item>
                  </template>
                  <template v-else-if="scope.row.controltype == 'checkbox'">
                    <el-form-item
                      :prop="'conditionList.' + scope.$index + '.filedmultiple'"
                      :rules="{ required: true, message: '运算值不能为空', trigger: 'change'}"
                    >
                      <mk-select
                        style="width:100%;"
                        size="mini"
                        :multiple="true"
                        collapse-tags
                        v-model="scope.row.filedmultiple"
                        :key="scope.row.key"
                        :filter="['label']"
                        label="label"
                        val="value"
                        :datas="scope.row.filedvaluelist"
                      />
                    </el-form-item>
                  </template>
                  <template v-else-if="scope.row.controltype == 'time'">
                    <el-form-item
                      :prop="'conditionList.' + scope.$index + '.filedvalue'"
                      :rules="{ required: true, message: '运算值不能为空', trigger: 'change'}"
                    >
                      <el-time-picker
                        style="width:100%;"
                        arrow-control
                        size="mini"
                        v-model="scope.row.filedvalue"
                        placeholder="时间"
                      ></el-time-picker>
                    </el-form-item>
                  </template>
                  <template v-else-if="scope.row.controltype == 'date'">
                    <el-form-item
                      :prop="'conditionList.' + scope.$index + '.filedvalue'"
                      :rules="{ required: true, message: '运算值不能为空', trigger: 'change'}"
                    >
                      <el-date-picker
                        size="mini"
                        style="width:100%;"
                        v-model="scope.row.filedvalue"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期"
                      ></el-date-picker>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <el-form-item
                      :prop="'conditionList.' + scope.$index + '.filedvalue'"
                      :rules="{ required: true, message: '运算值不能为空', trigger: 'blur'}"
                    >
                      <el-input
                        size="mini"
                        placeholder="请输入内容"
                        v-model="scope.row.filedvalue"
                        clearable
                      ></el-input>
                    </el-form-item>
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                label="连接符"
                show-overflow-tooltip
                align="center"
                class-name="tableForm"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'conditionList.' + scope.$index + '.filedconnectoperator'"
                    :rules="{ required: true, message: '连接符不能为空', trigger: 'change'}"
                  >
                    <mk-select
                      size="mini"
                      v-model="scope.row.filedconnectoperator"
                      :key="scope.row.key"
                      :filter="['bzname']"
                      label="bzname"
                      val="bzcode"
                      :datas="getDicStandarDcode('连接符')"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="字段类型"
                show-overflow-tooltip
                align="center"
                class-name="tableForm"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'conditionList.' + scope.$index + '.fieldtype'"
                    :rules="{ required: true, message: '连接符不能为空', trigger: 'change'}"
                  >
                    <mk-select
                      size="mini"
                      v-model="scope.row.fieldtype"
                      :key="scope.row.key"
                      :filter="['label']"
                      val="val"
                      :datas="[{label:'数值类型',val:'1'},{label:'字符串类型',val:'2'}]"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                fixed="right"
                label="操作"
                width="200"
                class-name="tableForm"
              >
                <template slot="header" slot-scope="scope">
                  <span class="primary">操作</span>
                </template>
                <template slot-scope="scope">
                  <div
                    class="tableBtn"
                    style="margin-bottom:16px;"
                    v-if="scope.row.serialnumber == ''"
                  >
                    <el-link
                      title="删除"
                      @click="bDel(scope.$index)"
                      :underline="false"
                      type="danger"
                      icon="mkfont trasch"
                    ></el-link>
                    <el-link
                      title="上移"
                      @click="bMoveUp(scope.$index)"
                      :underline="false"
                      type="primary"
                      icon="mkfont shangyi"
                    ></el-link>
                    <el-link
                      title="下移"
                      @click="bMoveDow(scope.$index)"
                      :underline="false"
                      type="primary"
                      icon="mkfont xiayi"
                    ></el-link>
                  </div>
                  <div class="tableBtn" v-else style="margin-bottom:16px;">
                    <el-link
                      title="删除"
                      @click="Del(scope.row)"
                      :underline="false"
                      type="danger"
                      icon="mkfont trasch"
                    ></el-link>
                    <el-link
                      title="上移"
                      @click="MoveUp(scope.$index,scope.row,conditionList,'serialnumber','orderno',riskevaluationadaptation_Get,'/Hcrm/Riskevaluation/riskevaluationadaptation_UpAndDown')"
                      :underline="false"
                      type="primary"
                      :disabled="scope.row.status == 3 || scope.row.status == 99"
                      icon="mkfont shangyi"
                    ></el-link>
                    <el-link
                      title="下移"
                      @click="MoveDow(scope.$index,scope.row,conditionList,'serialnumber','orderno',riskevaluationadaptation_Get,'/Hcrm/Riskevaluation/riskevaluationadaptation_UpAndDown')"
                      :underline="false"
                      type="primary"
                      :disabled="scope.row.status == 3 || scope.row.status == 99"
                      icon="mkfont xiayi"
                    ></el-link>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <el-footer>
            <mk-page :pager="pagercondition" @query="riskevaluationadaptation_Get" />
          </el-footer>
        </el-container>
      </template>
    </SplitPane>
    <generate-sql ref="generatesql" @change="sqlChange"></generate-sql>
  </d2-container>
</template>

<script>
import GenerateSql from "./components/GenerateSQL";
export default {
  name: "risktypejudge",
  components: {
    GenerateSql
  },
  computed: {},
  data() {
    return {
      classList:[],//大类列表
      radio: null, //
      expands: [],
      getRowKeys(row) {
        return row.riskid;
      },
      pagercondition: {
        count: 0,
        page: 1,
        rows: 20
      },
      classData: {
        classid: "",
        classname: "",
        subclassid: "",
        tag: 1
      },
      CRFList: [],
      LstcrfDetail: [],
      FiledList: [],
      FiledValueList: [],
      parentRow: {},
      subRow: {},
      curRow: {},
      sql: "",
      key: new Date().getTime(),
      subClassList: [],
      riskCateList: [],
      riskTypeList: [],
      model: {
        conditionList: []
      },
      conditionList: []
    };
  },
  created() {
    this.edcclassinfo_Get()
  },
  methods: {
    //获取大类
    edcclassinfo_Get(){
      this.MK.Request(
        "Publics/CRFClassMaintain/edcclassinfo_Get",
        "get",
        {}
      ).then(res => {
        if (res.code == 0) {
          this.classList = res.data;
          this.classData.classid=res.data[0].classid;
          this.classidChange(res.data[0])
        }
      });
    },
    //本地删除
    bDel(index) {
      this.conditionList.splice(index, 1);
      this.pagercondition.count = this.conditionList.length;
    },
    //本地上移
    bMoveUp(index) {
      if (index == 0) {
        this.$message({
          type: "info",
          message: "已经是第一条，不可上移！"
        });
        return;
      }
      let update = this.conditionList[index - 1];
      this.conditionList.splice(index - 1, 1);
      this.conditionList.splice(index, 0, update);
    },
    //本地下移
    bMoveDow(index) {
      if (index + 1 == this.conditionList.length) {
        this.$message({
          type: "info",
          message: "已经是最后一条，不可下移！"
        });
        return;
      }
      let update = this.conditionList[index + 1];
      this.conditionList.splice(index + 1, 1);
      this.conditionList.splice(index, 0, update);
    },
    //Del删除风险评估条件(明细字段)
    Del(row) {
      this.$confirm("确定删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.MK.Request(
            "/Hcrm/Riskevaluation/riskevaluationadaptation_Del",
            "post",
            row
          ).then(res => {
            if (res.code == 0) {
              this.riskevaluationadaptation_Get();
            }
          });
        })
        .catch(() => {});
    },
    //折叠事件
    async rowChange(row, expandedRows) {
      //	每次只展开一个扩展列表
      var that = this;
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          let res = await this.risklevel_Get(row);
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
    //风险等级行点击事件
    riskTypeRowClick(row) {
      this.subRow = row;
      this.radio = row.levelid;
      this.riskevaluationadaptation_Get();
    },
    //
    riskevaluationadaptation_Get() {
      let sendData = {
        classid: this.classData.classid,
        subclassid: this.classData.subclassid,
        risktypeid: this.parentRow.riskid,
        levelid: this.subRow.levelid
      };
      this.MK.Request(
        "/Hcrm/Riskevaluation/riskevaluationadaptation_Get",
        "get",
        { ...sendData, ...this.pagercondition }
      ).then(res => {
        if (res.code == 0) {
          this.pagercondition.count = res.count;
          this.conditionList = res.data;
          if (res.dynRkeve.length > 0) {
            this.sql = res.dynRkeve[0].condition.replace(/\"/g, "'");
          }
          this.conditionList.forEach(item => {
            let crfid = item.crfid;
            let fieldid = item.fieldid;
            let LstcrfDetail = this.LstcrfDetail.filter(
              key => key.crfid == crfid
            );
            this.$set(item, "filedlist", LstcrfDetail); //设置表单对应的控件列表
            LstcrfDetail.forEach(keys => {
              if (keys.fieldid == fieldid) {
                let str = "";
                this.$set(item, "controltype", keys.controltype);
                if (
                  keys.controltype == "radio" ||
                  keys.controltype == "select" ||
                  keys.controltype == "checkbox"
                ) {
                  str = keys.options;
                  let strArr = str.split(";");
                  var filtered = strArr.filter(function(el) {
                    return el != "";
                  });
                  let options = [];
                  filtered.forEach(item => {
                    let opt = {};
                    let itemArr = item.split("=");
                    opt["label"] = itemArr[0];
                    opt["value"] = itemArr[1];
                    options.push(opt);
                  });
                  this.$set(item, "filedvaluelist", options);
                  this.$set(item, "key", new Date().getTime());
                  this.FiledValueList = options;
                  if (keys.controltype == "checkbox") {
                    let NewArr = item.filedvalue.split(",");
                    NewArr.forEach(val => {
                      val = parseInt(val);
                    });
                    this.$set(item, "filedmultiple", NewArr);
                    this.$set(item, "key", new Date().getTime());
                  }
                }
              }
            });
          });
          console.log(this.conditionList);
        }
      });
    },
    async classidChange(data) {
      if (data.classid == "") {
        this.subClassList = [];
        this.conditionList = [];
        this.classData.subclassid = "";
        this.riskCateList = [];
        this.key = new Date().getTime();
        return;
      }
      let res = await this.edcsubclassinfo_Get(data);
      let ArrList = [];
      if (res.code == 0) {

        ArrList = res.data.filter(item => item.status == 1);
        this.classData.subclassid = ArrList[0].subclassid;
        this.subclassChange()
      }
      this.subClassList = ArrList;
      this.key = new Date().getTime();
    },
    //获取小类
    edcsubclassinfo_Get({ classid }) {
      return this.MK.Request(
        "/Publics/CRFClassMaintain/edcsubclassinfo_Get",
        "get",
        { classid, tag: 1 }
      );
    },
    //小类更改事件
    subclassChange(data) {
      console.log(data);
      this.risktypeinfo_Get();
      this.edcclasscrf_Get();
    },
    // 根据大类ID和小类ID获取对应的表单信息
    edcclasscrf_Get() {
      this.MK.Request(
        "/Publics/CRFMaintain/edcclasscrf_Get",
        "get",
        this.classData
      ).then(res => {
        if (res.code == 0) {
          this.CRFList = res.lstcrf;
          this.LstcrfDetail = res.lstcrfdetail;
        }
      });
    },
    //获取风险类型信息
    risktypeinfo_Get() {
      this.MK.Request("/Hcrm/Risktypeinfo/risktypeinfo_Get", "get", {
        tag: 1
      }).then(res => {
        if (res.code == 0) {
          this.riskCateList = res.data;
        }
      });
    },
    //风险类型行点击事件
    riskRowClick(row) {
      this.parentRow = row;
      this.$refs.refTable.toggleRowExpansion(row);
      this.conditionList = [];
    },
    //
    risklevel_Get({ riskid }) {
      return this.MK.Request("Hcrm/Risktypeinfo/risklevel_Get", "get", {
        risktypeid: riskid,
        tag: 1
      }).then(res => {
        if (res.code == 0) {
          this.riskTypeList = res.data.filter(item => item.status != 99);
          return res;
        }
      });
    },
    //crf表单更改事件
    crfChange(data, list, index) {
      let { crfid, crfname } = data;
      list[index]["crfname"] = crfname;
      this.crf_detail_Get(crfid, list, index);
    },
    //控件更改事件
    filedChange(data, list, index) {
      // controltype radio checkbox time date select
      list[index]["controltype"] = data.controltype;
      list[index]["fieldname"] = data.fieldname;
      list[index]["filedvalue"] = "";
      list[index]["key"] = new Date().getTime();
      let str = "";
      if (
        data.controltype == "radio" ||
        data.controltype == "select" ||
        data.controltype == "checkbox"
      ) {
        str = data.options;
        let strArr = str.split(";");
        var filtered = strArr.filter(function(el) {
          return el != "";
        });
        let options = [];
        filtered.forEach(item => {
          let opt = {};
          let itemArr = item.split("=");
          opt["label"] = itemArr[0];
          opt["value"] = itemArr[1];
          options.push(opt);
        });
        this.FiledValueList = options;
        list[index]["filedvaluelist"] = this.FiledValueList;
        list[index]["filedvalue"] = "";
        list[index]["key"] = new Date().getTime();
      }
      console.log(list[index]);
    },

    //根据表单id 获取控件
    crf_detail_Get(crfid, list, index) {
      let filedlist = this.LstcrfDetail.filter(item => (item.crfid = crfid));
      list[index]["filedlist"] = filedlist;
      list[index]["key"] = new Date().getTime();
      list[index]["fieldid"] = "";
    },
    //明细添加
    tableRowAdd() {
      let str = "请选择";
      let flag = true;
      if (this.classData.classid == "") {
        str = "请选择大类";
        flag = false;
      } else if (this.classData.subclassid == "") {
        str = "请选择小类";
        flag = false;
      } else if (!this.parentRow.riskid) {
        str = "请选择风险分类";
        flag = false;
      } else if (!this.subRow.levelid) {
        str = "请选择风险等级";
        flag = false;
      } else {
        this.conditionList.push({
          serialnumber: "",
          evaluateionid: "",
          crfid: "",
          crflist: this.CRFList, //表单列表
          filedlist: [], //表单所有控件列表
          filedmultiple: [], //多选 控件数据
          filedvaluelist: this.FiledValueList, //特殊控件选项值列表
          key: new Date().getTime(),
          controltype: "", //控件类型
          crfname: "",
          fieldid: "",
          fieldname: "",
          fieldnote: "",
          filedoperator: "",
          filedvalue: "",
          filedconnectoperator: "",
          orderno: 2,
          fieldtype: ""
        });
        this.pagercondition.count = this.conditionList.length;
      }
      if (!flag) {
        this.$message({
          type: "error",
          message: str
        });
      }
    },
    //生成
    async generateSQL() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.conditionList.forEach(item => {
            if (item.controltype == "checkbox") {
              this.$set(item, "filedvalue", item.filedmultiple.join(","));
            }
          });
          let sendData = {
            classid: this.classData.classid,
            subclassid: this.classData.subclassid,
            levelid: this.subRow.levelid,
            risktypeid: this.parentRow.riskid,
            condition: "",
            lstDetail: this.conditionList
          };
          let res = await this.SqlGet(sendData);
          if (res.code == 0) {
            this.$refs.generatesql.open(sendData, res.sql);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //查看sql
    seeSql() {
      this.conditionList.forEach(item => {
        if (item.controltype == "checkbox") {
          this.$set(item, "filedvalue", item.filedmultiple.join(","));
        }
      });
      let sendData = {
        classid: this.classData.classid,
        subclassid: this.classData.subclassid,
        levelid: this.subRow.levelid,
        risktypeid: this.parentRow.riskid,
        condition: "",
        lstDetail: this.conditionList
      };
      this.$refs.generatesql.open(sendData, this.sql);
    },
    // 根据edc小类id获取对应的表单列表(Subclassid：小类id)
    SqlGet(data) {
      return this.MK.Request(
        "/Hcrm/Riskevaluation/Riskevaluationasql_Add",
        "post",
        data
      );
      // .then(res => {
      // if (res.code == 0) {
      //   var formatSql = sqlFormatter.format(res.sql, {
      //     language: "sql",
      //     indent: ""
      //   });
      //   this.sql = formatSql;
      //   this.key = new Date().getTime();
      // }
      // });
    },
    //生成sql提交事件
    sqlChange(data) {
      this.riskevaluationadaptation_Add(data);
    },
    // 评估条件保存(condition：为sql语句)
    riskevaluationadaptation_Add(data) {
      this.MK.Request(
        "/Hcrm/Riskevaluation/riskevaluationadaptation_Add",
        "post",
        data
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.$refs.generatesql.close();
        }
      });
    },
    //明细保存
    tableRowSave() {
      this.conditionList.forEach(item => {
        if (item.controltype == "checkbox") {
          this.$set(item, "filedvalue", item.filedmultiple.join(","));
        }
      });
      let sendData = {
        classid: this.classData.classid,
        subclassid: this.classData.subclassid,
        levelid: this.subRow.levelid,
        risktypeid: this.parentRow.riskid,
        condition: "",
        lstDetail: this.conditionList
      };
    }
  },
  watch: {
    conditionList(val) {
      this.model["conditionList"] = val;
    }
  }
};
</script>

<style  scoped>
>>> .el-table.el-table--medium td.tableForm {
  padding: 0 !important;
}
.el-table--medium td.tableForm {
}
</style>
