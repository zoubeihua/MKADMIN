<template>
  <d2-container>
      <el-container>
        <el-header>
          <el-form :inline="true">
            <el-form-item label class="custom_label">
              <mk-select
                url="1"
                :globalFn="true"
                :datas="[
                  { bzname: '系统规则 ', bzcode: '0' },
                  { bzname: '人工操作', bzcode: '1' }
                ]"
                clearable
                multiple
                collapse-tags
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
                clearable
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
                clearable
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
             <el-form-item label class="custom_label">
              <mk-select
                url="1"
                :globalFn="true"
                :datas="[
                  { bzname: '启用', bzcode: '1' },
                  { bzname: '停用', bzcode: '0' }
                ]"
                clearable
                multiple
                collapse-tags
                :filter="['bzname', 'filterstr']"
                width="180px"
                label="bzname"
                val="bzcode"
                placeholder="请选择状态"
                v-model="pagerData.status"
                @change="seachTable"
              />
            </el-form-item>
            <el-form-item label>
              <el-input
                v-model="pagerData.memberid"
                placeholder="按会员ID查询"
                @keyup.enter.native="seachTable"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="seachTable">查询</el-button>
                <el-button type="warning" @click="addInit">清空</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
        </el-header>
        <el-main style="padding:0;">
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
              width="100px"
            />
            <el-table-column
              show-overflow-tooltip
              sortable
              label="会员id"
              align="center"
              prop="memberid"
              width="140"
            />
            <el-table-column
              sortable
              show-overflow-tooltip
              label="会员姓名"
              align="center"
              prop="membername"
              width="120"
            >
              <template slot-scope="scope">
                <div>
                  <i
                    :class="['mkfont', scope.row.membersex == 1 ? 'nan' : scope.row.membersex == 2 ? 'nv' : 'weizhi']"
                    :style="{ color: scope.row.membersex == 1 ? '#6DCEFA' : scope.row.membersex == 2 ? '#F37E7D' : '' }"
                  ></i>
                  <span style="min-width:60px;display:inline-block;">{{ scope.row.membername }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip sortable label="出生日期" align="center" width="100">
              <template slot-scope="scope">
                <div>{{ dateFormat(scope.row.birthday) }}</div>
              </template>
            </el-table-column>

            <el-table-column
              show-overflow-tooltip
              sortable
              label="联系电话"
              align="center"
              prop="mobiletel"
              width="100"
              :formatter="
					i => {
						return PhoneFormat(i, 'mobiletel');
					}
				"
            ></el-table-column>
            <!--  -->
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
              width="160"
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
            <el-table-column show-overflow-tooltip align="center" label="状态" prop="status" sortable fixed="right">
              <template slot-scope="scope">
                <el-tag
                  :type="GetOpenAndStoptatusType(scope.row.status)"
                  disable-transitions
                >{{ scope.row.status==1?'启用':'停用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" label-class-name="primary" fixed="right">
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
        <el-footer>
          <mk-page :pager="pagerData" style="	align-self: start;" @query="seachTable" />
        </el-footer>
      </el-container>

  </d2-container>
</template>

<script>
export default {
  name: "BlacklistManagement",
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
        sourceid: "",
        limittype: "",
        limitoperate: "",
        status: ""
      },
      modal: false,
      addModel: false,
      tableData: []
    };
  },
  mounted(){
    this.seachTable()
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
      this.pagerData = {
        memberid: "",
        createid: "",
        condition: "",
        page: 0,
        rows: 10,
        tag: 0,
        count: 0,
        hospitalid: "",
        orderby: "",
        sourceid: "",
        limittype: "",
        limitoperate: "",
        status: ""
      };
      this.seachTable()
    },
    // 日期格式化 传入值如 20200503
    dateFormat(date) {
      if (date) {
        var year = date.substr(0, 4);
        var month = date.substr(4, 2);
        var day = date.substr(6);
        return `${year}-${month}-${day}`;
      }
    },
    async open() {
      this.modal = true;
      this.$refs.modal.maximize();
      this.seachTable();
    },
    close() {
      this.modal = false;
      this.$emit("update:userdata", {});
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
    seachTable() {
      this.pagerData.hospitalid = this.info.hospitalid;
      this.MK.Request(
        "/Publics/MemberManage/MemberInfo/BlackList",
        "get",
        this.pagerData
      ).then(res => {
        if (res.code == 0) {
          this.tableData = res.data;
          this.pagerData.count = res.count;
        }
      });
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
