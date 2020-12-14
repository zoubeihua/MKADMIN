<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true">
        <el-form-item>
          <el-input
            style="width:300px;"
            @keyup.enter.native="CRFForm_Get"
            v-model="pager.condition"
            placeholder="查询"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="CRFForm_Get">查询</el-button>
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="Add">添加</el-button>
           </el-button-group>
        </el-form-item>
      </el-form>
    </template>
    <el-table
    :data="CRFList"
    stripe
    border
    @row-click="tableRowClick"
    highlight-current-row
    @sort-change='(({column}) => {sortColumn(column,"/Publics/CRFMaintain/CRFForm_Get",pager,sortChange)})'
    height="100%">
      <el-table-column label="CRFID" width="160" show-overflow-tooltip prop="crfid">
        <template></template>
      </el-table-column>
      <el-table-column label="CRF名称" sortable show-overflow-tooltip prop="crfname">
        <!-- <template slot-scope="scope">
          <el-link type="primary" @click="jump(scope.row)">{{scope.row.crfname}}</el-link>
        </template>-->
      </el-table-column>
      <el-table-column
        sortable="custom"
        label="状态"
        width="120"
        show-overflow-tooltip
        align="center"
        prop="statusdispaly"
      >
        <template slot-scope="scope">
          <el-tag
            :type="GetStatusDispaly(scope.row.status)"
            disable-transitions
          >{{ scope.row.statusdispaly }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="表单类型"

        width="120"
        show-overflow-tooltip
        align="center"
        prop="crfname"
      >
        <template slot-scope="scope">
          <i
            @click="jump(scope.row,key.bzcode)"
            v-for="(key,index) in formList"
            :key="index"
            class="fa"
            :class="[key.bzcode == 1 ? 'fa-television' : 'fa-mobile']"
            style="font-size: 20px;color:#46ad26;padding:0 10px;cursor: pointer;"
            :style="{color:key.bzcode == 1 ? '#46ad26' : '#2d4ab9',fontSize:key.bzcode == 1 ? '20px' : '28px'}"
            :title="key.bzname"
          ></i>
        </template>
      </el-table-column>
      <el-table-column label="创建人" sortable="custom" show-overflow-tooltip align="center" prop="createname">
        <template></template>
      </el-table-column>
      <el-table-column label="创建时间" sortable="custom" show-overflow-tooltip align="center" prop="createtime">
        <template></template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot="header">
          <span class="primary">操作</span>
        </template>
        <template slot-scope="scope">
          <div class="tableBtn">
            <el-link
              :title="scope.row.status != 1 ? '通过' : '拒绝'"
              @click="Examine(scope.row)"
              :underline="false"
              :type="scope.row.status != 1 ?'primary':'danger'"
              :icon="scope.row.status != 1 ? 'mkfont qiyong' : 'mkfont tingyong_line'"
              :disabled="scope.row.status == 3 || scope.row.status == 99"
            ></el-link>
            <el-link
              title="编辑"
              @click="Edit(scope.row)"
              :underline="false"
              type="primary"
              icon="mkfont bianji1"
              :disabled="scope.row.status == 3 || scope.row.status == 99"
            ></el-link>
            <el-link
              title="删除"
              @click="CRFForm_Del(scope.row)"
              :underline="false"
              type="danger"
              :disabled="scope.row.status == 3 || scope.row.status == 99"
              icon="mkfont trasch"
            ></el-link>
            <el-link
              title="上移"
              @click="MoveUp(scope.$index,scope.row)"
              :underline="false"
              type="primary"
              :disabled="scope.row.status == 3 || scope.row.status == 99"
              icon="mkfont shangyi"
            ></el-link>
            <el-link
              title="下移"
              @click="MoveDow(scope.$index,scope.row)"
              :underline="false"
              type="primary"
              :disabled="scope.row.status == 3 || scope.row.status == 99"
              icon="mkfont xiayi"
            ></el-link>
            <el-link
              title="发布"
              @click="CRFForm_Release(scope.row)"
              :underline="false"
              type="primary"
              :disabled="scope.row.status != 1"
              :icon="scope.row.status != 3 ? 'el-icon-video-play' : 'el-icon-video-pause'"
            ></el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <mk-page :pager="pager" @query="CRFForm_Get" />
    </template>
    <vxe-modal v-model="AddCRFDataModal" :showFooter="true" title="CRF维护" width="540" height="auto">
      <el-form :model="fromData" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="CRF名称" prop="crfname">
          <el-input v-model="fromData.crfname" placeholder="请输入CRF名称"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            resize="none"
            :rows="8"
            v-model="fromData.note"
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
  </d2-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import pageStatus from "@/minxins/pagestatus.js";
export default {
  name: "formMaintenance",
  mixins: [pageStatus],
  computed: {},
  data() {
    return {
      AddCRFDataModal: false,
      pager: {
        condition: "", //查询条件
        tag: "0", //1 不分页,查询所有 0:分页 (默认:0)
        count: 0,
        page: 1,
        rows: 20
      },
      submitType: 0, // 0提交  1编辑
      fromData: {
        crfid: "",
        crfname: "",
        createid: "",
        checkid: "",
        announcerid: "",
        orderno: 0,
        note: "",
        status: 0
      },
      formList: [],
      curRow: {}, //当前点击行数据
      rules: {
        crfname: [{ required: true, message: "请输入CRF名称", trigger: "blur" }]
      },
      CRFList: []
    };
  },
  computed: {},
  created() {
    this.formList = this.getDicStandarDcode("表单类型");
    this.CRFForm_Get();
  },
  methods: {
    ...mapActions("d2admin/ecrf", [
      "formMaintenanceItemSet",
      "iscrftemplatepageSet"
    ]),
    ...mapActions("d2admin/page", ["menuClickSet"]),
    //跳转
    jump(row, type) {
      row.pageName = "formMaintenance";
      row.formtype = type;
      this.formMaintenanceItemSet(row);
      //标志从其他页面跳转过来的
      this.menuClickSet(false);
      //设置是否为模板库页面
      this.iscrftemplatepageSet(false);
      this.$router.push({
        path: "/Publics/CRF/crfConfig"
      });
    },
    //行点击
    tableRowClick(row, column, event) {
      this.curRow = JSON.parse(JSON.stringify(row)); //深度复制;
    },
    //关闭弹窗
    colseModel() {
      this.AddCRFDataModal = false;
      this.submitType = 0;
      this.fromData = {
        crfid: "",
        crfname: "",
        createid: "",
        checkid: "",
        announcerid: "",
        orderno: 0,
        note: "",
        status: 0
      };
    },
    Add() {
      this.AddCRFDataModal = true;
      this.submitType = 0;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.submitType == 0) {
            this.CRFForm_ADD();
          } else {
            this.CRFForm_Edit();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //获取/Publics/CRFMaintain/CRFForm_Get
    CRFForm_Get() {
      this.sortColumn({sortable:'none'},"/Publics/CRFMaintain/CRFForm_Get",this.pager,res => {
        this.sortChange(res);
      });
    },
    sortChange(res){
      if (res.code == 0) {
        this.CRFList = res.data;
        this.pager.count = res.count;
      }
    },
    //添加
    CRFForm_ADD() {
      this.fromData.createid = this.info.userid;
      this.fromData.status = 0;
      this.MK.Request(
        "/Publics/CRFMaintain/CRFForm_ADD",
        "post",
        this.fromData
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.colseModel();
          this.CRFForm_Get();
        }
      });
    },
    //编辑
    Edit(row) {
      this.AddCRFDataModal = true;
      this.submitType = 1;
      this.fromData = JSON.parse(JSON.stringify(row));
    },
    //
    CRFForm_Edit() {
      this.fromData.createid = this.info.userid;
      this.MK.Request(
        "/Publics/CRFMaintain/CRFForm_Edit",
        "post",
        this.fromData
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.colseModel();
          this.CRFForm_Get();
        }
      });
    },
    //删除
    CRFForm_Del(row) {
      this.$confirm(`确认要删除, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.MK.Request("/Publics/CRFMaintain/CRFForm_Del", "post", row).then(
            res => {
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: res.msg
                });
                this.colseModel();
                this.CRFForm_Get();
              }
            }
          );
        })
        .catch(() => {});
    },
    //审核
    Examine(row) {
      let str = "通过";
      let cloneRow = JSON.parse(JSON.stringify(row));
      str = cloneRow.status != 1 ? "通过" : "拒绝";
      cloneRow.status = row.status != 1 ? 1 : 2;
      this.$confirm(`确认要${str}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.MK.Request(
            "/Publics/CRFMaintain/CRFForm_Check",
            "post",
            cloneRow
          ).then(res => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: res.msg
              });
              this.colseModel();
              this.CRFForm_Get();
            }
          });
        })
        .catch(() => {});
    },
    //上移
    MoveUp(index, row) {
      if (index == 0) {
        this.$message({
          type: "error",
          message: "当前为第一行,不能上移!"
        });
        return;
      }
      var PreRow = this.CRFList[index - 1];
      this.CRFMoveUpAndDown(row, PreRow);
    },
    //下移
    MoveDow(index, row) {
      if (index + 1 == this.CRFList.length) {
        this.$message({
          type: "error",
          message: "当前为最后一行,不能下移!"
        });
        return;
      }
      var NextRow = this.CRFList[index + 1];
      this.CRFMoveUpAndDown(row, NextRow);
    },
    //
    CRFMoveUpAndDown(Currentrow, NextRow) {
      var basicinfo = {
        currentcrfid: Currentrow.crfid,
        currentorderno: Currentrow.orderno,
        nextcrfid: NextRow.crfid,
        nextorderno: NextRow.orderno
      };
      //CRF编辑
      this.MK.Request(
        "/Publics/CRFMaintain/CRFMoveUpAndDown",
        "post",
        basicinfo
      ).then(res => {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.CRFForm_Get(); //刷新table
      });
    },
    //发布 /Publics/CRFMaintain/CRFForm_Release
    CRFForm_Release(row) {
      let curRow = JSON.parse(JSON.stringify(row));
      curRow.status = 3;
      this.$confirm(`确认要发布, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.MK.Request(
            "/Publics/CRFMaintain/CRFForm_Release",
            "post",
            curRow
          ).then(res => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: res.msg
              });
              this.CRFForm_Get();
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style  scoped>
</style>
