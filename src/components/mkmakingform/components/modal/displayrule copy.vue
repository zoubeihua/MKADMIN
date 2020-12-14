<template>
  <div>
    <vxe-modal
      v-model="display"
      width="1000"
      height="600"
      ref="displayRuleModal"
      :showFooter="true"
      min-width="400"
      min-height="400"
      resize
    >
      <div slot="header">显示条件设置</div>
      <el-container>
        <el-header>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="满足一下条件">
              <el-select v-model="formInline.rule">
                <el-option label="全部" value="and"></el-option>
                <el-option label="任意" value="or"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="将">
              <el-select v-model="formInline.state">
                <el-option label="显示" value="show"></el-option>
                <el-option label="隐藏" value="hide"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="Add">添加</el-button>
            </el-form-item>
          </el-form>
        </el-header>
        <el-main style="padding:0;">
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column label="流程节点" width="180">
              <template slot-scope="scope">
                <el-select v-model="scope.row.result[0].crf_id" placeholder="请选择" @change="handleResearchItemValChange($event,scope.$index)">
                    <el-option
                    v-for="item in ProcessList"
                    :key="item.PROCESSID"
                    :label="item.PROCESSNAME"
                    :value="item.PROCESSID">
                    </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="表单名称" width="180">
              <template slot-scope="scope">
                <el-select v-model="scope.row.result[0].dataset_id" placeholder="请选择" @change="CRFFormChange($event,scope.$index)">
                  <el-option
                    v-for="item in scope.row.result[0].dataset_list"
                    :key="item.CRFID"
                    :label="item.CRFNAME"
                    :value="item.CRFID">
                    </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="表单控件">
              <template slot-scope="scope">
                 <el-select v-model="scope.row.result[0].interview_id" placeholder="请选择" >
                  <el-option
                    v-for="item in scope.row.result[0].interview_list"
                    :key="item.FIELDID"
                    :label="item.FIELDNAME"
                    :value="item.FIELDID">
                    </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="条件">
              <template slot-scope="scope"></template>
            </el-table-column>
            <el-table-column label="控件对应的值">
              <template slot-scope="scope">
                <el-select v-model="scope.row.result[0].interview_id" placeholder="请选择" >
                  <el-option
                    v-for="item in scope.row.result[0].interview_list"
                    :key="item.FIELDID"
                    :label="item.FIELDNAME"
                    :value="item.FIELDID">
                    </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" circle @click="Del(scope.$index)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
      <div slot="footer">
        <el-button type="success" @click="savedisplayRuleModal">确认</el-button>
        <el-button type="danger" @click="closedisplayRuleModal">取消</el-button>
      </div>
    </vxe-modal>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "display-rule",
  props: {
    data: {
      type: Object
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState("d2admin/user", ["info"])
  },
  data() {
    return {
      //微服务架构认证
      Auth: {
        Process: {
          app: "82f4ba2f6e5c495bbc46c8dab377706d",
          mod: "xmlcgl"
        },
        CRFForm: {
          app: '63b1657f3b0747d993d1b8a1a8fed742',
          mod: 'crfwf'
        },
        FieldInfo: {
          app: '63b1657f3b0747d993d1b8a1a8fed742',
          mod: 'crfwf'
        }
      },
      type:'',//控件类型
      //节点
      ProcessList: [],
      display: this.visible,
      option: {},
      formInline: {
        rule: "and",
        state: "show"
      },
      tableData: [],
    };
  },
  created() {
      this.option = JSON.parse(JSON.stringify(this.data))
      this.type = this.data.type;
      this.tableData = JSON.parse(JSON.stringify(this.option.options.condition))
      this.get_researchItem_process()
  },
  methods: {
    //获取科研项目流程节点信息
    get_researchItem_process() {
      this.MK.Request(
        'researchItem_Process_Get',
        "GET",
        { RESEARCHID: this.info.RESEARCHID },
        this.Auth.Process
      ).then(res => {
          this.ProcessList = res.data;
      });
    },
    //节点更改事件
    handleResearchItemValChange(val,index){
      this.CRFFormByPROCESSID_Get(val,index)
    },
    //
    //根据节点ID获取对应的表单列表
    CRFFormByPROCESSID_Get(val,index) {
       this.MK.Request(
        'CRFFormByPROCESSID_Get',
        "GET",
        { PROCESSID: val},
        this.Auth.CRFForm
      ).then(res => {
          this.tableData[index].result[0].dataset_id = "";
          this.tableData[index].result[0].dataset_list = res.data;
      });
    },
    //表单名称更改事件
    CRFFormChange(val,index){
      this.FieldInfo_Get(val,index);
    },
    //根据表单名称获取对应的控件
    FieldInfo_Get(val,index){
       this.MK.Request(
        'FieldInfo_Get',
        "GET",
        { CRFID: val,RESEARCHID: this.info.RESEARCHID},
        this.Auth.FieldInfo
      ).then(res => {
          this.tableData[index].result[0].interview_id = "";
          this.tableData[index].result[0].interview_list = res.data;
      });
    },
    savedisplayRuleModal() {
      console.log(this.option);
      this.$emit("change", this.tableData);
      // this.data =  this.option.options.condition
      this.display = false;
    },
    closedisplayRuleModal() {
      this.display = false;
      console.log('closed', this.data.options.condition)
      this.tableData = JSON.parse(JSON.stringify(this.data.options.condition));
    },
    //添加条件
    Add() {
      let data = {
        //条件
        action: "show", //显示隐藏状态
        condition: "or", //条件关系 or或 and 并且
        result: [
          {
            //关联表单信息
            action: "eq", //eq等于 ne不等于 gt大于 lt小于 ge大于等于 le 小于等于
            crf_id: "", //节点id
            crf_list: this.ProcessList,//节点列表
            dataset_id: "", //表单id
            dataset_list: [],//表单列表
            interview_id: "", //控件id 即控件字段标识
            interview_list: [],//控件列表
            options_list: [],//数据源
            options: [{ label: "", value: "" }], //关联控件的最终值
            type: "" //关联控件类型
          }
        ]
      };
      this.tableData.push(data);
    },
    //删除
    Del(index) {
      this.tableData.splice(index, 1);
    }
  },
  watch: {
    // tableData: {
    //   deep: true,
    //   handler(val) {
    //     this.option.options.condition = val
    //   }
    // },
    visible(val) {
      this.display = val;
    },
    display(val) {
      this.$emit("update:visible", val);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>