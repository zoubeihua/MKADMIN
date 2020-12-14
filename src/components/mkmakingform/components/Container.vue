<template>
  <el-container class="fm2-container">
    <el-main class="fm2-main">
      <el-container>
        <el-aside width="180px">
          <div class="components-list">
            <template v-if="basicFields.length">
              <div class="widget-cate">基础字段</div>
              <draggable
                tag="ul"
                :list="basicComponents"
                v-bind="{
                  group: { name: 'people', pull: 'clone', put: false },
                  sort: false,
                  ghostClass: 'ghost'
                }"
                @end="handleMoveEnd"
                @start="handleMoveStart"
                :move="handleMove"
              >
                <template v-for="(item, index) in basicComponents">
                  <li
                    v-if="basicFields.indexOf(item.type) >= 0"
                    class="form-edit-widget-label"
                    :class="{ 'no-put': item.type == 'divider' }"
                    @click="handleField(item)"
                    :key="index"
                  >
                    <a>
                      <i class="icon iconfont" :class="item.icon"></i>
                      <span>{{ item.name }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </template>

            <template v-if="advanceFields.length">
              <div class="widget-cate">高级字段</div>
              <draggable
                tag="ul"
                :list="advanceComponents"
                v-bind="{
                  group: { name: 'people', pull: 'clone', put: false },
                  sort: false,
                  ghostClass: 'ghost'
                }"
                @end="handleMoveEnd"
                @start="handleMoveStart"
                :move="handleMove"
              >
                <template v-for="(item, index) in advanceComponents">
                  <li
                    v-if="advanceFields.indexOf(item.type) >= 0"
                    class="form-edit-widget-label"
                    :class="{ 'no-put': item.type == 'table' }"
                    @click="handleField(item)"
                    :key="index"
                  >
                    <a>
                      <i class="icon iconfont" :class="item.icon"></i>
                      <span>{{ item.name }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </template>

            <template v-if="layoutFields.length">
              <div class="widget-cate">布局字段</div>
              <draggable
                tag="ul"
                :list="layoutComponents"
                v-bind="{
                  group: { name: 'people', pull: 'clone', put: false },
                  sort: false,
                  ghostClass: 'ghost'
                }"
                @end="handleMoveEnd"
                @start="handleMoveStart"
                :move="handleMove"
              >
                <template v-for="(item, index) in layoutComponents">
                  <li
                    v-if="layoutFields.indexOf(item.type) >= 0"
                    :class="{ 'Row-Matrix': item.type == 'rowmatrix' }"
                    class="form-edit-widget-label no-put"
                    @click="handleField(item)"
                    :key="index"
                  >
                    <a>
                      <i class="icon iconfont" :class="item.icon"></i>
                      <span>{{ item.name }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </template>
          </div>
        </el-aside>
        <el-container class="center-container" direction="vertical">
          <el-header
            class="btn-bar"
            style="flex-direction: column;align-items: flex-start;justify-content: center;height:auto !important;"
          >
            <div>
              <slot name="action"></slot>
              <el-button
                v-if="upload"
                type="text"
                size="medium"
                :disabled="!isMenuClick && formMaintenanceItem.status == 3"
                icon="el-icon-upload2"
                @click="handleUpload"
                >导入JSON</el-button
              >
              <el-button
                v-if="clearable"
                type="text"
                size="medium"
                :disabled="!isMenuClick && formMaintenanceItem.status == 3"
                class="danger"
                icon="el-icon-delete"
                @click="handleClear"
                >清空</el-button
              >
              <el-button
                v-if="preview"
                type="text"
                size="medium"
                icon="el-icon-view"
                @click="handlePreview"
                >预览</el-button
              >
              <el-button
                v-if="generateJson"
                type="text"
                size="medium"
                :disabled="!isMenuClick && formMaintenanceItem.status == 3"
                icon="el-icon-tickets"
                @click="handleGenerateJson"
                >生成JSON</el-button
              >
              <!-- <el-button
              v-if="generateCode"
              type="text"
              size="medium"
              icon="el-icon-document"
              @click="handleGenerateCode"
              >生成代码</el-button>-->
              <!-- v-if="!isMenuClick" -->
              <el-button
                v-if="formMaintenanceItem.pageName != 'CRFTemplate'"
                type="text"
                size="medium"
                :disabled="!isMenuClick && formMaintenanceItem.status == 3"
                icon="el-icon-document"
                @click="handleSave"
                >保存</el-button
              >
              <el-button
                type="text"
                size="medium"
                :disabled="!isMenuClick && formMaintenanceItem.status == 3"
                icon="el-icon-document"
                @click="handleSaveMoudel"
                >保存为模板</el-button
              >
              <el-button
                v-if="!iscrftemplatepage"
                type="text"
                :disabled="!isMenuClick && formMaintenanceItem.status == 3"
                size="medium"
                icon="el-icon-video-play"
                >发布</el-button
              >
              <el-button
                type="text"
                :disabled="!isMenuClick && formMaintenanceItem.status == 3"
                size="medium"
                icon="el-icon-paperclip"
                @click="quotes"
                >引用模板库</el-button
              >
            </div>
            <div
              style="width:100%;text-align:center;border-top: 1px dashed #ccc;padding-top: 10px;"
              v-if="widgetForm.crfname != ''"
            >
				 <i  
				 :style="{color:formMaintenanceItem.formtype == 1 ? '#46ad26' : '#2d4ab9',fontSize:formMaintenanceItem.formtype == 1 ? '20px' : '28px'}"
				 class="fa"
				 :class="[formMaintenanceItem.formtype == 1 ? 'fa-television' : 'fa-mobile']"
				 :title="formMaintenanceItem.formtype == 1 ? 'PC端' : '移动端'"
				 >
				</i>
              <span style="color:red;font-size:22px;font-weight: bold;">{{
                widgetForm.crfname
              }}</span>
            </div>
          </el-header>
          <el-main
            class="widgetList"
            :class="{ 'widget-empty': widgetForm.list.length == 0 }"
          >
            <widget-form
              v-if="!resetJson"
              ref="widgetForm"
              :data="widgetForm"
              :select.sync="widgetFormSelect"
              @scrollTop="scrollTop"
            ></widget-form>
          </el-main>
        </el-container>

        <el-aside class="widget-config-container">
          <el-container>
            <el-header height="45px">
              <div
                class="config-tab"
                :class="{ active: configTab == 'widget' }"
                @click="handleConfigSelect('widget')"
              >
                字段属性
              </div>
              <div
                class="config-tab"
                :class="{ active: configTab == 'form' }"
                @click="handleConfigSelect('form')"
              >
                表单属性
              </div>
            </el-header>
            <el-main class="config-content">
              <widget-config
                v-show="configTab == 'widget'"
                ref="Scores"
                :list="widgetForm.list"
                :data="widgetFormSelect"
              ></widget-config>
              <form-config
                v-show="configTab == 'form'"
                :data="widgetForm.config"
              ></form-config>
            </el-main>
          </el-container>
        </el-aside>
		
        <cus-dialog
          :visible="previewVisible"
          @on-close="previewVisible = false"
          ref="widgetPreview"
          width="1000px"
          form
        >
			<div style="max-width: 814px;height: auto; margin: 0 auto;background-color: #fff;">
				<generate-form
				  insite="true"
				  v-if="previewVisible"
				  :data="previewForm"
				  :value="widgetModels"
				  :remote="remoteFuncs"
				  ref="generateForm"
				>
				  <template v-slot:blank="scope">
					Width
					<el-input
					  v-model="scope.model.blank.width"
					  style="width: 100px"
					></el-input
					>Height：
					<el-input
					  v-model="scope.model.blank.height"
					  style="width: 100px"
					></el-input>
				  </template>
				</generate-form>
		</div>
		
         
          <template slot="action">
            <el-button type="primary" @click="handleTest">获取数据</el-button>
            <el-button @click="handleReset">重置</el-button>
          </template>
        </cus-dialog>

        <cus-dialog
          :visible="uploadVisible"
          @on-close="uploadVisible = false"
          @on-submit="handleUploadJson"
          ref="uploadJson"
          width="800px"
          form
        >
          <el-alert
            type="info"
            title="JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可"
          ></el-alert>
          <code-editor
            height="800px"
            mode="json"
            v-model="jsonEg"
          ></code-editor>
        </cus-dialog>

        <cus-dialog
          :visible="jsonVisible"
          @on-close="jsonVisible = false"
          ref="jsonPreview"
          width="800px"
          form
        >
          <code-editor
            height="800px"
            mode="json"
            v-model="jsonTemplate"
          ></code-editor>

          <template slot="action">
            <el-button
              type="primary"
              class="json-btn"
              :data-clipboard-text="jsonCopyValue"
              >复制</el-button
            >
          </template>
        </cus-dialog>

        <cus-dialog
          :visible="codeVisible"
          @on-close="codeVisible = false"
          ref="codePreview"
          width="800px"
          form
        >
          <el-tabs
            type="border-card"
            style="box-shadow: none;"
            v-model="codeActiveName"
          >
            <el-tab-pane label="Vue Component" name="vue">
              <code-editor
                height="800px"
                mode="html"
                v-model="vueTemplate"
              ></code-editor>
            </el-tab-pane>
            <el-tab-pane label="HTML" name="html">
              <code-editor
                height="800px"
                mode="html"
                v-model="htmlTemplate"
              ></code-editor>
            </el-tab-pane>
          </el-tabs>

          <template slot="action">
            <el-button
              type="primary"
              class="code-btn"
              :data-clipboard-text="codeCopyValue"
              >复制</el-button
            >
          </template>
        </cus-dialog>
        <!-- 模板库 -->
        <tp-library
          :visible.sync="libraryModel"
          @onchangelist="onchangelist"
          :widgetForm.sync="widgetForm"
          v-if="libraryModel"
        ></tp-library>
        <vxe-modal
          v-model="ModalCRFNameConfig"
          title="设置"
          width="800"
          height="400"
          min-width="200"
          min-height="200"
          resize
          :showFooter="true"
        >
          <el-form
            :model="widgetForm"
            ref="ruleForm"
            :rules="rules"
            label-width="80px"
          >
            <!--  -->
            <el-form-item label="模板名称" prop="crfname">
              <el-input v-model="widgetForm.crfname"></el-input>
            </el-form-item>
            <el-form-item label="模板类型">
              <el-radio-group v-model="widgetForm.templatetag">
                <el-radio label="0">个人模板</el-radio>
                <el-radio label="1" v-permission="'sys:crfConfig:template'" >系统模板</el-radio>
                <!--  -->
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" style="text-align:center;">
            <el-button @click="closeCRF">关闭</el-button>
            <el-button type="primary" @click="submitCRFForm('ruleForm')"
              >确定</el-button
            >
          </div>
        </vxe-modal>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import util from "@/libs/util.js";
import * as MKPublic from "@/libs/utilMkPublic.js";
import bus from "@lib/util.bus";
import Draggable from "vuedraggable";
import WidgetConfig from "./WidgetConfig";
import FormConfig from "./FormConfig";
import WidgetForm from "./WidgetForm";
import CusDialog from "./CusDialog";
import TpLibrary from "./Tplibrary";
import GenerateForm from "./GenerateForm";
import Clipboard from "clipboard";
import CodeEditor from "../components/CodeEditor";
import {
  basicComponents,
  layoutComponents,
  advanceComponents
} from "./componentsConfig.js";
import { loadJs, loadCss } from "../util/index.js";
import { EventBus } from "../util/event-bus.js";
import request from "../util/request.js";
import generateCode from "./generateCode.js";
import _ from "lodash";
import Vue from "vue";
import api from "@/api";

export default {
  name: "fm-making-form",
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    CusDialog,
    TpLibrary,
    GenerateForm,
    CodeEditor
  },
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    generateCode: {
      type: Boolean,
      default: false
    },
    generateJson: {
      type: Boolean,
      default: false
    },
    upload: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    basicFields: {
      type: Array,
      default: () => [
        "input",
        "textarea",
        "number",
        "radio",
        "checkbox",
        "time",
        "date",
        "rate",
        "color",
        "select",
        "switch",
        "slider",
        "text",
        "html"
      ]
    },
    advanceFields: {
      type: Array,
      default: () => [
        "blank",
        "fileupload",
        "imgupload",
        "editor",
        "cascader",
        "table"
      ]
    },
    layoutFields: {
      type: Array,
      default: () => ["grid", "tabs", "divider"]
    }
  },
  inject: ["reload"],
  data() {
    return {
      libraryModel: false, //模板库状态
      ModalCRFNameConfig: false,
      basicComponents,
      layoutComponents,
      advanceComponents,
      resetJson: false,
      widgetForm: {
        crfid: "", //表单id
        crfname: "", //表单名称
        userid: util.cookies.get("uuid"), //创建人id
        formtype: "1", //表单类型 1 PC端 2 移动端
        list: [], //控件列表
        templatetag: "0",
        config: {
          //表单配置
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
          customClass: "",
		  headerImg:'http://cdn1.wenjuan.com/appear-PC-满意度.png'
        }
      },
      rules: {
        crfname: [
          { required: true, message: "请输入模板名称", trigger: "blur" }
        ]
      },
      previewForm: {},
      configTab: "widget",
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      uploadVisible: false,
      remoteFuncs: {
        func_test(resolve) {
          setTimeout(() => {
            const options = [
              { id: "1", name: "1111" },
              { id: "2", name: "2222" },
              { id: "3", name: "3333" }
            ];

            resolve(options);
          }, 2000);
        },
        funcGetToken(resolve) {
          request
            .get("http://tools-server.xiaoyaoji.cn/api/uptoken")
            .then(res => {
              resolve(res.uptoken);
            });
        },
        upload_callback(response, file, fileList) {
          console.log("callback", response, file, fileList);
        }
      },
      widgetModels: {},
      blank: "",
      htmlTemplate: "",
      jsonTemplate: "",
      vueTemplate: "",
      uploadEditor: null,
      jsonCopyValue: "",
      jsonClipboard: null,
      jsonEg: `{
  "list": [],
  "config": {
    "labelWidth": 100,
    "labelPosition": "top",
    "size": "small",
	customClass: "",
	headerImg:'http://cdn1.wenjuan.com/appear-PC-满意度.png',
	footerImg:'https://crm.weilaihos.com:12015/Images/EventPic/HDXYSbottom.png'
  }
}`,
      codeCopyValue: "",
      codeClipboard: null,
      codeActiveName: "vue",
      menuid: ""
    };
  },
  computed: {
    ...mapState("d2admin/user", ["info"]),
    ...mapState("d2admin/ecrf", [
      "formMaintenanceItem",
      "iscrftemplatepage",
      "crfid",
      "rateOptions"
    ]),
    ...mapState("d2admin/page", ["isMenuClick"])
  },
  // beforeDestroy() {
  //   let _this = this;
  //   bus.$off("isMenuClick", _this.reload());

  // },
  created() {
    this._loadComponents();
  },
  mounted() {
    let _this = this;
    this.widgetForm.userid = this.info.userid;
    bus.$on("isMenuClick", function() {
      _this.reload();
    });
    if (!this.isMenuClick) {
      this.setWidForm();
    }
  },
  methods: {
    ...mapActions("d2admin/ecrf", ["wgeCRFDataSet", "rateOptionsSet"]),
    setWidForm() {
      this.widgetForm.crfid = this.formMaintenanceItem.crfid;
      this.widgetForm.crfname = this.formMaintenanceItem.crfname;
      this.widgetForm.formtype = this.formMaintenanceItem.formtype || 1;
      this.widgetForm.templatetag = this.formMaintenanceItem.templatetag + "";
      this.CRFJsonByCRFID_Get();
    },
    //模板引用回调
    onchangelist(list) {
      let widgetList = JSON.parse(JSON.stringify(this.widgetForm));
      if (this.widgetForm.list.length > 0) {
        widgetList.list = [...this.widgetForm.list, ...list];
      } else {
        widgetList.list = list;
      }
      this.setJSON(widgetList);
    },
    _loadComponents() {
      this.basicComponents = this.basicComponents.map(item => {
        return {
          ...item
        };
      });
      this.advanceComponents = this.advanceComponents.map(item => {
        return {
          ...item
        };
      });
      this.layoutComponents = this.layoutComponents.map(item => {
        return {
          ...item
        };
      });
    },
    //监听滚动
    scrollTop() {
      // setTimeout(() => {
      // let scrollTop = this.$el.querySelector('.widgetList')
      // console.log(scrollTop.scrollTop)
      // scrollTop.scrollTop = scrollTop.scrollHeight
      // }, 13)
    },
    //关闭设置模板名称窗口
    closeCRF() {
      this.ModalCRFNameConfig = false;
      this.crfname = "";
    },
    //引用
    quotes() {
      this.libraryModel = true;
    },
    //提交模板
    submitCRFForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.CRFDesign_Template_ADD();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //提交保存为模板接口
    CRFDesign_Template_ADD() {
      console.log(this.widgetForm);
      let opert = "";
      if (this.formMaintenanceItem.pageName == "CRFTemplate") {
        opert = "/Publics/CRFTemplateMaintain/CRFDesign_Template_ADD";
      } else {
        opert = "CRFDesign_Template_ADD";
      }
      this.MK.Request(opert, "post", this.widgetForm).then(res => {
        this.$message.success(res.msg);
        this.AddScoreOptions(); //保存评分
        this.ModalCRFNameConfig = false;
      });
    },
    //提交模板接口
    eCRFToDB(formtype) {
      // this.widgetForm.formtype = this.formMaintenanceItem.formtype || 1;
      this.widgetForm.formtype = formtype;
     return this.MK.Request(
        "/Publics/CRFMaintain/CRFDesign_ADD",
        "post",
        this.widgetForm
      )
			// .then(res => {
   //      this.$message.success(res.msg);
   //      this.AddScoreOptions();
   //      // this.ModalCRFNameConfig = false;
   //    });
    },
    //保存模板按钮
    handleSaveMoudel() {
      this.ModalCRFNameConfig = true;
    },
    //保存按钮
    handleSave() {
		let str = 'PC'
		if(this.formMaintenanceItem.formtype != 1) {
			str = 'PC'
		}else{
			str = '移动'
		}
		this.$confirm('是否同时保存'+str+'端?', '提示', {
		  confirmButtonText: '是',
		  cancelButtonText: '否',
		  type: 'warning'
		}).then(async () => {
			let type = this.formMaintenanceItem.formtype == 1 ? 2 : 1;
			let res = await this.eCRFToDB(this.formMaintenanceItem.formtype);
			if(res.code == 0){
				let result = await this.eCRFToDB(type);
				this.$message.success(res.msg);
				this.AddScoreOptions();
			}
		}).catch(async () => {
				let result = await this.eCRFToDB(this.formMaintenanceItem.formtype);
				if(result.code == 0){
					this.$message.success(result.msg);
					this.AddScoreOptions();
				}
				
		});
     
    },
    //保存评分
    AddScoreOptions() {
      const crfid = this.crfid;
      const scoreoptions = this.rateOptions;
      api.ScoreOptions_Add({ crfid, scoreoptions }).then(res => {});
    },
    //获取模板
    CRFJsonByCRFID_Get() {
      let opert = "";
      if (this.formMaintenanceItem.pageName == "CRFTemplate") {
        //根据CRFID获取模板对应的Json数据 从模板库跳转过来
        opert = "/Publics/CRFTemplateMaintain/CRF_Template_JsonByCRFID_Get";
      } else {
        opert = "/Publics/CRFMaintain/josnformatBycrfid"; //根据CRFID获取节点对应的Json数据 从CRF表单页面维护跳转过来
      }
      this.MK.Request(opert, "get", {
        formtype: this.formMaintenanceItem.formtype || 1,
        userid: this.info.userid,
        crfid: this.widgetForm.crfid,
        templatetag: this.widgetForm.templatetag + ""
      }).then(res => {
        let templatetag=this.widgetForm.templatetag;
        let resData = res.josnformat;
        if (resData.crfid) {
			resData.crfname = this.widgetForm.crfname;
			this.widgetForm.config = resData.config;
			this.setJSON(resData,templatetag);
        }
      });
    },
    handleGoGithub() {
      // window.location.href = "https://github.com/GavinZhuLei/vue-form-making";
    },
    handleConfigSelect(value) {
      this.configTab = value;
    },
    handleMoveEnd(evt) {
      console.log("end", evt);
    },
    handleMoveStart({ oldIndex }) {
      console.log("start", oldIndex, this.basicComponents);
    },
    handleMove() {
      return true;
    },
    handlePreview() {
      console.log(this.widgetForm);
      this.previewForm = _.cloneDeep(this.widgetForm);
      console.log(this.previewForm)
      this.previewVisible = true;
    },
    handleReset() {
      this.$refs.generateForm.reset();
    },
    handleTest() {
      this.$refs.generateForm
        .getData()
        .then(data => {
          this.jsonVisible = true;
          this.jsonTemplate = data;
          this.$nextTick(() => {
            if (!this.jsonClipboard) {
              this.jsonClipboard = new Clipboard(".json-btn");
              this.jsonClipboard.on("success", e => {
                this.$message.success("复制成功");
              });
            }
            this.jsonCopyValue = JSON.stringify(data);
          });
          this.$refs.widgetPreview.end();
        })
        .catch(e => {
          this.$message.error(e);
          this.$refs.widgetPreview.end();
        });
    },
    handleGenerateJson() {
      this.jsonVisible = true;
      this.jsonTemplate = this.widgetForm;
      this.$nextTick(() => {
        if (!this.jsonClipboard) {
          this.jsonClipboard = new Clipboard(".json-btn");
          this.jsonClipboard.on("success", e => {
            this.$message.success("复制成功");
          });
        }
        this.jsonCopyValue = JSON.stringify(this.widgetForm);
      });
    },
    handleGenerateCode() {
      this.codeVisible = true;
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm), "html");
      this.vueTemplate = generateCode(JSON.stringify(this.widgetForm), "vue");
      this.$nextTick(() => {
        if (!this.codeClipboard) {
          this.codeClipboard = new Clipboard(".code-btn");
          this.codeClipboard.on("success", e => {
            this.$message.success("复制成功");
          });
        }
        this.codeCopyValue =
          this.codeActiveName == "vue" ? this.vueTemplate : this.htmlTemplate;
      });
    },
    handleUpload() {
      this.uploadVisible = true;
    },
    handleUploadJson() {
      try {
        this.setJSON(this.jsonEg);
        this.uploadVisible = false;
      } catch (e) {
        this.$message.error(e.message);
        this.$refs.uploadJson.end();
      }
    },
    handleClear() {
      if (this.widgetForm.list.length != 0) {
        this.$confirm("确定要清空吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "清空成功!"
            });
            this.rateOptionsSet([]);
            this.widgetForm.list = [];
            // this.widgetForm = {
            //   crfid: "",//表单id
            //   crfname: "",//表单名称
            //   userid: util.cookies.get("uuid"),//创建人id
            //   formtype: "",//表单类型 1 PC端 2 移动端
            //   list: [],//控件列表
            //   config: {//表单配置
            //     labelWidth: 100,
            //     labelPosition: "right",
            //     size: "small",
            //     customClass: ""
            //   }
            // };
            if (!this.isMenuClick) {
              this.widgetForm.userid = this.info.userid;
              this.widgetForm.crfid = this.formMaintenanceItem.crfid;
              this.widgetForm.crfname = this.formMaintenanceItem.crfname;
              this.widgetForm.templatetag =
                this.formMaintenanceItem.templatetag + "";
            }
            this.widgetFormSelect = {};
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消清空"
            });
          });
      } else {
        this.$message({
          type: "error",
          message: "没有需要清空的内容"
        });
      }
    },
    getJSON() {
      return this.widgetForm;
    },
    getHtml() {
      return generateCode(JSON.stringify(this.widgetForm));
    },
    setJSON(json,templatetag) {
      if (typeof json === "string") {
        json = JSON.parse(json);
      }
      this.widgetForm = json;
      this.widgetForm.templatetag=templatetag;
      if (json.list.length > 0) {
        this.widgetFormSelect = json.list[0];
      }
    },
    handleInput(val) {
      this.blank = val;
    },
    handleField(item) {
      EventBus.$emit("on-field-add", item);
    }
  },
  watch: {
    widgetForm: {
      deep: true,
      handler: function(val) {
        // this.generateModel(val.list)
        // console.log(this.$refs.widgetForm);
      }
    },
    $lang: function(val) {
      this._loadComponents();
    },
    codeActiveName(val) {
      this.codeCopyValue =
        this.codeActiveName == "vue" ? this.vueTemplate : this.htmlTemplate;
    }
  }
};
</script>

<style lang="scss">
.widget-empty {
  background-position: 50%;
}

.custom1 .el-col {
  border: 1px solid #ccc;
  overflow: hidden;
  padding: 5px;
  // margin-right:-1px;
  // margin-bottom:-1px;
  margin-right: -1px;
  margin-bottom: -1px;
}
.custom .el-col {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
.components-list .form-edit-widget-label {
  float: none !important;
  width: 90% !important;
  margin: 4% auto !important;
}
</style>
