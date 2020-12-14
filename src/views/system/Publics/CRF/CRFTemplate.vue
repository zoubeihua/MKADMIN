<template>
  <d2-container>
    <el-container style="padding:10px;height:100%;">
      <el-tabs
        v-model="templatetag"
        @tab-click="handleClick"
        style="height:100%;"
      >
        <el-tab-pane label="我的模板" name="0" style="height:100%;">
          <el-container style="height:100%;">
            <el-header style="padding:0;">
              <el-input
                style="margin-right:10px;width:300px;"
                placeholder="搜索模板"
                v-model="pager.condition"
                clearable
              >
              </el-input>
              <el-button-group>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="TemplateList_Get"
                  >搜索</el-button
                >
                <el-button
                  type="success"
                  icon="el-icon-plus"
                  @click="AddMyTemplate(0)"
                  >添加</el-button
                >
              </el-button-group>
            </el-header>
            <el-main style="padding:0;">
              <el-table
                :data="TemplateTableData"
                height="100%"
                style="width: 100%"
              >
                <el-table-column prop="crfname" label="模板名称">
                  <template slot-scope="scope">
                    <el-link type="primary" @click="preview(scope.row)">{{
                      scope.row.crfname
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="280">
                  <template slot-scope="scope">
                    <div  class="tableBtn">
                      <el-link
                        type="success"
                        @click="Rename(scope.row, '0')"
                        :underline="false"
                        title="重命名"
                         icon="el-icon-tickets"
                        ></el-link
                      >
                      <el-link
                        type="primary"
                        @click="jumpToeCRF(scope.row)"
                        :underline="false"
                        title="编辑"
                         icon="mkfont bianji1"
                        ></el-link
                      >
                      <el-link
                        type="primary"
                        @click="copy(scope.row)"
                        :underline="false"
                        icon="el-icon-document-copy"
                        title="复制"
                        ></el-link
                      >
                      <el-link
                        type="danger"
                        @click="Del(scope.row, '0')"
                        :underline="false"
                        title="删除"
                        icon="mkfont trasch"
                        ></el-link
                      >
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
            <el-footer style="padding:0;">
              <mk-page :pager="pager" @query="TemplateList_Get" />
            </el-footer>
          </el-container>
        </el-tab-pane>
        <el-tab-pane label="系统模板" name="1" v-if="$permission('sys:CRFTemplate:template')" style="height:100%;" >
          <el-container style="height:100%;">
            <el-header style="padding:0;">
              <el-input
                style="margin-right:10px;width:300px;"
                placeholder="搜索模板"
                v-model="pager.condition"
                clearable
              >
              </el-input>
              <el-button-group>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="TemplateList_Get(1)"
                  >搜索</el-button
                >
                <!-- <el-button
                  type="success"
                  icon="el-icon-plus"
                  @click="AddMyTemplate(1)"
                  >添加</el-button
                > -->
              </el-button-group>
            </el-header>
            <el-main style="padding:0;">
              <el-table
                :data="TemplateTableData"
                height="100%"
                style="width: 100%"
              >
                <el-table-column prop="crfname" label="模板名称">
                  <template slot-scope="scope">
                    <el-link type="primary" @click="preview(scope.row)">{{
                      scope.row.crfname
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="300">
                  <template slot-scope="scope">
                    <div class="tableBtn">
                      <el-link
                        type="success"
                        @click="Rename(scope.row, '1')"
                         title="重命名"
                         :underline="false"
                         icon="el-icon-tickets"
                        ></el-link
                      >
                      <el-link
                        type="primary"
                        @click="jumpToeCRF(scope.row)"
                         title="编辑"
                          :underline="false"
                           icon="mkfont bianji1"
                        ></el-link
                      >
                      <el-link
                        type="primary"
                        @click="copy(scope.row)"
                        title="复制"
                        :underline="false"
                        icon="el-icon-document-copy"
                        ></el-link
                      >
                      <el-link
                        type="danger"
                        @click="Del(scope.row, '1')"
                        :underline="false"
                        title="删除"
                        icon="mkfont trasch"
                        ></el-link
                      >
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
            <el-footer style="padding:0;">
              <mk-page :pager="pager" @query="TemplateList_Get" />
            </el-footer>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-container>
		 <vxe-modal v-model="dialogVisible" ref="effectModal" title="添加CRF模板维护" @close="handleClose" :showFooter="true" width="460" height="auto"  >
			 <el-form :model="form" :rules="rules" label-width="100px" ref="ruleForm">
			   <el-form-item label="模板名称" prop="crfname">
			     <el-input
			       v-model="form.crfname"
			       autocomplete="off"
			       clearable
			     ></el-input>
			   </el-form-item>
			 </el-form>
			<div slot="footer" style="text-align:center;">
				<el-button-group>
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="submitForm('ruleForm')"
					  >确 定</el-button>
				</el-button-group>
			</div>
		 </vxe-modal>
    <!-- 预览 -->
    <vxe-modal
      v-model="Modal"
      width="1000"
      height="600"
      :showFooter="true"
      min-width="400"
      min-height="400"
      @close="Modal = false"
    >
      <div slot="header">预览</div>
      <el-container style="border:1px solid #cfd7e5;">
        <el-header
          height="40px"
          style="padding:0;background:#f0f0f0;justify-content: center;"
          >{{ crfname }}</el-header
        >
        <el-main style="padding:0;">
          <div style="width:100%;" class="mask">
            <fm-generate-form
              :edit="false"
              v-if="jsonData.list.length > 0"
              :data="jsonData"
              ref="generateForm"
              :key="jsonData.key"
            ></fm-generate-form>
          </div>
        </el-main>
      </el-container>
      <div slot="footer">
        <el-button type="danger" @click="Modal = false">关闭</el-button>
      </div>
    </vxe-modal>
  </d2-container>
</template>
<script>
import { mapState, mapActions } from "vuex";
import util from "@/libs/util.js";
import * as MKPublic from "@/libs/utilMkPublic.js";
export default {
  name: "CRFTemplate",
  data() {
    return {
      //分页
      pager: {
        count: 0,
        page: 1,
        rows: 20,
        templatetag: "0",
        condition: "", //模糊匹配
        userid: util.cookies.get("uuid"),
        hospitalid: 1
      },
      crfname: "",
      jsonData: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
          customClass: ""
        },
        key: new Date().getTime()
      },
      templatetag: "0",
      operType: "add", //add添加  rename重命名 del删除 copy复制
      form: {
        crfid: "",
        userid: util.cookies.get("uuid"),
        crfname: "",
        templatetag: 0, //(模板标记 0 个人模板 1 系统模板)
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
          customClass: ""
        }
      },
      rules: {
        crfname: [{ required: true, message: "请填写模板名称" }]
      },
      dialogVisible: false,
      Modal: false,
      activeName: "0",
      TemplateTableData: [],
      menuid: ""
    };
  },
  computed: {
    ...mapState("d2admin/user", ["info"])
  },
  created() {
    this.menuid = this.$route.meta.menuid;
    this.TemplateList_Get(0);
  },
  methods: {
    ...mapActions("d2admin/ecrf", [
      "formMaintenanceItemSet",
      "iscrftemplatepageSet"
    ]),
    ...mapActions("d2admin/page", ["menuClickSet"]),
    handleClick(tab) {
      this.pager.condition = "";
      this.TemplateTableData = [];
      this.pager.templatetag = tab.name;
      this.TemplateList_Get(tab.name);
      console.log(tab.name);
    },
    //初始化
    handleClose() {
      this.dialogVisible = false;
      this.$refs.ruleForm.resetFields();
      this.form = {
        crfid: "",
        userid: util.cookies.get("uuid"),
        crfname: "",
        templatetag: "0", //(模板标记 0 个人模板 1 系统模板)
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
          customClass: ""
        }
      };
    },
    //获取模板
    CRFJsonBycrfid_Get(crfid) {
      this.MK.Request(
        "/Publics/CRFTemplateMaintain/CRF_Template_JsonByCRFID_Get",
        "get",
        {
          userid: util.cookies.get("uuid"),
          crfid: crfid,
          formtype:1,
        }
      ).then(res => {
        let resData = res.josnformat;
        this.crfname = resData.crfname;
        this.jsonData.list = resData.list;
        this.$nextTick(() => {
          this.Modal = true;
          this.jsonData.key = new Date().getTime();
        });
      });
    },
    //添加个人模板
    AddMyTemplate() {
      this.dialogVisible = true;
      this.operType = "add";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.CRFDesign_Template_ADD();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    CRFDesign_Template_ADD() {
      let reqStr = "";
      this.form.templatetag = this.templatetag;
      this.form.formtype = 1;
      if (this.operType == "add") {
        reqStr = "/Publics/CRFTemplateMaintain/CRFDesign_Template_ADD";
        this.form.formtype = 1;
      }
      if (this.operType == "rename") {
        reqStr = "/Publics/CRFTemplateMaintain/CRFTemplate_Rename";
      }
      if (this.operType == "del") {
        reqStr = "/Publics/CRFTemplateMaintain/CRFTemplate_Del";
      }
      if (this.operType == "copy") {
        reqStr = "/Publics/CRFTemplateMaintain/CRF_Template_Copy";
      }
      this.MK.Request(reqStr, "post", this.form).then(res => {
        if (this.operType == "add" || this.operType == "rename") {
          this.handleClose();
        }
        this.$message({
          message: res.msg,
          type: "success"
        });
        this.TemplateList_Get(this.templatetag);
      });
    },
    //重命名
    Rename(row, templatetag) {
      this.operType = "rename";
      this.form.crfname = row.crfname;
      this.form.templatetag = templatetag;
      this.templatetag = templatetag;
      this.form.crfid = row.crfid;
      this.dialogVisible = true;
    },
    //删除
    Del(row, templatetag) {
      this.operType = "del";
      this.form.templatetag = templatetag;
      this.templatetag = templatetag;
      this.form.crfid = row.crfid;
      this.$confirm("此操作将永久删除该模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.CRFDesign_Template_ADD(templatetag);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    //复制
    copy(row) {
      this.operType = "copy";
      this.form.crfid = row.crfid;
      this.$confirm("确定要复制该模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.CRFDesign_Template_ADD(1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    //预览
    preview(row) {
      this.CRFJsonBycrfid_Get(row.crfid);
    },
    //跳转crf表单维护页面
    jumpToeCRF(row) {
      row.pageName = "CRFTemplate";
      row.formtype = 1;
      console.log(row);
      this.formMaintenanceItemSet(row);
      //标志从其他页面跳转过来的
      this.menuClickSet(false);
      //设置是否为模板库页面
      this.iscrftemplatepageSet(true);
      this.$router.push({
        path: "/Publics/CRF/crfConfig"
      });
    },
    //获取模板列表
    TemplateList_Get(templatetag) {
      this.MK.Request(
        "/Publics/CRFTemplateMaintain/TemplateList_Get",
        "get",
        this.pager
      ).then(res => {
        this.pager.count = res.count;
        this.TemplateTableData = res.data;
      });
    }
  }
};
</script>
<style scoped>
.d2-layout-header-aside-group
  .d2-layout-header-aside-content
  .d2-theme-container
  .d2-theme-container-main
  .d2-theme-container-main-body
  .container-component
  .d2-container-full
  .d2-container-full__body {
  padding: 20px !important;
}
>>> .el-tabs__content {
  height: calc(100% - 20px);
}
.el-header,
.el-footer {
  padding: 0 !important;
  border: 0;
}
>>> .el-tabs__header {
  margin: 0 !important;
}
.mask {
  position: relative;
}
.mask::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
}
</style>
