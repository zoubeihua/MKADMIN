<template>
  <d2-container>
    <template slot="header">
      <div style="margin:20px 10px;" v-if="activeName == 'first'">
        <el-input
          class="inputShort"
          placeholder="按项目代码查询"
          v-model="pager.condition"
        />
        <el-button style="margin-left:20px;" type="primary" @click="refreshList"
          >查询</el-button
        >
      </div>
      <div style="margin:20px 10px;" v-if="activeName == 'second'">
        <el-input
          class="inputShort"
          placeholder="按项目代码查询"
          v-model="pager.condition"
        />
        <el-button style="margin-left:20px;" type="primary" @click="refreshList"
          >查询</el-button
        >
      </div>
      <div style="margin:20px 10px 4px 10px;" v-if="activeName == 'third'">
        <el-select
          class="mr20"
          style="width:240px;"
          placeholder="请选择项目类型"
          clearable
          v-model="searchCondition.type"
        >
          <el-option label="项目类型" value="项目类型" />
        </el-select>
        <el-date-picker
          class="mr20"
          v-model="searchCondition.date"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
        <el-input
          class="mr20"
          style="width:400px;"
          v-model="searchCondition.condition"
          placeholder="按项目名称 / 拼音码 进行检索"
        />
        <el-button type="primary">查询</el-button>
        <el-button
          type="success"
          v-if="activeMenu == 2"
          @click="handleDataComparison"
          >对比</el-button
        >
      </div>
    </template>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="收费项目维护" name="first">
        <!-- <el-header>
          <div class="headerR">
            <el-button
              icon="el-icon-circle-plus-outline"
              type="primary"
              @click="handleAddCharge('收费项目维护')"
              plain
            >添加</el-button>
          </div>
        </el-header> -->
        <el-table :data="chargeProjectTableData" stripe>
          <el-table-column align="center" label="项目代码" prop="code" />
          <el-table-column align="center" label="项目类型" prop="type" />
          <el-table-column
            align="center"
            label="项目名称"
            width="400"
            prop="name"
          />
          <el-table-column align="center" label="规格" prop="spec" />
          <el-table-column align="center" label="单位" prop="unit" />
          <el-table-column align="center" label="单价" prop="price" />
          <el-table-column align="center" label="状态" prop="status" />
          <el-table-column align="center" label="添加人" prop="create" />
          <el-table-column align="center" label="添加时间" prop="date" />
          <el-table-column align="center" width="120">
            <template slot="header">
              <div class="headerR">
                <el-button
                  icon="el-icon-circle-plus-outline"
                  type="primary"
                  @click="handleAddCharge('收费项目维护')"
                  plain
                  >添加</el-button
                >
              </div>
            </template>
            <template slot-scope="scope">
              <div class="tableBtn">
                <el-link
                  icon="mkfont bianji1"
                  :underline="false"
                  type="warning"
                  title="编辑"
                />
                <el-link
                  icon="mkfont tingyong_line"
                  :underline="false"
                  type="danger"
                  title="停用"
                />
                <el-link
                  icon="mkfont qiyong"
                  :underline="false"
                  type="success"
                  title="启用"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane
        label="收费组合维护"
        name="second"
        :lazy="true"
        style="height:0px"
      ></el-tab-pane>
      <el-tab-pane label="修改日志" name="third">
        <div style="display:flex;">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            style="width:160px;height:calc(100vh - 345px);"
            @select="handleSelectMenu"
          >
            <el-menu-item index="1">
              <i class="el-icon-tickets"></i>
              <span slot="title">收费项目</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-connection"></i>
              <span slot="title">收费组合</span>
            </el-menu-item>
          </el-menu>
          <!-- 收费项目 -->
          <div
            v-if="activeMenu == 1 && activeName == 'third'"
            style="width:calc(100vw - 340px);"
          >
            <el-table :data="chargeProjectTableData" stripe>
              <el-table-column align="center" label="项目代码" prop="code" />
              <el-table-column align="center" label="项目类型" prop="type" />
              <el-table-column
                align="center"
                label="项目名称"
                width="420"
                prop="name"
              />
              <el-table-column align="center" label="规格" prop="spec" />
              <el-table-column align="center" label="单位" prop="unit" />
              <el-table-column align="center" label="单价" prop="price" />
              <el-table-column align="center" label="状态" prop="status" />
              <el-table-column align="center" label="修改类型" prop="type" />
              <el-table-column align="center" label="修改人" prop="create" />
              <el-table-column
                align="center"
                label="修改时间"
                width="160"
                prop="date"
              />
            </el-table>
          </div>
          <!-- 收费组合 -->
          <div v-if="activeMenu == 2 && activeName == 'third'"></div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <SplitPane
      :min-percent="50"
      :default-percent="50"
      split="vertical"
      v-if="activeName == 'second'"
      style="height:calc(100% - 60px);"
    >
      <template slot="paneL">
        <!-- <el-header>
          <div class="headerR">
            
          </div>
        </el-header> -->
        <el-table :data="paneLTableData" stripe height="calc(100% - 85px)">
          <el-table-column align="center" label="组合代码" prop="code" />
          <el-table-column align="center" label="组合类型" prop="type" />
          <el-table-column align="center" label="组合名称" prop="name" />
          <el-table-column align="center" label="状态" prop="status" />
          <el-table-column align="center" label="添加人" prop="create" />
          <el-table-column align="center" label="添加时间" prop="date" />
          <el-table-column align="center" width="120" label="操作">
            <template slot="header">
              <el-button
              icon="el-icon-circle-plus-outline"
              type="primary"
              @click="handleAddCharge"
              plain
              >添加</el-button
            >
            </template>
            <template slot-scope="scope">
              <div class="tableBtn">
                <el-link
                  icon="mkfont bianji1"
                  :underline="false"
                  type="warning"
                  title="编辑"
                />
                <el-link
                  icon="mkfont tingyong_line"
                  :underline="false"
                  type="danger"
                  title="停用"
                />
                <el-link
                  icon="mkfont qiyong"
                  :underline="false"
                  type="success"
                  title="启用"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-footer>
          <mk-page :pager="pager" @query="refreshList" />
        </el-footer>
      </template>
      <template slot="paneR">
        <!-- <el-header>
          <div class="headerR">
            
          </div>
        </el-header> -->
        <el-table :data="paneRTableData" stripe height="calc(100% - 85px)">
          <el-table-column align="center" label="项目代码" prop="code" />
          <el-table-column align="center" label="项目类型" prop="type" />
          <el-table-column
            align="center"
            label="项目名称"
            prop="name"
            width="240"
          />
          <el-table-column align="center" label="规格" prop="spec" width="80" />
          <el-table-column align="center" label="单位" prop="unit" width="80" />
          <el-table-column align="center" label="单价" prop="price" />
          <el-table-column align="center" label="数量" prop="count" />
          <el-table-column align="center" width="120" label="操作" fixed="right">
            <template slot="header">
              <el-button
              icon="el-icon-circle-plus-outline"
              type="primary"
              @click="handleAddCharge"
              plain
              >添加</el-button
            >
            </template>
            <template slot-scope="scope">
              <div class="tableBtn">
                <el-link
                  icon="mkfont bianji1"
                  :underline="false"
                  type="warning"
                  title="编辑"
                />
                <el-link
                  icon="mkfont tingyong_line"
                  :underline="false"
                  type="danger"
                  title="停用"
                />
                <el-link
                  icon="mkfont qiyong"
                  :underline="false"
                  type="success"
                  title="启用"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-footer>
          <mk-page :pager="pager" @query="refreshList" />
        </el-footer>
      </template>
    </SplitPane>
    <div v-if="activeName == 'third' && activeMenu == 2" class="charge-group">
      <div style="width:29.7%;border-right:1px solid #f1f1f1;margin-right:3px;">
        <el-table :data="paneRTableData" stripe>
          <el-table-column align="center" label="组合代码" prop="code" />
          <el-table-column align="center" label="组合类型" prop="type" />
          <el-table-column
            align="center"
            label="组合名称"
            prop="name"
            width="260"
          />
        </el-table>
      </div>
      <div style="width:70%">
        <el-table
          :data="paneRTableData"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="55" />
          <el-table-column
            align="center"
            label="组合名称"
            type="expand"
            prop="code"
          >
            <template slot-scope="props">
              <el-table :data="paneRTableData">
                <el-table-column align="center" label="代码" prop="code" />
                <el-table-column align="center" label="名称" prop="name" />
                <el-table-column align="center" label="规格" prop="spec" />
                <el-table-column align="center" label="单位" prop="unit" />
                <el-table-column align="center" label="数量" prop="count" />
              </el-table>
            </template>
          </el-table-column>
          <el-table-column align="center" label="修改类型" prop="type" />
          <el-table-column align="center" label="修改人" prop="create" />
          <el-table-column align="center" label="修改时间" prop="date" />
        </el-table>
      </div>
    </div>
    <template slot="footer">
      <mk-page
        :pager="pager"
        @query="refreshList"
        v-if="activeName == 'first'"
      />
      <mk-page
        :pager="pager"
        @query="refreshList"
        v-if="activeName == 'third'"
      />
    </template>
    <!-- 收费项目维护模态框 -->
    <vxe-modal
      v-model="chargeModal"
      title="收费项目维护"
      width="540"
      height="auto"
      :showFooter="true"
    >
      <el-form
        :model="chargeForm"
        ref="chargeForm"
        :rules="chargeRule"
        label-width="100px"
      >
        <el-form-item label="项目类型">
          <el-input />
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input />
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center;">
        <el-button type="" @click="chargeModal = false">关闭</el-button>
      </div>
    </vxe-modal>
    <!-- 对比模态框 -->
    <vxe-modal
      v-model="comparisonModal"
      title="项目对比"
      width="840"
      height="auto"
      :showFooter="true"
    >
      <el-table :data="multipleSelection" stripe>
        <el-table-column align="center" label="组合代码" prop="code" />
        <el-table-column align="center" label="组合类型" prop="type" />
        <el-table-column
          align="center"
          label="组合名称"
          prop="name"
          width="260"
        />
      </el-table>
      <div slot="footer" style="text-align:center;">
        <el-button type="" @click="comparisonModal = false">关闭</el-button>
      </div>
    </vxe-modal>
  </d2-container>
</template>

<script>
export default {
  name: "chargeProjectMaintain",
  computed: {},
  data() {
    return {
      activeName: "third",
      activeMenu: 2,
      chargeModal: false,
      comparisonModal: false,
      chargeForm: {},
      // 收费项目维护表格
      chargeProjectTableData: [
        {
          code: 10000,
          type: "服务费",
          name: "全面健康评估，定制个性化体检方案。",
          spec: "次",
          unit: "次",
          price: "1000",
          status: "有效",
          create: "姜纪林",
          date: "2019-12-24 12:12:12"
        },
        {
          code: 10001,
          type: "服务费",
          name: "建立健康档案，定制健康管理方案。",
          spec: "次",
          unit: "次",
          price: "1000",
          status: "有效",
          create: "姜纪林",
          date: "2019-12-24 12:12:12"
        },
        {
          code: 10002,
          type: "检验费",
          name: "白细胞计数(WBC)。",
          spec: "次",
          unit: "次",
          price: "1000",
          status: "有效",
          create: "姜纪林",
          date: "2019-12-24 12:12:12"
        }
      ],
      // 收费组合维护左边表格
      paneLTableData: [
        {
          code: 10000,
          type: "服务费",
          name: "白银权益",
          spec: "次",
          unit: "次",
          price: "1000",
          status: "有效",
          create: "姜纪林",
          date: "2019-12-24 12:12:12"
        },
        {
          code: 10001,
          type: "服务费",
          name: "金卡权益",
          spec: "次",
          unit: "次",
          price: "1000",
          status: "有效",
          create: "姜纪林",
          date: "2019-12-24 12:12:12"
        },
        {
          code: 10002,
          type: "检验",
          name: "血常规。",
          spec: "次",
          unit: "次",
          price: "1000",
          status: "有效",
          create: "姜纪林",
          date: "2019-12-24 12:12:12"
        },
        {
          code: 10002,
          type: "检验",
          name: "尿常规。",
          spec: "次",
          unit: "次",
          price: "1000",
          status: "有效",
          create: "姜纪林",
          date: "2019-12-24 12:12:12"
        }
      ],
      // 收费组合维护右边表格
      paneRTableData: [
        {
          code: 10000,
          type: "服务费",
          name: "全面健康评估，定制个性化体检方案。",
          spec: "次",
          unit: "次",
          price: "1000",
          count: 1,
          status: "有效",
          create: "姜纪林",
          date: "2019-12-24 12:12:12"
        },
        {
          code: 10001,
          type: "服务费",
          name: "建立健康档案，定制健康管理方案。",
          spec: "次",
          unit: "次",
          price: "1000",
          count: 1,
          status: "有效",
          create: "姜纪林",
          date: "2019-12-24 12:12:12"
        },
        {
          code: 10002,
          type: "服务费",
          name: "免费参加健康教育或健康讲座。",
          spec: "次",
          unit: "次",
          price: "1000",
          count: 1,
          status: "有效",
          create: "姜纪林",
          date: "2019-12-24 12:12:12"
        },
        {
          code: 10002,
          type: "服务费",
          name: "每月定期健康短信或微信提醒",
          spec: "次",
          unit: "次",
          price: "1000",
          count: 1,
          status: "有效",
          create: "姜纪林",
          date: "2019-12-24 12:12:12"
        }
      ],
      // 修改日志——收费项目
      // chargeProjectTableData: [{}],
      // 修改日志——收费组合
      chargeGroupTableData: [{}],
      // 收费项目维护校验
      chargeRule: {},
      pager: {
        count: 0,
        row: 10,
        page: 1,
        CONDITION: ""
      },
      searchCondition: {
        date: "",
        type: ""
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
      multipleSelection: []
    };
  },
  created() {},
  methods: {
    init() {},
    // 新增费用按钮
    handleAddCharge(key) {
      if (key === "收费项目维护") {
        this.chargeModal = true;
      }
    },
    refreshList() {},
    handleSelectMenu(key, path) {
      console.log(key, path);
      this.activeMenu = key;
    },
    // 对比选择表单
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    // 对比
    handleDataComparison() {
      if (this.multipleSelection.length < 2) {
        this.$message({
          message: "请选择两个以上项目进行对比",
          type: "warning"
        });
      } else {
        this.comparisonModal = true;
      }
    }
  }
};
</script>

<style scoped>
.inputShort {
  width: 240px;
}
.mr20 {
  margin-right: 20px;
}
.charge-group {
  width: calc(100% - 160px);
  position: absolute;
  top: 55px;
  left: 160px;
  display: flex;
}
.charge-group > div {
  /* height: calc(1000px - 60px); */
}
</style>
