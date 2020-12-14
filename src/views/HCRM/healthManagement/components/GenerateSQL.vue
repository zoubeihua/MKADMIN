<template>
  <el-container v-if="Modal">
    <vxe-modal v-model="Modal" :showFooter="true" title="SQL语句生成器" width="1200" height="600">
      <code-editor height="100%" width="100%" mode="sql" :key="key" v-model="sql" v-if="Modal"></code-editor>
      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="info" icon="el-icon-notebook-2"  @click="Formatter(sql)">格式化</el-button>
          <el-button type="info" icon="el-icon-magic-stick"  @click="testSql">测试sql语句</el-button>
          <el-button type="success"  @click="submitData" :disabled="!flag">提交</el-button>
          <el-button type="warning" @click="Modal=false">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
  </el-container>
</template>
<script>
import CodeEditor from "@c/mkmakingform/components/CodeEditor/index";
import sqlFormatter from "sql-formatter";
export default {
  name: "generatesql",
  components:{
    CodeEditor
  },
  data() {
    return {
      key:new Date().getTime(),
      Modal:false,
      flag:false,
      sql:'',
      resData:{}
    };
  },
  mounted(){


  },
  computed:{

  },
  methods: {
    open(data,sql){
      if(data){
        this.flag = false;
        this.resData = data;
        this.Modal = true;
        this.Formatter(sql)
      }
    },
    // 测试sql语句
    testSql(){
       this.MK.Request(
        "/Hcrm/Riskevaluation/sql_Test",
        "post",
        {sql:this.sql}
      ).then(res => {
        if (res.code == 0) {
          this.$message({
            type:'success',
            message:res.msg
          })
          this.flag = true;
        }else{
          this.flag = false;
        }
      });
    },
    close(){
      this.Modal = false;
    },
    Formatter(sql) {
      var formatSql = sqlFormatter.format(sql, {
        language: "sql",
        indent: ""
      });
      this.sql = formatSql;
      this.key = new Date().getTime();
    },
    submitData(){
      this.toFormModal = false;
      this.resData.condition = this.sql;
      this.$emit('change', this.resData)
    }
  }
};
</script>
