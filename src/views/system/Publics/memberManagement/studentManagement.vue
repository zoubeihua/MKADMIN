<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true">
        <el-form-item>
          <el-select
            style="width:300px"
            placeholder="按学校查询"
            :clearable="true"
            v-model="query.forgid"
            filterable
          >
            <el-option
              v-for="item in schoolList"
              :key="item.orgid"
              :label="item.orgname"
              :value="item.orgid"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="classList.length">
          <el-select
            style="width:300px"
            :disabled="!query.forgid"
            :placeholder="query.forgid ? '请选择班级' : '请先选择学校'"
            :clearable="true"
            v-model="query.orgid"
            @change="refreshList"
			filterable
          >
            <el-option
              v-for="item in classList"
              :key="item.orgid"
              :label="item.orgname"
              :value="item.orgid"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            class="mr20"
            style="width:300px"
            type="text"
            clearable
            v-model="pager.condition"
            @keyup.enter.native="refreshList"
            placeholder="按学生姓名 / 学号查询"
          />
        </el-form-item>
        <el-form-item style="margin-right: 20px;">
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refreshList">查询</el-button>
            <el-button type="warning" icon="el-icon-refresh" @click="handleClear">清空</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item style="margin-right: 20px;">
          <el-button-group>
            <el-button
              v-permission="'sys:studentManagement:add'"
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="handleAddMember"
            >新增</el-button>
            <el-button
              v-permission="'sys:studentManagement:export'"
              style="width:80px;"
              icon="el-icon-download"
              type="success"
              @click="handleMemberDataExport"
            >导出</el-button>
            <el-button
              v-permission="'sys:studentManagement:import'"
              style="width:80px;"
              icon="el-icon-upload"
              type="warning"
              @click="handleMemberDataImport"
            >导入</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-download" @click="handlePrintQRCODE">打印二维码</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>
    <SplitPane :min-percent="15" :default-percent="85" split="vertical">
      <template slot="paneL">
        <d2-container>
          <el-table
            :data="tableData"
            border
            height="100%"
            stripe
            :header-cell-style="cellStyle"
            :highlight-current-row="true"
            @row-click="handleRowClickL"
            ref="tableM"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              show-overflow-tooltip
              sortable
              label="学校"
              align="center"
              prop="forgname"
            />
            <el-table-column
              show-overflow-tooltip
              sortable
              label="班级"
              align="center"
              prop="orgname"
            />
            <el-table-column
              show-overflow-tooltip
              sortable
              label="学号"
              align="center"
              prop="cardno"
            />
            <el-table-column
              sortable
              show-overflow-tooltip
              label="学生姓名"
              align="center"
              prop="membername"
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
                      :class="['mkfont', scope.row.sex == 1 ? 'nan' : scope.row.sex == 2 ? 'nv' : 'weizhi']"
                      :style="{ color: scope.row.sex == 1 ? '#6DCEFA' : scope.row.sex == 2 ? '#F37E7D' : '' }"
                    ></i>
                  </el-tooltip>
                  <span style="min-width:60px;display:inline-block;">{{ scope.row.membername }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip sortable align="center" label="年龄" prop="age" />
            <el-table-column
              show-overflow-tooltip
              sortable
              label="出生日期"
              align="center"
              :formatter="
								i => {
									return dateFormatSpec(i, 'birthday');
								}
							"
            />
            <el-table-column
              show-overflow-tooltip
              sortable
              label="家长手机"
              align="center"
              prop="mobiletel"
              :formatter="
								i => {
									return PhoneFormat(i, 'mobiletel');
								}
							"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="操作"
              align="center"
              fixed="right"
              label-class-name="ChangeColor"
            >
              <template slot-scope="scope">
                <div class="tableBtn">
                  <el-link
                    v-permission="'sys:memberManagement:edit'"
                    title="信息补充"
                    :underline="false"
                    type="primary"
                    @click="handleMemberMsgSupplement(scope.row)"
                  >
                    <i class="mkfont bianji1"></i>
                  </el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <template slot="footer">
            <mk-page :pager="pager" @query="refreshList" />
          </template>
        </d2-container>
      </template>
      <template slot="paneR">
        <d2-container>
          <el-table
            :data="tableDataR"
            border
            height="100%"
            stripe
            :highlight-current-row="true"
            :header-cell-style="cellStyle"
            @row-click="handleRowClickR"
          >
            <el-table-column
              show-overflow-tooltip
              sortable
              label="检查时间"
              align="center"
              :formatter="
								i => {
									return dateFormatSpec(i, 'collectionid');
								}
							"
            />
            <el-table-column width="80" label="操作" align="center" label-class-name="ChangeColor">
              <template slot-scope="scope">
                <div class="tableBtn">
                  <el-link
                    @click="handleCheck(scope.row)"
                    title="筛查表查看"
                    :underline="false"
                    type="warning"
                    icon="el-icon-tickets"
                  ></el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </d2-container>
      </template>
    </SplitPane>
    <vxe-modal
      v-model="qrCodeModal"
      title="打印二维码"
      width="1400"
      @close="close"
      height="auto"
      :remember="true"
      :show-footer="true"
    >
      <div class="qrcode-grid" id="print">
        <div
          style="margin-right: 30px;"
          v-for="(item, index) in multipleSelection"
          :key="item.memberid"
        >
          <div class="qrcode" ref="qrcode" :id="item.memberid"></div>
          <div style="text-align: center;">{{ item.membername }}</div>
          <div style="text-align: center; font-size: 12px;">{{ item.cardno }}</div>
        </div>
      </div>
      <div slot="footer" class="footer">
        <el-button-group>
          <el-button type="primary" v-print="'#print'">打印</el-button>
          <el-button type="warning" @click="qrCodeModal = false">关闭</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
    <vxe-modal v-model="importModal" title="导入" width="800" height="540" :show-footer="true">
      <el-steps style="width: 300px;margin: 0 auto;" :active="active" finish-status="success">
        <el-step title="下载模板" @click.native="handleImportStep(0)"></el-step>
        <el-step title="导入数据" @click.native="handleImportStep(1)"></el-step>
      </el-steps>
      <template v-if="active === 0">
        <el-form
          style="width:400px ;margin: 30px auto;"
          :model="templateInfo"
          :rules="rules"
          ref="importModal"
          label-width="60px"
        >
          <el-form-item label="学校" prop="schoolid">
            <el-select
              style="width:260px"
              placeholder="按学校查询"
              :clearable="true"
              v-model="templateInfo.schoolid"
              @change="handleChangeSchool"
            >
              <el-option
                v-for="item in schoolList"
                :key="item.orgid"
                :label="item.orgname"
                :value="item.orgid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="班级" prop="classid">
            <el-select
              style="width:260px"
              clearable
              :disabled="!templateInfo.schoolid"
              :placeholder="templateInfo.schoolid ? '请选择班级' : '请先选择学校'"
              :clearable="true"
              v-model="templateInfo.classid"
            >
              <el-option
                v-for="item in classList"
                :key="item.orgid"
                :label="item.orgname"
                :value="item.orgid"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              style="width: 260px ;margin-left: 0px;"
              type="primary"
              icon="el-icon-download"
              @click="handleDownloadTep"
            >下载模板</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template v-if="active === 1">
        <el-upload
          class="upload-demo"
          style="width: 380px;height: 300px; margin: 0 auto;"
          drag
          action="#"
          :http-request="httpRequest"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过2MB</div>
        </el-upload>
      </template>
      <div slot="footer" class="footer">
        <el-button-group>
          <el-button type="warning" @click="importModal = false">关闭</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
    <el-dialog :visible.sync="checkModal" ref="checkModal" fullscreen>
      <div slot="title">
        查看筛查表 - [
        <span
          style="color:red;"
        >学生姓名：{{ curRowData.membername }} 性别：{{ curRowData.sex_dispalay }} 年龄：{{ curRowData.age }}</span>
        ]
      </div>
      <div style="height: 100%;position: relative;">
        <d2-container-frame :src="checkUrl" ref="iframe"></d2-container-frame>
      </div>
    </el-dialog>
    <!-- 会员注册 -->
    <member-register
      :userData.sync="userdata"
      cardLabel="学号"
      registerTyle="学生"
      :method="MemberInfo_Get"
      ref="memberregister"
    />
  </d2-container>
</template>

<script>
import QRCode from "qrcodejs2"; // 引入qrcode
import pageStatus from "@/minxins/pagestatus.js";
import utils from "@/minxins/util.js";
import imgUpload from "@/components/mk-form/Upload/index.vue";
import MemberRegister from "@/components/mk-custom-components/mk-memberRegister/index.vue";
export default {
  mixins: [pageStatus, utils],
  name: "studentManagement",
  computed: {
    isHospitalid() {
      if (this.templateInfo.schoolid) {
        return "/Publics/Common/Dic/HospitalOrgan";
      } else {
        return "";
      }
    },
    isQuery() {
      if (this.query.forgid) {
        return "/Publics/Common/Dic/HospitalOrgan";
      } else {
        return "";
      }
    }
  },
  data() {
    return {
      qrcode: "",
      qrCodeModal: false,
      importModal: false,
      checkModal: false,
      active: 0,
      checkUrl: "",
      templateInfo: {
        schoolid: "",
        classid: ""
      },
      schoolList: [],
      classList: [],
      rules: {
        schoolid: [
          { required: true, message: "请选择学校", trigger: "change" }
        ],
        classid: [{ required: true, message: "请选择班级", trigger: "change" }]
      },
      multipleSelection: [],
      tepList: [],
      printList: [],
      userdata: {},
      query: {
        queryStatus: "",
        queryMemberLv: [],
        queryMemberType: "",
        queryRegDate: [],
        orgid: "",
        forgid: ""
      },
      myCustomer: "", //我的客户
      pastShipFee: "", // 会费近期
      curRowData: {}, // 当前行
      inputShort: "280px", // 下拉框宽度
      memberLevelSelect: [],
      customManagerList: [],
      changeManagerForm: {
        curManager: ""
      },
      // 会员信息表格
      tableData: [],
      tableDataR: [],
      pager: {
        count: 0,
        page: 1,
        rows: 80,
        CONDITION: ""
      },
      exportTabel: {
        columns: [
          {
            label: "学号",
            prop: "cardno"
          },
          {
            label: "学生姓名",
            prop: "membername"
          },
          {
            label: "性别",
            prop: "sex"
          },
          {
            label: "年龄",
            prop: "age"
          },
          {
            label: "出生日期",
            prop: "birthday"
          },
          {
            label: "家长手机",
            prop: "mobiletel"
          }
          // }
        ]
      }
    };
  },
  components: {
    imgUpload,
    MemberRegister
  },
  created() {
    this.Memberlevel_Get();
    this.schoolByAccount_get();
  },
  methods: {
    // 表格行排序
    rowSort(a, b) {
      let sort1 = a.memberlevel;
      let sort2 = b.memberlevel;
      return sort1 - sort2;
    },
    // 分页刷新 c查询
    refreshList() {
      if (this.query.orgid == "") {
        this.$message.warning("请选择班级！");
        return;
      }

      if (this.query.forgid && this.classList.length) {
        this.MemberInfo_Get();
      } else if (!this.classList.length) {
        this.$message.error("无对应班级管理权限！");
      } else {
        this.$message.warning("请选择学校！");
      }
    },
    // 清空查询条件
    handleClear() {
      this.query = {
        queryStatus: "",
        queryMemberLv: [],
        queryMemberType: "",
        queryRegDate: []
      };
      this.pager.condition = "";
      this.myCustomer = false;
      this.pastShipFee = false;
    },
    //
    handleChangeSchool(val) {
      this.templateInfo.classid = "";
      this.classByAccount_get(val);
    },
    // 查看筛查表
    handleCheck(row) {
      this.checkModal = true;
      this.checkUrl = row.uri + "&zoom";
      this.$nextTick(() => {
        let iframe = this.$refs.iframe.$el.querySelector(".d2-container-frame");
        if (iframe.attachEvent) {
          iframe.attachEvent("onload", () => {
            // iframe加载完毕以后执行操作
            console.log("iframe已加载完毕attachEvent");
          });
        } else {
          iframe.onload = () => {
            // iframe加载完毕以后执行操作
            console.log("iframe已加载完毕");
          };
        }
      });
    },
    // 新增会员按钮
    handleAddMember() {
      if (this.classList.length) {
        this.$refs.memberregister.open();
        this.$refs.memberregister.init();
      } else {
        this.$message.error("无对应班级管理权限！");
      }
    },
    handleImportStep(step) {
      this.active = step;
    },
    handleChangeTep() {},
    handleSelectionChange(val) {
      this.printList = [];
      this.multipleSelection = val;
    },
    // 打印二维码
    handlePrintQRCODE() {
      if (!this.multipleSelection.length) {
        this.$message.warning("请选择要打印的学生！");
        return;
      }
      this.qrCodeModal = true;
      this.$nextTick(() => {
        var el = document.querySelectorAll(".qrcode");
        for (var j = 0; j < this.multipleSelection.length; j++) {
          document.querySelectorAll(".qrcode")[j].innerHTML = "";
          new QRCode(el[j], {
            text: this.multipleSelection[j].stuqrcode, // 需要转换为二维码的内容
            width: 100,
            height: 100,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
          });
        }
      });
    },
    close() {},
    // 会员数据导出
    handleMemberDataExport() {
      if (this.query.forgid && this.classList.length) {
        this.MK.Request("Publics/MemberManage/BasicInfo", "get", {
          createuserid: this.info.userid,
          flgstudent: 1,
          tag: 1
        }).then(res => {
          this.exportExcel(res.data);
        });
      } else if (!this.classList.length) {
        this.$message.error("无对应班级管理权限！");
      } else {
        this.$message.warning("请选择学校！");
      }
    },
    // 导入
    handleMemberDataImport() {
      if (this.classList.length) {
        this.importModal = true;
        this.$refs.importModal.clearValidate();
      } else {
        this.$message.error("无对应班级管理权限！");
      }
    },
    // 上传文件
    httpRequest(data) {
      console.log(data);
      const isXlsx =
        data.file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const isLt2M = data.file.size / 1024 / 1024 < 2;
      if (!isXlsx) {
        this.$message.error("只能上传xlsx文件!");
      } else if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 2MB!");
      } else {
        // 转base64
        this.getBase64(data.file).then(resBase64 => {
          this.fileBase64 = resBase64.split(",")[1]; //直接拿到base64信息
          this.MK.Request("/Publics/MemberManage/Student/Import", "post", {
            xlsxBase64String: resBase64.split(",")[1]
          }).then(res => {
            if (res.code == 0) {
              this.$message.success(`文件上传成功，${res.msg}`);
              this.MemberInfo_Get();
            }
          });
        });
      }
    },
    // 根据当前账号获取学校数据
    schoolByAccount_get() {
      let arr = this.info.listhospitalinfo[0].listorgan;
      this.schoolList = arr.filter(item => {
        if (item.isdept == "0") {
          return item;
        }
      });
      this.query.forgid = this.schoolList[0].orgid;
      if (this.schoolList.length == 1) {
        this.query.forgid = this.schoolList[0].orgid;
        this.templateInfo.schoolid = this.schoolList[0].orgid;
      }
    },
    // 根据当前账号的学校获取班级数据
    classByAccount_get(schoolid) {
      let arr = this.info.listhospitalinfo[0].listorgan.filter(item => {
        if (item.isdept == "1") {
          return item;
        }
      });
      this.classList = arr.filter(item => {
        if (item.forgid == schoolid) {
          return item;
        }
      });
    },
    //
    getBase64(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        let fileResult = "";
        reader.readAsDataURL(file); //开始转
        reader.onload = function() {
          fileResult = reader.result;
        }; //转 失败
        reader.onerror = function(error) {
          reject(error);
        }; //转 结束  咱就 resolve 出去
        reader.onloadend = function() {
          resolve(fileResult);
        };
      });
    },
    //
    handleDownloadTep() {
      this.$refs.importModal.validate(valid => {
        if (valid) {
          this.MK.Request("/Publics/MemberManage/Student/Template", "get", {
            orgid: this.templateInfo.schoolid,
            orgdeptid: this.templateInfo.classid
          }).then(res => {
            // 返回的base64转xlsx，创建a链接下载
            var raw = window.atob(res.result.xlsxBase64String);
            var uInt8Array = new Uint8Array(raw.length);
            for (var i = 0; i < raw.length; i++) {
              uInt8Array[i] = raw.charCodeAt(i);
            }
            const link = document.createElement("a");
            const blob = new Blob([uInt8Array], {
              type: "application/vnd.ms-excel"
            });
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", res.result.xlsxFileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
        }
      });
    },
    exportExcel(data) {
      this.$export
        .excel({
          columns: this.exportTabel.columns,
          data: data,
          title: "会员列表"
          //header: ['卡号','名字'],
          //merges: this.merges
        })
        .then(() => {
          this.$message("导出表格成功");
        });
    },
    handleRowClickL(row) {
      console.log(row);
      row.isRecharge = true;
      this.curRowData = row;
      this.checkInfo_Get(row.memberid);
    },
    handleRowClickR(row) {},
    // 会员信息补充
    handleMemberMsgSupplement(row) {
      this.userdata = row;
      this.$refs.memberregister.open();
      this.$refs.memberregister.isNewMember = false;
      this.$refs.memberregister.isSubmitBasicInfo = true;
      this.$refs.memberregister.MemberInfoByid_Get(row.memberid);
    },
    // 表格列头样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.labelClassName == "ChangeColor") {
        return "color:#409EFF";
      } else {
        return "";
      }
    },
    Memberlevel_Get() {
      this.MK.Request("Publics/MemberManage/Memberlevel", "get", {
        condition: "",
        page: 1,
        rows: 10,
        tag: 1
      }).then(res => {
        this.memberLevelSelect = res.data.map(item => {
          item.isCheck = false;
          return item;
        });
      });
    },
    MemberInfo_Get() {
      // let isPerms = this.$permission('sys:memberManagement:queryallmemberData');
      this.MK.Request("Publics/MemberManage/BasicInfo", "get", {
        createuserid: this.info.userid,
        mycustomer: 0,
        expirationdaysmemberfee: this.pastShipFee ? 1 : 0,
        regdatebegin:
          this.query.queryRegDate != null ? this.query.queryRegDate[0] : "",
        regdatesend:
          this.query.queryRegDate != null ? this.query.queryRegDate[1] : "",
        levelidarr: this.query.queryMemberLv,
        orgid: this.query.orgid,
        forgid: this.query.forgid,
        sourceid: 4,
        condition: this.pager.condition,
        page: this.pager.page,
        rows: this.pager.rows,
        tag: 0,
        flgstudent: 1,
        orderby: "createtime desc"
      }).then(res => {
        this.tableData = res.data;
        this.pager.count = res.count;
      });
    },
    //
    checkInfo_Get(memberid) {
      this.MK.Request("/Publics/MemberCDR/hzwgkyytj3", "get", {
        memberid
      }).then(res => {
        this.tableDataR = res.result.lst;
      });
    }
  },
  watch: {
    "query.queryRegDate"(val) {
      if (val == null) {
        this.refreshList();
      }
    },
    "query.forgid"(oldVal, newVal) {
      if (!oldVal || this.query.orgid == "") {
        this.query.orgid = "";
        this.tableData = [];
        this.pager.count = 0;
      }
      if (oldVal != newVal && this.query.forgid) {
        this.query.orgid = "";
        this.classByAccount_get(this.query.forgid);
        // this.refreshList();
      }
    },
    "query.orgid"(val) {
      if (!val) {
        this.pager.count = 0;
      }
    },
    qrCodeModal(val) {
      if (!val) {
        this.$refs.qrcode = [];
      }
    },
    importModal(val) {
      if (!val) {
        this.templateInfo = {
          schoolid: "",
          classid: ""
        };
      }
    },
    "pager.condition"(newVal, oldVal) {
      if (oldVal != newVal) {
        this.refreshList();
      }
    },
    checkModal(val) {
      if (!val) {
        this.checkUrl = "";
      }
    },
    classList(val) {
      if (!val.length) {
        this.tableData = [];
      }
    }
  }
};
</script>

<style scoped>
#iframe-shrink {
}
>>> .el-date-editor .el-range-separator {
  width: 8%;
}
>>> .el-select-dropdown__item span {
  width: 20px;
  height: 20px;
  border: 1px solid red;
}
.mr20 {
  margin-right: 20px !important;
}
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.underLine {
  text-decoration: underline;
  color: #409eff;
  font-weight: bold;
  cursor: pointer;
}
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.qrcode-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.qrcode {
  /* width: auto;
	display: inline-block;
	text-align: center;
	padding: 20px 0; */
  margin: 40px 20px 10px 20px;
}
.qrcode .img {
  width: 132px;
  height: 132px;
  background-color: #fff;
  padding: 6px;
  box-sizing: border-box;
  display: inline-block !important;
}
.qrcode:before {
  content: "" !important;
  display: none;
}
</style>
