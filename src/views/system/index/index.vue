<template>
  <d2-container >
    <div class="page">
      <el-row :gutter="20">
        <el-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
          <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
            <d2-count-up :end="infor.count" class="count-style"/>
            <p>{{ infor.title }}</p>
          </infor-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 10px;">
         <el-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <mk-card shadow>
          <mk-chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></mk-chart-pie>
        </mk-card>
      </el-col>
      <el-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <mk-card shadow>
          <mk-chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
        </mk-card>
      </el-col>
      </el-row>
    </div>
  </d2-container>
</template>

<script>
import MkCard from '@/components/mk-form/mk-card'
import InforCard from '@/components/mk-form/mk-info-card'
import MkChartPie from '@/components/mk-form/mk-charts/pie'
import MkChartBar from '@/components/mk-form/mk-charts/bar'
export default {
  components: {
    MkCard,
    InforCard,
    MkChartPie,
    MkChartBar
  },
  data(){
    return {
      inforCardData: [
        { title: '新增用户', icon: 'user-plus', count: 803, color: '#2d8cf0' },
        { title: '累计点击', icon: 'dot-circle-o', count: 232, color: '#19be6b' },
        { title: '新增问答', icon: 'question-circle', count: 142, color: '#ff9900' },
        { title: '分享统计', icon: 'share-alt', count: 657, color: '#ed3f14' },
        { title: '新增互动', icon: 'wechat', count: 12, color: '#E46CBB' },
        { title: '新增页面', icon: 'clipboard', count: 14, color: '#9A66E4' }
      ],
      pieData: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.page {
  width: 100%;
  height: 100%;
  padding: 18px !important;
  background-color: #f5f7f9 !important;
  .count-style{
    font-size: 50px;
    color: #515a6e;
  }
  p{
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
