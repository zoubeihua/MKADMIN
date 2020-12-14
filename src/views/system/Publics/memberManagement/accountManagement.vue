<template>
  <d2-container>
    <template slot="header">
      <div class="page-header">
        <div>
          <el-input
            class="inputSearch mr20"
            v-model="searchConditionForm.memberCard"
            placeholder="请输入会员卡号"
          />
          <el-input
            class="inputSearch mr20"
            v-model="searchConditionForm.memberName"
            placeholder="请输入会员姓名"
          />
          <el-input
            class="inputSearch mr20"
            v-model="searchConditionForm.certificateID"
            placeholder="请输入证件号码"
          />
          <el-input
            class="inputSearch mr20"
            v-model="searchConditionForm.regMobile"
            placeholder="请输入注册的手机号"
          />
          <el-date-picker
            v-model="openDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
          <el-button style="margin-left: 20px;" type="primary" @click="refreshList">查询</el-button>
        </div>
        <div style="margin:10px 20px;">
          <el-button-group class="mr20">
            <el-button type="warning">锁定</el-button>
            <el-button type="success">解锁</el-button>
          </el-button-group>
          <el-button-group class="mr20">
            <el-button type="warning">退费</el-button>
            <el-button type="success">充值</el-button>
          </el-button-group>
          <el-button-group>
            <el-button type="warning">导出</el-button>
            <el-button type="success">打印</el-button>
          </el-button-group>
        </div>
      </div>
    </template>
    <div style="height:calc(100% - 60px);">
      <SplitPane :min-percent="30" :default-percent="30" split="vertical">
        <template slot="paneL">
          <el-container>
            <!-- 会员卡片 -->
            <div style="overflow:auto; border-top:1px solid #f1f1f1">
              <el-card
                class="box-card"
                style="margin:20px;font-family:'PingFang SC';"
                v-for="item in membertTableData"
                :key="item.MEMBERID"
                shadow="hover"
                @click.native="handleChangeMemberCard(item.MEMBERNAME)"
              >
                <div slot="header" class="clearfix">
                  <div>
                    会员卡号:
                    <span>{{item.MEMBERNO}}</span>
                    - 姓名: {{item.MEMBERNAME}}
                  </div>
                </div>
                <div
                  class="text item"
                  style="font-size:16px;padding:20px 10px;display:flex;justify-content:space-around;"
                >
                  <div>
                    <div>
                      <span class="card-item-label mr20">性别</span>
                      <el-tag
                        :type="item.SEX == 1 ? 'primary' : item.SEX == 2 ? 'danger' : 'warning'"
                      >{{item.SEX_DISPLAY}}</el-tag>
                    </div>
                    <div>
                      <span class="card-item-label mr20">注册手机</span>
                      <span>{{item.MOBILETEL}}</span>
                    </div>
                    <div>
                      <span class="card-item-label mr20">生日</span>
                      <span>{{item.BIRTHDAY}}</span>
                    </div>
                    <div>
                      <span class="card-item-label mr20">注册日期</span>
                      <span>{{item.EFFECTIVEDATE}}</span>
                    </div>
                    <div>
                      <span class="card-item-label mr20">失效日期</span>
                      <span>{{item.EXPIRATIONDATE}}</span>
                    </div>
                  </div>
                  <div>
                    <img-upload
                      :width="120"
                      :height="160"
                      :limit="1"
                      :value="item.IDPHOTO"
                      v-if="item.IDPHOTO[0].url != ''"
                    />
                    <div class="no-img" v-else>未上传头像</div>
                  </div>
                </div>
              </el-card>
            </div>
            <el-footer>
              <mk-page :pager="pagerAccount" @query="refreshList" />
            </el-footer>
          </el-container>
        </template>
        <template slot="paneR">
          <el-container>
            <el-table :data="accountTableData" stripe show-summary>
              <el-table-column align="center" label="类型" prop="type" />
              <el-table-column align="center" label="分类" prop="name" />
              <el-table-column align="center" label="金额" prop="account" />
              <el-table-column align="center" label="充值前余额" prop="beforeAccount" />
              <el-table-column align="center" label="充值后余额" prop="afterAccount" />
              <el-table-column align="center" label="查看明细">
                <template slot-scope="scope">
                  <div
                    style="color:blue;text-decoration:underline;cursor:pointer;"
                    @click="handleReadDetail(scope.row)"
                  >查看明细</div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作员" prop="user" />
              <el-table-column align="center" label="操作时间" prop="date" />
            </el-table>
            <el-footer>
              <mk-page :pager="pagerCurAccount" @query="refreshList" />
            </el-footer>
          </el-container>
        </template>
      </SplitPane>
    </div>
    <vxe-modal v-model="detailModal" title="账户明细查看" width="1080" height="680">
      <el-table :data="detailTableData" stripe show-summary height="520">
        <el-table-column align="center" label="类型" prop />
        <el-table-column align="center" label="分类" prop />
        <el-table-column align="center" label="项目" prop />
        <el-table-column align="center" label="数量" prop />
        <el-table-column align="center" label="单价" prop />
        <el-table-column align="center" label="规格" prop />
        <el-table-column align="center" label="单位" prop />
        <el-table-column align="center" label="金额" prop />
        <el-table-column align="center" label="操作员" prop />
        <el-table-column align="center" label="操作时间" prop />
      </el-table>
      <el-button
        style="margin-left:47%;margin-top:35px;"
        type="primary"
        @click="detailModal = false"
      >关闭</el-button>
    </vxe-modal>
  </d2-container>
</template>

<script>
import imgUpload from "@/components/mk-form/Upload/index.vue";
export default {
  name: "accountManagement",
  computed: {},
  data() {
    return {
      openDate: "",
      detailModal: false,
      // 头部搜索条件
      searchConditionForm: {
        memberCard: "",
        memberName: "",
        certificateID: "",
        regMobile: ""
      },
      membertTableData: [],
      accountTableData: [
        {
          type: "类型",
          name: "现金",
          account: 88888888,
          beforeAccount: 88888888,
          afterAccount: 88888888,
          user: "龙方春",
          date: "2019-12-26 12:12:12"
        },
        {
          type: "消费",
          name: "账户",
          account: 88888888,
          beforeAccount: 88888888,
          afterAccount: 88888888,
          user: "龙方春",
          date: "2019-12-26 12:12:12"
        }
      ],
      detailTableData: [],
      // 账户分页
      pagerAccount: {
        count: 0,
        page: 1,
        row: 10,
        condition: ""
      },
      // 当前账户分页
      pagerCurAccount: {
        count: 0,
        page: 1,
        row: 10,
        condition: ""
      },
      // 日期选择
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
      Auth: {
        hyjcsj: {
          app: "3b7b82d286bd49fabd6c717a6cce6788",
          mod: "hyjcsj"
        },
        hygl: {
          app: "475927389f8545f088f541d09393d69f",
          mod: "hygl"
        },
        hqzz: {
          app: "11d9ade0fdac465595bc78eff18a25f2",
          mod: "hqzz"
        },
        hfjn: {
          app: "475927389f8545f088f541d09393d69f",
          mod: "hfjn"
        }
      }
    };
  },
  components: {
    imgUpload
  },
  created() {
    this.MemberInfo_Get();
  },
  methods: {
    // 分页刷新 查询
    refreshList() {},
    // 查看明细
    handleReadDetail(val) {
      console.log(val);
      this.detailModal = true;
    },
    handleChangeMemberCard(name) {
      const h = this.$createElement;
      this.$notify({
        title: `您好,${name}`,
        message: h("em", { style: "color:red" }, "切换了"),
        duration: 1000
      });
    },
    MemberInfo_Get() {
      this.MK.Request(
        "MemberInfo_Get",
        "post",
        {
          CREATEUSERID: this.info.USERID,
          MYCUSTOMER: 0,
          LEVELIDARR: [],
          condition: "",
          page: 1,
          rows: 10
        },
        this.Auth.hygl
      ).then(res => {
        this.membertTableData = res.data.map(x => {
          x.IDPHOTO = x.IDPHOTO.split(",").map(y => ({ url: y }));
          return x;
        });
        this.pagerAccount.count = res.count;
      });
    }
  }
};
</script>

<style scoped>
.mr20 {
  margin-right: 20px;
}
.card-item-label {
  display: inline-block;
  width: 80px;
  text-align: right;
}
>>> .el-card__body {
  padding-top: 0px;
}
.inputSearch {
  width: 155px;
}
.inputCard {
  width: 140px;
}
.no-img {
  box-sizing: border-box;
  width: 120px;
  height: 160px;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  line-height: 160px;
  text-align: center;
  margin: 0 10px 10px 0;
}
</style>