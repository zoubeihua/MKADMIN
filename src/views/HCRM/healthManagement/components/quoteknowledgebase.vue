<template>
  <!--引用知识库  -->
  <span style="display: inline-block;" class="btn">
    <el-button :type="type" :disabled="disabled" style="width:100%;" title="引用知识库" @click="quoteK">
      <slot></slot>
    </el-button>
    <vxe-modal
      :key="key"
      resize
      fullscreen
      v-model="quoteModel"
      :showFooter="true"
      title="健康管理知识库引用"
      ref="quoteModel"
      width="1300"
      height="800"
    >
      <SplitPane :min-percent="20" :default-percent="40" split="vertical">
        <template slot="paneL">
          <el-container>
            <el-header style="padding: 0 !important;">
              <mk-select
                placeholder="请选择大类"
                @change="bigChange"
                v-model="bigVal"
                :datas="bigclassList"
                :filter="['bzname']"
                label="bzname"
                val="bzcode"
              ></mk-select>
            </el-header>
            <el-main style="padding:0;">
              <el-table
                border
                highlight-current-row
                :data="smallclassList"
                :row-key="getRowKeys"
                ref="refTable"
                :expand-row-keys="expands"
                @expand-change="rowChange"
                @row-click="smallClassRowClick"
                height="100%"
              >
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-table
                      highlight-current-row
                      :data="RepositoryinfoDetailList"
                      @row-click="RepositoryinfoRowClick"
                      :show-header="false"
                    >
                      <el-table-column label show-overflow-tooltip align="left" prop="levelname">
                        <template slot-scope="scope">
                          <div style="padding-left:60px;">
                            <el-radio
                              v-model="radio"
                              :label="scope.row.repositoryid"
                              style="margin-right:0 !important;"
                            >
                              <span class="el-radio__label"></span>
                            </el-radio>
                            <span>{{scope.row.repositoryname}}</span>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column label="健康方案知识库" show-overflow-tooltip align="left" prop="bzname"></el-table-column>
              </el-table>
            </el-main>
          </el-container>
        </template>
        <template slot="paneR">
          <SplitPane :min-percent="20" :default-percent="50" split="horizontal">
            <template slot="paneL">
              <el-container>
                <el-main style="padding:0;">
                  <div class="ql-snow ql-editor">
                    <div v-html="detallData.programcontent"></div>
                  </div>
                </el-main>
                <el-footer style="border-top:1px solid #ccc !important;">
                  <el-button type="danger" round @click="pushText">追加</el-button>
                  <el-button type="danger" round @click="insertText">插入</el-button>
                  <el-button type="danger" round @click="spliceText">替换</el-button>
                </el-footer>
              </el-container>
            </template>
            <template slot="paneR">
              <vue-editor
                @focus="toggleFocus($event)"
                @blur="toggleFocus($event, false)"
                style="height:calc(100% - 48px)"
                v-model="programcontent"
              ></vue-editor>
            </template>
          </SplitPane>
        </template>
      </SplitPane>
      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="primary" @click="submitConfirm">确认</el-button>
          <el-button type="warning" @click="quoteModel = false">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
  </span>
</template>
<script>
import { VueEditor, Quill } from "vue2-editor";
export default {
  name: "quoteknowledgebase",
  props: {
    value: "",
    type: {
      type: String,
      default: () => "primary"
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  components: {
    VueEditor
  },
  created() {},
  data() {
    return {
      quoteModel: false,
      programcontent: this.value,
      bigVal: "",
      bigclassList: [],
      smallclassList: [],
      RepositoryinfoDetailList: [],
      key: new Date().getTime(),
      radio: null, //
      expands: [],
      getRowKeys(row) {
        return row.bzcode;
      },
      parentRow: {},
      subRow: {},
      detallData: {},
      quill: null
    };
  },
  watch: {
    value(val) {
      this.programcontent = val;
    }
  },
  methods: {
    async quoteK() {
      this.quoteModel = true;
      this.programcontent = this.value;
      this.getBigClassData();
      this.init();
    },
    init() {
      this.quill = null;
      this.bigVal = "";
      this.smallclassList = [];
      this.radio = null; //
      this.expands = [];
      this.detallData = {};
    },
    toggleFocus(event, id, focused = true) {
      this.quill = focused ? event : {};
    },
    //插入
    insertText() {
      if (this.bigVal == "") {
        this.$message({
          type: "error",
          message: "请先选择知识库大类"
        });
        return;
      }
      if (!this.subRow.repositoryid) {
        this.$message({
          type: "error",
          message: "请先选择知识库小类"
        });
        return;
      }
      if (!this.parentRow.bzcode) {
        this.$message({
          type: "error",
          message: "请先选择知识库名称"
        });
        return;
      }
      if (this.detallData.programcontent == "") {
        this.$message({
          type: "error",
          message: "不能插入空内容"
        });
        return;
      }
      if (!this.quill) {
        this.$message({
          type: "error",
          message: "请先选择要插入内容的位置"
        });
        return;
      }
      let data = this.quill.getSelection();
      let index = data.index;
      this.quill.clipboard.dangerouslyPasteHTML(
        index,
        this.detallData.programcontent
      );
      // this.$emit("input", this.programcontent);
    },
    //追加
    pushText() {
      if (this.bigVal == "") {
        this.$message({
          type: "error",
          message: "请先选择知识库大类"
        });
        return;
      }
      if (!this.subRow.repositoryid) {
        this.$message({
          type: "error",
          message: "请先选择知识库小类"
        });
        return;
      }
      if (!this.parentRow.bzcode) {
        this.$message({
          type: "error",
          message: "请先选择知识库名称"
        });
        return;
      }
      if (this.detallData.programcontent == "") {
        this.$message({
          type: "error",
          message: "不能插入空内容"
        });
        return;
      }
      this.programcontent += this.detallData.programcontent;
    },
    //替换
    spliceText() {
      if (this.bigVal == "") {
        this.$message({
          type: "error",
          message: "请先选择知识库大类"
        });
        return;
      }
      if (!this.subRow.repositoryid) {
        this.$message({
          type: "error",
          message: "请先选择知识库小类"
        });
        return;
      }
      if (!this.parentRow.bzcode) {
        this.$message({
          type: "error",
          message: "请先选择知识库名称"
        });
        return;
      }
      if (this.detallData.programcontent == "") {
        this.$message({
          type: "error",
          message: "不能插入空内容"
        });
        return;
      }
      this.programcontent = this.detallData.programcontent;
    },
    submitConfirm() {
      this.$emit("change", this.programcontent);
      this.$emit("input", this.programcontent);
      this.quoteModel = false;
    },
    isOperate() {},
    getBigClassData() {
      let NewArr = [
        ...this.getDicStandarDcode("健康方案知识库大类"),
        ...this.getDicStandarDcode("健康方案知识库小类")
      ];
      this.bigclassList = this.getTree(NewArr);
      this.key = new Date().getTime();
    },
    //大类更改时间
    bigChange(data) {
      if (this.bigVal != "") {
        this.smallclassList = data.children;
      } else {
        this.smallclassList = [];
      }
    },
    //根据字典 bzcode[1,2,1-2,2-1,1-1,2-2] 组成树级结构
    getTree(data) {
      let result = [];
      let _this = this;
      data.map(function(d) {
        var child = d.bzcode.split("-");
        var temp = result;
        child.map(function(d2, i) {
          var _pos = _this.pos(temp, d2);
          if (_pos != -1) {
            temp = temp[_pos]["children"];
          } else {
            temp.push({
              bzcode: d.bzcode,
              bzname: d.bzname,
              filterstr: d.filterstr,
              codetype: d.codetype,
              orderno: d.orderno,
              children: []
            });
            temp = temp[temp.length - 1]["children"];
          }
        });
      });
      return result;
      console.log(result);
    },
    pos(list, id) {
      var _pos = -1;
      list.map(function(d, i) {
        if (d.bzcode == id) _pos = i;
      });
      return _pos;
    },
    //小类点击事件
    smallClassRowClick(row) {
      this.parentRow = row;
      this.$refs.refTable.toggleRowExpansion(row);
    },
    //查看详情
    RepositoryinfoRowClick(row) {
      this.radio = row.repositoryid;
      this.subRow = row;
      this.RepositoryinfoDetail_Get(row.repositoryid);
    },
    //根据知识库id(repositoryid)获取知识库明细​/Publics​/Repositoryinfo​/RepositoryinfoDetail_Get
    RepositoryinfoDetail_Get(repositoryid) {
      this.MK.Request(
        "/Publics/Repositoryinfo/RepositoryinfoDetail_Get",
        "get",
        {
          repositoryid: repositoryid
        }
      ).then(res => {
        if (res.code == 0) {
          this.detallData = res.data;
        }
      });
    },
    //根据知识库id(repositoryid)获取知识库明细
    RepositoryinfoList_Get() {
      let sendData = {
        bigclass: this.bigVal,
        smallclass: this.parentRow.bzcode,
        hospitalid: this.info.hospitalid,
        tag: 1
      };
      this.MK.Request(
        "/Publics/Repositoryinfo/RepositoryinfoList_Get",
        "get",
        sendData
      ).then(res => {
        if (res.code == 0) {
          this.RepositoryinfoDetailList = res.data;
        }
      });
    },
    //折叠事件
    async rowChange(row, expandedRows) {
      //	每次只展开一个扩展列表
      if (this.bigVal == "") {
        this.$message({
          type: "error",
          message: "请先选择大类"
        });
        return;
      }
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          this.radio = null;
          this.parentRow = row;
          this.RepositoryinfoList_Get();
          this.$nextTick(() => {
            this.expands.push(row.bzcode);
          });
        }
      } else {
        this.expands = [];
        this.parentRow = {};
        this.subRow = {};
      }
    }
  }
};
</script>
<style  scoped>
.content {
  padding: 20px;
}
.mainTitle {
  text-align: center;
  font: normal 27px/38px "微软雅黑", Microsoft Yahei, "黑体";
  color: #333;
}
>>> .el-drawer__body {
  overflow: auto;
}
/*2.隐藏滚动条，太丑了*/
>>> .el-drawer__container ::-webkit-scrollbar {
  display: none;
}
</style>
