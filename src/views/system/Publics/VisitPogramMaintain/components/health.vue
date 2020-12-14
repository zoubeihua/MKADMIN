<template>
  <el-select
    v-model="value"
    clearable
    :placeholder="placeholder"
    filterable
    remote
    :remote-method="headlleRemote"
    @change="selectNews"
  >
    <el-option
      v-for="item in tabelList"
      :key="item.newsid"
      :value="item.newsid"
      :label="item.maintitle"
    >
      <div class="tabel_lq">
        <div class="cell_lq w80">
          <span class="cell_ellipsis ">{{ item.newsid }}</span>
        </div>
        <div class="cell_lq w50">
          <el-tooltip
            class="item"
            effect="dark"
            :content="item.maintitle"
            placement="left"
          >
            <span class="cell_ellipsis ">{{ item.maintitle }}</span>
          </el-tooltip>
        </div>
        <div class="cell_lq w80">
          <span class="cell_ellipsis ">{{ item.classiddisplay }}</span>
        </div>
        <div class="cell_lq  w80">
          <span class="cell_ellipsis">{{ item.authdisplay }}</span>
        </div>
      </div>
    </el-option>
  </el-select>
  <!-- 查看 -->
  <!-- <el-drawer
      title="健康宣教详情"
      :visible.sync="isSee"
      direction="rtl"
      size="50%"
      :with-header="false"
      :modal-append-to-body="false"
    >
      <el-scrollbar style="height:100%;width:100%;">
        <div class="newscontent">
          <h1 class="maintitle">{{ detallData.maintitle }}</h1>
          <div class="top-bar-wrap">
            <div class="info">
              作者：{{ detallData.createname }} 来源：{{ detallData.souce }}
              {{ detallData.createtime }}
            </div>
            <div class="count">
              <div class="item yd">
                <i class="el-icon-view iconSize"></i>
                <span style="margin-left:6px;font-size: 24px;">{{
                  detallData.click
                }}</span>
              </div>
              <div class="item">
                <el-badge
                  :value="parseInt(detallData.collectquantity)"
                  :max="99"
                >
                  <i class="el-icon-star-off iconSize"></i>
                </el-badge>
              </div>
              <div class="item pl">
                <i class="el-icon-chat-dot-round iconSize"></i>
                <span style="margin-left:6px;font-size: 24px;">{{
                  detallData.commentquantity
                }}</span>
              </div>
            </div>
          </div>
          <div class="ql-snow ql-editor" v-html="detallData.contents"></div>
        </div>
      </el-scrollbar>
    </el-drawer>
      -->
</template>
<script>
import axios from "axios";
import dayjs from "dayjs";
export default {
  name: "health",
  props: ["model","placeholder"],
  data() {
    return {
      detallData: [],
      isSee: false,
      siftData: {
        condition: ""
      },
      value: this.model == -1 ? "" : this.model,
      form: {
        operatetype: "", //操作类型 部分接口新增修改删除不单独,一个post搞定 C:新增 U:修改 D:删除 默认为C新增
        bigclass: "", //健康宣教大类，来源 标准字典表 的方案健康宣教大类
        filterstr: "",
        istop: 0, //是否置顶
        souce: "", //涞源
        keyword: "", //关键字
        maintitle: "", //健康宣教名称
        remark: "", //备注
        navicontent: "", //导读内容
        vicetitle: "", //副标题
        contents: "", //健康宣教富文本
        auth: "", //取字典信息(参数:资讯人群) :如:公共,患者端,医生端
        classid: "" //(参数:资讯分类) 如:饮食,运动,旅游
      },
      pager: {
        count: 0,
        page: 1,
        rows: 20
      },
      tabelList: []
    };
  },
  watch: {
    model: function(val) {
      this.value = val == -1 ? "" : val;
    }
  },
  created() {
    this.HealthEducationNewsinfoList_Get();
  },
  methods: {
    selectNews(val) {
      var obj = {};
      obj = this.tabelList.find(function(item) {
        return item.newsid === val;
      });
      this.$emit("func", obj);
    },
    headlleRemote(value) {
      this.siftData.condition = value;
      this.HealthEducationNewsinfoList_Get();
    },
    HealthEducationNewsinfoList_Get() {
      this.MK.Request(
        "/Publics/VisitPogramMaintain/VisitHealthEducationNewsinfoList_Get",
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
  .w50 {
    width: calc(100% - 350px);
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
