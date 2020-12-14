<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true" class="headerFrom">
        <el-form-item>
          <el-date-picker
            v-model="siftData.dataRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="getDataRange"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item>
          <mk-select
            v-model="siftData.auth"
            placeholder="请选择人群分类"
            :datas="getDicStandarDcode('宣教权限')"
            :filter="['bzname','bzname']"
            label="bzname"
            val="bzcode"
            @change="HealthEducationNewsinfoList_Get"
          ></mk-select>
        </el-form-item> -->
        <el-form-item>
          <mk-select
            v-model="siftData.classid"
            placeholder="请选择分类"
            :datas="getDicStandarDcode('宣教分类')"
            :filter="['bzname','filterstr']"
            label="bzname"
            val="bzcode"
            @change="HealthEducationNewsinfoList_Get"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <mk-select
            v-model="siftData.status"
            placeholder="请选择状态"
            :datas="getDicStandarDcode('宣教状态')"
            :filter="['bzname','filterstr']"
            label="bzname"
            val="bzcode"
            @change="HealthEducationNewsinfoList_Get"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <el-button class="mr20" type="primary" icon="el-icon-search" @click="HealthEducationNewsinfoList_Get">查询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 列表 -->
    <SplitPane :min-percent="10" :default-percent="15" split="vertical">
      <template slot="paneL">
        <div class="typeTitle">人群分类</div>
        <div v-for="item in getDicStandarDcode('宣教权限')" :key="item.bzname" @click="popTypeClick(item.bzcode)" :class="[siftData.auth==item.bzcode?'popTypeClass popActive':'popTypeClass']" >
          <p>{{item.bzname}}</p>
        </div>
      </template>
      <template slot="paneR">
        <el-container>
          <el-table
            :data="tabelList"
            border
            style="width: 100%"
            height="100%"
            highlight-current-row
            sort-change="changeTableSort"
          >
            <el-table-column
              prop="newsid"
              label="资讯ID"
              width="100"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="maintitle"
              label="标题"
              width="360"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-link type="primary" @click="see(scope.row.newsid)">{{scope.row.maintitle}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="istop"
              label="是否置顶"
              align="center"
              width="180"
              :show-overflow-tooltip="true"
              sortable
            >
              <template slot-scope="scope">{{scope.row.istop == '1' ? '已置顶' : '未置顶'}}</template>
            </el-table-column>
            <!-- <el-table-column prop="createname" label="作者" align="center" width="100" :show-overflow-tooltip="true"></el-table-column> -->
            <el-table-column
              prop="souce"
              label="消息来源 "
              :show-overflow-tooltip="true"
              align="center"
              width="150"
              sortable
            ></el-table-column>

            <el-table-column
              prop="click"
              label="点击次数"
              width="120"
              :show-overflow-tooltip="true"
              align="center"
              sortable
            ></el-table-column>
            <el-table-column
              prop="collectquantity"
              label="收藏次数"
              width="120"
              :show-overflow-tooltip="true"
              align="center"
              sortable
            ></el-table-column>
            <el-table-column
              prop="commentquantity"
              label="评论次数"
              width="120"
              :show-overflow-tooltip="true"
              align="center"
              sortable
            ></el-table-column>
            <el-table-column
              prop="classiddispaly"
              label="资讯分类"
              width="120"
              :show-overflow-tooltip="true"
              align="center"
              sortable
            ></el-table-column>
            <el-table-column
              prop="authdispaly"
              label="人群分类"
              width="100"
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="statusdispaly"
              label="状态"
              :show-overflow-tooltip="true"
              width="100"
              align="center"
              sortable
            >
              <template slot-scope="scope">
                <el-tag :type="GetStutasType(scope.row.statusdispaly)" disable-transitions>
                  {{
                  scope.row.statusdispaly
                  }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="createname"
              label="创建人"
              :show-overflow-tooltip="true"
              width="110"
              align="center"
              sortable
            ></el-table-column>
            <el-table-column
              prop="createtime"
              label="创建时间"
              :show-overflow-tooltip="true"
              width="180"
              align="center"
              :sortable="true"
            ></el-table-column>
            <el-table-column align="center" label="操作" width="200" fixed="right">
              <template slot="header" slot-scope="scope">
                <el-button size="medium" type="primary" icon="el-icon-circle-plus-outline" @click="Add">添加</el-button>
              </template>
              <template slot-scope="scope">
                <div class="tableBtn">
                  <el-link
                    title="编辑"
                    @click="Edit(scope.row)"
                    :underline="false"
                    type="primary"
                    icon="mkfont bianji1"
                    :disabled="scope.row.status == 1 ||scope.row.status == 3 || scope.row.status == 99"
                  ></el-link>
                  <el-link
                    title="通过"
                    @click="operate(scope.row.newsid,'G')"
                    :underline="false"
                    type="primary"
                    icon="mkfont qiyong"
                    :disabled="scope.row.status == 1 ||scope.row.status == 3 || scope.row.status == 99"
                  ></el-link>
                  <el-link
                    title="拒绝"
                    @click="operate(scope.row.newsid,'R')"
                    :underline="false"
                    type="danger"
                    icon="mkfont tingyong_line"
                    :disabled="scope.row.status == 2 ||scope.row.status == 3 || scope.row.status == 99"
                  ></el-link>
                  <el-link
                    title="发布"
                    @click="operate(scope.row.newsid,'F')"
                    :underline="false"
                    type="primary"
                    :disabled="scope.row.status != 1"
                    icon="el-icon-video-play"
                     class="font28"
                  ></el-link>
                  <el-link
                    title="删除"
                    @click="operate(scope.row.newsid,'D')"
                    :underline="false"
                    type="danger"
                    icon="mkfont trasch"
                    class="font28"
                  ></el-link>

                  <!--  <el-link
                :title="scope.row.status != 1 ? '启用' : '停用'"
                @click="Examine(scope.row,'/Publics/Repositoryinfo/HealthEducationNewsinfo_Post','停用','启用',HealthEducationNewsinfoList_Get,'Z')"
                :underline="false"
                type="primary"
                :icon="scope.row.status != 1 ? 'mkfont qiyong' : 'mkfont tingyong_line'"
                :disabled="scope.row.status == 3 || scope.row.status == 99"
              ></el-link>
              <el-link
                title="上移"
                @click="MoveUp(scope.$index,scope.row,tabelList,'newsid','orderno',HealthEducationNewsinfoList_Get,'/Publics/Repositoryinfo/Repositoryinfo_UpAndDown')"
                :underline="false"
                type="primary"
                :disabled="scope.row.status == 3 || scope.row.status == 99"
                icon="mkfont shangyi"
              ></el-link>
              <el-link
                title="下移"
                @click="MoveDow(scope.$index,scope.row,tabelList,'newsid','orderno',HealthEducationNewsinfoList_Get,'/Publics/Repositoryinfo/Repositoryinfo_UpAndDown')"
                :underline="false"
                type="primary"
                :disabled="scope.row.status == 3 || scope.row.status == 99"
                icon="mkfont xiayi"
                  ></el-link>-->
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-footer>
            <mk-page :pager="pager" @query="HealthEducationNewsinfoList_Get" />
          </el-footer>
        </el-container>
      </template>
    </SplitPane>
    <!-- 弹框 -->
    <el-drawer :visible.sync="drawer" direction="rtl" size="100%">
      <div slot="title">健康宣教维护</div>
      <el-container style="background:#f5f5f5;">
        <el-main style="padding:0;">
          <div class="aside">
            <div class="left">
              <el-input
                class="textarea"
                type="textarea"
                placeholder="请在这里输入健康宣教名称"
                v-model="form.maintitle"
                maxlength="64"
                :rows="1"
                resize="none"
                clearable
                show-word-limit
                :autosize="{ minRows: 1, maxRows: 2 }"
              ></el-input>
              <el-input
                type="textarea"
                placeholder="副标题"
                v-model="form.vicetitle"
                :rows="1"
                resize="none"
                show-word-limit
                class="remark"
                :autosize="{ minRows: 1, maxRows: 2 }"
              ></el-input>
              <el-input
                type="textarea"
                placeholder="消息来源"
                v-model="form.souce"
                :rows="1"
                resize="none"
                show-word-limit
                class="remark"
              ></el-input>
              <el-input
                type="textarea"
                placeholder="导读内容"
                v-model="form.navicontent"
                :rows="3"
                resize="none"
                show-word-limit
                class="remark"
              ></el-input>
              <div>
                <el-tag
                  :key="tag"
                  v-for="tag in dynamicTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加关键字</el-button>
              </div>
              <div class="form-ui">
                <div class="title">人群分类:</div>
                <div class="title-content">
                  <mk-select
                    v-model="form.auth"
                    placeholder="请选择权限"
                    :datas="getDicStandarDcode('宣教权限')"
                    :filter="['bzname','filterstr']"
                    label="bzname"
                    val="bzcode"
                  />
                </div>
              </div>
              <!--  -->
              <div class="form-ui">
                <div class="title">宣教分类:</div>
                <div class="title-content">
                  <mk-select
                    v-model="form.classid"
                    placeholder="请选择分类"
                    :datas="getDicStandarDcode('宣教分类')"
                    :filter="['bzname','filterstr']"
                    label="bzname"
                    val="bzcode"
                  />
                </div>
              </div>
              <div class="form-ui">
                <div class="title">置顶:</div>
                <div class="title-content">
                  <el-switch v-model="form.istop" :active-value="1" :inactive-value="0"></el-switch>
                </div>
              </div>
              <div class="form-ui">
                <div class="title">输入码:</div>
                <div class="title-content" style="padding-left:10px;">{{form.filterstr}}</div>
              </div>
            </div>
          </div>
          <div class="appmsg_input_area">
            <d2-quill
              placeholder="从这里开始写正文"
              style="min-height: 400px;"
              useCustomImageHandler
              @imageAdded="handleImageAdded"
              v-model="form.contents"
            ></d2-quill>
          </div>
        </el-main>
      </el-container>
      <div class="lq_drawer__footer">
        <el-button type="success" @click="HealthEducationNewsinfo_Post()">保存</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </el-drawer>
    <!-- 查看 -->
    <el-drawer title="健康宣教详情" :visible.sync="isSee" direction="rtl" size="50%" :with-header="false">
      <el-scrollbar style="height:100%;width:100%;">
        <div class="newscontent">
          <h1 class="maintitle">{{detallData.maintitle}}</h1>
          <div class="top-bar-wrap">
            <div
              class="info"
            >作者：{{detallData.createname}} 来源：{{detallData.souce}} {{detallData.createtime}}</div>
            <div class="count">
              <div class="item yd">
                <i class="el-icon-view iconSize"></i>
                <span style="margin-left:6px;font-size: 24px;">{{detallData.click}}</span>
              </div>
              <div class="item">
                <el-badge :value="parseInt(detallData.collectquantity)" :max="99">
                  <i class="el-icon-star-off iconSize"></i>
                </el-badge>
              </div>
              <div class="item pl">
                <i class="el-icon-chat-dot-round iconSize"></i>
                <span style="margin-left:6px;font-size: 24px;">{{detallData.commentquantity}}</span>
              </div>
            </div>
          </div>
          <div class="ql-snow ql-editor" v-html="detallData.contents"></div>
        </div>
      </el-scrollbar>
    </el-drawer>
  </d2-container>
</template>
<script>
import axios from "axios";
import util from "@/libs/util.js";
import dayjs from "dayjs";
export default {
  name: "",
  data() {
    return {
      operatetype: "C",
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      createuserid: util.cookies.get("uuid"), //当前登陆用户
      detallData: [],
      isSee: false,
      siftData: {
        dataRange: "", //时间数组
        Bdate: "", //开始时间
        Edate: "", //结束时间
        auth: "", //取字典信息(参数:资讯权限) :如:公共,患者端,医生端
        classid: "", //(参数:资讯分类) 如:饮食,运动,旅游
        status: "", //取字典信息(参数:宣教状态)0 未审核,1 审核通过 2 未通过,3 已发布,99 删除
        condition: "",
        orderby: ""
      },
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
        rows: 20,
        condition: ""
      },
      drawer: false,
      radio: null, //
      expands: [],
      getRowKeys(row) {
        return row.bzcode;
      },
      educlassList: [],
      tabelList: [],
      parentRow: {},
      subRow: {},
      fileName: "Images_RichText"
    };
  },
  watch: {
    "form.maintitle": function(val) {
      this.form.filterstr = util.py.firstChar(val);
    }
  },
  created() {
    console.log(this.getDicStandarDcode('宣教权限'))
    this.siftData.auth=this.getDicStandarDcode('宣教权限')[0].bzcode;
    this.HealthEducationNewsinfoList_Get();
  },
  methods: {
    //表格排序
    changeTableSort(column) {
      this.siftData.orderby =
        column.prop + " " + column.order.replace(/ending/g, "");
      this.HealthEducationNewsinfoList_Get();
    },
    //左侧
    popTypeClick(code){
      this.siftData.auth=code;
      this.HealthEducationNewsinfoList_Get()
    },
    getDataRange(value) {
      if (!value) {
        this.siftData.Bdate = "";
        this.siftData.Edate = "";
      } else {
        this.siftData.Bdate = value[0];
        this.siftData.Edate = value[1];
      }
      console.log(value);
      this.HealthEducationNewsinfoList_Get();
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      console.log(inputValue);
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      console.log(this.dynamicTags);
      this.inputVisible = false;
      this.inputValue = "";
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
    //
    //
    initForm() {
      this.form = {
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
        classid: "", //(参数:资讯分类) 如:饮食,运动,旅游
        auth:this.siftData.auth
      };
    },
    //操作
    operate(id, operatetype) {
      this.MK.Request(
        "/Publics/HealthEducation/HealthEducationNewsinfo_Post",
        "post",
        {
          newsid: id,
          operatetype: operatetype
        }
      ).then(res => {
        if (res.code == 0) {
          this.HealthEducationNewsinfoList_Get();
        }
      });
    },
    // C:新增 U:修改 D:删除
    HealthEducationNewsinfo_Post() {
      let isdata = [];
      if (this.form.maintitle == "") {
        this.$message({
          type: "error",
          message: "请输入健康宣教名称"
        });
        return;
      }
      if (this.form.auth == "") {
        this.$message({
          type: "error",
          message: "请选择人群分类"
        });
        return;
      }
      if (this.form.contents == "") {
        this.$message({
          type: "error",
          message: "请输入正文"
        });
        return;
      }
      if (this.form.classid == "") {
        this.$message({
          type: "error",
          message: "请选择宣教分类"
        });
        return;
      }
      if (this.operatetype == "C") {
        isdata.createby = util.cookies.get("uuid"); //创建人ID
        this.form.keyword = this.dynamicTags.join(";");
      } else if (this.operatetype == "U") {
        this.form.modifyby = util.cookies.get("uuid"); //修改人ID
        this.form.modifytime = dayjs().format("YYYY-MM-DD HH:mm:ss"); //修改时间
        //this.form.createtime="";
        //this.form.createby=undefined;
      }

      this.form.operatetype = this.operatetype;
      console.log(this.form);
      console.log(isdata);
      //return;
      this.MK.Request(
        "/Publics/HealthEducation/HealthEducationNewsinfo_Post",
        "post",
        {
          ...isdata,
          ...this.form
        }
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.drawer = false;
          this.HealthEducationNewsinfoList_Get();
        }
      });
    },
    cancelForm() {
      this.drawer = false;
    },

    //编辑器上传图片
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      this.Editor = Editor;
      this.cursorLocation = cursorLocation;
      this.resetUploader = resetUploader;
      this.imageDeal(file, this.EditorUplaod);
    },
    EditorUplaod(base64) {
      // this.Editor.insertEmbed(this.cursorLocation, "image", base64);
      let base64Str = base64.replace("data:image/jpeg;base64,", "");
      this.resetUploader();
      // -----------------------
      this.MK.Request("/Publics/Common/UpLoadImags", "post", {
        base64Arr: [base64Str],
        fileName: this.fileName
      })
        .then(response => {
          let data = response.data;
          var path = "";
          data.forEach(key => {
            path = key;
          });
          let url = this.publicUrl + "/" + this.fileName + "/" + path;
          this.Editor.insertEmbed(this.cursorLocation, "image", url);
          this.resetUploader();
        })
        .catch(error => {
          console.log(error);
        });
        // ------------------
      // axios
      //   .post("/Publics/Common/UpLoadImags", {
      //     base64Arr: [base64Str],
      //     fileName: this.fileName
      //   })
      //   .then(response => {
      //     let data = response.data.result.data;
      //     var path = "";
      //     data.forEach(key => {
      //       path = key;
      //       // let index = key.lastIndexOf("Images_Data");
      //       // path = key.substring(index, key.length);
      //     });
      //     let url = this.publicUrl + "/" + this.fileName + "/" + path;
      //     this.Editor.insertEmbed(this.cursorLocation, "image", url);
      //     this.resetUploader();
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
    },
    compress(base64, bili, callback) {
      let _this = this;
      console.log("执行缩放程序,bili=" + bili);
      //处理缩放，转格式
      let _img = new Image();
      _img.src = base64;
      _img.onload = function() {
        let _canvas = document.createElement("canvas");
        let w = this.width / bili;
        let h = this.height / bili;
        _canvas.setAttribute("width", w);
        _canvas.setAttribute("height", h);
        _canvas.getContext("2d").drawImage(this, 0, 0, w, h);
        let base64 = _canvas.toDataURL("image/jpeg");
        _canvas.toBlob(function(blob) {
          console.log("执行缩放后,base64=" + base64.length);
          if (blob.size > 1024 * 100) {
            _this.compress(base64, bili, callback);
          } else {
            callback(base64, blob);
          }
        }, "image/jpeg");
      };
    },
    imageDeal(file, returnBase64) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let base64 = reader.result;
        let bili = 2;
        this.compress(base64, bili, returnBase64);
      };
    },
    pos(list, id) {
      var _pos = -1;
      list.map(function(d, i) {
        if (d.bzcode == id) _pos = i;
      });
      return _pos;
    },
    //根据健康宣教id(newsid)获取健康宣教明细
    HealthEducationNewsinfoList_Get() {
      this.MK.Request(
        "/Publics/HealthEducation/HealthEducationNewsinfoList_Get",
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
    Add() {
      this.initForm();
      this.operatetype = "C";
      this.drawer = true;
    },
    Edit(row) {
      this.operatetype = "U";
      this.rowNewsId = row.newsid;
      this.HealthEducationContentsByNewId_Get(row.newsid);
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
<style scoped>
>>> .el-drawer__header {
  margin: 0 !important;
  padding: 5px 20px !important;
  background: #8ddba5;
}
>>> .d2-container-full__footer {
  border: 0 !important;
  -moz-box-shadow: 0px -2px 3px #ccc !important;
  -webkit-box-shadow: 0px -2px 3px #ccc !important;
  box-shadow: 0px -2px 3px #ccc !important;
  padding: 10px 16px !important;
  position: relative;
}
.aside {
  position: fixed;
  margin-top: 44px;
  box-sizing: content-box;
  padding: 18px 2%;
  height: calc(100vh - 160px);
  width: 26%;
}
.flex {
  display: flex;
  height: 100%;
}
.right {
  flex: 1;
  height: 100%;
}
.left .el-textarea {
  margin-bottom: 5px;
}
>>> .el-textarea__inner {
  padding: 5px;
}
>>> .el-drawer__header {
  color: #02321c;
}
.form-ui {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.form-ui.column {
  flex-direction: column;
}
.form-ui .title {
  font-size: 14px;
  font-family: "auto";
  color: #666;
  width: 4.5em;
  text-align: right;
  margin-right: 20px;
}
.pd-10 {
  padding: 10px;
}
.form-ui .title-content {
  flex: 1;
}
>>> .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  width: 100%;
  border-radius: 6px;
  cursor: pointer;
  /* position: relative; */
  overflow: hidden;
  margin-bottom: 20px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 178px;
  display: block;
}
>>> .el-tag {
  margin-left: 10px;
  margin-top: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.zx {
  display: flex;
  justify-content: space-between;
}
.zx .xxly >>> .el-input__inner {
  text-align: right;
}
/* >>> .el-textarea__inner, */
>>> .aside .el-input__inner {
  border: 0 !important;
  font-family: "auto";
}
>>> .headerFrom .el-form-item__content .el-input__inner {
  font-family: "auto";
}
.textarea >>> .el-textarea__inner {
  font-size: 22px;
  font-family: "auto";
}
.repositorynote {
  margin: 10px 0;
}
.fbt >>> .el-input__inner {
  font-family: "auto";
  padding: 0 24px;
}
.el-textarea__inner >>> .el-textarea__inner::placeholder {
  color: #c2c2c2;
  font-size: 22px;
  font-family: "auto";
}

>>> .el-textarea__inner::-webkit-input-placeholder {
  /* WebKit browsers 适配谷歌 */
  color: #c2c2c2;
}

>>> .el-textarea__inner:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 适配火狐 */
  color: #c2c2c2;
}

>>> .el-textarea__inner::-moz-placeholder {
  /* Mozilla Firefox 19+ 适配火狐 */
  color: #c2c2c2;
}

>>> .el-textarea__inner:-ms-input-placeholder {
  /* Internet Explorer 10+  适配ie*/
  color: #c2c2c2;
}
.left {
  padding: 18px;
  width: 100%;
  height: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 20px;
}
>>> .quillWrapperS .ql-container {
  width: 68% !important;
  margin-left: 30% !important;
}
.lq_drawer__footer {
  position: fixed;
  bottom: 10px;
  width: 100%;
  text-align: center;
}
/*  */
.newscontent {
  width: 100%;
  padding: 20px;
}
.newscontent .ql-editor {
  overflow-y: auto;
  height: calc(100vh - 168px);
}
.newscontent .mainTitle {
  text-align: center;
  font: normal 27px/38px "微软雅黑", Microsoft Yahei, "黑体";
  color: #333;
}
.newscontent .top-bar-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  color: #333;
}
.newscontent .info {
  font-size: 14px;
}
.newscontent .count {
  display: flex;
  align-items: center;
}
.newscontent .item {
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #ccc;
}
.newscontent .yd {
  color: green;
}
.newscontent .pl {
  color: #ee231b;
}
.newscontent .iconSize {
  font-size: 26px;
}
.newscontent .el-drawer__body {
  overflow-y: auto !important;
}
>>>.popTypeClass{
  height: 40px;
  line-height: 40px;
  border-left: solid #fff 5px;
  padding-left: 15px;
  color: #4a4a4a;
  white-space: 2px;
  font-weight: 400;
  cursor: pointer;
  margin: .5rem 0;
}
>>>.popTypeClass p{
  margin: 0;
}
>>>.popTypeClass:hover{
  border-color: #409eff;
  color: #409eff;
  background:rgba(64, 160, 255, 0.122);
}
>>>.popActive{
  border-color: #409eff;
  color: #409eff;
  background:rgba(64, 160, 255, 0.122);
}
>>>.typeTitle{
padding:10px 0px 6px 20px;
font-weight: 600;
color: #606266;
font-size: 1rem;
border-bottom: 1px solid #EBEEF5;
}
>>>.font28 i{
  font-size: 28px !important;
}
</style>
