<template>
  <vxe-modal v-model="modal" ref="modal" width="540" height="auto" :showFooter="true" @close="close">
    <div slot="title">
      新增工作组
      <span v-if="userData.userid">
        - [
        <span style="color:red;">{{userData.name}} - {{userData.stafftype_display}}</span>
        ]
      </span>
    </div>
    <el-form :model="form" ref="form" :rules="rules" label-width="120px">
      <el-form-item label="工作组" prop="wgid">
        <mk-select
          url="/Publics/Common/Dic/WorkGroupInfo"
          :clearable="false"
          v-model="form.wgid"
          :filter="['wgname']"
          width="300px"
          label="wgname"
          val="wgid"
        ></mk-select>
      </el-form-item>
      <el-form-item label="组长">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.isLeader" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="footer">
      <el-button-group>
        <el-button type="primary" @click="handleSumbit">提交</el-button>
        <el-button type="warning" @click="close">关闭</el-button>
      </el-button-group>
    </div>
  </vxe-modal>
</template>

<script>
export default {
  props: {
    userData: {
      type: Object,
      default: () => {}
    },
    methods: {
      type: Function,
      default: null
    }
  },
  computed: {},
  data() {
    return {
      modal: false,
      group: [],
      data: [],
      form: {
        userid:"",
        wgid:"",
        isLeader:0
      },
      rules: {
        wgid: [{required:true,message:"请选择工作组",trigger:"change"}]
      }
    };
  },
  methods: {
    async open() {
      this.modal = true;
    },
    close() {
      this.modal = false;
    },
    handleSumbit() {
      this.workGroupMember_Post("C")
    },
    workGroupMember_Post(key,row) {
      let data = {};
      data.userid = this.userData.userid;
      data.wgid = this.form.wgid;
      data.isLeader = this.form.isLeader;
      if (key == "D") {
        data.userid = this.userData.userid
        data.wgid = row.wgid
        data.operatetype = key;
      }
      this.MK.Request("/Publics/Common/Dic/WorkGroupMember", "post", data).then(
        res => {
          if (res.code == 0) {
            this.$message({
              message: res.msg,
              type: "success"
            });
            this.methods(this.userData.userid);
            this.modal = false
          }
        }
      );
    },
  },
  watch: {
    userData: {
      deep: true,
      handler(val) {
        let data = JSON.parse(JSON.stringify(val));
      }
    },
    modal(val) {
      if (!val) {
        this.$emit("update:userdata", {});
        this.form = {
          wgid: "",
          userid: "",
          isLeader: ""
        }
      } else {
        this.$refs.form.clearValidate()
        this.$refs.form.resetFields()
      }
    }
  }
};
</script>

<style scoped>
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>