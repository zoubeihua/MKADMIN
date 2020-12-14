<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true">
        <el-form-item label="院区">
          <mk-select
            url="/Publics/Common/Dic/HospitalInfo"
            :clearable="true"
            v-model="pager.hospitalid"
            :filter="['hospitalname']"
            width="300px"
            label="hospitalname"
            val="hospitalid"
            @change="refreshList()"
          ></mk-select>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-select :clearable="true" v-model="pager.status" style="width:300px" placeholder="请选择状态" @change="refreshList()">
            <el-option value="0" label="停用"></el-option>
            <el-option value="1" label="启用"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item>
          <el-input
            style="wdith:300px"
            :clearable="true"
            v-model="pager.condition"
            placeholder="按名称、输入码查询"
            @keyup.enter.native="refreshList"
          />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refreshList">查询</el-button>
            <el-button
              type="success"
              icon="el-icon-circle-plus-outline"
              @click="handleInitWorkGroup"
            >添加工作组</el-button>
            <el-button
              type="success"
              icon="el-icon-circle-plus-outline"
              @click="handleInitMember"
              :disabled="isWgSelected"
            >添加成员</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>
    <SplitPane :min-percent="30" :default-percent="70" split="vertical">
      <!-- 左屏 -->
      <template slot="paneL">
        <el-container>
          <el-table
            :data="tableDataL"
            border
            style="width:100%"
            height="100%"
            stripe
            :header-cell-style="cellStyle"
            :highlight-current-row="true"
            @row-click="handleRowClickL"
            ref="tableL"
          >
            <el-table-column show-overflow-tooltip align="center" label="组ID" prop="wgid" width />
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="类型"
              prop="wgtype_display"
              width
            />
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="院区"
              prop="hospitalid_display"
              width
            />
            <el-table-column show-overflow-tooltip align="center" label="组名称" prop="wgname" width />
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="组长"
              prop="leadername"
              width
            />
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="输入码"
              prop="filterstr"
              width
            />
            <el-table-column show-overflow-tooltip align="center" label="状态" width>
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status == 0 ? 'danger' : 'success'"
                >{{scope.row.status_display}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label-class-name="ChangeColor"
              align="center"
              label="操作"
              prop="userid"
              width="180"
            >
              <template slot-scope="scope">
                <div class="tableBtn">
                  <el-link
                    icon="mkfont bianji"
                    title="编辑"
                    :underline="false"
                    type="primary"
                    @click="handleWGOperate(0,scope.row)"
                  ></el-link>
                  <el-link
                    v-if="scope.row.status == 0"
                    icon="mkfont qiyong"
                    title="启用"
                    :underline="false"
                    type="success"
                    @click="handleWGOperate(1,scope.row)"
                  ></el-link>
                  <el-link
                    v-if="scope.row.status == 1"
                    icon="mkfont tingyong_line"
                    title="停用"
                    :underline="false"
                    type="danger"
                    @click="handleWGOperate(2,scope.row)"
                  ></el-link>
                  <el-link
                    icon="mkfont trasch"
                    title="删除"
                    :underline="false"
                    type="danger"
                    @click.stop="handleWGOperate(3,scope.row)"
                  ></el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-footer>
            <mk-page :pager="pager" @query="refreshList" />
          </el-footer>
        </el-container>
      </template>
      <!-- 右屏 -->
      <template slot="paneR">
        <el-table
          :data="tableDataR"
          border
          style="width:100%"
          height="100%"
          stripe
          :header-cell-style="cellStyle"
          :highlight-current-row="true"
          @row-click="handleRowClickR"
          ref="tableR"
        >
          <el-table-column show-overflow-tooltip align="center" label="成员ID" prop="userid" width />
          <el-table-column show-overflow-tooltip align="center" label="成员姓名" prop="username" width />
          <el-table-column
            align="center"
            label="操作"
            label-class-name="ChangeColor"
            prop="userid"
            width
          >
            <template slot-scope="scope">
              <div class="tableBtn">
              <el-link
                icon="mkfont trasch"
                title="删除"
                :underline="false"
                type="danger"
                @click="handleDeLMember(scope.row.userid)"
              ></el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </SplitPane>
    <!-- 工作组模态框 -->
    <vxe-modal
      v-model="wgModal"
      width="600"
      height="auto"
      :showFooter="true"
      @close="handleCloseWgModal"
    >
      <div slot="title">
        {{wgForm.wgid ? '编辑工作组' : '新增工作组'}}
        <span v-if="wgForm.wgid">
          - [
          <span style="color:red;">{{wgForm.wgname}}</span>
          ]
        </span>
      </div>
      <el-form :model="wgForm" ref="wgForm" :rules="wgRules" label-width="130px">
        <el-form-item label="工作组名称" prop="wgname">
          <el-input style="width:350px" v-model="wgForm.wgname" placeholder="请输入工作组名称" />
        </el-form-item>
        <el-form-item label="工作组类型" prop="wgtype">
          <mk-select
            v-model="wgForm.wgtype"
            url="1"
            :clearable="false"
            :globalFn="true"
            :param="{ codetype: '工作组类型' }"
            :filter="['bzname','filterstr']"
            width="350px"
            label="bzname"
            val="bzcode"
            @keyup.enter.native="enterEvent"
          ></mk-select>
        </el-form-item>
        <el-form-item label="所属院区" prop="hospitalid">
          <mk-select
            url="/Publics/Common/Dic/HospitalInfo"
            :clearable="false"
            v-model="wgForm.hospitalid"
            :filter="['hospitalname']"
            width="350px"
            label="hospitalname"
            val="hospitalid"
          ></mk-select>
        </el-form-item>
        <el-form-item label="组长" prop="leaderid">
          <el-select
            style="width:350px"
            filterable
            v-model="wgForm.leaderid"
            placeholder="请选择组长"
            @change="handleChangeLeader"
          >
            <el-option
              v-for="item in (!editSwitch ? staffInfoList : memberInGroup)"
              :key="item.userid"
              :label="item.name"
              :value="item.userid"
            >
              <div>
                <el-tooltip effect="dark" :content="item.sex_dispalay" placement="left">
                  <i
                    :class="['mkfont', item.sex == 1 ? 'nan' : item.sex == 2 ? 'nv' : 'weizhi']"
                    :style="{color: item.sex == 1 ? '#6DCEFA' : item.sex == 2 ? '#F37E7D' : '' }"
                  ></i>
                </el-tooltip>
                <span style="min-width:60px;display:inline-block;margin-left:10px">{{item.name}}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="输入码" prop>
          <el-input style="width:350px" v-model="wgForm.filterstr" placeholder="请输入输入码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="footer">
        <el-button-group>
          <el-button type="primary" @click="handleSumbitWg">提交</el-button>
          <el-button type="warning" @click="handleCloseWgModal">关闭</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
    <!-- 组成员模态框 -->
    <vxe-modal
      v-model="memberModal"
      width="960"
      height="auto"
      resize
      :showFooter="true"
      @close="handleCloseMemberModal"
    >
      <div slot="title">
        新增工作组成员
        <span>
          - [
          <span style="color:red;">{{wgForm.wgname}}</span>
          ]
        </span>
      </div>
      <el-container>
        <el-header>
          <el-form :inline="true">
            <el-form-item>
              <el-input v-model="memberPager.condition" placeholder="按姓名查询" />
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="primary" icon="el-icon-search" @click="getStaffInfo()">查询</el-button>
                <el-button
                  type="success"
                  icon="el-icon-circle-plus-outline"
                  @click="handleAddWgMember"
                >添加成员</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
        </el-header>
        <el-table
          :data="staffInfoList"
          border
          style="width:100%"
          height="100%"
          stripe
          :header-cell-style="cellStyle"
          :highlight-current-row="true"
          @row-click="handleRowClickMember"
        >
          <el-table-column show-overflow-tooltip align="center" label="人员ID" prop="userid" width />
          <el-table-column show-overflow-tooltip align="center" label="姓名" prop="name">
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
                <span style="min-width:60px;display:inline-block;">{{scope.row.name}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="类型"
            prop="stafftype_display"
            width
          />
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="院区"
            prop="hospitalname"
            width
          />
          <el-table-column show-overflow-tooltip align="center" label="科室" prop="deptname" width />
        </el-table>
      </el-container>
      <div slot="footer" class="footer">
        <el-button-group>
          <el-button type="warning" @click="handleCloseMemberModal">关闭</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
  </d2-container>
</template>

<script>
export default {
  name: "wrokGroupManagement",
  data() {
    return {
      pager: {
        count: 0,
        page: 1,
        rows: 20,
        condition: "",
        hospitalid: "",
        status: ""
      },
      memberPager: {
        count: 0,
        page: 1,
        rows: 20,
        condition: ""
      },
      staffInfoList: [],
      tableDataL: [],
      tableDataR: [],
      memberInGroup: [], // 组内成员
      editSwitch: false,
      isWgSelected: true,
      wgModal: false,
      memberModal: false,
      wgForm: {
        wgname: "",
        wgtype: "",
        leaderid: "",
        leadername: "",
        hospitalid: "",
        status: 1
      },
      wgRules: {
        wgname: [
          { required: true, message: "请输入工作组名称", trigger: "blur" }
        ],
        wgtype: [
          { required: true, message: "请选择工作组类型", trigger: "change" }
        ],
        leaderid: [
          { required: true, message: "请选择组长", trigger: "change" }
        ],
        hospitalid: [
          { required: true, message: "请选择所属院区", trigger: "change" }
        ]
      },
      // 成员表格行点击信息
      wgMemberInfo: {
        userid: "",
        wgid: ""
      }
    };
  },
  created() {
    this.getStaffInfo();
    this.workGroupInfo_Get();
  },
  methods: {
    refreshList() {
      this.isWgSelected = true
      this.tableDataR = []
      this.workGroupInfo_Get();
    },
    handleInitWorkGroup() {
      this.wgModal = true;
      this.editSwitch = false;
      this.wgForm = {
        wgname: "",
        wgtype: "",
        leaderid: "",
        leadername: "",
        hospitalid: "",
        status: 1
      };
      this.$refs.wgForm.clearValidate();
      this.$refs.wgForm.resetFields();
    },
    handleInitMember() {
      this.memberModal = true;
    },
    handleCloseWgModal() {
      this.wgModal = false;
    },
    handleCloseMemberModal() {
      this.memberModal = false;
    },
    handleChangeLeader(leaderid) {
      this.wgForm.leadername = this.staffInfoList.filter(item => {
        if (item.userid == leaderid) {
          return item;
        }
      })[0].name;
      this.wgForm.leaderid = leaderid;
    },
    // 行工作组编辑
    handleWGOperate(key, row) {
      console.log(key, row);
      let data = {};
      data.wgid = row.wgid.toString();
      data.wgname = row.wgname.toString();
      data.wgtype = row.wgtype.toString();
      data.hospitalid = row.hospitalid.toString();
      data.leaderid = row.leaderid;
      data.leadername = row.leadername;
      data.filterstr = row.filterstr;
      data.status = row.status
      // 编辑
      if (key == 0) {
        this.wgForm = data;
        this.wgModal = true;
        this.editSwitch = true;
        data.operatetype = "U";
      }
      // 启用
      if (key == 1) {
        data.operatetype = "U";
        data.status = 1;
      }
      // 停用
      if (key == 2) {
        data.operatetype = "U";
        data.status = 0;
      }
      // 删除
      if (key == 3) {
        data.operatetype = "D";
        this.$nextTick(() => {
          this.tableDataR = [];
          this.$set(this,"isWgSelected",true)
          // this.isWgSelected = true;
        });
      }
      if (key != 0) {
        this.workGroupInfo_Post(data);
      }
    },
    // 删除工作组成员
    handleDeLMember(userid) {
      this.workGroupMember_Post(userid, this.wgMemberInfo.wgid, "D");
    },
    // 工作组提交
    handleSumbitWg() {
      this.$refs.wgForm.validate(valid => {
        if (valid) {
          if (!this.editSwitch) {
            this.wgForm.operatetype = "C";
            this.wgForm.leadername = this.staffInfoList.filter(item => {
              if (item.userid == this.wgForm.leaderid) {
                return item;
              }
            })[0].name;
          }
          this.memberInGroup = []
          this.workGroupInfo_Post(this.wgForm);
        }
      });
    },
    // 添加工作组成员
    handleAddWgMember() {
      this.workGroupMember_Post(
        this.wgMemberInfo.userid,
        this.wgMemberInfo.wgid
      );
    },
    handleRowClickL(row) {
			this.wgForm.wgname = row.wgname	
      this.memberInGroup = []
      this.wgMemberInfo.wgid = row.wgid;
      this.isWgSelected = false;
      this.workGroupMember_Get();
    },
    handleRowClickR() {},
    handleRowClickMember(row) {
      console.log(row);
      this.wgMemberInfo.userid = row.userid;
    },
    // 表格列头样式
    cellStyle: function({ row, column, rowIndex, columnIndex }) {
      if (column.labelClassName == "ChangeColor") {
        return "color:#1296db";
      } else {
        return "";
      }
    },
    // 工作组信息CRUD
    workGroupInfo_Post(data) {
      this.MK.Request("/Publics/Common/Dic/WorkGroupInfo", "post", data).then(
        res => {
          if (res.code == 0) {
            this.$message({
              message: res.msg,
              type: "success"
            });
            this.wgModal = false;
            this.workGroupInfo_Get();
          }
        }
      );
    },
    // 获取工作组信息
    workGroupInfo_Get() {
      this.MK.Request(
        "/Publics/Common/Dic/WorkGroupInfo",
        "get",
        this.pager
      ).then(res => {
        this.tableDataL = res.data;
        this.pager.count = res.count;
      });
    },
    // 工作组成员CRUD
    workGroupMember_Post(userid, wgid, key) {
      let data = {};
      data.userid = userid;
      data.wgid = wgid;
      data.isLeader = 0;
      if (key == "D") {
        data.operatetype = key;
      }
      this.MK.Request("/Publics/Common/Dic/WorkGroupMember", "post", data).then(
        res => {
          if (res.code == 0) {
            this.$message({
              message: res.msg,
              type: "success"
            });
            this.workGroupMember_Get();
          }
        }
      );
    },
    // 获取工作组成员信息
    workGroupMember_Get(wgid) {
      this.MK.Request("/Publics/Common/Dic/WorkGroupMember", "get", {
        wgid: this.wgMemberInfo.wgid || wgid
      }).then(res => {
        this.tableDataR = res.data;
        // 编辑工作组时 组长下拉框为组内成员
        this.staffInfoList.filter(x => {
          this.tableDataR.map(y => {
            if (x.userid == y.userid) {
              this.memberInGroup.push(x);
            }
          });
        });
      });
    },
    // 获取工作人员
    getStaffInfo() {
      this.MK.Request("/Publics/Common/UserInfo", "get", this.memberPager).then(
        res => {
          this.staffInfoList = res.data;
        }
      );
    }
  },
  watch: {
    wgModal(val) {
      if (!val) {
        this.memberInGroup = [];
      }
    }
  }
};
</script>

<style>
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>