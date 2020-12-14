<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true">
        <el-form-item label="问卷日期">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="daterange"
            type="daterange"
            align="right"
            unlink-panels
            @change="dateRangeChange($event)"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <mk-select
            v-model="form.memberlevel"
            multiple
            collapse-tags
            url="/Publics/MemberManage/Memberlevel"
            placeholder="请选择会员等级"
            :filter="['name']"
            label="name"
            val="levelid"
            @change="BasicInfo"
          ></mk-select>
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
          <el-input style="width:220px;" v-model="form.condition" placeholder="按会员卡号 / 姓名 / 拼音 / 联系电话查询"
          @keyup.enter.native="BasicInfo"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox true-label="1" false-label="0" v-model="form.mycustomer" @change="BasicInfo">我的会员</el-checkbox>
        </el-form-item>
        <el-form-item>

        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="BasicInfo">查询</el-button>
            <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            :disabled="!memberRow.memberid"
            @click="healthprograminfo_Add"
          >添加问卷</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>
    <SplitPane :min-percent="20" :default-percent="30" split="vertical">
      <template slot="paneL">
        <el-container>
          <el-table
            border
            stripe
            :data="memberUserInfoList"
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
            <el-table-column align="center" sortable label="等级" prop="memberlevel_display" width="80" :sort-method="rowSort">
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
            <el-table-column align="center" label="会员手机" prop="mobiletel" sortable :formatter="(i=>{return PhoneFormat(i,'mobiletel')})"></el-table-column>
          </el-table>
          <el-footer>
            <mk-page :pager="form" @query="BasicInfo()" />
          </el-footer>
        </el-container>
      </template>
      <template slot="paneR">
         <questioneva-list :userData="memberRow" ref="PEQuestionnaire_Get"></questioneva-list>
      </template>
    </SplitPane>
  </d2-container>
</template>
<script>
import QuestionevaList from '@/views/system/Publics/memberManagement/components/questionevalist'
export default {
  name: "questionevaluate",
  components: {
    QuestionevaList
  },
  data() {
    return {
      memberRow: {},
      memberBasicinfo: {}, //个人信息
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
        createuserid: "", //当前登录账户ID
        membertimebegin: "", //问卷开始时间
        membertimeend: "", //问卷结束时间
        mycustomer: "", //1:表是我的客户; 0:不限制;
        memberlevel: [], //会员等级ID 传一个数组;[1000002,1000003,1000004]
        status: "", //问卷状态 0：未评 1：已评 2：未发布方案 3：已发布方案
        useid: "", //评估人ID
        releaseuserid: "", //发布人ID
        condition: "",
        hospitalid: "",
        rows: 20,
        page: 1,
        count: 0
      },
      form1: {
        membertimebegin: "", //问卷开始时间
        membertimeend: "", //问卷结束时间
        memberid: "", //会员id
        status: undefined, //0：初始 1：会员已填 2：已解析 (-1:表示所有)
        hospitalid: "",
        tag: 1
      },
      memberUserInfoList: []
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
  created() {
    this.form.createuserid = this.info.userid;
    this.form.hospitalid = this.info.hospitalid;
    this.form1.hospitalid = this.info.hospitalid;
    this.BasicInfo();
  },
  methods: {
     // 表格行排序
    rowSort(a,b) {
      let sort1 = a.memberlevel
      let sort2 = b.memberlevel
      return sort1 - sort2
    },
    //医生新增问卷
    healthprograminfo_Add() {
      this.$refs.PEQuestionnaire_Get.healthprograminfo_Add()
    },
    //时间范围更改事件
    dateRangeChange(val) {
      if (val == null) {
        this.form.membertimebegin = "";
        this.form.membertimeend = "";
        this.form1.membertimebegin = "";
        this.form1.membertimeend = "";
      } else {
        this.form.membertimebegin = val[0];
        this.form.membertimeend = val[1];
        this.form1.membertimebegin = val[0];
        this.form1.membertimeend = val[1];
      }
      this.BasicInfo();
    },
    //会员点击事件
    async memberRowClick(row) {
      this.memberRow = row;
      this.PEQuestionnaire_Get();
    },
    //获取会员信息
    BasicInfo() {
      this.MK.Request(
        "/Hcrm/QuestionnaireEvaluate/PEQuestionnaireMemberList_Get",
        "get",
        this.form
      ).then(res => {
        if (res.code == 0) {
          this.memberUserInfoList = res.data;
          this.form.count = res.count;
        }
      });
    },
    // 根据会员id获取体检问卷列表
    PEQuestionnaire_Get() {
      this.form1.status =
      this.form.status ==="" ? undefined : this.form.status;
      this.form1.useid = this.form.useid;//评估人ID
      this.form1.releaseuserid = this.form.releaseuserid;//发布人ID
      this.$refs.PEQuestionnaire_Get.getData(this.form1)
    }
  }
};
</script>
<style  scoped>

</style>
