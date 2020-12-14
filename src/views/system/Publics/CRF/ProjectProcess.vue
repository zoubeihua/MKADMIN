<template>
  <d2-container class="page">
    <template slot="header">
      <el-button-group class="d2-mt-10 d2-mb-10">
        <el-button type="warning" icon="el-icon-video-play" @click="playProject">发布</el-button>
        <el-button type="info" disabled>
          当前为
          <span style="color:red;">66</span> 状态
        </el-button>
      </el-button-group>
    </template>
    <el-container>
      <el-container>
        <el-aside width="200px">
          <el-scrollbar style="height:100%;" ref="scrollbar">
            <div class="mk-design-warp clearfix">
              <div class="mk-design-menu">
                <div class="mk-design-scroll">
                  <div
                    class="mk-circle-item"
                    v-for="(item,index) in circleMenu"
                    @click="editCircle(item)"
                    :key="item.processid"
                  >
                    <div class="mk-scroll-item-top" v-if="index != 0">
                      <a class="mk-btn btn-circl white mk-item-time-title" @click.stop="edit(item)">
                        <span>
                          {{item.followup}}{{item.followupunitdisplay}}
                          <span
                            v-if="item.followup != ''"
                          >±</span>
                          {{item.changefollowup}}{{item.changefollowupunitdisplay}}
                        </span>
                        <d2-icon name="pencil" style="color:#40C23A" />
                      </a>
                    </div>
                    <div class="mk-scroll-item-cont" :class="[active == index ? 'active' : '']">
                      <a
                        class="mk-btn mk-btn-circl white"
                        :class="[active == index ? 'mk-green' : '']"
                        @click="steps(item,index)"
                      >
                        <el-tooltip :content="item.processname" placement="left">
                          <span class="mk-scroll-item-title">{{item.processname}}</span>
                        </el-tooltip>
                      </a>
                      <span class="mk-flag" v-if="active == index"></span>
                    </div>
                  </div>
                  <div class="mk-design-position">
                    <a class="mk-btn mk-btn-circle" @click="plus">
                      <i class="el-icon-circle-plus-outline" style="color:#499c03;"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <el-table
            border
            :data="tableData"
            height="100%"
            highlight-current-row
            @row-click="tableRowClick"
            :row-class-name="tableRowClassName"
          >
            <el-table-column type="index" width="60" align="center" fixed="left">
              <template slot="header">
                <el-button icon="el-icon-plus" size="mini" type="primary" circle @click="addCRF"></el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="processid"
              label="流程ID"
              width="100"
              :show-overflow-tooltip="true"
              align="center"
              v-if="false"
            ></el-table-column>
            <el-table-column
              prop="processname"
              label="节点名称"
              width="100"
              :show-overflow-tooltip="true"
              align="center"
              v-if="false"
            ></el-table-column>
            <el-table-column
              prop="crfid"
              label="crfid"
              width="100"
              :show-overflow-tooltip="true"
              align="center"
              v-if="false"
            ></el-table-column>
            <el-table-column
              prop="researchid"
              label="科研ID"
              width="100"
              :show-overflow-tooltip="true"
              align="center"
              v-if="false"
            ></el-table-column>
            <el-table-column
              prop="templatetag"
              label="模板标记"
              width="100"
              :show-overflow-tooltip="true"
              align="center"
              v-if="false"
            ></el-table-column>
            <el-table-column
              prop="orderno"
              label="序号"
              width="100"
              :show-overflow-tooltip="true"
              v-if="false"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="crfid"
              label="crfid"
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="crfname"
              label="CRF名称"
              width="450"
			  label-class-name="primary"
              :show-overflow-tooltip="true"
              align="center"
            >
              <template slot-scope="scope">
                <a
                  style="border-bottom: 1px solid blue;color:blue;cursor: pointer;"
                  @click.stop="see(scope.row)"
                >{{scope.row.crfname}}</a>
              </template>
            </el-table-column>

            <el-table-column
              prop="selfreporte"
              label="患者自报"
              width="120"
              :show-overflow-tooltip="true"
              align="center"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.selfreporte === '1' ? 'primary' : 'warning'"
                  disable-transitions
                >{{scope.row.selfreporte==='1'?'是':'否'}}</el-tag>
              </template>
            </el-table-column>

            <el-table-column
              prop="formtypedispaly"
			  label-class-name="primary"
              label="表单类型"
              width="120"
              :show-overflow-tooltip="true"
              align="center"
            >
              <template slot-scope="scope">
                <i
                  @click="jump(scope.row,key.bzcode)"
                  v-for="(key,index) in getDicStandarDcode('表单类型')"
                  :key="index"
                  class="fa"
                  :class="[key.bzcode == 1 ? 'fa-television' : 'fa-mobile']"
                  style="font-size: 20px;color:#46ad26;padding:0 10px;cursor: pointer;"
                  :style="{color:key.bzcode == 1 ? '#46ad26' : '#2d4ab9',fontSize:key.bzcode == 1 ? '20px' : '28px'}"
                  :title="key.bzname"
                ></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="note"
              label="备注"
              width="550"
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column fixed="right" label-class-name="primary" label="操作" width="200" align="center">
              <template slot-scope="scope">
                <div class="tableBtn">
                  <el-link
                    title="编辑"
                    @click="editCRF(scope.row)"
                    :underline="false"
                    type="primary"
                    icon="mkfont bianji1"
                  ></el-link>
                  <el-link
                    title="删除"
                    @click="Examine(scope.row,'/Publics/EDCItemProcess/CRFForm_Post','删除','删除',refreshList,'D')"
                    :underline="false"
                    type="danger"
                    icon="mkfont trasch"
                  ></el-link>
                  <el-link
                    title="上移"
                    @click="MoveUp(scope.$index,scope.row,tableData,'crfid','orderno',refreshList,'/Publics/EDCItemProcess/CRFForm_UpAndDown')"
                    :underline="false"
                    type="primary"
                    icon="mkfont shangyi"
                  ></el-link>
                  <el-link
                    title="下移"
                    @click="MoveDow(scope.$index,scope.row,tableData,'crfid','orderno',refreshList,'/Publics/EDCItemProcess/CRFForm_UpAndDown')"
                    :underline="false"
                    type="primary"
                    icon="mkfont xiayi"
                  ></el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <vxe-modal
      v-model="Modal"
      title="设置随访间隔"
      width="600"
      height="auto"
      :showFooter="true"
      @close="close"
    >
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="随访周期" prop="followup">
          <el-input
            clearable
            placeholder
            v-model="form.followup"
            :disabled="status.value == 3 || status.value == 4"
            class="input-with-select"
          >
            <mk-select
              slot="append"
              v-model="form.followupunit"
              :datas="getDicStandarDcode('随访周期')"
              label="bzname"
              val="bzcode"
              :disabled="status.value == 3 || status.value == 4"
            ></mk-select>
          </el-input>
        </el-form-item>
        <el-form-item label="随访浮动" prop="changefollowup">
          <el-input
            clearable
            placeholder
            v-model="form.changefollowup"
            :disabled="status.value == 3 || status.value == 4"
            class="input-with-select"
          >
            <mk-select
              slot="append"
              v-model="form.changefollowupunit"
              :datas="getDicStandarDcode('随访周期')"
              label="bzname"
              val="bzcode"
              :disabled="status.value == 3 || status.value == 4"
            ></mk-select>
          </el-input>
        </el-form-item>
        <el-form-item label="随访名称" prop="processname">
          <el-input
            clearable
            v-model="form.processname"
            :disabled="status.value == 3 || status.value == 4"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="表单条件" prop="INCONDITION">
          <el-input clearable v-model="form.INCONDITION"></el-input>
        </el-form-item>-->
        <!-- <el-form-item>
          <el-button @click="close">关闭</el-button>
          <el-button type="danger" @click="researchItem_Process_Del" :disabled="STATUS.value == 3 || STATUS.value == 4">删除</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" :disabled="STATUS.value == 3 || STATUS.value == 4">确定</el-button>
        </el-form-item>-->
      </el-form>
      <div slot="footer" style="text-align:center;">
		  <el-button-group >
			<el-button @click="close">关闭</el-button>
			<el-button
			  type="danger"
			  @click="researchItem_Process_Del"
			  :disabled="status.value == 3 || status.value == 4 || form.processid == ''"
			>删除</el-button>
			<el-button
			  type="primary"
			  @click="submitForm('ruleForm')"
			  :disabled="status.value == 3 || status.value == 4"
			>确定</el-button>
		</el-button-group >
      </div>
    </vxe-modal>

    <vxe-modal v-model="ModalCRF" :title="title" :showFooter="true" width="540" height="auto">
      <div slot="title">
        <span>{{title}}</span>
        <span class="danger">[ {{formCRF.processname}} ]</span>
      </div>
      <el-form ref="ruleCRFForm" :model="formCRF" :rules="rulesCRF" label-width="120px">
        <el-form-item label="CRF名称" prop="crfname">
          <el-input clearable v-model="formCRF.crfname"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="MO">
          <el-input clearable type="textarea" v-model="formCRF.note"></el-input>
        </el-form-item>
        <el-form-item label="患者自报">
          <el-checkbox v-model="formCRF.selfreporte" true-label="1" false-label="0"></el-checkbox>
        </el-form-item>
      </el-form>
	  <div slot="footer" style="text-align:center;">
	  	<el-button-group >
	  		<el-button @click="closeCRF">关闭</el-button>
	  		<el-button type="primary" @click="submitCRFForm('ruleCRFForm')">确定</el-button>
	  	</el-button-group>
		</div>
    </vxe-modal>
       <!-- 预览 -->
    <vxe-modal
      v-model="seeModal"
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
           <el-scrollbar style="height:100%;">
            <div style="width:100%;" class="mask">
              <fm-generate-form
                :edit="false"
                v-if="jsonData.list.length > 0"
                :data="jsonData"
                ref="generateForm"
                :key="jsonData.key"
              ></fm-generate-form>
          </div>
           </el-scrollbar>
        </el-main>
      </el-container>
      <div slot="footer">
        <el-button type="danger" @click="seeModal = false">关闭</el-button>
      </div>
    </vxe-modal>
  </d2-container>
</template>
<script>
import { mapState, mapActions } from "vuex";
import util from "@/libs/util.js";
export default {
  name: "ProjectProcess",
  components: {},
  computed: {
    ...mapState("d2admin/user", ["info"]),
    ...mapState("d2admin/ecrf", ["STATUS"])
  },
  data() {
    return {
      status: {},
      tableData: [],
      seeModal:false,
      Modal: false,
      ModalCRF: false,
      title: "",
      processid: "", //
      researchid: "10000100", //科研ID
      processname: "", //节点名称
      crfname:"",
      crfid: "", //crfid
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
      formCRF: {
        operatetype: "C", //(新增(C) 编辑(U) 删除(D))
        crfid: "-1",
        createid: "", //创建人id
        crfname: "", //crf表单名称
        note: "", //描述
        processid: "", //
        researchid: "", //科研id
        processname: "", //
        selfreporte: "0", //0 非患者自报 1 患者自报
        status: "1" //备注信息
      },
      form: {
        operatetype: "C", //新增(C) 编辑(U) 删除(D))
        researchid: "10000100", //科研id
        processid: "",
        processname: "", //流程名称
        orderno: "-1", //序号
        createuserid: "", //创建人id
        checkuserid: "", //审核人id
        fatherprocessid: "", //父级流程id
        followupunit: "1", //随访周期单位
        followup: "", //随访周期
        changefollowup: "", //浮动随访周期
        changefollowupunit: "1", //浮动随访周期单位
        status: 1 //状态 新建传(1) 【1:审核通过 2 审核不通过 99 删除】
      },
      rules: {
        processname: [
          { required: true, message: "流程名称不能为空", trigger: "blur" }
        ],
        followup: [
          { required: true, message: "随访周期不能为空", trigger: "blur" },
          { pattern: /^\+?[1-9]\d*$/, message: "必须大于0且正整数" }
        ],
        changefollowup: [
          { required: true, message: "浮动随访周期不能为空", trigger: "blur" },
          { pattern: /^\+?[1-9]\d*$/, message: "必须大于0且正整数" }
        ]
      },
      rulesCRF: {
        crfname: [
          { required: true, message: "CRF名称不能为空", trigger: "blur" }
        ],
        datacrfid: [
          { required: true, message: "DATAcrfid不能为空", trigger: "blur" }
        ]
      },
      active: -1,
      circleMenu: []
    };
  },
  async mounted() {
    this.initForm();
    await this.$store.dispatch("d2admin/ecrf/load", { root: true });
    this.researchItem_Process_Get(this.form);
  },
  methods: {
    ...mapActions("d2admin/ecrf", [
      "formMaintenanceItemSet",
      "iscrftemplatepageSet"
    ]),
    ...mapActions("d2admin/page", ["menuClickSet"]),
    initForm() {
      this.form = {
        operatetype: "C", //新增(C) 编辑(U) 删除(D))
        researchid: this.researchid, //科研id
        processid: "",
        processname: "", //流程名称
        orderno: "-1", //序号
        createuserid: this.info.userid, //创建人id
        fatherprocessid: "", //父级流程id
        followupunit: "1", //随访周期单位
        followup: "", //随访周期
        changefollowup: "", //浮动随访周期
        changefollowupunit: "1", //浮动随访周期单位
        status: 1
      };
    },
    initFormCRF() {
      this.formCRF = {
        operatetype: "C", //(新增(C) 编辑(U) 删除(D))
        crfid: "-1",
        createid: this.info.userid, //创建人id
        crfname: "", //crf表单名称
        note: "", //描述
        processid: "", //
        researchid: this.researchid, //科研id
        processname: "", //
        selfreporte: "0", //0 非患者自报 1 患者自报
        status: "1" //备注信息
      };
    },
    //发布项目
    playProject() {
      this.MK.Request("ItemProcessRelease", "post", {
        researchid: this.researchid
      }).then(async res => {
        this.$message({
          type: "success",
          message: res.msg
        });
        await this.$store.dispatch("d2admin/ecrf/load", { root: true }); //更新科研项目状态
        this.researchItem_Process_Get(this.form);
      });
    },
    steps(data, index) {
      this.active = index;
      if (this.circleMenu.length == 1) {
        this.Modal = true;
        this.form = data;
      }
    },
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    //跳转
    jump(row, type) {
      row.pageName = "ProjectProcess";
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
    see(row) {
      this.crfname = row.crfname;
      this.CRFJsonBycrfid_Get(row.crfid);
    },
      //获取模板
    CRFJsonBycrfid_Get(crfid) {
      this.MK.Request(
        "/Publics/CRFMaintain/josnformatBycrfid",
        "get",
        {
          crfid: crfid,
          formtype:1,
        }
      ).then(res => {
        let resData = res.josnformat;
        this.crfname = resData.crfname;
        this.jsonData.list = resData.list;
        this.$nextTick(() => {
          this.seeModal = true;
          this.jsonData.key = new Date().getTime();
        });
      });
    },
    //编辑CRF表单;
    editCRF(row) {
      this.formCRF = JSON.parse(JSON.stringify(row)); //深度复制;
      this.formCRF.operatetype = "U";
      this.ModalCRF = true;
      this.title = "修改表单";
    },
    //单击表单事件
    tableRowClick(row, column, event) {},
    //刷新表单
    refreshList() {
      var basicinfo = {
        processid: this.processid,
        researchid: this.researchid
      };
      this.MK.Request(
        "/Publics/EDCItemProcess/CRFFormByPROCESSID_Get",
        "GET",
        basicinfo
      ).then(res => {
        this.tableData = res.data;
      });
    },
    addCRF() {
      //选择流程节点,添加CRF表单;
      if (this.processid == "" || this.processid == undefined) {
        this.$message({
          type: "error",
          message: "请选择流程节点!"
        });
        return;
      }
      this.title = "新增表单";
      this.ModalCRF = true;
    },
    editCircle(item) {
      this.initFormCRF();
      this.processid = item.processid;
      this.researchid = this.researchid;
      this.processname = item.processname;
      this.crfid = ""; //
      this.formCRF.crfid = "";
      this.formCRF.crfname = "";
      this.formCRF.processname = item.processname;
      this.formCRF.processid = item.processid;
      this.formCRF.selfreporte = "0";
      this.formCRF.note = "";
      this.refreshList();
    },
    //删除CRF
    delCRF(row) {
      if (row.crfid == "" || row.crfid == undefined) {
        this.$message({
          type: "error",
          message: "请选中表单进行删除!"
        });
        return;
      }
      var basicinfo = {
        userid: this.info.createuserid,
        processid: this.processid,
        researchid: this.researchid,
        processname: this.processname
      };

      this.$confirm(
        "确定要删除表单:" + this.formCRF.crfname + ", 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.MK.Request("CRFForm_Del", "post", {
            ...this.formCRF,
            ...basicinfo
          }).then(res => {
            this.$message({
              type: "success",
              message: res.msg
            });
            this.refreshList(); //刷新table
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    closeCRF() {
      this.ModalCRF = false;
    },
    GetStutasType(STATUS) {
      //给状态加type;
      var type = "";
      if (STATUS == "移动端") {
        //审核不通过
        type = "danger";
      } else if (STATUS == "PC端") {
        //审核通过
        type = "success";
      } else {
        type = "primary";
      }
      return type;
    },
    submitCRFForm(formName) {
      //CRF保存提交
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.CRFForm_Post();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    CRFForm_Post() {
      this.MK.Request(
        "/Publics/EDCItemProcess/CRFForm_Post",
        "post",
        this.formCRF
      ).then(res => {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.ModalCRF = false; //关闭窗口;
        this.refreshList(); //刷新table
      });
    },
    plus() {
      this.Modal = true;
      this.initForm();
    },
    edit(data) {
      this.Modal = true;
      this.form = JSON.parse(JSON.stringify(data));
      this.form.operatetype = "U";
      this.form.status = 1;
    },
    close() {
      this.$refs["ruleForm"].clearValidate();
      this.Modal = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ResearchItemProcess_Post();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //添加节点
    ResearchItemProcess_Post() {
      this.MK.Request(
        "/Publics/EDCItemProcess/ResearchItemProcess_Post",
        "post",
        this.form
      ).then(res => {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.close();
        this.researchItem_Process_Get(this.form);
      });
    },
    //删除节点
    researchItem_Process_Del() {
      this.form.operatetype = "D";
      this.ResearchItemProcess_Post();
    },
    //获取节点
    researchItem_Process_Get({ researchid }) {
      this.MK.Request(
        "/Publics/EDCItemProcess/ResearchItemProcessList_Get",
        "get",
        { researchid }
      ).then(res => {
        this.circleMenu = res.data;
        if(this.form.operatetype == "C"){
          let elm = this.$refs.scrollbar.wrap;
          this.$nextTick(() => {
            elm.scrollTop = elm.scrollHeight;
          })
        }
      });
    }
  }
};
</script>
<style  scoped>
.clearfix:after,
.clearfix:before {
  content: " ";
  display: table;
}
*,
:after,
:before {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.mk-design-warp {
  height: 100%;
}
.mk-design-warp .mk-design-menu {
  width: 200px;
  height: auto;
  background-color: #f7f8fb;
  float: left;
  padding-top: 20px;
}
.mk-design-scroll {
  text-align: center;
}
.mk-design-scroll .mk-scroll-item-cont {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.white {
  background: #fff;
}
.mk-scroll-item-top .btn-circl {
  border-radius: 25px !important;
}
.mk-scroll-item-top .mk-item-time-title {
  position: relative;
}
.mk-design-scroll .mk-scroll-item-cont .mk-flag {
  position: absolute;
  top: 50%;
  right: 0;
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-right: 20px solid #fff;
  margin-top: -20px;
}
.mk-btn {
  margin-bottom: 0;
  font-weight: 400;
  text-align: center;
  touch-action: manipulation;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  padding: 6px 12px;
}
.active .mk-green {
  background: #32c5d2;
  color: #fff !important;
}

.mk-btn-circl,
.mk-design-position .mk-btn-circle {
  display: inline-block;
  width: 102px;
  height: 102px;
  border-radius: 50% !important;
  box-sizing: border-box;
  font-size: 40px;
}
.mk-design-scroll .mk-scroll-item-title {
  display: block;
  font-size: 14px;
  line-height: 88px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
.mk-circle-item .mk-scroll-item-top {
  padding-top: 40px;
  padding-bottom: 40px;
  position: relative;
}
.mk-scroll-item-cont .mk-btn,
.mk-scroll-item-top .mk-btn {
  color: #666;
}
.mk-circle-item .mk-scroll-item-top:before {
  content: " ";
  width: 4px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 50%;
  background-color: #e9ecf3;
  margin-left: -2px;
}
.mk-design-position {
  text-align: center;
  padding: 0 0 20px 0;
  position: relative;
}
.mk-design-position,
.mk-design-position .mk-btn-circle {
  display: flex;
  justify-content: center;
  align-items: center;
}
.mk-btn {
  transition: all 0.5s;
}
.mk-scroll-item-cont .mk-btn:hover {
  background-color: rgba(208, 208, 208, 0.8);
}
.el-select {
  width: 130px !important;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff !important;
}
.el-main {
  padding: 5px;
}
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>
