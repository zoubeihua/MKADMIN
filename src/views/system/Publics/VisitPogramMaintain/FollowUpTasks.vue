<template>
  <d2-container>
    <el-container>
      <!-- -------------- -->
      <el-header>
        <el-form :inline="true">
          <el-form-item>
            <mk-select
              multiple
              collapse-tags
              v-model="form.jzlx"
              url="1"
              :globalFn="true"
              :param="{ codetype: '就诊分类' }"
              :filter="['bzname', 'filterstr']"
              width="160px"
              label="bzname"
              val="bzcode"
              placeholder="请选择就诊类型"
              @change="MemberVisitTaskList_Get"
            ></mk-select>
          </el-form-item>
          <el-form-item>
            <mk-select
              style="width:180px;"
              v-model="form.memberlevel"
              multiple
              collapse-tags
              url="/Publics/MemberManage/Memberlevel"
              @change="MemberVisitTaskList_Get()"
              placeholder="请选择会员等级"
              :filter="['name']"
              label="name"
              val="levelid"
            ></mk-select>
          </el-form-item>
          <el-form-item>
            <mk-select
              v-model="form.status"
              url="1"
              :globalFn="true"
              :param="{ codetype: '随访状态' }"
              :filter="['bzname', 'filterstr']"
              width="160px"
              label="bzname"
              val="bzcode"
              placeholder="请选择随访状态"
              @change="MemberVisitTaskList_Get"
            ></mk-select>
          </el-form-item>
          <el-form-item>
            <mk-select
              v-model="form.eventtype"
              url="1"
              :globalFn="true"
              :param="{ codetype: '随访事件类型' }"
              :filter="['bzname', 'filterstr']"
              width="160px"
              label="bzname"
              val="bzcode"
              placeholder="请选择随访事件类型"
              @change="MemberVisitTaskList_Get"
            ></mk-select>
          </el-form-item>
          <el-form-item>
            <!-- 类型 1 计划 2 实际 -->
            <el-select
              v-model="form.flag"
              clearable
              placeholder="请选择节点"
              style="max-width:10em"
              @change="getQuerytype"
            >
              <el-option
                v-for="item in querytypeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <!-- 选择计划工作人员 -->
            <el-select
              v-model="form.planuserid"
              clearable
              :placeholder="gettext(form.flag)"
              style="max-width:11em"
              @change="getUserid"
              v-if="form.flag == undefined || form.flag == 1"
            >
              <el-option
                v-for="item in customManagerList"
                :key="item.userid"
                :label="item.name"
                :value="item.userid"
                :disabled="form.flag == undefined ? true : false"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 实际工作人员 -->
          <el-form-item>
            <el-select
              v-model="form.actualuserid"
              clearable
              :placeholder="gettext(form.flag)"
              style="max-width:11em"
              @change="getUserid"
              v-if="form.flag == 2"
            >
              <el-option
                v-for="item in customManagerList"
                :key="item.userid"
                :label="item.name"
                :value="item.userid"
                :disabled="form.flag == undefined ? true : false"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <!-- 时间区间选择 -->
            <el-date-picker
              v-model="form.dataRange"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              :disabled="form.flag == undefined ? true : false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change="getDataRange"
            ></el-date-picker>
          </el-form-item>
          <!-- </el-form> -->
          <!-- <el-form :inline="true"> -->
          <!-- <el-form-item>
            <el-select
              v-model="form.rightid"
              clearable
              placeholder="请选择权益"
              style="max-width:20em"
              @change="getRightId"
            >
              <el-option
                v-for="item in rightList"
                :key="item.itemid"
                :label="item.itemname"
                :value="item.itemid"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item>
            <el-input
              style="width:300px;"
              clearable
              @keyup.enter.native="MemberVisitTaskList_Get"
              v-model="form.condition"
              placeholder="按会员卡号、手机号、姓名查找"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              true-label="1"
              false-label="0"
              v-model="form.mytask"
              @change="MemberVisitTaskList_Get"
              >我的任务</el-checkbox
            >
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="MemberVisitTaskList_Get"
                >查询</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-refresh"
                @click="initFrom('1')"
                >清空</el-button
              >
              <el-button
                icon="el-icon-circle-plus-outline"
                type="primary"
                @click="showInterimModel"
                >添加临时计划</el-button
              >
            </el-button-group>
          </el-form-item>
          <!-- <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="MemberVisitTaskList_Get"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showInterimModel"
              >添加临时计划</el-button
            >
          </el-form-item> -->
        </el-form>
      </el-header>
      <!-- ---------------- -->
      <el-main style="padding:0 10px 0 10px;">
        <el-table
          :data="tasksList"
          stripe
          highlight-current-row
          border
          height="100%"
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
                <span style="min-width:60px;display:inline-block;">
                  {{ scope.row.membername }}
                </span>
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
            prop="memberlevel"
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
          <el-table-column
            label="随访方案"
            prop="visitname"
            width="200px"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="textLeft">{{ scope.row.visitname }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="随访事件"
            align="center"
            prop="visiteventname"
            width="200"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="textLeft">{{ scope.row.visiteventname }}</div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            sortable
            label="计划日期"
            align="center"
            width="140"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.plantime }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="计划执行人"
            prop="planusername"
            width="110px"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="textLeft">{{ scope.row.planusername }}</div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            sortable
            label="执行日期"
            align="center"
            width="140"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.actualtime }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="实际执行人"
            prop="actualusername"
            width="110px"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="textLeft">{{ scope.row.actualusername }}</div>
            </template>
          </el-table-column>

          <el-table-column label="随访任务" align="center">
            <el-table-column
              label="用药提醒"
              prop="medicalremind"
              width="200"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div class="textLeft">{{ scope.row.medicalremind }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="复诊通知"
              prop="referralremind"
              width="200"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div class="textLeft">{{ scope.row.referralremind }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="健康宣教"
              prop="healthmissiontitle"
              width="200"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div class="textLeft">{{ scope.row.healthmissiontitle }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="患者问卷"
              prop="questionnaire_name"
              width="200"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div class="textLeft">{{ scope.row.questionnaire_name }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="医生表单"
              prop="doctorform_name"
              width="200"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div class="textLeft">{{ scope.row.doctorform_name }}</div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="失访备注"
            align="center"
            prop="visitnote"
            width="100px"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="状态" align="center" fixed="right">
            <template slot-scope="scope">
              <el-tag :type="GetTaskDisplay(scope.row.status)">
                {{ scope.row.statusdisplay }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" align="center">
            <template slot="header">
              <span class="primary">操作</span>
            </template>
            <template slot-scope="scope">
              <div class="tableBtn">
                <el-link
                  title="随访"
                  @click="showMemberVisitModel(scope.row)"
                  :underline="false"
                  type="primary"
                  icon="mkfont -huiyuan"
                ></el-link>
                <el-link
                  title="取消"
                  @click="showTaskModel(scope.row)"
                  :underline="false"
                  type="primary"
                  icon="mkfont tingyong_line"
                  :disabled="scope.row.status !== 0"
                ></el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <mk-page :pager="pager" @query="MemberVisitTaskList_Get" />
      </el-footer>

      <!-- --------取消随访Model-------- -->
      <vxe-modal
        v-model="taskModel"
        :showFooter="true"
        title="取消随访"
        width="512px"
        height="400px"
        @close="closeTaskModel"
      >
        <el-form
          :model="cancelForm"
          ref="cancelForm"
          :rules="cancelFormRules"
          label-width="80px"
        >
          <el-form-item label="失访类型" prop="losttype">
            <mk-select
              v-model="cancelForm.losttype"
              url="1"
              :globalFn="true"
              :param="{ codetype: '失访类型' }"
              :filter="['bzname', 'filterstr']"
              label="bzname"
              val="bzcode"
              placeholder="请选择失访类型"
            ></mk-select>
          </el-form-item>
          <el-form-item label="取消原因" prop="visitnote">
            <el-input
              v-model="cancelForm.visitnote"
              placeholder
              type="textarea"
              :rows="5"
            ></el-input>
          </el-form-item>
        </el-form>
        <!--  -->
        <div slot="footer" style="text-align:center;">
          <el-button-group>
            <el-button type="primary" @click="sthExamine">提交</el-button>
            <el-button @click="closeTaskModel">取消</el-button>
          </el-button-group>
        </div>
      </vxe-modal>
      <!-- ----end------ -->
      <!-- --------随访---------- -->
      <vxe-modal
        v-model="memberVisitModel"
        :showFooter="true"
        title="会员随访"
        width="95vw"
        height="95vh"
        @close="closeMemberVisitModel"
      >
        <div slot="title">
          会员随访 - [
          <span style="color:red;">
            会员等级 ： {{ rowplanData.memberlevel_display }} 会员卡号：{{
              rowplanData.memberno
            }}
            会员姓名：{{ rowplanData.membername }} 性别：{{
              rowplanData.sex_dispalay
            }}
            年龄：{{ rowplanData.age }}
          </span>
          ]
        </div>
        <SplitPane
          :min-percent="30"
          :default-percent="30"
          split="vertical"
          v-if="memberVisitModel"
        >
          <template slot="paneL">
            <el-container style="minWidth:400px">
              <el-header class="leftElFrm">
                <el-form label-width="70px" style="width:100%">
                  <el-form-item label="方案名称">
                    <el-input :value="userInfo.visitname" disabled />
                  </el-form-item>
                  <el-form-item label="事件名称">
                    <el-input :value="userInfo.visiteventname" disabled />
                  </el-form-item>
                  <el-form-item label="计划随访">
                    <el-input
                      :value="userInfo.planusername"
                      disabled
                      style="width:calc(100% - 160px);margin-right:10px"
                    />
                    <el-input
                      :value="userInfo.plantime"
                      disabled
                      style="width:150px"
                    />
                  </el-form-item>
                  <el-form-item label="实际随访">
                    <el-input
                      :value="userInfo.actualusername"
                      disabled
                      style="width:calc(100% - 160px);margin-right:10px"
                    />
                    <el-input
                      :value="userInfo.actualtime"
                      disabled
                      style="width:150px"
                    />
                  </el-form-item>
                  <el-form-item label="事件类型">
                    <el-input :value="userInfo.eventtypedisplay" disabled />
                  </el-form-item>
                  <el-form-item label-width="0">
                    <div class="floatDiv">
                      <span>
                        <!-- 历史随访记录 -->
                        问卷表单-随访列表
                      </span>
                      <el-button size="mini" @click="backSelf" class="backSelf"
                        >回到当前随访</el-button
                      >
                    </div>
                  </el-form-item>
                </el-form>
              </el-header>
              <el-main style="padding:0;">
                <el-timeline>
                  <el-timeline-item
                    v-for="item in historyTaskList"
                    :key="item.visitplanid"
                    :timestamp="
                      item.actualtime == null
                        ? ''
                        : ' 实际执行:' +
                          item.actualusername +
                          '[' +
                          item.actualtime +
                          ']'
                    "
                    placement="top"
                    :type="getVisitType(item.status)"
                    :id="item.visitplanid"
                  >
                    <el-card
                      :class="item.visitplanid == activeID ? 'active' : ''"
                      @click.native="MemberVisitTaskDetail_Get(item)"
                    >
                      <p :class="[getVisitType(item.status), 'tag']">
                        {{ item.statusdisplay }}
                      </p>
                      <p :class="['enent' + item.eventtype, 'enent']">
                        {{ item.eventtypedisplay }}
                      </p>
                      <p>
                        <span>方案名称:</span>
                        {{ item.visitname }}
                      </p>
                      <p>
                        <span>事件名称:</span>
                        {{ item.visiteventname }}
                      </p>
                      <p>
                        <span>计划执行:</span>
                        {{ item.planusername + " [ " + item.plantime + " ] " }}
                      </p>
                      <p>
                        <span>实际执行:</span>
                        <template v-if="item.actualtime">
                          {{
                            item.actualusername +
                              " [ " +
                              item.actualtime +
                              " ] "
                          }}
                        </template>
                      </p>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </el-main>
            </el-container>
          </template>
          <template slot="paneR">
            <el-container>
              <el-main style="padding:0">
                <el-tabs
                  v-model="activeName"
                  type="card"
                  style="width:100%;height:calc(100% - 40px)"
                  @tab-click="tabClick"
                  class="tabsPane"
                >
                  <el-tab-pane label="问卷调查" name="1">
                    <mk-tabs-crf
                      ref="queTabscrf"
                      :edit="userInfo.status == 0 ? true : false"
                      @change="tabsrfChange"
                    ></mk-tabs-crf>
                  </el-tab-pane>
                  <el-tab-pane label="医生任务" name="2">
                    <mk-tabs-crf
                      ref="doctabscrfs"
                      @change="tabsrfChangeee"
                      :edit="userInfo.status == 0 ? true : false"
                    ></mk-tabs-crf>
                  </el-tab-pane>
                </el-tabs>
              </el-main>
            </el-container>
          </template>
        </SplitPane>

        <div slot="footer" style="text-align:center;">
          <el-button-group>
            <el-button
              type="primary"
              @click="crfSave"
              :disabled="userInfo.status == 1 || userInfo.eventtype != 4"
              >提交</el-button
            >
            <el-button
              @click="showNextFollowUp(userInfo)"
              :disabled="userInfo.status == 1 || userInfo.eventtype != 4"
              type="warning"
              >下次跟进</el-button
            >
            <el-button
              @click="showTaskModel(userInfo)"
              :disabled="userInfo.status == 1 || userInfo.eventtype != 4"
              type="danger"
              >取消随访</el-button
            >
            <el-button @click="closeMemberVisitModel">取消</el-button>
          </el-button-group>
        </div>
      </vxe-modal>
      <!-- end -->
      <!-- --------下次跟进Model-------- -->
      <vxe-modal
        v-model="isNextFollowUp"
        :showFooter="true"
        title="下次跟进"
        width="512px"
        height="400px"
        @close="closeNextFollowUp"
      >
        <el-form
          :model="nextForm"
          ref="nextForm"
          :rules="nextFormRules"
          label-width="100px"
        >
          <el-form-item label="跟进时间" prop="followUpTime">
            <el-date-picker
              v-model="nextForm.followUpTime"
              type="datetime"
              placeholder="选择日期时间"
              :picker-options="pickerOptions1"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="下次跟进人" prop="userid">
            <el-select v-model="nextForm.userid" style="max-width:10em">
              <el-option
                v-for="item in customManagerList"
                :key="item.userid"
                :label="item.name"
                :value="item.userid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原因" prop="visitnote">
            <el-input
              v-model="nextForm.visitnote"
              placeholder
              type="textarea"
              :rows="5"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align:center;">
          <el-button-group>
            <el-button type="primary" @click="MemberVisitTask_NextFollowUp"
              >提交</el-button
            >
            <el-button @click="closeNextFollowUp">取消</el-button>
          </el-button-group>
        </div>
      </vxe-modal>
      <!-- ending -->
      <!-- --------添加临时随访计划-------- -->
      <vxe-modal
        v-model="isInterimModel"
        :showFooter="true"
        title="添加临时随访计划"
        width="60vw"
        height="auto"
        @close="closeInterimModel"
      >
        <el-form
          label-width="90px"
          :model="initerFrom"
          ref="initerFrom"
          :rules="initerFromReles"
          v-if="isInterimModel"
        >
          <div class="from-flexrow">
            <div class="from-item-flex-samll">
              <el-form-item label="就诊类型:">
                <mk-select
                  multiple
                  collapse-tags
                  placeholder="请选择就诊类型"
                  :datas="getDicStandarDcode('就诊分类')"
                  :filter="['bzname', 'bzname']"
                  label="bzname"
                  val="bzcode"
                  retureType="1"
                  :disabled="false"
                  v-model="initerFrom.jzlx"
                  style="width:180px"
                ></mk-select>
              </el-form-item>
            </div>
            <div class="from-item-flex">
              <el-form-item label="识别号:">
                <mk-member-select
                  @change="getManagerItem"
                  url="/Publics/MemberVisitTask/MembeRrelatedBasic_Get"
                  :RequestData="{ hospitalid: 1, jzlx: initerFrom.jzlx }"
                />
              </el-form-item>
            </div>
          </div>
          <div class="from-flexrow">
            <div class="from-item-flex-samll">
              <el-form-item label="性别-姓名:" prop="memberid">
                <div>
                  <i
                    :class="[
                      'mkfont',
                      initerMember.sex == 1
                        ? 'nan'
                        : initerMember.sex == 2
                        ? 'nv'
                        : 'weizhi'
                    ]"
                    :style="{
                      color:
                        initerMember.sex == 1
                          ? '#6DCEFA'
                          : initerMember.sex == 2
                          ? '#F37E7D'
                          : ''
                    }"
                  ></i>
                  <span style="min-width:60px;display:inline-block;">
                    {{ initerMember.membername || "请选择会员" }}
                  </span>
                </div>
              </el-form-item>
            </div>
            <div class="from-item-flex-samll">
              <el-form-item label="年龄:">
                {{ initerMember.age || "请选择会员" }}
              </el-form-item>
            </div>
            <div class="from-item-flex-samll">
              <el-form-item label="会员等级:">
                {{ initerMember.memberlevel_display || "请选择会员" }}
              </el-form-item>
            </div>
          </div>
          <el-form-item label="已有方案:">
            {{
              initerMember.visitnamelist
                ? initerMember.visitnamelist
                : "暂无已有方案"
            }}
          </el-form-item>
          <el-form-item label="临床诊断:">
            {{
              initerMember.diagnosis ? initerMember.diagnosis : "暂无临床诊断"
            }}
          </el-form-item>
          <el-form-item label="关联方案:" prop="visitprogramid">
            <el-select
              v-model="initerFrom.visitprogramid"
              @change="getIniteVisitName"
            >
              <el-option
                v-for="item in MembeRrelatedList"
                :key="item.visitprogramid"
                :label="item.visitname"
                :value="item.visitprogramid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="医生表单:" prop="doctorform">
            <edcList
              :Tag="2"
              :key="2"
              placeholder="请选择随访记录的表单"
              @select="getQuestionItem"
            />
          </el-form-item>
          <el-form-item label="患者表单:" prop="questionnaire">
            <edcList
              :Tag="1"
              :key="1"
              placeholder="请选择随访记录的表单"
              @select="getQuestionItem"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align:center;">
          <el-button-group>
            <el-button
              type="primary"
              @click="MemberTemporaryVisitTask_Post(false)"
              >提交</el-button
            >
            <el-button
              type="primary"
              @click="MemberTemporaryVisitTask_Post(true)"
              >提交并随访</el-button
            >
            <el-button @click="closeInterimModel">取消</el-button>
          </el-button-group>
        </div>
      </vxe-modal>
    </el-container>
  </d2-container>
</template>
<script>
import util from "@/libs/util.js";
import dayjs from "dayjs";
import edcList from "./components/edcList";
export default {
  components: { edcList },
  data() {
    return {
      tabelRowId: "",
      initerFromReles: {
        doctorform: [
          { required: true, message: "请选择医生表单", trigger: "blur" }
        ],
        questionnaire: [
          { required: true, message: "请选择患者表单", trigger: "blur" }
        ],
        visitprogramid: [
          { required: true, message: "请选择关联方案", trigger: "blur" }
        ],
        memberid: [{ required: true, message: "请选择会员", trigger: "blur" }]
      },
      currentRow: [],
      activeName: "1",
      tasksList: [], //tabel
      taskModel: false, //取消随访弹框
      memberVisitModel: false, //会员随访弹框
      isNextFollowUp: false, //下次跟进
      customManagerList: [], //工作人员
      historyTaskList: [], //历史事件
      isInterimModel: false, //添加临时
      initerMember: [], //临时会员信息
      initerFrom: {
        operatetype: "C", //临时随访计划 (新增(C) 编辑(U)) 现在只做新增
        visitplanid: undefined, //v随访计划id(新增不用传,编辑需要传值)
        doctorform: undefined, //医生需要填写的随访表单，对应CRF表单的CRFID，没有的情况下默认“-1”
        hospitalid: 1,
        memberid: undefined,
        jzlx: [],
        visitprogramid: "",
        questionnaire: "",
        visitname: "",
        visiteventname: "临时随访",
        visitprogramnote: "", //描述
        visitnote: "", //随访备注
        planuserid: util.cookies.get("uuid") //当前登陆用户,
      },
      MembeRrelatedList: {},
      pager: {
        page: 1,
        rows: 20,
        count: 0
      },
      cancelForm: {
        userid: util.cookies.get("uuid"), //当前登陆用户,
        visitnote: "", //备注
        losttype: undefined, //失访类型: 取字典信息（失访类型）
        visitplanid: undefined //随访计划ID
      },
      userInfo: {
        //用户随访页面的
      },
      rowplanData: {
        //选中的数据
      },
      form: {
        jzlx: [], //就诊类型(取字典:就诊分类)
        memberlevel: [], //会员等级ID 传一个数组;[1000002,1000003,1000004]
        visitprogramid: undefined, //随访方案ID
        status: "0", //取字典信息：随访状态 0：待访 1：已访
        visitresult: undefined, //取字典信息：随访结果 0：失访 1：完成
        planuserid: undefined, //计划随访人ID
        actualuserid: undefined, //实际随访人ID
        flag: 1, //flag: (1:表示是 Bdate 计划执行时间 2:表示 Bdate 实际执行时间--)
        Bdate: "", //开始事件
        Edate: "", //
        mytask: 0, //1:表示我的任务;
        userid: util.cookies.get("uuid"), //当前登陆用户,
        condition: "", //
        hospitalid: 1,
        orderby: "",
        dataRange: "",
        eventtype: "4"
      },
      querytypeList: [
        { value: 1, text: "计划" },
        { value: 2, text: "实际" }
      ],
      nextForm: {
        visitnote: "",
        followUpTime: "",
        userid: parseInt(util.cookies.get("uuid")), //当前登陆用户,,
        visitplanid: undefined,
        currentuserid: parseInt(util.cookies.get("uuid")) //当前登陆用户,,
      },
      nextFormRules: {
        visitnote: [{ required: true, message: "请输入原因", trigger: "blur" }],
        userid: [
          { required: true, message: "请选择下次随访人", trigger: "blur" }
        ],
        followUpTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ]
      },
      cancelFormRules: {
        visitnote: [{ required: true, message: "请输入原因", trigger: "blur" }],
        losttype: [
          { required: true, message: "请选择失访类型", trigger: "change" }
        ]
      },
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
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      }
    };
  },
  created() {
    const end = new Date();
    const start = new Date();
    end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
    this.form.Bdate = start;
    this.form.Edate = end;
    this.form.dataRange = [start, end];
    this.MemberVisitTaskList_Get();
    this.Member_AccountManager_Get();
  },
  methods: {
    getVisitType(status) {
      if (status == 0) {
        return "primary";
      } else if (status == 1) {
        return "";
      } else if (status == 2) {
        return "danger";
      }
    },
    backSelf() {
      this.MemberVisitTaskDetail_Get(this.currentRow);
    },
    //当目前行id==刷新前id  就高亮表示
    getTabelClass({ row, rowIndex }) {
      if (row.visitplanid == this.tabelRowId) {
        return "current-row";
      } else {
        return "";
      }
    },
    getQuestionItem(item, tag) {
      if (tag == 2) {
        this.initerFrom.doctorform = item.subclassid;
      } else if (tag == 1) {
        this.initerFrom.questionnaire = item.subclassid;
      }
    },
    //获取列表
    MemberVisitTaskList_Get() {
      this.MK.Request(
        "/Publics/MemberVisitTask/MemberVisitTaskList_Get",
        "get",
        { ...this.pager, ...this.form }
      ).then(res => {
        if (res.code == 0) {
          this.tasksList = res.data;
          this.pager.count = res.count;
        }
      });
    },
    //查询客户经理-责任人
    Member_AccountManager_Get() {
      this.MK.Request("Publics/Common/UserInfo", "get", {
        tag: 1
      }).then(res => {
        this.customManagerList = res.data;
      });
    },
    //
    getQuerytype(value) {
      if (!value) {
        this.form.planuserid = undefined;
        this.form.actualuserid = undefined;
        this.form.dataRange = "";
        this.form.flag = undefined;
      }
      this.MemberVisitTaskList_Get();
    },
    //
    gettext(id) {
      if (id == undefined) {
        return "请选择上个节点";
      } else if (id == 1) {
        return "请选择计划随访人";
      } else if (id == 2) {
        return "请选择实际随访人";
      }
    },
    getUserid(value) {
      if (!value) {
        this.form.planuserid = undefined;
        this.form.actualuserid = undefined;
      }
      this.MemberVisitTaskList_Get();
    },
    getDataRange(value) {
      if (!value) {
        this.form.Bdate = "";
        this.form.Edate = "";
      } else {
        this.form.Bdate = value[0];
        this.form.Edate = value[1];
      }
      this.MemberVisitTaskList_Get();
    },
    tabsrfChange(tab) {
      console.log(tab);
    },
    tabsrfChangeee(tab) {
      console.log(tab);
    },
    //查询会员随访任务列表信息
    MemberVisitTaskDetail_Get(row) {
      this.activeID = row.visitplanid;
      setTimeout(() => {
        this.$refs.queTabscrf.toFormList = [];
        this.$refs.doctabscrfs.toFormList = [];
      }, 50);
      this.MK.Request(
        "/Publics/MemberVisitTask/MemberVisitTaskDetail_Get",
        "get",
        {
          visitplanid: row.visitplanid
        }
      ).then(res => {
        if (res.code == 0) {
          if (res.data.eventtype == 4) {
            this.rowplanData.doctorform = res.data.doctorform;
            this.rowplanData.doctorform_collectionid =
              res.data.doctorform_collectionid;
            this.rowplanData.questionnaire = res.data.questionnaire;
            this.rowplanData.questionnaire_collectionid =
              res.data.questionnaire_collectionid;
            this.rowplanData.visitplanid = res.data.visitplanid;
            if (this.activeName !== 0) {
              setTimeout(() => {
                this.$refs.queTabscrf.CRFillJsonBysubclassid_Get({
                  collectionid: res.data.questionnaire_collectionid,
                  memberid: res.data.memberid,
                  subclassid: res.data.questionnaire
                });
                this.$refs.doctabscrfs.CRFillJsonBysubclassid_Get({
                  collectionid: res.data.doctorform_collectionid,
                  memberid: res.data.memberid,
                  subclassid: res.data.doctorform
                });
              }, 200);
            }
          } else {
            //重制问卷
            setTimeout(() => {
              this.$refs.queTabscrf.toFormList = [];
              this.$refs.doctabscrfs.toFormList = [];
            }, 200);
          }
          this.userInfo = res.data;
          this.historyTaskList = res.lstHistoryVisitTask;
          this.sc(row.visitplanid);
        }
      });
    },

    //会员随访的弹框
    showMemberVisitModel(row) {
      this.currentRow = { ...row };
      this.MemberVisitTaskDetail_Get(row);
      this.rowplanData = row;
      this.memberVisitModel = true;
    },
    tabClick(val) {
      return;
      if (val.name == "2" && this.userInfo.eventtype == 4) {
        this.$refs.doctabscrfs.CRFillJsonBysubclassid_Get({
          collectionid: this.rowplanData.doctorform_collectionid,
          memberid: this.rowplanData.memberid,
          subclassid: this.rowplanData.doctorform
        });
      } else if (val.name == "1" && this.userInfo.eventtype == 4) {
        this.$refs.queTabscrf.CRFillJsonBysubclassid_Get({
          collectionid: this.rowplanData.questionnaire_collectionid,
          memberid: this.rowplanData.memberid,
          subclassid: this.rowplanData.questionnaire
        });
      }
    },
    crfSave() {
      //提交患者问卷

      this.queCrfSave();
    },
    //患者表单保存
    queCrfSave() {
      this.$refs.queTabscrf
        .getData(this.rowplanData.questionnaire_collectionid)
        .then(res => {
          if (res) {
            //表单提交保存
            this.$refs.queTabscrf.saveData(res).then(async data => {
              //提交医生问卷
              this.docCrfSave();
            });
          }
        });
    },
    docCrfSave() {
      this.$refs.doctabscrfs
        .getData(this.rowplanData.doctorform_collectionid)
        .then(res => {
          if (res) {
            //表单提交保存
            this.$refs.doctabscrfs.saveData(res).then(async data => {
              //提交保存
              this.MemberVisitTask_Confirm();
            });
          }
        });
    },
    open(date, visitplanid) {
      let newdate = new Date();
      let plandate = new Date(date);
      if (
        newdate.getFullYear() == plandate.getFullYear() &&
        newdate.getMonth() == plandate.getMonth() &&
        newdate.getDate() == plandate.getDate()
      ) {
        //计划时间与现在时间相等
      } else {
        //计划时间与现在时间有差别，调整随访任务计划执行时间(当前处理的随访任务的[实际执行时间与计划执行时间 不为同一天的时候,需要 弹框提示
        //【是否调整后续随访计划执行时间】,如果【是】,则调用该服务进行调整])
        this.$confirm("是否调整后续随访计划执行时间?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            //确定
            this.MK.Request(
              "/Publics/MemberVisitTask/MemberVisitTask_ChanagePlantime",
              "post",
              {
                visitplanid: visitplanid
              }
            );
          })
          .catch(() => {
            //取消
          });
      }
    },
    MemberVisitTask_Confirm() {
      this.MK.Request(
        "/Publics/MemberVisitTask/MemberVisitTask_Confirm",
        "post",
        {
          visitplanid: this.rowplanData.visitplanid,
          userid: util.cookies.get("uuid") //当前登陆用户,
        }
      ).then(res => {
        if (res.code == 0) {
          this.open(this.rowplanData.plantime, this.rowplanData.visitplanid);
          this.closeMemberVisitModel();
          this.MemberVisitTaskList_Get();
        }
      });
    },
    closeMemberVisitModel() {
      this.memberVisitModel = false;
      this.rowplanData = [];
      this.activeName = "1";
    },
    //下次跟进
    showNextFollowUp(row) {
      this.isNextFollowUp = true;
      this.rowplanData = row;
    },
    closeNextFollowUp() {
      this.isNextFollowUp = false;
      this.$refs["nextForm"].resetFields();
      this.closeMemberVisitModel();
    },
    MemberVisitTask_NextFollowUp() {
      this.$refs["nextForm"].validate(valid => {
        if (valid) {
          this.nextForm.visitplanid = this.rowplanData.visitplanid;
          this.MK.Request(
            "/Publics/MemberVisitTask/MemberVisitTask_NextFollowUp",
            "post",
            this.nextForm
          ).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.closeNextFollowUp();
              this.closeMemberVisitModel();
              this.MemberVisitTaskList_Get();
            }
          });
        } else {
          return false;
        }
      });
    },

    //取消随访的弹框
    showTaskModel(row) {
      this.cancelForm.visitplanid = row.visitplanid;
      this.taskModel = true;
    },
    closeTaskModel() {
      this.taskModel = false;
      this.$refs["cancelForm"].resetFields();
      this.closeMemberVisitModel();
    },
    //取消随访
    sthExamine() {
      this.$refs["cancelForm"].validate(valid => {
        if (valid) {
          this.MK.Request(
            "/Publics/MemberVisitTask/MemberVisitTask_Cancel",
            "post",
            this.cancelForm
          ).then(res => {
            if (res.code == 0) {
              this.$message.success(res.msg);
              this.closeTaskModel();
              this.MemberVisitTaskList_Get();
            }
          });
        } else {
          return false;
        }
      });
    },
    // --------临时计划-----------
    showInterimModel() {
      this.isInterimModel = true;
    },
    closeInterimModel() {
      this.isInterimModel = false;
      this.initerFromInit();
    },
    initerFromInit() {
      this.initerFrom = {
        operatetype: "C", //临时随访计划 (新增(C) 编辑(U)) 现在只做新增
        visitplanid: undefined, //v随访计划id(新增不用传,编辑需要传值)
        doctorform: undefined, //医生需要填写的随访表单，对应CRF表单的CRFID，没有的情况下默认“-1”
        hospitalid: 1,
        memberid: undefined,
        jzlx: [],
        visitprogramid: "",
        questionnaire: "",
        visitname: "",
        visiteventname: "临时随访",
        visitprogramnote: "", //描述
        visitnote: "", //随访备注
        planuserid: util.cookies.get("uuid") //当前登陆用户,
      };
    },
    //提交临时计划
    MemberTemporaryVisitTask_Post(follow) {
      //initerFrom验证//
      this.$refs["initerFrom"].validate(valid => {
        if (valid) {
          this.MK.Request(
            //患者临时随访计划新增或者编辑(先只做新增)
            "/Publics/MemberVisitTask/MemberTemporaryVisitTask_Post",
            "post",
            this.initerFrom
          ).then(res => {
            if (res.code == 0) {
              if (follow) {
                //提交并随访
                this.MemberVisitTaskDetail_Get({
                  visitplanid: res.visitplanid
                });
                this.memberVisitModel = true;
              }
              this.closeInterimModel();
            }
          });
        } else {
          return false;
        }
      });
    },
    sc(id) {
      this.$nextTick(() => {
        document.getElementById(id).scrollIntoView({ block: "start" });
      });
    },
    //模糊查询用户
    getManagerItem(item) {
      this.rowplanData = item;
      this.initerMember = item;
      this.initerFrom.memberid = item.memberid;
      this.MembeRrelatedVisitProgram_Get();
    },
    MembeRrelatedVisitProgram_Get() {
      this.MK.Request(
        "/Publics/MemberVisitTask/MembeRrelatedVisitProgram_Get",
        "get",
        {
          memberid: this.initerFrom.memberid,
          condition: "",
          hospitalid: 1
        }
      ).then(res => {
        if (res.code == 0) {
          this.initerFrom.visitprogramid = undefined;
          this.MembeRrelatedList = res.data;
        }
      });
    },
    //临时方案-获取方案id和name
    getIniteVisitName(id) {
      this.MembeRrelatedList.map(item => {
        if (item.visitprogramid == id) {
          this.initerFrom.visitprogramid = item.visitprogramid;
          this.initerFrom.visitname = item.visitname;
        }
      });
    },
    //初始化
    initFrom(code) {
      this.form = {
        jzlx: [], //就诊类型(取字典:就诊分类)
        memberlevel: [], //会员等级ID 传一个数组;[1000002,1000003,1000004]
        visitprogramid: undefined, //随访方案ID
        status: undefined, //取字典信息：随访状态 0：待访 1：已访
        visitresult: undefined, //取字典信息：随访结果 0：失访 1：完成
        planuserid: undefined, //计划随访人ID
        actualuserid: undefined, //实际随访人ID
        flag: undefined, //flag: (1:表示是 Bdate 计划执行时间 2:表示 Bdate 实际执行时间--)
        Bdate: "", //开始事件
        Edate: "", //
        mytask: 0, //1:表示我的任务;
        userid: util.cookies.get("uuid"), //当前登陆用户,
        condition: "", //
        hospitalid: 1,
        orderby: "",
        dataRange: "",
        eventtype: ""
      };
      if (code == "1") {
        this.MemberVisitTaskList_Get();
      }
    }
  }
};
</script>
<style scoped lang="scss">
.from-flexrow {
  display: flex;
  width: 100%;
}
.el-card {
  position: relative;
  border-left: 2px solid transparent;
  cursor: pointer;
  &:hover {
    border-left: 2px solid #387318;
  }
  &.active {
    border-left: 2px solid #387318;
    background-color: rgba(176, 236, 143, 1);
  }
}
.el-card__body {
  .tag {
    position: absolute;
    top: 30px;
    right: 0px;
    padding: 2px 4px;
    background-color: #9a9a9a;
    color: #fff;
    font-size: 12px;
    margin: 0;
    border-radius: 5px 0px 0px 5px;
    &.danger {
      background-color: #f56c6c;
    }
    &.primary {
      background-color: #409eff;
    }
  }
  .enent {
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 2px 4px;
    color: #fff;
    font-size: 12px;
    margin: 0;
    border-radius: 0px 5px 0px 5px;
    background: #5ca8f6;
  }
  .enent1 {
    background: #006270;
  }
  .enent2 {
    background: #6f88fc;
  }
  .enent3 {
    background: #248bd6;
  }
  .enent4 {
    background: #ffab40;
  }
  p {
    color: #4a4a4a;
    display: flex;
    padding-right: 30px;
    span {
      color: #909399;
      flex-shrink: 0;
    }
  }
}
.from-item-flex-samll {
  width: 30%;
  min-width: 250px;
  max-width: 250px;
}
.from-item-flex {
  width: 100%;
}
.tabsPane >>> .el-tabs__content {
  height: calc(100% - 2px) !important;
}
.tabsPane >>> .el-tab-pane {
  height: 100%;
}
.floatDiv {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  background: #dce0e7;
  color: #8d8d8d;
  margin-bottom: 5px;
  border-radius: 3px;
  .backSelf {
    cursor: pointer;
  }
}
</style>
<style scoped>
>>> .el-card__body {
  padding: 10px !important;
}
>>> .el-timeline {
  padding-left: 10px;
}
.leftElFrm >>> .el-form-item {
  margin-bottom: 2px !important;
}
.leftElFrm >>> .is-disabled .el-input__inner {
  height: 30px;
  border-color: transparent;
}
</style>
