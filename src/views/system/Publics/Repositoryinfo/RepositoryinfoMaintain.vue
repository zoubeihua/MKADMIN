<template>
  <d2-container>
    <SplitPane :min-percent="20" :default-percent="30" split="vertical">
      <template slot="paneL">
        <el-table
          border
          stripe
          highlight-current-row
          :data="bigclassList"
          :row-key="getRowKeys"
          ref="refTable"
          :expand-row-keys="expands"
          @expand-change="rowChange"
          @row-click="bigClassRowClick"
          height="100%"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-table
                stripe
                highlight-current-row
                :data="scope.row.smallclassList"
                @row-click="smallClassRowClick"
                :show-header="false"
              >
                <el-table-column label show-overflow-tooltip align="left" prop="levelname">
                  <template slot-scope="scope">
                    <div style="padding-left:60px;">
                      <el-radio
                        v-model="radio"
                        :label="scope.row.bzcode"
                        style="margin-right:0 !important;"
                      >
                        <span class="el-radio__label"></span>
                      </el-radio>
                      <span>{{scope.row.bzname}}</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="知识库分类" sortable show-overflow-tooltip align="left" prop="bzname"></el-table-column>
        </el-table>
      </template>
      <template slot="paneR">
        <el-container>
          <el-table stripe :data="RepositoryinfoDetailList" border height="100%">
            <el-table-column
              label="知识库ID"
              sortable
              width="120"
              show-overflow-tooltip
              prop="repositoryid"
            />
            <el-table-column label="知识库名称" sortable show-overflow-tooltip prop="repositoryname" />
            <el-table-column
              label="适用性别"
              sortable
              width="120"
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
            <el-table-column label="方案描述" show-overflow-tooltip prop="repositorynote"></el-table-column>
            <el-table-column
              align="center"
              sortable
              show-overflow-tooltip
              prop="status"
              width="120"
              label="状态"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="GetOpenAndStoptatusType(scope.row.status)"
                  disable-transitions
                >{{ scope.row.statusdisplay }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
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
                  ></el-link>
                  <el-link
                    :title="scope.row.status != 1 ? '启用' : '停用'"
                    @click="Examine(scope.row,'/Publics/Repositoryinfo/Repositoryinfo_Post','停用','启用',RepositoryinfoList_Get,'Z')"
                    :underline="false"
                    type="primary"
                    :icon="scope.row.status != 1 ? 'mkfont qiyong' : 'mkfont tingyong_line'"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                  ></el-link>
                  <el-link
                    title="上移"
                    @click="MoveUp(scope.$index,scope.row,RepositoryinfoDetailList,'repositoryid','orderno',RepositoryinfoList_Get,'/Publics/Repositoryinfo/Repositoryinfo_UpAndDown')"
                    :underline="false"
                    type="primary"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                    icon="mkfont shangyi"
                  ></el-link>
                  <el-link
                    title="下移"
                    @click="MoveDow(scope.$index,scope.row,RepositoryinfoDetailList,'repositoryid','orderno',RepositoryinfoList_Get,'/Publics/Repositoryinfo/Repositoryinfo_UpAndDown')"
                    :underline="false"
                    type="primary"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                    icon="mkfont xiayi"
                  ></el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-footer>
            <mk-page :pager="pager" @query="RepositoryinfoList_Get" />
          </el-footer>
        </el-container>
      </template>
    </SplitPane>
    <el-drawer :visible.sync="drawer" direction="rtl" size="100%">
      <div slot="title">
        知识库维护-
        <span class="danger">[ {{parentRow.bzname}}>>{{subRow.bzname}} ]</span>
      </div>
      <el-container style="background:#f5f5f5;">
        <el-main style="padding:0;">
          <!-- <div width="350px" class="aside"> -->
          <div class="aside">
            <div class="left">
              <el-input
                class="textarea"
                type="textarea"
                placeholder="请在这里输入知识库名称"
                v-model="form.repositoryname"
                maxlength="64"
                :rows="1"
                resize="none"
                clearable
                show-word-limit
              ></el-input>
              <el-input
                type="textarea"
                placeholder="备注"
                v-model="form.repositorynote"
                :rows="3"
                resize="none"
                show-word-limit
                class="repositorynote"
              ></el-input>
              <div class="form-ui">
                <div class="title">适用性别</div>
                <div class="title-content">
                  <mk-select
                    v-model="form.limitsex"
                    :isSlot="true"
                    placeholder="请选择"
                    :datas="getDicStandarDcode('适用性别')"
                    :filter="['bzname','filterstr']"
                    label="bzname"
                    val="bzcode"
                  >
                    <template v-slot:option="{item:item}">
                      <span
                        class="fa"
                        style="margin-right:6px;"
                        :class="[item.bzcode== '1' ? 'fa-mars primary' : item.bzcode == '2' ? 'fa-venus danger' : 'fa-genderless warning']"
                      ></span>
                      <span>{{item.bzname}}</span>
                    </template>
                  </mk-select>
                </div>
              </div>
              <div class="form-ui">
                <div class="title">输入码</div>
                <div class="title-content" style="padding-left:10px;">{{form.filterstr}}</div>
              </div>
              <!-- <div class="form-ui">
                <el-button type="success" @click="Repositoryinfo_Post()">保存</el-button>
              </div> -->
            </div>
          </div>
          <div class="appmsg_input_area">
            <d2-quill
              placeholder="从这里开始写正文"
              style="min-height: 400px;"
              useCustomImageHandler
              @imageAdded="handleImageAdded"
              v-model="form.programcontent"
            ></d2-quill>
          </div>
        </el-main>
      </el-container>
         <div class="lq_drawer__footer">
          <el-button type="success" @click="Repositoryinfo_Post()">保存</el-button>
          <el-button @click="cancelForm">取 消</el-button>
        </div>
    </el-drawer>
  </d2-container>
</template>
<script>
import axios from "axios";
import util from "@/libs/util.js";
export default {
  name: "",
  data() {
    return {
      operatetype: "C",
      form: {
        operatetype: "", //操作类型 部分接口新增修改删除不单独,一个post搞定 C:新增 U:修改 D:删除 默认为C新增
        bigclass: "", //知识库大类，来源 标准字典表 的方案知识库大类
        smallclass: "", //方案知识库小类
        createid: "",
        filterstr: "",
        limitsex: "", //限制性别 0:不限制 1:限制男性 2：限制女性
        repositoryname: "", //知识库名称
        repositorynote: "", //备注
        programcontent: "" //知识库富文本
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
      bigclassList: [],
      RepositoryinfoDetailList: [],
      parentRow: {},
      subRow: {},
      fileName: "Images_RichText"
    };
  },
  watch: {
    "form.repositoryname": function(val) {
      this.form.filterstr = util.py.firstChar(val);
    }
  },
  created() {
    let NewArr = [
      ...this.getDicStandarDcode("健康方案知识库大类"),
      ...this.getDicStandarDcode("健康方案知识库小类")
    ];
    this.bigclassList = this.getTree(NewArr);
    console.log(this.getDicStandarDcode("适用性别"));
  },
  methods: {
    initForm() {
      this.form = {
        operatetype: "C", //操作类型 部分接口新增修改删除不单独,一个post搞定 C:新增 U:修改 D:删除 默认为C新增
        bigclass: "", //知识库大类，来源 标准字典表 的方案知识库大类
        smallclass: "", //方案知识库小类
        createid: "",
        filterstr: "",
        limitsex: "", //适用性别 0:男女通用 1:适用男性 2：适用女性
        repositoryname: "", //知识库名称
        repositorynote: "", //备注
        programcontent: "" //知识库富文本
      };
    },
    // C:新增 U:修改 D:删除
    Repositoryinfo_Post() {
      if (this.form.repositoryname == "") {
        this.$message({
          type: "error",
          message: "请输入知识库名称"
        });
        return;
      }
      if (this.form.limitsex == "") {
        this.$message({
          type: "error",
          message: "请选择适用性别"
        });
        return;
      }
      this.form.bigclass = this.parentRow.bzcode;
      this.form.smallclass = this.subRow.bzcode;
      this.form.createid = this.info.userid;
      this.form.operatetype = this.operatetype;
      this.MK.Request(
        "/Publics/Repositoryinfo/Repositoryinfo_Post",
        "post",
        this.form
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.drawer = false;
          this.RepositoryinfoList_Get();
        }
      });
    },
    cancelForm(){
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
      this.MK.Request("/Publics/Common/UpLoadImags", "post", {
        base64Arr: [base64Str],
        fileName: this.fileName
      })
        .then(response => {
          console.log(response);
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
            temp = temp[_pos]["smallclassList"];
          } else {
            temp.push({
              bzcode: d.bzcode,
              bzname: d.bzname,
              filterstr: d.filterstr,
              codetype: d.codetype,
              orderno: d.orderno,
              smallclassList: []
            });
            temp = temp[temp.length - 1]["smallclassList"];
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
    bigClassRowClick(row) {
      this.parentRow = row;
      this.$refs.refTable.toggleRowExpansion(row);
    },
    smallClassRowClick(row) {
      this.radio = row.bzcode;
      this.subRow = row;
      this.RepositoryinfoList_Get();
    },
    //根据知识库id(repositoryid)获取知识库明细
    RepositoryinfoList_Get() {
      let sendData = {
        bigclass: this.parentRow.bzcode,
        smallclass: this.subRow.bzcode,
        hospitalid: this.info.hospitalid,
        page: this.pager.page,
        rows: this.pager.rows,
        condition: this.pager.condition
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
      var that = this;
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          this.radio = null;
          this.parentRow = row;
          this.$nextTick(() => {
            this.expands.push(row.bzcode);
          });
        }
      } else {
        this.expands = [];
        this.parentRow = {};
        this.subRow = {};
      }
    },
    Add() {
      if (!this.parentRow.bzname) {
        this.$message({
          type: "error",
          message: "请先选择大类"
        });
        return;
      }
      if (!this.subRow.bzcode) {
        this.$message({
          type: "error",
          message: "请先选择小类"
        });
        return;
      }
      this.initForm();
      this.operatetype = "C";
      this.drawer = true;
    },
    Edit(row) {
      this.operatetype = "U";
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
        this.form = { ...this.form, ...res.data };
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
>>> .el-input__inner {
  border: 0 !important;
  font-family: "auto";
}
.textarea >>> .el-textarea__inner {
  font-size: 22px;
  font-family: "auto";
}
.repositorynote{
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
  width: 66% !important;
  margin-left: 30% !important;
}
.lq_drawer__footer{
  position: fixed;
  bottom: 10px;
  width: 100%;
  text-align: center;
}

</style>
