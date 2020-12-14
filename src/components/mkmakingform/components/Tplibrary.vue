<template>
  <vxe-modal
    v-model="TpModal"
    width="1000"
    height="600"
    :showFooter="true"
  >
    <el-container>
      <el-aside width="200px" style="margin-right:10px;border:1px solid #cfd7e5;">
        <el-tabs v-model="activeName" @tab-click="handleClick" style="height:100%">
          <el-tab-pane label="我的模板" name="0" style="height:420px;">
            <el-container style="height:100%;">
              <el-header style="padding:0;"    class="elHeader">
                <el-input
                  style="margin-right:10px;width:140px;"
                  placeholder="搜索模板"
                  size="mini"
                  v-model="pager.condition"
                  clearable>
                </el-input>
                 <el-button type="primary" size="mini" icon="el-icon-search" @click="TemplateList_Get"></el-button>
              </el-header>
              <el-main style="padding:0;">
                <div class="ul">
                  <div
                    class="li"
                    @click="jump(item,index)"
                    :class="{active:index == activeClass}"
                    v-for="(item,index) in TemplateTableData"
                    :key="index"
                  >{{item.crfname}}</div>
                </div>
              </el-main>
            </el-container>
          </el-tab-pane>
          <el-tab-pane label="系统模板" name="1" style="height:420px;">
            <el-container style="height:100%;">
              <el-header style="padding:0;"  class="elHeader">
                <el-input
                  style="margin-right:10px;width:140px;"
                  placeholder="搜索模板"
                  size="mini"
                  v-model="pager.condition"
                  clearable>
                </el-input>
                 <el-button type="primary" size="mini" icon="el-icon-search" @click="TemplateList_Get"></el-button>
              </el-header>
              <el-main style="padding:0;">
                <div class="ul">
                  <div
                    class="li"
                    @click="jump(item,index)"
                    :class="{active:index == activeClass}"
                    v-for="(item,index) in TemplateTableData"
                    :key="index"
                  >{{item.crfname}}</div>
                </div>
              </el-main>
            </el-container>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-container style="border:1px solid #cfd7e5;">
        <el-header
          height="40px"
          style="padding:0;background:#f0f0f0;justify-content: center;"
        >{{crfname}}</el-header>
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
    </el-container>
    <div slot="header">模板库</div>
    <div slot="footer">
       <div style="float:left;">
         <mk-page :pager="pager" @query="TemplateList_Get" />
       </div>
       <div style="float:right;">
          <el-button type="success" @click="saveModal">确认</el-button>
        <el-button type="danger" @click="closeModal">取消</el-button>
       </div>
    </div>
  </vxe-modal>
</template>
<script>
import { mapState, mapActions } from "vuex";
import util from "@/libs/util.js";
export default {
  name: "tp-library",
  props: ["visible", "widgetForm"],
  data() {
    return {
      models: {}, //父组件所有字段标识
      curModels: {}, //
      clashList:[],//记录冲突列表
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
      crfname: "",
      TemplateTableData: [],
      activeClass: -1,
      activeName: "0",
      TpModal: this.visible
    };
  },
  computed: {
    ...mapState("d2admin/user", ["info"])
  },
  created() {
    this.TemplateList_Get();
  },
  mounted() {
    this.generateModel(this.widgetForm.list);
  },
  methods: {
    //处理父组件模板字段标识
    generateModel(genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === "grid" || genList[i].type === "rowmatrix") {
          genList[i].columns.forEach(item => {
            this.generateModel(item.list);
          });
        } else if (genList[i].type === "tabs") {
          genList[i].tabs.forEach(item => {
            this.generateModel(item.list);
          });
        } else {
          if (
            Object.keys(genList[i].options).indexOf("dataBind") < 0 ||
            genList[i].options.dataBind
          ) {
            this.models[genList[i].model] =
              genList[i].type == "table" ? [] : genList[i].options.defaultValue;
          }
        }
      }
      console.log(this.models);
    },
    //处理当前模板字段标识
    curModel(genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === "grid" || genList[i].type === "rowmatrix") {
          genList[i].columns.forEach(item => {
            this.curModel(item.list);
          });
        } else if (genList[i].type === "tabs") {
          genList[i].tabs.forEach(item => {
            this.curModel(item.list);
          });
        } else {
          if (
            Object.keys(genList[i].options).indexOf("dataBind") < 0 ||
            genList[i].options.dataBind
          ) {
            this.curModels[genList[i].model] =
              genList[i].type == "table" ? [] : genList[i].options.defaultValue;
          }
        }
      }

      console.log(this.curModels);
    },
    //根据字段获取控件数据
    getInputData(genList,modelsList){
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === "grid" || genList[i].type === "rowmatrix") {
          genList[i].columns.forEach(item => {
            this.getInputData(item.list,modelsList);
          });
        } else if (genList[i].type === "tabs") {
          genList[i].tabs.forEach(item => {
            this.getInputData(item.list,modelsList);
          });
        } else {
            if(modelsList.indexOf(genList[i].model) >= 0){
              this.clashList.push(genList[i])
            }
          // if(genList[i].type == "table"){

          // }else{

          // }
        }
      }

    },
    //
    handleClick(tab) {
      this.pager.templatetag = tab.name;
      this.TemplateTableData = [];
      this.activeClass = -1;
      this.jsonData.list = [];
      this.crfname = "";
      this.TemplateList_Get(tab.name);
    },
    jump(row, index) {
      this.activeClass = index;
      this.CRFJsonByCRFID_Get(row.crfid);
    },
    //获取模板列表
    TemplateList_Get(TEMPLATETAG) {
      this.MK.Request(
        "/Publics/CRFTemplateMaintain/TemplateList_Get",
        "get",
        this.pager
      ).then(res => {
        this.pager.count = res.count;
        this.TemplateTableData = res.data;
      });
    },
    //获取模板
    CRFJsonByCRFID_Get(crfid) {
      this.curModels = {};
      this.MK.Request(
        "/Publics/CRFTemplateMaintain/CRF_Template_JsonByCRFID_Get",
        "get",
        {
          userid: this.info.userid,
          crfid: crfid,
          formtype:1
        }
      ).then(res => {
        let resData = res.josnformat;
        this.crfname = resData.crfname;
        this.jsonData.list = resData.list;
        this.curModel(this.jsonData.list);
        this.$nextTick(() => {
          this.jsonData.key = new Date().getTime();
        });
      });
    },
    saveModal() {
      let modelsList = Object.keys(this.models);
      let curmodelsList = Object.keys(this.curModels);
      this.clashList = [];
      console.log(modelsList)
      console.log(curmodelsList)
      let flag = true;
      if(modelsList.length > 0){
         curmodelsList.forEach(key => {

          if (modelsList.indexOf(key) >= 0) {
            flag = false;
          } else {
            flag = true;
          }
        });
      }
      if (this.activeClass != -1) {
        if (flag) {
          this.$emit("onchangelist", this.jsonData.list);
          this.TpModal = false;
        } else {
          //记录冲突列表
          this.getInputData(this.widgetForm.list,curmodelsList);
          let str = "";
          this.clashList.forEach(key => {
            str+= `<div><span style="margin-right:10px;">控件名：<span style="color:red;">${key.name}</span></span><br/><span>字段标识：</span><strong style="color:red;">${key.model}</strong></div><hr/>`
          })
          this.$alert(str, '冲突字段列表', {
          dangerouslyUseHTMLString: true,
          customClass:'msgbox'
        });
        }
      } else {
        this.$message.error("请先选择模板");
      }
    },
    closeModal() {
      this.TpModal = false;
    }
  },
  watch: {
    visible(val) {
      this.TpModal = val;
    },
    TpModal(val) {
      this.$emit("update:visible", val);
    }
  }
};
</script>

<style  scoped>
.ul .li {
  display: flex;
  justify-content: center;
  padding: 8px;
  cursor: pointer;
}
.ul .li:hover {
  background: #eee;
}
.ul .li.active {
  background: #409eff;
  color: #fff;
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
>>> .el-tabs__header{
  margin: 0;
}
>>> .el-header{
  padding: 0 !important;
  justify-content: center;
}
.msgbox .el-message-box__message p{
  height: 400px !important;
  overflow-y: auto !important;
}
</style>
