<template>
  <d2-container>
    <el-container>
      <!-- ------头部------ -->
      <el-header>
        <el-form :inline="true">
          <el-form-item>
            <mk-select
              multiple
              collapse-tags
              v-model="seacherFrom.jzlx"
              placeholder="请选择就诊类型"
              :datas="getDicStandarDcode('就诊分类')"
              :filter="['bzname', 'bzname']"
              label="bzname"
              val="bzcode"
              @change="MemberVisitPogram_Get"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <mk-select
              multiple
              collapse-tags
              placeholder="请选择疾病类型"
              url="/Publics/VisitPogramMaintain/visitadaptdiseaseList_Get"
              :param="{ condition: '' }"
              :filter="['diseasename']"
              label="diseasename"
              val="diseasecode"
              v-model="seacherFrom.diagnosis"
              @change="MemberVisitPogram_Get"
            ></mk-select>
          </el-form-item>
          <el-form-item>
            <mk-select
              style="width:180px"
              v-model="seacherFrom.memberlevel"
              multiple
              collapse-tags
              url="/Publics/MemberManage/Memberlevel"
              placeholder="请选择会员等级"
              :filter="['name']"
              label="name"
              val="levelid"
              @change="MemberVisitPogram_Get"
            />
          </el-form-item>
          <el-form-item>
            <mk-select
              v-model="seacherFrom.sourcemode"
              placeholder="请选择患者来源"
              :datas="getDicStandarDcode('随访患者来源')"
              :filter="['bzname', 'bzname']"
              label="bzname"
              val="bzcode"
              @change="MemberVisitPogram_Get"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              clearable
              v-model="seacherFrom.condition"
              placeholder="按会员卡号、手机号、姓名查找"
              @keyup.enter.native="MemberVisitPogram_Get"
             style="width:250px"
            />
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="MemberVisitPogram_Get"
              >查询</el-button
            >
          </el-form-item>
          <!-- <el-form-item label="">
            <el-button @click="showAddSingle">添加</el-button>
          </el-form-item> -->
          <el-form-item label="">
            <el-button @click="showAddBtach">批量添加</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <!-- ------主体-------- -->
      <el-main style="padding:0;">
        <el-container>
          <el-table
            :data="memberList"
            highlight-current-row
            border
            height="100%"
            @row-click="MemberVisitProgramAndVisitEventTask_Get"
            header-row-class-name="headerClass"
          >
            <el-table-column
              show-overflow-tooltip
              sortable
              label="会员卡号"
              align="center"
              prop="cardno"
              width="160"
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
                    :class="[
                      'mkfont',
                      scope.row.sex == 1
                        ? 'nan'
                        : scope.row.sex == 2
                        ? 'nv'
                        : 'weizhi'
                    ]"
                    :style="{
                      color:
                        scope.row.sex == 1
                          ? '#6DCEFA'
                          : scope.row.sex == 2
                          ? '#F37E7D'
                          : ''
                    }"
                  ></i>
                  <span style="min-width:60px;display:inline-block;">{{
                    scope.row.membername
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              sortable
              align="center"
              label="年龄"
              width="100"
              prop="age"
            />

            <el-table-column
              show-overflow-tooltip
              align="center"
              label="等级"
              width="80"
              sortable
              :sort-method="rowSort"
            >
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.memberlevel_display"
                  placement="right"
                >
                  <i
                    :class="[
                      'mkfont',
                      scope.row.icon ? scope.row.icon.split(',')[0] : ''
                    ]"
                    :style="{
                      color: scope.row.icon ? scope.row.icon.split(',')[1] : '',
                      fontSize: 28 + 'px'
                    }"
                  ></i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              sortable
              label="联系电话"
              align="center"
              prop="mobiletel"
              width="160"
              :formatter="(i=>{return PhoneFormat(i,'mobiletel')})"
            />
            <el-table-column label="完成率" align="center" fixed="right">
              <template slot-scope="scope">
                <el-progress
                  type="circle"
                  :stroke-width="4"
                  :width="40"
                  :percentage="visitrate(scope.row.visitrate)"
                ></el-progress>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" fixed="right">
              <template slot-scope="scope">
                <el-tag :type="GetvalidStatusType(scope.row.status)">{{
                  scope.row.status == 0 ? "停用" : "正常"
                }}</el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column
                  label="健康管理方案"
                  prop="visitname"
                ></el-table-column> -->
            <el-table-column
              label="随访方案"
              prop="visitname"
              width="200px"
            ></el-table-column>

            <el-table-column
              show-overflow-tooltip
              sortable
              label="开始日期"
              align="center"
              width="140"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.plantime }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="随访人"
              prop="planusername"
              width="100px"
              align="center"
            ></el-table-column>

            <el-table-column
              label="操作"
              align="center"
              label-class-name="primary"
              fixed="right"
            >
              <template slot-scope="scope">
                <div class="tableBtn">
                  <el-link
                    :title="scope.row.status != 1 ? '启用' : '停用'"
                    @click="
                      Examine(
                        scope.row,
                        '/Publics/MemberVisitProgram/MemberVisitProgram_StopAndOpen',
                        '停用',
                        '启用',
                        MemberVisitPogram_Get
                      )
                    "
                    :underline="false"
                    :type="scope.row.status != 1 ? 'primary' : 'danger'"
                    :icon="
                      scope.row.status != 1
                        ? 'mkfont qiyong'
                        : 'mkfont tingyong_line'
                    "
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                  ></el-link>
                  <el-link
                    title="编辑"
                    @click="VisitProgram_Edit(scope.row, scope.$index)"
                    :underline="false"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                    type="primary"
                    icon="mkfont bianji1"
                  ></el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-container>
      </el-main>
      <el-footer>
        <mk-page :pager="pager" @query="MemberVisitPogram_Get" />
      </el-footer>
      <!-- 查看随访事件 -->
      <vxe-modal
        v-model="isVisitSthModel"
        :showFooter="true"
        width="50vw"
        height="85vh"
        @close="VisitSthClose"
      >
        <div slot="title">
          随访事件 - [
          <span style="color:red;"
            >会员等级 ： {{ rowdata.memberlevel_display }} 会员卡号：{{
              rowdata.memberno
            }}
            会员姓名：{{ rowdata.membername }} 性别：{{
              rowdata.sex_dispalay
            }}
            年龄：{{ rowdata.age }}</span
          >
          ]
        </div>
        <fllowUpEventPage
          :datas="planSthItem"
          ref="fllowUpEventPage"
          :disabled="true"
        />
        <!--  -->
        <div slot="footer" style="text-align:center;">
          <el-button-group>
            <el-button @click="VisitSthClose">确定</el-button>
          </el-button-group>
        </div>
      </vxe-modal>
      <!-- 单个编辑 -->
      <vxe-modal
        v-model="isAddSingleModel"
        :showFooter="true"
        width="95vw"
        height="95vh"
        @close="CloseAddSingle"
      >
        <div slot="title">
          随访计划 - [
          <span style="color:red;"
            >会员等级 ： {{ rowdata.memberlevel_display }} 会员卡号：{{
              rowdata.memberno
            }}
            会员姓名：{{ rowdata.membername }} 性别：{{
              rowdata.sex_dispalay
            }}
            年龄：{{ rowdata.age }}</span
          >
          ]
        </div>
        <addPlan
          :dataform="dataform"
          :lstvisitprogramid="lstvisitprogramid"
          ref="addPlanSingle"
          :disabled="true"
          v-if="isAddSingleModel"
        />
        <div slot="footer" style="text-align:center;">
          <el-button-group>
            <el-button type="primary" @click="MemberBathSingleVisitProgram_Post"
              >提交</el-button
            >
            <el-button @click="CloseAddSingle">取消</el-button>
          </el-button-group>
        </div>
      </vxe-modal>
      <!-- --------批量添加---------- -->
      <vxe-modal
        v-model="isAddBtachModel"
        :showFooter="true"
        title="添加随访计划"
        width="95vw"
        height="95vh"
        @close="CloseAddBtach"
      >
        <SplitPane :min-percent="20" :default-percent="30" split="vertical">
          <template slot="paneL" v-if="isAddBtachModel">
            <el-container>
              <el-header>
                <el-form label-width="80px" style="width:100%;">
                  <el-form-item label="就诊类型">
                    <mk-select
                      multiple
                      collapse-tags
                      placeholder="请选择就诊类型"
                      :datas="getDicStandarDcode('就诊分类')"
                      :filter="['bzname', 'bzname']"
                      label="bzname"
                      val="bzcode"
                      v-model="selectFrom.jzlx"
                      @change="MemberVisitList_Get"
                    ></mk-select>
                  </el-form-item>
                  <el-form-item label="识别号">
                    <el-input
                      v-model="selectFrom.condition"
                      placeholder="按卡号、证件号码、手机号、姓名查询"
                      @keyup.enter.native="MemberVisitList_Get"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="就诊日期">
                    <el-date-picker
                      style="width:100%;"
                      @change="dateRangeChange"
                      v-model="selectFrom.jzrq"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="临床诊断">
                    <mk-select
                      multiple
                      collapse-tags
                      placeholder="请选择临床诊断类型"
                      url="/Publics/VisitPogramMaintain/visitadaptdiseaseList_Get"
                      :param="{ condition: '' }"
                      :filter="['diseasename']"
                      label="diseasename"
                      val="diseasecode"
                      v-model="selectFrom.diagnosis"
                      @change="MemberVisitList_Get"
                    ></mk-select>
                  </el-form-item>
                  <el-form-item label="会员等级">
                    <mk-select
                      style="width:calc(100% - 130px);"
                      v-model="selectFrom.memberlevel"
                      multiple
                      collapse-tags
                      url="/Publics/MemberManage/Memberlevel"
                      placeholder="请选择会员等级"
                      :filter="['name']"
                      label="name"
                      val="levelid"
                      @change="MemberVisitList_Get"
                    />
                    <span class="fromItemSpan">已有方案</span>
                    <el-switch
                      v-model="selectFrom.haveVisitProgram"
                      active-color="#13ce66"
                      :active-value="2"
                      :inactive-value="1"
                      @change="MemberVisitList_Get"
                    >
                    </el-switch>
                  </el-form-item>
                </el-form>
              </el-header>
              <el-main style="padding:0;">
                <el-table
                  :data="BtachMemberList"
                  border
                  highlight-current-row
                  height="100%"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" width="55" fixed="left">
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    sortable
                    label="会员卡号"
                    
                    prop="cardno"
                    width="160"
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
                          :class="[
                            'mkfont',
                            scope.row.sex == 1
                              ? 'nan'
                              : scope.row.sex == 2
                              ? 'nv'
                              : 'weizhi'
                          ]"
                          :style="{
                            color:
                              scope.row.sex == 1
                                ? '#6DCEFA'
                                : scope.row.sex == 2
                                ? '#F37E7D'
                                : ''
                          }"
                        ></i>
                        <span style="min-width:60px;display:inline-block;">{{
                          scope.row.membername
                        }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    align="center"
                    label="就诊类型"
                    width="200"
                    prop="jzlxname"
                  />
                  <el-table-column
                    show-overflow-tooltip
                    align="center"
                    label="就诊日期"
                    width="180"
                    prop="jzrq"
                  />
                  <el-table-column
                    show-overflow-tooltip
                    sortable
                    align="center"
                    label="年龄"
                    width="100"
                    prop="age"
                  />

                  <el-table-column
                    show-overflow-tooltip
                    align="center"
                    label="等级"
                    width="80"
                    sortable
                    :sort-method="rowSort"
                  >
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.memberlevel_display"
                        placement="right"
                      >
                        <i
                          :class="[
                            'mkfont',
                            scope.row.icon ? scope.row.icon.split(',')[0] : ''
                          ]"
                          :style="{
                            color: scope.row.icon
                              ? scope.row.icon.split(',')[1]
                              : '',
                            fontSize: 28 + 'px'
                          }"
                        ></i>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    sortable
                    label="联系电话"
                    align="center"
                    prop="mobiletel"
                    width="160"
                    :formatter="(i=>{return PhoneFormat(i,'mobiletel')})"
                  />
                  <el-table-column
                    show-overflow-tooltip
                    sortable
                    label="已有方案"
                    align="center"
                    prop="visitnamelist"
                    width="160"
                  />
                </el-table>
              </el-main>
            </el-container>
          </template>
          <template slot="paneR" v-if="isAddBtachModel">
            <el-container>
              <addPlan
                :lstvisitprogramid="lstvisitprogramid"
                @submit="getPalnList"
                ref="addPlan"
              />
            </el-container>
          </template>
        </SplitPane>
        <div slot="footer" style="text-align:center;">
          <el-button-group>
            <el-button type="primary" @click="MemberBathVisitProgram_Post"
              >提交</el-button
            >
            <el-button @click="CloseAddBtach">取消</el-button>
          </el-button-group>
        </div>
      </vxe-modal>
      <!-- end -->
    </el-container>
  </d2-container>
</template>
<script>
import addPlan from "./components/addPlan";
import fllowUpEventPage from "./components/fllowUpEventPage";
import dayjs from "dayjs";
export default {
  components: { addPlan, fllowUpEventPage },
  data() {
    return {
      rowdata: [],
      planSthItem: {},
      isVisitSthModel: false,
      memberList: [],
      VisitEventList: [],
      BtachMemberList: [], //用户列表
      memberListSelection: [], //选中的用户
      lstvisitprogramid: [], //方案列表
      dataform: {},
      seacherFrom: {
        jzlx: [],
        memberlevel: [],
        jblx: "",
        sourcemode: "",
        condition: "",
        hospitalid: 1,
        orderby: "",
        diagnosis: []
      },
      pager: {
        page: 1,
        rows: 20,
        count: 0
      },
      isAddSingleModel: false, //单个添加
      isAddBtachModel: false, //批量添加
      selectFrom: {
        jzlx: ["0"], //就诊类型
        condition: "",
        jzBeginDate: "",
        jzEndDate: "",
        jzrq: "", //日期
        diagnosis: [],
        memberlevel: [],
        haveVisitProgram: 1,
        hospitalid: 1
      },
      planDetail: {},
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
      }
    };
  },
  created() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    this.selectFrom.jzBeginDate = start;
    this.selectFrom.jzEndDate = end;
    this.selectFrom.jzrq = [start, end];
    //计划列表
    this.MemberVisitPogram_Get();
    //查找
    this.MemberVisitList_Get();
  },
  methods: {
    visitrate(val) {
      let curVal = parseFloat(val);
      return Math.ceil(curVal * 100);
    },
    lasttimeFormatter(row) {
      return row.lasttime + "" + row.lasttimeunitdisplay;
    },
    MemberVisitPogram_Get() {
      this.MK.Request(
        "/Publics/MemberVisitProgram/MemberVisitPogram_Get",
        "get",
        { ...this.seacherFrom, ...this.pager }
      ).then(res => {
        if (res.code == 0) {
          this.memberList = res.data;
          this.pager.count=res.count;
          this.VisitEventList = [];
        }
      });
    },
    MemberVisitProgramAndVisitEventTask_Get(row) {
      let data = {
        visitprogramid: row.visitprogramid,
        memberid: row.memberid
      };
      this.MK.Request(
        "/Publics/MemberVisitProgram/MemberVisitProgramAndVisitEventTask_Get",
        "get",
        data
      ).then(res => {
        if (res.code == 0) {
          this.VisitEventList = res.data.lsteventtask;
        }
      });
    },
    //用户--查找
    MemberVisitList_Get() {
      let data = { ...this.selectFrom };
      this.MK.Request(
        "/Publics/MemberVisitProgram/MemberVisitList_Get",
        "get",
        data
      ).then(res => {
        if (res.code == 0) {
          this.BtachMemberList = res.data;
          this.lstvisitprogramid = res.lstvisitprogramid;
        }
      });
    },
    // 表格行排序
    rowSort(a, b) {
      let sort1 = a.memberlevel;
      let sort2 = b.memberlevel;
      return sort1 - sort2;
    },
    //时间范围更改事件 重新查询列表
    dateRangeChange(val) {
      if (val == null) {
        this.selectFrom.jzBeginDate = "";
        this.selectFrom.jzEndDate = "";
      } else {
        this.selectFrom.jzBeginDate = val[0];
        this.selectFrom.jzEndDate = val[1];
      }
      this.MemberVisitList_Get();
    },
    //获取多选会员
    handleSelectionChange(val) {
      this.memberListSelection = val;
    },
    // 单个添加
    showAddSingle() {
      this.isAddSingleModel = true;
    },
    CloseAddSingle() {
      this.isAddSingleModel = false;
    },
    // 批量添加
    showAddBtach() {
      this.rowdata = [];
      this.isAddBtachModel = true;
    },
    CloseAddBtach() {
      this.isAddBtachModel = false;
    },
    getPalnList(list) {},
    getJzrq(dateStr, dayCount) {
      /**
       * [dateAddDays 从某个日期增加n天后的日期]
       * @param  {[string]} dateStr  [日期字符串]
       * @param  {[int]} dayCount [增加的天数]
       * @return {[string]}[增加n天后的日期字符串]
       */
      var tempDate = new Date(dateStr.replace(/-/g, "/")); //把日期字符串转换成日期格式
      var resultDate = new Date((tempDate / 1000 + 86400 * dayCount) * 1000); //增加n天后的日期
      let Hours =
        resultDate.getHours() > 9
          ? resultDate.getHours()
          : "0" + resultDate.getHours();
      let Minutes =
        resultDate.getMinutes() > 9
          ? resultDate.getMinutes()
          : "0" + resultDate.getMinutes();
      let Seconds =
        resultDate.getSeconds() > 9
          ? resultDate.getSeconds()
          : "0" + resultDate.getSeconds();
      var resultDateStr =
        resultDate.getFullYear() +
        "-" +
        (resultDate.getMonth() + 1) +
        "-" +
        resultDate.getDate() +
        " " +
        Hours +
        ":" +
        Minutes +
        ":" +
        Seconds; //将日期转化为字符串格式
      return resultDateStr;
    },
    addPlanSuccess() {
      //表单交验成功
      let data = {
        hospitalid: 1,
        ...this.$refs.addPlan.eventFrom,
        memberList: {},
        lsteventtask: {}
      };

      let list = [];
      for (let i = 0; i < this.memberListSelection.length; i++) {
        if (!data.plantime) {
          list.push({
            memberid: this.memberListSelection[i].memberid,
            jzrq: this.memberListSelection[i].jzrq,
            plantime: this.getJzrq(
              this.memberListSelection[i].jzrq,
              data.jzafterdays
            ),
            jzfl: this.memberListSelection[i].jzlx
          });
        } else {
          list.push({
            memberid: this.memberListSelection[i].memberid,
            jzrq: this.memberListSelection[i].jzrq,
            plantime: data.plantime
          });
        }
      }
      data.operatetype = "C";
      data.memberList = list;
      data.lsteventtask = this.$refs.addPlan.planSthList;
      this.MK.Request(
        "/Publics/MemberVisitProgram/MemberBathVisitProgram_Post",
        "post",
        data
      ).then(res => {
        if (res.code == 0) {
          this.BtachMemberList = res.data;
          this.lstvisitprogramid = res.lstvisitprogramid;
          this.CloseAddBtach();
          this.MemberVisitPogram_Get();
        } else if (res.code == 15) {
          for (let i = 0; i < res.memberVisistCheck.length; i++) {
            setTimeout(() => {
              this.$message({
               message:"[ " +
                  res.memberVisistCheck[i].membername +
                  " ] 已经存在方案 [" +
                  res.memberVisistCheck[i].visitname +
                  " ]",
                   type: 'error',
                   duration:5000
              });
            }, i * 50);
          }
        }
      });
    },
    //单个编辑事件
    MemberBathSingleVisitProgram_Post() {
      this.$refs.addPlanSingle.$refs["eventFrom"].validate(valid => {
        if (valid) {
          //表单交验成功
          let data = {
            hospitalid: 1,
            ...this.$refs.addPlanSingle.eventFrom,
            memberList: [],
            lsteventtask: {}
          };
          data.operatetype = "U";
          data.memberList = [{ memberid: this.dataform.memberid }];
          data.lsteventtask = this.$refs.addPlanSingle.planSthList;
          this.MK.Request(
            "/Publics/MemberVisitProgram/MemberBathVisitProgram_Post",
            "post",
            data
          ).then(res => {
            if (res.code == 0) {
              this.BtachMemberList = res.data;
              // this.lstvisitprogramid = res.lstvisitprogramid;
              this.CloseAddSingle();
              this.MemberVisitPogram_Get();
            }
          });
        } else {
          return false;
        }
      });
    },
    //批量添加事件
    MemberBathVisitProgram_Post() {
      if (this.memberListSelection.length == 0) {
        this.$message.warning("请选择会员!");
        return;
      }
      this.$refs.addPlan.$refs["eventFrom"].validate(valid => {
        if (valid) {
          //表单交验成功
          this.addPlanSuccess();
        } else {
          return false;
        }
      });
    },
    VisitProgram_Edit(row, index) {
      this.rowdata = row;
      let data = {
        visitprogramid: row.visitprogramid,
        memberid: row.memberid
      };
      this.MK.Request(
        "/Publics/MemberVisitProgram/MemberVisitProgramAndVisitEventTask_Get",
        "get",
        data
      ).then(res => {
        if (res.code == 0) {
          this.dataform = res.data;
          this.showAddSingle();
        }
      });
    },
    VisitSthClose() {}
  }
};
</script>
<style lang="scss" scoped>
.el-table thead .headerClass {
  height: 88.88px;
}
.fromItemSpan {
  margin: 0 20px 0px 10px;
}
</style>
