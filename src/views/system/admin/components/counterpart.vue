<template>
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
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main style="padding:0;">
      <el-table
        :data="rightTableDataList"
        stripe
        border
        @selection-change="handleSelectionChange"
        :row-class-name="rowStyle"
        @sort-change="(({column}) => {sortColumn(column,'/Publics/Common/Role/Users',rightForm,sortUserChange)})"
        height="100%"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column
          label="人员类型"
          sortable="custom"
          show-overflow-tooltip
          prop="stafftype_display"
        ></el-table-column>
        <el-table-column label="所属院区" sortable="custom" show-overflow-tooltip prop="hospitalname"></el-table-column>
        <el-table-column label="所属科室" sortable="custom" show-overflow-tooltip prop="deptname"></el-table-column>
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
        <el-table-column label="职称" sortable="custom" show-overflow-tooltip prop="jobtitle_display"></el-table-column>
        <el-table-column label="职务" sortable="custom" show-overflow-tooltip prop="position_display"></el-table-column>
        <el-table-column
          label="实习生"
          sortable="custom"
          show-overflow-tooltip
          prop="traineementor_display"
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
      <mk-page :pager="rightForm" @query="getUserList" />
    </el-footer>
  </el-container>
</template>
<script>
export default {
  name: "counterpart",
  props: ["roleid"],
  data() {
    return {
      rightForm: {
        roleid: "",
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
      rightTableDataList: [],
      multipleSelection: []
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
    this.getUserList();
  },
  methods: {
    //获取角色对应人员
    getUserList() {
      this.rightForm.roleid = this.roleid;
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
    handleSelectionChange(val) {
      var arr = [];
      val.forEach((val, index) => {
        this.rightTableDataList.forEach((v, i) => {
          // userid 是每一行的数据userid
          if (val.userid == v.userid) {
            arr.push(i);
          }
        });
      });
      this.multipleSelection = arr;
      this.$emit("change", val);
    },
    //选中样式
    rowStyle({ row, rowIndex }) {
      let arr = this.multipleSelection;
      for (let i = 0; i < arr.length; i++) {
        if (rowIndex === arr[i]) {
          return "selectStyle";
        }
      }
    }
  }
};
</script>
<style>

</style>
