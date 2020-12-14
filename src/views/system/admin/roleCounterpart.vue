<template>
  <d2-container>
    <SplitPane :min-percent="20" :default-percent="35" split="vertical">
      <template slot="paneL">
        <el-container>
          <el-header>
            <el-form :inline="true" class="headerFrom">
              <el-form-item label="院区">
                <mk-select
                  style="width:118px;"
                  v-model="form.hospitalid"
                  placeholder="请选择院区"
                  url="/Publics/Common/Dic/HospitalInfo"
                  :param="{tag:'1'}"
                  :filter="['hospitalname','filterstr']"
                  label="hospitalname"
                  val="hospitalid"
                  @change="RefreshList"
                ></mk-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="form.condition"
                  style="width:260px"
                  @keyup.enter.native="RefreshList"
                  placeholder="按名称、输入码进行查询"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button type="primary" @click="RefreshList">查询</el-button>
                </el-button-group>
              </el-form-item>
            </el-form>
          </el-header>
          <el-main style="padding:0;">
            <el-table
              :data="roleList"
              stripe
              border
              @row-click="tableRowClick"
              highlight-current-row
              @sort-change="(({column}) => {sortColumn(column,'/Publics/Common/Role',form,sortChange)})"
              height="100%"
            >
              <el-table-column
                label="所属院区"
                sortable="custom"
                show-overflow-tooltip
                prop="hospitalname"
              ></el-table-column>
              <el-table-column
                label="角色名称"
                sortable="custom"
                show-overflow-tooltip
                prop="rolename"
              ></el-table-column>
              <el-table-column
                label="角色描述"
                sortable="custom"
                show-overflow-tooltip
                prop="note"
              ></el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <mk-page :pager="form" @query="RefreshList" />
          </el-footer>
        </el-container>
      </template>
      <template slot="paneR">
        <el-container>
          <el-header>
            <el-form :inline="true" class="headerFrom">
              <el-form-item>
                <mk-select
                  style="width:105px;"
                  v-model="rightForm.hospitalid"
                  @change="getUserList"
                  placeholder="选择院区"
                  url="/Publics/Common/Dic/HospitalInfo"
                  :filter="['hospitalname','filterstr']"
                  label="hospitalname"
                  val="hospitalid"
                ></mk-select>
              </el-form-item>
              <el-form-item>
                <mk-select
                  style="width:105px;"
                  v-model="rightForm.deptid"
                  :isInit="false"
                  @change="getUserList"
                  placeholder="选择科室"
                  :url="isHospitalid"
                  :param="{hospitalid:rightForm.hospitalid}"
                  :filter="['Name']"
                  label="Name"
                  val="ID"
                ></mk-select>
              </el-form-item>
              <el-form-item>
                <mk-select
                  style="width:105px;"
                  v-model="rightForm.stafftype"
                  @change="getUserList"
                  placeholder="选择人员类型"
                  :datas="getDicStandarDcode('人员类型')"
                  :filter="['bzname','filterstr']"
                  label="bzname"
                  val="bzcode"
                ></mk-select>
              </el-form-item>
              <el-form-item>
                <mk-select
                  style="width:105px;"
                  v-model="rightForm.jobtitle"
                  @change="getUserList"
                  placeholder="选择职称"
                  :datas="getDicStandarDcode('职称')"
                  :filter="['bzname','filterstr']"
                  label="bzname"
                  val="bzcode"
                ></mk-select>
              </el-form-item>
              <el-form-item>
                <mk-select
                  style="width:105px;"
                  v-model="rightForm.position"
                  @change="getUserList"
                  placeholder="选择职务"
                  :datas="getDicStandarDcode('职务(聘)')"
                  :filter="['bzname','filterstr']"
                  label="bzname"
                  val="bzcode"
                ></mk-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="rightForm.condition"
                  style="width:260px"
                  @keyup.enter.native="getUserList"
                  placeholder="按工号、姓名、首拼查询"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button type="primary" @click="getUserList">查询</el-button>
                  <el-button type="primary" @click="addUser">添加</el-button>
                </el-button-group>
              </el-form-item>
            </el-form>
          </el-header>
          <el-main style="padding:0;">
            <el-table
              :data="rightTableDataList"
              stripe
              border
              highlight-current-row
              @sort-change="(({column}) => {sortColumn(column,'/Publics/Common/Role/Users',rightForm,sortUserChange)})"
              height="100%"
            >
              <el-table-column label="工号" sortable="custom" show-overflow-tooltip prop="staffno"></el-table-column>
              <el-table-column label="性别-姓名" sortable="custom" show-overflow-tooltip prop="name">
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
                label="所属院区"
                sortable="custom"
                show-overflow-tooltip
                prop="hospitalname"
              ></el-table-column>
              <el-table-column label="所属科室" sortable="custom" show-overflow-tooltip prop="deptname"></el-table-column>
              <el-table-column
                label="职称"
                sortable="custom"
                show-overflow-tooltip
                prop="jobtitle_display"
              ></el-table-column>
              <el-table-column
                label="职务"
                sortable="custom"
                show-overflow-tooltip
                prop="position_display"
              ></el-table-column>
              <el-table-column label="实习生" sortable="custom" show-overflow-tooltip prop="traineementor_display"></el-table-column>
              <!-- <el-table-column
                label="授权有效期"
                sortable="custom"
                width="160"
                show-overflow-tooltip
                prop="rolename"
              ></el-table-column> -->
              <el-table-column
                label="操作"
                label-class-name="primary"
                align="center"
                show-overflow-tooltip
                prop="rolename"
              >
                <template slot-scope="scope">
                  <div class="tableBtn">
                  <el-link
                    :underline="false"
                    icon="fa fa-trash-o"
                    type="danger"
                    @click="removeUser(scope.row)"
                    title="移除"
                  ></el-link>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <mk-page :pager="rightForm" @query="getUserList" />
          </el-footer>
        </el-container>
      </template>
    </SplitPane>
      <vxe-modal
      v-model="Modal"
      :showFooter="true"

      @close="colseModel"
      width="99vw"
      height="99vh"
    >
      <div slot="title">
        添加角色对应人员-
        [<span class="danger">{{curRow.rolename}}</span>]
      </div>
      <counterpart v-if="Modal" :roleid="rightForm.roleid" @change="counterpartChange" />
      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="success" @click="AddUserSumbit">提交</el-button>
          <el-button type="warning" @click="colseModel">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
  </d2-container>
</template>
<script>
import counterpart from './components/counterpart'
export default {
  name: "roleCounterpart",
  components:{
    counterpart
  },
  data() {
    return {
      Modal:false,
      form: {
        roleid: "",
        status: "-1", //状态 1 正常 0 停用 -1全部(默认)
        condition: "",
        hospitalid: "",
        orderby: "",
        page: 1,
        rows: 20,
        count: 0
      },
      rightForm: {
        roleid: "",
        type: "0", //-1 全部(默认) 0 查询角色已经对应的人员 1 查询角色未对应的人员列表
        hospitalid: "", //院区
        deptid: "", //科室
        stafftype: "", //工作人员类型,默认(-1)查询全部 0 其他 1 医生 1 药剂师 3 护士 4 技师 5 财务 6 行政 7 客服 9 实习生
        jobtitle: "", //职称 获取标准字典表的数据
        position: "", //职务(聘) 获取标准字典表的数据
        condition: "", //
        orderby: "",
        page: 1,
        rows: 20,
        count: 0
      },
      curRow:{},
      roleList: [],
      rightTableDataList: [],
      addUserData:{
        operatetype:'C',
        roleid:'',
        rolename:'',
        userarr:[]
      }
    };
  },
  computed:{
     isHospitalid() {
      if (this.rightForm.hospitalid) {
        return "/Publics/Common/Dic/DepInfo/Tree";
      } else {
        return "";
      }
    },
  },
  created() {
    this.RefreshList();
  },
  methods: {
    //获取页面数据
    RefreshList() {
      this.rightTableDataList = [];
      this.sortColumn(
        { sortable: "none" },
        "/Publics/Common/Role",
        this.form,
        res => {
          this.sortChange(res);
        }
      );
    },
    sortChange(res) {
      if (res.code == 0) {
        this.roleList = res.data;
        this.form.count = res.count;
      }
    },
    //左边tabel行单击事件
    tableRowClick(row) {
      this.curRow = row;
      this.rightForm.roleid = row.roleid;
      this.getUserList();
    },
    //获取角色对应人员
    getUserList() {
      if (this.rightForm.roleid == "") {
        this.$message.error("请选择角色");
        return;
      }
      this.sortColumn(
        { sortable: "none" },
        "/Publics/Common/Role/Users",
        this.rightForm,
        res => {
          this.sortUserChange(res);
        }
      );
    },
    sortUserChange(res) {
      if (res.code == 0) {
        this.rightForm.count = res.count;
        this.rightTableDataList = res.data;
      }
    },
    //移除人员
    removeUser(row) {
      let cloneRow = JSON.parse(JSON.stringify(row));
      if (this.rightForm.roleid == "") {
        this.$message.error("请选择角色");
        return;
      }
      this.$confirm("确定要移除人员吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let sendData = {
            operatetype: "D",
            roleid: this.rightForm.roleid,
            rolename: this.curRow.rolename,
            userarr: [
              {
                userid: cloneRow.userid,
                name: cloneRow.name
              }
            ]
          };
          this.MK.Request("/Publics/Common/Role/Users", "post", sendData).then(
            res => {
              if (res.code == 0) {
                this.$message({
                  message: res.msg,
                  type: "success"
                });
                this.getUserList();
              }
            }
          );
        })
        .catch(() => {});
    },
    //添加角色对应人员
    addUser(){
      if(this.rightForm.roleid == ''){
        this.$message.error('请先选择角色');
        return;
      }
      this.Modal = true;
    },
    colseModel(){
      this.Modal = false;
      this.addUserData = {
        operatetype:'C',
        roleid:'',
        rolename:'',
        userarr:[]
      }
    },
    //弹窗选择人员事件回调
    counterpartChange(val){
      this.addUserData.userarr = val;
    },
    AddUserSumbit(){
      if(this.addUserData.userarr.length == 0){
        this.$message.error('请先勾选人员');
        return;
      };
      this.addUserData.roleid = this.rightForm.roleid;
      this.addUserData.rolename = this.curRow.rolename;
      this.MK.Request("/Publics/Common/Role/Users", "post", this.addUserData).then(
      res => {
        if (res.code == 0) {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.colseModel();
          this.getUserList();

        }
      }
    );
    }
  }
};
</script>
