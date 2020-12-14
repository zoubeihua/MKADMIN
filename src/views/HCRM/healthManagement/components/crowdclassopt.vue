<template>
  <el-container>
    <el-main style="padding:0;">
      <el-table :data="crowdclassList" stripe height="100%">
        <el-table-column label="风险分类名称" show-overflow-tooltip align="center"  />
        <el-table-column label="风险分类类别" show-overflow-tooltip align="center"  />
      </el-table>
    </el-main>
    <el-footer style="justify-content: center;">
        <el-button-group>
          <el-button type="primary">确定</el-button>
          <el-button type="warning" @click="closeCrowClassModel">关闭</el-button>
        </el-button-group>
    </el-footer>
  </el-container>
</template>
<script>
export default {
  inject:['closeCrowClassModel'],
  data() {
    return {
      crowdclassList:[]
    }
  },
  methods:{
    closeModel(){
      // this.crowClassModel = true;
      alert(this.crowClassModel)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
