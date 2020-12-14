<template>
  <vxe-modal
    v-model="modal"
    title="新增套餐分类"
    :show-footer="true"
    width="540"
    height="auto"
    @close="close"
  >
    <el-form :model="form" ref="form" :rules="rules" label-width="110px">
      <el-form-item label="分类名称" prop="name">
        <el-input style="width:350px" v-model="form.name" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="备注" prop>
        <el-input
          style="width:350px"
          v-model="form.note"
          class="input"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 8}"
          placeholder="请输入内容"
        ></el-input>
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
  name: "type",
  props: {
    userData: {
      type: Object,
      default: () => {}
    },
    method: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      operatetype: "C",
      modal: false,
      form: {
        name: "",
        note: "",
        classifyid: "-1",
        orderno: "-1"
      },
      rules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    init() {
      this.operatetype = "C";
      this.form.name = "";
      this.form.note = "";
      this.form.classifyid = "-1";
      this.form.orderno = "-1";
    },
    async open() {
      this.modal = true;
    },
    close() {
      this.modal = false;
    },
    handleSumbit() {
      let data = JSON.parse(JSON.stringify(this.form));
      data.operatetype = this.operatetype;
      this.$refs.form.validate(valid => {
        if (valid) {
          this.packageclassify_Post(data);
        }
      });
    },
    packageclassify_Post(data) {
      this.MK.Request(
        "/Publics/CodePackageMaintain/Packageclassify_Post",
        "post",
        data
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.modal = false;
          this.method(this.form.packageid);
        }
      });
    }
  },
  watch: {
    userData: {
      deep: true,
		immediate:true,
      handler(val) {
        this.form.packageid = val.packageid;
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