<template>
  <el-container>
    <el-header>
      <el-form :inline="true">
        <el-form-item label="就诊类型">
          <mk-select
            v-model="form.jzclass"
            placeholder="请选择"
            @change="jzclassChange"
            :datas="getDicStandarDcode('就诊分类')"
            :filter="['bzname','filterstr']"
            label="bzname"
            val="bzcode"
          ></mk-select>
        </el-form-item>
        <el-form-item label="就诊分类">
          <mk-select
            v-model="form.classid"
            placeholder="请选择就诊分类"
            url="/Publics/CRFClassMaintain/edcclassinfo_Get"
            @change="classChang"
            :filter="['classname']"
            label="classname"
            val="classid"
          ></mk-select>
        </el-form-item>
        <el-form-item label="类别分类">
          <mk-select
            v-model="form.subclassid"
            placeholder="请选择类别分类"
            @change="subclassChange"
            :datas="subList"
            :filter="['subclassname']"
            label="subclassname"
            val="subclassid"
          ></mk-select>
        </el-form-item>
        <el-form-item label="就诊日期">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="daterange"
            type="daterange"
            align="right"
            unlink-panels
            @change="dateRangeChange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="就诊机构" prop="pass">
          <el-select
            v-model="form.orgid"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请输入就诊机构"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in orgList"
              :key="item.orgid"
              :label="item.orgname"
              :value="item.orgid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item></el-form-item>
      </el-form>
    </el-header>
    <el-main style="padding:0;">
      <el-container>
        <el-aside :width="iswidth ? '300px' : '0'" style="border-right:1px solid #eee;">
          <el-container>
            <el-header
              style="height:40px !important;min-height: 40px !important;padding:0 !important;"
            >
              <el-tabs
                style="width:100%;"
                v-model="form.GroupTag"
                :stretch="true"
                @tab-click="handleGroupTagClick"
              >
                <el-tab-pane label="就诊机构" name="1"></el-tab-pane>
                <el-tab-pane label="就诊分类" name="2"></el-tab-pane>
                <el-tab-pane label="就诊类别" name="3"></el-tab-pane>
              </el-tabs>
            </el-header>
            <el-main style="padding:0;">
              <div
                style="height:100%;width:100%;	display: flex;flex-direction:column;background-color:#f5f5f5;padding: 0 6px;"
              >
                <div style="display: flex;height:40px;align-items: center;">
                  <el-link
                    :icon="dexpandAll ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"
                    :underline="false"
                    @click="expand"
                  >{{dexpandAll ? '全部收起' : '全部展开'}}</el-link>
                </div>
                <div
                  style="display: flex;flex:1;width:100%;overflow: auto;justify-content: center;border: 1px dashed #ccc;background:#fff;"
                >
                  <el-scrollbar style="height:100%;width:100%;">
                    <el-tree
                      v-if="treeShow"
                      :data="treeData"
                      :default-expand-all="dexpandAll"
                      ref="treeData"
                      highlight-current
                      :props="defaultProps"
                      @node-expand="handleNodeClick"
                      @node-click="handleNodeClick"
                    >
                      <span
                        class="custom-tree-node"
                        style="margin:16px 0;"
                        slot-scope="{ node, data }"
                      >
                        <span v-if="form.GroupTag == 1">
                          <span v-show="node.level == 1">
                            <i
                              class="el-icon-location-information"
                              style="color:#00a516;font-size:16px;"
                            ></i>
                            <span style="font-size:16px;margin-left:4px;">{{data.orgidname}}</span>
                          </span>
                          <span v-show="node.level == 2">
                            <span style="margin-left:6px;">{{data.jzclassdisplay}}</span>
                          </span>
                          <span v-show="node.level == 3">
                            <span style="margin-left:6px;">
                              <span v-if="data.remarks == ''">
                                {{data.subclassname}}
                                <span style="color:red;">[ {{data.jzdate}} ]</span>
                              </span>
                              <span v-else>
                                <el-tooltip
                                  class="item"
                                  effect="dark"
                                  :content="data.remarks"
                                  placement="right"
                                >
                                  <span>
                                    <span style="display: inline-block;">{{data.subclassname}}</span>
                                    <span style="color:red;display: inline-block;">[ {{data.jzdate}} ]</span>
                                    <span style="display: inline-block;width: 50px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;">{{data.remarks}}</span>
                                  </span>
                                </el-tooltip>
                              </span>
                            </span>
                          </span>
                        </span>
                        <span v-if="form.GroupTag == 2">
                          <span v-show="node.level == 1">
                            <i
                              class="el-icon-location-information"
                              style="color:#00a516;font-size:16px;"
                            ></i>
                            <span style="font-size:16px;margin-left:4px;">{{data.jzclassdisplay}}</span>
                          </span>
                          <span v-show="node.level == 2">
                            <span style="margin-left:6px;">{{data.classname}}</span>
                          </span>
                          <span v-show="node.level == 3">
                            <span style="margin-left:6px;">
                              <span v-if="data.remarks == ''">
                                {{data.subclassname}}
                                <span style="color:red;">[ {{data.jzdate}} ]</span>
                              </span>
                              <span v-else>
                                <el-tooltip
                                  class="item"
                                  effect="dark"
                                  :content="data.remarks"
                                  placement="right"
                                >
                                  <span>
                                    <span style="display: inline-block;">{{data.subclassname}}</span>
                                    <span style="color:red;display: inline-block;">[ {{data.jzdate}} ]</span>
                                    <span style="display: inline-block;width: 50px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;">{{data.remarks}}</span>
                                  </span>
                                </el-tooltip>
                              </span>
                            </span>
                          </span>
                        </span>
                        <span v-if="form.GroupTag == 3">
                          <span v-show="node.level == 1">
                            <i class="el-icon-document" style="color:#00a516;font-size:16px;"></i>
                            <span style="font-size:16px;margin-left:4px;">{{data.classname}}</span>
                          </span>
                          <span v-show="node.level == 2">
                            <span style="margin-left:6px;">{{data.subclassname}}</span>
                          </span>
                          <span v-show="node.level == 3">
                            <span style="margin-left:6px;">
                              <span v-if="data.remarks == ''">
                                {{data.subclassname}}
                                <span style="color:red;">[ {{data.jzdate}} ]</span>
                              </span>
                              <span v-else>
                                <el-tooltip
                                  class="item"
                                  effect="dark"
                                  :content="data.remarks"
                                  placement="right"
                                >
                                  <span>
                                    <span style="display: inline-block;">{{data.subclassname}}</span>
                                    <span style="color:red;display: inline-block;">[ {{data.jzdate}} ]</span>
                                    <span style="display: inline-block;width: 50px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: middle;">{{data.remarks}}</span>
                                  </span>
                                </el-tooltip>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </el-tree>
                  </el-scrollbar>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-aside>
        <el-main style="padding:0 4px;">
         <el-container>
           <el-header style="padding: 0 6px !important;">
             <el-link type="info" :title="iswidth ? '收缩' : '展开'" @click="setLW" :underline="false" icon="el-icon-s-fold" style="font-size:20px;margin-right:6px;"></el-link>
            <div v-if="curData.classid" style="color:red;">
              <span>
                 <b>就诊机构:</b>  <i class="el-icon-location-information" style="color:#00a516;"></i>{{curData.orgidname}}
              </span>
              <span style="margin-left:6px;padding-left:10px;border-left:1px solid #ccc;">
                <b>就诊分类:</b>  <i class="el-icon-location-information" style="color:#00a516;"></i> {{curData.jzclassdisplay}}
              </span>
               <span style="margin-left:6px;padding-left:10px;border-left:1px solid #ccc;">
                <b>就诊类别:</b>  <i class="el-icon-document" style="color:#00a516;"></i> {{curData.classname}}
              </span>
              <span style="margin-left:6px;padding-left:10px;border-left:1px solid #ccc;">
                <b>类别名称:</b>  <i class="el-icon-document" style="color:#00a516;"></i> {{curData.subclassname}}
              </span>
               <span style="margin-left:6px;padding-left:10px;border-left:1px solid #ccc;">
                <b>就诊日期:</b>  <i class="el-icon-time" style="color:#00a516;"></i> {{curData.jzdate}}
              </span>
            </div>
           </el-header>
           <el-main style="padding:0;">
              <mk-tabs-crf ref="tabscrf" :edit="false"></mk-tabs-crf>
           </el-main>
         </el-container>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>
<script>
export default {
  props: {
    userData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      iswidth:true,
      dexpandAll: true,
      treeShow: true,
      drawer: false,
      treeData: [],
      defaultProps: {
        label: "orgidname",
        children: "children"
      },
      pager: {
        page: 1,
        rows: 20,
        count: 0
      },
      form: {
        memberid: "",
        GroupTag: "1",
        jzdateBegin: "",
        jzdateEnd: "",
        jzclass: "",
        classid: "",
        subclassid: "",
        orgid: "",
        condition: "", //机构名称,就诊类别名称
        tag: 1
      },
      curData:{

      },
      sendData: {},
      rightDataList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      subList: [],
      daterange: "", //日期范围
      orgList: [],
      loading: false
    };
  },
  created() {
    this.MemberViewJzDataTree_Get();
  },
  watch: {
    treeData(val) {
      if (val.length == 0) {
        this.rightDataList = [];
      }
    }
  },
  methods: {
    setLW(){
      this.iswidth = !this.iswidth;
    },
    expand() {
      this.treeShow = false;
      this.dexpandAll = !this.dexpandAll;
      setTimeout(() => {
        this.treeShow = true;
      });
    },
    //查看表单
    seeDetail(row) {
      row.memberid = this.userData.memberid;
      this.$refs.tabscrf.CRFillJsonBysubclassid_Get(row);
    },
    //会员获取采集明细数据信息
    MemberViewJzDataTree_Get() {
      this.treeData = [];
      this.form.memberid = this.userData.memberid;
      this.MK.Request(
        "/Publics/MemberManage/MemberViewJzDataTree_Get",
        "get",
        this.form
      ).then(res => {
        if (res.code == 0) {
          this.treeData = res.data;
        }
      });
    },
    //tab切换
    handleGroupTagClick(tab) {
      this.rightDataList = [];
      this.MemberViewJzDataTree_Get();
    },
    //节点点击事件
    handleNodeClick(data, node) {
      if (this.form.GroupTag == 1) {
        if (node.level == 3) {
          this.sendData.orgid = data.orgid;
          this.sendData.jzclass = data.jzclass;
          this.sendData.classid = this.form.classid;
          this.sendData.subclassid = this.form.subclassid;
        }
      }
      if (this.form.GroupTag == 2) {
        if (node.level == 3) {
          this.sendData.jzclass = data.jzclass;
          this.sendData.classid = data.classid;
          this.sendData.orgid = this.form.orgid;
          this.sendData.subclassid = this.form.subclassid;
        }
      }
      if (this.form.GroupTag == 3) {
        if (node.level == 3) {
          this.sendData.classid = data.classid;
          this.sendData.subclassid = data.subclassid;
          this.sendData.jzclass = this.form.jzclass;
          this.sendData.orgid = this.form.orgid;
        }
      }
      if (node.level == 3) {
        this.curData = data;
        this.seeDetail(data);
      }
    },
    //
    MemberViewDetail_Get() {
      // 会员获取采集明细数据信息
      //       GroupTag 1 按就诊机构分 (orgid,jzclass)必须传值;
      //       GroupTag 2 按就诊分类(门诊,住院,体检分) (jzclass,classid)必须传值;
      //       GroupTag 3 采集类别(检查,检验,病历等)(classid,subclassid)必须传值;
      let sendData = {
        memberid: this.userData.memberid,
        GroupTag: this.form.GroupTag,
        jzdateBegin: this.form.jzdateBegin,
        jzdateEnd: this.form.jzdateEnd,
        jzclass: "",
        classid: "",
        subclassid: "",
        orgid: "",
        condition: "" //机构名称,就诊类别名称
      };
      let NewData = { ...sendData, ...this.sendData, ...this.pager };
      this.MK.Request(
        "/Publics/MemberManage/MemberViewDetail_Get",
        "get",
        NewData
      ).then(res => {
        if (res.code == 0) {
          this.rightDataList = res.data;
          this.pager.count = res.count;
        }
      });
    },
    //就诊类型更改事件
    jzclassChange() {
      this.MemberViewJzDataTree_Get();
    },
    //就诊分类更改事件
    classChang(data) {
      if (data.classid == "") {
        this.subList = [];
        this.form.subclassid = "";
        this.MemberViewJzDataTree_Get();
        return;
      }
      this.edcsubclassinfo_Get(data.classid);
    },
    //类别分类更改事件
    subclassChange() {
      this.MemberViewJzDataTree_Get();
    },
    //时间更改事件
    dateRangeChange(val) {
      if (val == null) {
        this.form.jzdateBegin = "";
        this.form.jzdateEnd = "";
      } else {
        this.form.jzdateBegin = val[0];
        this.form.jzdateEnd = val[1];
      }
      this.MemberViewJzDataTree_Get();
    },
    //远程搜索
    remoteMethod(query) {
      if (query != "") {
        this.loading = true;
        let sendData = {
          hospitalid: this.info.hospitalid,
          condition: query
        };
        this.MK.Request(
          "/Publics/MemberCDR/hospitalorgan_Get",
          "get",
          sendData
        ).then(res => {
          this.loading = false;
          if (res.code == 0) {
            this.orgList = res.data;
            // this.orgList = res.data.filter(
            //   item =>
            //     item.orgname.indexOf(query) > -1 ||
            //     item.filterstr.indexOf(query) > -1
            // );
          }
        });
      } else {
        this.orgList = [];
      }
    },
    // 获取小类
    edcsubclassinfo_Get(classid) {
      this.MK.Request("/Publics/CRFClassMaintain/edcsubclassinfo_Get", "get", {
        tag: 1,
        classid: classid
      }).then(res => {
        if (res.code == 0) {
          this.subList = res.data;
          if (this.subList.length) {
            this.form.subclassid = this.subList[0].subclassid;
          } else {
            this.form.subclassid = "";
          }
          this.MemberViewJzDataTree_Get();
        }
      });
    }
  }
};
</script>
<style  scoped>
>>> .el-header {
  border-bottom: 1px solid #cfd7e5 !important;
}
.el-header >>> .el-form-item {
  margin-bottom: 10px !important;
}
</style>
