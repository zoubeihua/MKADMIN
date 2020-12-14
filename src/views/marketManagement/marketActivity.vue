<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true">
        <el-form-item>
          <el-input
            style="width:400px;"
            v-model="pager.condition"
            @keyup.enter.native="refreshList"
            placeholder="请输入活动名称查询"
          />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" @click="refreshList">查询</el-button>
            <el-button type="primary" @click="handleNewData">添加</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="tableData" highlight-current-row border stripe @sort-change="changeTableSort">
      <el-table-column
        align="center"
        label="活动ID"
        prop="eventid"
        width="90"
        show-overflow-tooltip
        sortable
      ></el-table-column>
      <el-table-column label="活动名称" prop="eventname" show-overflow-tooltip sortable>
        <template slot-scope="scope">
          <el-link
            :underline="false"
            type="primary"
            @click="showEnvent(scope.row)"
          >{{scope.row.eventname}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="关联优惠券"
        prop="couponname"
        show-overflow-tooltip
        width="140"
        sortable
      >
        <template slot-scope="scope">{{scope.row.discoupon==1?scope.row.couponname:""}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="关联CRF"
        prop="crfname"
        show-overflow-tooltip
        width="140"
        sortable
      >
        <template slot-scope="scope">{{scope.row.discrf==1?scope.row.crfname:""}}</template>
      </el-table-column>
      <el-table-column align="center" label="注册模块" prop="disreg" width="100" sortable>
        <template slot-scope="scope">{{scope.row.disreg==1?'展示':'不展示'}}</template>
      </el-table-column>
      <el-table-column align="center" label="负责人" prop="handuername" width="120" sortable></el-table-column>
      <el-table-column align="center" label="开始日期" prop="begintime" width="120" sortable>
        <template slot-scope="scope">{{scope.row.begintime | dateFormat}}</template>
      </el-table-column>
      <el-table-column align="center" label="结束日期" prop="endtime" width="120" sortable>
        <template slot-scope="scope">{{scope.row.endtime | dateFormat}}</template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status" fixed="right" width="90" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status == 0 ? 'success' : 'danger'"
          >{{scope.row.status == 0 ? '正常' : '停用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" label="操作" fixed="right">
        <template slot-scope="scope">
          <div class="tableBtn">
            <el-link
              title="分享"
              icon="el-icon-share"
              :underline="false"
              type="primary"
              @click="copyEnvent(scope.row)"
            ></el-link>
            <!-- <span class="qrcodeBox">
              <div class="qrcode" ref="qrCodeUrl" v-if="isQrCode"></div>
              <el-link
                title="复制链接"
                icon="mkfont guanlian"
                :underline="false"
                type="primary"
                @click="copyEnvent(scope.row)"
              ></el-link>
            </span>-->
            <el-link
              title="编辑"
              @click="handleActivityEdit(scope.row)"
              :underline="false"
              type="primary"
              icon="mkfont bianji1"
            ></el-link>
            <el-link
              title="删除"
              @click="Del(scope.row)"
              :underline="false"
              type="danger"
              icon="el-icon-delete"
            ></el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <mk-page :pager="pager" @query="refreshList" />
    </template>
    <activity ref="activity" @close="refreshList" />
    <el-drawer title="活动详情预览" :visible.sync="drawer" direction="rtl">
      <phone :newActivityForm="rowData" :jsonData="jsonData" v-if="drawer" ref="phone" />
    </el-drawer>

    <vxe-modal
      v-model="isQrCode"
      ref="modal"
      width="540"
      height="auto"
      @close="close"
      title="打开微信扫一扫"
    >
      <div style="text-align:center">
        <div class="qrcode" ref="qrCodeUrl" id="qrcode"></div>
      </div>
    </vxe-modal>
  </d2-container>
</template>

<script>
import QRCode from "qrcodejs2"; // 引入qrcode

import phone from "./components/phone";
import util from "@/libs/util.js";
import axios from "axios";
import * as MKPublic from "@/libs/utilMkPublic.js";
import activity from "./components/activity";
import dayjs from "dayjs";
export default {
  name: "marketActivity",
  components: { activity, phone },
  computed: {},
  data() {
    return {
      drawer: false,
      newActivityModal: false,
      isQrCode: false,
      pager: {
        rows: 20,
        page: 1,
        count: 0,
        condition: "",
        hospitalid: "",
        order: ""
      },
      qrcode: "",
      tableData: [],
      rowData: {},
      jsonData: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
          customClass: ""
        },
        key: new Date().getTime()
      }
    };
  },
  created() {
    this.refreshList();
  },
  mounted() {},
  methods: {
    //表格排序
    changeTableSort(column) {
      if (!column.order) {
        this.pager.order = "";
      } else {
        this.pager.order =
          column.prop + " " + column.order.replace(/ending/g, "");
      }

      this.refreshList();
    },
    refreshList() {
      this.MK.Request(
        "/Publics/Common/Dic/HospitalEvents",
        "get",
        this.pager
      ).then(res => {
        if (res.code == 0) {
          this.tableData = res.data;
          this.pager.count = res.count;
        }
      });
    },

    // 新增
    handleNewData() {
      this.$refs.activity.open("C");
    },
    // 活动编辑
    handleActivityEdit(row) {
      console.log(row.regbackpic);
      let newActivityForm = {};
      newActivityForm = JSON.parse(JSON.stringify(row));
      newActivityForm.operatetype = "U";
      let daterange = [
        dayjs(newActivityForm.begintime).format("YYYY-MM-DD"),
        dayjs(newActivityForm.endtime).format("YYYY-MM-DD")
      ];
      this.$refs.activity.open("U");
      this.$refs.activity.active = 1;
      // this.$refs.activity.picUrl = row.regbackpic
      //   ? row.regbackpic.split(",").map(item => ({ url: item }))
      //   : [];
      this.$refs.activity.newActivityForm = newActivityForm;
      this.$refs.activity.daterange = daterange;
      if (!!row.crfid) {
        this.$refs.activity.CRFJsonBycrfid_Get(row);
      }
    },
    showEnvent(row) {
      this.rowData = row;
      this.MK.Request("/Publics/Common/Dic/HospitalEventsByeventid", "get", {
        eventid: row.eventid
      }).then(res => {
        if (res.code == 0) {
          let item = res.data[0];
          this.rowData.contents = item.contents || "";
          if (!row.crfid) {
            this.$nextTick(() => {
              this.drawer = true;
            });
          } else {
            this.CRFJsonBycrfid_Get(row);
          }
        }
      });
    },
    //获取模板
    CRFJsonBycrfid_Get(item) {
      this.MK.Request("/Publics/CRFMaintain/josnformatBycrfid", "get", {
        // userid: util.cookies.get("uuid"),
        crfid: item.crfid,
        formtype: 2
      }).then(res => {
        let resData = res.josnformat;
        this.jsonData.list = resData.list;
        this.jsonData.config = resData.config;
        this.jsonData.key = new Date().getTime();
        this.$nextTick(() => {
          this.drawer = true;
        });
      });
    },
    copyEnvent(row) {
      this.isQrCode = true;
      let allurl = window.location.href.split("#")[0];
      let url = "";
			// url = allurl + "#/activeH5/" + row.eventid + "/" + this.info.hospitalid;
// if(row.eventid==113){
//   url = allurl + "#/activeCampH5/" + row.eventid + "/" + this.info.hospitalid;
// }else{
url = allurl + "#/activeH5/" + row.eventid + "/" + this.info.hospitalid + "/" + row.crfid;
// }
      
      console.log(url);
      this.$nextTick(() => {
        this.qrcode = new QRCode(this.$refs.qrCodeUrl, {
          text: url, // 需要转换为二维码的内容
          width: 250,
          height: 250,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      });

      return;
      var input = document.createElement("input"); // 直接构建input
      input.value = url; // 设置内容
      document.body.appendChild(input); // 添加临时实例
      input.select(); // 选择实例内容
      document.execCommand("Copy"); // 执行复制
      document.body.removeChild(input); // 删除临时实例
      this.$message({
        message: "复制成功",
        type: "success"
      });
    },
    close() {
      document.getElementById("qrcode").innerHTML = "";
      // this.$refs.qrCodeUrl.clear()
      // this.qrcode.clear(); // 清除代码
    },
    //删除
    Del(row) {
      let data = JSON.parse(JSON.stringify(row));
      data.operatetype = "D";
      data.status = 99;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.MK.Request(
            "/Publics/Common/Dic/HospitalEvents",
            "post",
            data
          ).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.refreshList();
              this.close();
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.input {
  width: 640px;
}
>>> .el-drawer__header {
  margin-bottom: 0px;
}
>>> .el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 53px;
}
>>> .el-table__body {
  border-spacing: 0px 0px !important;
}
.qrcode {
  width: auto;
  display: inline-block;
  text-align: center;
  padding: 20px 0;
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
