<template>
  <d2-container>
    <template slot="header">
      <div style="width:100%">
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
                :disabled="siftData.querytype == undefined ? true : false"
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
              :disabled="siftData.querytype == undefined ? true : false"
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
            <!-- 会员等级 -->
            <el-select
              v-model="siftData.levelidarr"
              clearable
              multiple
              collapse-tags
              placeholder="请选择会员等级"
              @change="getlevelidarr"
            >
              <el-option
                v-for="item in MemberlevelList"
                :key="item.levelid"
                :label="item.name"
                :value="item.levelid"
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
          <el-form-item>
            <el-input
              style="width:280px"
              v-model="siftData.condition"
              placeholder="按会员手机号、卡号、姓名查询"
              @keyup.enter.native="ServerReq_Get"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="siftData.mycustomer"
              @change="ServerReq_Get"
              true-label="1"
              false-label="0"
              >我的客户</el-checkbox
            >
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="ServerReq_Get"
                >查询</el-button
              >
              <el-button type="warning" icon="el-icon-refresh" @click="init"
                >清空</el-button
              >
              <el-button
                icon="el-icon-circle-plus-outline"
                type="primary"
                @click="handleAddServicePlan"
                >新增</el-button
              >
            </el-button-group>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <el-container>
      <MemberServiceList ref="membeiGet" :siftData="siftData"/>
    </el-container>

    <!-- 添加计划 -->
    <vxe-modal
      v-model="servicePlanModal"
      :showFooter="true"
      title="添加服务计划"
      width="95vw"
      height="95vh"
      @close="colseModel"
    >
      <SplitPane :min-percent="20" :default-percent="30" split="vertical">
        <template slot="paneL">
          <el-container>
            <el-form
              :model="addPlanFrom"
              ref="addPlanFrom"
              :rules="servicePlanRule"
              label-width="auto"
              style="width:100%;height:calc(95vh - 130px);overflow-y: auto;"
            >
              <el-form-item label="识别码">
                <mk-member-select
                  @change="getManagerItem"
                  url="Publics/MemberManage/BasicInfo"
                  :RequestData="{
                    mycustomer: 0,
                    expirationdaysmemberfee: 0,
                    tag: 0,
                    page: 1,
                    rows: 20
                  }"
                />
              </el-form-item>
              <el-form-item label="姓名">
                <div>
                  <i
                    :class="[
                      'mkfont',
                      ManagerItem.sex == 1
                        ? 'nan'
                        : ManagerItem.sex == 2
                        ? 'nv'
                        : 'weizhi'
                    ]"
                    :style="{
                      color:
                        ManagerItem.sex == 1
                          ? '#6DCEFA'
                          : ManagerItem.sex == 2
                          ? '#F37E7D'
                          : ''
                    }"
                  ></i>
                  <span style="min-width:60px;display:inline-block;">{{
                    ManagerItem.membername || "请选择会员"
                  }}</span>
                </div>
              </el-form-item>
              <el-form-item label="等级">{{
                ManagerItem.memberlevel_display || "请选择会员"
              }}</el-form-item>
              <el-form-item label="年龄">{{
                ManagerItem.age || "请选择会员"
              }}</el-form-item>
              <el-form-item label="手机号码">{{
                ManagerItem.mobiletel || "请选择会员"
              }}</el-form-item>
              <el-form-item label="服务申请">
                <div>
                  <div
                    v-for="(item, index) in rightChangeList"
                    :key="item.rightsid"
                    class="rightsListClass"
                  >
                    {{ index + 1 + "、" + item.rightsname }}
                    <span class="count">{{ "数量：" + item.count }}</span>
                  </div>
                  <div v-if="rightChangeList.length == 0">请选择服务</div>
                </div>
              </el-form-item>
              <el-form-item label="计划时间" prop="reqclaimdate">
                <el-date-picker
                  v-model="addPlanFrom.reqclaimdate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  size="large"
                  editable
                  type="datetime"
                  placeholder="选择日期时间"
                  :picker-options="addOptions"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="计划执行人" prop="planuser">
                <el-select
                  v-model="addPlanFrom.planuser"
                  placeholder="请选择计划执行人"
                >
                  <el-option
                    v-for="item in customManagerList"
                    :key="item.userid"
                    :label="item.name"
                    :value="item.userid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="申请备注">
                <el-input
                  type="textarea"
                  resize="none"
                  :rows="2"
                  v-model="addPlanFrom.reqnote"
                  placeholder="请输入申请备注"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-container>
        </template>
        <template slot="paneR">
          <el-container>
            <el-table
              ref="rightsTabel"
              class="overflowAuto"
              :data="rightTabel"
              @selection-change="handleRightChange($event)"
              stripe
              border
              highlight-current-row
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column
                label="名称"
                sortable
                prop="rightsname"
                min-width="200"
              />
              <el-table-column label="规格" prop="specification" />
              <el-table-column label="单位" prop="unit" />
              <el-table-column
                label="单价"
                sortable
                prop="price"
                :formatter="projectAmountsTabel"
              ></el-table-column>
              <el-table-column label="权益数量" sortable prop="rightsamount" />
              <el-table-column
                label="剩余数量"
                sortable
                prop="unusedamount"
              ></el-table-column>
              <el-table-column label="申请数量" width="155">
                <template slot-scope="scope">
                  <el-input-number
                    size="mini"
                    :min="0"
                    v-model="rightTabel[scope.$index].count"
                    @change="
                      toggleRightSelection(
                        scope.row,
                        rightTabel[scope.$index].count
                      )
                    "
                  ></el-input-number>
                </template>
              </el-table-column>
            </el-table>
          </el-container>
        </template>
      </SplitPane>
      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="primary" @click="submitAddForm">提交</el-button>
          <el-button @click="colseModel">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
  </d2-container>
</template>

<script>
import util from "@/libs/util.js";
import userinfo from "./components/UserInfo";
import error from "../../../plugin/error";
import dayjs from "dayjs";
import MemberServiceList from "@/views/system/Publics/memberManagement/components/memberServiceList";

export default {
  name: "memberService",
  components: {
    userinfo,
    MemberServiceList
  },
  data() {
    return {
      rightChangeList: [],
      rightTabel: [],
      Identifier: "",
      ManagerItem: [],
      loading: false,
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
        levelidarr: undefined //会员等级
      },
      //添加表单数据
      addPlanFrom: {
        memberid: null, //用户id
        inrights: null, //是否在权益内
        rightsid: null, //申请权益id
        reqcount: null, //申请数量
        reqclaimdate: "", //申请时间
        reqnote: "", //申请备注
        planuser: undefined //计划执行人
      },
      //主列表
      memberTableData: [],
      statusList: [
        { value: -1, text: "全部状态" },
        { value: 0, text: "申请" },
        { value: 1, text: "安排计划" },
        { value: 2, text: "执行完成" },
        { value: 3, text: "入帐完成" },
        { value: 9, text: "申请取消" },
        { value: 99, text: "确认取消" }
      ],
      querytypeList: [
        { value: 1, text: "计划" },
        { value: 2, text: "执行" },
        { value: 3, text: "入帐" }
      ],
      rightList: {},
      addOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().setHours(0, 0, 0, 0);
        }
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
      //弹框-详情展示
      userItem: {},
      servicePlanRule: {
        rightsid: [
          { required: true, message: "请选择服务申请", trigger: "change" }
        ],
        reqcount: [{ required: true, message: "请选择规格", trigger: "blur" }],
        inrights: [
          { required: true, message: "请选择是否在权益内", trigger: "change" }
        ],
        reqclaimdate: [
          { required: "date", message: "请选择申请时间", trigger: "change" }
        ],
        planuser: [
          { required: true, message: "请选择计划执行人", trigger: "change" }
        ]
      },
      MemberlevelList: {},
      ScheduleModel: false,
      servicePlanModal: false,
      crfList: [],
      //工作人员
      customManagerList: [],
      value: ""
    };
  },
  created() {
    //crf列表
    this.edcClassCRF_Get();
    //查询客户经理-责任人
    this.Member_AccountManager_Get();
    //获取权益list
    this.ItemInfo_Get();
    //用户等级查询
    this.Memberlevel_Get();
    //this.MemberRights_Get();
  },
  mounted() {
    this.ServerReq_Get();
  },
  watch: {
    userItem: function(newVal, oldVal) {
      return;
    }
  },
  methods: {
    init() {
      this.siftData = {
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
        levelidarr: undefined //会员等级
      };
      this.ServerReq_Get();
    },
    //模糊查询用户
    getManagerItem(item) {
      this.ManagerItem = item;
      this.MemberRights_Get();
    },
    MemberRights_Get() {
      this.MK.Request("Hcrm/MemberService/MemberRights", "get", {
        memberid: this.ManagerItem.memberid,
        type: 2,
        tag: 1,
        flg: 1
      }).then(res => {
        if (res.code == 0) {
          this.rightTabel = res.data.map((item, index) => {
            item["count"] = 0;
            item["index"] = index;
            return item;
          });
        }
      });
    },
    ItemInfo_Get() {
      this.MK.Request("Publics/ItemManage/ItemInfo", "get", {
        itemtype: 26,
        tag: 1
      }).then(res => {
        this.rightList = res.data;
      });
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
      this.$refs.membeiGet.siftData=this.siftData
      this.$refs.membeiGet.ServerReq_Get();
    },
    //crf列表
    edcClassCRF_Get() {
      let data = {
        subclassid: 100009
      };
      this.MK.Request(
        "Publics/CRFClassMaintain/edcclasscrf_Get",
        "get",
        data
      ).then(res => {
        this.crfList = res.data;
      });
    },
    submitAddForm() {
      if (!this.ManagerItem.memberid) {
        this.$message({
          message: "请选择会员",
          type: "error"
        });
        return;
      }
      if (this.rightChangeList.length == 0) {
        this.$message({
          message: "请选择权益",
          type: "error"
        });
        return;
      }
      this.$refs.addPlanFrom.validate(valid => {
        let list = [];
        let endlist = JSON.parse(JSON.stringify(this.rightChangeList));
        let forList = [...this.rightChangeList];
        if (valid) {
          forList.forEach(function(element, index, arr) {
            list = { ...element };
            if (list.count > list.unusedamount && list.rightstype === 1) {
              let item = { ...list };
              item.count = list.count - list.unusedamount;
              item.rightstype = 0;
              item.unusedamount = 0;
              endlist[index].count = list.unusedamount;
              endlist.push(item);
              if (list.unusedamount == 0) {
                endlist.splice(index, 1);
              }
            }
          });
          for (let j = 0; j < endlist.length; j++) {
            if (endlist[j].count === 0) {
              continue;
            }
            let isRight = endlist[j].unusedamount > 0 ? 1 : 0;
            //let isRight = endlist[j].rightstype;
            let isClose = (j == endlist.length - 1) == 0 ? true : false;
            this.ServerReq_Post(
              endlist[j].rightsid,
              isRight,
              isClose,
              endlist[j].count
            );
          }
        } else {
          return false;
        }
      });
    },
    ServerReq_Post(rightsid, isRight, isClose, reqcount) {
      let data = {
        rightsid: rightsid,
        inrights: isRight,
        memberid: this.ManagerItem.memberid,
        reqcount: reqcount,
        reqclaimdate: this.addPlanFrom.reqclaimdate,
        reqnote: this.addPlanFrom.reqnote,
        planuser: this.addPlanFrom.planuser
      };
      this.MK.Request("Hcrm/MemberService/ServerReq", "post", data).then(
        res => {
          if (res.code == 0 && !isClose) {
            this.$message({
              type: "success",
              message: res.msg
            });
            this.ServerReq_Get();
            this.colseModel();
          } else {
          }
        }
      );
    },

    handleAddServicePlan() {
      this.servicePlanModal = true;
    },
    colseModel() {
      this.servicePlanModal = false;
      this.rightChangeList = [];
      this.rightTabel = [];
      //this.Identifier = "";
      this.ManagerItem = [];
      this.$refs.addPlanFrom.resetFields();
    },
    handleRightChange(val) {
      let list = val.map(item => {
        if (item.count == 0) {
          this.rightTabel[item.index].count = 1;
          item.count = 1;
        }
        return item;
      });
      this.rightChangeList = list;
    },
    getQuerytype(value) {
      if (!value) {
        this.siftData.userid = undefined;
        this.siftData.dataRange = "";
        this.siftData.querytype = undefined;
      }
      this.ServerReq_Get();
    },
    getRightId(value) {
      if (!value) {
        this.siftData.rightid = undefined;
      }
      this.ServerReq_Get();
    },
    getlevelidarr(value) {
      if (!value) {
        this.siftData.levelidarr = undefined;
      }
      this.ServerReq_Get();
    },
    getUserid(value) {
      if (!value) {
        this.siftData.userid = undefined;
      }
      this.ServerReq_Get();
    },
    getStatus(value) {
      value += "";
      if (!value) {
        this.siftData.status = -1;
      }
      this.ServerReq_Get();
    },
    getDataRange(value) {
      if (!value) {
        this.siftData.date_begin = "";
        this.siftData.date_end = "";
      } else {
        this.siftData.date_begin = value[0];
        this.siftData.date_end = value[1];
      }
      this.ServerReq_Get();
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
    Memberlevel_Get() {
      this.MK.Request("Publics/MemberManage/Memberlevel", "get", {
        tag: 1
      }).then(res => {
        if (res.code == 0) {
          this.MemberlevelList = res.data;
        }
      });
    },
    projectAmountsTabel(row) {
      let num = row.price;
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

    toggleRightSelection(row, count) {
      if (count > 0) {
        this.$refs.rightsTabel.toggleRowSelection(row, true);
      } else {
        this.$refs.rightsTabel.toggleRowSelection(row, false);
      }
    }
  }
};
</script>

<style>
.el-tabs__header {
  margin: 0px;
}
</style>

<style scoped lang="scss">
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
