<template>
  <div>
    <vxe-modal
      v-model="modal"
      ref="modal"
      resize
      fullscreen
      width="1480"
      height="920"
      :showFooter="true"
      @close="close"
    >
      <div slot="title">
        会员权益 - [
        <span style="color:red;">
          会员等级：{{ userData.memberlevel_display }} 会员卡号：{{
          userData.cardno
          }}
          会员姓名：{{ userData.membername }} 性别：{{
          userData.sex_dispalay
          }}
          年龄：{{ userData.age }}
        </span>
        ]
      </div>
      <el-container>
        <!-- <el-header>
          <el-form :inline="true">
            <el-form-item label class="custom_label">
              <mk-select
                url="1"
                :globalFn="true"
                multiple
                collapse-tags
                :datas="[
                  { bzname: '系统规则 ', bzcode: '0' },
                  { bzname: '人工操作', bzcode: '1' }
                ]"
                :filter="['bzname', 'filterstr']"
                width="180px"
                label="bzname"
                val="bzcode"
                placeholder="请选择来源类型"
                v-model="pagerData.sourceid"
                @change="seachTable"
              />
            </el-form-item>
            <el-form-item label class="custom_label">
              <mk-select
                url="1"
                :globalFn="true"
                multiple
                collapse-tags
                :datas="[
                  { bzname: '提醒', bzcode: '0' },
                  { bzname: '禁止', bzcode: '1' }
                ]"
                :filter="['bzname', 'filterstr']"
                width="180px"
                label="bzname"
                val="bzcode"
                placeholder="请选择限制类型"
                v-model="pagerData.limittype"
                @change="seachTable"
              />
            </el-form-item>
            <el-form-item label class="custom_label">
              <mk-select
                url="1"
                :globalFn="true"
                multiple
                collapse-tags
                :datas="[
                  { bzname: '线上问诊 ', bzcode: '0' },
                  { bzname: '线上预约', bzcode: '1' },
                  { bzname: '线上挂号', bzcode: '2' },
                  { bzname: '现场挂号', bzcode: '3' },
                  { bzname: '办理入院', bzcode: '4' }
                ]"
                :filter="['bzname', 'filterstr']"
                width="180px"
                label="bzname"
                val="bzcode"
                placeholder="请选择限制操作类型"
                v-model="pagerData.limitoperate"
                @change="seachTable"
              />
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="success" @keyup.enter.native="seachTable">查询</el-button>
               
              </el-button-group>
            </el-form-item>
          </el-form>
        </el-header> -->
        <el-main style="padding:0">
          <el-table
            :data="tableData"
            stripe
            highlight-current-row
            height="100%"
            @sort-change="changeTableSort"
            border
          >
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="信息来源"
              prop="sourceiddesc"
              sortable
              width="100"
            />
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="限制类型"
              prop="limittypedesc"
              sortable
              width="100"
            />
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="限制操作"
              prop="limitoperatedesc"
              sortable
              width="100"
            />
             <el-table-column
              show-overflow-tooltip
              label="备注"
              prop="note"
            />
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="解除日期"
              prop="expiretime"
              sortable
              width="160"
            />
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="操作员"
              prop="createname"
              sortable
              width="120"
            />
            <el-table-column
              show-overflow-tooltip
              align="center"
              label="操作时间"
              prop="createtime"
              sortable
              width="160"
            />
            <el-table-column show-overflow-tooltip align="center" label="状态" prop="status" sortable width="120" fixed="right">
              <template slot-scope="scope">
                <el-tag
                  :type="GetOpenAndStoptatusType(scope.row.status)"
                  disable-transitions
                >{{ scope.row.status==1?'启用':'停用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" label-class-name="primary" fixed="right" width="100">
              <template slot="header">
                 <el-button type="primary" @click="showAddModel">添加</el-button>
              </template>
              <template slot-scope="scope">
                <div class="tableBtn">
                  <el-link
                    title="停用"
                    @click="
                      ExamineStop(scope.row)
                    "
                    :underline="false"
                    type="primary"
                    icon="mkfont tingyong_line"
                    :disabled="scope.row.status == 0"
                  ></el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>

      <div slot="footer" class="footer">
        <mk-page :pager="pagerData" style="	align-self: start;" @query="seachTable" />
        <el-button type="warning" style="	align-self: center;" @click="close">关闭</el-button>
      </div>
    </vxe-modal>
    <!--  -->
    <vxe-modal v-model="addModel" width="680" height="auto" :showFooter="true">
      <div slot="title">
        失信管理 - [
        <span style="color:red;">
          会员等级：{{ userData.memberlevel_display }} 会员卡号：{{
          userData.cardno
          }}
          会员姓名：{{ userData.membername }} 性别：{{
          userData.sex_dispalay
          }}
          年龄：{{ userData.age }}
        </span>
        ]
      </div>

      <el-form :model="fromData" :rules="fromRules" label-width="100px" ref="fromData">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="限制类型" prop="limittype">
              <mk-select
                v-model="fromData.limittype"
                url="1"
                :globalFn="true"
                :datas="[
                  { bzname: '提醒', bzcode: '0' },
                  { bzname: '禁止', bzcode: '1' }
                ]"
                :filter="['bzname', 'filterstr']"
                width="180px"
                label="bzname"
                val="bzcode"
                placeholder="请选择限制类型"
                @change="getLimitTypedesc"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="限制操作" prop="limitoperate">
              <mk-select
                v-model="fromData.limitoperate"
                url="1"
                :globalFn="true"
                multiple
                collapse-tags
                retureType="1"
                :datas="[
                  { bzname: '线上问诊 ', bzcode: '0' },
                  { bzname: '线上预约', bzcode: '1' },
                  { bzname: '线上挂号', bzcode: '2' },
                  { bzname: '现场挂号', bzcode: '3' },
                  { bzname: '办理入院', bzcode: '4' }
                ]"
                :filter="['bzname', 'filterstr']"
                width="180px"
                label="bzname"
                val="bzcode"
                placeholder="请选择限制操作"
                @change="getLimitoperatedesc"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="到期时间" prop="expiretime">
              <el-date-picker
                v-model="fromData.expiretime"
                value-format="yyyy-MM-dd"
                align="right"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="note">
          <el-input v-model="fromData.note" placeholder type="textarea" :rows="3" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="	text-align: center;">
        <el-button type="primary" @click="addCheck">提交</el-button>
        <el-button type="warning" @click="addClose">关闭</el-button>
      </div>
    </vxe-modal>
  </div>
</template>

<script>
export default {
  name: "memberRights",
  props: {
    userData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pagerData: {
        memberid: "",
        createid: "",
        condition: "",
        page: 0,
        rows: 20,
        tag: 0,
        count: 0,
        hospitalid: "",
        orderby: "",
        sourceid: [],
        limittype: [],
        limitoperate: [],
        status: ""
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
        shortcuts: [
          {
            text: "明天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "一周",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一月",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      limitoperate: [],
      fromData: {
        operatetype: "C",
        limittype: "", //限制类型
        limittypedesc: "",
        limitoperate: [], //限制操作
        limitoperatedesc: "",
        note: "",
        memberid: "",
        expiretime: ""
      },
      fromRules: {
        limittype: [
          { required: true, message: "请选择限制类型", trigger: "change" }
        ],
        expiretime: [
          { required: true, message: "请选择时间", trigger: "change" }
        ],
        limitoperate: [
          { required: true, message: "请选择限制操作", trigger: "change" }
        ],
        note:[
          { required: true, message: "备注不得为空", trigger: "change" }
        ]
      },
      memberBasicinfo: {},
      modal: false,
      addModel: false,
      tableData: [],
      curRights: {
        rows: 20,
        page: 1,
        tag: 0,
        count: 0
      }
    };
  },
  mounted() {
    if (this.modal) {
      this.$nextTick(() => {
        this.seachTable();
      });
    }
  },
  methods: {
    //显示添加页面
    showAddModel() {
      this.addModel = true;
    },
    addClose() {
      this.addModel = false;
      this.addInit();
    },
    //初始化
    addInit() {
      this.fromData = {
        operatetype: "C",
        limittype: "", //限制类型
        limittypedesc: "",
        limitoperate: [], //限制操作
        limitoperatedesc: "",
        note: "",
        memberid: "",
        expiretime: ""
      };
    },

    addCheck() {
      this.$refs["fromData"].validate(valid => {
        if (valid) {
          let data = { ...this.fromData };
          data.memberid = this.userData.memberid;

          for (let i = 0; i < this.limitoperate.length; i++) {
            data.limitoperate = this.limitoperate[i].bzcode;
            data.limitoperatedesc = this.limitoperate[i].bzname;
            //提交
            this.submit(data);
          }
        }
      });
    },
    submit(data) {
      this.MK.Request(
        "/Publics/MemberManage/MemberInfo/Black",
        "post",
        data
      ).then(res => {
        if (res.code == 0) {
          this.addClose();
          this.seachTable();
        }
      });
    },
    //表格排序
    changeTableSort(column) {
      if (!column.order) {
        this.pagerData.order = "";
      } else {
        this.pagerData.order =
          column.prop + " " + column.order.replace(/ending/g, "");
      }
      this.seachTable();
    },
    ExamineStop(row) {
      let data = { ...row };
      data.operatetype = "D";
      this.MK.Request(
        "/Publics/MemberManage/MemberInfo/Black",
        "post",
        data
      ).then(res => {
        if (res.code == 0) {
          this.seachTable();
        }
      });
    },
    async open() {
      this.modal = true;
      this.$refs.modal.maximize();
      this.addInit()
    },
    close() {
      this.modal = false;
      this.$emit("update:userdata", {});
    },
    getLimitoperatedesc(i) {
      this.limitoperate = i;
    },
    getLimitTypedesc(i) {
      console.log(i);
      this.fromData.limittypedesc = i.bzname;
    },
    seachTable() {
      this.pagerData.hospitalid = this.info.hospitalid;
      this.pagerData.memberid = this.userData.memberid;
      this.MK.Request(
        "/Publics/MemberManage/MemberInfo/Black",
        "get",
        this.pagerData
      ).then(res => {
        if (res.code == 0) {
          this.tableData = res.data;
          this.pagerData.count = res.count;
        }
      });
    }
  },
  watch: {
    userData: {
      deep: true,
      handler(val) {
        this.memberBasicinfo = val;
        if (this.modal) {
          this.$nextTick(() => {
            this.seachTable();
          });
        }
      }
    },
    modal(val) {
      if (!val) {
        this.$emit("update:userdata", {});
      }
    }
  }
};
</script>

<style scoped>
.footer {
  display: flex;
  flex-direction: column;
}
</style>
