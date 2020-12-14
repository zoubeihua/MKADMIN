<template>
  <d2-container>
    <template slot="header">
       <div class="headerR">
         <el-button-group>
          <el-button type="primary" >保存</el-button>
          <el-button type="success">发布</el-button>
          <el-button icon="el-icon-circle-plus-outline" type="primary" plain>添加</el-button>
        </el-button-group>
       </div>
    </template>
    <SplitPane :min-percent="20" :default-percent="50" split="vertical">
      <template slot="paneL">
        <el-container>
        <el-table :data="memberUserInfoList" highlight-current-row stripe height="100%">
          <el-table-column label="会员卡号" show-overflow-tooltip align="center" prop="hykh" />
          <el-table-column label="会员姓名" show-overflow-tooltip  align="center" prop="hyxm" />
          <el-table-column label="会员类型" show-overflow-tooltip align="center" prop="hylx" />
          <el-table-column label="会员等级" show-overflow-tooltip align="center" prop="hydj" />
          <el-table-column label="问卷日期" show-overflow-tooltip align="center" prop="wjrq" />
          <el-table-column label="推荐方案" show-overflow-tooltip align="center" >
             <template>
               <el-link type="primary">健康人群方案</el-link>
            </template>
          </el-table-column>
          <el-table-column label="问卷查看" show-overflow-tooltip align="center" prop >
            <template>
                <el-link type="primary" @click="quesitonSee">男性健康</el-link>
            </template>
          </el-table-column>
        </el-table>
         <el-footer>
          <mk-page :pager="pagermemberUserInfo" @query="refreshmemberUserInfo" />
        </el-footer>
        </el-container>
      </template>
      <template slot="paneR">
         <el-container>
        <el-table :data="physicalCheckupList" stripe height="100%">
          <el-table-column label="科室" show-overflow-tooltip align="center" prop="ks"  />
          <el-table-column label="限制性别" show-overflow-tooltip  align="center" prop="xb"  />
          <el-table-column label="项目名称" show-overflow-tooltip align="center" prop="mc"  />
          <el-table-column label="单位" show-overflow-tooltip  align="center" prop="dw"  />
          <el-table-column label="数量" show-overflow-tooltip  align="center" prop="sl"  />
          <el-table-column align="center" width="200" label="操作">
            <template>
              <div class="tableBtn">
                <i class="mkfont trasch" title="删除"></i>
                <i class="mkfont shangyi" title="上移"></i>
                <i class="mkfont xiayi" title="下移"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
          <el-footer>
            <mk-page :pager="pagerphysicalCheckup" @query="refreshphysicalCheckup" />
          </el-footer>
         </el-container>
      </template>
    </SplitPane>
      <vxe-modal v-model="questionLookModel" title="问卷查看" width="880" height="540">
        <question-look></question-look>
      </vxe-modal>
  </d2-container>

</template>
<script>
import QuestionLook from './components/questionlook'
export default {
  name:'physicalsplan',
  components:{
    QuestionLook
  },
  data(){
    return {
      questionLookModel:false,
      pagermemberUserInfo:{
        count: 0,
        page: 1,
        rows: 10
      },
      pagerphysicalCheckup:{
        count: 0,
        page: 1,
        rows: 10
      },
      memberUserInfoList:[{
        hykh:'1002003001',
        hyxm:'马俊华',
        hylx:'家庭会员',
        hydj:'VIP钻石',
        wjrq:'2019-12-24',
      }],
      physicalCheckupList:[{
       ks:'耳鼻喉科',
       xb:'男性',
       mc:'耳鼻喉常规',
       dw:'次',
       sl:'1',
      }]
    }
  },
  methods:{
    refreshmemberUserInfo(){},
    refreshphysicalCheckup(){},
    quesitonSee(){
      this.questionLookModel = true;
    },
  }
}
</script>
<style  scoped>
</style>
