<template>
  <d2-container>
       <el-container>
       <el-header>
            <el-form :inline="true">
              <el-form-item>
                <el-select v-model="form.year" placeholder="体检年度" style="width:135px;" clearable>
                  <el-option
                    v-for="item in yearOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.year"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="form.year" placeholder="支付状态" style="width:135px;" clearable>
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.year"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="支付日期">
                <el-date-picker
                  style="width:300px"
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
    <SplitPane :min-percent="35" :default-percent="50" split="vertical">
      <template slot="paneL">
        <el-container>
         
          <el-main style="padding: 0;">
            <el-table :data="dataTable" stripe border highlight-current-row height="100%">
              <el-table-column label="账单日期" sortable show-overflow-tooltip prop="zdrq"></el-table-column>
              <el-table-column label="账单内容" sortable show-overflow-tooltip prop="zdnr"></el-table-column>
              <el-table-column label="开票日期" sortable show-overflow-tooltip prop="kprq"></el-table-column>
              <el-table-column label="发票号码" sortable show-overflow-tooltip prop="fphm"></el-table-column>
              <el-table-column label="发票内容" sortable show-overflow-tooltip prop="fpnr"></el-table-column>
              <el-table-column label="支付状态" sortable show-overflow-tooltip prop="zfzt"></el-table-column>
              <el-table-column label="操作" sortable show-overflow-tooltip prop="deptid">
                <template slot-scope="scope">
                  <el-link type="primary" @click="payment">支付</el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </template>
      <template slot="paneR">
        <el-container>
          <el-main style="background-color: #fafafa;">
            <table cellspacing="10" style="width: 100%;" border="1" class="tab_info">
              <tr>
                <td>对方帐户号</td>
                <td>4209610</td>

                <td>对方开户行</td>
                <td>中国银行</td>

                <td>对方识别号</td>
                <td>2333435557</td>
              </tr>
              <tr>
                <td>总人数</td>
                <td>122</td>
                <td>男性人数</td>
                <td>32</td>
                <td>女性人数</td>
                <td>90</td>
              </tr>
              <tr>
                <td>套餐A人数</td>
                <td>122</td>
                <td>单价</td>
                <td>1200</td>
                <td>金额</td>
                <td>9000</td>
              </tr>
              <tr>
                <td>套餐B人数</td>
                <td>122</td>
                <td>单价</td>
                <td>1200</td>
                <td>金额</td>
                <td>9000</td>
              </tr>
              <tr>
                <td>加项金额</td>
                <td colspan="5" align="center">9000</td>
              </tr>
              <tr>
                <td>合计金额</td>
                <td colspan="5" align="center">19000</td>
              </tr>
            </table>
            <el-main style="padding: 0;">
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="14">
                  <div class="rowTitle">账单明细</div>
                  <el-radio >套餐</el-radio>
                  <el-radio >加项目</el-radio>
                </el-col>
                <!-- <el-col :span="6">
                  <div class="grid-content bg-purple-light"></div>
                </el-col>-->
                <el-col :span="10">
                  <el-button type="primary" size="mini">通过</el-button>
                  <el-button type="warning" size="mini">拒绝</el-button>
                  <el-button type="info" size="mini">撤销</el-button>
                </el-col>
              </el-row>
              <el-table :data="PackageDataTable" stripe border highlight-current-row height="100%">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="工号" sortable show-overflow-tooltip prop="no"></el-table-column>
                <el-table-column label="姓名" sortable show-overflow-tooltip prop="name"></el-table-column>
                <el-table-column label="到检凭证" sortable show-overflow-tooltip prop="djpz">
                  <template slot-scope="scope">
                    <el-link type="primary" @click="see">PIC</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="性别" sortable show-overflow-tooltip prop="sex"></el-table-column>
                <el-table-column label="身份证号" sortable show-overflow-tooltip prop="idcardno"></el-table-column>
                <el-table-column label="出生日期" sortable show-overflow-tooltip prop="csrq"></el-table-column>
                <el-table-column label="年龄" sortable show-overflow-tooltip prop="age"></el-table-column>
                <el-table-column label="联系电话" sortable show-overflow-tooltip prop="phone"></el-table-column>
                <el-table-column label="职务" sortable show-overflow-tooltip prop="zw"></el-table-column>
                <el-table-column label="已选套餐" sortable show-overflow-tooltip prop="tc"></el-table-column>
                <el-table-column label="套餐金额" sortable show-overflow-tooltip prop="tcje"></el-table-column>
                <el-table-column label="体检增加项" sortable show-overflow-tooltip prop="zjx"></el-table-column>
                <el-table-column label="加项金额" sortable show-overflow-tooltip prop="jxje"></el-table-column>
                <el-table-column label="预约日期" sortable show-overflow-tooltip prop="yyrq"></el-table-column>
                <el-table-column label="体检状态" sortable show-overflow-tooltip prop="tjzt"></el-table-column>
              </el-table>
            </el-main>
          </el-main>
        </el-container>
      </template>
    </SplitPane>
    <!-- 到检凭证 -->
    <vxe-modal
      v-model="isSeeModel"
      destroy-on-close
      title="到检凭证"
      fullscreen
      width="50vw"
      height="50vh"
    >
      <el-container>
        <el-main style="padding: 0;">
          <el-image
            v-for="item in srcList"
            :key="item"
            style="width:300px; height: 300px;margin:20px"
            :src="item"
            :preview-src-list="srcList"
          ></el-image>
        </el-main>
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
     </el-container>
  </d2-container>
</template>

<script>
import RangeInput from "@/components/mk-form/mk-range-input/index.vue";
export default {
  components: {
    RangeInput
  },
  data() {
    return {
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
      isSeeModel: false,
      DetailPackageModal: false,
      dataTable: [
        {
          zdrq: "2020-09-09",
          zdnr: "员工体检",
          kprq: "2020-09-28",
          fphm: "2526576688110000",
          fpnr: "",
          zfzt: "已完成"
        }
      ],
      PackageDataTable: [
        {
          no: "001",
          name: "王某",
          djpz: "PIC",
          sex: "男",
          idcardno: "378900099999090987666",
          csrq: "2020-09-09",
          age: "23",
          phone: "13267543456",
          zw: "前端",
          tc: "男性（30以上）",
          tcje: "1200.00",
          zjx: "",
          jxje: "0",
          yyrq: "2020-10-09",
          tjzt: "已体检"
        },
        {
          no: "001",
          name: "王某",
          djpz: "PIC",
          sex: "男",
          idcardno: "378900099999090987666",
          csrq: "2020-09-09",
          age: "23",
          phone: "13267543456",
          zw: "前端",
          tc: "男性（30以上）",
          tcje: "1200.00",
          zjx: "",
          jxje: "0",
          yyrq: "2020-10-09",
          tjzt: "已体检"
        },
        {
          no: "001",
          name: "王某",
          djpz: "PIC",
          sex: "男",
          idcardno: "378900099999090987666",
          csrq: "2020-09-09",
          age: "23",
          phone: "13267543456",
          zw: "前端",
          tc: "男性（30以上）",
          tcje: "1200.00",
          zjx: "",
          jxje: "0",
          yyrq: "2020-10-09",
          tjzt: "已体检"
        },
        {
          no: "001",
          name: "王某",
          djpz: "PIC",
          sex: "男",
          idcardno: "378900099999090987666",
          csrq: "2020-09-09",
          age: "23",
          phone: "13267543456",
          zw: "前端",
          tc: "男性（30以上）",
          tcje: "1200.00",
          zjx: "",
          jxje: "0",
          yyrq: "2020-10-09",
          tjzt: "已体检"
        }
      ],
      RightPackageDataTable: [],
      daterange: "",
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
        year: ""
      },
      packageForm: {}
    };
  },
  methods: {
    query() {},
    Export() {},
    //查看到检凭证
    see() {
      this.isSeeModel = true;
    },
    //修改预约
    payment() {
      this.DetailPackageModal = true;
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
.rowTitle{
    font-size: 15px;
    color: #333;
    font-weight: 500;
    margin-right: 20px;
    display: inline-block;
}
</style>
