<template>
  <d2-container>
    <template slot="header">
      <el-row class="pd-tb-10">
        <el-form inline v-model="research" ref="research">
          <el-form-item>
            <el-select style="width:400px" v-model="research.scientific" value-key="RESEARCHNAME" filterable placeholder="请选择科研项目" @change="handleProjectChange">
              <el-option v-for="item in research.scientificList" :key="item.RESEARCHNAME" :label="item.RESEARCHNAME" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="research.date" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
          </el-form-item>
          <el-form-item>
            <el-input style="width:450px" clearable v-model="research.condition" placeholder="按操作人员姓名/请求地址/异常信息/页面地址/请求参数查找">
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleResearchClick">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </template>
    <el-table :data="tableData" border style="width: 100%" height="100%" highlight-current-row>
      <el-table-column align="center" width="60" label="ID" prop="SYSLOGID" />
      <el-table-column align="center" width="120" label="操作人账户" prop="LOGINUID" />
      <el-table-column align="center" width="120" label="操作人姓名" prop="USERNAME" />
      <el-table-column align="center" width="60" label="请求类型" prop="REQUESTTYPE" />
      <el-table-column align="center" label="请求地址" prop="REQUESTURI" />
      <el-table-column align="center" label="异常信息" prop="MESSAGE" />
      <el-table-column align="center" label="请求参数" prop="PARAMINS" />
      <el-table-column align="center" label="页面地址" prop="FORMURI" />
      <el-table-column align="center" width="180" label="操作时间" prop="LOGTIME" />
      <el-table-column align="center" width="60" label="错误代码" prop="LOGCODE" />
    </el-table>
    <template slot="footer">
      <mk-page :pager="pager" @query="refreshList" />
    </template>
  </d2-container>
</template>

<script>
function nowDate(what) {
  const date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1 <  10 ? "0"+ (date.getMonth() + 1) : date.getMonth() + 1
  let datenow = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
  let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
  let min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  let sec = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
  return year + '-' + month + '-' + (datenow - what) + ' ' + hour + ':' + min + ':' + sec
}
import {mapState} from "vuex"
export default {
  computed: {
    ...mapState("d2admin/user", ["info"]),
    "research.scientific"() {
      return this.$store.state.d2admin.user.info.RESEARCHNAME
    },
  },
  name: "logResearch",
  data() {
    return {
      pager: {
        count: 0,
        page: 1,
        rows: 10,
      },
      research: {
        scientificList: [], // 科研项目
        date: [new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDate() - 1), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()),new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds())],
        condition:"",
        BDATE: nowDate(1),
        EDATE: nowDate(0),
        RESEARCHID: ""
      },
      tableData: [],
      //微服务架构认证
      Auth: {
        SYSLOG: {
          app: "531d822cd2ec4c959ca16104184a4dc9",
          mod: "sysLog"
        },
        XMWH: {
          app: "82f4ba2f6e5c495bbc46c8dab377706d",
          mod: "xmwh"
        }
      }
    }
  },
  created() {
    this.research.scientific = this.info.RESEARCHNAME
    this.Item_Get()
    this.SysLog_Get()
  },
  methods: {
    refreshList() {
      this.SysLog_Get()
    },
    handleResearchClick() {
      if(this.research.scientific) {
        this.SysLog_Get()
      } else {
        this.$message({
          type: "warning",
          message: "请选择查询的项目",
          duration: 800
        })
      }
    },
    handleProjectChange(val) {
      this.$forceUpdate()
      this.research.RESEARCHID = val.RESEARCHID
      this.$set(this.research, "scientific", val.RESEARCHNAME)
    },
    // api 
    Item_Get() {
      const url = "Item_Get"
      this.MK.Request(
        url,
        "GET",
        { USERID: this.$store.state.d2admin.user.info.USERID },
        this.Auth.XMWH
      ).then(res => {
        const data = res.data
        this.research.scientificList = data
      })
    },
    SysLog_Get() {
      const url = 'SysLog_Get'
      this.MK.Request(
        url,
        "GET",
        {
          RESEARCHID: this.research.RESEARCHID || this.$store.state.d2admin.user.info.RESEARCHID,
          BDATE: this.research.BDATE,
          EDATE: this.research.EDATE,
          CONDITION: this.research.condition,
          count: this.pager.count,
          rows: this.pager.rows,
          page: this.pager.page
        },
        this.Auth.SYSLOG
      ).then(res => {
          this.tableData = res.data
          this.pager.count = res.count
      })
    }
  },
  watch: {
    "research.date"(val) {
      this.research.BDATE = (() => {
        let year = val[0].getFullYear()
        let month = val[0].getMonth() + 1 <  10 ? "0"+ (val[0].getMonth() + 1) : val[0].getMonth() + 1
        let date = val[0].getDate() < 10 ? "0" + val[0].getDate() : val[0].getDate()
        let hour = val[0].getHours() < 10 ? "0" + val[0].getHours() : val[0].getHours()
        let min = val[0].getMinutes() < 10 ? "0" + val[0].getMinutes() : val[0].getMinutes()
        let sec = val[0].getSeconds() < 19 ? "0" + val[0].getSeconds() : val[0].getSeconds()
        return year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec 
      })()
      this.research.EDATE = (() => {
        let year = val[1].getFullYear()
        let month = val[1].getMonth() + 1 <  10 ? "0"+ (val[1].getMonth() + 1) : val[1].getMonth() + 1
        let date = val[1].getDate() < 10 ? "0" + val[1].getDate() : val[1].getDate()
        let hour = val[1].getHours() < 10 ? "0" + val[1].getHours() : val[1].getHours()
        let min = val[1].getMinutes() < 10 ? "0" + val[1].getMinutes() : val[1].getMinutes()
        let sec = val[1].getSeconds() < 19 ? "0" + val[1].getSeconds() : val[1].getSeconds()
        return year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec 
      })()
    }
  }
}
</script>

<style>
</style>