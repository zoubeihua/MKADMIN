<template>
  <d2-container>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <!-- <el-tab-pane label="会员类型" name="first">
        <el-header>
          <div class="headerR">
            <el-button
              icon="el-icon-circle-plus-outline"
              type="primary"
              plain
              @click="handleAddMemberType"
            >新增</el-button>
          </div>
        </el-header>
        <el-table :data="memberTypeTableData" stripe :header-cell-style="cellStyle">
          <el-table-column align="center" label="类型ID" prop="membertypeid" />
          <el-table-column align="center" label="类型名称" prop="name" />
          <el-table-column align="center" label="备注" prop="note" />
          <el-table-column align="center" label="创建时间" prop="createtime" />
          <el-table-column
            align="center"
            label="状态"
            label-class-name="ChangeColor"
            :filter-method="filterMemberTypeTag"
            :filters="memberTypeStatus"
            prop="statusdispaly"
          >
            <template slot-scope="scope">
              <el-tag
                :type="GetvalidStatusType(scope.row.status)"
              >{{scope.row.status == 1 ? '正常' : '停用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="120">
            <template slot-scope="scope">
              <div class="tableBtn">
                <el-link
                  title="编辑"
                  icon="mkfont bianji1"
                  :underline="false"
                  type="warning"
                  @click="handleMemberTypeEdit(scope.row,1)"
                />
                <el-link
                  title="停用"
                  icon="mkfont tingyong_line"
                  :underline="false"
                  type="primary"
                  :disabled="scope.row.status == 0"
                  @click="handleMemberTypeEdit(scope.row,2)"
                />
                <el-link
                  title="启用"
                  icon="mkfont qiyong"
                  :underline="false"
                  type="primary"
                  :disabled="scope.row.status == 1"
                  @click="handleMemberTypeEdit(scope.row,3)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>-->
      <el-tab-pane label="会员等级" name="second">
        <el-container>
          <el-table :data="memberLevelTableData" stripe border :header-cell-style="cellStyle">
            <el-table-column align="center" label="等级ID" prop="levelid" />
            <el-table-column align="center" label="等级图标">
              <template slot-scope="scope">
                <i
                  :class="['mkfont', scope.row.icon.split(',')[0] ]"
                  :style="{color: scope.row.icon.split(',')[1], fontSize: 28 + 'px'}"
                ></i>
              </template>
            </el-table-column>
            <el-table-column align="center" label="等级名称" prop="name" />
            <el-table-column align="center" label="备注" prop="note" />
            <el-table-column align="center" label="创建时间" prop="createtime" />
            <el-table-column
              align="center"
              label="状态"
              label-class-name="ChangeColor"
              :filter-method="filterMemberLevelTag"
              :filters="memberLevelStatus"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="GetvalidStatusType(scope.row.status)"
                >{{scope.row.status == 1 ? '正常' : '停用'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" width="120" label="操作">
              <template slot="header" slot-scope="scope">
                <el-button
                  icon="el-icon-circle-plus-outline"
                  type="primary"
                  size="mini"
                  @click="handleAddMemberLevel"
                >新增</el-button>
              </template>
              <template slot-scope="scope">
                <div class="tableBtn">
                  <el-link
                    title="编辑"
                    icon="mkfont bianji1"
                    :underline="false"
                    type="primary"
                    @click="handleMemberLevelEdit(scope.row,1)"
                  />
                  <el-link
                    title="停用"
                    v-if="scope.row.status == 1"
                    icon="mkfont tingyong_line"
                    :underline="false"
                    :disabled="scope.row.status == 0"
                    type="danger"
                    @click="handleMemberLevelEdit(scope.row,2)"
                  />
                  <el-link
                    title="启用"
                    icon="mkfont qiyong"
                    :underline="false"
                    v-if="scope.row.status == 0"
                    :disabled="scope.row.status == 1"
                    type="success"
                    @click="handleMemberLevelEdit(scope.row,3)"
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-container>
      </el-tab-pane>
      <el-tab-pane label="会费标准" name="third">
        <el-table :data="groupCostRulesTableData" stripe border :header-cell-style="cellStyle">
          <!-- <el-table-column align="center" label="会员类型" prop="membertypename" /> -->
          <el-table-column align="center" label="会员等级" prop="levelname" />
          <el-table-column align="center" label="等级图标">
            <template slot-scope="scope">
              <i
                :class="['mkfont', scope.row.icon.split(',')[0] ]"
                :style="{color: scope.row.icon.split(',')[1], fontSize: 28 + 'px'}"
              ></i>
            </template>
          </el-table-column>
          <el-table-column align="center" label="会费月数" prop="expirationmonth" />
          <el-table-column align="center" label="会费标准(元)" prop="membership" :formatter="projectAmountsTabel" />
          <el-table-column
            label="状态"
            align="center"
            label-class-name="ChangeColor"
            :filter-method="filterMemberShipfee"
            :filters="memberShipfeeStatus"
            prop="status"
          >
            <template slot-scope="scope">
              <el-tag
                :type="GetvalidStatusType(scope.row.status)"
              >{{scope.row.status == 1 ? '正常' : '停用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" width="120" label="操作">
            <template slot="header" slot-scope="scope">
                <el-button
              icon="el-icon-circle-plus-outline"
              type="primary"
              size="mini"
              @click="handleAddGroupCostRule"
            >新增</el-button>
              </template>
            <template slot-scope="scope">
              <div class="tableBtn">
                <el-link
                  title="编辑"
                  @click="handleShipFeeEdit(scope.row,1)"
                  :underline="false"
                  type="primary"
                  icon="mkfont bianji1"
                ></el-link>
                <el-link
                  title="停用"
                  v-if="scope.row.status == 1"
                  :underline="false"
                  @click="handleShipFeeEdit(scope.row,2)"
                  icon="mkfont tingyong_line"
                  type="danger"
                  :disabled="scope.row.status == 0"
                />
                <el-link
                  title="启用"
                  :underline="false"
                  v-if="scope.row.status == 0"
                  @click="handleShipFeeEdit(scope.row,3)"
                  icon="mkfont qiyong"
                  type="success"
                  :disabled="scope.row.status == 1"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- <el-tab-pane label="等级规则" name="third">
        <el-table :data="levelRulesTableData" stripe>
          <el-table-column align="center" label="会员类型" prop />
          <el-table-column align="center" label="会员等级" prop />
          <el-table-column align="center" label="最低积分" prop />
          <el-table-column align="center" label="自动升级" prop />
          <el-table-column align="center" label="自动降级" prop />
          <el-table-column align="center" label="年会费（元）" prop />
          <el-table-column align="center" label="状态" prop />
          <el-table-column align="center" label="备注" prop />
          <el-table-column align="center" label prop>
            <template slot="header">
              <el-button type="primary" size="mini" @click="handleAddLevelRule">新增</el-button>
            </template>
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="warning" size="mini">编辑</el-button>
                <el-button type="danger" size="mini">停用</el-button>
                <el-button type="success" size="mini">启用</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>-->
      <!-- <el-tab-pane label="积分规则" name="fourth">
        <el-table :data="pointRulesTableData" stripe>
          <el-table-column align="center" label="会员类型" prop />
          <el-table-column align="center" label="会员等级" prop />
          <el-table-column align="center" label="积分类型" prop />
          <el-table-column align="center" label="消费金额" prop />
          <el-table-column align="center" label="对应积分" prop />
          <el-table-column align="center" label="清零政策" prop />
          <el-table-column align="center" label="状态" prop />
          <el-table-column align="center" label="备注" prop />
          <el-table-column align="center" label prop>
            <template slot="header">
              <el-button type="primary" size="mini" @click="handleAddPointRule">新增</el-button>
            </template>
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="warning" size="mini">编辑</el-button>
                <el-button type="danger" size="mini">停用</el-button>
                <el-button type="success" size="mini">启用</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>-->
      <!-- <el-tab-pane label="优惠券类型" name="fifth">优惠券类型</el-tab-pane>
      <el-tab-pane label="优惠券信息" name="sixth">优惠券信息</el-tab-pane>
      <el-tab-pane label="优惠券对应项目" name="seventh">优惠券对应项目</el-tab-pane>
      <el-tab-pane label="优惠券发放" name="eighth">优惠券发放</el-tab-pane>-->
    </el-tabs>
    <!-- 新增会员类型 -->
        <!-- liqian高度 -->
    <vxe-modal v-model="memberTypeModal" title="会员类型" width="480" height="auto" :showFooter="true">
      <el-form
        :model="memberTypeForm"
        ref="memberTypeForm"
        :rules="memberTypeRules"
        label-width="100px"
      >
        <el-form-item label="会员ID" prop="memberTypeId">
          <el-input
            class="input"
            :readonly="curMemberTypeId != ''"
            v-model="memberTypeForm.memberTypeId"
            placeholder="请输入会员类型ID"
          />
        </el-form-item>
        <el-form-item label="会员类型" prop="memberType">
          <el-input class="input" v-model="memberTypeForm.memberType" placeholder="请输入会员类型" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            class="input"
            type="textarea"
            v-model="memberTypeForm.remarks"
            placeholder="请输入备注（选填）"
          />
        </el-form-item>
      </el-form>
       <div slot="footer" style="text-align:center;">
      <el-button-group>
        <el-button type="primary" @click="handleSubmitMemberType">提交</el-button>
        <el-button type="warning" @click="memberTypeModal = false">取消</el-button>
      </el-button-group>
       </div>
    </vxe-modal>
    <!-- 新增会员等级 -->
    <!-- liqian高度 -->
    <vxe-modal v-model="memberLevelModal" title="会员等级" width="480" height="auto" :showFooter="true">
      <el-form
        :model="memberLevelForm"
        ref="memberLevelForm"
        :rules="memberLevelRules"
        label-width="100px"
      >
        <!-- <el-form-item label="会员ID" prop="memberLevelId">
          <el-input class="input" :readonly="curMemberLevelId != ''" v-model="memberLevelForm.memberLevelId" placeholder="请输入会员等级ID" />
        </el-form-item>-->
        <el-form-item label="会员等级" prop="memberLevel">
          <el-select
            class="input"
            v-model="memberLevelForm.memberLevel"
            @change="handleChangeMemberLevel"
          >
            <el-option
              v-for="item in iconList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              placeholder="请选择会员等级"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图标推荐" prop="iconColor">
          <div
            v-if="memberLevelForm.memberLevel == ''"
            style="color:red;margin-bottom:10px;"
          >请选择会员等级</div>
          <i
            v-else
            style="margin-right:20px;font-size:28px;"
            v-for="item in curIcon"
            :key="item.icon"
            :title="item.name"
            :class="`mkfont ${item.icon}`"
            :style="{color: item.color}"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            class="input"
            type="textarea"
            v-model="memberLevelForm.remarks"
            placeholder="请输入备注（选填）"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center;">
      <el-button-group>
        <el-button type="primary" @click="handleSubmitMemberLevel">提交</el-button>
        <el-button type="warning" @click="memberLevelModal = false">取消</el-button>
      </el-button-group>
      </div>
    </vxe-modal>
    <!-- 会费规则维护 -->
        <!-- liqian高度 -->
    <vxe-modal v-model="groupCostRulesModal" title="会费规则" width="480" height="auto" :showFooter="true">
      <el-form
        :model="groupCostRulesForm"
        ref="groupCostRulesForm"
        :rules="groupCostRulesRules"
        label-width="100px"
      >
        <!-- <el-form-item label="会员类型" prop="membertypeid">
          <el-select
            style="width:280px"
            v-model="groupCostRulesForm.membertypeid"
            placeholder="请选择"
            @change="handleChangeShipfeeType"
          >
            <el-option
              v-for="item in memberTypeTableData"
              :key="item.membertypeid"
              :label="item.name"
              :value="item.membertypeid"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="会员等级" prop="levelid">
          <el-select
            style="width:280px"
            v-model="groupCostRulesForm.levelid"
            placeholder="请选择"
            @change="handleChangeShipfeeLevel"
          >
            <el-option
              v-for="item in memberLevelTableData"
              :key="item.levelid"
              :label="item.name"
              :value="item.levelid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会费单位" prop="expirationmonth">
          <el-input
            style="width:280px;"
            readonly
            v-model="groupCostRulesForm.expirationmonth"
            placeholder="请输入"
          >
            <template slot="append">月</template>
          </el-input>
        </el-form-item>
        <el-form-item label="会费标准" prop="membership">
          <el-input style="width:280px;" v-model="groupCostRulesForm.membership" placeholder="请输入">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-form>
       <div slot="footer" style="text-align:center;">
      <el-button-group>
        <el-button type="primary" @click="handleSubmitShipfee">提交</el-button>
        <el-button type="warning" @click="groupCostRulesModal = false">取消</el-button>
      </el-button-group>
       </div>
    </vxe-modal>
    <!-- 新增等级规则 -->
        <!-- liqian高度 -->
    <vxe-modal v-model="levelRulesModal" title="等级规则" width="480" height="auto" :showFooter="true">
      <el-form :model="levelRulesForm" label-width="100px">
        <el-form-item label="会员类型">
          <el-select class="input" v-model="levelRulesForm.memberType" placeholder="请选择">
            <!-- <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select class="input" v-model="levelRulesForm.memberLevel" placeholder="请选择">
            <!-- <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="最低积分">
          <el-input class="input" v-model="levelRulesForm.lowPoint" placeholder="请输入最低积分" />
        </el-form-item>
        <el-form-item label="自动降级">
          <el-switch v-model="levelRulesForm.autoDemotion" />
        </el-form-item>
        <el-form-item label="自动升级">
          <el-switch v-model="levelRulesForm.autoUpgrade" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            class="input"
            type="textarea"
            v-model="levelRulesForm.remarks"
            placeholder="请输入备注（选填）"
          />
        </el-form-item>
      </el-form>
       <div slot="footer" style="text-align:center;">
      <el-button-group>
        <el-button type="primary">提交</el-button>
        <el-button type="warning" @click="levelRulesModal = false">取消</el-button>
      </el-button-group>
       </div>
    </vxe-modal>
    <!-- 新增积分规则 -->
        <!-- liqian高度 -->
    <vxe-modal v-model="pointRulesModal" title="积分规则" width="480" height="auto" :showFooter="true">
      <el-form :model="pointRulesForm" label-width="100px">
        <el-form-item label="会员类型">
          <!-- <el-select class="input" v-model="pointRulesForm.memberType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="会员等级">
          <!-- <el-select class="input" v-model="pointRulesForm.memberLevel" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="积分类型">
          <!-- <el-select class="input" v-model="pointRulesForm.pointType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="消费金额">
          <el-input class="input" v-model="pointRulesForm.consumeSum" placeholder="请输入消费金额" />
        </el-form-item>
        <el-form-item label="对应积分">
          <el-input class="input" v-model="pointRulesForm.toPoint" placeholder="请输入对应积分" />
        </el-form-item>
        <el-form-item label="清零政策">
          <!-- <el-select class="input" v-model="pointRulesForm.zero" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            class="input"
            type="textarea"
            v-model="levelRulesForm.remarks"
            placeholder="请输入备注（选填）"
          />
        </el-form-item>
      </el-form>
       <div slot="footer" style="text-align:center;">
      <el-button-group>
        <el-button type="primary">提交</el-button>
        <el-button type="warning" @click="pointRulesModal = false">取消</el-button>
      </el-button-group>
       </div>
    </vxe-modal>
    <template slot="footer">
      <!-- 会员类型分页 -->
      <mk-page
        v-if="activeName === 'first'"
        :pager="pagerMemberType"
        @query="refreshMemberTypeList"
      />
      <!-- 会员等级分页 -->
      <mk-page
        v-if="activeName === 'second'"
        :pager="pagerMemberLevel"
        @query="refreshMemberLevelList"
      />
      <!-- 会费规则分页 -->
      <mk-page v-if="activeName === 'third'" :pager="pagerShipfee" @query="refreshShipFeeList" />
    </template>
  </d2-container>
</template>

<script>
const checkNumber = (rule, value, callback) => {
  setTimeout(() => {
    if (isNaN(value)) {
      callback(new Error("请输入数字"));
    } else {
      callback();
    }
  }, 200);
};
import { mapState } from "vuex";
import pageStatus from "@/minxins/pagestatus.js";
import utils from "@/minxins/util.js";
export default {
  mixins: [pageStatus, utils],
  name: "memberBaseDateMaintain",
  computed: {
    ...mapState("d2admin/user", ["info"])
  },
  data() {
    return {
      inputShort: "280px",
      pagerMemberType: {
        count: 0,
        page: 1,
        rows: 20,
        condition: "",
        tag: 0
      },
      pagerMemberLevel: {
        count: 0,
        page: 1,
        rows: 20,
        condition: "",
        tag: 0
      },
      pagerShipfee: {
        count: 0,
        page: 1,
        rows: 20,
        condition: "",
        tag: 0
      },
      curIcon: [], // 当前会员等级的图标信息
      iconColor: "",
      curMemberTypeId: "", // 当前选中的会员类型id
      curMemberTypeStatus: "", // 当前会员类型状态
      curMemberLevelId: "", // 当前选中的会员等级id
      curMemberLevelStatus: "", // 当前选中的会员等级状态
      curShipFeeId: "", //当前会费id
      curShipFeeLevelid: "", // 当前会费-会员等级id
      curShipFeeStatus: "", // 当前会费状态
      shipSERIALNUMBER: "", // 会费序列号
      activeName: "second", // 当前选项卡
      memberTypeStatus: [],
      memberLevelStatus: [],
      memberShipfeeStatus: [],
      memberTypeModal: false,
      memberLevelModal: false,
      levelRulesModal: false,
      groupCostRulesModal: false,
      pointRulesModal: false,
      couponTypeModal: false,
      couponInfoModal: false,
      couponToProjectModal: false,
      couponGrantModal: false,
      memberTypeForm: {
        memberTypeId: "",
        memberType: "",
        remarks: ""
      },
      groupCostRulesForm: {
        membertypeid: "",
        levelid: "",
        membership: "",
        expirationmonth: 12
      },
      // 会费规则校验
      groupCostRulesRules: {
        membertypeid: [
          { required: true, message: "请选择会员类型", trigger: "change" }
        ],
        levelid: [
          { required: true, message: "请选择会员等级", trigger: "change" }
        ],
        membership: [
          { required: true, message: "请输入会费标准", trigger: "blur" }
        ],
        expirationmonth: [
          { required: true, message: "请输入会费月数", trigger: "blur" }
        ]
      },
      memberTypeRules: {
        memberTypeId: [
          { required: true, message: "请输入id", trigger: "blur" },
          { required: true, validator: checkNumber, trigger: "blur" }
        ],
        memberType: [
          { required: true, message: "请输入会员类型", trigger: "blur" }
        ]
      },
      memberLevelRules: {
        memberLevel: [
          { required: true, message: "请选择会员等级", trigger: "change" }
        ]
      },
      memberLevelForm: {
        memberLevelId: "",
        memberLevel: "",
        icon: "",
        remarks: ""
      },
      levelRulesForm: {
        memberType: "",
        levelRule: "",
        lowPoint: "",
        autoDemotion: "",
        autoUpgrade: "",
        yearDues: "",
        remarks: ""
      },
      pointRulesForm: {
        memberType: "",
        levelRule: "",
        pointType: "",
        consumeSum: "",
        toPoint: "",
        zero: "",
        remarks: ""
      },
      memberTypeTableData: [], // 会员类型
      memberLevelTableData: [], // 会员等级
      groupCostRulesTableData: [], //会费规则
      levelRulesTableData: [], // 等级规则
      pointRulesTableData: [{}], // 积分规则
      // couponTypeTableData: [], // 优惠券类型
      // couponInfoTableData: [], // 优惠券信息
      // couponToProjectTableData: [], // 优惠券对应项目
      // couponGrantTableData: [] // 优惠券发放
      iconList: [
        {
          name: "普通会员",
          value: "001",
          icon: "putonghuiyuan",
          color: "#994A2B"
        },
        { name: "白银会员", value: "002", icon: "baiyin", color: "#CFD3DF" },
        { name: "黄金会员", value: "003", icon: "huiyuan3", color: "#FFDC72" },
        { name: "铂金会员", value: "004", icon: "bojin", color: "#DCF2FF" },
        { name: "钻石会员", value: "005", icon: "tubiao-", color: "#9AE6F7" }
      ]
    };
  },
  created() {
    let resStatus = this.GetTablefilters("状态");
    this.memberTypeStatus = resStatus;
    this.memberLevelStatus = resStatus;
    this.memberShipfeeStatus = resStatus;
    this.Membertype_Get();
    this.Memberlevel_Get();
    this.Membershipfee_Get();
  },
  methods: {
    init() {
      // 会员类型
      this.curMemberTypeId = "";
      this.curMemberTypeStatus = "";
      this.memberTypeForm.memberType = "";
      this.memberTypeForm.remarks = "";
      this.memberTypeForm.memberTypeId = "";
      // 会员等级
      this.curMemberLevelId = "";
      this.curMemberLevelStatus = "";
      this.memberLevelForm.memberLevel = "";
      this.memberLevelForm.remarks = "";
      this.memberLevelForm.iconColor = "";
      this.memberLevelForm.memberLevelId = "";
      // 会费
      this.curShipFeeId = "";
      this.curShipFeeLevelid = "";
      this.curShipFeeStatus = "";
      this.groupCostRulesForm.expirationmonth = 12;
      this.groupCostRulesForm.membership = "";
      this.groupCostRulesForm.membertypeid = "";
      this.groupCostRulesForm.levelid = "";
    },
    refreshMemberTypeList() {
      this.MK.Request(
        "Publics/MemberManage/Membertype",
        "get",
        this.pagerMemberType
      ).then(res => {});
    },
    refreshShipFeeList() {
      this.Membershipfee_Get();
    },
    refreshMemberLevelList() {
      this.Memberlevel_Get();
    },
    // 更改会员等级
    handleChangeMemberLevel(val) {
      this.curIcon = this.iconList.filter(item => {
        if (item.value == val) {
          return item;
        }
      });
      console.log(val, this.curIcon, "@@@");
    },
    // 选择图标颜色
    handleChooseIconColor(color) {
      this.memberLevelForm.iconColor = color;
    },
    // 表格列头样式
    cellStyle: function({ row, column, rowIndex, columnIndex }) {
      if (column.labelClassName == "ChangeColor") {
        return "color:blue";
      } else {
        return "";
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleAddGroupCostRule() {
      this.groupCostRulesModal = true;
      this.init();
    },
    // 新增会员类型
    handleAddMemberType() {
      this.memberTypeModal = true;
      this.init();
      this.$refs["memberTypeForm"].clearValidate();
    },
    handleSubmitMemberType() {
      this.$refs["memberTypeForm"].validate(valid => {
        if (valid) {
          this.Membertype_operate();
          this.memberTypeModal = false;
          this.$refs["memberTypeForm"].resetFields();
        }
      });
    },
    // 更改会费——会员等级
    handleChangeShipfeeLevel(id) {
      this.groupCostRulesForm.LEVELID = id;
    },
    // 更改会费——会员类型
    handleChangeShipfeeType(id) {
      this.groupCostRulesForm.membertypeid = id;
    },
    // 编辑会员类型
    handleMemberTypeEdit(val, key) {
      this.curMemberTypeId = val.membertypeid;
      this.SERIALNUMBER = val.serialnumber;
      this.memberTypeForm.memberType = val.name;
      this.memberTypeForm.remarks = val.note;
      this.memberTypeForm.memberTypeId = val.membertypeid;
      // 编辑
      if (key === 1) {
        this.memberTypeModal = true;
        this.curMemberTypeStatus = val.status;
      }
      // 停用
      if (key === 2) {
        this.curMemberTypeStatus = 0;
        this.Membertype_operate();
      }
      // 启用
      if (key === 3) {
        this.curMemberTypeStatus = 1;
        this.Membertype_operate();
      }
    },
    // 新增会费规则
    handleSubmitShipfee() {
      this.$refs["groupCostRulesForm"].validate(valid => {
        if (valid) {
          this.Membershipfee_Add();
        }
      });
      // this.$refs["groupCostRulesForm"].resetFields();
    },
    // 编辑会费规则
    handleShipFeeEdit(val, key) {
      this.curShipFeeId = val.membertypeid;
      this.curShipFeeLevelid = val.levelid;
      this.shipSERIALNUMBER = val.serialnumber;
      this.groupCostRulesForm.membership = val.membership;
      this.groupCostRulesForm.expirationmonth = val.expirationmonth;
      this.groupCostRulesForm.levelid = val.levelname;
      this.groupCostRulesForm.membertypeid = val.membertypename;
      if (key === 1) {
        this.groupCostRulesModal = true;
        this.curShipFeeStatus = val.status;
      }
      if (key === 2) {
        this.curShipFeeStatus = 0;
        this.Membershipfee_Add();
      }
      if (key === 3) {
        this.curShipFeeStatus = 1;
        this.Membershipfee_Add();
      }
    },
    // 过滤会员类型状态
    filterMemberTypeTag(value, row) {
      return row.statusdispaly === value;
    },
    // 新增会员等级
    handleAddMemberLevel() {
      this.memberLevelModal = true;
      this.init();
      this.$refs["memberLevelForm"].clearValidate();
    },
    handleSubmitMemberLevel() {
      this.$refs["memberLevelForm"].validate(valid => {
        if (valid) {
          this.MemberLevel_operate();
          this.memberLevelModal = false;
          this.$refs["memberLevelForm"].resetFields();
        }
      });
    },
    // 编辑会员等级
    handleMemberLevelEdit(val, key) {
      console.log(val, key);
      this.curMemberLevelId = val.levelid;
      this.memberLevelForm.memberLevel = val.name;
      this.curIcon = this.iconList.filter(item => {
        if (item.value == val.levelid) {
          return item;
        }
      });
      // 编辑
      if (key === 1) {
        this.memberLevelModal = true;
        this.curMemberLevelStatus = val.status;
      }
      // 停用
      if (key === 2) {
        this.curMemberLevelStatus = 0;
        this.MemberLevel_operate();
      }
      // 启用
      if (key === 3) {
        this.curMemberLevelStatus = 1;
        this.MemberLevel_operate();
      }
    },
    // 过滤会员等级状态
    filterMemberLevelTag(value, row) {
      const status = row.status == 0 ? "停用" : "正常";
      return status === value;
    },
    // 过滤会费标准状态
    filterMemberShipfee(value, row) {
      const status = row.status == 0 ? "停用" : "正常";
      return status === value;
    },
    // 新增等级规则
    handleAddLevelRule() {
      this.levelRulesModal = true;
      this.init();
    },
    // 新增积分规则
    handleAddPointRule() {
      this.pointRulesModal = true;
    },
    Membertype_operate() {
      const url = this.curMemberTypeId
        ? "Publics/MemberManage/Membertype/Edit"
        : "Publics/MemberManage/Membertype";
      const data = {
        membertypeid: this.memberTypeForm.memberTypeId,
        name: this.memberTypeForm.memberType,
        createid: this.info.USERID,
        note: this.memberTypeForm.remarks
      };
      if (this.curMemberTypeId) {
        data.membertypeid = this.curMemberTypeId;
        data.status = this.curMemberTypeStatus;
      }
      this.MK.Request(url, "post", data).then(res => {
        this.$message({
          message: res.msg,
          type: res.code != 0 ? "warning" : "success"
        });
        this.init();
        this.Membertype_Get();
      });
    },
    MemberLevel_operate() {
      const url = this.curMemberLevelId
        ? "Publics/MemberManage/Memberlevel/Edit"
        : "Publics/MemberManage/Memberlevel";
      const data = {
        levelid: this.curIcon[0].value,
        name: this.curIcon[0].name,
        icon: `${this.curIcon[0].icon},${this.curIcon[0].color}`,
        note: this.memberLevelForm.remarks,
        createid: this.info.userid
      };
      if (this.curMemberLevelId) {
        data.levelid = this.curMemberLevelId;
        data.status = this.curMemberLevelStatus;
      }
      this.MK.Request(url, "post", data).then(res => {
        this.$message({
          message: res.msg,
          type: res.code != 0 ? "warning" : "success"
        });
        this.init();
        this.Memberlevel_Get();
      });
    },
    Membertype_Get() {
      this.MK.Request("Publics/MemberManage/Membertype", "get", {
        condition: this.pagerMemberType.condition,
        page: this.pagerMemberType.page,
        rows: this.pagerMemberType.rows,
        tag: 0
      }).then(res => {
        this.memberTypeTableData = res.data;
        this.pagerMemberType.count = res.count;
      });
    },
    Memberlevel_Get() {
      this.MK.Request("Publics/MemberManage/Memberlevel", "get", {
        condition: this.pagerMemberLevel.condition,
        page: this.pagerMemberLevel.page,
        rows: this.pagerMemberLevel.rows,
        tag: 0
      }).then(res => {
        this.memberLevelTableData = res.data;
        this.pagerMemberLevel.count = res.count;
      });
    },
    Membershipfee_Add() {
      const url = this.curShipFeeId
        ? "Publics/MemberManage/Membershipfee/Edit"
        : "Publics/MemberManage/Membershipfee";
      const data = {
        createid: this.info.userid,
        // membertypeid: this.groupCostRulesForm.membertypeid,
        membertypeid: 3,
        levelid: this.groupCostRulesForm.levelid,
        membership: this.groupCostRulesForm.membership,
        expirationmonth: this.groupCostRulesForm.expirationmonth
      };
      if (this.curShipFeeId) {
        data.serialnumber = this.shipSERIALNUMBER;
        data.status = this.curShipFeeStatus;
        if (isNaN(this.groupCostRulesForm.membertypeid)) {
          const membertypeid = this.memberTypeTableData.filter(item => {
            if (item.name == this.groupCostRulesForm.membertypeid) {
              return item;
            }
          });
          data.membertypeid = membertypeid[0].membertypeid;
        }
        if (isNaN(this.groupCostRulesForm.levelid)) {
          const levelid = this.memberLevelTableData.filter(item => {
            if (item.name == this.groupCostRulesForm.levelid) {
              return item.levelid;
            }
          });
          data.levelid = levelid[0].levelid;
        }
      }
      this.MK.Request(url, "post", data).then(res => {
        this.groupCostRulesModal = false;
        this.Membershipfee_Get();
        this.$message({
          message: res.msg,
          type: "success"
        });
      });
    },
    Membershipfee_Get() {
      this.MK.Request("Publics/MemberManage/Membershipfee", "get", {
        condition: this.pagerShipfee.condition,
        page: this.pagerShipfee.page,
        rows: this.pagerShipfee.rows,
        tag: 0
      }).then(res => {
        this.groupCostRulesTableData = res.data;
        this.pagerShipfee.count = res.count;
      });
    },
    // 表格金额过滤,
    projectAmountsTabel(row) {
      let num = row.membership; // 过滤字段
      if (isNaN(parseFloat(num))) {
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
  }
};
</script>

<style scoped>
.input {
  width: 280px;
}
.modal-button {
  position: absolute;
  bottom: 20px;
}
</style>