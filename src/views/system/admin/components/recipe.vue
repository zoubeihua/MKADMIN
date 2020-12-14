<template>
  <vxe-modal
    v-model="modal"
    ref="modal"
    width="540"
    height="auto"
    :showFooter="true"
    @close="close"
  >
    <div slot="title">
      处方权限
      <span v-if="userData.userid">
        - [
        <span style="color:red;">{{userData.name}} - {{userData.stafftype_display}}</span>
        ]
      </span>
    </div>
    <el-checkbox
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
    >全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="city in cities" :label="city.value" :value="city.value" :key="city.value">{{city.label}}</el-checkbox>
    </el-checkbox-group>
    <div slot="footer" class="footer">
      <el-button-group>
        <el-button type="primary" @click="handleSumbit">提交</el-button>
        <el-button type="warning" @click="close">关闭</el-button>
      </el-button-group>
    </div>
  </vxe-modal>
</template>

<script>
const cityOptions = [
  {
    value: "jmcf",
    label: "精麻处方权"
  },
  {
    value: "jzcf",
    label: "急诊处方权"
  },
  {
    value: "mzcf",
    label: "门诊处方权"
  },
  {
    value: "mzq",
    label: "麻醉权"
  },
  {
    value: "sszd",
    label: "手术主刀权"
  },
  {
    value: "sszg",
    label: "手术资格权"
  },
  {
    value: "zycf",
    label: "住院处方权"
  }
];
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
  data() {
    return {
      modal: false,
      recipeList: [],
      checkAll: false,
     checkedCities:[],
      cities: cityOptions,
      isIndeterminate: true,
      recipe: { jmcf: 0, jzcf: 0, mzcf: 0, mzq: 0, sszd: 0, sszg: 0, zycf: 0 },
      newRecipe: {}
    };
  },
  methods: {
    async open() {
      this.modal = true;
      this.recipe_Get(this.userData.userid);
    },
    close() {
      this.modal = false;
    },
    handleSumbit() {
      // 根据复选框状态处理接口数据
      let arr = this.checkedCities.map(item => item.value);
      for (let key in this.recipe) {
        let str = key.toString();
        if (arr.includes(str)) {
          this.recipe[key] = 1;
        } else {
          this.recipe[key] = 0;
        }
      }
      let data = this.recipe;
      data.userid = this.userData.userid;
      this.recipe_Post(data);
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      console.log(value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    // 处方权限
    recipe_Post(data) {
      this.MK.Request(
        "/Publics/Common/UserInfo/PrescriptionRight",
        "post",
        data
      ).then(res => {
        if (res.code == 0) {
          this.newRecipe = {};

          this.$message({
            message: res.msg,
            type: "success"
          });
          this.modal = false;
          this.recipe_Get(this.userData.userid);
        }
      });
    },
    // 获取处方权限
    recipe_Get(id) {
      var that =this;
       that.recipeList=[];
       that.checkedCities=[];
      that.MK.Request("/Publics/Common/UserInfo/PrescriptionRight", "get", {
        userid: id
      }).then(res => {
        if (res.code == 0) {
          if (res.data.length) {
            let data = JSON.parse(JSON.stringify(res.data[0]));
            delete data.userid;
            delete data.__RowCount;
            that.newRecipe = data;
            for (let key in that.newRecipe) {
              if (data[key] == 1) {
                that.recipeList.push({ recipe: key });
                for (const index in that.cities) {
                  if (that.cities[index].value == key) {
                    // this.$set( that.checkedCities,that.checkedCities.length, {
                    //   label:that.cities[index].label,
                    //   value:key
                    // } )
                    that.checkedCities.push(key)
                  }
                }
               
              }
            }
          }
          that.checkedCities=JSON.parse(JSON.stringify(that.checkedCities))
          console.log(that.checkedCities)
        //  that.checkedCities=JSON.parse(JSON.stringify(that.checkedCities));
        }
      });
    }
  },
  watch: {
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
        }
      }
    }
  }
};
</script>

<style>
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>