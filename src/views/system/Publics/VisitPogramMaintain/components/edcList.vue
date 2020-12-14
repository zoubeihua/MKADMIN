<template>
  <el-select
    v-model="value"
    filterable
    clearable
    remote
    :remote-method="headlleRemote"
    @change="select"
    :placeholder="placeholder"
  >
    <el-option
      v-for="item in tabelList"
      :key="item.subclassid"
      :value="item.subclassid"
      :label="item.subclassname"
    >
      <div class="tabel_lq">
        <div class="cell_lq w80">
          <span class="cell_ellipsis ">{{ item.subclassid }}</span>
        </div>
        <div class="cell_lq w50">
          <el-tooltip
            class="item"
            effect="dark"
            :content="item.subclassname"
            placement="left"
          >
            <span class="cell_ellipsis">{{ item.subclassname }}</span>
          </el-tooltip>
        </div>
      </div>
    </el-option>
  </el-select>
</template>
<script>
import axios from "axios";
import util from "@/libs/util.js";
import dayjs from "dayjs";
export default {
  name: "edcList",
  props: ["Tag", "model","placeholder"],
  data() {
    return {
      dynamicTags: [],
      detallData: [],
      isSee: false,
      tagValue: this.Tag,
      siftData: {
        condition: "",
        Tag: parseInt(this.Tag)
      },
      value: this.model == -1 ? "" : this.model,
      form: {},
      pager: {
        count: 0,
        page: 1,
        rows: 20
      },
      tabelList: []
    };
  },
  watch: {
    Tag: function(val) {
      this.tagValue = val;
    },
    model: function(val) {
      this.value = val == -1 ? "" : val;
    }
  },
  created() {
    this.VisitEdcClassinfo_Get();
  },
  methods: {
    select(val) {
      var obj = {};
      obj = this.tabelList.find(function(item) {
        return item.subclassid === val;
      });
      this.$emit("select", obj, this.tagValue);
    },
    GetStutasType(STATUS) {
      //给状态加type; 0 未审核,1 审核通过  2 未通过,3 已发布,99 删除
      var type = "";
      if (STATUS == "未通过") {
        type = "warning";
      } else if (STATUS == "审核通过") {
        type = "success";
      } else if (STATUS == "未审核") {
        type = "warning";
      } else if (STATUS == "已发布") {
        type = "";
      } else {
        type = "danger"; //.....
      }
      return type;
    },
    headlleRemote(value) {
      this.siftData.condition = value;
      this.VisitEdcClassinfo_Get();
    },
    //根据健康宣教id(newsid)获取健康宣教明细
    VisitEdcClassinfo_Get() {
      this.MK.Request(
        "/Publics/VisitPogramMaintain/VisitEdcClassinfo_Get",
        "get",
        {
          ...this.siftData,
          ...this.pager
        }
      ).then(res => {
        if (res.code == 0) {
          this.tabelList = res.data;
          this.pager.count = res.count;
        }
      });
    },
    //健康宣教查看
    see(id) {
      this.MK.Request(
        "/Publics/HealthEducation/HealthEducationContentsByNewId_Get",
        "get",
        {
          newsid: id
        }
      ).then(res => {
        if (res.code == 0) {
          this.isSee = true;
          let resData = res.data;
          this.detallData = resData;
        }
      });
    },
    //根据健康宣教id(newsid)获取健康宣教明细​/Publics​/Repositoryinfo​/HealthEducationContentsByNewId_Get
    HealthEducationContentsByNewId_Get(newsid) {
      this.MK.Request(
        "/Publics/HealthEducation/HealthEducationContentsByNewId_Get",
        "get",
        {
          newsid: newsid
        }
      ).then(res => {
        this.form = { ...res.data };
        if (!!res.data.keyword) {
          this.dynamicTags = res.data.keyword.split(";");
        }

        this.drawer = true;
      });
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
  .w50 {
    width: calc(100% - 100px);
  }
  .cell_ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
}
</style>
