<template>
  <div >
    <vxe-modal
      v-model="Modal"
      ref="vxeModel"
      resize
      :showFooter="true"
      title="健康体检方案维护"
      width="1200"
      height="800"
    >
      <el-container>
        <el-header style class="header">
          <div class="item">
            <span>风险类型：</span>
            <span>{{header.riskname}}</span>
          </div>
          <div class="item">
            <span>风险等级：</span>
            <span>
              <el-tag type="success">{{header.levelname}}</el-tag>
            </span>
          </div>
          <div class="item">
            <span>方案类型：</span>
            <span>
              <span
                 class="fa fa-circle"
                style="margin-right:2px;"
                :class="[header.programetype == 0 ? 'info' : header.programetype == 1 ? 'primary' : header.programetype == 2 ? 'warning' : 'danger']"
              ></span>
              {{header.programetypedisplay}}
            </span>
          </div>
          <div class="item">
            <span>方案名称：</span>
            <span>{{header.programename}}</span>
          </div>
          <div class="item">
            <span>适用性别：</span>
            <span>
              <span
                class="fa"
                style="font-size:16px;margin-right:6px;"
                :class="[header.limitsex == '1' ? 'fa-mars primary' : header.limitsex == '2' ? 'fa-venus danger' : 'fa-genderless warning']"
              ></span>
              <span>{{header.limitsex == 1 ? '适用男性' : header.limitsex == 2 ? '适用女性' : '男女通用'}}</span>
            </span>
          </div>
          <div class="item">
            <span>年龄范围：</span>
            <span>{{header.agerange == '-1' ? '不限年龄' : header.agerange}}</span>
          </div>
        </el-header>
        <el-main
          class="main"
          style="border:1px solid #d5d5d7;border-bottom:0;margin-top:10px;overflow-x: hidden;"
        >
          <div class="L">
            <el-container>
              <el-header style="padding:0;justify-content: space-between;">
                <div style="flex:2;padding-right:10px;">
                  <mk-select
                    v-if="Modal"
                    style="width:100%;"
                    v-model="leftdeptid"
                    placeholder="请选择科室"
                    :datas="deptInfo"
                    :filter="['deptname','filterstr']"
                    label="deptname"
                    val="deptid"
                  ></mk-select>
                </div>
                <div style="text-align:right;flex:1;padding-right:10px;">
                  <el-button
                    type="warning"
                    icon="el-icon-paperclip"
                    size="mini"
                    @click="drawer = true"
                  >引用</el-button>已选组合
                  <el-tag
                    size="mini"
                    type="danger"
                  >{{nowSelectLeftData.length}}/{{checkedGroupUpdate.length}}</el-tag>
                </div>
              </el-header>
              <el-main style="padding:0;">
                <el-table
                  border
                  :data="checkedGroupUpdate"
                  height="100%"
                  ref="leftRow"
                  @row-click="leftRowClick"
                  @selection-change="nowSelectLeftChange"
                  style="width: 100%"
                >
                  <el-table-column type="selection" align="center" ></el-table-column>
                  <el-table-column prop="groupname" label="组合名称"></el-table-column>
                  <el-table-column prop="discountfree" align="right" width="200" label="组合金额"></el-table-column>
                  <el-table-column prop="groupname" align="center" width="100" label="适用性别">
                    <template slot-scope="scope">
                      <span
                        class="fa"
                        style="font-size:16px;margin-right:6px;"
                        :title="scope.row.limitsex == 1 ? '适用男性' : scope.row.limitsex == 2 ? '适用女性' : '男女通用'"
                        :class="[scope.row.limitsex == '1' ? 'fa-mars primary' : scope.row.limitsex == '2' ? 'fa-venus danger' : 'fa-genderless warning']"
                      ></span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-main>
            </el-container>
          </div>
          <div class="C" style="border:1px solid #d5d5d7;border-top:0;">
            <div @click="handelSelect">
              <el-button
                icon="el-icon-d-arrow-right"
                :disabled="nowSelectLeftData.length?false:true"
                type="primary"
              >移除</el-button>
            </div>
            <div style="margin-top:10px;" @click="handleRemoveSelect">
              <el-button
                icon="el-icon-d-arrow-left"
                :disabled="nowSelectRightData.length?false:true"
                type="primary"
              >添加</el-button>
            </div>
          </div>
          <div class="R">
            <el-container>
              <el-header style="padding:0;justify-content: space-between;">
                <div style="flex:2;padding-right:10px;">
                  <mk-select
                    style="width:100%;"
                    v-if="Modal"
                    v-model="deptid"
                    @change="deptChange"
                    placeholder="请选择科室"
                    :datas="deptInfo"
                    :filter="['deptname','filterstr']"
                    label="deptname"
                    val="deptid"
                  ></mk-select>
                </div>
                <div style="text-align:right;flex:1;padding-right:10px;">
                  未选组合
                  <el-tag
                    size="mini"
                    type="danger"
                  >{{nowSelectRightData.length}}/{{unCheckedGroupUpdate.length}}</el-tag>
                </div>
              </el-header>
              <el-main style="padding:0;">
                <!-- :data="unCheckedGroup" -->
                <el-table
                  :data="unCheckedGroupUpdate"
                  border
                  height="100%"
                  ref="rightRow"
                  :row-key="getRowKeys"
                  :expand-row-keys="expands"
                  @expand-change="rowChange"
                  @row-click="rightRowClick"
                  :row-class-name="tableColor"
                  @selection-change="nowSelectRightChange"
                  style="width: 100%"
                >
                  <el-table-column
                    type="selection"
                    :selectable="checkSelectable"
                    align="center"
                    width="50"
                  ></el-table-column>
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-table
                        :data="progDetail"
                        border
                        :show-header="false"
                      >
                      <el-table-column prop="itemname" ></el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column prop="groupname" label="组合名称"></el-table-column>
                  <el-table-column prop="discountfree" align="right" width="200" label="组合金额"></el-table-column>
                  <el-table-column prop="groupname" align="center"  width="100" label="适用性别">
                    <template slot-scope="scope">
                      <span
                        class="fa"
                        style="font-size:16px;margin-right:6px;"
                        :title="scope.row.limitsex == 1 ? '适用男性' : scope.row.limitsex == 2 ? '适用女性' : '男女通用'"
                        :class="[scope.row.limitsex == '1' ? 'fa-mars primary' : scope.row.limitsex == '2' ? 'fa-venus danger' : 'fa-genderless warning']"
                      ></span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-main>
            </el-container>
          </div>
        </el-main>
      </el-container>
      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="success" @click="submitData">提交</el-button>
          <el-button type="warning" @click="Modal=false">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
    <el-drawer
      title="引用"
      :visible.sync="drawer"
      direction="ttb"
      size="100%"
      :before-close="handleDrawerClose"
    >
      <div class="demo-drawer__content">
        <el-container>
          <el-header style="padding:0 !important;border-bottom:1px solid #ccc !important;">
            <el-form :inline="true">
              <el-form-item label="分类名称">
                <mk-select
                  v-model="pagerphysicalCheckup.risktypeid"
                  placeholder="请选择分类"
                  url="/Hcrm/Risktypeinfo/risktypeinfo_Get"
                  @change="riskChang"
                  :filter="['riskname']"
                  label="riskname"
                  val="riskid"
                ></mk-select>
              </el-form-item>
              <el-form-item label="风险等级">
                <mk-select
                  :key="key"
                  v-model="pagerphysicalCheckup.levelid"
                  placeholder="请选择风险等级"
                  :datas="levelList"
                  @change="levelChang"
                  :filter="['levelname']"
                  label="levelname"
                  val="levelid"
                ></mk-select>
              </el-form-item>
            </el-form>
          </el-header>
          <el-main style="padding:0;">
            <SplitPane :min-percent="20" :default-percent="50" split="vertical">
              <template slot="paneL">
                <el-container>
                  <el-table
                     border
                    :data="programeList"
                    @row-click="programeClick"
                    highlight-current-row
                    stripe
                    height="100%"
                  >
                    <el-table-column
                      label="方案ID"
                      show-overflow-tooltip
                      prop="programeid"
                    />
                    <el-table-column
                      label="方案名称"
                      show-overflow-tooltip
                      align="center"
                      prop="programename"
                    />
                    <el-table-column
                      label="方案类型"
                      show-overflow-tooltip
                      align="center"
                      prop="programetypedisplay"
                    >
                      <template slot-scope="scope">
                        <span
                          style="margin-right:6px;"
                          :class="[scope.row.programetype == 0 ? 'info' : scope.row.programetype == 1 ? 'primary' : scope.row.programetype == 2 ? 'warning' : 'danger']"
                        >●</span>
                        <span>{{scope.row.programetypedisplay}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="方案描述"
                      show-overflow-tooltip
                      align="center"
                      prop="programenote"
                    ></el-table-column>
                    <el-table-column
                      label="适用性别"
                      width="100"
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
                        <!-- <span>{{scope.row.limitsex == 1 ? '适用男性' : scope.row.limitsex == 2 ? '适用女性' : '男女通用'}}</span> -->
                      </template>
                    </el-table-column>
                  </el-table>
                </el-container>
              </template>
              <template slot="paneR">
                <el-container>
                  <el-table
                    :data="GroupDataList"
                    ref="GroupDataList"
                    height="100%"
                    @selection-change="GroupDataChange"
                    style="width: 100%"
                  >
                    <el-table-column type="selection" align="center" width="50"></el-table-column>
                    <el-table-column prop="groupname" label="组合名称"></el-table-column>
                    <el-table-column prop="discountfree" align="right" label="组合金额"></el-table-column>
                    <el-table-column prop="groupname" align="center" label="适用性别">
                      <template slot-scope="scope">
                        <span
                          class="fa"
                          style="font-size:16px;margin-right:6px;"
                          :title="scope.row.limitsex == 1 ? '适用男性' : scope.row.limitsex == 2 ? '适用女性' : '男女通用'"
                          :class="[scope.row.limitsex == '1' ? 'fa-mars primary' : scope.row.limitsex == '2' ? 'fa-venus danger' : 'fa-genderless warning']"
                        ></span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-container>
              </template>
            </SplitPane>
          </el-main>
          <el-footer style="justify-content: center;">
            <el-button-group>
              <el-button type="success" :disabled="this.GroupDataList.length == 0" @click="quote">引用</el-button>
              <el-button type="warning" @click="drawer=false">取消</el-button>
            </el-button-group>
          </el-footer>
        </el-container>
      </div>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: "ProjectCognate",
  data() {
    return {
      progDetail: [], //项目体检明细
      getRowKeys(row) {
        return row.groupid;
      },
      expands: [],
      drawer: false,
      Modal: false,
      deptid: "",
      leftdeptid: "",
      groupname: "",
      header: {},
      deptInfo: [],
      levelList: [], //等级数据
      key: new Date().getTime(),
      programeList: [], //方案数据
      GroupDataList: [],
      nowSelectLeftData: [], // 左边选中列表数据
      nowSelectRightData: [], // 右边选中列表数据
      checkedGroup: [], //左边数据
      unCheckedGroup: [], //右边数据
      ModalData: {
        programeid: "",
        hospitalid: "",
        lstDetail: []
      },
      pagerphysicalCheckup: {
        count: 0,
        page: 1,
        rows: 10,
        tag: 1,
        risktypeid: "",
        levelid: ""
      }
    };
  },
  methods: {
    handleDrawerClose(done) {
      this.programeList = [];
      this.GroupDataList = [];
      this.pagerphysicalCheckup.risktypeid = "";
      this.pagerphysicalCheckup.levelid = "";
      done();
    },
    //选择状态
    checkSelectable(row) {
      return row.toproject != "0";
    },
    tableColor({ row }) {
      if (row.toproject == "0") {
        return "danger-bg";
      }
    },
    init() {
      this.groupname = "";
      this.header = {};
      this.deptInfo = [];
      this.nowSelectLeftData = []; // 左边选中列表数据
      this.nowSelectRightData = []; // 右边选中列表数据
      this.checkedGroup = []; //左边数据
      this.unCheckedGroup = []; //右边数据
      this.ModalData = {
        programeid: "",
        hospitalid: this.info.hospitalid,
        lstDetail: []
      };
    },
    async open(data) {
      if (data) {
        this.ModalData.programeid = data.programeid;
        this.ModalData.lstDetail = [];
        this.deptid = "";
        this.ModalData.hospitalid = this.info.hospitalid;
        let res = await this.PEProgrameGroup_Get();
        if (res.code == 0) {
          this.Modal = true;
          // this.$refs.vxeModel.zoom().then(res => {
          //   console.log(res)
          // })
          this.$refs.vxeModel.maximize()
          this.header = res.header;
          this.deptInfo = res.deptInfo;
          this.checkedGroup = res.checkedGroup;
          this.unCheckedGroup = res.unCheckedGroup;
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      }
    },
    //根据体检方案id(programeid)获取对应的体检项目信息[院区id带上]
    PEProgrameGroup_Get() {
      return this.MK.Request(
        "/Hcrm/PEPrograme/PEProgrameGroup_Get",
        "get",
        this.ModalData
      );
    },
    close() {
      this.Modal = false;
    },
    async submitData() {
      let data = {
        leftdata: this.checkedGroupUpdate,
        rightdata: this.unCheckedGroupUpdate,
        leftcheckdata: this.nowSelectLeftData,
        rightcheckdata: this.nowSelectRightData
      };
      this.$emit("change", data);
      let res = await this.PEProgrameGroup_Add();
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.init();
        this.close();
      }
    },
    //保存体检方案对应项目组合
    PEProgrameGroup_Add() {
      this.ModalData.lstDetail = this.checkedGroupUpdate;
      return this.MK.Request(
        "/Hcrm/PEPrograme/PEProgrameGroup_Add",
        "post",
        this.ModalData
      );
    },
    //左边选中事件
    nowSelectLeftChange(val) {
      this.nowSelectLeftData = val;
    },
    //右边选中事件
    nowSelectRightChange(val) {
      this.nowSelectRightData = val;
    },
    // 移除
    handelSelect() {
      this.unCheckedGroup = this.handleConcatArr(
        this.unCheckedGroup,
        this.nowSelectLeftData
      );
      this.handleRemoveTabList(this.nowSelectLeftData, this.checkedGroup);
      this.nowSelectLeftData = [];
    },
    // 添加
    handleRemoveSelect() {
      this.checkedGroup = this.handleConcatArr(
        this.checkedGroup,
        this.nowSelectRightData
      );
      this.handleRemoveTabList(this.nowSelectRightData, this.unCheckedGroup);
      this.nowSelectRightData = [];
    },
    handleConcatArr(a, b) {
      let arr = [];
      arr = arr.concat(a, b);
      let temp = {}; //用于groupid判断重复
      let result = []; //最后的新数组
      //遍历arr数组，将每个item.groupid在temp中是否存在值做判断，
      arr.map((item, index) => {
        if (!temp[item.groupid]) {
          result.push(item);
          temp[item.groupid] = true;
        }
      });
      return result;
    },
    handleRemoveTabList(isNeedArr, originalArr) {
      if (isNeedArr.length && originalArr.length) {
        for (let i = 0; i < isNeedArr.length; i++) {
          for (let k = 0; k < originalArr.length; k++) {
            if (isNeedArr[i]["groupid"] === originalArr[k]["groupid"]) {
              originalArr.splice(k, 1);
            }
          }
        }
      }
    },
    //选择科室
    deptChange(data) {
      console.log(data);
    },
    //右边列表行单击
    rightRowClick(row) {
      if (row.toproject != "0") {
        this.$refs.rightRow.toggleRowSelection(row);
      } else {
        this.$message({
          type: "error",
          message: "当前组合名称没有对应的明细项目"
        });
      }
    },
    //左边列表行单击
    leftRowClick(row) {
      this.$refs.leftRow.toggleRowSelection(row);
    },
    //分类更改事件
    async riskChang(data) {
      let res = await this.levelListGet(data.riskid);
      if (res.code == 0) {
        this.levelList = res.data;
        this.pagerphysicalCheckup.levelid = this.levelList[0].levelid || "";
        this.key = new Date().getTime();
        this.PEPrograme_Get();
      }
    },
    //根据分类id获取风险等级
    levelListGet(riskid) {
      return this.MK.Request("/Hcrm/Risktypeinfo/risklevel_Get", "get", {
        risktypeid: riskid,
        tag: 1
      });
    },
    //风险等级更改事件
    levelChang(data) {
      this.PEPrograme_Get();
    },
    // 根据风险类型，风险等级获取对应的体检方案
    PEPrograme_Get() {
      this.MK.Request(
        "/Hcrm/PEPrograme/PEPrograme_Get",
        "get",
        this.pagerphysicalCheckup
      ).then(res => {
        if (res.code == 0) {
          //根据适用性别来筛选数据
          this.programeList = res.data.filter(item =>
            this.header.limitsex == 1
              ? item.limitsex == 1 || item.limitsex == 0
              : this.header.limitsex == 2
              ? item.limitsex == 2 || item.limitsex == 0
              : item
          );
        }
      });
    },
    //方案行点击事件
    programeClick(row) {
      this.MK.Request("/Hcrm/PEPrograme/PEProgrameGroup_Get", "get", {
        programeid: row.programeid,
        hospitalid: this.info.hospitalid
      }).then(res => {
        if (res.code == 0) {
          this.GroupDataList = res.checkedGroup;
          this.$refs.GroupDataList.toggleAllSelection(this.GroupDataList);
        }
      });
    },
    //组合更改事件
    GroupDataChange(val) {
      this.GroupDataChangeList = val;
    },
    //quote 引用
    quote() {
       this.checkedGroup = this.handleConcatArr(
        this.checkedGroup,
        this.GroupDataChangeList
      );
      for (let i = 0; i < this.GroupDataList.length; i++) {
        for (let j = 0; j < this.unCheckedGroup.length; j++) {
          if (this.GroupDataList[i].groupid == this.unCheckedGroup[j].groupid) {
            this.unCheckedGroup.splice(j, 1);
          }
        }
      }
      this.unCheckedGroupUpdate = this.unCheckedGroup;
      this.drawer = false;
    },
    //折叠事件
    async rowChange(row, expandedRows) {
      //	每次只展开一个扩展列表
      var that = this;
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          let res = await this.PEItemDetail_Get(row.deptid, row.groupid);
          if (res.code == 0) {
            this.progDetail = res.data;
            this.expands.push(row.groupid);
          }
        }
      } else {
      }
    },
    //根据院区id，科室id，组合id获取对应的体检明细项目
    PEItemDetail_Get(deptid, groupid) {
      return this.MK.Request("/Hcrm/PEPrograme/PEItemDetail_Get", "get", {
        hospitalid: this.info.hospitalid,
        deptid: deptid,
        groupid: groupid
      });
    }
  },
  computed: {
    unCheckedGroupUpdate: {
      get() {
        if (this.deptid == "") {
          return this.unCheckedGroup;
        } else {
          return this.unCheckedGroup.filter(item => this.deptid == item.deptid);
        }
      },
      set(val) {
        this.unCheckedGroup = val;
      }
    },
    checkedGroupUpdate: {
      get() {
        if (this.leftdeptid != "") {
          return this.checkedGroup.filter(
            item => this.leftdeptid == item.deptid
          );
        } else {
          return this.checkedGroup;
        }
      }
    }
  }
};
</script>
<style scoped>
.header {
  justify-content: center;
  padding: 0 10px !important;
  background-color: #f8f8f8 !important;
  border-radius: 5px !important;
}
.main {
  padding: 0 !important;
  display: flex;
}
.main .L,
.main .R {
  width: 50%;
}
.main .C {
  /* flex-basis: 100px; */
  padding: 0 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.item {
  flex: 1;
  text-align: center;
  /* flex-basis: 16%; */
}
.demo-drawer__content {
  padding: 10px;
  height: 100%;
  margin: 10px;
  border-radius: 10px 10px 0 0;
  background: #fff;
}
>>> .el-drawer__header {
  margin-bottom: 0 !important;
}
>>> .el-drawer {
  background: #f5f6f9;
}
>>> .el-table__expanded-cell[class*="cell"] {
  padding: 10px !important;
}
</style>
