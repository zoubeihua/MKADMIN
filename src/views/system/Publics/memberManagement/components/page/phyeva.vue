<template>
<el-container>
  <el-header>
     <el-form :inline="true">
        <el-form-item label="体检日期">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="daterange"
            type="daterange"
            align="right"
            unlink-panels
            @change="dateRangeChange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <mk-select
            v-model="form.status"
            @change="getData"
            style="width:160px;"
            placeholder="请选择评估状态"
            :filter="['lable']"
            :datas="[{lable:'未评',val:'0'},{lable:'已评',val:'1'},{lable:'未发布',val:'2'},{lable:'已发布',val:'3'}]"
            label="lable"
            val="val"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <mk-select
            style="width:136px;"
            v-model="form.doctorid"
            url="/Publics/Common/UserInfo"
            :param="{tag:1,hospitalid:info.hospitalid}"
            placeholder="请选择评估人"
            :filter="['name']"
            label="name"
            val="userid"
            @change="getData"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <mk-select
            style="width:126px;"
            v-model="form.releaseuserid"
            url="/Publics/Common/UserInfo"
            :param="{tag:1,hospitalid:info.hospitalid}"
            placeholder="请选发布人"
            :filter="['name']"
            label="name"
            val="userid"
            @change="getData"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
  </el-header>
  <el-main style="padding:0;">
   <el-container>
        <el-aside width="300px" style="background-color:#f5f5f5;padding: 6px 6px 0 6px;">
          <el-container>
            <el-main style="padding:0">
              <el-scrollbar style="height:100%;width:100%;">
                <mk-empty v-if="LeftDataList.length == 0" style="padding-top:200px;"></mk-empty>
                <el-card
                v-else
                style="margin-bottom:6px;"
                  :shadow="currIndex == index ? 'always' : 'hover'"
                  :class="[currIndex == index ? 'active' : '']"
                  v-for="(item,index) in LeftDataList"
                  :key="index"
                  @click.native="edcclasscrf_Get(item,index)"
                >
                  <!-- <div
                    class="sign"
                    :class="[item.sourcetag == 0 ? 'primary-bg' : 'danger-bg']"
                  >{{item.sourcetag == 0 ? '医生' : '患者'}}</div> -->
                  <h3 class="Ltitle">
                    <el-link type="primary" style="font-size:18px;">{{item.orgidname}}</el-link>
                  </h3>
                  <div style="padding-left:6px;">
                    <div class="info">
                      <!-- <el-tag size="mini" type="danger"></el-tag> -->
                      人群分类 {{item.riskinfo}}
                    </div>
                    <div class="info">
                      <span>评估医生 {{item.doctorname}}</span>
                    </div>
                    <!-- <div class="info">
                      <span>评估时间 {{item.examdate}}</span>
                    </div> -->
                  </div>
                  <div class="sourcetag info">
                    <span>
                      体检日期
                      <i class="el-icon-time"></i>
                      {{item.examdate}}
                    </span>
                  </div>
                </el-card>
              </el-scrollbar>
            </el-main>
          </el-container>
        </el-aside>
        <main style="width:100%;">
           <mk-empty v-if="currIndex == null || LeftDataList.length == 0" style="padding-top:200px;"></mk-empty>
          <el-tabs tab-position="left" v-model="Opertype" @tab-click="handleOpertClick" style="height: 100%" v-else>
             <mk-empty v-if="Opertype == 0" style="padding-top:200px;"></mk-empty>
            <el-tab-pane label="体检报告查看" name="1">
              <mk-tabs-crf ref="tabscrf" :edit="edit"></mk-tabs-crf>
            </el-tab-pane>
            <el-tab-pane label="健康方案查看" name="2">
              <el-container>
                <el-main>
                  <el-scrollbar style="height:100%;width:100%;">
                  <div class="ql-snow ql-editor" v-html="programcontent"></div>
                  </el-scrollbar>
                </el-main>
              </el-container>
            </el-tab-pane>
          </el-tabs>
        </main>
      </el-container>
  </el-main>
</el-container>
</template>
<script>
export default {
  props:{
    userData:{
      type:Object,
      default: () => {}
    }
  },
  components:{

  },
  data() {
    return {
      Opertype:'0',
      edit:false,
      currIndex:null,
      LeftDataList:[],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      daterange: "", //日期范围
      form:{
        membertimebegin: "", //体检开始时间
        membertimeend: "", //体检结束时间
        memberid: "", //会员id
        status: undefined, //0：初始 1：会员已填 2：已解析 (-1:表示所有)
        hospitalid: "",
        releaseuserid:"",
        tag: 1
      },
      programename: "", //方案名称
      programcontent: "", //方案内容
      evaluateid: null,
      currIndex:null,
      curRow:{}
    }
  },
  mounted(){
    this.getData();
  },
  methods:{
    //时间范围更改事件
    dateRangeChange(val) {
      if (val == null) {
        this.form.membertimebegin = "";
        this.form.membertimeend = "";
      } else {
        this.form.membertimebegin = val[0];
        this.form.membertimeend = val[1];
      }
      this.getData();
    },
     //根据评估id(evaluateid)获取对应的体检评估明细信息[包含：问卷,人群类型,体检方案信息]
    async edcclasscrf_Get(row,index) {
      this.currIndex = index;
      this.evaluateid = row.evaluateid;
      this.curRow = row;
      this.Opertype = '0';
      this.MK.Request(
        "/Hcrm/ExamEvaluate/ExamEvaluateDetail_Get",
        "get",
        row
      ).then(res => {

      });
    },
    // 根据会员健康方案id(memberprogramid)获取方案内容;
    ExamEvaluateHealthProgram_Get(){
      this.MK.Request('/Hcrm/ExamEvaluate/ExamEvaluateHealthProgram_Get','get',{
        memberprogramid:this.evaluateid
      })
      .then(res => {
        if(res.code == 0){
          this.programename = res.programname;//方案名称
          this.programcontent = res.programcontent; //方案内容
        }
      })
    },
    //左侧tab点击事件
    handleOpertClick(tab){
      if(tab.name == 1){
         this.$refs.tabscrf.CRFillJsonBysubclassid_Get({
            collectionid: this.curRow.collectionid,
            memberid: this.userData.memberid,
            subclassid: this.curRow.subclassid
          });
      }
      if(tab.name == 2){
        this.ExamEvaluateHealthProgram_Get();
      }
    },
    getData(){
      this.form.hospitalid = this.info.hospitalid;
      this.form.memberid = this.userData.memberid;
      this.MK.Request(
          "/Hcrm/ExamEvaluate/ExamEvaluatelist_Get",
          "get",
          this.form
        ).then(res => {
          if (res.code == 0) {
            this.LeftDataList = res.data;
          }
      });
    }
  }
}
</script>
<style  scoped>
>>> .el-header{
  border-bottom: 1px solid #cfd7e5 !important;
}
.el-header >>> .el-form-item {
    margin-bottom: 10px !important;
}
>>> .el-card__body {
  position: relative !important;
  padding: 10px 10px 0 10px !important;
}
.sign {
  color: #fff;
  height: 30px;
  width: 92px;
  position: absolute;
  top: 0;
  right: -30px;
  text-align: center;
  line-height: 30px;
  font-family: "黑体";
  background-color: #0c60ee;
  -moz-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
.Ltitle {
  margin: 0;
  padding: 0;
  margin-bottom: 4px;
}
.sourcetag {
  margin-top: 6px;
  color: #b8b8b8;
  height: 32px;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid #F1F3F4;
}
>>> .el-tabs__content {
  height: 100%;
}
>>> .el-tab-pane {
  height: 100%;
}
.el-card.active{
  border-color: rgba(12, 96, 238,.5) !important;
  box-shadow: 0 2px 12px 0 rgba(12, 96, 238,.5);
}

</style>
