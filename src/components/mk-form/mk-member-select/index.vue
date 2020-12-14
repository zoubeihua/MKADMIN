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
      :clearable="clearable"
    >
      <el-option
        v-for="(item, index) in managerList"
        :key="item.memberindexid"
        :label="item.cardno"
        :value="index"
      >
        <div class="tabel_lq">
          <div class="cell_lq">
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.cardno"
              placement="left"
            >
              <span class="cell_ellipsis w80">{{ item.cardno }}</span>
            </el-tooltip>
          </div>
          <div class="cell_lq">
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.sex_dispalay"
              placement="left"
            >
              <i
                :class="[
                  'mkfont',
                  item.sex == 1 ? 'nan' : item.sex == 2 ? 'nv' : 'weizhi'
                ]"
                :style="{
                  color:
                    item.sex == 1 ? '#6DCEFA' : item.sex == 2 ? '#F37E7D' : ''
                }"
              ></i>
            </el-tooltip>
            <span style="min-width:80px;display:inline-block;">{{
              item.membername
            }}</span>
          </div>
          <div class="cell_lq" v-if="isJzlx">
            <span class="cell_ellipsis w80">{{ item.jzlxname }}</span>
          </div>
          <!-- <div class="cell_lq" v-if="isJzlx">
            <span class="cell_ellipsis w80">{{ item.jzrq }}</span>
          </div> -->
          <div class="cell_lq">
            <span class="cell_ellipsis w80">{{ item.age }}</span>
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
                :style="{
                  color: item.icon ? item.icon.split(',')[1] : '',
                  fontSize: 28 + 'px'
                }"
              ></i>
            </el-tooltip>
          </div>
          <div class="cell_lq">{{ PhoneFormat({"mobiletel":item.mobiletel},'mobiletel') }}</div>
        </div>
      </el-option>
    </el-select>
  </div>
</template>
<script>
// value 暂时没用
// url   请求地址
// RequestData 请求参数
import util from "@/libs/util.js";
import { string } from "clipboard";
export default {
  name: "mk-member-select",
  props: {
    value: Array,
    url: String,
    RequestData: Object,
    clearable:{
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      managerList: [],
      loading: false,
      Identifier: this.value,
      isJzlx: false //是否展示 就诊分类 在添加临时计划用到
    };
  },
  watch: {
    RequestData: {
      handler: function(val, oldval) {
        if (JSON.stringify(val) === JSON.stringify(oldval)) {
          return;
        } else {
          this.BasicInfo_Get();
        }
      },
      deep: true //对象内部的属性监听，也叫深度监听
    }
  },
  methods: {
    BasicInfo_Get(value) {
      this.MK.Request(this.url, "get", {
        condition: value,
        createuserid: util.cookies.get("uuid"),
        ...this.RequestData
      }).then(res => {
        if (res.code == 0) {
          this.managerList = res.data;
          for (let key in res.data[0]) {
            if (key == "jzlxname") {
              this.isJzlx = true;
            }
          }
        }
      });
    },
    changeVal(index) {
      let item = this.managerList[index];
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
