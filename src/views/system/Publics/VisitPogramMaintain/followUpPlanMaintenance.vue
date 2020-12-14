<template>
  <d2-container>
    <el-container>
      <el-header style="height:40px !important;min-height:40px !important;">
        <el-tabs
          v-model="form.programtype"
          @tab-click="handleClick"
          style="width:100%;"
        >
          <el-tab-pane label="系统方案" name="0"></el-tab-pane>
          <el-tab-pane label="科室方案" name="1"></el-tab-pane>
          <el-tab-pane label="个人方案" name="2"></el-tab-pane>
        </el-tabs>
      </el-header>
      <el-main style="padding:0;">
        <el-container>
          <el-header>
            <el-form :inline="true">
              <el-form-item label="日期">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="daterange"
                  type="daterange"
                  align="right"
                  unlink-panels
                  @change="dateRangeChange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label>
                <el-input
                  style="width:260px;"
                  v-model="form.condition"
                  placeholder="按方案名称、输入码查找"
                  @keyup.enter.native="VisitProgramList_Get"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="VisitProgramList_Get"
                  aria-placeholder="按方案名称、输入码查找"
                  >查询</el-button
                >
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="VisitProgramAdd"
                  >添加</el-button
                >
              </el-form-item>
            </el-form>
          </el-header>
          <el-main style="padding:0 10px 0 10px;">
            <el-table
              :data="programList"
              stripe
              highlight-current-row
              border
              height="100%"
              @current-change="handleCurrentChange"
              :row-class-name="getTabelClass"
            >
              <el-table-column
                label="方案ID"
                sortable
                show-overflow-tooltip
                prop="visitprogramid"
                align="center"
              >
                <template slot-scope="scope">
                  <div class="textLeft">{{ scope.row.visitprogramid }}</div>
                </template>
              </el-table-column>
              <el-table-column
                label="方案名称"
                sortable
                show-overflow-tooltip
                prop="visitname"
                width="130px"
                align="center"
              >
                <template slot-scope="scope">
                  <div class="textLeft">{{ scope.row.visitname }}</div>
                </template>
              </el-table-column>
              <el-table-column
                label="方案描述"
                sortable
                show-overflow-tooltip
                prop="visitprogramnote"
                width="150ox"
                align="center"
              >
                <template slot-scope="scope">
                  <div class="textLeft">{{ scope.row.visitprogramnote }}</div>
                </template>
              </el-table-column>
              <el-table-column
                label="就诊类型"
                sortable
                align="center"
                width="150px"
                prop="sylxdispaly"
              ></el-table-column>
              <el-table-column
                label="适应病种"
                sortable
                show-overflow-tooltip
                prop="sybzdispaly"
              >
                <!-- <template slot-scope="scope">
                  <div class="textLeft">{{ scope.row.sybzdispaly }}</div>
                </template> -->
              </el-table-column>
              <el-table-column
                label="适应等级"
                sortable
                show-overflow-tooltip
                prop="sydjdispaly"
              >
                <!-- <template slot-scope="scope">
                  <div class="textLeft">{{ scope.row.sydjdispaly }}</div>
                </template> -->
							</el-table-column>
							<el-table-column label="适应记账" sortable show-overflow-tooltip prop="syjzdispaly">
							</el-table-column>
							<el-table-column label="状态" sortable prop="statusdisplay" align="center" width="80px">
								<template slot-scope="scope">
									<el-tag :type="GetvalidStatusType(scope.row.status)" disable-transitions>{{ scope.row.statusdisplay }}</el-tag>
								</template>
							</el-table-column>
							<el-table-column label="创建时间" sortable show-overflow-tooltip prop="createtime" width="140px" align="center"></el-table-column>
							<el-table-column label="创建人" sortable show-overflow-tooltip prop="createname" align="center"></el-table-column>
							<el-table-column label="操作" width="250px" align="center" show-overflow-tooltip prop="cardno">
								<template slot="header">
									<span class="primary">操作</span>
								</template>
								<template slot-scope="scope">
									<div class="tableBtn">
										<el-link :title="scope.row.status != 1 ? '启用' : '停用'" @click="
                        Examine(
                          scope.row,
                          '/Publics/VisitPogramMaintain/VisitProgram_StopAndOpen',
                          '停用',
                          '启用',
                          VisitProgramList_Get
                        )
                      "
										 :underline="false" :type="scope.row.status != 1 ? 'primary' : 'danger'" :icon="
                        scope.row.status != 1
                          ? 'mkfont qiyong'
                          : 'mkfont tingyong_line'
                      "
										 :disabled="
                        scope.row.status == 3 || scope.row.status == 99
                      "></el-link>
										<el-link title="编辑" @click="
                        VisitProgram_Edit(scope.row, 'plan', scope.$index)
                      "
										 :underline="false" :disabled="
                        scope.row.status == 3 || scope.row.status == 99
                      "
										 type="primary" icon="mkfont bianji1"></el-link>
										<el-link title="复制" @click="
                        Copy(
                          scope.row,
                          '/Publics/VisitPogramMaintain/VisitProgram_Copy',
                          '新的方案名称',
                          'visitname',
                          VisitProgramList_Get
                        )
                      "
										 :underline="false" :disabled="
                        scope.row.status == 3 || scope.row.status == 99
                      "
										 type="primary" icon="el-icon-document-copy"></el-link>
										<!-- <el-link
                      title="删除"
                      @click="
                        Examine(
                          scope.row,
                          '/Publics/VisitPogramMaintain/VisitProgram_StopAndOpen',
                          '删除',
                          '删除',
                          VisitProgramList_Get,
                          'D'
                        )
                      "
                      :underline="false"
                      type="danger"
                      :disabled="
                        scope.row.status == 3 || scope.row.status == 99
                      "
                      icon="mkfont trasch"
                    ></el-link> -->
										<el-link title="上移" @click="
                        MoveUp(
                          scope.$index,
                          scope.row,
                          programList,
                          'visitprogramid',
                          'orderno',
                          VisitProgramList_Get,
                          '/Publics/VisitPogramMaintain/VisitProgram_UpAndDown'
                        )
                      "
										 :underline="false" type="primary" :disabled="
                        scope.row.status == 3 || scope.row.status == 99
                      "
										 icon="mkfont shangyi"></el-link>
										<el-link title="下移" @click="
                        MoveDow(
                          scope.$index,
                          scope.row,
                          programList,
                          'visitprogramid',
                          'orderno',
                          VisitProgramList_Get,
                          '/Publics/VisitPogramMaintain/VisitProgram_UpAndDown'
                        )
                      "
										 :underline="false" type="primary" :disabled="
                        scope.row.status == 3 || scope.row.status == 99
                      "
										 icon="mkfont xiayi"></el-link>
										<el-link title="查看" :underline="false" @click="
                        VisitProgram_Edit(scope.row, 'plan', scope.$index, true)
                      "
                      type="primary"
                      icon="el-icon-view"
                    ></el-link>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <mk-page :pager="pager" @query="VisitProgramList_Get" />
          </el-footer>
        </el-container>
      </el-main>
      <!-- --------------- 添加随访计划------------------------- -->
      <vxe-modal
        v-model="isFollowPlanModal"
        :showFooter="true"
        title="随访计划"
        width="99vw"
        height="99vh"
        @close="colseModel"
      >
        <el-container>
          <el-header>
            <el-row>
              <el-form
                label-width="80px"
                :model="addFrom"
                :rules="addFromRules"
                ref="addFrom"
                :disabled="planedit"
              >
                <el-col :span="24">
                  <el-form-item label="方案名称" prop="visitname">
                    <el-input
                      placeholder="请输入方案名称"
                      v-model="addFrom.visitname"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <!-- prop="visitprogramnote" -->
                  <el-form-item label="方案描述" >
                    <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="请输入方案描述"
                      v-model="addFrom.visitprogramnote"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form :inline="true" label-width="80px">
                    <el-form-item label="适应类型">
                      <mk-select
                        multiple
                        collapse-tags
                        style="width:180px;"
                        placeholder="请选择就诊类型"
                        :datas="getDicStandarDcode('就诊分类')"
                        :filter="['bzname', 'bzname']"
                        label="bzname"
                        val="bzcode"
                        v-model="lstapt.jzfl"
                        retureType="1"
                        @change="getjzfl"
                        :disabled="planedit"
                      ></mk-select>
                    </el-form-item>
                    <el-form-item label="适应病种">
                      <mk-select
                        multiple
                        collapse-tags
                        style="width:180px;"
                        v-model="lstapt.sybz"
                        url="/Publics/VisitPogramMaintain/visitadaptdiseaseList_Get"
                        :param="{ condition: '' }"
                        placeholder="请选择适应病种"
                        :filter="['diseasename']"
                        label="diseasename"
                        val="diseasecode"
                        retureType="1"
                        @change="getsybz"
                        :disabled="planedit"
                      />
                    </el-form-item>
                    <el-form-item label="适应记账">
                      <mk-select
                        multiple
                        collapse-tags
                        style="width:190px;"
                        v-model="lstapt.syjz"
                        url="/Publics/Common/Dic/MemberBilling"
                        placeholder="请选择记账类型"
                        :filter="['billingname']"
                        label="billingname"
                        val="billingcode"
                        retureType="1"
                        @change="getsyjz"
                        :disabled="planedit"
                      />
                    </el-form-item>
                    <el-form-item label="适应等级">
                      <mk-select
                        style="width:180px;"
                        v-model="lstapt.memberlevel"
                        multiple
                        collapse-tags
                        url="/Publics/MemberManage/Memberlevel"
                        placeholder="请选择会员等级"
                        :filter="['name']"
                        label="name"
                        val="levelid"
                        retureType="1"
                        @change="getmemberlevel"
                        :disabled="planedit"
                      />
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-form>
            </el-row>
          </el-header>
          <!-- 随访事件 -->
          <el-main style="padding:0;">
            <el-table
              border
              highlight-current-row
              :data="planSthList"
              show-overflow-tooltip
              height="100%"
              :key="Math.random()"
            >
              <el-table-column
                label="随访事件"
                align="center"
                prop="visiteventname"
                width="200"
              ></el-table-column>
              <el-table-column label="随访时间" align="center">
                <el-table-column label="间隔" prop="interval" width="70">
                  <template slot-scope="scope">
                    {{ scope.row.lasttime + scope.row.lasttimeunitdisplay }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="提前"
                  prop="inadvancedispaly"
                  width="70"
                ></el-table-column>
                <el-table-column
                  label="周期循环"
                  prop="cycleamount"
                  width="100"
                >
                  <template slot-scope="scope">
                    {{ scope.row.cycledispaly }}
                    <span v-if="scope.row.cycleamount > 1" class="primary">{{
                      "【" + scope.row.cycleamount + "次】"
                    }}</span>
									</template>
								</el-table-column>
							</el-table-column>
							<el-table-column label="随访任务" align="center">
								<el-table-column label="用药提醒" prop="medicalremind" width="200"></el-table-column>
								<el-table-column label="复诊通知" prop="referralremind" width="200"></el-table-column>
								<el-table-column label="健康宣教" prop="healthmissiontitle" width="200"></el-table-column>
								<el-table-column label="患者问卷" prop="questionnaire_name" width="200"></el-table-column>
								<el-table-column label="医生表单" prop="doctorform_name" width="200"></el-table-column>
							</el-table-column>
							<el-table-column label="状态" sortable show-overflow-tooltip prop="statusdisplay">
								<template slot-scope="scope">
									<el-tag :type="GetvalidStatusType(scope.row.status)" disable-transitions>{{ scope.row.statusdisplay }}</el-tag>
								</template>
							</el-table-column>
							<el-table-column label align="center" width="200">
								<template #header>
									<el-button-group>
										<el-button @click="VisitSthAdd" type="primary" :disabled="planedit">添加</el-button>
									</el-button-group>
								</template>
								<template slot-scope="scope">
									<div class="tableBtn">
										<el-link :title="scope.row.status != 1 ? '启用' : '停用'" @click="sthExamine(scope.$index)" :underline="false"
										 type="primary" :icon="
                        scope.row.status != 1
                          ? 'mkfont qiyong'
                          : 'mkfont tingyong_line'
                      "
										 :disabled="
                        scope.row.status == 3 ||
                          scope.row.status == 99 ||
                          planedit
                      "></el-link>
										<el-link title="编辑" @click="VisitProgram_Edit(scope.row, 'sth', scope.$index)" :underline="false" :disabled="
                        scope.row.status == 3 ||
                          scope.row.status == 99 ||
                          planedit
                      "
										 type="primary" icon="mkfont bianji1"></el-link>
										<!-- ------暂时不要删除------ -->
										<el-link title="删除" @click="sthDelte(scope.$index)" :underline="false" type="danger" :disabled="
                        scope.row.status == 3 ||
                          scope.row.status == 99 ||
                          planedit
                      "
										 icon="mkfont trasch"></el-link>
										<el-link title="上移" @click="sthMoveUp(scope.$index)" :underline="false" type="primary" :disabled="
                        scope.row.status == 3 ||
                          scope.row.status == 99 ||
                          planedit
                      "
										 icon="mkfont shangyi"></el-link>
										<el-link title="下移" @click="sthMoveDow(scope.$index)" :underline="false" type="primary" :disabled="
                        scope.row.status == 3 ||
                          scope.row.status == 99 ||
                          planedit
                      "
										 icon="mkfont xiayi"></el-link>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</el-main>
				</el-container>
				<div slot="footer" style="text-align:center;">
					<el-button-group>
						<el-button type="primary" @click="submitAddForm" :disabled="planedit">提交</el-button>
						<el-button @click="colseModel">取消</el-button>
					</el-button-group>
				</div>
			</vxe-modal>
			<!-- -------- 添加随访事件------------- -->
			<vxe-modal v-model="isVisitSthModel" :showFooter="true" title="随访事件" width="50vw" height="auto" @close="VisitSthClose">
				<fllowUpEventPage :datas="planSthItem" v-if="isVisitSthModel" ref="fllowUpEventPage" />
				<!--  -->
				<div slot="footer" style="text-align:center;">
					<el-button-group>
						<el-button type="primary" @click="submitAddSthForm">提交</el-button>
						<el-button @click="VisitSthClose">取消</el-button>
					</el-button-group>
				</div>
			</vxe-modal>
		</el-container>
	</d2-container>
</template>
<script>
	import util from "@/libs/util.js";
	import fllowUpEventPage from "./components/fllowUpEventPage";
	export default {
		name: "followUpPlanMaintenance",
		components: {
			fllowUpEventPage
		},
		data() {
			return {
				daterange: "", //日期范围
				operatetype: "C",
				pickerOptions: {
					shortcuts: [{
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
				programItemType: "C",
				form: {
					programtype: "0",
					createid: "",
					deptid: "",
					createtimeBegin: "",
					createtimeEnd: "",
					condition: "",
					hospitalid: ""
				},
				pager: {
					page: 1,
					rows: 20,
					count: 0
				},
				lstapt: {
					//前台展示的
					memberlevel: [],
					syjz: [],
					sybz: [],
					jzfl: []
				},
				toolLstapt: {
					//后端转换
					memberlevel: [],
					syjz: [],
					sybz: [],
					jzfl: []
				},
				addFrom: {}, //计划 编辑添加数据 在init（）初始了
				programList: [], //计划 列表
				isFollowPlanModal: false, //计划 弹框
				planSthList: [], //事件列表
				isVisitSthModel: false, //事件 弹框
				sthIndex: "", //事件所在列表的index
				planSthItem: {
					visiteventid: -1,
					visitprogramid: undefined,
					visiteventname: "",
					noticeremind: 0,
					noticereminddispaly: "否",
					lasttime: 0,
					interval: "0天",
					cycleamount: 0,
					cycledispaly: "否",
					inadvance: 1,
					inadvancedispaly: "1天",
					fixedtime: "10:00:00",
					medicalremind: "",
					referralremind: "请按时到医院复诊",
					healthmission: -1,
					healthmissiontitle: "",
					questionnaire: -1,
					questionnaire_name: "",
					doctorform: -1,
					doctorform_name: "",
					lasttimeunit: "1",
					eventtype: "1"
				},
				addFromRules: {
					visitname: [{
						required: true,
						message: "请输入方案名称",
						trigger: "blur"
					}]
				},
				planedit: false, //false方案可编辑 true：只可查看
				tabelRowId: "" //选中的行ID
			};
		},
		watch: {
			"form.programtype": {
				immediate: true,
				handler(val) {
					// 方案所属用户对应的用户ID =>院区方案、科室方案　默认为"-1"
					// 方案所属科室对应的科室ID =>院区方案、个人方案　默认为"-1"
					if (val == 2) {
						this.form.userid = this.info.userid;
					} else {
						this.form.userid = -1;
					}
					if (val == 1) {
						this.form.deptid = this.info.deptid;
					} else {
						this.form.deptid = -1;
					}
				}
			}
		},
		created() {
			this.VisitProgramList_Get();
			this.init();
		},
		methods: {
			init() {
				this.planedit = false;
				this.operatetype = "C"; //新增(C) 编辑(U))
				this.addFrom = {
					//添加随访方案的表单
					visitprogramid: undefined,
					createid: util.cookies.get("uuid"), //当前登陆用户
					programtype: this.form.programtype, //	随访方案类型(取标准字典:随访方案类型) 0：院区方案 1：科室方案 2：个人方案;
					deptid: this.form.deptid, //方案所属科室对应的科室ID 院区方案、个人方案　默认为"-1"
					userid: this.form.userid, //方案所属用户对应的用户ID 院区方案、科室方案　默认为"-1"
					visitname: "", //方案名称
					visitprogramnote: "", //方案描述
					hospitalid: 1,
					lstapt: []
					// orderno:-1
				};
				this.lstapt = {
					//前台展示的
					memberlevel: [],
					syjz: [],
					sybz: [],
					jzfl: []
				};
				this.toolLstapt = {
					//后端转换
					memberlevel: [],
					syjz: [],
					sybz: [],
					jzfl: []
				};
				this.planSthList = [];
				this.lstapt = {
					memberlevel: [],
					syjz: "",
					sybz: "",
					falx: ""
				};
			},
			//事件上移
			sthMoveUp(index) {
				if (index == 0) {
					this.$message.error("已经是第一个了哦");
					return;
				}
				this.planSthList[index] = this.planSthList.splice(
					index - 1,
					1,
					this.planSthList[index]
				)[0];
			},
			//事件下移
			sthMoveDow(index) {
				if (index == this.planSthList.length - 1) {
					this.$message.error("已经是最后一个了哦");
					return;
				}
				this.planSthList[index] = this.planSthList.splice(
					index + 1,
					1,
					this.planSthList[index]
				)[0];
			},
			//事件停用启用
			sthExamine(index) {
				if (this.planSthList[index].status == 0) {
					this.planSthList[index].status = 1;
					this.planSthList[index].statusdisplay = "启用";
				} else {
					this.planSthList[index].status = 0;
					this.planSthList[index].statusdisplay = "停用";
				}
			},
			//事件删除
			sthDelte(index) {
				this.planSthList.splice(index, 1);
			},
			//tab切换 重新查询列表
			handleClick(tab) {
				this.VisitProgramList_Get();
			},
			//时间范围更改事件 重新查询列表
			dateRangeChange(val) {
				if (val == null) {
					(this.form.createtimeBegin = ""), (this.form.createtimeEnd = "");
				} else {
					this.form.createtimeBegin = val[0];
					this.form.createtimeEnd = val[1];
				}
				this.VisitProgramList_Get();
			},
			//查询随访方案列表信息
			VisitProgramList_Get() {
				this.form.hospitalid = this.info.hospitalid;
				this.form.createid = this.info.userid;
				this.MK.Request(
					"/Publics/VisitPogramMaintain/VisitProgramList_Get",
					"get", { ...this.form,
						...this.pager
					}
				).then(res => {
					if (res.code == 0) {
						this.programList = res.data;
						this.pager.count = res.count;
					}
				});
			},
			//编辑
			VisitProgram_Edit(row, type, index, edit) {
				if (type == "plan") {
					this.operatetype = "U";
					this.MK.Request(
						"/Publics/VisitPogramMaintain/VisitProgramAndVisitEventTask_Get",
						"get", {
							visitprogramid: row.visitprogramid
						}
					).then(res => {
						if (res.code == 0) {
							this.getLstapt(res.data.lstapt);
							this.addFrom = res.data;
							this.planSthList = res.data.lsteventtask;
							this.planedit = edit;
							this.VisitProgramAdd();
						}
					});
				} else if (type == "sth") {
					this.programItemType = "U";
					this.planSthItem = row;
					this.sthIndex = index;
					this.VisitSthAdd();
				}
			},

    //sth add
    VisitSthAdd() {
      this.isVisitSthModel = true;
    },
    VisitSthClose() {
      this.isVisitSthModel = false;
      this.programItemType = "C";
      this.initItem();
    },
    initItem() {
      this.planSthItem = {
        visiteventid: -1,
        visitprogramid: undefined,
        visiteventname: "",
        noticeremind: 0,
        noticereminddispaly: "否",
        lasttime: 0,
        interval: "7天",
        cycleamount: 0,
        cycledispaly: "否",
        inadvance: 1,
        inadvancedispaly: "1天",
        fixedtime: "10:00:00",
        medicalremind: "",
        referralremind: "请按时到医院复诊",
        healthmission: -1,
        healthmissiontitle: "",
        questionnaire: -1,
        questionnaire_name: "",
        doctorform: -1,
        doctorform_name: "",
        lasttimeunit: "1",
        eventtype: "1"
      };
    },
    submitAddSthForm() {
      let radioModel = this.$refs.fllowUpEventPage.radioCheck();
      if (radioModel == false) {
        return;
      }
      this.planSthItem = this.$refs.fllowUpEventPage.planSthItem;
      if (this.programItemType == "C") {
        this.planSthItem.status = 1;
        this.planSthItem.statusdisplay = "启用";
        this.planSthList.push(this.planSthItem);
        this.VisitSthClose();
      } else if (this.programItemType == "U") {
        this.planSthList[
          this.sthIndex
        ] = this.$refs.fllowUpEventPage.planSthItem;
        this.VisitSthClose();
      }
    },
    //添加/编辑
    VisitProgramAdd() {
      this.isFollowPlanModal = true;
    },
    //关闭弹窗
    colseModel() {
      this.isFollowPlanModal = false;
      this.init();
    },
    //保存提交随访方案
    submitAddForm() {
      this.addFrom.lstapt = this.splitLstapt(this.toolLstapt);
      this.$refs["addFrom"].validate(valid => {
        if (valid) {
          if (this.planSthList.length == 0) {
            this.$message.error("事件列表不可为空!");
            return;
          } else {
            let length = 0;
            this.planSthList.map(item => {
              if (item.status == 0) {
                length++;
              }
            });
            if (length == this.planSthList.length) {
              this.addFrom.status = 0;
            }
          }
this.addFrom.visitprogramnote=this.addFrom.visitprogramnote||this.addFrom.visitname;
          this.addFrom.operatetype = this.operatetype;
          this.addFrom.lsteventtask = this.planSthList;
          this.addFrom.programtype = this.form.programtype;
          this.MK.Request(
            "/Publics/VisitPogramMaintain/VisitProgram_Post",
            "post",
            { ...this.addFrom }
          ).then(res => {
            if (res.code == 0) {
              this.$message.success("添加成功");
              this.colseModel();
              this.VisitProgramList_Get();
            }
          });
        } else {
          return;
        }
      });
    },
    getjzfl(list) {
      this.toolLstapt.jzfl = list;
    },
    getsyjz(list) {
      this.toolLstapt.syjz = list;
    },
    getsybz(list) {
      this.toolLstapt.sybz = list;
    },
    getmemberlevel(list) {
      this.toolLstapt.memberlevel = list;
    },
    getLstapt(list) {
      this.lstapt = {
        memberlevel: [],
        syjz: [],
        sybz: [],
        jzfl: []
      };
      this.toolLstapt = {
        memberlevel: [],
        syjz: [],
        sybz: [],
        jzfl: []
      };
      for (let i = 0; i < list.length; i++) {
        // --0 适应类型 jzfl
        //  --1 适应病种 sybz
        //  --2 适应等级 memberlevel
        //  --3 适应记账 syjz
        switch (list[i].adaptclass) {
          case 3:
            this.lstapt.syjz.push(list[i].adaptcode);
            this.toolLstapt.syjz.push({
              billingcode: list[i].adaptcode,
              billingname: list[i].adaptname
            });
            break;
          case 1:
            this.lstapt.sybz.push(list[i].adaptcode);
            this.toolLstapt.sybz.push({
              diseasecode: list[i].adaptcode,
              diseasename: list[i].adaptname
            });
            break;
          case 2:
            this.lstapt.memberlevel.push(parseInt(list[i].adaptcode));
            this.toolLstapt.memberlevel.push({
              levelid: list[i].adaptcode,
              name: list[i].adaptname
            });
            break;
          case 0:
            this.lstapt.jzfl.push(list[i].adaptcode);
            this.toolLstapt.jzfl.push({
              bzcode: list[i].adaptcode,
              bzname: list[i].adaptname
            });
            break;
        }
      }
    },
    splitLstapt(list) {
      // --0 适应类型 jzfl
      //  --1 适应病种 sybz
      //  --2 适应等级 memberlevel
      //  --3 适应记账 syjz
      let lst = [];
      // if (list.jzfl.bzcode) {
      //   lst.push({
      //     adaptclass: 0,
      //     adaptcode: list.jzfl.bzcode,
      //     adaptname: list.jzfl.bzname,
      //     visitprogramid: this.addFrom.visitprogramid
      //   });
      // }
      for (let i = 0; i < list.jzfl.length; i++) {
        lst.push({
          adaptclass: 0,
          adaptcode: list.jzfl[i].bzcode,
          adaptname: list.jzfl[i].bzname,
          visitprogramid: this.addFrom.visitprogramid
        });
      }
      for (let i = 0; i < list.syjz.length; i++) {
        lst.push({
          adaptclass: 3,
          adaptcode: list.syjz[i].billingcode,
          adaptname: list.syjz[i].billingname,
          visitprogramid: this.addFrom.visitprogramid
        });
      }
      for (let i = 0; i < list.sybz.length; i++) {
        lst.push({
          adaptclass: 1,
          adaptcode: list.sybz[i].diseasecode,
          adaptname: list.sybz[i].diseasename,
          visitprogramid: this.addFrom.visitprogramid
        });
      }
      for (let i = 0; i < list.memberlevel.length; i++) {
        lst.push({
          adaptclass: 2,
          adaptcode: list.memberlevel[i].levelid,
          adaptname: list.memberlevel[i].name,
          visitprogramid: this.addFrom.visitprogramid
        });
      }
      return lst;
    },

			handleCurrentChange(val) {
				if (!!val) {
					this.tabelRowId = val.visitprogramid;
				}
			},
			//当目前行id==刷新前id  就高亮表示
			getTabelClass({
				row,
				rowIndex
			}) {
				if (row.visitprogramid == this.tabelRowId) {
					return "current-row";
				} else {
					return "";
				}
			}
		}
	};
</script>
<style lang="scss" scoped>
	/* >>> .el-tabs__content{
  height: calc(100% - 40px) !important;
} */
	.el-form-item {
		margin-bottom: 20px !important;
	}

	.box-card {
		margin-bottom: 10px;
		box-shadow: none;

		.el-form {
			margin-top: 0px;
		}

		.el-input {
			margin-right: 5px;
		}
	}

	.mlr10 {
		margin-left: 10px;
		margin-right: 10px;
	}

	.header-lq {
		height: 40px !important;
		min-height: 40px !important;
		padding: 0px !important;
		margin: 20px 0;
	}

	.radioBox-lq {
		margin: 10px 0;
	}
</style>
