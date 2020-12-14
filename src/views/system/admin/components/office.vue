<template>
  <vxe-modal
    v-model="modal"
    ref="modal"
    width="800"
    height="auto"
    :showFooter="true"
    @close="close"
	top="center"
  >
    <div slot="title">
      新增科室
      <span v-if="userData.userid">
        - [
        <span
          style="color:red;"
        >{{ userData.hospitalname }} - {{ userData.name }} - {{ userData.stafftype_display }}</span>
        ]
      </span>
    </div>
    <el-form :inline="true">
      <el-form-item>
        <mk-select
          :clearable="true"
          v-model="hospitalid"
          :filter="['hospitalname']"
          :datas="hList"
          width="760px"
          label="hospitalname"
          val="hospitalid"
          @change="handleChangeHos"
          placeholder="请先选择院区"
        ></mk-select>
        <!-- <mk-select
					url="/Publics/Common/Dic/HospitalInfo"
					:clearable="true"
					v-model="hospitalid"
					:filter="['hospitalname']"
					width="760px"
					label="hospitalname"
					val="hospitalid"
					@change="handleChangeHos"
					placeholder="请先选择院区"
        ></mk-select>-->
      </el-form-item>
    </el-form>
    <el-transfer
      v-if="hospitalid"
      style="text-align: left; display: inline-block;"
      v-model="officeForm.deptid"
      filterable
      filter-placeholder="按科室名称查询"
      :titles="['未选择科室', '已选择科室']"
      :button-texts="['删除', '添加']"
      :format="{
				noChecked: '${total}',
				hasChecked: '${checked}/${total}'
			}"
      @change="handleChange"
      :data="officeData"
    >
      <span slot-scope="{ option }">{{ option.label }}</span>
    </el-transfer>
    <div slot="footer" class="footer">
      <el-button-group>
        <!-- <el-button type="primary" @click="handleSumbit">提交</el-button> -->
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
      hospitalid: "",
      officeForm: {
        deptid: []
      },
      officeData: [],
      hList: []
    };
  },
  mounted() {
    //  this.getHList()
  },
  methods: {
    getHList() {
      this.MK.Request("/Publics/Common/Dic/HospitalInfo", "get", {}).then(
        res => {
          if (res.code == 0) {
            this.hList = res.data;
          }
        }
      );
    },
    async open() {
		
      this.officeData = [];
      this.modal = true;
      let res = await this.MK.Request(
        "/Publics/Common/Dic/HospitalInfo",
        "get",
        {}
	  );
      if (res.code == 0) {
		this.hList = res.data;
		
        if (this.hList.length == 1) {
          this.hospitalid = this.hList[0].hospitalid;
		  this.handleChangeHos();
		  this.$refs.modal.setPosition('center', 'center')
        }else{
			  this.hospitalid =""
		}
      }
    },
    close() {
      console.log(this.officeForm.deptid);
      console.log(this.officeForm.deptid);
      this.modal = false;
      this.methods(this.userData.userid);
    },
    handleChangeHos(val) {
      this.officeData = [];
      if (this.hospitalid) {
        this.depInfo_Get();
	  }
	   this.$refs.modal.setPosition(0, 'center')
    },
    handleChange(key, direction, keyarr) {
      console.log(key, direction, keyarr);
      let sendData = {
        operatetype: direction == "right" ? "C" : "D",
        userid: this.userData.userid,
        arrManageDept: keyarr
      };
      this.setAppinfo(sendData);
    },
    setAppinfo(sendData) {
      this.MK.Request(
        "/Publics/Common/UserInfo/ManageDept",
        "post",
        sendData
      ).then(res => {
        if (res.code == 0) {
          this.$message.success(res.msg);
        }
      });
    },
    handleSumbit(key, id) {
      let data = {};
      data.userid = this.userData.userid;
      if (this.officeForm.deptid.length == 1) {
        data.deptid = this.officeForm.deptid.join("");
      } else {
        // 穿梭框的数据回滚之后导致数据重复 那就去个重吧
        var arr = [];
        for (let i = 0; i < this.officeForm.deptid.length; i++) {
          if (arr.indexOf(this.officeForm.deptid[i]) === -1) {
            arr.push(this.officeForm.deptid[i]);
          }
        }
        data.arrManageDept = arr;
      }
      if (key == "D") {
        data.operatetype = key;
        data.deptid = id;
        data.arrManageDept = [];
        data.arrManageDept.push(id);
      }
      this.MK.Request("/Publics/Common/UserInfo/ManageDept", "post", data).then(
        res => {
          if (res.code == 0) {
            this.modal = false;
            this.$message({
              message: res.msg,
              type: "success"
            });
            this.methods(this.userData.userid);
            this.officeForm.deptid = [];
          }
        }
      );
    },
    depInfo_Get() {
      this.MK.Request("/Publics/Common/Dic/DepInfo/Tree", "get", {
        hospitalid: this.hospitalid
      }).then(res => {
        res.data.forEach(item => {
          this.officeData.push({
            label: item.Name,
            key: item.ID
          });
        });
      });
    }
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
        this.officeData = [];
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
>>> .el-transfer-panel {
  width: 260px;
}
>>> .el-transfer-panel .el-transfer-panel__header {
  background: rgb(132, 210, 207);
}
>>> .el-transfer-panel__body {
  height: 500px;
}
>>> .el-transfer-panel__list.is-filterable {
  height: 500px;
}
</style>
