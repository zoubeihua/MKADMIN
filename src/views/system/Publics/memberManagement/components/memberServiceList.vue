<template>
  <!-- 根据会员获取问卷评估信息组件 -->
  <el-container>
    <el-table
      height="100%"
      :data="memberTableData"
      stripe
      highlight-current-row
      border
      @sort-change="changeTableSort"
      @current-change="handleCurrentChange"
      :row-class-name="getTabelClass"
    >
      <el-table-column
        label="会员卡号"
        show-overflow-tooltip
        prop="cardno"
        width="140"
        sortable
        fixed="left"
      ></el-table-column>
      <el-table-column label="会员姓名" align="center" prop="membername" width="140" fixed="left" sortable>
        <template slot-scope="scope">
          <div>
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.sex_dispalay"
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
      <el-table-column sortable align="center" label="年龄" width="100" prop="age" fixed="left"/>

      <el-table-column align="center" label="等级" width="80" fixed="left" sortable :sort-method="rowSort">
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
      <el-table-column align="center" label="会员手机" prop="mobiletel" width="140" fixed="left" sortable :formatter="(i=>{return PhoneFormat(i,'mobiletel')})"/>
      <el-table-column align="center" sortable label="权益内" prop="inrights" width="90">
        <template slot-scope="scope">
          <span
            class="mkfont ServiceRenzheng"
            :title="scope.row.inrights==1? '权益内' : '权益外'"
            :style="{color: scope.row.inrights==1? 'red' : '', fontSize: 24 + 'px'}"
          ></span>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        sortable
        label="申请权益"
        prop="rightsname"
        show-overflow-tooltip
        width="300"
      />
      <el-table-column align="center" sortable label="申请时间" prop="reqdate" width="140" />
      <el-table-column align="center" sortable label="计划人" prop="planuser_display" width="100" />
      <el-table-column align="center" sortable label="计划时间" prop="plandate" width="140" />
      <el-table-column align="center" sortable label="执行人" prop="executeuser_display" width="100" />
      <el-table-column align="center" sortable label="执行时间" prop="executetime" width="140" />
      <el-table-column align="center" sortable label="入账人" prop="credituser_display" width="100" />
      <el-table-column align="center" sortable label="入账时间" prop="credittime" width="140" />
      <el-table-column align="center" sortable label="满意度" prop="satisfactionscore" width="90"></el-table-column>
      <el-table-column align="center" label="满意度评价" prop="satisfactionnote" min-width="100" />
      <el-table-column align="center" sortable prop="status" label="状态" width="100" fixed="right">
        <template slot-scope="scope">
          <el-tag
            :type="GetApplyStatusType(scope.row.status)"
            disable-transitions
            size="mini"
          >{{ scope.row.status_display }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-link type="primary" :underline="false">操作</el-link>
        </template>
        <template slot-scope="scope">
          <div class="tableBtn">
            <el-link
              title="停用"
              :underline="false"
              type="danger"
              icon="mkfont tingyong_line"
              @click="ServerReqCancel(scope)"
              :disabled="isoperation||(scope.row.status===0?false:true)"
            />
            <el-link
              title="安排计划"
              :underline="false"
              type="warning"
              icon="mkfont jihua"
              @click="handleScheduleModel(scope.row)"
              :disabled="isoperation||(scope.row.status===1||scope.row.status===0?false:true||isoperation)"
            />
            <el-link
              title="执行计划"
              :underline="false"
              type="primary"
              icon="mkfont yaopin-zhihang"
              @click="handleExecutePlan(scope.row)"
              :disabled="isoperation||(scope.row.status===2||scope.row.status===1?false:true||isoperation)"
            />
            <el-link
              style="font-size:28px !important;"
              title="登记入账"
              :underline="false"
              type="success"
              icon="mkfont jiaofei"
              @click="handleMemberCost(scope.row)"
              :disabled="isoperation||(scope.row.status===3||scope.row.status===2?false:true||isoperation)"
            />
            <el-link
              title="查看"
              :underline="false"
              type="warning"
              icon="el-icon-view"
              @click="handleServeLookModel(scope.row)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-footer>
      <mk-page :pager="memberPager" @query="memberRefresh" />
    </el-footer>
    <!-- 服务安排 -->
    <vxe-modal
      v-model="ScheduleModel"
      :showFooter="true"
      @close="CloseScheduleModel"
      width="95vw"
      height="95vh"
    >
      <div slot="title" style="display:flex;align-items:center;">
        <span>服务安排</span>
        -[
        <span
          style="color:red;"
        >会员等级 ： {{userItem.memberlevel_display}} 会员卡号：{{userItem.memberno}} 会员姓名：{{userItem.membername}} 会员性别：{{userItem.sex_dispalay}} 会员年龄：{{userItem.age}}</span> ]
      </div>
      <userinfo :userItem="userItem"></userinfo>
      <el-divider></el-divider>
      <el-form
        :model="scheduleFrom.planFrom"
        :rules="scheduleFromRule"
        ref="splanFrom"
        label-width="80px"
      >
        <el-form-item label="计划人" prop="planuser">
          <el-select v-model="scheduleFrom.planFrom.planuser" placeholder="请选择计划人">
            <el-option
              v-for="item in customManagerList"
              :key="item.userid"
              :label="item.name"
              :value="item.userid"
              :disabled="userItem.status==1?true:false"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划时间" prop="plandate">
          <el-date-picker
            v-model="scheduleFrom.planFrom.plandate"
            editable
            type="datetime"
            clearable
            placeholder="选择日期时间"
            :disabled="userItem.status==1?true:false"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="addOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            resize="none"
            :rows="2"
            v-model="scheduleFrom.planFrom.plannote"
            placeholder="描述"
            :disabled="userItem.status==1?true:false"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form
        :model="scheduleFrom.changeFrom"
        :rules="sChangeRules"
        ref="schangeFrom"
        label-width="80px"
      >
        <template v-if="changePlanModel">
          <el-divider></el-divider>
          <el-form-item label="变更人" prop="planuser">
            <el-select v-model="scheduleFrom.changeFrom.planuser" placeholder="请选择变更人">
              <el-option
                v-for="item in customManagerList"
                :key="item.userid"
                :label="item.name"
                :value="item.userid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="变更时间" prop="plandate">
            <el-date-picker
              v-model="scheduleFrom.changeFrom.plandate"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              clearable
              placeholder="选择日期时间"
              editable
              :picker-options="addOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="变更备注">
            <el-input
              type="textarea"
              resize="none"
              :rows="2"
              v-model="scheduleFrom.changeFrom.plannote"
              placeholder="描述"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" style="text-align:center;">
        <el-row :gutter="20">
          <el-button v-if="changePlanModel" type="primary" @click="submitScheduleForm">提交</el-button>
          <el-button
            v-if="!changePlanModel"
            type="primary"
            @click="submitScheduleForm"
            :disabled="userItem.status==1?true:false"
          >提交</el-button>
          <el-button
            @click="changePlan"
            v-if="scheduleFrom.isShow"
            type="warning"
          >{{changePlanModel?'取消变更':'变更'}}</el-button>
          <el-button type="danger" @click="ServerPlanCancel">撤销服务</el-button>

          <el-button @click="CloseScheduleModel">取消</el-button>
        </el-row>
      </div>
    </vxe-modal>
    <!-- 服务查看 -->
    <vxe-modal v-model="serveLookModal" @close="colseServeLookModel" width="1000" height="800">
      <div slot="title" style="display:flex;align-items:center;">
        <span>服务查看</span>-[
        <span
          style="color:red;"
        >会员等级 ： {{userItem.memberlevel_display}} 会员卡号：{{userItem.memberno}} 会员姓名：{{userItem.membername}} 会员性别：{{userItem.sex_dispalay}} 会员年龄：{{userItem.age}}</span> ]
      </div>
      <userinfo :userItem="userItem"></userinfo>
      <el-divider></el-divider>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in serveLookList"
          :key="index"
          placement="top"
          :timestamp="(activity.operationtype_display)+'['+(activity.operationtime)+']'"
        >
          <el-card>
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
    </vxe-modal>
    <!-- 执行计划 -->
    <vxe-modal
      v-model="executeModel"
      :showFooter="true"
      @close="CloseExecuteModel"
      width="95vw"
      height="95vh"
    >
      <div slot="title" style="display:flex;align-items:center;">
        <span>执行计划</span>
        -[
        <span
          style="color:red;"
        >会员等级 ： {{userItem.memberlevel_display}} 会员卡号：{{userItem.memberno}} 会员姓名：{{userItem.membername}} 会员性别：{{userItem.sex_dispalay}} 会员年龄：{{userItem.age}}</span> ]
      </div>

      <userinfo :userItem="userItem"></userinfo>
      <el-divider></el-divider>
      <el-form
        :model="executeFrom.planFrom"
        :rules="executeFromRule"
        ref="executeFrom"
        label-width="80px"
      >
        <el-form-item label="执行人" prop="executeuser">
          <el-select v-model="executeFrom.planFrom.executeuser" placeholder="请选择执行人">
            <el-option
              v-for="item in customManagerList"
              :key="item.userid"
              :label="item.name"
              :value="item.userid"
              :disabled="userItem.status==1?false:true"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="执行时间" prop="executetime">
          <el-date-picker
            v-model="executeFrom.planFrom.executetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            clearable
            editable
            placeholder="选择日期时间"
            :disabled="userItem.status==1?false:true"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item label="备注">
          <el-input
            type="textarea"
            resize="none"
            :rows="2"
            v-model="executeFrom.planFrom.executenote"
            placeholder="描述"
            :disabled="userItem.status==1?false:true"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center;">
        <el-row :gutter="20">
          <el-button type="primary" @click="ServerExec" :disabled="userItem.status==1?false:true">提交</el-button>
          <el-button
            type="warning"
            @click="changeExecute"
            v-if="executeFrom.isShow"
            :disabled="userItem.status==1?true:false"
          >取消执行</el-button>
          <el-button @click="CloseExecuteModel">取消</el-button>
        </el-row>
      </div>
    </vxe-modal>
    <!-- 登记入账-->
    <vxe-modal
      v-model="CostModel"
      :showFooter="true"
      @close="closeMemberCost"
      width="95vw"
      height="95vh"
    >
      <div slot="title" style="display:flex;align-items:center;">
        <span>登记入账</span>
        -[
        <span
          style="color:red;"
        >会员等级 ： {{userItem.memberlevel_display}} 会员卡号：{{userItem.memberno}} 会员姓名：{{userItem.membername}} 会员性别：{{userItem.sex_dispalay}} 会员年龄：{{userItem.age}}</span> ]
      </div>
      <userinfo :userItem="userItem"></userinfo>
      <el-divider></el-divider>
      <el-form :inline="true" label-width="70px">
        <el-form-item label="单价">
          <el-input placeholder="请输入内容" :value="projectAmounts(CostFrom.price)" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input placeholder="请输入内容" :value="userItem.reqcount" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="应付款" prop="creditfree">
          <el-input
            placeholder="请输入内容"
            :value="projectAmounts(CostFrom.price*userItem.reqcount)"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="CostFrom" :rules="CostFromRule" ref="CostFrom" label-width="70px">
        <el-form-item label="实收款" prop="receivablefree">
          <el-input
            v-model="CostFrom.receivablefree"
            type="number"
            placeholder="请输入实收款"
            :disabled="userItem.status==3?true:false"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            type="textarea"
            resize="none"
            :rows="2"
            v-model="CostFrom.creditnote"
            placeholder="描述"
            :disabled="userItem.status==3?true:false"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center;">
        <el-row :gutter="20">
          <el-button
            type="primary"
            @click="submitCostForm"
            :disabled="userItem.status==3?true:false"
          >提交</el-button>
          <el-button
            type="warning"
            @click="CreditCancelMsg"
            :disabled="userItem.status==2?true:false"
          >取消入账</el-button>
          <el-button @click="closeMemberCost">取消</el-button>
        </el-row>
      </div>
    </vxe-modal>
  </el-container>
</template>
<script>
import util from "@/libs/util.js";
import dayjs from "dayjs";
import userinfo from "@/views/HCRM/healthManagement/components/UserInfo";
export default {
  name: "MemberServiceList",
  components: {
    userinfo
  },
  props: {
    userData: {
      type: Object,
      default: () => {}
    },
    siftData:{
      type: Object,
      default: () => {}
    },
    isoperation:{
        type:Boolean,
        default:false
    }
  },
  data() {
    return {
      orderby:"",
      //主列表
      memberTableData: [],
      userItem: {},
      //安排计划From
      scheduleFrom: {
        //是否显示变更按钮
        isShow: "",
        planFrom: {
          operatetype: "",
          reqid: undefined,
          memberid: undefined,
          planuser: undefined,
          plandate: "",
          plannote: ""
        },
        changeFrom: {
          operatetype: "",
          reqid: undefined,
          memberid: undefined,
          planuser: undefined,
          plandate: "",
          plannote: ""
        }
      },
      //执行计划
      executeFrom: {
        //是否显示变更按钮
        isShow: "",
        planFrom: {
          reqid: undefined,
          memberid: undefined,
          executeuser: undefined,
          executetime: "",
          executenote: ""
        },
        changeFrom: {
          reqid: undefined,
          memberid: "",
          note: ""
        }
      },
      executeFromRule: {
        executeuser: [
          { required: true, message: "请选择执行人员", trigger: "change" }
        ],
        executetime: [
          { required: "date", message: "请选择时间", trigger: "change" }
        ]
      },
      CostFromRule: {
        creditcount: [
          { required: true, message: "请选择规格", trigger: "blur" }
        ],
        receivablefree: [
          { required: true, message: "请选择实收款", trigger: "blur" }
        ],
        credittime: [
          { required: "date", message: "请选择时间", trigger: "change" }
        ]
      },
      //CostFrom
      CostFrom: {
        reqid: undefined,
        memberid: undefined,
        credituser: undefined,
        credittime: "",
        creditcount: 1,
        receivablefree: 0,
        creditfree: 0,
        creditnote: "",
        price: 0
      },
      ScheduleModel: false,
      serveLookModal: false,
      serviceRegModal: false,
      executeModel: false,
      CostModel: false,
      servicePlanModal: false,
      serveLookList: [],
      memberPager: {
        rows: 20,
        page: 1,
        count: 0,
        tag: 0
      },

      scheduleFromRule: {
        planuser: [
          { required: true, message: "请选择计划人", trigger: "change" }
        ],
        plandate: [
          { required: "date", message: "请选择时间", trigger: "change" }
        ]
      },
      addOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().setHours(0, 0, 0, 0);
        }
      },
      sChangeRules: {
        planuser: [
          { required: true, message: "请选择计划人", trigger: "change" }
        ],
        plandate: [
          { required: "date", message: "请选择时间", trigger: "change" }
        ]
      },
      //变更状态
      changePlanModel: false,
      //工作人员
      customManagerList: [],
      createuserid: util.cookies.get("uuid") //当前登陆用户
    };
  },
  mounted() {
    this.Member_AccountManager_Get();
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
  methods: {
    // 表格行排序
    rowSort(a,b) {
      let sort1 = a.memberlevel
      let sort2 = b.memberlevel
      return sort1 - sort2
    },
    //查询客户经理-责任人
    Member_AccountManager_Get() {
      this.MK.Request("Publics/Common/UserInfo", "get", {
        tag: 1
      }).then(res => {
        this.customManagerList = res.data;
      });
    },
    //查询客户列表
    ServerReq_Get() {
      this.MK.Request("Hcrm/MemberService/ServerReq", "get", {
        ...this.orderby,
        ...this.siftData,
        ...this.memberPager
      }).then(res => {
        let result = JSON.stringify(res.data);
        result = result.replace(/1970-01-01 00:00/g, "");
        this.memberTableData = JSON.parse(result);
        this.memberPager.count = res.count;
      });
    },
    //表格排序
    changeTableSort(column) {
      console.log(column)
      if(column.order){
        this.orderby =
        column.prop + " " + column.order.replace(/ending/g, "");
      }else{
         this.orderby =""
      }
      
      this.ServerReq_Get();
    },
    handleCurrentChange(val) {
      if (!!val) {
        this.tabelRowId = val.reqid;
      }
    },
    //当目前行id==刷新前id  就高亮表示
    getTabelClass({ row, rowIndex }) {
      if (row.reqid == this.tabelRowId) {
        return "current-row";
      } else {
        return "";
      }
    },
    //取消申请
    ServerReqCancel(scope) {
      this.$prompt("请输入取消原因", "取消服务申请", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "不可为空"
      })
        .then(({ value }) => {
          let data = {
            note: value,
            memberid: scope.row.memberid,
            reqid: scope.row.reqid
          };
          this.ServerReqCancel_post(data, scope.$index);
        })
        .catch(() => {
          //取消按钮
        });
    },
    ServerReqCancel_post(data, index) {
      this.MK.Request("Hcrm/MemberService/ServerReqCancel", "post", data).then(
        res => {
          if (res.code == 0) {
            this.memberTableData[index].status = 9;
            this.memberTableData[index].status_dispaly = "申请取消";

            this.$message({
              type: "success",
              message: res.msg
            });
          }
        }
      );
    },
    //安排计划
    handleScheduleModel(row) {
      this.userItem = row;
      this.scheduleFrom.isShow = !!row.plandate ? true : false;
      this.scheduleFrom.planFrom = {
        reqid: row.reqid,
        memberid: row.memberid,
        planuser:
          row.planuser == 0 ? parseInt(this.createuserid) : row.planuser,
        plandate: row.plandate,
        plannote: row.plannote
      };
      if (row.status == 0) {
        this.scheduleFrom.planFrom.plandate = row.reqclaimdate;
      }
      this.ScheduleModel = true;
    },
    handleServeLookModel(row) {
      this.userItem = row;
      this.MK.Request("Hcrm/MemberService/ServerReqDetail", "get", {
        reqid: row.reqid,
        tag: 1
      }).then(res => {
        if (res.code == 0) {
          this.serveLookList = res.data;
          this.serveLookModal = true;
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    colseServeLookModel() {
      this.serveLookList = [];
      this.serveLookModal = false;
    },
    CloseScheduleModel() {
      this.ScheduleModel = false;
      this.changePlanModel = false;
      this.$refs.splanFrom.resetFields();
      this.$refs.schangeFrom.resetFields();
    },
    changePlan() {
      this.changePlanModel = !this.changePlanModel;
      if (!this.changePlanModel) {
        this.scheduleFrom.changeFrom = {
          operatetype: "",
          reqid: undefined,
          memberid: undefined,
          planuser: undefined,
          plandate: "",
          plannote: ""
        };
      }
    },
    //提交安排计划
    submitScheduleForm() {
      if (this.changePlanModel) {
        this.$refs.schangeFrom.validate(valid => {
          if (valid) {
            this.ServerPlanChange_post();
          } else {
            return false;
          }
        });
      } else {
        this.$refs.splanFrom.validate(valid => {
          if (valid) {
            this.ServerPlan_post();
          } else {
            return false;
          }
        });
      }
    },
    ServerPlanChange_post() {
      let data = this.scheduleFrom.changeFrom;
      data.memberid = this.userItem.memberid;
      data.reqid = this.userItem.reqid;
      this.MK.Request("Hcrm/MemberService/ServerPlanChange", "post", data).then(
        res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.msg
            });
            this.CloseScheduleModel();
            this.ServerReq_Get();
          }
        }
      );
    },
    ServerPlan_post() {
      let data = this.scheduleFrom.planFrom;
      data.memberid = this.userItem.memberid;
      data.reqid = this.userItem.reqid;
      this.MK.Request("Hcrm/MemberService/ServerPlan", "post", data).then(
        res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.msg
            });
            this.CloseScheduleModel();
            this.ServerReq_Get();
          }
        }
      );
    },
    ///Hcrm/MemberService/ServerPlanCancel 撤销服务
    ServerPlanCancel() {
      this.$prompt("请输入取消原因", "撤销服务", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "不可为空"
      })
        .then(({ value }) => {
          let data = {
            note: value,
            memberid: this.userItem.memberid,
            reqid: this.userItem.reqid
          };
          this.ServerPlanCancel_post(data);
        })
        .catch(() => {
          //取消按钮
        });
    },
    ServerPlanCancel_post(data) {
      this.MK.Request("Hcrm/MemberService/ServerPlanCancel", "post", data).then(
        res => {
          if (res.code == 0) {
            this.ServerReq_Get();
            this.CloseScheduleModel();
            this.$message({
              type: "success",
              message: res.msg
            });
          }
        }
      );
    },

    //翻页
    memberRefresh() {
      //查询主列表
      this.ServerReq_Get();
    },
    projectAmounts(num) {
      if (isNaN(parseFloat(num))) {
        return 0.0;
      } else {
        return num
          ? (isNaN(parseFloat(num.toString().replace(/,/g, "")))
              ? 1
              : parseFloat(num.toString().replace(/,/g, ""))
            )
              .toFixed(2)
              .toString()
              .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
                return $1 + ",";
              })
          : "";
      }
    },
    //执行计划
    handleExecutePlan(row) {
      this.userItem = row;
      this.executeFrom.isShow = !!row.plandate ? true : false;
      this.executeFrom.planFrom = {
        reqid: row.reqid,
        memberid: row.memberid,
        executeuser:
          row.executeuser === 0 ? parseInt(this.createuserid) : row.executeuser,
        executetime: row.executetime || "",
        executenote: row.executenote
      };

      this.executeModel = true;
    },
    CloseExecuteModel() {
      this.executeModel = false;
    },
    //执行计划 提交
    ServerExec() {
      this.$refs.executeFrom.validate(valid => {
        if (valid) {
          this.ServerExec_post();
        } else {
          return false;
        }
      });
    },
    ServerExec_post() {
      let data = { ...this.executeFrom.planFrom };
      data.executetime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      this.MK.Request("Hcrm/MemberService/ServerExec", "post", data).then(
        res => {
          if (res.code == 0) {
            this.ServerReq_Get();
            this.$message({
              type: "success",
              message: res.msg
            });
          }
        }
      );
      this.CloseExecuteModel();
    },
    changeExecute() {
      this.$prompt("请输入取消原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "不可为空"
      })
        .then(({ value }) => {
          let data = {
            note: value,
            memberid: this.userItem.memberid,
            reqid: this.userItem.reqid
          };
          this.ServerExecCancel(data);
        })
        .catch(() => {
          //取消按钮
        });
    },
    //取消按钮
    ServerExecCancel(data) {
      this.MK.Request("Hcrm/MemberService/ServerExecCancel", "post", data).then(
        res => {
          if (res.code == 0) {
            this.ServerReq_Get();
            this.$message({
              type: "success",
              message: res.msg
            });
          }
        }
      );
      this.CloseExecuteModel();
    },
    //入账
    handleMemberCost(row) {
      this.userItem = row;
      this.CostFrom = {
        reqid: row.reqid,
        memberid: row.memberid,
        creditcount: row.creditcount,
        receivablefree: row.receivablefree,
        creditfree: row.creditfree || 0,
        creditnote: row.creditnote,
        price: row.price,
        credittime: row.credittime
      };
      this.CostModel = true;
    },
    closeMemberCost(row) {
      this.CostModel = false;
      this.CostFrom = {
        reqid: undefined,
        memberid: undefined,
        credituser: undefined,
        credittime: "",
        creditcount: 1,
        receivablefree: 0,
        creditfree: 0,
        creditnote: "",
        price: 0
      };
    },
    //提交
    submitCostForm() {
      this.$refs.CostFrom.validate(valid => {
        if (valid) {
          this.ServerCredit_Post();
        } else {
          return false;
        }
      });
    },
    ServerCredit_Post() {
      this.CostFrom.memberid = this.userItem.memberid;
      this.CostFrom.reqid = this.userItem.reqid;
      this.CostFrom.creditcount = this.userItem.reqcount;
      this.CostFrom.credituser = util.cookies.get("uuid");
      this.CostFrom.credittime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      let data = {
        ...this.CostFrom
      };
      this.MK.Request("Hcrm/MemberService/ServerCredit", "post", data).then(
        res => {
          if (res.code == 0) {
            this.ServerReq_Get();
            this.$message({
              type: "success",
              message: res.msg
            });
          }
        }
      );
      this.closeMemberCost();
    },
    //取消入账
    CreditCancelMsg() {
      this.$prompt("请输入取消原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "不可为空"
      })
        .then(({ value }) => {
          let data = {
            note: value,
            memberid: this.userItem.memberid,
            reqid: this.userItem.reqid
          };
          this.ServerCreditCancel_post(data);
        })
        .catch(() => {
          //取消按钮
        });
    },
    ServerCreditCancel_post(data) {
      this.MK.Request(
        "Hcrm/MemberService/ServerCreditCancel",
        "post",
        data
      ).then(res => {
        if (res.code == 0) {
          this.ServerReq_Get();
          this.$message({
            type: "success",
            message: res.msg
          });
        }
      });
      this.closeMemberCost();
    },
    
  }
};
</script>
<style  scoped lang="scss">
.d2-layout-header-aside-group .tableBtn i {
  font-size: 24px;
}
>>> .el-tabs__content {
  height: calc(100% - 42px) !important;
}
.underLine {
  text-decoration: underline;
  color: blue;
  font-weight: bold;
  cursor: pointer;
}
>>> .demo-table-expand label {
  width: 90px;
  color: #909399;
  line-height: 40px;
  padding: 9px 12px 0 0;
}
>>> .demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0 !important;
  width: 50%;
}
.mr20 {
  margin-right: 20px !important;
}
.checkPlanBox {
  display: flex;
  justify-content: space-between;
  width: 90%;
}
.checkPlan {
  line-height: 40px;
  .name {
    color: #909399;
    margin-right: 6px;
  }
  div {
    color: #333;
    display: inline-block;
  }
}
.el-card {
  p {
    font-size: 13px;
    .title {
      color: #909399;

      padding-right: 8px;
    }
  }
}
.overflowAuto {
  overflow: auto;
}
.rightsListClass {
  line-height: 1.6;
  margin-top: 10px;
  .count {
    color: red;
  }
}
</style>
