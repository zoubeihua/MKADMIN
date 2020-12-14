<template>
  <d2-container>
    <SplitPane :min-percent="20" :default-percent="50" split="vertical">
      <template slot="paneL">
        <el-container>
          <el-header>
            <el-form :inline="true">
              <el-form-item>
                <mk-select
                  v-model="pagerquestion.classid"
                  placeholder="请选择大类"
                  @change="refreshquestion"
                  :datas="classList"
                  :filter="['classname']"
                  label="classname"
                  val="classid"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  @keyup.enter.native="refreshquestion"
                  v-model="pagerquestion.condition"
                  placeholder="输入关键字"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button type="primary" icon="el-icon-search" @click="refreshquestion">查询</el-button>
                  <el-button
                    icon="el-icon-circle-plus-outline"
                    type="primary"
                    @click="questionAdd"
                  >新增</el-button>
                </el-button-group>
              </el-form-item>
            </el-form>
          </el-header>
          <el-table
            :data="questionList"
            stripe
            border
            highlight-current-row
            @row-click="tableRowClick"
            height="100%"
            style="width: 100%"
            :row-class-name="tableRowClassName"
          >
            <el-table-column sortable show-overflow-tooltip prop="subclassname" label="小类名称"></el-table-column>
            <el-table-column
              align="center"
              sortable
              width="120"
              show-overflow-tooltip
              prop="status"
              label="状态"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="GetvalidStatusType(scope.row.status)"
                  disable-transitions
                >{{ scope.row.statusdisplay }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              sortable
              show-overflow-tooltip
              prop="createname"
              label="创建人"
            ></el-table-column>
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
            <el-table-column align="center"  prop label="操作">
              <template slot="header">
                <span class="primary">操作</span>
              </template>
              <template slot-scope="scope">
                <div class="tableBtn">
                  <el-link
                    :title="scope.row.status != 1 ? '启用' : '停用'"
                    @click.stop="Examine(scope.row,'/Publics/CRFClassMaintain/edcsubclassinfo_StopAndOpen','停用','启用',refreshquestion)"
                    :underline="false"
                     :type="scope.row.status != 1 ?'primary':'danger'"
                    :icon="scope.row.status != 1 ? 'mkfont qiyong' : 'mkfont tingyong_line'"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                  ></el-link>
                  <el-link
                    title="编辑"
                    @click.stop="subclassinfo_Edit(scope.row)"
                    :underline="false"
                    type="primary"
                    icon="mkfont bianji1"
                  ></el-link>
                  <!-- <el-link
                    title="删除"
                    @click="Del(scope.row)"
                    :underline="false"
                    type="danger"
                    icon="mkfont trasch"
                  ></el-link>-->
                  <el-link
                    title="上移"
                    @click.stop="MoveUp(scope.$index,scope.row,questionList,'serialnumber','orderno',refreshquestion,'/Publics/CRFClassMaintain/edcsubclassinfo_UpAndDown')"
                    :underline="false"
                    type="primary"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                    icon="mkfont shangyi"
                  ></el-link>
                  <el-link
                    title="下移"
                    @click.stop="MoveDow(scope.$index,scope.row,questionList,'serialnumber','orderno',refreshquestion,'/Publics/CRFClassMaintain/edcsubclassinfo_UpAndDown')"
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
            <mk-page :pager="pagerquestion" @query="refreshquestion" />
          </el-footer>
        </el-container>
      </template>
      <template slot="paneR">
        <el-container>
          <el-header>
            <el-form :inline="true">
              <el-form-item>
                <el-input
                 @keyup.enter.native="edcclasscrf_Get"
                  v-model="pagertoForm.condition"
                  :disabled="!curRow.subclassid"
                  placeholder="输入关键字"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    :disabled="!curRow.subclassid"
                    @click="edcclasscrf_Get"
                  >查询</el-button>
                  <el-button
                    icon="el-icon-circle-plus-outline"
                    type="primary"
                    :disabled="!curRow.subclassid || curRow.status == 0"
                    @click="toFormAdd"
                  >新增</el-button>
                </el-button-group>
              </el-form-item>
            </el-form>
          </el-header>
          <el-table
            stripe
            :data="toFormList"
            highlight-current-row
            border
            height="100%"
            style="width: 100%"
          >
            <el-table-column sortable prop="crfname" show-overflow-tooltip label="对应表单"></el-table-column>
            <!-- <el-table-column
              sortable
              align="center"
              width="120"
              show-overflow-tooltip
              prop="status"
              label="状态"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="GetvalidStatusType(scope.row.status)"
                  disable-transitions
                >{{ scope.row.statusdisplay }}</el-tag>
              </template>
            </el-table-column> -->
            <el-table-column align="center" width="180" prop label="操作">
              <template slot="header">
                <span class="primary">操作</span>
              </template>
              <template slot-scope="scope">
                <div class="tableBtn">
                  <!-- <el-link
                    :title="scope.row.status != 1 ? '启用' : '停用'"
                    @click="Examine(scope.row,'/Publics/CRFClassMaintain/edcclasscrf_StopAndOpen','启用','停用',edcclasscrf_Get)"
                    :underline="false"
                    type="primary"
                    :icon="scope.row.status != 1 ? 'mkfont qiyong' : 'mkfont tingyong_line'"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                  ></el-link> -->
                  <!-- <el-link
                    title="删除"
                    @click="Del(scope.row)"
                    :underline="false"
                    type="danger"
                    icon="mkfont trasch"
                  ></el-link>-->
                  <el-link
                    title="上移"
                    @click="MoveUp(scope.$index,scope.row,toFormList,'serialnumber','orderno',edcclasscrf_Get,'/Publics/CRFClassMaintain/edcclasscrf_UpAndDown')"
                    :underline="false"
                    type="primary"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                    icon="mkfont shangyi"
                  ></el-link>
                  <el-link
                    title="下移"
                    @click="MoveDow(scope.$index,scope.row,toFormList,'serialnumber','orderno',edcclasscrf_Get,'/Publics/CRFClassMaintain/edcclasscrf_UpAndDown')"
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
            <mk-page :pager="pagertoForm" @query="edcclasscrf_Get" />
          </el-footer>
        </el-container>
      </template>
    </SplitPane>
    <!-- 问卷添加 -->
    <vxe-modal v-model="questionAddModal" :showFooter="true" title="问卷维护" width="540" height="auto">
      <el-form :model="questionAddForm" :rules="rules" ref="questionAddForm" label-width="80px">
        <el-form-item label="大类" prop="classid">
          <mk-select
            :disabled="submitType == 1"
            v-model="questionAddForm.classid"
            url="/Publics/CRFClassMaintain/edcclassinfo_Get"
            :filter="['classname']"
            label="classname"
            val="classid"
          />
        </el-form-item>
        <el-form-item label="子类名称" prop="subclassname">
          <el-input class="input" v-model="questionAddForm.subclassname" placeholder="请输入问卷名称"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="limitsex">
          <mk-select
                v-model="questionAddForm.limitsex"
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
        <!-- <el-form-item label="性别" prop="limitsex">
          <el-radio-group class="input" v-model="questionAddForm.limitsex">
            <el-radio :label="0">不限制</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="年龄" prop="agerange">
          <range-input v-model="questionAddForm.agerange"></range-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            resize="none"
            :rows="2"
            v-model="questionAddForm.note"
            placeholder="描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="primary" @click="submitQuestion">提交</el-button>
          <el-button type="warning" @click="colseModel">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
    <!-- 表单添加 -->
    <form-list ref="fromlist" @change="fromListOnchange"></form-list>
  </d2-container>
</template>
<script>
import axios from "axios";
import FormList from "./components/formlist";
import RangeInput from "./components/rangeinput";
export default {
	name:'healthquestionnaire',
  components: {
    FormList,
    RangeInput
  },
  data() {
    return {
      classList:[],
      flag: true,
      submitType: 0, //提交类型 0新增 1编辑
      rules: {
        classid: [{ required: true, message: "请选择大类", trigger: "change" }],
        subclassname: [
          { required: true, message: "请输入子类名称", trigger: "blur" }
        ],
        limitsex: [{ required: true, message: "请选择性别", trigger: "change" }]
      },
      curRow: {}, //小类点击单行数据
      questionList: [],
      pagerquestion: {
        count: 0,
        page: 1,
        rows: 20,
        classid: "",
        condition: ""
      },
      pagertoForm: {
        count: 0,
        page: 1,
        rows: 20,
        subclassid: "",
        condition: ""
      },
      toFormList: [],
      questionAddModal: false,
      questionAddForm: {
        serialnumber: -1,
        classid: "", //大类id
        agerange: "", //年龄范围格式 10-20 ，“-1” 标识 无年龄范围限制，
        condition: "", //来源于会员基本信息表的相关字段填写
        createid: "", //创建人id
        subclassname: "", //子类名称
        note: "", //问卷描述
        limitsex: "0", //限制性别 0:不限制 1:限制男性 2：限制女性
        orderno: 0, //排序序号
        status: 1 //状态 0:无效 1 ：有效
      }
    };
  },
  created() {
    this.edcclassinfo_Get()
  },
  methods: {
    tableBtn() {
      this.flag = !this.flag;
    },
    //获取大类
    edcclassinfo_Get(){
      this.MK.Request(
        "Publics/CRFClassMaintain/edcclassinfo_Get",
        "get",
        {}
      ).then(res => {
        if (res.code == 0) {
          this.classList = res.data;
          this.pagerquestion.classid=res.data[0].classid,
          this.refreshquestion()
        }
      });
    },
    //小类行点击事件
    tableRowClick(row) {
      this.curRow = JSON.parse(JSON.stringify(row)); //深度复制;
      this.pagertoForm.subclassid = this.curRow.subclassid;
      this.edcclasscrf_Get();
    },
    //小类行点击样式
    tableRowClassName({row, rowIndex}) {
        if (row.subclassid === this.pagertoForm.subclassid) {
          return 'current-row';
        }
        return '';
      },
    // 根据edc小类id获取对应的表单列表(Subclassid：小类id)
    edcclasscrf_Get() {
      this.MK.Request(
        "/Publics/CRFClassMaintain/crfListBySubclassidHavePage_Get",
        "get",
        this.pagertoForm
      ).then(res => {
        if (res.code == 0) {
          this.pagertoForm.count = res.count;
          this.toFormList = res.data;
        }
      });
    },
    //表单添加事件
    fromListOnchange(data) {
      let sendData = {
        classid: this.curRow.classid,
        subclassid: this.curRow.subclassid,
        classname: this.curRow.classname,
        lstedcclasscrf: data,
        operateType: ""
      };
      this.edcclasscrf_Add(sendData);
    },
    //保存dec小类对应表单
    edcclasscrf_Add(data) {
      this.MK.Request(
        "/Publics/CRFClassMaintain/edcclasscrf_Add",
        "post",
        data
      ).then(res => {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.edcclasscrf_Get();
        this.$refs.fromlist.close();
      });
    },
    //获取大类信息
    refreshquestion() {
      if (this.pagerquestion.classid == "") {
        this.$message({
          type: "error",
          message: "请先选择大类"
        });
        return;
      }
      this.MK.Request(
        "/Publics/CRFClassMaintain/edcsubclassinfo_Get",
        "get",
        this.pagerquestion
      ).then(res => {
        if (res.code == 0) {
          this.questionList = res.data;
          this.pagerquestion.count = res.count;
          this.curRow = {};
          this.tableRowClick(res.data[0])
        }
      });
    },

    refreshtoForm() {},
    //关闭弹窗
    colseModel() {
      this.questionAddModal = false;
      this.submitType = 0;
      this.questionAddForm = {
        serialnumber: -1,
        classid: "", //大类id
        agerange: "", //年龄范围格式 10-20 ，“-1” 标识 无年龄范围限制，
        condition: "", //来源于会员基本信息表的相关字段填写
        createid: "", //创建人id
        subclassname: "", //子类名称
        note: "", //问卷描述
        limitsex: "0", //限制性别 0:不限制 1:限制男性 2：限制女性
        orderno: 0, //排序序号
        status: 1 //状态 0:无效 1 ：有效
      };
      this.$refs.questionAddForm.resetFields();
    },
    //新增小类
    questionAdd() {
      this.submitType = 0;
      this.questionAddModal = true;
    },
    //小类编辑
    subclassinfo_Edit(row) {
      this.submitType = 1;
      this.questionAddForm = JSON.parse(JSON.stringify(row));
      this.questionAddModal = true;
    },
    //小类提交
    submitQuestion() {
      this.questionAddForm.createid = this.info.userid;
      this.questionAddForm.agerange =
        this.questionAddForm.agerange == ""
          ? "-1"
          : this.questionAddForm.agerange;
      this.$refs.questionAddForm.validate(valid => {
        if (valid) {
          if (this.submitType == 0) {
            this.edcsubclassinfo_Add();
          } else {
            this.edcsubclassinfo_Edit();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      console.log(this.questionAddForm.agerange);
    },
    edcsubclassinfo_Add() {
      this.MK.Request(
        "/Publics/CRFClassMaintain/edcsubclassinfo_Add",
        "post",
        this.questionAddForm
      ).then(res => {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.refreshquestion();
        this.colseModel();
      });
    },
    edcsubclassinfo_Edit() {
      this.MK.Request(
        "/Publics/CRFClassMaintain/edcsubclassinfo_Edit",
        "post",
        this.questionAddForm
      ).then(res => {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.refreshquestion();
        this.colseModel();
      });
    },
    //新增表单
    toFormAdd() {
      this.$refs.fromlist.open(this.curRow);
    },
    //新增条件
    conditionAdd() {}
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
.content .L,
.content .R {
  flex: 1;
}
.content .R {
  display: flex;
  border-left: 1px solid #e0e0e0;
}
</style>
