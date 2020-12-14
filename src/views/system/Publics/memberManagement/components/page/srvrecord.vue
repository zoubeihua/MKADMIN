<template>
  <el-container>
    <el-header>
      <el-form :inline="true">
        <el-form-item>
          <!-- 类型 1 计划 2 执行 3 入帐 -->
          <el-select
            v-model="siftData.querytype"
            clearable
            placeholder="请选择节点"
            style="max-width:10em"
            @change="getQuerytype"
          >
            <el-option
              v-for="item in querytypeList"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- 选择工作人员 -->
          <el-select
            v-model="siftData.userid"
            clearable
            :placeholder="gettext(siftData.querytype)"
            style="max-width:10em"
            @change="getUserid"
          >
            <el-option
              v-for="item in customManagerList"
              :key="item.userid"
              :label="item.name"
              :value="item.userid"
              :disabled="siftData.querytype==undefined?true:false"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- 时间区间选择 -->
          <el-date-picker
            v-model="siftData.dataRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            :disabled="siftData.querytype==undefined?true:false"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="getDataRange"
          ></el-date-picker>
        </el-form-item>
        <!-- </el-form> -->
        <!-- <el-form :inline="true"> -->

        <el-form-item>
          <!-- 权限列表 -->
          <el-select
            v-model="siftData.rightid"
            clearable
            placeholder="请选择权益"
            style="max-width:20em"
            @change="getRightId"
          >
            <el-option
              v-for="item in rightList"
              :key="item.itemid"
              :label="item.itemname"
              :value="item.itemid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- 服务状态 -->
          <el-select
            v-model="siftData.status"
            clearable
            placeholder="请选择服务状态"
            style="max-width:10em"
            @change="getStatus"
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
            <el-checkbox
              v-model="siftData.mycustomer"
              @change="ServerReq_Get"
              true-label="1"
              false-label="0"
            >我的客户</el-checkbox>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="ServerReq_Get">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <!--  -->
    <el-main style="padding:0;">
      <SplitPane :min-percent="30" :default-percent="45" split="vertical">
        <!-- 列表 -->
        <template slot="paneL">
          <el-container>
            <el-table
              ref="rightsTabel"
              class="overflowAuto"
              :data="memberTableData"
              height="100%"
              stripe
              border
              highlight-current-row
              @row-click="getRightItem"
              @sort-change="changeTableSort"
              :row-class-name="getTabelClass"
            >
              <el-table-column label="名称" prop="rightsname" sortable min-width="200" />
              <el-table-column label="申请时间" prop="reqdate" sortable width="150"></el-table-column>
              <el-table-column align="center" prop="status" sortable label="状态" width="100">
                <template slot-scope="scope">
                  <el-tag
                    :type="GetApplyStatusType(scope.row.status)"
                    disable-transitions
                    size="mini"
                  >{{ scope.row.status_display }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-footer>
              <mk-page :pager="memberPager" @query="ServerReq_Get" />
            </el-footer>
          </el-container>
        </template>
        <!-- 时间轴 -->
        <template slot="paneR">
          <el-container>
            <el-main style="padding:0 10px;">
              <el-scrollbar style="height:100%;width:100%;">
                <mk-empty v-if="userItem.length==0" style="padding-top:200px;"></mk-empty>
                <template v-else>
                  <userinfo :userItem="userItem"></userinfo>
                  <el-divider></el-divider>
                </template>
                <el-timeline>
                  <el-timeline-item
                    v-for="(activity, index) in serveLookList"
                    :key="index"
                    placement="top"
                    :color="activity.operationtype == 0 ?
                    '#909399' : activity.operationtype == 1 ?
                    '#409eff' : activity.operationtype == 2 ?
                    '#e6a23c' : activity.operationtype == 3 ?
                    '#67c23a' : activity.operationtype == 4 ?
                    '#f56c6c' : activity.operationtype == 5 ?
                    '#67c23a' : activity.operationtype == 6 ?
                    '#f56c6c' : activity.operationtype == 7 ?
                    '#f56c6c' : activity.operationtype == 9 ?
                    '#f56c6c' : '#909399'
                    "

                    :timestamp="(activity.operationtype_display)+'['+(activity.operationtime)+']'"
                  >
                    <el-card shadow="never" style="background-color:#fbfbfb !important;">
                      <p>
                        <span class="title">操作人:</span>
                        <span class="content">{{activity.operationname}}</span>
                      </p>
                      <p>
                        <span class="title">备注:</span>
                        <span class="content">{{activity.operationnote}}</span>
                      </p>
                      <template v-if="activity.operationtype==0">
                        <p>
                          <span class="title">要求日期:</span>
                          <span class="content">{{activity.reqclaimdate}}</span>
                        </p>
                      </template>
                      <template v-if="activity.operationtype==1">
                        <p>
                          <span class="title">计划执行日期:</span>
                          <span class="content">{{activity.plandate}}</span>
                        </p>
                        <p>
                          <span class="title">计划执行人:</span>
                          <span class="content">{{activity.planuser_display}}</span>
                        </p>
                      </template>
                      <template v-if="activity.operationtype==2">
                        <p>
                          <span class="title">计划变更日期:</span>
                          <span class="content">{{activity.plandate}}</span>
                        </p>
                        <p>
                          <span class="title">计划变更人:</span>
                          <span class="content">{{activity.planuser_display}}</span>
                        </p>
                      </template>
                      <template v-if="activity.operationtype==3">
                        <p>
                          <span class="title">实际执行人:</span>
                          <span class="content">{{activity.executeuser_display}}</span>
                        </p>
                        <p>
                          <span class="title">实际执行时间:</span>
                          <span class="content">{{activity.executetime}}</span>
                        </p>
                      </template>
                      <template v-if="activity.operationtype==5">
                        <p>
                          <span class="title">入账金额:</span>
                          <span class="content" v-html="projectAmounts(activity.receivablefree)"></span>
                        </p>
                      </template>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </el-scrollbar>
            </el-main>
          </el-container>
        </template>
      </SplitPane>
    </el-main>
  </el-container>
</template>

<script>
import MemberServiceList from "../memberServiceList";
import util from "@/libs/util.js";
import userinfo from "@/views/HCRM/healthManagement/components/UserInfo";
export default {
  components: {
    MemberServiceList,
    userinfo
  },
  props: {
    userData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      ManagerItem: this.userData,
      userItem: [],
      rightChangeList: [],
      memberTableData: [],
      serveLookList: [],
      //筛选数据
      siftData: {
        createuserid: util.cookies.get("uuid"), //当前登陆用户
        querytype: undefined, //时间范围类别 1 计划 2 执行 3 入帐
        status: -1, //状态 传-1 为不根据状态查询 ,否则根据状态来查询 0：申请 1：安排计划 2：执行完成 3：入帐完成 9：申请取消 99：确认取消
        condition: "", //查询条件
        dataRange: "", //时间范围
        executor: "", //执行人
        erentrer: "", //入账人
        rightid: undefined, //权益id
        mycustomer: 0, // 我的客户 1:表是我的客户; 0:不限制;
        orderby: "", //排序方式 例如:deptid asc,memberid desc
        userid: undefined,
        date_begin: "",
        date_end: "",
        levelidarr: undefined, //会员等级
        memberid: this.userData.memberid || undefined
      },
      rightTabel: [],
      querytypeList: [
        { value: 1, text: "计划" },
        { value: 2, text: "执行" },
        { value: 3, text: "入帐" }
      ],
      statusList: [
        { value: -1, text: "全部状态" },
        { value: 0, text: "申请" },
        { value: 1, text: "安排计划" },
        { value: 2, text: "执行完成" },
        { value: 3, text: "入帐完成" },
        { value: 9, text: "申请取消" },
        { value: 99, text: "确认取消" }
      ],
      memberPager: {
        rows: 20,
        page: 1,
        count: 0,
        tag: 0
      },
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
      //工作人员
      customManagerList: [],
      tabelRowId: "", //当前选中的id
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
      rightList: {},
      servicePlanModal: false,
      addOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().setHours(0, 0, 0, 0);
        }
      }
    };
  },
  created() {
    this.ServerReq_Get();
    this.Member_AccountManager_Get();
    this.ItemInfo_Get();
  },
  methods: {
    //表格排序
    changeTableSort(column) {
      this.siftData.orderby =
        column.prop + " " + column.order.replace(/ending/g, "");
      this.ServerReq_Get();
    },
    toggleRightSelection(row, count) {
      if (count > 0) {
        this.$refs.rightsTabel.toggleRowSelection(row, true);
      } else {
        this.$refs.rightsTabel.toggleRowSelection(row, false);
      }
    },
    getQuerytype(value) {
      if (!value) {
        this.siftData.userid = undefined;
        this.siftData.dataRange = "";
        this.siftData.querytype = undefined;
      }
      this.ServerReq_Get();
    },
    //查询客户列表
    ServerReq_Get() {
      this.MK.Request("Hcrm/MemberService/ServerReq", "get", {
        ...this.siftData,
        ...this.memberPager
      }).then(res => {
        if (res.count > 0) {
          this.getRightItem(res.data[0]);
          let result = JSON.stringify(res.data);
          result = result.replace(/1970-01-01 00:00/g, "");
          this.memberTableData = JSON.parse(result);
        }

        this.memberPager.count = res.count;
      });
    },
    //
    gettext(id) {
      if (id == undefined) {
        return "请选择上个节点";
      } else if (id == 1) {
        return "请选择计划人";
      } else if (id == 2) {
        return "请选择执行人";
      } else if (id == 3) {
        return "请选择入账人";
      }
    },
    getUserid(value) {
      if (!value) {
        this.siftData.userid = undefined;
      }
      this.ServerReq_Get();
    },
    //查询客户经理-责任人
    Member_AccountManager_Get() {
      this.MK.Request("Publics/Common/UserInfo", "get", {
        tag: 1
      }).then(res => {
        this.customManagerList = res.data;
      });
    },
    getDataRange(value) {
      if (!value) {
        this.siftData.date_begin = "";
        this.siftData.date_end = "";
      } else {
        this.siftData.date_begin = value[0];
        this.siftData.date_end = value[1];
      }
      this.memberPager.page = 1;
      this.ServerReq_Get();
    },
    getStatus(value) {
      value += "";
      if (!value) {
        this.siftData.status = -1;
      }
      this.memberPager.page = 1;
      this.ServerReq_Get();
    },
    getRightId(value) {
      if (!value) {
        this.siftData.rightid = undefined;
      }
      this.memberPager.page = 1;
      this.ServerReq_Get();
    },
    ItemInfo_Get() {
      this.MK.Request("Publics/ItemManage/ItemInfo", "get", {
        itemtype: 26,
        tag: 1
      }).then(res => {
        this.rightList = res.data;
      });
    },
    getlevelidarr(value) {
      if (!value) {
        this.siftData.levelidarr = undefined;
      }
      this.ServerReq_Get();
    },
    getRightItem(row) {
      this.serveLookList = [];
      this.tabelRowId = row.reqid;
      this.userItem = row;
      this.MK.Request("Hcrm/MemberService/ServerReqDetail", "get", {
        reqid: row.reqid,
        tag: 1
      }).then(res => {
        if (res.code == 0) {
          this.serveLookList = res.data;
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    //当目前行id==刷新前id  就高亮表示
    getTabelClass({ row, rowIndex }) {
      if (row.reqid == this.tabelRowId) {
        return "current-row";
      } else {
        return "";
      }
    }
  }
};
</script>
<style  scoped lang="scss">
.el-header {
  border-bottom: 1px solid #cfd7e5 !important;
}
.el-header .el-form-item {
  margin-bottom: 10px !important;
}
.overflowAuto {
  overflow-y: auto;
}
.el-card {
  p {
    font-size: 13px;
    display: flex;
    .title {
      color: #909399;

      padding-right: 8px;
    }
  }
}
</style>
