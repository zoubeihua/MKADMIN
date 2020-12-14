<template>
  <d2-container>
    <SplitPane :min-percent="35" :default-percent="50" split="vertical">
      <template slot="paneL">
        <el-container>
          <el-header>
            <el-form :inline="true">
              <el-form-item>
                <el-input @keyup.enter="chenge" placeholder="按企业名称（首拼）查找"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="form.year" placeholder="企业状态" style="width:135px;" clearable>
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.year"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                </el-button-group>
              </el-form-item>
            </el-form>
          </el-header>
          <el-main style="padding: 0;">
            <el-table :data="dataTable" stripe border highlight-current-row height="100%">
              <el-table-column label="企业信息" align="center">
                <el-table-column label="结算公司" sortable show-overflow-tooltip min-width="100px"></el-table-column>
                <el-table-column label="企业名称" sortable show-overflow-tooltip min-width="100px"></el-table-column>
                <el-table-column label="企业代码" sortable show-overflow-tooltip min-width="100px"></el-table-column>
                <el-table-column label="企业类型" sortable show-overflow-tooltip min-width="100px"></el-table-column>
                <el-table-column label="开户银行" sortable show-overflow-tooltip min-width="100px"></el-table-column>
                <el-table-column label="负责人姓名" sortable show-overflow-tooltip min-width="120px"></el-table-column>
                <el-table-column label="负责人电话" sortable show-overflow-tooltip min-width="120px"></el-table-column>
                <el-table-column label="状态" sortable show-overflow-tooltip></el-table-column>
                <el-table-column label="客服经理" sortable show-overflow-tooltip min-width="100px"></el-table-column>
                <el-table-column label="操作" show-overflow-tooltip>
                  <template slot="header" slot-scope="scope">
                    <el-button type="primary" @click="addEnterprise">添加</el-button>
                  </template>
                  <template slot-scope="scope">
                    <el-link type="primary" @click="payment">支付</el-link>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <mk-page :pager="pager" @query="query" />
          </el-footer>
        </el-container>
      </template>
      <template slot="paneR">
        <SplitPane :min-percent="25" :default-percent="50" split="horizontal">
          <template slot="paneL">
            <el-container>
              <el-header>
                <el-form :inline="true">
                  <el-form-item>
                    <el-input
                      @keyup.enter="chenge"
                      placeholder="按合同编号查询"
                      style="width:135px;"
                      clearable
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-select
                      v-model="form.year"
                      placeholder="请选择合同状态"
                      style="width:130px;"
                      clearable
                    >
                      <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.year"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="合同日期">
                    <el-date-picker
                      style="width:270px"
                      v-model="value7"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerOptions2"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-button-group>
                      <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                    </el-button-group>
                  </el-form-item>
                </el-form>
              </el-header>
              <el-main style="padding:0">
                <el-table
                  :data="PackageDataTable"
                  stripe
                  border
                  highlight-current-row
                  height="100%"
                >
                  <el-table-column label="企业合同" align="center">
                    <el-table-column label="合同日期" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column label="合同编号" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column label="合同名称" sortable show-overflow-tooltip min-width="100px">
                      <template slot-scope="scope">
                        <el-link type="primary" @click="see">PIC</el-link>
                      </template>
                    </el-table-column>
                    <el-table-column label="合同人数" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column label="合同金额" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column label="合同状态" sortable show-overflow-tooltip prop></el-table-column>
                    <el-table-column label="操作" show-overflow-tooltip>
                      <template slot="header" slot-scope="scope">
                        <el-button type="primary" @click="showContractModel">添加</el-button>
                      </template>
                      <template slot-scope="scope">
                        <el-link type="primary" @click="payment">修改</el-link>
                        <el-link type="success" @click="payment">查看</el-link>
                        <el-link type="error" @click="payment">删除</el-link>
                      </template>
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </el-main>
              <el-footer>
                <mk-page :pager="pager" @query="query" />
              </el-footer>
            </el-container>
          </template>
          <template slot="paneR">
            <el-container>
              <el-main style="padding:0">
                <el-table
                  :data="PackageDataTable"
                  stripe
                  border
                  highlight-current-row
                  height="100%"
                >
                  <el-table-column label="合同套餐" align="center">
                    <el-table-column label="套餐名称" sortable show-overflow-tooltip min-width="100px"></el-table-column>
                    <el-table-column label="套餐类型" sortable show-overflow-tooltip min-width="100px"></el-table-column>
                    <el-table-column label="套餐价格" sortable show-overflow-tooltip min-width="100px"></el-table-column>
                    <el-table-column label="操作" show-overflow-tooltip>
                      <template slot="header" slot-scope="scope">
                        <el-button type="primary">添加</el-button>
                      </template>
                      <template slot-scope="scope">
                        <el-link type="primary" @click="payment">修改</el-link>
                        <el-link type="success" @click="payment">查看</el-link>
                        <el-link type="error" @click="payment">删除</el-link>
                      </template>
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </el-main>
              <el-footer>
                <mk-page :pager="pager" @query="query" />
              </el-footer>
            </el-container>
          </template>
        </SplitPane>
      </template>
    </SplitPane>
    <!-- 新增企业 -->
    <vxe-modal
      v-model="isEnterpriseModel"
      destroy-on-close
      title="新增企业"
      fullscreen
      width="99vw"
      height="99vh"
    >
      <el-container>
        <el-main style="padding: 0;">
          <el-form label-width="auto">
            <el-row :gutter="20">
              <el-col :span="10">
                <el-form-item label="企业名称">
                  <el-input @keyup.enter.native="query" v-model="form.condition" placeholder="企业名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="识别号">
                  <el-input @keyup.enter.native="query" v-model="form.condition" placeholder="识别号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="企业类型">
                  <el-input @keyup.enter.native="query" v-model="form.condition" placeholder="企业类型"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="所在国籍">
                  <el-input @keyup.enter.native="query" v-model="form.condition" placeholder="所在国籍"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label="注册地址">
                  <el-input @keyup.enter.native="query" v-model="form.condition" placeholder="注册地址"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="通讯地址">
                  <el-input @keyup.enter.native="query" v-model="form.condition" placeholder="通讯地址"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="银行帐户">
                  <el-input @keyup.enter.native="query" v-model="form.condition" placeholder="银行帐户"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label="开户银行">
                  <el-input @keyup.enter.native="query" v-model="form.condition" placeholder="开户银行"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="负责人姓名">
                  <el-input
                    @keyup.enter.native="query"
                    v-model="form.condition"
                    placeholder="负责人姓名"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="负责人姓名">
                  <el-input
                    @keyup.enter.native="query"
                    v-model="form.condition"
                    placeholder="负责人姓名"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="负责人电话">
                  <el-input
                    @keyup.enter.native="query"
                    v-model="form.condition"
                    placeholder="负责人电话"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="登录密码">
                  <el-input @keyup.enter.native="query" v-model="form.condition" placeholder="登录密码"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="确认密码">
                  <el-input @keyup.enter.native="query" v-model="form.condition" placeholder="确认密码"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="联系邮箱">
                  <el-input @keyup.enter.native="query" v-model="form.condition" placeholder="联系邮箱"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
        <el-footer style="justify-content: center;">
          <el-button-group>
            <el-button type="primary" @click="(isEnterpriseModel=false)">确定</el-button>
            <el-button type="warning" @click="(isEnterpriseModel=false)">关闭</el-button>
          </el-button-group>
        </el-footer>
      </el-container>
    </vxe-modal>
    <!-- 添加合同 -->
    <vxe-modal
      v-model="ContractModel"
      destroy-on-close
      title="套餐明细"
      fullscreen
      width="80vw"
      height="99vh"
    >
      <el-container>
        <el-main style="padding:0">
           <el-divider content-position="left">企业信息</el-divider>
          <el-row :gutter="20" style="font-size:14px;line-height:2">
            <el-col :span="8">
              <div>企业名称: 上海睦康科技有限公司</div>
            </el-col>
            <el-col :span="8">
              <div>识别号: ASD1234567889</div>
            </el-col>
            <el-col :span="8">
              <div>企业类型: 国企</div>
            </el-col>
            <el-col :span="8">
              <div>所在国籍: 中国</div>
            </el-col>
            <el-col :span="8">
              <div>注册地址: 上海市宝山区走马塘路228</div>
            </el-col>
            <el-col :span="8">
              <div>注册地址: 上海市宝山区走马塘路228</div>
            </el-col>
            <el-col :span="8">
              <div>通讯地址: 上海市宝山区走马塘路228</div>
            </el-col>
            <el-col :span="8">
              <div>银行帐户: 6128 9000 0002 1234</div>
            </el-col>
            <el-col :span="8">
              <div>开户银行: 中国银行</div>
            </el-col>
            <el-col :span="8">
              <div>负责人姓名: 李倩</div>
            </el-col>
            <el-col :span="8">
              <div>负责人电话: 132323111111</div>
            </el-col>
          </el-row>
           <el-divider content-position="left">合同信息</el-divider>
            <el-form label-width="auto">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="合同编号">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同名称">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="有效期">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
               <el-col :span="12">
                <el-form-item label="失效期">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
            <el-divider content-position="left">合同套餐信息</el-divider>
            <el-form label-width="auto">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="套餐编号">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="适应性别">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
               <el-col :span="12">
               <el-form-item label="套餐名称">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="套餐金额">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="有效期">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
               <el-col :span="12">
                <el-form-item label="失效期">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
               <el-col :span="24">
                <el-form-item label="折扣">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
        <el-footer style="justify-content: center;">
          <el-button-group>
            <el-button type="primary" @click="(ContractModel=false)">确定</el-button>
            <el-button type="warning" @click="(ContractModel=false)">关闭</el-button>
          </el-button-group>
        </el-footer>
      </el-container>
    </vxe-modal>
    <!-- 支付 -->
    <vxe-modal
      v-model="DetailPackageModal"
      destroy-on-close
      title="套餐明细"
      fullscreen
      width="50vw"
      height="99vh"
    >
      <el-container>
        <el-main>
          <el-form label-width="auto">
            <el-form-item label="对方帐户号">
              <el-input placeholder></el-input>
            </el-form-item>
            <el-form-item label="对方开户行">
              <el-input placeholder></el-input>
            </el-form-item>
            <el-form-item label="对方识别号">
              <el-input placeholder></el-input>
            </el-form-item>
            <el-form-item label="对方发票号">
              <el-input placeholder></el-input>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="总人数">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="男性人数">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="女性人数">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="套餐A人数">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单价">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="金额">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="套餐B人数">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单价">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="金额">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="合计金额">
              <el-input placeholder></el-input>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="支付日期">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="支付方式">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="回执单号">
                  <el-input placeholder></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="回执单图片">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-main>
        <el-footer style="justify-content: center;">
          <el-button-group>
            <el-button type="primary" @click="(DetailPackageModal=false)">确定</el-button>
            <el-button type="warning" @click="(DetailPackageModal=false)">关闭</el-button>
          </el-button-group>
        </el-footer>
      </el-container>
    </vxe-modal>
  </d2-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      ContractModel: false,
      imageUrl: "",
      srcList: [
        "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
        "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg"
      ],
      yearOptions: [
        {
          value: 2016,
          label: "2016年"
        },
        {
          value: 2017,
          label: "2017年"
        },
        {
          value: 2018,
          label: "2018年"
        },
        {
          value: 2019,
          label: "2019年"
        }
      ],
      statusOptions: [
        {
          value: 1,
          label: "出报告"
        },
        {
          value: 2,
          label: "已预约"
        }
      ],
      pickerOptions2: {
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

      value7: "",
      isEnterpriseModel: false,
      DetailPackageModal: false,
      dataTable: [],
      PackageDataTable: [],
      RightPackageDataTable: [],
      daterange: "",
      pager: {
        condition: "",
        count: 0,
        page: 1,
        rows: 20
      },
      form: {
        condition: ""
      },
      packageForm: {}
    };
  },
  methods: {
    query() {},
    Export() {},
    //查看到检凭证
    addEnterprise() {
      this.isEnterpriseModel = true;
    },
    //修改预约
    payment() {
      this.DetailPackageModal = true;
    },
    //新增合同弹框
    showContractModel() {
      this.ContractModel = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.tab_info {
  font-size: 13px;
  table-layout: fixed;
  color: #606266;
  background-color: #f5f5f5;
}
.tab_info td {
  padding: 2px 4px;
  border: 1px solid #ebeef5;
}

.ui-resizable {
  background-color: #fff;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.row-bg {
  font-size: 15px;
  padding: 10px 0;
}
.rowTitle {
  font-size: 15px;
  color: #333;
  font-weight: 500;
  margin-right: 20px;
  display: inline-block;
}

</style>
