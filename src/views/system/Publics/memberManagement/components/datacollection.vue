<template>
  <vxe-modal
    v-model="drawer"
    fullscreen
    :showFooter="true"
    resize
    @close="close"
    ref="drawer"
    width="1000"
    height="800"
  >
    <div slot="title">
      临床资料采集 - [
      <span
        style="color:red;"
      >会员等级 ： {{memberBasicinfo.memberlevel_display}} 会员卡号：{{memberBasicinfo.memberno}} 会员姓名：{{memberBasicinfo.membername}} 性别：{{memberBasicinfo.sex_dispalay}} 年龄：{{memberBasicinfo.age}}</span> ]
    </div>
    <SplitPane :min-percent="20" :default-percent="30" split="vertical">
      <template slot="paneL">
        <el-container>
          <el-header style="background: #eef1f6;">
            <el-form
              ref="dynamicValidateForm"
              label-width="100px"
              style="width:100%;"
              class="demo-dynamic"
            >
              <el-form-item label="就诊ID" prop="pass">
                <el-input disabled v-model="headerForm.jzid"></el-input>
              </el-form-item>
              <el-form-item label="就诊类型" prop="pass">
                <mk-select
                  v-model="headerForm.jzclass"
                  @change="jzClassChange"
                  placeholder="请选择"
                  :datas="getDicStandarDcode('就诊分类')"
                  :filter="['bzname','filterstr']"
                  label="bzname"
                  val="bzcode"
                ></mk-select>
              </el-form-item>
              <el-form-item label="就诊机构" prop="pass">
                <el-select
                  v-model="headerForm.orgid"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  placeholder="请输入就诊机构"
                  :remote-method="remoteMethod"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in orgList"
                    :key="item.orgid"
                    :label="item.orgname"
                    :value="item.orgid"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="就诊日期" prop="">
                <el-date-picker
                  style="width:100%;"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  @change="jzChange"
                  v-model="headerForm.jzdate"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="备注" prop="pass">
                <el-input
                  type="textarea"
                  :rows="3"
                  resize="none"
                  placeholder="请输入备注"
                  v-model="headerForm.remarks">
                </el-input>
              </el-form-item>
            </el-form>
          </el-header>
          <el-main style="padding:0;">
            <el-table
              :data="qustionList"
              height="100%"
              border
              ref="refTable"
              :row-key="getRowKeys"
              :expand-row-keys="expands"
              @expand-change="rowChange"
              @row-click="parentRowClick"
            >
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-table
                  highlight-current-row
                  :data="scope.row.detail"
                  @row-click="qustionRowClick"
                  :show-header="false"
                >
                  <el-table-column prop="subclassname">
                    <template slot-scope="scope">
                      <div style="padding-left:20px;">
                        <el-radio
                          v-model="radio"
                          :label="scope.row.subclassid"
                          style="margin-right:0 !important;"
                        >
                          <span class="el-radio__label"></span>
                        </el-radio>
                        <span>
                          <i
                          class="el-icon-document"
                          style="color:#00a516;font-size:16px;"></i>
                          {{scope.row.subclassname}}
                          </span>
                      </div>
                    </template>
                  </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column prop="classname">
                <template slot="header" slot-scope="scope">
                  <div style="text-align:center;font-size: 18px;">{{jzclassName}}</div>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </template>
      <template slot="paneR">
        <mk-tabs-crf ref="tabscrf" v-if="drawer"  @change="tabsrfChange"></mk-tabs-crf>
      </template>
    </SplitPane>
    <div slot="footer" style="text-align:center;">
      <el-button-group>
        <el-button type="success" @click="submitData">保存</el-button>
        <el-button type="warning" @click="close">取消</el-button>
      </el-button-group>
    </div>
  </vxe-modal>
</template>
<script>
import dayjs from "dayjs";
export default {
  name: "datacollection",
  props: {
    userdata: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      radio:null,
      expands: [],
       getRowKeys(row) {
        return row.classid;
      },
      loading: false,
      drawer: false,
      jzclassName: "检查信息",
      headerForm: {
        jzdate:dayjs(new Date()).format("YYYY-MM-DD")
      },
      memberBasicinfo: {},
      orgList: [], //机构列表
      qustionList: [], //问卷信息
      curRow: {},
      collectionid: ""
    };
  },
  methods: {
    jzChange(val){
    },
    // 获取Sequence序列信息
    GetSequence() {
      return this.MK.Request("/Publics/Common/Sequence", "get", {
        SequenceName: "s_member_cdr_jzid"
      });
    },
    async open() {
      this.init();
      let res = await this.GetSequence();
      if (res.code == 0) {
        this.headerForm.jzid = res.seed;
        this.drawer = true;
        //每次打开强制最大化
        this.$refs.drawer.maximize();
      }
    },
    init() {
      this.headerForm = {
        jzdate:dayjs(new Date()).format("YYYY-MM-DD")
      };
      this.qustionList = [];
      this.jzclassName = "检查信息";
    },
    //远程搜索
    remoteMethod(query) {
      if (query != "") {
        this.loading = true;
        let sendData = {
          hospitalid: this.info.hospitalid,
          condition: query
        };
        this.MK.Request(
          "/Publics/MemberCDR/hospitalorgan_Get",
          "get",
          sendData
        ).then(res => {
          this.loading = false;
          if (res.code == 0) {
            this.orgList = res.data.filter(
              item =>
                item.orgname.indexOf(query) > -1 ||
                item.filterstr.indexOf(query) > -1
            );
          }
        });
      } else {
        this.orgList = [];
      }
    },
    //关闭
    close() {
      this.drawer = false;
      this.orgList = [];
      this.$emit("update:userdata", {});
    },
    submitData() {
      this.member_cdr_Add();
    },
    // 会员cdr数据采集(jzid:就诊id,从会员界面点击过来:取序列s_member_cdr_jzid) operatetype,collectionid不用传值 (根据返回的 数据采集id collectionid 进行表单保存!)

    member_cdr_Add() {
      if(!this.headerForm.orgid){
        this.$message({
          type:'error',
          message:'请先选择就诊机构'
        });
        return;
      }
      if(!this.headerForm.jzclass){
        this.$message({
          type:'error',
          message:'请先选择就诊类型'
        });
        return;
      }
      if(!this.headerForm.jzdate){
        this.$message({
          type:'error',
          message:'请先选择就诊日期'
        });
        return;
      }
       if(!this.curRow.classid){
        this.$message({
          type:'error',
          message:'请先选择表单'
        });
        return;
      }
      let orgidname = this.orgList.filter(
        item => this.headerForm.orgid == item.orgid
      )[0].orgname;
      let sendData = {
        operatetype: "C",
        classid: this.curRow.classid,
        classname: this.curRow.classname,
        collectionuserid: this.info.userid,
        jzclass: this.headerForm.jzclass,
        jzdate: this.headerForm.jzdate,
        jzid: this.headerForm.jzid,
        memberid: this.memberBasicinfo.memberid,
        orgid: this.headerForm.orgid,
        orgidname: orgidname,
        remarks: this.headerForm.remarks,
        subclassid: this.curRow.subclassid,
        subclassname: this.curRow.subclassname
      };
      this.MK.Request(
        "/Publics/MemberCDR/member_cdr_Add",
        "post",
        sendData
      ).then(res => {
        if (res.code == 0) {
          this.collectionid = res.collectionid;
          this.$refs.tabscrf
            .getData(this.collectionid)
            .then(res => {
              if (res) {
                //表单提交保存
                this.$refs.tabscrf.saveData(res).then(data => {
                   this.drawer = false;
                });
              }
            });
        }
      });
    },

    //根据就诊分类获取对应的问卷信息
    jzClassChange(data) {
      if (this.headerForm.jzclass == "") {
        this.jzclassName = "检查信息";
        this.qustionList = [];
        return;
      }
      let sendData = {
        jzlx: data.bzcode
      };
      this.MK.Request(
        "/Publics/MemberCDR/jzlxClassinfo_Get",
        "get",
        sendData
      ).then(res => {
        if (res.code == 0) {
          this.qustionList = res.data;
          this.$nextTick(() => {
          });
          this.jzclassName = data.bzname;
        }
      });
    },
    //
    tabsrfChange(tab) {

    },
    parentRowClick(row){
      this.$refs.refTable.toggleRowExpansion(row);
    },
    //问卷信息点击
    qustionRowClick(row) {
      this.radio = row.subclassid;
      this.curRow = row;
      row.collectionid = "-1";
      row.memberid = this.memberBasicinfo.memberid;
      this.$refs.tabscrf.CRFillJsonBysubclassid_Get(row);
    },
    //折叠事件
    async rowChange(row, expandedRows) {
      //	每次只展开一个扩展列表
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
            this.radio = null;
            this.$nextTick(() => {
              this.expands.push(row.classid);
            });
        }
      } else {
        this.expands = [];
      }
    }
  },
  watch: {
    userdata: {
      deep: true,
      handler(val) {
        console.log(val)
        this.memberBasicinfo = val;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
