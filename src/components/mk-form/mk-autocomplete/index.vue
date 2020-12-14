<template>
  <div class>
    <el-select
       v-model="Identifier"
      filterable
      remote
      reserve-keyword
      placeholder="按会员手机号、卡号、姓名查询"
      :remote-method="BasicInfo_Get"
      :loading="loading"
      @change="changeVal"
    >
      <el-option
        v-for="(item,index) in managerList"
        :key="item.memberindexid"
        :label="item.cardno"
        :value="index"
      >
        <div class="tabel_lq">
          <div class="cell_lq">
            <el-tooltip class="item" effect="dark" :content="item.cardno" placement="left">
              <span class="cell_ellipsis w80">{{item.cardno}}</span>
            </el-tooltip>
          </div>
          <div class="cell_lq">
            <el-tooltip class="item" effect="dark" :content="item.sex_dispalay" placement="left">
              <i
                :class="['mkfont', item.sex == 1 ? 'nan' : item.sex == 2 ? 'nv' : 'weizhi']"
                :style="{color: item.sex == 1 ? '#6DCEFA' : item.sex == 2 ? '#F37E7D' : '' }"
              ></i>
            </el-tooltip>
            <span style="min-width:80px;display:inline-block;">{{item.membername}}</span>
          </div>
          <div class="cell_lq">
            <span class="cell_ellipsis w80">{{item.age}}</span>
          </div>
          <div class="cell_lq">
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.memberlevel_display"
              placement="right"
              style="width:40px"
            >
              <i
                :class="['mkfont', item.icon ? item.icon.split(',')[0] : '']"
                :style="{color: item.icon ? item.icon.split(',')[1] : '', fontSize: 28 + 'px'}"
              ></i>
            </el-tooltip>
          </div>
          <div class="cell_lq">{{PhoneFormat({"mobiletel":item.mobiletel},'mobiletel')}}</div>
        </div>
      </el-option>
    </el-select>
  </div>
</template>
<script>
import util from "@/libs/util.js";
export default {
  name: "mk-autocomplete",
  props: {
      value: {},
  },
  data() {
    return {
      managerList: [],
      loading: false,
      Identifier: this.value
    };
  },
  methods: {
    BasicInfo_Get(value) {
      this.MK.Request("Publics/MemberManage/BasicInfo", "get", {
        createuserid: util.cookies.get("uuid"),
        condition: value,
        mycustomer: 0,
        expirationdaysmemberfee: 0,
        tag: 0,
        page: 1,
        rows: 20
      }).then(res => {
        if (res.code == 0) {
          this.managerList = res.data;
        }
      });
    },
    changeVal(index) {
      let item = this.managerList[index];
      console.log(item);
      this.$emit("change", item);
    }
  }
};
</script>
<style lang="scss" scoped>
.tabel_lq {
  display: table;
  min-width: 100%;
  .cell_lq {
    display: table-cell;
    padding: 5px;
  }
  .w80 {
    width: 80px;
  }
  .cell_ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
}
</style>
