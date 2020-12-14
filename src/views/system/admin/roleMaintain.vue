<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true" class="headerFrom">
        <el-form-item label="院区">
          <mk-select
            v-model="form.hospitalid"
            placeholder="请选择院区"
            url="/Publics/Common/Dic/HospitalInfo"
            :filter="['hospitalname','filterstr']"
            label="hospitalname"
            val="hospitalid"
            @change="RefreshList"
          ></mk-select>
        </el-form-item>
        <el-form-item label="状态">
          <mk-select
            v-model="form.status"
            placeholder="请选择状态"
            :datas="tagList"
            :filter="['label']"
            label="label"
            val="value"
            @change="RefreshList"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.condition"
            style="width:360px"
            @keyup.enter.native="RefreshList"
            placeholder="按名称、输入码进行查询"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" @click="RefreshList">查看</el-button>
            <el-button type="primary" @click="Add">新增</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>
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
        label="角色ID"
        sortable="custom"
        width="100"
        show-overflow-tooltip
        prop="roleid"
      ></el-table-column>
      <el-table-column label="名称" sortable="custom" show-overflow-tooltip prop="rolename"></el-table-column>
      <el-table-column label="角色描述" sortable="custom" show-overflow-tooltip prop="note"></el-table-column>
      <el-table-column
        label="输入码"
        width="100"
        sortable="custom"
        show-overflow-tooltip
        prop="filterstr"
      ></el-table-column>
      <el-table-column label="所属院区" sortable="custom" show-overflow-tooltip prop="hospitalname"></el-table-column>
      <el-table-column
        label="状态"
        width="120"
        align="center"
        sortable="custom"
        show-overflow-tooltip
        prop="crfname"
      >
        <template slot-scope="scope">
          <el-tag
            :type="GetStatusDispaly(scope.row.status)"
            disable-transitions
          >{{ scope.row.status_display }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建人" sortable="custom" width="120" align="center" show-overflow-tooltip prop="createid_display"></el-table-column>
      <el-table-column
        label="创建时间"
        sortable="custom"
        width="180"
        align="center"
        show-overflow-tooltip
        prop="createtime"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="230"
        show-overflow-tooltip
        align="center"
        label-class-name="primary"
        prop="crfname"
      >
        <template slot-scope="scope">
          <div class="textBtn">
            <el-link :underline="false" icon="fa fa-edit" type="primary" @click="edit(scope.row)">编辑</el-link>
            <el-link
              :underline="false"
              icon="mkfont tingyong_line"
              :disabled="scope.row.status != 1"
              type="primary"
              @click="Examine(scope.row,'/Publics/Common/Role','停用','停用',RefreshList,'U')"
            >停用</el-link>
            <el-link
              :underline="false"
              icon="mkfont qiyong"
              type="primary"
              :disabled="scope.row.status == 1"
              @click="Examine(scope.row,'/Publics/Common/Role','启用','启用',RefreshList,'U')"
            >启用</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <vxe-modal
      v-model="Modal"
      :showFooter="true"
      title="角色维护"
      @close="colseModel"
      width="540"
      height="500"
    >
      <el-form :model="operateData" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="operateData.rolename" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="输入码" prop="filterstr">
          <el-input v-model="operateData.filterstr" placeholder="请输入输入码"></el-input>
        </el-form-item>
        <el-form-item label="院区" prop="hospitalid">
          <mk-select
            v-model="operateData.hospitalid"
            placeholder="请选择院区"
            url="/Publics/Common/Dic/HospitalInfo"
            :filter="['hospitalname','filterstr']"
            label="hospitalname"
            val="hospitalid"
          ></mk-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            resize="none"
            :rows="8"
            v-model="operateData.note"
            placeholder="描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="success" @click="submitForm('ruleForm')">提交</el-button>
          <el-button type="warning" @click="colseModel">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
    <template slot="footer">
      <mk-page :pager="form" @query="RefreshList" />
    </template>
  </d2-container>
</template>
<script>
import util from "@/libs/util.js";
export default {
  name: "roleMaintain",
  data() {
    return {
      Modal: false,
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
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        hospitalid: [
          { required: true, message: "请输选择院区", trigger: "change" }
        ]
      },
      operateData: {
        operatetype: "C", //操作类型 部分接口新增修改删除不单独,一个post搞定 C:新增 U:修改 D:删除 默认为C新增
        roleid: "", //角色id
        createid: "", //
        filterstr: "", //输入码
        hospitalid: "", //角色所属的院区
        note: "", //备注
        rolename: "", //
        status: 1 //状态，0：无效 1：有效
      },
      tagList: [
        {
          label: "全部",
          value: "-1"
        },
        {
          label: "停用",
          value: "0"
        },
        {
          label: "正常",
          value: "1"
        }
      ],
      roleList: [{}]
    };
  },
  watch: {
    "operateData.rolename"(val) {
      this.operateData.filterstr = util.py.firstChar(val);
    }
  },
  created() {
    this.RefreshList();
  },
  methods: {
    initOperateData() {
      this.operateData = {
        operatetype: "C", //操作类型 部分接口新增修改删除不单独,一个post搞定 C:新增 U:修改 D:删除 默认为C新增
        roleid: "", //角色id
        createid: this.info.userid, //
        filterstr: "", //输入码
        hospitalid: "", //角色所属的院区
        note: "", //备注
        rolename: "", //
        status: 1 //状态，0：无效 1：有效
      };
    },
    tableRowClick(row) {},
    //获取页面数据
    RefreshList() {
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
    //关闭
    colseModel() {
      this.Modal = false;
      this.initOperateData();
      this.$refs["ruleForm"].resetFields();
    },
    //新增
    Add() {
      this.initOperateData();
      this.Modal = true;
    },
    //编辑
    edit(row) {
      let data = JSON.parse(JSON.stringify(row));
      this.operateData = { ...this.operateData, ...data };
      this.operateData.hospitalid = this.operateData.hospitalid.toString();
      this.operateData.operatetype = "U";
      this.Modal = true;
    },
    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateRole();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //
    updateRole() {
      this.MK.Request("/Publics/Common/Role", "post", this.operateData).then(
        res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.msg
            });
            this.colseModel();
            this.RefreshList();
          }
        }
      );
    }
  }
};
</script>
<style  scoped>
</style>
