<template>
  <vxe-modal
    v-model="modal"
    ref="modal"
    resize
    fullscreen
    width="1480"
    height="920"
    :showFooter="true"
    @close="close"
  >
    <div slot="title">
      会员权益 - [
      <span
        style="color:red;"
      >会员等级：{{userData.memberlevel_display}} 会员卡号：{{userData.cardno}} 会员姓名：{{userData.membername}} 性别：{{userData.sex_dispalay}} 年龄：{{userData.age}}</span>
      ]
    </div>
    <el-table :data="rightsTableData" stripe highlight-current-row height="100%">
      <el-table-column
        show-overflow-tooltip
        align="left"
        label="名称"
        prop="rightsname"
        width="300"
      />
      <el-table-column show-overflow-tooltip align="center" label="规格" prop="specification" />
      <el-table-column show-overflow-tooltip align="center" label="单位" prop="unit" />
      <el-table-column show-overflow-tooltip align="center" label="单价" prop="price" />
      <el-table-column show-overflow-tooltip align="center" label="权益数量" prop="rightsamount" />
      <el-table-column show-overflow-tooltip align="center" label="剩余" prop="unusedamount" />
    </el-table>
    <div slot="footer" class="footer">
      <mk-page :pager="curRights" style="	align-self: start;"  @query="refreshCurRights" />
      <el-button type="warning" style="	align-self: center;" @click="close">关闭</el-button>
    </div>
  </vxe-modal>
</template>

<script>
export default {
  name: "memberRights",
  props: {
    userData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      memberBasicinfo: {},
      modal: false,
      rightsTableData: [],
      curRights: {
        rows: 20,
        page: 1,
        tag: 0,
        count: 0
      }
    };
  },
  methods: {
    async open() {
      this.modal = true;
      this.$refs.modal.maximize();
    },
    close() {
      this.modal = false;
      this.$emit("update:userdata", {});
    },
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
    modal(val) {
      if(!val) {
        this.$emit("update:userdata", {});
      }
    }
  }
};
</script>

<style scoped>
.footer {
  display: flex;
  flex-direction: column;
}
</style>