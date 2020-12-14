<template>
  <d2-container>
    <template slot="header">
      <div class="headerR">
        <el-button-group>
          <el-button type="success">启用</el-button>
          <el-button type="danger">停用</el-button>
          <el-button type="primary">审核</el-button>
          <el-button type="warning">拒绝</el-button>
        </el-button-group>
      </div>
    </template>
    <SplitPane :min-percent="50" :default-percent="50" split="vertical">
      <template slot="paneL">
        <SplitPane :min-percent="70" :default-percent="70" split="vertical">
          <template slot="paneL">
            <el-header>
              <div class="headerR">
                <el-button icon="el-icon-circle-plus-outline" type="primary" plain>添加</el-button>
              </div>
            </el-header>
            <el-table :data="mealTableData" stripe border>
              <el-table-column align="center" label="名称" prop="name" />
              <el-table-column align="center" label="类型" prop="type" />
              <el-table-column align="center" label="有效期" prop="date" />
              <el-table-column align="center" label="状态" prop="status" />
              <el-table-column align="center" width="120" label="操作">
                <template slot-scope="scope">
                  <div class="tableBtn">
                    <i class="mkfont trasch" title="删除" />
                    <i class="mkfont shangyi" title="上移" />
                    <i class="mkfont xiayi" title="下移" />
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template slot="paneR">
            <el-header>
              <div class="headerR">
                <el-button icon="el-icon-circle-plus-outline" type="primary" plain>添加</el-button>
              </div>
            </el-header>
            <el-table :data="mealTypeTableData" stripe border>
              <el-table-column align="center" label="分类名称" prop="name" />
              <el-table-column align="center" width="120" label="操作">
                <template slot-scope="scope">
                  <div class="tableBtn">
                    <i class="mkfont trasch" title="删除" />
                    <i class="mkfont shangyi" title="上移" />
                    <i class="mkfont xiayi" title="下移" />
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </SplitPane>
      </template>
      <template slot="paneR">
        <el-container>
          <el-header>
            <div class="headerR">
              <el-button icon="el-icon-circle-plus-outline" type="primary" plain>添加</el-button>
            </div>
          </el-header>
          <el-table :data="mealInfoTableData" stripe border height="calc(100% - 60px)">
            <el-table-column align="center" label="项目类型" prop="type" />
            <el-table-column align="center" label="项目名称" prop="name" />
            <el-table-column align="center" label="规格" prop="spec" />
            <el-table-column align="center" label="单位" prop="unit" />
            <el-table-column align="center" label="数量" prop="count" width="80" />
            <el-table-column align="center" label="单价" prop="price" />
            <el-table-column align="center" label="金额" prop="account" />
            <el-table-column align="center" width="120" label="操作">
              <template slot-scope="scope">
                <div class="tableBtn">
                  <i class="mkfont trasch" title="删除" />
                  <i class="mkfont shangyi" title="上移" />
                  <i class="mkfont xiayi" title="下移" />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-footer>
            <mk-page :pager="pagerMealInfo" @query="refreshList" />
          </el-footer>
        </el-container>
      </template>
    </SplitPane>
  </d2-container>
</template>

<script>
export default {
  name: "mealinfoMaintain",
  computed: {},
  data() {
    return {
      pagerMeal: {
        count: 0,
        page: 1,
        rows: 10,
        condition: ""
      },
      pagerMealInfo: {
        count: 0,
        page: 1,
        rows: 10,
        condition: ""
      },
      mealTableData: [
        {
          name: "孕产套餐",
          type: "可分次",
          date: "2030-12-31",
          status: "审核"
        },
        {
          name: "疫苗接种",
          type: "可分次",
          date: "2030-12-31",
          status: "审核"
        },
        { name: "人工流产", type: "可分次", date: "2030-12-31", status: "审核" }
      ],
      mealTypeTableData: [{ name: "检验" }, { name: "检验" }, { name: "挂号" }],
      mealInfoTableData: [
        {
          type: "检验",
          name: "尿常规",
          spec: "次",
          unit: "次",
          count: 1,
          price: "20.00",
          account: "20.00"
        },
        {
          type: "检验",
          name: "衣原体检查",
          spec: "次",
          unit: "次",
          count: 1,
          price: "20.00",
          account: "20.00"
        },
        {
          type: "检验",
          name: "胎心监测",
          spec: "次",
          unit: "次",
          count: 1,
          price: "20.00",
          account: "20.00"
        },
        {
          type: "检验",
          name: "脐血流检测",
          spec: "次",
          unit: "次",
          count: 1,
          price: "20.00",
          account: "20.00"
        }
      ]
    };
  },
  created() {},
  methods: {
    refreshList() {}
  }
};
</script>

<style>
</style>