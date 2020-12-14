<template>
  <d2-container>
    <SplitPane :min-percent="20" :default-percent="50" split="vertical">
      <template slot="paneL">
        <el-container>
          <el-header>
            <el-form :inline="true" class="headerFrom">
              <!-- <el-form-item>
                <mk-select
                  style="width:105px;"
                  v-model="form.hospitalid"
                  @change="getUserList"
                  placeholder="选择院区"
                  url="/Publics/Common/Dic/HospitalInfo"
                  :filter="['hospitalname', 'filterstr']"
                  label="hospitalname"
                  val="hospitalid"
                ></mk-select>
              </el-form-item>
              <el-form-item>
                <mk-select
                  style="width:105px;"
                  v-model="form.deptid"
                  :isInit="false"
                  @change="getUserList"
                  placeholder="选择科室"
                  :url="isHospitalid"
                  :param="{ hospitalid: form.hospitalid }"
                  :filter="['Name']"
                  label="Name"
                  val="ID"
                ></mk-select>
              </el-form-item>
              <el-form-item>
                <mk-select
                  style="width:105px;"
                  v-model="form.stafftype"
                  @change="getUserList"
                  placeholder="选择人员类型"
                  :datas="getDicStandarDcode('人员类型')"
                  :filter="['bzname', 'filterstr']"
                  label="bzname"
                  val="bzcode"
                ></mk-select>
              </el-form-item>
              <el-form-item>
                <mk-select
                  style="width:105px;"
                  v-model="form.jobtitle"
                  @change="getUserList"
                  placeholder="选择职称"
                  :datas="getDicStandarDcode('职称')"
                  :filter="['bzname', 'filterstr']"
                  label="bzname"
                  val="bzcode"
                ></mk-select>
              </el-form-item>
              <el-form-item>
                <mk-select
                  style="width:105px;"
                  v-model="form.position"
                  @change="getUserList"
                  placeholder="选择职务"
                  :datas="getDicStandarDcode('职务(聘)')"
                  :filter="['bzname', 'filterstr']"
                  label="bzname"
                  val="bzcode"
                ></mk-select>
              </el-form-item> -->
              <el-form-item>
                <el-input
                  v-model="form.condition"
                  style="width:260px"
                  @keyup.enter.native="getUserList"
                  placeholder="按工号、姓名、首拼查询"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button type="primary" @click="getUserList"
                    >查询</el-button
                  >
                </el-button-group>
              </el-form-item>
            </el-form>
          </el-header>
          <el-main style="padding:0;">
            <el-table
              :data="userDataList"
              @row-click="tableRowClick"
              stripe
              border
              highlight-current-row
              @sort-change="
                ({ column }) => {
                  sortColumn(
                    column,
                    '/Publics/Common/UserInfo',
                    form,
                    sortUserChange
                  );
                }
              "
              height="100%"
            >
              <el-table-column
                label="工号"
                sortable="custom"
                show-overflow-tooltip
                prop="staffno"
              ></el-table-column>
              <el-table-column
                label="性别-姓名"
                sortable="custom"
                show-overflow-tooltip
                prop="name"
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
                        :class="[
                          'mkfont',
                          scope.row.sex == 1
                            ? 'nan'
                            : scope.row.sex == 2
                            ? 'nv'
                            : 'weizhi'
                        ]"
                        :style="{
                          color:
                            scope.row.sex == 1
                              ? '#6DCEFA'
                              : scope.row.sex == 2
                              ? '#F37E7D'
                              : ''
                        }"
                      ></i>
                    </el-tooltip>
                    <span style="min-width:60px;display:inline-block;">{{
                      scope.row.name
                    }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="所属院区"
                sortable="custom"
                show-overflow-tooltip
                prop="hospitalname"
              ></el-table-column>
              <el-table-column
                label="所属科室"
                sortable="custom"
                show-overflow-tooltip
                prop="deptname"
              ></el-table-column>
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
              <!-- <el-table-column
          label="授权有效期"
          sortable="custom"
          width="160"
          show-overflow-tooltip
          prop="rolename"
        ></el-table-column>-->
            </el-table>
          </el-main>
          <el-footer>
            <mk-page :pager="form" @query="getUserList" />
          </el-footer>
        </el-container>
      </template>
      <template slot="paneR">
        <permissions
          ref="permissions"
          pageName="personnelAuth"
          url="/Publics/Common/User/Permission"
          @change="permissionsChange"
        >
          <el-date-picker
            v-model="expirationdate"
            align="right"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="设置有效期限"
            :picker-options="pickerOptions"
          />
          <!-- <el-button type="primary" @click="setDate">设置授权期限</el-button>
          <span style="margin-left:10px;color:red;">{{ expirationdate }}</span> -->
        </permissions>
      </template>
    </SplitPane>
    <vxe-modal v-model="Modal" :showFooter="true" width="550px" height="460px">
      <div slot="title">
        设置有效期限
      </div>
      <el-date-picker
        v-model="expirationdate"
        align="right"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="success" @click="Modal = false">确定</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
  </d2-container>
</template>
<script>
import permissions from "./components/permissions";
export default {
  name: "personnelAuth",
  components: {
    permissions
  },
  data() {
    return {
      Modal: false,
      form: {
        userid: "",
        managedeptusers: "", //isadmin不为1 传1 其他传空
        type: "1", //-1 全部(默认) 0 查询角色已经对应的人员 1 查询角色未对应的人员列表
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
        shortcuts: [
          {
            text: "一周",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一个月",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", date);
            }
          },
          {
            text: "三个月",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit("pick", date);
            }
          },
          {
            text: "半年",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 180);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一年",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 360);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      expirationdate: "",
      rightForm: {
        userid: "",
        type: "-1", //查询类型 默认 -1 全部 0 已授权 1未授权
        condition: "", //按名称、输入码进行查询
        manageid: "",
        tag: 1,
        // page:1,
        // rows:20,
        // count:0,
        hospitalid: "",
        orderby: ""
      },
      curRow: {},
      userDataList: [],
      rightTableDataList: []
    };
  },
  computed: {
    isHospitalid() {
      if (this.form.hospitalid) {
        return "/Publics/Common/Dic/DepInfo/Tree";
      } else {
        return "";
      }
    }
  },
  created() {
    this.rightForm.manageid = this.info.userid;
    this.getUserList();
  },
  methods: {
    //获取角色对应人员
    getUserList() {
      // this.form.userid = this.info.isadmin == 1 ? "" : this.info.userid;
      // this.form.managedeptusers = this.info.isadmin == 1 ? "" : "1";
      this.sortColumn(
        { sortable: "none" },
        "/Publics/Common/UserInfo",
        this.form,
        res => {
          this.sortUserChange(res);
        }
      );
    },
    sortUserChange(res) {
      if (res.code == 0) {
        this.userDataList = res.data;
        this.form.count = res.count;
      }
    },
    //左边tabel行单击事件
    tableRowClick(row) {
      this.curRow = row;
      this.rightForm.userid = row.userid;
      this.rightForm.manageid = this.info.isadmin == 1 ? "" : this.info.userid;
      this.$refs.permissions.getAuthInfo(this.rightForm);
    },
    setDate() {
      this.Modal = true;
    },
    permissionsChange(selected, val, list) {
      let Selects = val;
      let operatetype = "C";
      if (selected) {
        operatetype = "C";
      } else {
        operatetype = "D";
      }
      if (this.expirationdate == "" && selected) {
        this.$message.error("请先设置授权期限");
        this.$refs.permissions.getAuthInfo(this.rightForm);
        return;
      }
      let sendData = {
        operatetype: operatetype,
        userid: this.rightForm.userid,
        arraccessid: val,
        expirationdate: this.expirationdate
      };
      this.MK.Request("/Publics/Common/User/Permission", "post", sendData).then(
        res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.msg
            });
            this.$refs.permissions.getAuthInfo();
          }
        }
      );
    }
  }
};
</script>
<style scoped>
>>> .el-date-editor--date {
  width: 150px;
  background: #3f9eff;
}
>>> .el-date-editor--date input {
  background: #3f9eff;
  padding-right: 10px;
  border-radius: 0;
  color:#ffffff;
  border: none;
  border-left: 1px solid #fff;
}
>>> .el-date-editor--date input::-webkit-input-placeholder,
>>> .el-date-editor--date .el-icon-date,
>>> .el-date-editor--date .el-input__suffix{
  color: #ffffff;
}
</style>
