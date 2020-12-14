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
      <div slot="header">禁用/启用条件设置 <span style="color:red;"> [ {{data.name}} - {{data.model}} ] </span></div>
      <el-container>
        <el-header>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="满足一下条件">
              <el-select v-model="formInline.rule" @change="ruleChange">
                <el-option label="全部" value="and"></el-option>
                <el-option label="任意" value="or"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="将">
              <el-select v-model="formInline.state" @change="stateChange">
                <el-option label="启用" :value="false"></el-option>
                <el-option label="禁用" :value="true"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="Add">添加</el-button>
            </el-form-item>
          </el-form>
        </el-header>
        <el-main style="padding:0;">
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column label="表单控件">
              <template slot-scope="scope">
                <el-select
                  filterable
                  clearable
                  v-model="scope.row.result[0].interview_id"
                  placeholder="请选择"
                  @change="controlChang($event,scope.$index)"
                >
                  <el-option
                    v-for="item in controlList"
                    :key="item.model"
                    :label="item.name"
                    :value="item.model"
                  >
                    <span style="float: left;font-size:13px;">{{ item.name }}</span>
                    <span style="float: right;margin-left:10px; color: #8492a6; font-size: 12px">{{ item.model }}</span>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="条件">
              <template slot-scope="scope">
                <el-select v-model="scope.row.result[0].action">
                <el-option label="等于" value="eq"></el-option>
                <el-option label="不等于" value="ne"></el-option>
                <el-option label="大于" value="gt"></el-option>
                <el-option label="小于" value="lt"></el-option>
                <el-option label="大于等于" value="ge"></el-option>
                <el-option label="小于等于" value="le"></el-option>
              </el-select>
              </template>
            </el-table-column>
            <el-table-column label="控件对应的值">
              <template slot-scope="scope">
                <template
                  v-if="scope.row.result[0].type == 'select' || scope.row.result[0].type == 'radio'"
                >
                  <el-select
                    v-model="scope.row.result[0].options_id"
                    placeholder="请选择"
                    @change="selectChange($event,0,scope.$index)"
                  >
                    <el-option
                      v-for="item in scope.row.result[0].options_list"
                      :key="item.value"
                      :label="item.label"
                      :value="`${item.value}|${item.label}`"
                    ></el-option>
                  </el-select>
                </template>
                <template v-else-if="scope.row.result[0].type == 'checkbox'">
                  <el-select
                    v-model="scope.row.result[0].options_id"
                    multiple
                    placeholder="请选择"
                    @change="selectChange($event,'checkbox',scope.$index)"
                  >
                    <el-option
                      v-for="item in scope.row.result[0].options_list"
                      :key="item.value"
                      :label="item.label"
                      :value="`${item.value}|${item.label}`"
                    ></el-option>
                  </el-select>
                </template>
                <template v-else-if="scope.row.result[0].type == 'date'">
                  <el-date-picker
                    v-model="scope.row.result[0].options_id"
                    type="date"
                    @change="selectChange($event,0,scope.$index)"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </template>
                <template v-else-if="scope.row.result[0].type == 'time'">
                    <el-time-picker
                      v-model="scope.row.result[0].options_id"
                      arrow-control
                      clearable
                      value-format="HH:mm:ss"
                      @change="selectChange($event,0,scope.$index)"
                    ></el-time-picker>
                </template>
                <template v-else-if="scope.row.result[0].type == 0">布局字段</template>
                <template v-else>
                  <el-input v-model="scope.row.result[0].options_id" @input="selectChange($event,0,scope.$index)" placeholder="请输入内容"></el-input>
                </template>
              </template>
            </el-table-column>
            <!-- <el-table-column label="显示状态">
               <template slot-scope="scope">
                 <el-select v-model="scope.row.action">
                <el-option label="显示" value="show"></el-option>
                <el-option label="隐藏" value="hide"></el-option>
              </el-select>
               </template>
            </el-table-column> -->
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
    },
    list: {
      type: Array
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
          app: "63b1657f3b0747d993d1b8a1a8fed742",
          mod: "crfwf"
        },
        FieldInfo: {
          app: "63b1657f3b0747d993d1b8a1a8fed742",
          mod: "crfwf"
        }
      },
      //控件列表
      controlList: [],
      display: this.visible,
      option: {},
      formInline: {
        rule: "and",
        state: false //默认启用
      },
      tableData: []
    };
  },
  created() {
    console.log(this.list);
    this.controlList = [];
    this.getAllControl(this.list);
    this.option = JSON.parse(JSON.stringify(this.data));
    this.tableData = JSON.parse(JSON.stringify(this.option.options.disabledition));
    if (this.tableData.length > 0) {
      this.formInline.rule = this.tableData[0].condition;
      this.formInline.state = this.tableData[0].action;
    }
  },
  methods: {
    //表单控件更改事件
    controlChang(val, index) {
      this.index = index;
      this.controlValue_Get(val, index);
    },
    //
    //根据表单控件获取对应的值
    controlValue_Get(val, index) {
      let field = this.mapControl(this.list, val);
      let value;
      if (field) {
        if (
          field.type == "radio" ||
          field.type == "checkbox" ||
          field.type == "select"
        ) {//根据不同控件赋值不同类型数据
          value = field.options.options;
        } else {
          value = field.options.defaultValue;
        }
        this.tableData[index].result[0].type = field.type;//设置所关联控件类型
      } else {
        this.tableData[index].result[0].type = 0;//布局字段统一设置类型为0
      }
      this.$set(this.tableData[index].result[0],'options_id',field.type == 'checkbox' ? [] : '')
      this.tableData[index].result[0].options_list = value;
    },
    //判断条件or and
    ruleChange(val){
      if(this.tableData.length > 0){
        for(let i = 0; i < this.tableData.length;i++){
           this.$set(this.tableData[i],'condition',val)
        }
      }
    },
    //启用/禁用状态更改事件
    stateChange(val){
      if(this.tableData.length > 0){
        for(let i = 0; i < this.tableData.length;i++){
           this.$set(this.tableData[i],'action',val)
        }
      }
    },
    //表单值更改事件
    selectChange(val,type,index){
      this.tableData[index].result[0].options = []
      if(type == 'checkbox'){
        for(let i = 0; i < val.length; i++){
          let strArr = val[i].split('|');
          let value = strArr[0];
          let label = strArr[1];
          let opt = {
            label:label,
            value:value
          };
          this.tableData[index].result[0].options.push(opt)
        }
      }else{
        let strArr = val.split('|');
        let value = strArr[0];
        let label = strArr[1];
        let opt = {
          label:label,
          value:value
        };
        this.tableData[index].result[0].options.push(opt)
      }
    },
    //获取所有的控件
    getAllControl(list){
      for (let i = 0; i < list.length; i++) {
        if (
          list[i].type === "grid" ||
          list[i].type === "rowmatrix"
        ) {
           this.controlList.push(list[i])
          for (let item of list[i].columns) {
            this.getAllControl(item.list);
          }
        } else if (list[i].type === "tabs") {
           this.controlList.push(list[i])
          for (let item of list[i].tabs) {
            this.getAllControl(item.list);
          }
        } else {
          if (list[i].type === "table") {
             this.controlList.push(list[i])
            for (let index in list[i].tableColumns) {
               this.controlList.push(list[i].tableColumns[index])
            }
          } else {
              this.controlList.push(list[i])
          }
        }
      }
    },
    //递归控件
    mapControl(controlList, field) {
      for (let i = 0; i < controlList.length; i++) {
        if (
          controlList[i].type === "grid" ||
          controlList[i].type === "rowmatrix"
        ) {
          for (let item of controlList[i].columns) {
            let fieldData = this.mapControl(item.list, field);
            if (fieldData) return fieldData;
          }
        } else if (controlList[i].type === "tabs") {
          for (let item of controlList[i].tabs) {
            let fieldData = this.mapControl(item.list, field);
            if (fieldData) return fieldData;
          }
        } else {
          console.log(controlList[i])
          if (controlList[i].type === "table") {
            for (let index in controlList[i].tableColumns) {
              let tableColumns = controlList[i].tableColumns[index];
              if (tableColumns.model == field) return tableColumns;
            }
          } else {
            if (controlList[i].model == field) return controlList[i];
          }
        }
      }
    },
    savedisplayRuleModal() {
      console.log(this.tableData);
      this.$emit("change", this.tableData);
      // this.data =  this.option.options.condition
      this.display = false;
    },
    closedisplayRuleModal() {
      this.display = false;
      console.log("closed", this.data.options.condition);
      this.tableData = JSON.parse(JSON.stringify(this.data.options.condition));
    },
    //添加条件
    Add() {
      let data = {
        //条件
        action: false, //启用控件
        condition: this.formInline.rule, //条件关系 or或 and 并且
        result: [
          {
            //关联表单信息
            action: "eq", //eq等于 ne不等于 gt大于 lt小于 ge大于等于 le 小于等于
            crf_id: "", //节点id
            crf_list: [], //节点列表
            dataset_id: "", //表单id
            dataset_list: [], //表单列表
            interview_id: "", //控件id 即控件字段标识
            interview_list: [], //控件列表
            options_list: [], //数据源
            options_id: "", //控件选中值
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
