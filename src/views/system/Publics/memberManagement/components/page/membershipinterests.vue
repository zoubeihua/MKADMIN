<template>
  <el-container>
    <el-tabs v-model="activeName">
      <el-tab-pane label="当前权益" name="first"></el-tab-pane>
      <!-- <el-tab-pane label="查看知情同意书" name="second"></el-tab-pane> -->
    </el-tabs>
    <el-table v-if="activeName == 'first'" :data="rightsTableData" stripe highlight-current-row height="100%">
      <el-table-column
        show-overflow-tooltip
        align="left"
        label="名称"
        prop="rightsname"
        width="300"
      />
      <el-table-column show-overflow-tooltip align="center" label="规格" prop="specification" />
      <el-table-column show-overflow-tooltip align="center" label="单位" prop="unit" />
      <el-table-column show-overflow-tooltip align="center" label="单价"  :formatter="(i=>projectAmountsTabel(i,'price'))" prop="price" />
      <el-table-column show-overflow-tooltip align="center" label="权益数量" prop="rightsamount" />
      <el-table-column show-overflow-tooltip align="center" label="剩余" prop="unusedamount" />
    </el-table>
    <el-footer v-if="activeName == 'first'">
      <mk-page :pager="curRights" @query="refreshCurRights" />
    </el-footer>
  </el-container>
</template>

<script>
import utils from "@/minxins/util.js"
export default {
  name: "memberRights",
  props: {
    userData: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [utils],
  data() {
    return {
      activeName: "first",
      rightsTableData: [],
      memberBasicinfo: {},
      curRights: {
        rows: 20,
        page: 1,
        tag: 0,
        count: 0
      }
    };
  },
  created() {
    this.MemberRights_Get(this.userData.memberid);
  },
  methods: {
    refreshCurRights() {
      this.MemberRights_Get(this.userData.memberid);
    },
    // 会员权益
    MemberRights_Get(memberid) {
      this.curRights.memberid = memberid;
      this.MK.Request(
        "/Hcrm/MemberService/MemberRights",
        "get",
        this.curRights
      ).then(res => {
        this.rightsTableData = res.data;
        this.curRights.count = res.count;
      });
    }
  },
  watch: {
    userData: {
      deep: true,
      handler(val) {
        this.memberBasicinfo = val;
      }
    },
  }
};
</script>

<style scoped>
.footer {
  display: flex;
  flex-direction: column;
}
</style>
