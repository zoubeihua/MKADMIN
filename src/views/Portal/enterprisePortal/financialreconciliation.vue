<template>
  <d2-container>
    <m-grid
      :option.sync="gridOption"
      :queryForm.sync="queryWidgetForm"
      :addForm.sync="addWidgetForm"
      :editForm.sync="modifyWidgetForm"
      :toolButtos="toolButtos"
      :toolbarRight="toolbarRight"
      :parameter="parameter"
      :importParame="importParame"
      :tableData="tableData"
      :importUrl="Interface.importInterface"
      :exportUrl="Interface.exportInterface"
      @operateRowBtnEvent="operateRowBtnEvent"
      :operateBtn="operateBtn"
      ref="mkGrid"
    >
    <template slot="toolbarLeft">
		 <query-form @query="reload" @reset="reset">
			<el-form :inline="true" >
				<el-form-item >
           			<el-input v-model="parameter.condition" placeholder="按合同编号、名称查询" style="width:300px;"></el-input>
        		</el-form-item>
			</el-form>
		 </query-form>
	</template>
    </m-grid>
    <vxe-modal v-model="hdzdModel" title="单核对账" width="99vw" height="99vh" >
      <el-container>
        <el-header style="padding:0 !important;height:auto;">
          <table class="tableS">
            <tr>
              <th>总人数</th>
              <td>100</td>
              <th>男性人数</th>
              <td>50</td>
              <th>女性人数</th>
              <td>50</td>
            </tr>
             <tr>
              <th>套餐A人数</th>
              <td>30</td>
              <th>单价</th>
              <td>1000.00</td>
              <th>金额</th>
              <td>30000.00</td>
            </tr>
             <tr>
              <th>套餐B人数</th>
              <td>40</td>
              <th>单价</th>
              <td>2000.00</td>
              <th>金额</th>
              <td>60000.00</td>
            </tr>
             <tr>
              <th>加项金额</th>
              <td>1000.00</td>
              <th>合计金额</th>
              <td>211000.00</td>
              <th></th>
              <td></td>
            </tr>
          </table>
        </el-header>
        <el-main>
          <m-grid
      :option.sync="bottomOption"
      :toolButtos="[{name:'通过'},{name:'拒绝'},{name:'撤销'}]"
     
      :tableData="bottomTableData"
      ref="mkGrid"
    >
    <template slot="toolbarLeft">
		 <el-form :inline="true" >
				<el-form-item label="账单明细">
              <el-checkbox >套餐</el-checkbox>
              <el-checkbox >加项目</el-checkbox>
        </el-form-item>
			</el-form>
	</template>
    </m-grid>
        </el-main>
      </el-container>
    </vxe-modal>
     <vxe-modal v-model="kphdModel" title="开票信息核对" width="500" height="auto" >
        <table class="tableS">
            <tr>
              <th>收款帐户</th>
              <td></td>
            </tr>
             <tr>
              <th>发票抬头</th>
              <td>上海睦康信息技术有限公司</td>
            </tr>
             <tr>
              <th>识别号</th>
              <td>36020011114444455555</td>
            </tr>
             <tr>
              <th>发票内容</th>
              <td>抬头、内容</td>
            </tr>
          </table>
     </vxe-modal>
     <vxe-modal v-model="zfpzModel" title="  支付凭证" width="500" height="auto" >
        <table class="tableS">
            <tr>
              <th>收款帐户</th>
              <td></td>
            </tr>
             <tr>
              <th>发票号码</th>
              <td></td>
            </tr>
             <tr>
              <th>发票抬头</th>
              <td>上海睦康信息技术有限公司</td>
            </tr>
             <tr>
              <th>发票内容</th>
              <td>抬头、内容</td>
            </tr>
             <tr>
              <th>合计金额</th>
              <td></td>
            </tr>
              <tr>
              <th>回执单号</th>
              <td></td>
            </tr>
              <tr>
              <th>回执单图片</th>
              <td></td>
            </tr>
          </table>
     </vxe-modal>
  </d2-container>
</template>	

		<script>
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
      hdzdModel:false,
      kphdModel:false,
      zfpzModel:false,
      //table 配置项
      gridOption: {
        columns: [
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
            title: "账单日期",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "账单日期",
          },
          {
            seq: null,
            title: "开票日期",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "开票日期",
          },
          {
            seq: null,
            title: "发票号码",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "发票号码",
          },
          {
            seq: null,
            title: "发票抬头",
            width: "240px",
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "发票抬头",
          },
          {
            seq: null,
            title: "纳税识别号",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "纳税识别号",
          },
          {
            seq: null,
            title: "发票内容",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "发票内容",
          },
          {
            seq: null,
            title: "发票金额",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "发票金额",
          },
          {
            seq: null,
            title: "开票信息核对",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "开票信息核对",
          },
          {
            seq: null,
            title: "账单状态",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "账单状态",
          },
          {
            seq: null,
            title: "支付日期",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "支付日期",
          },
          {
            seq: null,
            title: "操作",
            width: 300,
            visible: true,
            resizable: null,
            align: "center",
            slots: { default: "operate" },
            field: "operate_id",
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
      bottomOption:{
        columns:[
            {
            seq: null,
            title: "全选",
            width: "80",
            visible: true,
            resizable: null,
            align: "left",
            remoteSort: false,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            type: "checkbox",
          },
           {
            seq: null,
            title: "工号",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            slots: {},
            field: "jobno",
          },
          {
            seq: null,
            title: "姓名",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            slots: {},
            field: "name",
          },
           {
            seq: null,
            title: "到检日期",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            slots: {},
            field: "djsj",
          },
           {
            seq: null,
            title: "到检凭证",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            slots: {},
            field: "djpz",
          },
           {
            seq: null,
            title: "性别",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            slots: {},
            field: "sex",
          },
           {
            seq: null,
            title: "身份证号",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            slots: {},
            field: "idnumber",
          },
           {
            seq: null,
            title: "年龄",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            slots: {},
            field: "age",
          },
           {
            seq: null,
            title: "联系电话",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            slots: {},
            field: "phone",
          },
           {
            seq: null,
            title: "部门",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            slots: {},
            field: "dept",
          },
           {
            seq: null,
            title: "职务",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            slots: {},
            field: "zw",
          },
           {
            seq: null,
            title: "状态",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            slots: {},
            field: "status",
          },
           {
            seq: null,
            title: "拒绝原因",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            slots: {},
            field: "jj",
          },{
            seq: null,
            title: "项目名称",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            slots: {},
            field: "xmmc",
          },{
            seq: null,
            title: "金额",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            slots: {},
            field: "je",
          },{
            seq: null,
            title: "套餐",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            slots: {},
            field: "tc",
          },{
            seq: null,
            title: "加项",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            slots: {},
            field: "jx",
          },
        ]
      },
      bottomTableData:[
        {
          jobno:'100',
          name:'张三',
          djsj:'2020-12-08',
          djpz:'PIC',
          sex:'男',
          idnumber:'3249082345',
          age:'22岁',
          phone:'13634598345',
          dept:'',
          zw:'',
          status:'申请',
          jj:'1111111',
          xmmc:'肿瘤筛查',
          je:'1000',
          tc:'否',
          jx:'是'
        }
      ],

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
      operateBtn: [{
        code:'hdzd',
        name:'核对账单'
      },{
        code:'kphd',
        name:'开票核对'
      },{
        code:'zfpz',
        name:'支付凭证'
      },],
      //table数据接口地址 导入 导出接口地址
      Interface: {
        tableInterface: "",
        importInterface: "",
        exportInterface: "",
      },
      //附加参数
      parameter: {},
      //导入附加参数
      importParame: {},
      tableData:[]
    };
  },
  computed: {},
  watch: {},
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {},
  created() {
    this.getData();
    // this.$refs.mkGrid.reload();
  },
  methods: {
    getData(){
      let data = {
        合同编号:'',
        账单日期:'',
        开票日期:'',
        发票号码:'',
        发票抬头:'',
        纳税识别号:'',
        发票内容:'',
        发票金额:'',
        开票信息核对:'',
        账单状态:'',
        支付日期:'',
      }
      var status = ['未对账','通过','不通过','支付完成','已开票未支付']
      for(let i = 0; i < 5; i++){
        var n = Math.floor(Math.random() * status.length + 1)-1; 
        data = {
          合同编号:'123654',
          账单日期:'2020-10-27',
          开票日期:'2020-10-29',
          发票号码:'12354664646444',
          发票抬头:'',
          纳税识别号:'',
          发票内容:'员工体检费',
          发票金额:'20000.00',
          开票信息核对:'是',
          账单状态:status[n],
          支付日期:'',
        };
        this.tableData.push(JSON.parse(JSON.stringify(data)))
      }
    },
    operateRowBtnEvent({code,row}){
      switch (code) {
        case 'hdzd':
          this.hdzd();
          break;
        case 'kphd':
          this.kphd();
          break;
        case 'zfpz':
          this.zfpz();
          break;
        default:
          break;
      }
    },
    //hdzd
    hdzd(){
      this.hdzdModel = true;
    },
    kphd(){
      this.kphdModel = true;
    },
    zfpz(){
      this.zfpzModel = true;
    },
    reload(){

    },
    reset(){

    }
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
      .tableS,.tableS tr th, .tableS tr td { border:1px solid #ccc; }
        .tableS { width: 100%;   border-collapse: collapse; padding:2px;}   
        .tableS th{
          text-align: center;
          width: 200px;
        }
        .tableS td{
          padding: 10px;
        }
</style>
		