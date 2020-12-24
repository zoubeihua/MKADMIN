<template>
  <d2-container>
    <SplitPane :min-percent="20" :default-percent="60" split="vertical">
       <template slot="paneL">
           <m-grid
      :option.sync="gridOption"
      :queryForm.sync="queryWidgetForm"
      :addForm.sync="addWidgetForm"
      :editForm.sync="modifyWidgetForm"
      :toolButtos="toolButtos"
      :toolbarRight="toolbarRight"
      :parameter="parameter"
      :importParame="importParame"
      :url="Interface.tableInterface"
      :importUrl="Interface.importInterface"
      :exportUrl="Interface.exportInterface"
      :operateBtn="operateBtn"
       @cell-click="cellDbClick"
      ref="mkGrid"
    >
	<template slot="toolbarLeft">
		 <query-form @query="reload" @reset="reset">
			<el-form :inline="true" >
				<el-form-item >
           			<el-input v-model="parameter.condition" placeholder="按合同编号、名称查询" style="width:260px;"></el-input>
        		</el-form-item>
			</el-form>
			<template slot="detail">
        <el-form :inline="true" >
          <el-form-item >
              <el-input v-model="parameter.condition" placeholder="按合同编号、名称查询" style="width:260px;"></el-input>
            </el-form-item>
          </el-form>
			</template>
		 </query-form>
	</template>
    </m-grid>
       </template>
       <template slot="paneR">
         <vxe-grid
            border
            ref="rightGrid"
            resizable
            :size="value"
            height="auto"
            align="center"
            :autoResize="true"
            :columns="tableColumn"
            :footer-method="footerMethod"
            :showFooter="true"
            :data="examData">
          </vxe-grid>
       </template>
    </SplitPane>
  
  </d2-container>
</template>	
<script>
import { sum } from 'xe-utils';
import { mapState } from 'vuex'
import MGrid from "@/components/mk-grid/grid"
import QueryForm from "@/components/mk-grid/queryform"
export default {
  name: "",
  components:{
    MGrid,
    QueryForm
  },
  data() {
    return {
      //table 配置项
      gridOption: {
        columns: [
          {
            seq: null,
            title: "签订日期",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "登记时间",
          },
          {
            seq: null,
            title: "合同编号",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "合同编号",
          },
          {
            seq: null,
            title: "合同名称",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "合同名称",
          },
          {
            seq: null,
            title: "到检人数",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "到检人数",
          },
          {
            seq: null,
            title: "生效日期",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "合同生效日期",
          },
          {
            seq: null,
            title: "失效期",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "合同截止日期",
          },
          {
            seq: null,
            title: "合同金额",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "预缴金额",
          },
          {
            seq: null,
            title: "合同折扣",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "折扣率",
          },
        ],
        editRules: {},
        toolbar: {
          slots: { buttons: "toolbar_buttons", tools: "toolbar_right" },
          perfect: true,
          import: false,
          export: false,
          print: false,
          refresh: false,
          zoom: true,
          custom: true,
        },
      },
      //table表格查询字段
      queryWidgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
          customClass: "",
          ui: "element",
          layout: "horizontal",
          labelCol: 3,
          width: "100%",
          hideLabel: false,
          hideErrorMessage: false,
        },
      },
      //弹窗新增数据
      addWidgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
          customClass: "",
          ui: "element",
          layout: "horizontal",
          labelCol: 3,
          width: "100%",
          hideLabel: false,
          hideErrorMessage: false,
        },
      },
      //弹窗编辑数据
      modifyWidgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
          customClass: "",
          ui: "element",
          layout: "horizontal",
          labelCol: 3,
          width: "100%",
          hideLabel: false,
          hideErrorMessage: false,
        },
      },
      //工具栏左侧自定义按钮
      toolButtos: [],
      //工具栏右侧自定义按钮目前只有导入 导出
      toolbarRight: { import: "0", export: "0", print: "0" },
      //table 行操作列按钮
      operateBtn: [],
      //table数据接口地址 导入 导出接口地址
      Interface: {
        tableInterface: "/Publics/MemberManage/Portal/PortalContract_get",
        importInterface: "",
        exportInterface: "",
      },
      //附加参数
      parameter: {
		  orgid:'',
		  condition:''
	  },
      //导入附加参数
      importParame: {},
       tableColumn:[
          { field: '套餐名称', title: '套餐名称',showOverflow: true,showHeaderOverflow: true },
          { field: '适应性别', title: '适应性别',showOverflow: true,showHeaderOverflow: true },
          { field: '适应年龄', title: '适应年龄',showOverflow: true,showHeaderOverflow: true },
          { field: '套餐价格', title: '套餐价格',showOverflow: true,showHeaderOverflow: true }

      ],
      examData:[]
    };
  },
  computed: {
     ...mapState('d2admin/size', [
				'value'
      ]),
  },
  watch: {},
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {},
  created() {
	// this.$refs.mkGrid.reload();
	this.parameter.orgid = this.info.orgid;
  },
  methods: {
	//刷新表格
    reload(){
      this.$refs.mkGrid.commitProxy('query');
	},
	//重置
    reset(){
      this.parameter = {
        orgid:this.info.orgid,
       	condition:""
      };
      this.$nextTick(() => {
        this.reload();
      })
    },
      //左边table双击事件
    cellDbClick({row}){
      this.PortalPackage_get(row);
    },
        sortArr(arr){
      var map = {},
          dest = [];
      for(var i = 0; i < arr.length; i++){
          var ai = arr[i];
          if(!map[ai.套餐ID]){
              dest.push({
                  套餐ID: ai.套餐ID,
                  套餐名称: ai.套餐名称,
                  套餐价格:ai.套餐价格,
                  适应性别:ai.适应性别,
                  适应年龄:ai.适应年龄,
                  data: [ai]
              });
              map[ai.套餐ID] = ai;
          }else{
              for(var j = 0; j < dest.length; j++){
                  var dj = dest[j];
                  if(dj.套餐ID == ai.套餐ID){
                      dj.data.push(ai);
                      break;
                  }
              }
          }
      };
      return dest;
    },
     //企业Portal获取企业合同套餐信息 
    PortalPackage_get(row){
      let data = {
        orgid:row.单位ID,
        contractid:row.合同ID,
        tag:1
      }
      this.MK.Request('/Publics/MemberManage/Portal/PortalPackage_get', 'get', data)
      .then(res => {
        if(res.code == 0){
          this.examData =this.sortArr(res.data);
          console.log(this.examData);
        }
      })
    },
    footerMethod ({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '汇总'
          }
          if (['套餐价格'].includes(column.property)) {
            return sum(data, column.property)
          }
          return null
        })
      ]
    },
  },
  mounted() {},
  //生命周期 - 创建之前
  beforeCreate() {},
  //生命周期 - 挂载之前
  beforeMount() {},
  //生命周期 - 更新之前
  beforeUpdate() {},
  //生命周期 - 更新之后
  updated() {},
  //生命周期 - 销毁之前
  beforeDestroy() {},
  //生命周期 - 销毁完成
  destroyed() {},
};
</script>
		<style scoped>
</style>
		