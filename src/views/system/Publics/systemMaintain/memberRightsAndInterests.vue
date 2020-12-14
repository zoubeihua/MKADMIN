<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true">
        <el-form-item>
          <el-input
            style="width: 30vw;"
            placeholder="按权益名称 / 拼音码 检索"
            v-model="refreshForm.condition"
            clearable
            @keyup.enter.native="keyupEnterSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="keyupEnterSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <SplitPane :min-percent="15" :default-percent="15" split="vertical">
      <template slot="paneL">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          node-key="membertypeid"
          :indent="10"
          :accordion="true"
          :highlight-current="true"
          @node-click="handleNodeClick"
          @node-contextmenu="handleRightClick"
        >
          <span class="custom-tree-node" style="margin:10px;" slot-scope="{ node, data }">
            <i
              v-if="data.icon"
              :class="['mkfont', data.icon ? data.icon.split(',')[0] : '']"
              :style="{color: data.icon ? data.icon.split(',')[1] : '', fontSize: 24 + 'px',marginRight: 10 + 'px'}"
            ></i>
            <span>{{data.name}}</span>
          </span>
        </el-tree>
      </template>
      <template slot="paneR">
        <el-container>
          <el-header>
            当前权益所属：
            <div v-if="curMemberType.name ">
              [
              <span
                style="font-family:PingFang SC;font-size:16px;color:red;margin:0 10px"
              >{{curMemberType.name}}</span>
              <i
                v-if="curMemberLv.icon"
                :class="['mkfont', curMemberLv.icon ? curMemberLv.icon.split(',')[0] : '']"
                :style="{color: curMemberLv.icon ? curMemberLv.icon.split(',')[1] : '', fontSize: 24 + 'px',marginRight: 10 + 'px'}"
              ></i>]
            </div>
          </el-header>
          <el-table :data="rightInterestsInfoTableData" border height="100%" highlight-current-row stripe>
            <el-table-column label="权益类型" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.mustdo == 1 ? 'danger' : 'primary' "
                >{{scope.row.mustdo == 1 ? "硬节点" : "软节点"}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="权益名称"
              show-overflow-tooltip
              align="left"
              prop="itemname"
              min-width="500"
            />
            <el-table-column label="规格" align="center" prop="specification" />
            <el-table-column label="单位" align="center" prop="unit" />
            <el-table-column label="单价" align="center" prop="price" />
            <el-table-column label="数量" align="center" prop="amount" />
            <el-table-column label="状态" align="center" fixed="right">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status == 0 ? 'danger' : 'success'">{{scope.row.status == 0 ? '停用' : '正常'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" width="200" label="操作" fixed="right">
              <template slot="header">
                <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="handleAddRightsInterests">添加</el-button>
              </template>
              <template slot-scope="scope">
                <div class="tableBtn">
                  <el-link
                    title="编辑"
                    :underline="false"
                    type="primary"
                    icon="mkfont bianji1"
                    @click="handleTableOperate(scope.row,'edit')"
                  />
                  <el-link
                    title="启用"
                    v-if="scope.row.status == 0"
                    :underline="false"
                    type="success"
                    icon="mkfont qiyong"
                    @click="handleTableOperate(scope.row,'turnOn')"
                  />
                  <el-link
                    title="停用"
                    v-if="scope.row.status == 1"
                    :underline="false"
                    type="danger"
                    icon="mkfont tingyong_line"
                    @click="handleTableOperate(scope.row,'turnOff')"
                  />
                  <el-link
                    title="上移"
                    :underline="false"
                    type="primary"
                    icon="mkfont shangyi"
                    @click="MoveUp(scope.$index,scope.row,rightInterestsInfoTableData,'itemid','orderno','','/Publics/MemberManage/MemberRightsDefinition/UpAndDown')"
                  />
                  <el-link
                    title="下移"
                    :underline="false"
                    type="primary"
                    icon="mkfont xiayi"
                    @click="MoveDow(scope.$index,scope.row,rightInterestsInfoTableData,'itemid','orderno','','/Publics/MemberManage/MemberRightsDefinition/UpAndDown')"
                  />
                  <el-link
                    title="删除"
                    :underline="false"
                    type="danger"
                    icon="mkfont trasch"
                    @click="handleTableOperate(scope.row,'D')"
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-footer>
            <mk-page
              :pager="refreshForm"
              @query="MemberRightDefinition_Get(curMemberLv.levelid,curMemberType.membertypeid)"
            />
          </el-footer>
        </el-container>
      </template>
    </SplitPane>
    <!--鼠标右键点击出现页面-->
    <div v-show="menuVisible">
      <el-menu id="rightClickMenu" class="el-menu-vertical" @select="handleRightSelect">
        <el-menu-item index="1" class="menuItem" @click="handleCopy">
          <template slot="title">
            <i class="el-icon-document"></i>
            <el-link :underline="false">复制</el-link>
          </template>
        </el-menu-item>
        <el-menu-item index="2" class="menuItem" @click="handlePaste" :disabled="isCopy">
          <template slot="title">
            <i class="el-icon-document-copy"></i>
            <el-link :underline="false">粘贴</el-link>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 权益编辑模态框 -->
    <vxe-modal v-model="rightsAndInterestsModal" width="840" height="auto" :showFooter="true">
      <div slot="title">
        {{newRight ? "新增权益" : "编辑权益"}} - [
        <span
          style="color:red;"
        >{{curMemberType.name}} {{curMemberLv.name}}</span>
        ]
      </div>
      <el-form
        :model="rightsAndInterestsForm"
        ref="rightsAndInterestsForm"
        :rules="rightsAndInterestsRule"
        label-width="120px"
      >
        <el-form-item label="收费项目" prop="itemid">
          <rights-select
            class="input"
            v-model="rightsAndInterestsForm.itemid"
            url="/Publics/ItemManage/ItemInfo"
            :param="{hospitalid:info.hospitalid,itemtype:26}"
            placeholder="请选择收费项目"
            :filter="['itemname']"
            label="itemname"
            val="itemid"
            :isRights="true"
          ></rights-select>
        </el-form-item>
        <el-form-item label="权益名称" prop="itemname">
          <el-input class="input" v-model="rightsAndInterestsForm.itemname" placeholder="请输入权益名称" />
        </el-form-item>
        <el-form-item label="权益类型" prop="mustdo">
          <el-select class="input" v-model="rightsAndInterestsForm.mustdo" placeholder="请选择权益类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="常规日期" prop="normaldate">
          <el-date-picker
            v-model="dates"
            class="input"
            type="dates"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            @change="handleChangeNormalDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="间隔周期" prop="cycle">
          <el-input class="input" v-model="rightsAndInterestsForm.cycle" placeholder="请输入间隔周期" />
        </el-form-item>
        <el-form-item label="周期次数" prop="cycleamount">
          <el-input
            class="input"
            v-model.number="rightsAndInterestsForm.cycleamount"
            placeholder="请输入周期次数"
          />
        </el-form-item>
        <el-form-item label="周期单位">
          <el-select
            class="input"
            v-model.number="rightsAndInterestsForm.cycleunit"
            placeholder="请选择周期单位"
          >
            <el-option
              v-for="item in cycleUnitList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格">
          <el-input
            class="input"
            :disabled="true"
            v-model="rightsAndInterestsForm.specification"
            placeholder="请输入规格"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input
            class="input"
            :disabled="true"
            v-model="rightsAndInterestsForm.unit"
            placeholder="请输入单位"
          ></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input class="input" v-model.number="rightsAndInterestsForm.price" placeholder="请输入单价">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input
            class="input"
            v-model.number="rightsAndInterestsForm.amount"
            placeholder="请输入数量"
          />
        </el-form-item>
        <el-form-item label="序列号" prop="orderno">
          <el-input
            class="input"
            v-model.number="rightsAndInterestsForm.orderno"
            placeholder="请输入序列号"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center;">
      <el-button-group >
        <el-button type="primary" @click="handleSubmitForm">提交</el-button>
        <el-button type="warning" @click="rightsAndInterestsModal = false">取消</el-button>
      </el-button-group>
      </div>
    </vxe-modal>
  </d2-container>
</template>

<script>
import rightsSelect from "./components/rightsSelect";
export default {
  name: "memberRightsAndInterests",
  computed: {},
  data() {
    return {
      operatetypeKey: "",
      curMemberType: {},
      curMemberLv: {},
      curRightsRow: {},
      belongMemberLv: {},
      options: [
        {
          value: 1,
          label: "硬节点"
        },
        {
          value: 0,
          label: "软节点"
        }
      ],
      // 周期单位
      cycleUnitList: [
        {
          value: -1,
          label: "立即执行"
        },
        {
          value: 0,
          label: "分钟"
        },
        {
          value: 1,
          label: "小时"
        },
        {
          value: 2,
          label: "天"
        },
        {
          value: 3,
          label: "周"
        },
        {
          value: 4,
          label: "月"
        }
      ],
      transitionObj: {},
      copyObj: {},
      pasteObj: {},
      curCompareLV: "", // 不能将权益粘贴到一个类型的同一个等级
      dates: [],
      isCopy: true,
      newRight: true,
      menuVisible: false,
      rightsAndInterestsModal: false,
      rightsAndInterestsForm: {
        itemid: "",
        itemname: "",
        mustdo: "",
        normaldate: "",
        cycle: "",
        cycleamount: "",
        cycleunit: "",
        specification: "次",
        unit: "次",
        price: "",
        amount: "",
        orderno: ""
      },
      rightsAndInterestsRule: {
        mustdo: [
          { required: true, message: "请选择权益类型", trigger: "change" }
        ],
        itemid: [
          { required: true, message: "请选择收费项目", trigger: "change" }
        ],
        itemname: [
          { required: true, message: "请输入权益名称", trigger: "blur" }
        ],
        normaldate: [
          {
            required: true,
            type: "string",
            message: "请选择日期",
            trigger: "blur"
          }
        ],
        cycle: [{ required: true, message: "请输入间隔周期", trigger: "blur" }],
        cycleamount: [
          { required: true, message: "请输入间隔次数", trigger: "blur" },
          { type: "number", message: "间隔次数必须为数字值", trigger: "blur" }
        ],
        cycleunit: [
          { required: true, message: "请选择间隔单位", trigger: "change" }
        ],
        price: [
          { required: true, message: "请输入价格", trigger: "blur" },
          { type: "number", message: "价格必须为数字值", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "请输入数量", trigger: "blur" },
          { type: "number", message: "数量必须为数字值", trigger: "blur" }
        ],
        orderno: [
          { required: true, message: "请输入序列号", trigger: "blur" },
          { type: "number", message: "数量必须为数字值", trigger: "blur" }
        ]
      },
      memberTypeTableData: [],
      memberLevelTableData: [],
      rightInterestsInfoTableData: [],
      itemInfoList: [], // 收费项目列表
      treeData: [],
      refreshForm: {
        levelid: "",
        membertypeid: "",
        // itemid: "",
        condition: "",
        page: 1,
        rows: 20,
        tag: 0,
        hospitalid: "",
        count: 0
      },
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  components: {
    rightsSelect
  },
  created() {
    this.refreshForm.hospitalid = this.info.hospitalid;
    this.Membertype_Get();
    this.itemInfo_Get();
    setTimeout(() => {
      this.Memberlevel_Get();
    }, 100);
  },
  methods: {
    handleAddRightsInterests() {
      this.newRight = true;
      this.rightsAndInterestsForm = {
        itemid: "",
        itemname: "",
        mustdo: "",
        normaldate: "",
        cycle: "",
        cycleamount: "",
        cycleunit: "",
        specification: "次",
        unit: "次",
        price: "",
        amount: "",
        orderno: ""
      };
      this.dates = [];
      this.curRightsRow = {};
      this.resetFormValidate("rightsAndInterestsForm");
      if (!this.curMemberLv.name) {
        this.$message({
          message: "请先选择会员等级",
          type: "warning"
        });
      } else {
        this.rightsAndInterestsModal = true;
      }
    },
    // 回车搜索
    keyupEnterSearch() {
      if (!this.curMemberLv.name) {
        this.$message({
          message: "请先选择会员等级",
          type: "warning"
        });
      } else {
        this.MemberRightDefinition_Get(
          this.curMemberLv.levelid,
          this.curMemberType.membertypeid
        );
      }
    },
    // 权益表单提交
    handleSubmitForm() {
      this.$refs.rightsAndInterestsForm.validate(valid => {
        if (valid) {
          this.MemberRightDefinition_Operate("C", 1);
        }
      });
    },
    // 收费项目更改
    handleChangeItem(val) {
      console.log(val);
    },
    // 日期切换
    handleChangeNormalDate(date) {
      console.log(date.join("|"), this.dates, date);
      this.rightsAndInterestsForm.normaldate = date.join("|");
    },
    // 树结构节点左击
    handleNodeClick(data) {
      if (data.icon) {
        // this.curMemberLv = data;
        this.curMemberLv = JSON.parse(JSON.stringify(data));
        this.transitionObj.LV = data.levelid;
        console.log("当前会员等级", data);
        this.MemberRightDefinition_Get(
          this.curMemberLv.levelid,
          this.curMemberType.membertypeid
        );
      } else {
        this.curMemberType = data;
        this.transitionObj.TYPE = data.membertypeid;
        console.log("当前会员类型", data);
      }
    },
    // 树结构节点右击
    handleRightClick(e, data, node, ele) {
      console.log(e, data, node, ele);
      this.transitionObj.LV = data.levelid;
      this.curMemberLv.levelid = data.levelid;
      this.curCompareLV = data.levelid;
      if (data.icon) {
        this.menuVisible = true;
      }
      let menu = document.querySelector("#rightClickMenu");
      /* 菜单定位基于鼠标点击位置 */
      menu.style.left = event.clientX + 20 + "px";
      menu.style.top = event.clientY - 2 + "px";
      menu.style.position = "fixed"; // 为新创建的DIV指定绝对定位
      menu.style.width = 120 + "px";
      document.addEventListener("click", e => {
        this.menuVisible = false;
      });
    },
    // 复制
    handleCopy() {
      this.copyObj.levelid = this.transitionObj.LV;
      this.copyObj.membertypeid = this.transitionObj.TYPE;
      const curType = this.memberTypeTableData.filter(item => {
        if (item.membertypeid == this.transitionObj.TYPE) {
          return item;
        }
      })[0].name;
      const curLevel = this.memberLevelTableData.filter(item => {
        if (item.levelid == this.transitionObj.LV) {
          return item;
        }
      })[0].name;
      if (this.copyObj.levelid) {
        this.$message({
          message: `当前复制项:${curType}——${curLevel}`,
          type: "warning",
          showClose: true,
          duration: 4000
        });
        this.isCopy = false;
        console.log(
          "当前会员类型等级",
          this.transitionObj,
          "复制信息",
          this.copyObj,
          "粘贴信息",
          this.pasteObj
        );
      }
    },
    // 粘贴
    handlePaste() {
      this.pasteObj.copy_levelid = this.transitionObj.LV;
      this.pasteObj.copy_membertypeid = this.transitionObj.TYPE;
      const data = Object.assign(this.copyObj, this.pasteObj);
      this.MK.Request(
        "/Publics/MemberManage/MemberRightsDefinition/Copy",
        "post",
        data
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            message: "粘贴成功",
            type: "success"
          });
          this.MemberRightDefinition_Get(
            this.curMemberLv.levelid,
            this.curMemberType.membertypeid
          );
        }
      });
      console.log(
        "当前会员类型等级",
        this.transitionObj,
        "复制信息",
        this.copyObj,
        "粘贴信息",
        this.pasteObj
      );
    },
    handleRightSelect() {},
    // 会员类型
    typeRowClick(row) {
      console.log(row);
    },
    // 点击会员等级
    levelRowClick(row) {
      console.log(row);
    },
    //最右边的表格的行操作
    handleTableOperate(row, key) {
      console.log(row, key);
      this.curRightsRow = row;
      if (key == "edit") {
        this.newRight = false;
        this.operatetypeKey = "U"
        this.rightsAndInterestsModal = true;
        this.rightsAndInterestsForm.amount = row.amount;
        this.rightsAndInterestsForm.price = row.price;
        this.rightsAndInterestsForm.cycle = row.cycle;
        this.rightsAndInterestsForm.cycleunit = row.cycleunit;
        this.rightsAndInterestsForm.cycleamount = row.cycleamount;
        this.rightsAndInterestsForm.orderno = row.orderno;
        this.rightsAndInterestsForm.itemname = row.itemname.trim();
        this.rightsAndInterestsForm.itemid = row.itemid;
        this.rightsAndInterestsForm.mustdo = row.mustdo;
        this.dates = row.normaldate.split("|") || [];
        this.rightsAndInterestsForm.normaldate = row.normaldate
      }
      if (key == "turnOn") {
        this.MemberRightDefinition_Operate("Z", 1);
      }
      if (key == "turnOff") {
        this.MemberRightDefinition_Operate("Z", 0);
      }
      if (key == "D") {
        this.MemberRightDefinition_Operate(key, row.status);
      }
    },
    // 权益 新增 编辑 删除 停用启用
    MemberRightDefinition_Operate(key, status) {
      let data = {};
      if (key == "Z" || key == "D") {
        data = this.curRightsRow;
      } else {
        data = this.rightsAndInterestsForm;
      }
      if (key == "U") {
        data = this.rightsAndInterestsForm;
      }
      data.levelid = this.curMemberLv.levelid;
      data.membertypeid = this.curMemberType.membertypeid;
      data.checkid = "-1";
      data.createid = this.info.userid;
      data.status = status;
      if (!this.newRight && this.operatetypeKey == "U") {
        data.operatetype = "U";
      } else {
        data.operatetype = key;
      }
      this.MK.Request(
        "/Publics/MemberManage/MemberRightsDefinition",
        "post",
        data
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.rightsAndInterestsModal = false;
          this.MemberRightDefinition_Get(
            this.curMemberLv.levelid,
            this.curMemberType.membertypeid
          );
        }
      });
    },
    MemberRightDefinition_Get(levelid, membertypeid) {
      this.refreshForm.levelid = levelid;
      this.refreshForm.membertypeid = membertypeid;
      this.MK.Request(
        "/Publics/MemberManage/MemberRightsDefinition",
        "get",
        this.refreshForm
      ).then(res => {
        this.rightInterestsInfoTableData = res.data;
        this.refreshForm.count = res.count;
      });
    },
    Memberlevel_Get() {
      this.MK.Request("Publics/MemberManage/Memberlevel", "get", {
        condition: "",
        page: 1,
        rows: 10,
        tag: 0
      }).then(res => {
        this.memberLevelTableData = res.data;
        this.treeData = this.memberTypeTableData.map(item => {
          item.children = this.memberLevelTableData;
          return item;
        });
      });
    },
    Membertype_Get() {
      this.MK.Request("Publics/MemberManage/Membertype", "get", {
        condition: "",
        page: 1,
        rows: 10,
        tag: 0
      }).then(res => {
        this.memberTypeTableData = res.data;
      });
    },
    itemInfo_Get() {
      this.MK.Request("/Publics/ItemManage/ItemInfo", "get", {
        hospitalid: this.info.hospitalid,
        itemtype: 26
      }).then(res => {
        this.itemInfoList = res.data;
      });
    },
    //上移
    MoveUp(index, row, list, id, orderno, handler, url) {
      if (index == 0) {
        this.$message({
          type: "error",
          message: "当前为第一行,不能上移!"
        });
        return;
      }
      var PreRow = list[index - 1];
      this.MoveUpAndDown(row, PreRow, id, orderno, handler, url);
    },
    //下移
    MoveDow(index, row, list, id, orderno, handler, url) {
      if (index + 1 == list.length) {
        this.$message({
          type: "error",
          message: "当前为最后一行,不能下移!"
        });
        return;
      }
      var NextRow = list[index + 1];
      this.MoveUpAndDown(row, NextRow, id, orderno, handler, url);
    },
    MoveUpAndDown(Currentrow, NextRow, id, orderno, handler, url) {
      let opt = {};
      opt.levelid = Currentrow.levelid;
      opt.membertypeid = Currentrow.membertypeid;
      opt["current_" + id] = Currentrow[id];
      opt["current_" + orderno] = Currentrow[orderno];
      opt["next_" + id] = NextRow[id];
      opt["next_" + orderno] = NextRow[orderno];
      console.log(opt);
      this.MK.Request(url, "post", opt).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.MemberRightDefinition_Get(
            this.curMemberLv.levelid,
            this.curMemberType.membertypeid
          );
        }
      });
    },
    // 清空表单、自定义表单项
    resetFormValidate(formName) {
      this.$refs[formName].resetFields();
    }
  },
  watch: {
    "curMemberType.membertypeid"(oldVal, newVal) {
      if (oldVal != newVal) {
        this.rightInterestsInfoTableData = [];
        this.curMemberLv.name = "";
        this.curMemberLv.icon = "";
      }
    }
  }
};
</script>

<style scoped>
>>> .el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 53px;
}
>>> .el-tree-node__label {
  font-size: 18px;
  margin-bottom: 5px;
}
>>> .el-tree-node__content {
  font-size: 16px;
  margin-bottom: 10px;
}
.el-menu-vertical {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 100;
}
.el-menu-vertical i {
  color: #777777;
  margin-right: 12px;
}
.menuItem {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}
.input {
  width: 600px;
}
.modal-button {
  position: absolute;
  bottom: 20px;
}
</style>