<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true">
        <el-form-item label="体检日期">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="daterange"
            type="daterange"
            align="right"
            unlink-panels
            @change="dateRangeChange()"
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
            style="width:160px;"
            placeholder="请选择评估状态"
            :filter="['lable']"
            :datas="[{lable:'未评',val:'0'},{lable:'已评',val:'1'},{lable:'未发布',val:'2'},{lable:'已发布',val:'3'}]"
            label="lable"
            val="val"
            @change="PEQuestionnaire_Get"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <mk-select
            style="width:136px;"
            v-model="form.doctorid"
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
            @change="PEQuestionnaire_Get"
            placeholder="请选发布人"
            :filter="['name']"
            label="name"
            val="userid"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <el-input
            style="width:220px;"
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
        <phyeva-list :userData="memberRow" ref="phyeva"></phyeva-list>
      </template>
    </SplitPane>
  </d2-container>
</template>
<script>
import PhyevaList from '@/views/system/Publics/memberManagement/components/phyevalist'
export default {
  name: "questionevaluate",
  components: {
    PhyevaList
  },
  data() {
    return {
      memberRow:{},
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
        doctorid: "", //评估人ID
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
        status: "", //问卷状态 0：未评 1：已评 2：未发布方案 3：已发布方案
        doctorid: "", //评估人ID
        releaseuserid: "", //发布人ID
        hospitalid: "",
        tag: 1
      },
      memberUserInfoList: [],
    };
  },
  computed: {},
  created() {
    this.form.createuserid = this.info.userid;
    this.form.hospitalid = this.info.hospitalid;
    this.form1.hospitalid = this.info.hospitalid;
    this.BasicInfo();
  },
  methods: {
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
      this.PEQuestionnaire_Get();
    },
    // 表格行排序
    rowSort(a,b) {
      let sort1 = a.memberlevel
      let sort2 = b.memberlevel
      return sort1 - sort2
    },
    //会员点击事件
    async memberRowClick(row) {
      this.memberRow = row;
     this.PEQuestionnaire_Get();
    },
    //(体检评估)查询会员列表信息
    BasicInfo() {
      this.MK.Request(
        "/Hcrm/ExamEvaluate/ExamEvaluateMemberList_Get",
        "get",
        this.form
      ).then(res => {
        if (res.code == 0) {
          this.memberUserInfoList = res.data;
          this.form.count = res.count;
          this.questionnaireList=[]
        }
      });
    },
    // 根据会员id获取体检问卷列表
    PEQuestionnaire_Get(memberid) {
      this.form1.status = this.form.status;
      this.form1.doctorid = this.form.doctorid;
      this.form1.releaseuserid = this.form.releaseuserid;
      this.$refs.phyeva.getData(this.form1)
    }
  }
};
</script>

