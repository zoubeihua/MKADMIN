<template>
  <!--引用方案  -->
  <span style="display: inline-block;">
    <el-button :type="type" style="width:100%;" :disabled="disabled" title="引用方案" @click="quoteP">
      <slot></slot>
    </el-button>
    <vxe-modal
      v-model="quoteModel"
      :showFooter="true"
      title="健康管理方案引用"
      ref="quoteModel"
      width="1000"
      height="800"
    >
      <SplitPane :min-percent="20" :default-percent="40" split="vertical">
        <template slot="paneL">
          <el-table
            :data="RiskList"
            :row-key="getRowKeys"
            ref="refTable"
            :expand-row-keys="expands"
            @expand-change="rowChange"
            @row-click="qriskRowClick"
            stripe
            border
            height="100%"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-table
                  highlight-current-row
                  :data="risklevelList"
                  @row-click="levelRowClick"
                  :show-header="false"
                >
                  <el-table-column
                    label="风险分类等级"
                    show-overflow-tooltip
                    align="left"
                    prop="levelname"
                  >
                    <template slot-scope="scope">
                      <div style="padding-left:60px;">
                        <el-radio
                          v-model="radio"
                          :label="scope.row.levelid"
                          style="margin-right:0 !important;"
                        >
                          <span class="el-radio__label"></span>
                        </el-radio>
                        <span style="color:#000;">类型：</span>
                        <span>{{scope.row.levelname}}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="风险分类描述"
                    show-overflow-tooltip
                    align="left"
                    prop="levelnote"
                  >
                    <template slot-scope="scope">
                      <div style="padding-left:60px;">
                        <span style="color:#000;">描述：</span>
                        <span>{{scope.row.levelnote}}</span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="风险分类名称" show-overflow-tooltip align="left" prop="riskname"></el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              prop="status"
              width="100"
              label="状态"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="GetOpenAndStoptatusType(scope.row.status)"
                  disable-transitions
                >{{ scope.row.statusdisplay }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template slot="paneR">
          <SplitPane :min-percent="20" :default-percent="50" split="horizontal">
            <template slot="paneL">
              <el-table :data="programList" stripe height="100%" border highlight-current-row>
                <el-table-column label="风险对应健康方案列表">
                  <el-table-column
                    label="方案名称"
                    show-overflow-tooltip
                    align="center"
                    prop="programname"
                  />
                  <el-table-column
                    label="方案描述"
                    show-overflow-tooltip
                    align="center"
                    prop="programnote"
                  ></el-table-column>
                  <el-table-column
                    label="适用性别"
                    show-overflow-tooltip
                    align="center"
                    prop="limitsex"
                  >
                    <template slot-scope="scope">
                      <span
                        class="fa"
                        style="font-size:16px;margin-right:6px;"
                        :title="scope.row.limitsex == 1 ? '适用男性' : scope.row.limitsex == 2 ? '适用女性' : '男女通用'"
                        :class="[scope.row.limitsex == '1' ? 'fa-mars primary' : scope.row.limitsex == '2' ? 'fa-venus danger' : 'fa-genderless warning']"
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" show-overflow-tooltip prop="status" label="状态">
                    <template slot-scope="scope">
                      <el-tag
                        :type="GetOpenAndStoptatusType(scope.row.status)"
                        disable-transitions
                      >{{ scope.row.statusdisplay }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" width="160" fixed="right" label="操作">
                    <template slot="header">
                      <span class="primary">操作</span>
                    </template>
                    <template slot-scope="scope">
                      <div class="tableBtn">
                        <el-link
                          title="添加"
                          :underline="false"
                          @click="Add(scope.row,scope.$index)"
                          type="primary"
                          icon="el-icon-plus"
                        ></el-link>
                        <el-link
                          title="查看"
                          :underline="false"
                          @click="healthprogramContent_Get(scope.row.programid)"
                          type="primary"
                          icon="el-icon-view"
                        ></el-link>
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </template>
            <!-- unProgramList -->
            <template slot="paneR">
              <el-table :data="unProgramList" stripe height="100%" border highlight-current-row>
                <el-table-column label="已添加方案列表">
                  <el-table-column
                    label="方案名称"
                    show-overflow-tooltip
                    align="center"
                    prop="programname"
                  />
                  <el-table-column
                    label="方案描述"
                    show-overflow-tooltip
                    align="center"
                    prop="programnote"
                  ></el-table-column>
                  <el-table-column
                    label="适用性别"
                    show-overflow-tooltip
                    align="center"
                    prop="limitsex"
                  >
                    <template slot-scope="scope">
                      <span
                        class="fa"
                        style="font-size:16px;margin-right:6px;"
                        :title="scope.row.limitsex == 1 ? '适用男性' : scope.row.limitsex == 2 ? '适用女性' : '男女通用'"
                        :class="[scope.row.limitsex == '1' ? 'fa-mars primary' : scope.row.limitsex == '2' ? 'fa-venus danger' : 'fa-genderless warning']"
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" show-overflow-tooltip prop="status" label="状态">
                    <template slot-scope="scope">
                      <el-tag
                        :type="GetOpenAndStoptatusType(scope.row.status)"
                        disable-transitions
                      >{{ scope.row.statusdisplay }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" width="160" fixed="right" label="操作">
                    <template slot="header">
                      <span class="primary">操作</span>
                    </template>
                    <template slot-scope="scope">
                      <div class="tableBtn">
                        <el-link
                          title="删除"
                          @click="Del(scope.row,scope.$index)"
                          :underline="false"
                          type="primary"
                          icon="el-icon-delete"
                        ></el-link>
                        <el-link
                          title="查看"
                          @click="healthprogramContent_Get(scope.row.programid)"
                          :underline="false"
                          type="primary"
                          icon="el-icon-view"
                        ></el-link>
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </template>
          </SplitPane>
        </template>
      </SplitPane>
      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="primary" @click="healthprogramContentArr_Add(1)">追加方案</el-button>
          <el-button type="primary" @click="healthprogramContentArr_Add(2)">替换方案</el-button>
          <el-button type="warning" @click="quoteModel = false">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
    <el-drawer
      title="方案详情"
      :visible.sync="drawer"
      :append-to-body="true"
      direction="rtl"
      size="50%"
      :with-header="false"
    >
      <div class="content">
        <h1 class="mainTitle">{{detallData.programname}}</h1>
        <div class="top-bar-wrap">
          <div class="info">
            <span>适用性别：</span>
            <span
              class="fa"
              style="font-size:16px;"
              :class="[detallData.limitsex == '1' ? 'fa-mars primary' : detallData.limitsex == '2' ? 'fa-venus danger' : 'fa-genderless warning']"
            ></span>
            <span
              style="margin-right:10px;"
            >{{detallData.limitsex == 1 ? '适用男性' : detallData.limitsex == 2 ? '适用女性' : '男女通用'}}</span>
            <span style="margin-right:10px;">风险分类：{{detallData.riskname}}</span>
            <span>风险等级：{{detallData.levelname}}</span>
          </div>
        </div>
        <div class="ql-snow ql-editor">
          <div v-html="detallData.programcontent"></div>
        </div>
      </div>
    </el-drawer>
  </span>
</template>
<script>
export default {
  name: "quoteprogramme",
  props: {
    type: {
      type: String,
      default: () => "primary"
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      quoteModel: false,
      drawer: false,
      RiskList: [],
      risklevelList: [],
      programList: [],
      unProgramList: [],
      radio: null, //
      expands: [],
      parentRow: {},
      subRow: {},
      detallData: {},
      getRowKeys(row) {
        return row.riskid;
      }
    };
  },
  methods: {
    //根据健康方案id获取健康方案明细信息
    healthprogramContent_Get(id) {
      this.MK.Request(
        "/Hcrm/Healthprograminfo/healthprogramContent_Get",
        "get",
        {
          programid: id
        }
      ).then(res => {
        if (res.code == 0) {
          this.detallData = res.data;
          this.drawer = true;
        }
      });
    },
    //查询风险类型信息
    refreshmemberUserInfo() {
      this.programList = [];
      this.unProgramList = [];
      this.expands = [];
      this.MK.Request("/Hcrm/Risktypeinfo/risktypeinfo_Get", "get", {
        tag: 1
      }).then(res => {
        if (res.code == 0) {
          this.RiskList = res.data;
          this.quoteModel = true;
        }
      });
    },
    quoteP() {
      this.refreshmemberUserInfo();
    },
    qriskRowClick(row) {
      this.$refs.refTable.toggleRowExpansion(row);
    },
    //折叠事件
    async rowChange(row, expandedRows) {
      //	每次只展开一个扩展列表
      var that = this;
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          let res = await this.risklevel_Get(row.riskid);
          if (res.code == 0) {
            this.radio = null;
            this.parentRow = row;
            this.risklevelList = res.data.filter(item => item.status != 99);
            this.$nextTick(() => {
              this.expands.push(row.riskid);
            });
          }
        }
      } else {
        this.expands = [];
        this.parentRow = {};
        this.subRow = {};
      }
    },
    //根据风险类型id查询风险等级
    risklevel_Get(riskid) {
      return this.MK.Request("/Hcrm/Risktypeinfo/risklevel_Get", "get", {
        risktypeid: riskid,
        tag: 1
      });
    },
    //等级行单击
    levelRowClick(row) {
      this.radio = row.levelid;
      this.subRow = row;
      this.PEPrograme_Get();
    },
    // 根据风险类型，风险等级获取对应的体检方案
    PEPrograme_Get() {
      if (!this.subRow.levelid) {
        this.$message({
          type: "info",
          message: "请选择风险等级"
        });
        return;
      }
      let sendData = {
        risktypeid: this.parentRow.riskid,
        levelid: this.subRow.levelid,
        tag: 1,
        hospitalid: this.info.hospitalid
      };
      this.MK.Request(
        "/Hcrm/Healthprograminfo/healthprogram_Get",
        "get",
        sendData
      ).then(res => {
        if (res.code == 0) {
          this.programList = res.data;
        }
      });
    },
    //添加
    Add(row, index) {
      let Arr = this.programList.splice(index, 1);
      let flag = this.unProgramList.some(
        item => item.programid == row.programid
      );
      if (!flag) {
        this.unProgramList = [...this.unProgramList, ...Arr];
      }
    },
    //删除
    Del(row, index) {
      let Arr = this.unProgramList.splice(index, 1);
      let flag = this.programList.some(item => item.programid == row.programid);
      if (!flag) {
        this.programList = [...this.programList, ...Arr];
      }
    },
    //方案追加/替换
    healthprogramContentArr_Add(type) {
      //type 1追加 2替换
      if (this.unProgramList.length == 0) {
        this.$message({
          type: "error",
          message: "请先添加方案"
        });
        return;
      }
      let programIdArr = [];
      let programname = "";
      this.unProgramList.forEach(item => {
        programIdArr.push(item.programid);
      });
      this.MK.Request(
        "/Hcrm/Healthprograminfo/healthprogramContentArr_Add",
        "post",
        { programIdArr: programIdArr }
      ).then(res => {
        this.unProgramList = [];
        let programeInfo = res.programeInfo;
        let programnameArr = [];
        let programcontent = "";
        programeInfo.forEach((item, index) => {
          programnameArr.push(item.programname);
          programcontent += `${item.programcontent} <br/>`;
        });
        if (type == 1) {
          this.$emit("push", {
            programename: programnameArr.join(","),
            programcontent: programcontent
          });
        } else {
          this.$emit("replace", {
            programename: programnameArr.join(","),
            programcontent: programcontent
          });
        }
        this.quoteModel = false;
      });
    },
    //去重
    unique(arr) {
      var newArr = [];
      //遍历老数组；

      arr.forEach(function(val) {
        //检测老数组中的元素，如果新数组中存在就不添加，不存在才添加;

        if (newArr.indexOf(val) == -1) {
          //去新数组中查找元素索引值，如果为-1就是没有；

          newArr.push(val);
        }
      });
      return newArr;
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
