<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true">
        <el-form-item>
          <el-select
            v-model="form.levelidarr"
            style="width:300px"
            multiple
            placeholder="按会员等级查询"
            @change="refreshList"
          >
            <el-option
              v-for="item in memberLevelSelect"
              :key="item.name"
              :label="item.name"
              :value="item.levelid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            style="width:300px"
            v-model="daterange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="注册日期"
            end-placeholder="注册日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            @change="daterangeChange"
            @blur="refreshList"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input
            style="width:300px"
            type="text"
            clearable
            v-model="form.condition"
            @keyup.enter.native="MemberInfo_Get($event)"
            placeholder="按会员卡号 / 姓名 / 拼音 / 联系电话查询"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox
            v-model="form.mycustomer"
            :true-label="1"
            :false-label="0"
            v-permission="'sys:family:queryallmemberData'"
            @change="refreshList"
          >我的客户</el-checkbox>
          <el-tooltip class="item" effect="dark" content="两个月内会费到期的会员" placement="top">
            <el-checkbox
              v-model="form.expirationdaysmemberfee"
              :true-label="1"
              :false-label="0"
              @change="refreshList"
            >会费近期</el-checkbox>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refreshList">查询</el-button>
            <el-button type="warning" icon="el-icon-refresh" @click="handleClear">清空</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>
    <SplitPane :min-percent="20" :default-percent="30" split="vertical">
      <template slot="paneL">
        <el-container>
          <el-table
            :data="tableData"
            border
            style="width:100%"
            height="100%"
            stripe
            highlight-current-row
            @row-click="handleRowClick"
            ref="tableM"
          >
            <el-table-column
              show-overflow-tooltip
              sortable
              label="会员卡号"
              align="center"
              prop="cardno"
              width="160"
            />
            <el-table-column
              sortable
              show-overflow-tooltip
              label="会员姓名"
              align="center"
              prop="membername"
              width="120"
            >
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
            <el-table-column show-overflow-tooltip align="center" label="等级" width="80" sortable>
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
            <el-table-column
              show-overflow-tooltip
              sortable
              label="联系电话"
              align="center"
              prop="mobiletel"
              width="130"
            >
              <template slot-scope="scope">{{scope.row.mobiletel | toTel}}</template>
            </el-table-column>
          </el-table>
          <el-footer>
            <mk-page :pager="form" @query="refreshList" />
          </el-footer>
        </el-container>
      </template>
      <template slot="paneR">
        <el-table :data="familyTableData" stripe height="100%">
          <el-table-column label="成员关系" prop="membership_display" align="center" />
          <el-table-column label="成员姓名" prop="membername" align="center" />
          <el-table-column label="成员性别" prop="sex_display" align="center" />
          <el-table-column label="成员生日" prop="birthday" align="center" />
          <el-table-column label="联系电话" prop="mobiletel" align="center" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="GetvalidStatusType(scope.row.status)"
              >{{scope.row.status == 0 ? '停用' : '正常'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" width="120">
            <template slot="header" slot-scope="slot">
              <el-button
                type="primary"
                size="medium"
                :disabled="!curRow.memberid"
                @click="handleOpenAddFamilyModal"
              >添加</el-button>
            </template>
            <template slot-scope="scope">
              <div class="tableBtn">
                <el-link
                  icon="mkfont bianji1"
                  :underline="false"
                  type="primary"
                  @click="handleFamilyMemberEdit(scope.row,'U')"
                />
                <el-link
                  icon="mkfont trasch"
                  title="删除"
                  :underline="false"
                  type="danger"
                  @click="handleFamilyMemberEdit(scope.row,'D')"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </SplitPane>
    <vxe-modal v-model="openAddFamilyModal" title="添加家庭成员" width="700" height="300">
      <el-form :model="familyForm" ref="familyForm" :rules="familyRules" label-width="110px">
        <el-form-item label="成员姓名" prop="familymembername">
          <mk-member-select-table
            v-model="familyForm.familymembername"
            height="500"
            @change="handleChangeFamilyMemberid"
          ></mk-member-select-table>
          <!-- <el-select class="inputShort" clearable filterable v-model="familyForm.familymemberid" @change="handleChangeFamilyMemberid">
						<el-option v-for="item in tableData" :key="item.memberid" :value="item.memberid" :label="item.membername"></el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="成员关系" prop="membership">
          <mk-select
            v-model="familyForm.membership"
            url="1"
            :globalFn="true"
            :param="{ codetype: '成员关系' }"
            :filter="['bzname','filterstr']"
            label="bzname"
            val="bzcode"
            @keyup.enter.native="enterEvent"
          ></mk-select>
        </el-form-item>
      </el-form>
      <el-button-group style="margin-left:36%; margin-top:20px">
        <el-button type="primary" @click="handleSubmitFamily('familyForm')">提交</el-button>
        <el-button type="warning" @click="closeFamilyModel">取消</el-button>
      </el-button-group>
    </vxe-modal>
  </d2-container>
</template>

<script>
export default {
  name: "familyMemberManagement",
  data() {
    return {
      openAddFamilyModal: false,
      tableData: [],
      familyTableData: [],
      memberLevelSelect: [],
      daterange: [], //日期范围
      form: {
        createuserid: "",
        mycustomer: 0,
        expirationdaysmemberfee: 0,
        regdatebegin: "",
        regdatesend: "",
        levelidarr: [],
        condition: "",
        page: 1,
        rows: 20,
        count: 0,
        orderby: ""
      },
      // 家庭成员表单
      familyForm: {
        memberid: "",
        membership: "",
        familymemberid: "",
        familymembername: ""
      },
      // 家庭成员表单校验
      familyRules: {
        familymembername: [
          { required: true, message: "请选择成员姓名", trigger: "change" }
        ],
        membership: [
          { required: true, message: "请选择成员关系", trigger: "change" }
        ]
      },
      curRow: {},
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
      }
    };
  },
  created() {
    this.Memberlevel_Get();
    this.MemberInfo_Get();
  },
  methods: {
    Memberlevel_Get() {
      this.MK.Request("Publics/MemberManage/Memberlevel", "get", {
        condition: "",
        page: 1,
        rows: 10,
        tag: 1
      }).then(res => {
        this.memberLevelSelect = res.data.map(item => {
          item.isCheck = false;

          return item;
        });
      });
    },
    // 分页刷新 查询
    refreshList() {
      this.MemberInfo_Get();
    },
    // 清空查询条件
    handleClear() {
      this.form = {
        createuserid: "",
        mycustomer: "",
        expirationdaysmemberfee: "",
        regdatebegin: "",
        regdatesend: "",
        levelidarr: [],
        condition: "",
        page: 1,
        rows: 20,
        orderby: ""
      };
      (this.daterange = []), //日期范围
        this.refreshList();
    },
    MemberInfo_Get() {
      let isPerms = this.$permission("sys:family:queryallmemberData");
      (this.form.myCustomer = isPerms ? this.form.myCustomer : 1),
        (this.form.createuserid = this.info.userid);
      this.MK.Request("Publics/MemberManage/BasicInfo", "get", this.form).then(
        res => {
          this.tableData = res.data;
          this.form.count = res.count;
        }
      );
    },
    daterangeChange(val) {
      if (val) {
        this.form.regdatebegin = val[0];
        this.form.regdatesend = val[1];
      } else {
        this.form.regdatebegin = "";
        this.form.regdatesend = "";
      }
      this.refreshList();
    },
    handleRowClick(row) {
      this.curRow = row;
      this.Member_family_Get();
    },
    Member_family_Get(memberid) {
      this.MK.Request("Publics/MemberManage/FamilyMember", "get", {
        condition: this.curRow.memberid,
        tag: 1,
        hospitalid: this.info.hospitalid
      }).then(res => {
        if (res.code == 0) {
          res.data.forEach(item => {
            item.status = item.status || 1;
          });
          this.familyTableData = res.data;
        }
      });
    },
    // 添加家庭成员模态框按钮
    handleOpenAddFamilyModal() {
      this.openAddFamilyModal = true;
      this.$nextTick(() => {
        this.$refs["familyForm"].clearValidate();
        this.$refs["familyForm"].resetFields();
      });
    },
    // 提交家庭成员信息
    handleSubmitFamily(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.familyMember_Operate();
        }
      });
    },
    // 更改家庭成员id
    handleChangeFamilyMemberid(row) {
      this.familyForm.familymemberid = row.memberid;
      console.log(this.familyForm);
    },
    // 编辑家庭成员
    handleFamilyMemberEdit(val, operatetype) {
      this.familyForm.membership = val.membership + "";
      this.familyForm.familymembername = val.membername;
      this.familyForm.familymemberid = val.familymemberid;
      this.familyForm.operatetype = operatetype;
      if (operatetype == "U") {
        this.openAddFamilyModal = true;
      }
      if (operatetype == "D") {
        this.familyMember_Operate();
      }
    },
    // 家庭成员信息操作
    familyMember_Operate() {
      const url = "Publics/MemberManage/FamilyMember";
      this.familyForm.createid = this.info.userid;
      this.familyForm.memberid = this.curRow.memberid;
      this.MK.Request(url, "post", this.familyForm).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.closeFamilyModel();
          this.Member_family_Get();
        }
      });
    },
    closeFamilyModel() {
      this.familyForm = {
        memberid: "",
        membership: "",
        familymemberid: "",
        familymembername: ""
      };
      this.openAddFamilyModal = false;
    }
  }
};
</script>

<style>
</style>
