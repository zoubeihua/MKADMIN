<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true">
        <el-form-item>
          <el-input
            style="width:300px;"
            v-model="pager.condition"
            @keyup.enter.native="refreshList"
            placeholder="按机构名称(首拼)查询"
          />
        </el-form-item>
        <el-form-item>
          <mk-select
            style="width:300px;"
            v-model="pager.hospitalid"
            placeholder="选择院区"
            url="/Publics/Common/Dic/HospitalInfo"
            :filter="['hospitalname','filterstr']"
            label="hospitalname"
            val="hospitalid"
            @change="refreshList"
          ></mk-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="pager.orgtype" placeholder="请选择机构类型" @change="refreshList">
            <el-option :key="0" label="政府医保" :value="0"></el-option>
            <el-option :key="1" label="商业保险" :value="1"></el-option>
            <el-option :key="2" label="合作单位" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" @click="refreshList">查询</el-button>
            <el-button type="primary" @click="handleNewData('1')">添加</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </template>

    <el-table
      :data="tableData"
      highlight-current-row
      height="100%"
      border
      stripe
      row-key="orgid"
      ref="table"
      v-if="show"
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildrens'}"
    >
      <!-- <el-table-column width="100" align="center" fixed="left"></el-table-column> -->
      <el-table-column label="ID" width="120" show-overflow-tooltip prop="orgid"></el-table-column>
      <el-table-column label="名称" width="160" show-overflow-tooltip prop="orgname">
        <template slot-scope="scope">
          <span :class="scope.row.isdept==0?'warning':'success'">{{scope.row.isdept==0?'机构':'部门'}}</span>
          {{scope.row.orgname}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="银行帐户"
        width="120"
        show-overflow-tooltip
        prop="bankaccount"
      ></el-table-column>
      <el-table-column align="center" label="支付方式" width="120" show-overflow-tooltip prop="linepay">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.linepay == 1 ? 'success' : ''"
          >{{scope.row.linepay == 1 ? '在线支付' : '其他'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="税号" width="120" show-overflow-tooltip prop="taxid"></el-table-column>
      <el-table-column
        align="center"
        label="国籍"
        width="120"
        show-overflow-tooltip
        prop="orgcountry"
      >
        <template slot-scope="scope">{{getCountryname(scope.row.orgcountry)}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="省份"
        width="120"
        show-overflow-tooltip
        prop="orgprovince"
      ></el-table-column>
      <el-table-column align="center" label="城市" width="120" show-overflow-tooltip prop="orgcity"></el-table-column>
      <el-table-column
        align="center"
        label="邮政编码"
        width="120"
        show-overflow-tooltip
        prop="postcode"
      ></el-table-column>
      <el-table-column align="center" label="机构类型" width="120" show-overflow-tooltip prop="orgtype">
        <template
          slot-scope="scope"
        >{{scope.row.orgtype == 0 ? '政府医保' : scope.row.orgtype == 1 ? '商业保险' : '合作单位'}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="生效日期"
        width="120"
        show-overflow-tooltip
        prop="effectivedate"
      >
        <template slot-scope="scope">{{scope.row.effectivedate | dateFormat}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="失效日期"
        width="120"
        show-overflow-tooltip
        prop="expirationdate"
      >
        <template slot-scope="scope">{{scope.row.expirationdate | dateFormat}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="汇款周期"
        width="120"
        show-overflow-tooltip
        prop="paybackperiod"
      ></el-table-column>
      <el-table-column align="center" label="邮箱" width="120" show-overflow-tooltip prop="respmail"></el-table-column>
      <el-table-column align="center" label="负责人" width="120" show-overflow-tooltip prop="respname"></el-table-column>
      <el-table-column
        align="center"
        label="负责人电话"
        width="120"
        show-overflow-tooltip
        prop="resptel"
      ></el-table-column>
      <el-table-column align="center" label="状态" width="80" fixed="right" prop="status">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status == 1 ? 'success' : 'danger'"
          >{{scope.row.status == 1 ? '正常' : '停用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" fixed="right" label="操作">
        <template slot-scope="scope">
          <div class="tableBtn">
            <el-link
              title="编辑"
              @click="handleActivityEdit(true,scope.row)"
              :underline="false"
              type="primary"
              icon="mkfont bianji1"
            ></el-link>
            <el-link
              :title="scope.row.status==1?'停用':'启用'"
              :icon="scope.row.status==1?'mkfont tingyong_line':'mkfont qiyong'"
              :underline="false"
              :type="scope.row.status==1?'danger':'primary'"
              @click="Del(scope.row)"
            />
            <!-- <el-button type="primary" @click="handleNewData">添加</el-button> -->
            <el-link
              title="添加"
              @click="handleNewData('2',scope.row)"
              :underline="false"
              type="success"
              icon="el-icon-plus"
            ></el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <mk-page :pager="pager" @query="refreshList" />
    </template>

    <!-- 
      ******************************************************************************************
      *********************************************弹框******************************************
      ******************************************************************************************
    -->
    <vxe-modal v-model="orgModal" @close="close" title="合作机构维护" width="1000" height="auto">
      <el-row>
        <el-col :span="12">
          <el-form label-width="100px">
            <el-form-item label="类型">
              <el-select v-model="isdept" placeholder="请选择" @change="isdept" :disabled="isRoot">
                <el-option :key="0" label="机构" :value="0"></el-option>
                <el-option :key="1" label="部门" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <!--  -->
        <el-form :model="form" ref="ActivityForm" :rules="newOrgRule" label-width="100px">
          <el-col :span="12">
            <el-form-item label="上级菜单">
              <el-input v-model="form.forgname" :disabled="isforgname"></el-input>
            </el-form-item>
          </el-col>
          <template v-if="isdept===1">
            <el-col :span="12">
              <el-form-item label="部门名称">
                <el-input v-model="form.orgname"></el-input>
              </el-form-item>
            </el-col>
          </template>
          <!--  -->
          <template v-if="isdept===0">
            <el-col :span="12">
              <el-form-item label="院区" prop="hospitalid">
                <mk-select
                  v-model="form.hospitalid"
                  placeholder="选择院区"
                  url="/Publics/Common/Dic/HospitalInfo"
                  :filter="['hospitalname','filterstr']"
                  label="hospitalname"
                  val="hospitalid"
                  :disabled="form.forgid==0?false:true"
                ></mk-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="机构代码" prop="orgid">
                <el-input v-model="form.orgid" :disabled="form.operatetype == 'U'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="机构类型" prop="orgtype">
                <el-select v-model="form.orgtype" placeholder="请选择">
                  <el-option :key="0" label="政府医保" :value="0"></el-option>
                  <el-option :key="1" label="商业保险" :value="1"></el-option>
                  <el-option :key="2" label="合作单位" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="机构名称" prop="orgname">
                <el-input v-model="form.orgname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="机构简称" prop="orgshortname">
                <el-input v-model="form.orgshortname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检索码" prop="filterstr">
                <el-input v-model="form.filterstr"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider></el-divider>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行帐户" prop="bankaccount">
                <el-input
                  v-model="form.bankaccount"
                  suffix-icon="fa fa-cc-visa"
                  @input="changeAccount"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税号" prop="taxid">
                <el-input v-model="form.taxid"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="在线支付" prop="linepay">
                <el-radio-group v-model="form.linepay">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="汇款周期" prop="paybackperiod">
                <el-input-number v-model="form.paybackperiod" controls-position="right"></el-input-number>
                <span style="padding-left: 6px;">月</span>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-divider></el-divider>
            </el-col>
            <el-col :span="8">
              <el-form-item label="国籍" prop="orgcountry">
                <mk-select
                  v-model="form.orgcountry"
                  url="1"
                  :clearable="false"
                  :globalFn="true"
                  :param="{ codetype: '国家' }"
                  :filter="['bzname','filterstr']"
                  label="bzname"
                  val="bzcode"
                ></mk-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="注册地址" prop="orgprovince">
                <el-cascader
                  ref="cascader"
                  class="inputShort"
                  clearable
                  v-model="CurCityData"
                  :options="$countyData"
                  filterable
                  :props="optionsConfig"
                  @change="handleChangeCurCity"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="邮政编码" prop="postcode">
                <el-input v-model="form.postcode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider></el-divider>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="respmail">
                <el-input v-model="form.respmail"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人" prop="respname">
                <el-input v-model="form.respname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人电话" prop="resptel">
                <el-input v-model="form.resptel"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生效日期" prop="effectivedate">
                <el-date-picker
                  style="width:100%"
                  v-model="form.effectivedate"
                  type="date"
                  placeholder="生效日期"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="失效日期" prop="expirationdate">
                <el-date-picker
                  style="width:100%"
                  v-model="form.expirationdate"
                  type="date"
                  placeholder="失效日期"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="24"></el-col>
        </el-form>
      </el-row>
      <el-button-group style="margin-left:40%">
        <el-button type="primary" @click="sumbit('ActivityForm')">提交</el-button>
        <el-button type="warning" @click="close">取消</el-button>
      </el-button-group>
    </vxe-modal>
  </d2-container>
</template>

<script>
import dayjs from "dayjs";
import util from "@/libs/util.js";
export default {
  name: "marketActivity",
  computed: {},
  data() {
    return {
      maps: new Map(),
      countryList: [],
      isRoot: false,
      isforgname: true,
      isExpandAll: false,
      show: true,
      orgModal: false,
      pager: {
        rows: 20,
        page: 1,
        count: 0,
        condition: "",
        hospitalid: "",
        orgtype: "",
        flgtree: 0
      },
      tableData: [],
      CurCityData: [], //省市區
      children: true,
      optionsConfig: {
        value: "code",
        label: "name",
        children: "children"
      },
      form: {
        operatetype: "C", //操作类型 部分接口新增修改删除不单独,一个post搞定 C:新增 U:修改 D:删除 默认为C新增
        hospitalid: "", //对应　系统_医院院区表　的院区id
        orgid: "", //机构id
        bankaccount: "", //银行帐户
        createtime: "", //创建时间
        createuserid: "", //创建人id
        effectivedate: "", //生效日期
        expirationdate: "", //失效日期
        filterstr: "", //首拼
        linepay: 0, //在线支付 0：否 1：是
        orgcity: "", //机构所在城市
        orgcountry: "", //机构所在国家 对应 字典_国家代码表 表的国家代码
        orgname: "", //机构名称
        orgprovince: "", //机构所在省份
        orgshortname: "", //机构简称
        orgtype: 0, //机构类型 0：政府医保 1：商业保险 2：合作单位
        paybackperiod: 0, //回款周期
        postcode: "", //邮政编码
        respmail: "", //邮箱
        respname: "", //机构负责人
        resptel: "", //机构负责人电话
        status: 0, //0： 停用 1： 启用 99：删除
        taxid: "", //税号
        forgid: 0,
        forgname: "",
        isdept: 0 //1部门0机构
      },
      isdept: 0, //1部门0机构
      //

      newOrgRule: {
        orgname: [
          { required: true, message: "请输入机构名称", trigger: "blur" }
        ],
        orgid: [{ required: true, message: "请输入机构代码", trigger: "blur" }],
        resptel: [
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "请输入正确的手机号码"
          }
        ],
        respmail: [
          {
            pattern: /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g,
            message: "请输入正确的电子邮箱"
          }
        ],
        postcode: [
          {
            pattern: /^[0-9]{6}$/,
            message: "请输入正确的邮政编码"
          }
        ]
      }
    };
  },
  created() {
    this.refreshList();
    this.countryList = this.getDicStandarDcode("国家");
  },
  watch: {
    "form.orgname"(val) {
      this.form.filterstr = util.py.firstChar(val);
    }
  },
  methods: {
    getCountryname(code) {
      for (let item of this.countryList) {
        if (code == item.bzcode) {
          return item.bzname;
        }
      }
    },
    init() {
      this.isdept = 0;
      this.isRoot = false;
      this.form = {
        operatetype: "C", //操作类型 部分接口新增修改删除不单独,一个post搞定 C:新增 U:修改 D:删除 默认为C新增
        hospitalid: "", //对应　系统_医院院区表　的院区id
        orgid: "", //机构id
        bankaccount: "", //银行帐户
        createtime: "", //创建时间
        createuserid: "", //创建人id
        effectivedate: "", //生效日期
        expirationdate: "", //到期
        filterstr: "", //首拼
        linepay: 0, //在线支付 0：否 1：是
        orgcity: "", //机构所在城市
        orgcountry: "", //机构所在国家 对应 字典_国家代码表 表的国家代码
        orgname: "", //机构名称
        orgprovince: "", //机构所在省份
        orgshortname: "", //机构简称
        orgtype: 0, //机构类型 0：政府医保 1：商业保险 2：合作单位
        paybackperiod: 0, //回款周期
        postcode: "", //邮政编码
        respmail: "", //邮箱
        respname: "", //机构负责人
        resptel: "", //机构负责人电话
        status: 0, //0： 停用 1： 启用 99：删除
        taxid: "", //税号
        isdept: 0, //1部门0机构
        forgid: 0,
        forgname: ""
      };
    },
    // 更改现居地
    handleChangeCurCity(val) {
      let curLabel = this.$refs.cascader.getCheckedNodes()[0].pathLabels;
      this.form.orgprovince = curLabel[0];
      this.form.orgcity = `${curLabel[1]}-${curLabel[2]}`;
    },
    search() {
      this.$refs.mkTable.getData();
    },
    refreshList() {
      this.MK.Request(
        "/Publics/Common/Dic/HospitalOrgan",
        "get",
        this.pager
      ).then(res => {
        if (res.code == 0) {
          this.tableData = res.data;
          this.tableData.forEach(item => {
            item.hasChildrens = item.haschildren == 1 ? true : false;
            delete item.children;
          });
          this.pager.count = res.count;
        }
      });
    },
    close() {
      this.orgModal = false;
      this.init();
      this.$nextTick(() => {
        this.$refs["ActivityForm"].clearValidate();
        this.$refs["ActivityForm"].resetFields();
      });
    },
    // 新增
    handleNewData(type, row) {
      this.init();
      if (type=='1') {
        
        this.form.forgid = 0;
        this.form.forgname = "";
      } else {
        this.form.forgid = row.orgid;
        this.form.forgname = row.orgname;
        this.form.hospitalid = parseInt(row.hospitalid);
        if(row.isdept==1){
           this.isRoot = true;
        this.isdept=1
      }
      }
      
      this.orgModal = true;
    },
    sumbit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.HospitalOrgan();
        }
      });
    },
    handleChangeHanduernameid(row) {
      this.form.handuserid = row.userid;
    },
    changeAccount(value) {
      this.form.bankaccount = this.formatBankNo(value);
    },
    formatBankNo(value) {
      if (value == "") return;
      var account = new String(value);
      account = account.substring(0, 22); /*帐号的总数,包括空格在内 */
      if (account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
        /* 对照格式 */
        if (
          account.match(
            ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
              ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
              ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
              ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}"
          ) == null
        ) {
          var accountNumeric = "",
            accountChar = "",
            i;
          for (i = 0; i < account.length; i++) {
            accountChar = account.substr(i, 1);
            if (!isNaN(accountChar) && accountChar != " ")
              accountNumeric = accountNumeric + accountChar;
          }
          account = "";
          for (i = 0; i < accountNumeric.length; i++) {
            /* 可将以下空格改为-,效果也不错 */
            if (i == 4) account = account + "-"; /* 帐号第四位数后加空格 */
            if (i == 8) account = account + "-"; /* 帐号第八位数后加空格 */
            if (i == 12) account = account + "-"; /* 帐号第十二位后数后加空格 */
            account = account + accountNumeric.substr(i, 1);
          }
        }
      } else {
        account =
          " " +
          account.substring(1, 5) +
          " " +
          account.substring(6, 10) +
          " " +
          account.substring(14, 18) +
          "-" +
          account.substring(18, 25);
      }
      if (account != value) value = account;
      return account;
    },
    //新增编辑事件
    HospitalOrgan() {
      let cloneData = {};
      let from = JSON.parse(JSON.stringify(this.form));
      from.forgid == "" ? 0 : from.forgid;
      from.isdept = this.isdept;
      if (this.isdept === 0) {
        cloneData = from;
        if (cloneData.operatetype == "C") {
          delete cloneData.createtime;
          delete cloneData.operatetime;
        }
        cloneData.operateuserid = this.info.userid;
        cloneData.operateusername = this.info.name;
        cloneData.bankaccount = cloneData.bankaccount
          ? cloneData.bankaccount.replace(new RegExp(/(-)/g), "")
          : "";
        cloneData.createuserid = this.info.userid;
      } else if (this.isdept === 1) {
        cloneData.operatetype = from.operatetype;
        cloneData.forgid = from.forgid;
        cloneData.orgname = from.orgname;
        cloneData.isdept = 1;
        cloneData.hospitalid = from.hospitalid;
      }
      this.MK.Request(
        "/Publics/Common/Dic/HospitalOrgan",
        "post",
        cloneData
      ).then(res => {
        if (res.code == 0) {
          this.$message.success(res.msg);
          this.refreshList();
          this.orgModal = false;
          this.close();
          if (cloneData.operatetype == "U") {
            this.refreshLoadTree(cloneData.forgid)
          }
        }
      });
    },
    // 编辑
    handleActivityEdit(type, row) {
      this.isRoot = true; //禁止编辑
      this.isdept = parseInt(row.isdept);
      row.hospitalid = row.hospitalid;
      let countData = this.$countyData;
      let orgprovince = row.orgprovince;
      let orgcityArr = row.orgcity ? row.orgcity.split("-") : "";
      let citArr = [orgprovince, ...orgcityArr];
      this.CurCityData = this.getCitCode(citArr);
      this.orgModal = true;
      this.form = JSON.parse(JSON.stringify(row));

      this.form.operatetype = "U";
      this.form.bankaccount = this.formatBankNo(this.form.bankaccount);
    },
    //
    getCitCode(data) {
      let curArr = [];
      let code = [];
      let curCity = data[0];
      curArr = this.$countyData.filter(item => curCity == item.name); //获取当前省的数据
      function getNodes(arr, key) {
        arr.forEach(item => {
          if (item.name == key) {
            code.push(item.code);
          }
          if (item.children) {
            getNodes(item.children, key);
          }
        });
      }
      data.forEach(key => {
        getNodes(curArr, key);
      });
      return code;
    },
    //99禁用 1启用
    Del(row) {
      let data = JSON.parse(JSON.stringify(row));
      let text = "";
      data.operatetype = "U";
      if (data.status == 0) {
        data.status = 1;
      } else {
        data.status = 0;
      }
      this.MK.Request("/Publics/Common/Dic/HospitalOrgan", "post", data).then(
        res => {
          if (res.code == 0) {
            this.$message.success(res.msg);
            this.refreshList();
            // this.close();
          }
        }
      );
    },
    expand() {
      this.isExpandAll = !this.isExpandAll;
      this.show = false;
      const loading = this.$loading({
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });

      setTimeout(_ => {
        this.show = true;
        loading.close();
      }, 200);
    },
    // 重新触发树形表格的loadTree函数(因项目中需要多次触发loadTree方法，故封装成一个方法)
refreshLoadTree(parentId) {
	// 根据父级id取出对应节点数据
	const { tree, treeNode, resolve } = this.maps.get(parentId)
	this.$set(this.$refs.table.store.states.lazyTreeNodeMap, parentId, [])
	if (tree) {
		this.load(tree, treeNode, resolve)
	}
},
    load(tree, treeNode, resolve) {
      this.maps.set(tree.orgid, { tree, treeNode, resolve })
      let data = {
        flgtree: 1,
        // orgid:'',
        forgid: tree.orgid,
        condition: this.pager.condition,
        tag: 1,
        hospitalid: this.pager.hospitalid,
        orderby: this.pager.orderby
      };
      this.MK.Request("/Publics/Common/Dic/HospitalOrgan", "get", data).then(
        res => {
          if (res.code == 0) {
            let data = res.data;
            let [start, end, size] = [null, null, 5];
            data.forEach(item => {
              item.hasChildrens = item.haschildren == 1 ? true : false;
              delete item.children;
            });
            resolve(data);
          }
        }
      );
    }
  }
};
</script>

<style scoped>
</style>
