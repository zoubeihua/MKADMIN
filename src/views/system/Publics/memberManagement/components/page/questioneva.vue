<template>
  <el-container>
    <el-header>
      <el-form :inline="true">
        <el-form-item label="问卷日期">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="daterange"
            type="daterange"
            align="right"
            unlink-panels
            @change="dateRangeChange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <mk-select
            v-model="form.status"
            @change="PEQuestionnaire_Get"
            style="width:160px;"
            placeholder="请选择评估状态"
            :filter="['lable']"
            :datas="[{lable:'未评',val:'0'},{lable:'已评',val:'1'},{lable:'未发布',val:'2'},{lable:'已发布',val:'3'}]"
            label="lable"
            val="val"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <mk-select
            style="width:136px;"
            v-model="form.useid"
            url="/Publics/Common/UserInfo"
            :param="{tag:1,hospitalid:info.hospitalid}"
            placeholder="请选择评估人"
            :filter="['name']"
            label="name"
            val="userid"
            @change="PEQuestionnaire_Get"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <mk-select
            style="width:126px;"
            v-model="form.releaseuserid"
            url="/Publics/Common/UserInfo"
            :param="{tag:1,hospitalid:info.hospitalid}"
            placeholder="请选发布人"
            :filter="['name']"
            label="name"
            val="userid"
            @change="PEQuestionnaire_Get"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="PEQuestionnaire_Get">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main style="padding:0;">
      <el-container>
        <el-aside width="300px" style="background-color:#f5f5f5;padding: 6px 6px 0 6px;">
          <el-container>
            <el-main style="padding:0">
              <el-scrollbar style="height:100%;width:100%;">
                <mk-empty v-if="LeftDataList.length == 0" style="padding-top:200px;"></mk-empty>
                <el-card
                  v-else
                  :class="[currIndex == index ? 'active' : '']"
                  :shadow="currIndex == index ? 'always' : 'hover'"
                  v-for="(item,index) in LeftDataList"
                  :key="index"
                  @click.native="edcclasscrf_Get(item,index)"
                >
                  <div
                    class="sign"
                    :class="[item.sourcetag == 0 ? 'primary-bg' : 'danger-bg']"
                  >{{item.sourcetag == 0 ? '医生' : '患者'}}</div>
                  <h3 class="Ltitle">
                    <el-link type="primary" style="font-size:18px;">{{item.subclassname}}</el-link>
                  </h3>
                  <div style="padding-left:6px;">
                    <div class="info">
                      <!-- <el-tag size="mini" type="danger"></el-tag> -->
                      人群分类 {{item.riskinfo}}
                    </div>
                    <div class="info">
                      <span>评估医生 {{item.useidname}}</span>
                    </div>
                    <div class="info">
                      <span>评估时间 {{item.parsingtime}}</span>
                    </div>
                  </div>
                  <div class="sourcetag info">
                    <span>
                      来源
                      <i class="el-icon-time"></i>
                      {{item.membertime}}
                    </span>
                  </div>
                </el-card>
              </el-scrollbar>
            </el-main>
          </el-container>
        </el-aside>
        <main style="width:100%;">
          <mk-empty v-if="currIndex == null || LeftDataList.length == 0" style="padding-top:200px;"></mk-empty>
          <el-tabs tab-position="left" style="height: 100%" v-model="Opertype"  @tab-click="handleOpertClick" v-else>
             <mk-empty v-if="Opertype == 0" style="padding-top:200px;"></mk-empty>
            <el-tab-pane label="问卷查看" name="1">
              <mk-tabs-crf ref="tabscrf" :edit="edit"></mk-tabs-crf>
            </el-tab-pane>
            <el-tab-pane label="体检方案" name="2">
              <el-container>
                <el-header
                  style="padding: 0 !important;height: 40px !important;min-height:40px !important;border-bottom:0 !important;"
                >
                  <el-tabs
                    :stretch="true"
                    v-model="programetype"
                    @tab-click="handleProgrameClick"
                    style="width:100%;"
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
                  <mk-empty v-if="deptList.length == 0" style="padding-top:200px;"></mk-empty>
                  <el-container v-else>
                    <el-aside width="130px" style="padding:0;">
                      <div style="height:100%;">
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
                    </el-aside>
                    <el-main style="padding:0;">
                      <el-table
                        :data="datagroupList"
                        highlight-current-row
                        border
                        ref="refTable"
                        height="100%"
                      >
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
            </el-tab-pane>
          </el-tabs>
        </main>
      </el-container>
    </el-main>
  </el-container>
</template>
<script>
export default {
  props: {
    userData: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  mounted() {
    this.PEQuestionnaire_Get();
  },
  data() {
    return {
      Opertype:'0',
      edit:false,
      currIndex: null,
      LeftDataList: [],
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
      daterange: "", //日期范围
      form: {
        membertimebegin: "", //问卷开始时间
        membertimeend: "", //问卷结束时间
        memberid: "", //会员id
        status: undefined, //0：初始 1：会员已填 2：已解析 (-1:表示所有)
        hospitalid: "",
        releaseuserid: "",
        tag: 1
      },
      evaluateid: null,
      programetype: "", //方案类型
      deptid: null,
      deptList: [], //生成方案科室数据
      datagroupList: [], //科室对应的组合
      programeNameList: [],
      curRow:{}
    };
  },
  methods: {
    //左边卡片点击事件
    async edcclasscrf_Get(row, index) {
      this.evaluateid = row.evaluateid;
      this.currIndex = index;
      this.curRow = row;
      this.Opertype = '0';
      this.MK.Request(
        "/Hcrm/QuestionnaireEvaluate/PEDetailByEvaluateid_Get",
        "get",
        row
      ).then(res => {
        if (res.code == 0) {
          this.programeNameList = res.programeName;
        }
      });
    },
    //左侧tab点击时间
    async handleOpertClick(tab){
      if(tab.name == 1){
         this.$refs.tabscrf.CRFillJsonBysubclassid_Get({
            collectionid: this.curRow.collectionid,
            memberid: this.userData.memberid,
            subclassid: this.curRow.subclassid
          });
      }
      if(tab.name == 2){
        this.programetype = '0';
        let res = await this.PECheckupPlan_Get(this.evaluateid, "0");
          if (res.code == 0) {
            this.deptList = res.data;
        }
      }
    },
    //方案tab点击事件
    async handleProgrameClick(tab) {
      this.programetype = tab.name;
      this.datagroupList = [];
      this.deptid = null;
      let res = await this.PECheckupPlan_Get(
        this.evaluateid,
        this.programetype
      );
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
    //时间范围更改事件
    dateRangeChange(val) {
      if (val == null) {
        this.form.membertimebegin = "";
        this.form.membertimeend = "";
      } else {
        this.form.membertimebegin = val[0];
        this.form.membertimeend = val[1];
      }
      this.PEQuestionnaire_Get();
    },
    PEQuestionnaire_Get() {
      this.form.hospitalid = this.info.hospitalid;
      this.form.memberid = this.userData.memberid;
      this.MK.Request(
        "/Hcrm/QuestionnaireEvaluate/PEQuestionnaire_Get",
        "get",
        this.form
      ).then(res => {
        if (res.code == 0) {
          this.LeftDataList = res.data;
        }
      });
    }
  }
};
</script>
<style  scoped>
>>> .el-header {
  border-bottom: 1px solid #cfd7e5 !important;
}
.el-header >>> .el-form-item {
  margin-bottom: 10px !important;
}
>>> .el-card__body {
  position: relative !important;
  padding: 10px 10px 0 10px !important;
}
.sign {
  color: #fff;
  height: 30px;
  width: 92px;
  position: absolute;
  top: 0;
  right: -30px;
  text-align: center;
  line-height: 30px;
  font-family: "黑体";
  background-color: #0c60ee;
  -moz-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
.Ltitle {
  margin: 0;
  padding: 0;
  margin-bottom: 4px;
}
.sourcetag {
  margin-top: 6px;
  color: #b8b8b8;
  height: 32px;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid #F1F3F4;
}
>>> .el-tabs__content {
  height: 100%;
}
>>> .el-tab-pane {
  height: 100%;
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
.el-card.active{
  border-color: rgba(12, 96, 238,.5) !important;
  box-shadow: 0 2px 12px 0 rgba(12, 96, 238,.5);
}

</style>
