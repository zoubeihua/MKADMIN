<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true">
        <el-form-item>
          <mk-select
            style="width:180px;"
            v-model="form.memberlevel"
            multiple
            collapse-tags
            url="/Publics/MemberManage/Memberlevel"
            @change="BasicInfo()"
            placeholder="请选择会员等级"
            :filter="['name']"
            label="name"
            val="levelid"
          ></mk-select>
        </el-form-item>
        <el-form-item label="计划日期">
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
            style="width:160px;"
            v-model="form.planuserid"
            url="/Publics/Common/UserInfo"
            :param="{tag:1,hospitalid:info.hospitalid}"
            @change="BasicInfo()"
            placeholder="请选计划执行人"
            :filter="['name']"
            label="name"
            val="userid"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <mk-select
            style="width:160px;"
            v-model="form.releaseuserid"
            url="/Publics/Common/UserInfo"
            :param="{tag:1,hospitalid:info.hospitalid}"
            @change="BasicInfo()"
            placeholder="请选发布人"
            :filter="['name']"
            label="name"
            val="userid"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <mk-select
            style="width:160px;"
            v-model="form.exeuserid"
            url="/Publics/Common/UserInfo"
            :param="{tag:1,hospitalid:info.hospitalid}"
            @change="BasicInfo()"
            placeholder="请选实际执行人"
            :filter="['name']"
            label="name"
            val="userid"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <mk-select
            v-model="form.status"
            url="1"
            :globalFn="true"
            :param="{ codetype: '健康方案实施状态' }"
            :filter="['bzname','filterstr']"
            width="160px"
            label="bzname"
            val="bzcode"
            placeholder="请选择实施状态"
            @change="BasicInfo"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <el-input
            style="width:300px;"
            clearable
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
    <el-table
      border
      stripe
      :data="memberTableData"
      @row-click="memberRowClick"
      highlight-current-row
      height="100%"
    >
      <el-table-column label="会员卡号" sortable show-overflow-tooltip prop="cardno" width="120" />
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
      <el-table-column
        align="center"
        label="等级"
        prop="memberlevel_display"
        width="80"
        sortable
        :sort-method="rowSort"
      >
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
      <el-table-column align="center" label="会员手机" sortable prop="mobiletel" :formatter="(i=>{return PhoneFormat(i,'mobiletel')})" ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        sortable
        label="健康管理方案"
        prop="programename"
      />
      <el-table-column
        show-overflow-tooltip
        align="center"
        sortable
        label="发布人"
        prop="releaseusername"
      />
      <el-table-column
        show-overflow-tooltip
        align="center"
        sortable
        label="实施内容"
        prop="followupname"
      />
      <el-table-column show-overflow-tooltip align="center" sortable label="计划日期" prop="plantime" />
      <el-table-column
        show-overflow-tooltip
        align="center"
        sortable
        label="计划执行人"
        prop="planusername"
      />
      <el-table-column
        show-overflow-tooltip
        align="center"
        sortable
        label="实际执行人"
        prop="exeusername"
      />
      <el-table-column show-overflow-tooltip align="center" sortable label="状态">
        <template slot-scope="scope">
          <el-tag
            :type="GetEvaluateDisplay(scope.row.status)"
            disable-transitions
          >{{ scope.row.statusdisplay }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" sortable label="备注" prop="remark" />
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <div class="tableBtn">
            <el-link
              :title="scope.row.status == 4 ? '已完成' : '随访表单填写'"
              :underline="false"
              :type="scope.row.status == 4 ? 'success' : 'primary'"
              @click="handleFollowupVisitForm(scope.row)"
            >
              <i :class="[scope.row.status == 4 ? 'el-icon-success' : 'mkfont bianji1']" />
            </el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <mk-page :pager="form" @query="BasicInfo" />
    </template>
    <vxe-modal
      v-model="followupModal"
      ref="followupModal"
      resize
      fullscreen
      width="960"
      height="720"
    >
      <div slot="title">
        {{userdata.status == 4 ? '随访表单查看' : '随访表单填写'}} - [
        <span
          style="color:red"
        >会员卡号:{{userdata.cardno}} 会员等级:{{userdata.memberlevel_display}} 会员姓名: {{userdata.membername}} 会员性别:{{userdata.sex == 2 ? '女' : '男'}}</span>
        ]
      </div>
      <el-container>
        <el-main>
          <mk-tabs-crf ref="tabscrf" :edit="userdata.status != 4" @change="tabsrfChange"></mk-tabs-crf>
        </el-main>
        <el-footer style="justify-content: center;border-top:1px solid #ccc !important;">
          <el-button
            v-if="userdata.status != 4"
            :type="crfFormBtnStatus != 0 ? 'warning' : 'success'"
            @click="finish(crfFormBtnStatus)"
          >{{crfFormBtnStatus != 0 ? '关闭' : '完成'}}</el-button>
        </el-footer>
      </el-container>
    </vxe-modal>
  </d2-container>
</template>

<script>
export default {
  name: "healthExecute",
  data() {
    return {
      userdata: {},
      followupModal: false,
      form: {
        createuserid: "", //当前登录账户ID
        plantimeBegin: "", //问卷开始时间
        plantimeEnd: "", //问卷结束时间
        memberlevel: [], //会员等级ID 传一个数组;[1000002,1000003,1000004]
        status: "", //问卷状态 0：未评 1：已评 2：未发布方案 3：已发布方案
        planuserid: "", //计划人id
        exeuserid: "", //执行人id
        releaseuserid: "", //发布人id
        mycustomer: "", //1:表是我的客户; 0:不限制;
        condition: "",
        page: 1,
        rows: 20,
        tag: 0,
        hospitalid: "",
        count: 0
      },
      memberTableData: [],
      daterange: [],
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
      jsonData: {
        formtype: "",
        userid: "",
        crfname: "",
        crfid: "",
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
          customClass: ""
        },
        key: new Date().getTime()
      },
      crfFormBtnStatus: ""
    };
  },
  created() {
    this.form.createuserid = this.info.userid;
    this.form.hospitalid = this.info.hospitalid;
    this.BasicInfo();
  },
  methods: {
    handleFollowupVisitForm(row) {
      this.userdata = row;
      this.followupModal = true;
      this.$refs.followupModal.maximize();
      this.$refs.tabscrf
        .CRFillJsonBysubclassid_Get({
          collectionid: row.collectionid,
          memberid: row.memberid,
          subclassid: row.subclassid
        })
        .then(res => {
          this.crfFormBtnStatus = res.code;
        });
    },
    // 表格行排序
    rowSort(a, b) {
      // console.log(a,b)
      let sort1 = a.memberlevel;
      let sort2 = b.memberlevel;
      return sort1 - sort2;
    },
    memberRowClick(row) {
      console.log(row);
    },
    tabsrfChange(tab) {
      console.log(tab);
    },
    BasicInfo() {
      this.MK.Request(
        "/Hcrm/ProgramPlanExecute/ProgramPlanExeList_Get",
        "get",
        this.form
      ).then(res => {
        if (res.code == 0) {
          this.memberTableData = res.data;
          this.form.count = res.count;
        }
      });
    },
    //时间范围更改事件
    dateRangeChange(val) {
      if (val == null) {
        this.form.plantimeBegin = "";
        this.form.plantimeEnd = "";
      } else {
        this.form.plantimeBegin = val[0];
        this.form.plantimeEnd = val[1];
      }
    },
    finish(status) {
      if (status != 0) {
        this.crfSave();
      } else {
        this.followupModal = false;
      }
    },
    //表单保存
    crfSave() {
      this.$refs.tabscrf.getData(this.userdata.collectionid).then(res => {
        if (res) {
          //表单提交保存
          this.$refs.tabscrf.saveData(res).then(async data => {
            let result = await this.ProgramPlan_Post("Z");
          });
        }
      });
    },
    async ProgramPlan_Post(operatetype) {
      let data = {};
      data.serialnumber = this.userdata.serialnumber;
      data.collectionid = this.userdata.collectionid;
      data.exeuserid = this.userdata.exeuserid;
      data.followupname = this.userdata.followupname;
      data.memberid = this.userdata.memberid;
      data.memberprogramid = this.userdata.memberprogramid;
      data.subclassid = this.userdata.subclassid;
      data.subclassname = this.userdata.subclassname;
      data.plantime = this.userdata.plantime;
      data.planuserid = this.userdata.planuserid;
      data.releaseuserid = this.userdata.releaseuserid;
      data.remark = this.userdata.remark;
      data.status = this.userdata.status;
      data.operatetype = operatetype;
      return this.MK.Request(
        "/Hcrm/ProgramPlanExecute/ProgramPlan_Post",
        "post",
        data
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.BasicInfo();
          this.followupModal = false;
        }
      });
    }
  }
};
</script>
