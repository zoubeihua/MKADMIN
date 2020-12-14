<template>
  <d2-container>
     <template slot="header">
      <div class="headerR">
        <el-button icon="el-icon-circle-plus-outline" type="primary" plain>添加条件</el-button>
      </div>
     </template>
    <SplitPane :min-percent="20" :default-percent="30" split="vertical">
      <template slot="paneL">
        <SplitPane :min-percent="50" :default-percent="50" split="vertical">
          <template slot="paneL">
            <el-table :data="riskCateList" highlight-current-row stripe height="100%">
              <el-table-column label="风险分类名称" show-overflow-tooltip align="center" prop="catename" />
            </el-table>
          </template>
          <template slot="paneR">
            <el-table :data="riskTypeList" highlight-current-row stripe height="100%">
              <el-table-column label="风险类型" show-overflow-tooltip align="center" prop="catetype" />
              <el-table-column label="状态" show-overflow-tooltip align="center" prop="state" />
            </el-table>
          </template>
        </SplitPane>
      </template>
      <template slot="paneR">
         <el-container>
        <el-table :data="conditionList" stripe height="100%">
          <el-table-column label="问卷名称" show-overflow-tooltip align="center" prop >
            <template>
              <mk-select
                size="mini"
                :filter="['label']"
                :datas="[{label:'生活习惯',val:'1'}]"
              />
            </template>
          </el-table-column>
          <el-table-column label="项目名称" show-overflow-tooltip  align="center" prop >
            <template>
              <mk-select
                size="mini"
                :filter="['label']"
                :datas="[{label:'是否吸烟',val:'1'}]"
              />
            </template>
          </el-table-column>
          <el-table-column label="运算符" show-overflow-tooltip align="center" prop >
            <template>
              <mk-select
                size="mini"
                :filter="['label']"
                :datas="[{label:'等于',val:'1'}]"
              />
            </template>
          </el-table-column>
          <el-table-column label="连接符" show-overflow-tooltip align="center" prop >
             <template>
              <mk-select
                size="mini"
                :filter="['label']"
                :datas="[{label:'并且',val:'1'}]"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" >
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
            <mk-page :pager="pagercondition" @query="refreshcondition" />
          </el-footer>
         </el-container>
      </template>
    </SplitPane>
    <!-- <vxe-modal v-model="rightsAndInterestsModal" title="问卷添加" width="540" height="540">

    </vxe-modal> -->
  </d2-container>
</template>

<script>
export default {
  name: "questionevalua",
  computed: {},
  data() {
    return {
      pagercondition:{
        count: 0,
        page: 1,
        rows: 10
      },
      riskCateList:[{
        catename:'正常人群'
      }],
      riskTypeList:[{
        catetype:'1级',
        state:'启用'
      }],
      conditionList:[{}]
    };
  },
  created() {},
  methods: {
    refreshcondition(){}
  }
};
</script>

<style  scoped>
</style>
