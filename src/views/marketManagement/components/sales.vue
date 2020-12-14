<template>
  <SplitPane :min-percent="40" :default-percent="50" split="vertical" style="height:100%">
    <template slot="paneL">
      <el-container>
        <el-main style="padding:0px">
          <el-row>
            <el-form label-width="120px" :model="fromData" :rules="Rules" ref="fromData">
              <!--  -->
              <el-col :span="12">
                <el-form-item label="购买者姓名" prop="buyername">
                  <el-input v-model="fromData.buyername" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="购买者身份证号" prop="buyeridno">
                  <el-input v-model="fromData.buyeridno" @change="getUserInfo" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="购买者电话" prop="buyertel">
                  <el-input v-model="fromData.buyertel" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="购买者邮箱" prop="buyermail">
                  <el-input v-model="fromData.buyermail" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="购买者联系地址">
                  <el-input v-model="fromData.buyeraddr" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="指定使用人">
                  <el-select v-model="appoint" placeholder="是否指定使用人">
                    <el-option
                      v-for="item in appointList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 指定使用 Rules -->

              <template v-if="appoint == 0">
                <el-col :span="24">
                  <el-col :span="12">
                    <el-form-item label="会员识别号">
                      <mk-member-select
                        @change="getManagerItem"
                        url="Publics/MemberManage/BasicInfo"
                        :RequestData="{
                    mycustomer: 0,
                    expirationdaysmemberfee: 0,
                    tag: 0,
                    page: 1,
                    rows: 20
                  }"
                        ref="selectManager"
                        :clearable="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="姓名">
                      <div>
                        <span style="min-width:60px;display:inline-block;font-size:.75rem">
                          {{
                          ManagerItem.membername || "请选择会员"
                          }}
                        </span>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="id" label-width="60px">
                       <span style="min-width:60px;display:inline-block;font-size:.75rem">
                      {{
                      ManagerItem.memberid || "请选择会员"
                      }}
                      </span>
                    </el-form-item>
                  </el-col>
                </el-col>
              </template>
              <el-col :span="12">
                <el-form-item label="选择套餐">
                  <el-select
                    v-model="fromData.packageid"
                    filterable
                    remote
                    :remote-method="remoteMethod"
                    value-key="packageid"
                    @change="getTcid"
                  >
                    <el-option
                      v-for="item in selectData"
                      :key="item.packageid"
                      :label="item.packagename"
                      :value="item.packageid"
                    >
                      <div class="tabel_lq">
                        <div class="cell_lq">
                          <span class="cell_ellipsis w80">
                            {{
                            item.packageid
                            }}
                          </span>
                        </div>
                        <div class="cell_lq">
                          <span class="cell_ellipsis w80">
                            {{
                            item.packagename
                            }}
                          </span>
                        </div>
                        <div class="cell_lq">
                          <span class="cell_ellipsis w80">
                            {{
                            item.statusdisplay
                            }}
                          </span>
                        </div>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="套餐金额">
                  <span>{{ projectAmounts(fromData.packageamount) }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="套餐描述">
                  <el-input v-model="fromData.packagenote" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="销售渠道">
                  <el-radio-group v-model="fromData.channel">
                    <el-radio label="0">线下</el-radio>
                    <el-radio label="1">线上</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="销售人" prop="saleuserid">
                  <el-select
                    v-model="fromData.saleuserid"
                    placeholder="请选择销售人"
                    @change="getUserName($event, 'saleuser')"
                  >
                    <el-option
                      v-for="item in customManagerList"
                      :key="item.userid"
                      :label="item.name"
                      :value="item.userid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="介绍人">
                  <el-input v-model="fromData.introusername" />
                </el-form-item>
              </el-col>
               <el-col :span="12">
                <el-form-item label="介绍费">
                  <el-input-number
                    v-model="fromData.introfee"
                    :step="1"
                    :min="0"
                    :precision="2"
                    placeholder
                  ></el-input-number>
                </el-form-item>
              </el-col>
              </el-col>
              <el-col :span="24">
                <el-form-item label="介绍人电话">
                  <el-input v-model="fromData.introusertel" />
                </el-form-item>
              </el-col>
             
              <el-col :span="12">
                <el-form-item label="销售金额">
                  <el-input-number
                    v-model="fromData.price"
                    :step="100"
                    :min="0"
                    :precision="2"
                    placeholder
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数量">
                  <el-input-number v-model="fromData.amount" :step="1" :min="1" placeholder></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态" v-show="fromData.operatetype == 'U' ? true : false">
                  <el-radio-group v-model="fromData.status">
                    <el-radio :label="0">正常</el-radio>
                    <el-radio :label="1">作废</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </el-main>
      </el-container>
    </template>
    <!-- -------R-------- -->
    <template slot="paneR">
      <SplitPane :min-percent="20" :default-percent="20" split="vertical">
        <template slot="paneL">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            node-key="classifyid"
            :indent="10"
            :accordion="true"
            :current-node-key="0"
            :highlight-current="true"
            :default-expand-all="true"
            @node-click="handleNodeClick"
            ref="detailTree"
          >
            <span class="custom-tree-node" style="margin:10px;" slot-scope="{ node, data }">
              <span>
                <span>{{ data.name }}</span>
              </span>
            </span>
          </el-tree>
        </template>
        <template slot="paneR">
          <!-- 套餐总额 -->
          <div v-if="curPackage.children" style="height:100%;">
            <el-table
              :data="detailTotalTableData"
              :show-header="false"
              border
              height="100%"
              stripe
              :header-cell-style="cellStyle"
              :highlight-current-row="true"
              :summary-method="getSummaries"
              :show-summary="true"
              sum-text="合计"
              ref="detailTotalTableData"
            >
              <el-table-column align="left" prop width="140">
                <template slot-scope="scope">原价 - {{ scope.row.itemtypename }}</template>
              </el-table-column>
              <el-table-column align="right" prop="originalprice" :formatter="tableNumberFilter" />
              <el-table-column align="center" width="100">
                <template slot-scope="scope">
                  <el-select
                    :disabled="true"
                    v-model="scope.row.operator"
                    @change="handleChangeOperator(scope.$index, scope.row)"
                  >
                    <el-option v-for="item in operator" :label="item" :value="item" :key="item" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="left">
                <template slot-scope="scope">
                  <el-input
                    :disabled="true"
                    v-model="scope.row.discountprice"
                    @change="handleChangeDiscount(scope.$index, scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column align="left">
                <template slot-scope="scope">折后金额</template>
              </el-table-column>
              <el-table-column prop="discount" align="right">
                <template slot-scope="scope">
                  <el-input :disabled="true" v-model="scope.row.discount" />
                </template>
              </el-table-column>
              <el-table-column align="left" width="140">
                <template slot-scope="scope">成本价 - {{ scope.row.itemtypename }}</template>
              </el-table-column>
              <el-table-column align="right" prop="costprice" :formatter="tableNumberFilter" />
              <el-table-column align="left" prop width="140">
                <template slot-scope="scope">套餐价 - {{ scope.row.itemtypename }}</template>
              </el-table-column>
              <el-table-column align="right" prop="packageprice" :formatter="tableNumberFilter" />
            </el-table>
          </div>
          <!-- 套餐明细表格 -->
          <el-table
            v-else
            :data="tableData"
            border
            height="100%"
            stripe
            :header-cell-style="cellStyle"
            :highlight-current-row="true"
            ref="table"
          >
            <el-table-column
              sortable
              fixed="left"
              show-overflow-tooltip
              align="center"
              label="项目类别"
              width="120"
              prop="itemtypename"
            />
            <el-table-column
              sortable
              fixed="left"
              show-overflow-tooltip
              align="center"
              label="项目名称"
              width="120"
              prop="itemname"
            />
            <el-table-column
              sortable
              show-overflow-tooltip
              align="center"
              label="数量"
              prop="amount"
            />
            <el-table-column
              sortable
              show-overflow-tooltip
              align="right"
              label="原价"
              width="120"
              prop="originalprice"
              :formatter="tableNumberFilter"
            />
            <el-table-column
              sortable
              show-overflow-tooltip
              align="right"
              label="成本价"
              width="120"
              prop="costprice"
              :formatter="tableNumberFilter"
            />
            <el-table-column
              sortable
              show-overflow-tooltip
              align="right"
              label="套餐价"
              width="120"
              prop="packageprice"
              :formatter="tableNumberFilter"
            />
            <el-table-column
              sortable
              show-overflow-tooltip
              align="center"
              label="规格"
              prop="specification"
            />
            <el-table-column sortable show-overflow-tooltip align="center" label="单位" prop="unit" />
          </el-table>
        </template>
      </SplitPane>
    </template>
  </SplitPane>
</template>

<script>
// 手机号验证
const checkPhone = (rule, value, callback) => {
  const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/;
  if (!value) {
    return callback(new Error("联系手机不能为空"));
  }
  setTimeout(() => {
    if (!Number.isInteger(+value)) {
      callback(new Error("请输入数字"));
    } else {
      if (phoneReg.test(value)) {
        callback();
      } else {
        callback(new Error("联系电话格式不正确"));
      }
    }
  }, 200);
};
// 邮箱校验
const checkMail = (rule, value, callback) => {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
  if (value != "") {
    setTimeout(() => {
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("邮箱格式不正确"));
      }
    }, 200);
  } else {
    callback();
  }
};
export default {
  props: {
    rowData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    // 证件校验 包含身份证
    const checkIDCard = (rule, value, callback) => {
      const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

      if (!value) {
        return callback(new Error("身份证号不能为空"));
      }
      setTimeout(() => {
        if (!regIdCard.test(value)) {
          return callback(new Error("身份证号填写有误"));
        } else {
          callback();
        }
      }, 200);
    };
    return {
      ManagerItem: {},
      selectParams: {
        count: 20,
        page: 1,
        rows: 20,
        status: 5
      },
      selectData: [],
      appoint: 0,
      appointList: [
        {
          value: 0,
          label: "指定使用人"
        },
        { value: 1, label: "不指定使用人" }
      ],
      Rules: {
        saleuserid: [
          { required: true, message: "请选择销售人", trigger: "blur" }
        ],
        buyername: [
          { required: true, message: "请输入购买者姓名", trigger: "blur" }
        ],
        buyertel: [
          {
            required: true,
            validator: checkPhone,
            message: "请输入购买者手机号",
            trigger: "blur"
          }
        ],
        buyermail: [{ validator: checkMail, trigger: "blur" }],
        buyeridno: [
          {
            required: true,
            validator: checkIDCard,
            message: "请输入购买者身份证号",
            trigger: "blur"
          }
        ]
      },
      fromData: {
        packageamount: 0,
        packagenote: "",
        operatetype: "C", //操作类型 部分接口新增修改删除不单独,一个post搞定 C:新增 U:修改 D:删除 默认为C新增
        saleid: 0, //销售id
        amount: 1, //数量
        buyeraddr: "", //购买者联系地址
        buyeridno: "", //购买者身份证号
        buyermail: "", //购买者邮箱
        buyername: "", //购买者姓名
        buyertel: "", //购买者电话
        channel: "0", //销售渠道
        contractcode: "", //合同编号
        introfee: 0.0, //介绍费
        introuserid: 0, //介绍人id
        introusername: "", //介绍人姓名
        introusertel: "", //介绍人电话
        invoicecode: "", //发票编号
        memberid: null, //会员id
        membername: "", //会员名称
        operatetime: "", //操作时间
        operateueername: "", //操作人姓名
        operateuserid: undefined, //操作人id
        operateuserno: "", //操作人工号
        packageid: undefined, //套餐id
        packagename: "", //套餐名称
        price: 0, //价格
        receiptcode: "", //收据编号
        saletime: "", //销售时间
        saleuserid: undefined, //销售人id
        saleusername: "", //销售人姓名
        saleuserno: "", //销售人工号
        status: 0 //状态,1正常0作废
      },
      customManagerList: [],
      tableData: [],
      detailTableData: [],
      typeList: [],
      detailTotalTableData: [],
      treeData: [],
      curPackage: {},
      operator: ["-", "*", "="],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  watch: {
    rowData(val) {
      // console.log(val);
      this.fromData = { ...val };
    }
  },
  created() {
    //查询客户经理-责任人
    this.Member_AccountManager_Get();
  },
  methods: {
    init() {
      this.fromData = {
        packageamount: 0,
        packagenote: "",
        operatetype: "C", //操作类型 部分接口新增修改删除不单独,一个post搞定 C:新增 U:修改 D:删除 默认为C新增
        saleid: 0, //销售id
        amount: 1, //数量
        buyeraddr: "", //购买者联系地址
        buyeridno: "", //购买者身份证号
        buyermail: "", //购买者邮箱
        buyername: "", //购买者姓名
        buyertel: "", //购买者电话
        channel: 0, //销售渠道
        contractcode: "", //合同编号
        introfee: 0.0, //介绍费
        introuserid: 0, //介绍人id
        introusername: "", //介绍人姓名
        introusertel: "", //介绍人电话
        invoicecode: "", //发票编号
        memberid: null, //会员id
        membername: "", //会员名称
        operatetime: "", //操作时间
        operateueername: "", //操作人姓名
        operateuserid: undefined, //操作人id
        operateuserno: "", //操作人工号
        packageid: undefined, //套餐id
        packagename: "", //套餐名称
        price: 0, //价格
        receiptcode: "", //收据编号
        saletime: "", //销售时间
        saleuserid: undefined, //销售人id
        saleusername: "", //销售人姓名
        saleuserno: "", //销售人工号
        status: 0 //状态,1正常0作废
      };
    },
    //查询客户经理-责任人
    Member_AccountManager_Get() {
      this.MK.Request("Publics/Common/UserInfo", "get", {
        tag: 1
      }).then(res => {
        this.customManagerList = res.data;
      });
    },
    getUserInfo(value) {
      // console.log(value);
      this.$refs.selectManager.BasicInfo_Get(value);
    },
    //模糊查询用户
    getManagerItem(item) {
      if (!item) {
        this.ManagerItem = {};
        this.fromData.memberid = undefined;
        this.fromData.membername = "";
        return;
      }
      this.ManagerItem = item;
      this.fromData.memberid = item.memberid;
      this.fromData.membername = item.membername;

      // this.MemberRights_Get();
    },
    getTcid(id) {
      // console.log(id);
      for (let i = 0; i < this.selectData.length; i++) {
        if (id == this.selectData[i].packageid) {
          // console.log(this.selectData[i]);
          this.fromData.packageid = id;
          this.fromData.packageamount = this.selectData[i].packageamount;
          this.fromData.packagenote = this.selectData[i].packagenote;
          this.fromData.packagename = this.selectData[i].packagename;
          this.packageclassify_Get(id, this.selectData[i].packagename);
          
        }
      }
    },
    getUserName(id, type) {
      for (let i = 0; i < this.customManagerList.length; i++) {
        if (id == this.customManagerList[i].userid) {
          this.fromData[type + "no"] = this.customManagerList[i].staffno;
          this.fromData[type + "name"] = this.customManagerList[i].name;
        }
      }
    },
    //远程搜索套餐
    remoteMethod(query) {
      this.selectParams.condition = query;
      this.MK.Request(
        "/Publics/CodePackageMaintain/PackageList_Get",
        "get",
        this.selectParams
      ).then(res => {
        if (res.code == 0) {
          this.selectData = res.data;
        }
      });
    },
    // 获取分类
    packageclassify_Get(id, name) {
      this.MK.Request(
        "/Publics/CodePackageMaintain/Packageclassify_Get",
        "get",
        { packageid: id }
      ).then(res => {
        res.data.map((item, index) => (item.index = index));
        this.typeList = res.data;
        this.treeData = [
          {
            name: name,
            children: this.typeList
          }
        ];
        this.$nextTick(() => {
          this.$refs.detailTree.setCurrentKey(this.typeList[0].classifyid);
        });
        let params = {
          classifyid: this.typeList[0].classifyid,
          packageid: id
        };
        this.packagedetailList_Get(params);
      });
    },
    // 获取明细
    packagedetailList_Get(data) {
      this.MK.Request(
        "/Publics/CodePackageMaintain/PackagedetailList_Get",
        "get",
        data
      ).then(res => {
        if (data.classifyid == "-1") {
          res.data.map(item => {
            item.operator = this.operator[0];
            item.discount = 0;
          });
          this.detailTotalTableData = res.data;
          

        }
        this.tableData = res.data;
       
      });
    },
    // 树形结构左击
    handleNodeClick(data) {
      // console.log("click", data);
      if (!data.children) {
        this.isNodeClick = true;
      } else {
        this.isNodeClick = false;
      }
      this.curPackage = data;
      if (data.name != this.fromData.packagename) {
        var params = {
          classifyid: data.classifyid,
          packageid: data.packageid
        };
      } else {
        var params = {
          classifyid: "-1",
          packageid: this.fromData.packageid
        };
      }
      this.packagedetailList_Get(params);
      
    },
    // 表格列头样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.labelClassName == "ChangeColor") {
        return "color:#1296db";
      } else {
        return "";
      }
    },
    // 金额过滤
    tableNumberFilter(row, col, filterString, index) {
      let num = filterString;
      if (isNaN(parseFloat(num)) || num == 0) {
        return 0.0;
      } else {
        return num
          ? (isNaN(parseFloat(num.toString().replace(/,/g, "")))
              ? 1
              : parseFloat(num.toString().replace(/,/g, ""))
            )
              .toFixed(2)
              .toString()
              .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
                return $1 + ",";
              })
          : "";
      }
    },
    // 合计
    getSummaries(param) {
       this.$nextTick(() => {
        this.$refs.detailTotalTableData.doLayout()
        })
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "原价总价";
          return;
        }
        if (index === 4) {
          sums[index] = "折后总价";
          return;
        }
        if (index === 6) {
          sums[index] = "成本总价";
          return;
        }
        if (index === 8) {
          sums[index] = "套餐总价";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += " 元";
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    // 树形结构左击
    handleNodeClick(data) {
      // console.log("click", data);
      if (!data.children) {
        this.isNodeClick = true;
      } else {
        this.isNodeClick = false;
      }
      this.curPackage = data;
      if (data.name != this.fromData.packagename) {
        var params = {
          classifyid: data.classifyid,
          packageid: data.packageid
        };
      } else {
        var params = {
          classifyid: "-1",
          packageid: this.fromData.packageid
        };
      }
      this.packagedetailList_Get(params);
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
  .cell_ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
}
.card {
  height: 78vh;
}
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
