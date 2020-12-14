<template>
  <d2-container>
    <template slot="header">
      <div class="page-header">
        <el-form v-model="memberInfoForm" inline label-width="55px">
          <el-form-item label="卡号">
            <el-input class="input" v-model="memberInfoForm.memberid" readonly />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input class="input" v-model="memberInfoForm.name" readonly />
          </el-form-item>
          <el-form-item label="性别">
            <el-input style="width:50px;" v-model="memberInfoForm.sex" readonly />
          </el-form-item>
          <el-form-item label="年龄">
            <el-input class="input" v-model="memberInfoForm.memberid" readonly />
          </el-form-item>
          <el-form-item label="类型">
            <el-input class="input" v-model="memberInfoForm.type" readonly />
          </el-form-item>
          <el-form-item label="等级">
            <el-input class="input" v-model="memberInfoForm.level" readonly />
          </el-form-item>
          <el-form-item label="余额">
            <el-input class="input" v-model="memberInfoForm.money" readonly />
          </el-form-item>
          <el-form-item label="积分">
            <el-input class="input" v-model="memberInfoForm.point" readonly />
          </el-form-item>
          <el-form-item label="优惠券">
            <el-input class="input" v-model="memberInfoForm.coupon" readonly />
          </el-form-item>
          <el-form-item label="状态">
            <el-input style="width:70px" v-model="memberInfoForm.status" readonly />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <SplitPane :min-percent="20" :default-percent="30" split="vertical">
      <template slot="paneL">
        <SplitPane :min-percent="50" :default-percent="70" split="vertical">
          <template slot="paneL">
            <el-table :data="tableLeft" stripe :default-sort="{prop: 'date', order: 'descending'}">
              <el-table-column align="center" label="类型" prop="type" sortable></el-table-column>
              <el-table-column align="center" label="就诊日期" prop="date" sortable></el-table-column>
            </el-table>
          </template>
          <template slot="paneR">
            <el-container>
              <el-table
                :data="tableMiddle"
                stripe
                row-key="id"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              >
                <el-table-column align="center" label="病历信息" prop="name" />
              </el-table>
            </el-container>
          </template>
        </SplitPane>
      </template>
      <template slot="paneR">
        <el-container>
          <el-table :data="tableRight" stripe>
            <el-table-column align="center" label="医嘱类别" prop="type" />
            <el-table-column align="center" label="医嘱名称" prop="name" />
            <el-table-column align="center" label="规格" prop="spec" />
            <el-table-column align="center" label="用量" prop="dosage" />
            <el-table-column align="center" label="用法" prop="usage" />
            <el-table-column align="center" label="途径" prop="approach" />
            <el-table-column align="center" label="频次" prop="frequency" />
            <el-table-column align="center" label="天数" prop="last" />
          </el-table>
        </el-container>
      </template>
    </SplitPane>
  </d2-container>
</template>

<script>
export default {
  name: "memberViews",
  computed: {},
  data() {
    return {
      memberInfoForm: {
        memberid: 88888888,
        name: "姜纪林",
        sex: "男",
        age: "18",
        type: "家庭会员",
        level: "钻石会员",
        money: "88888888",
        point: "88888888",
        coupon: "88888888",
        status: "有效"
      },
      tableLeft: [
        { type: "门诊", date: "2020-03-12" },
        { type: "住院", date: "2020-04-09" },
        { type: "门诊", date: "2020-04-21" }
      ],
      tableRight: [
        {
          type: "西药",
          name: "阿莫西林颗粒",
          spec: "125mg/包*12/盒",
          dosage: "125mg/包",
          usage: "温水冲服",
          approach: "遵医嘱",
          frequency: "一日两次",
          last: "2"
        }
      ],
      tableMiddle: [
        {
          id: 100,
          name: "出院小结"
        },
        {
          id: 101,
          name: "医嘱信息",
          children: [
            {
              id: 102,
              name: "西成药医嘱"
            },
            {
              id: 103,
              name: "中草药医嘱"
            },
            {
              id: 104,
              name: "非医药医嘱"
            }
          ]
        }
      ]
    };
  },
  created() {},
  methods: {}
};
</script>

<style scoped>
.input {
  width: 100px;
}
</style>