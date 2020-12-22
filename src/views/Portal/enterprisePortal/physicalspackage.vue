<template>
  <d2-container>
    <SplitPane :min-percent="20" :default-percent="80" split="vertical">
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
        @removeRowEvent="removeRowEvent"
        @toolbar-button-click="toolbarButtonClick"
        @checkbox-change="checkboxChange"
        @checkbox-all="checkboxAll"
        ref="mkGrid"
    >
    <template slot="toolbarLeft">
      <query-form @query="reload" @reset="reset">
         <el-form :inline="true" >
            <el-form-item label="">
            <mk-select
            placeholder="请选择部门"
              v-model="parameter.deptname"
              :multiple="true"
              @change="reload"
              url="/Publics/MemberManage/Portal/PortalDeptInfo_get"
              :param="{orgid:parameter.orgid}"
              label="deptname"
              val="deptname"
              filter="deptname"
          >
        </mk-select>
        </el-form-item>
        <el-form-item label="">
           <mk-select
              placeholder="请选择职务"
              v-model="parameter.position"
              :multiple="true"
              @change="reload"
              url="/Publics/MemberManage/Portal/PortalPositionInfo_get"
              :param="{orgid:parameter.orgid}"
              label="position"
              val="position"
              filter="position"
          >
        </mk-select>
        </el-form-item>
         <el-form-item label="">
           <mk-select
           placeholder="是否匹配套餐"
              v-model="parameter.ismatchpack"
              clear
              @change="reload"
             :datas="[{label:'是',value:1},{label:'否',value:0}]"
              label="label"
              val="value"
              filter="label"
          >
        </mk-select>
        </el-form-item>
         <el-form-item >
           <el-input v-model="parameter.condition" placeholder="按员工姓名（首拼）、联系电话查询" style="width:300px;"></el-input>
        </el-form-item>
         </el-form>
       <template slot="detail">
         <el-form :inline="true" >
        <el-form-item label="">
            <mk-select
            placeholder="请选择部门"
              v-model="parameter.deptname"
              :multiple="true"
              @change="reload"
              url="/Publics/MemberManage/Portal/PortalDeptInfo_get"
              :param="{orgid:parameter.orgid}"
              label="deptname"
              val="deptname"
              filter="deptname"
          >
        </mk-select>
        </el-form-item>
        <el-form-item label="">
           <mk-select
            placeholder="请选择职务"
              v-model="parameter.position"
              :multiple="true"
              @change="reload"
             :datas="[{position:'家属'},{position:'CTO'},{position:'CEO'}]"
              label="position"
              val="position"
              filter="position"
          >
        </mk-select>
        </el-form-item>
         <el-form-item label="">
            <mk-select
           placeholder="是否匹配套餐"
              v-model="parameter.ismatchpack"
              clear
              @change="reload"
             :datas="[{label:'是',value:1},{label:'否',value:0}]"
              label="label"
              val="value"
              filter="label"
          >
        </mk-select>
        </el-form-item>
         <el-form-item label="">
           <mk-select
              placeholder="是否家属"
              v-model="parameter.family"
              :multiple="true"
              @change="reload"
             :datas="[{familyname:'是',family:1},{familyname:'否',family:0}]"
              :param="{orgid:parameter.family}"
              label="familyname"
              val="family"
              filter="familyname"
          >
        </mk-select>
        </el-form-item>
        <el-form-item >
             <mk-select
              placeholder="体检状态"
              v-model="parameter.examstatus"
              :multiple="true"
              @change="reload"
             :datas="physicaData"
              label="examstatusname"
              val="examstatus"
              filter="examstatusname"
          >
        </mk-select>
        </el-form-item>
         <el-form-item >
             <mk-select
              placeholder="性别"
              v-model="parameter.sex"
              @change="reload"
             :datas="[{sexname:'男',sex:1},{sexname:'女',sex:2}]"
              label="sexname"
              val="sex"
              filter="sexname"
          >
        </mk-select>
        </el-form-item>
         <el-form-item >
           <range-input v-model="parameter.agerange"></range-input>
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
              :checkbox-config="checkboxConfig"
              :data="examData">
               <template v-slot:examData={row}>
                 <table>
                   <tr>
                     <th>套餐名称</th>
                     <td>{{row.套餐名称}}</td>
                   </tr>
                    <tr>
                     <th>套餐价格</th>
                     <td>{{row.套餐价格}}</td>
                   </tr>
                    <tr>
                     <th>适应性别</th>
                     <td>{{row.适应性别}}</td>
                   </tr>
                    <tr>
                     <th>适应年龄</th>
                     <td>{{row.适应年龄}}</td>
                   </tr>
                 </table>
                 
               </template>
            </vxe-grid>
      </template>
    </SplitPane>
    
  </d2-container>
</template>	
		<script>
    import { mapState } from 'vuex'
    import MGrid from "@/components/mk-grid/grid"
    import QueryForm from "@/components/mk-grid/queryform"
    import RangeInput from "@/components/mk-form/mk-range-input/index.vue";
    import { isArray ,uniq} from 'xe-utils';
export default {
  name: "",
  components:{
    MGrid,
    QueryForm,
    RangeInput
  },
  provide(){
    return {
      grid:this
    }
  },
  data() {
    return {
      editModel:false,
      physicaData:[
         {examstatusname:'预登记',examstatus:-1},
        {examstatusname:'登记',examstatus:0},
        {examstatusname:'到检',examstatus:1},
        {examstatusname:'体检中',examstatus:2},
        {examstatusname:'已完成',examstatus:3},
        {examstatusname:'已总检',examstatus:4},
        {examstatusname:'已审核',examstatus:5},
        {examstatusname:'已结束',examstatus:6},
        {examstatusname:'总检中',examstatus:7},
        {examstatusname:'待审核',examstatus:8},
        {examstatusname:'已取消',examstatus:9},
        {examstatusname:'归档',examstatus:99}
      ],
      //table 配置项
      gridOption: {
        rowId: "memberid",
        columns: [
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
            title: "合同编号",
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
            field: "contractid",
          },
          {
            seq: null,
            title: "合同名称",
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
            field: "contractname",
          },
            {
            seq: null,
            title: "部门",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: true,
            is_modify: null,
            is_add: null,
            fieldtype: "select",
            slots: {},
            field: "deptname",
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
            field: "membername",
          },
           {
            seq: null,
            title: "家属",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            is_query: true,
            is_modify: null,
            is_add: null,
            fieldtype: "input",
            slots: {},
            field: "familyname",
          },
        
          // {
          //   seq: null,
          //   title: "体检次数",
          //   width: null,
          //   visible: true,
          //   resizable: null,
          //   align: "center",
          //   remoteSort: true,
          //   is_query: null,
          //   is_modify: null,
          //   is_add: null,
          //   fieldtype: null,
          //   slots: {},
          //   field: "examcount",
          // },
          {
            seq: null,
            title: "自费挂账",
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
            field: "ZFGZ",
          },
          {
            seq: null,
            title: "已选套餐",
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
            field: "choosepackage",
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
            field: "sexname",
          },
          // {
          //   seq: null,
          //   title: "身份证",
          //   width: null,
          //   visible: true,
          //   resizable: null,
          //   align: "center",
          //   remoteSort: true,
          //   is_query: null,
          //   is_modify: null,
          //   is_add: null,
          //   fieldtype: null,
          //   slots: {},
          //   field: "idnumber",
          // },
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
            title: "婚姻",
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
            field: "marriage",
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
            field: "mobiletel",
          },
          {
            seq: null,
            title: "联系邮箱",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "email",
          },
           {
            seq: null,
            title: "体检状态",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: true,
            slots: {},
            field: "examstatusname",
          },
        ],
        editRules: {},
        checkboxConfig:{
          highlight:true,
          trigger:'row'
        },
        toolbar: {
          slots: { buttons: "toolbar_buttons", tools: "toolbar_right" },
          perfect: true,
          import: true,
          export: true,
          print: false,
          refresh: false,
          zoom: true,
          custom: true,
        },
      },
      //table表格查询字段
      queryWidgetForm: {
       
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
		  
      },
      //当前点击row数据
      curClickRow:{},
      //工具栏左侧自定义按钮
      toolButtos: [{
        code:'topack',
        name:'关联套餐'
      },{
        code:'cancelpack',
        name:' 取消套餐'
      },{
        code:'sendmsg',
        name:'发送短信'
      }],
      //工具栏右侧自定义按钮目前只有导入 导出
      toolbarRight: { import: "0", export: "1", print: "0" },
      //table 行操作列按钮
      operateBtn: ["edit", "del"],
      //table数据接口地址 导入 导出接口地址
      Interface: {
        tableInterface: "/Publics/MemberManage/Portal/ExamMemberInfo",
        importInterface: "/Publics/MemberManage/Portal/Import",
        exportInterface: "",
      },
      //附加参数
      parameter: {
        orgid:9,
        contractid:7,
        deptname:[],
        jobstatus:[],
        position:[],
        family:[],
        examstatus:[],
        sex:'',
        condition:'',
        hospitalid:'',
        ismatchpack:'',//是否匹配套餐 1 匹配 0不匹配
        minage:'',//最小年龄
        maxage:'',//最大年龄
        agerange:''//年龄范围格式 10-20 ，“-1” 标识 无年龄范围限制
      },
      //导入附加参数
      importParame: {},
      tableColumn:[
        {title: "全选",width: "80", visible: true, align: "left", type: "checkbox"},
        { field: '套餐ID', title: '体检套餐',slots:{default:'examData'} }

      ],
      checkboxConfig:{
        highlight:true,
        trigger:'row'
      },
      tableData:[],
      examData:[],
    };
  },
  computed: {
     ...mapState('d2admin/size', [
				'value'
			])
  },
  watch: {
    'parameter.agerange'(val){
      console.log(val);
    }
  },
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {},
  created() {
    // this.$refs.mkGrid.reload();
    this.PortalPackage_get();
  
  },
  methods: {
    //刷新表格
    reload(){
      this.$refs.mkGrid.commitProxy('query');
    },
    //重置
    reset(){
      this.parameter = {
        orgid:9,
        contractid:7,
        deptname:[],
        jobstatus:[],
        position:[],
        family:[],
        examcount:0,
        condition:'',
        hospitalid:''
      };
      this.$nextTick(() => {
        this.reload();
      })
    },
    deptChange(){
      this.reload();
    },

    removeRowEvent(row){
      this.del(row)
    },
    //
    checkMethod({row}){
       return row.examcount == 0;
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
    PortalPackage_get(){
      let data = {
        orgid:this.parameter.orgid,
        contractid:this.parameter.contractid,
        tag:1
      }
      this.MK.Request('/Publics/MemberManage/Portal/PortalPackage_get', 'get', data)
      .then(res => {
        if(res.code == 0){
          this.examData = this.sortArr(res.data);
        }
      })
    },
    toolbarButtonClick(code){
      switch (code) {
        case 'topack':
            this.topack();
          break;
           case 'cancelpack':
            this.cancelpack();
          break;
          case 'sendmsg':
            
          break;
        default:
          break;
      }
    },
    //判断勾选
    ischeck(){
       let getLeftCheckboxRecords = this.$refs.mkGrid.xGrid().getCheckboxRecords();
       let getRightCheckboxRecords = this.$refs.rightGrid.getCheckboxRecords();
         if(getLeftCheckboxRecords.length == 0){
          this.$XModal.message({ message: '请选择人员！', status: 'warning' });
          return false;
         };
        if(getRightCheckboxRecords.length == 0){
          this.$XModal.message({ message: '请选择套餐！', status: 'warning' });
          return false;
        };
        return {
          left:getLeftCheckboxRecords,
          right:getRightCheckboxRecords
        };
    },
    //table left checkbox 勾选触发
    checkboxChange({records,row,checked}){
        // console.log(uniq([11, 22, 33, 33, 22, 55]));
        var arr = []
        var findKeyArr = [];
        if(row.choosepackageID != ''){
            var mapArr = records.map(item => {
              return {
                choosepackageID:item.choosepackageID.split(',')
              }
            })
              mapArr.forEach(item => {
                if(item.choosepackageID.length){
                  item.choosepackageID.forEach(key => {
                     arr.push(key)
                  })
                  
                }
              })
            findKeyArr = uniq(arr);
            this.rightcheckHandel(findKeyArr,checked)
        }else{
            this.rightcheckHandel([],checked)
        }
      

    },
    //table left checkboxAll 全选触发
    checkboxAll({records}){

    },
    //设置table行选中
    setCheckboxRow(el,row,checked){
      this.$refs[el].setCheckboxRow([row], checked)
      // this.$refs[el].toggleCheckboxRow(row)
    },
    rightcheckHandel(data,checked){
       var getRightData= this.examData;
      
      if(data.length){
        data.forEach(key => {
           let findRow = getRightData.find(item => item.套餐ID.toString().includes(key) == true);
           this.setCheckboxRow('rightGrid',findRow,true)
        })
       
      }else{  
         this.$refs['rightGrid'].clearCheckboxRow();
      }
    },
    //关联套餐
    topack(){
      if(this.ischeck()){
        let res = this.ischeck();
        this.submitPack(res.left,res.right,1)
      }
    },
    //取消套餐
    cancelpack(){
      if(this.ischeck()){
        let res = this.ischeck();
        this.submitPack(res.left,res.right,0)
      }
    },
    //关联 取消 公共方法 left左边数据 right右边数据 type 0 取消 1关联
    submitPack(left,right,type){
      //packageid 为空取消套餐关联
       var  memberPackagemx = [];
        for(let i = 0; i < right.length; i++){
          let data = {}
          data.packageid = type == 0 ? '' : right[i].套餐ID;
          data.packagename =right[i].套餐名称;
          for(let j = 0; j < left.length; j++){
            data.orgid = left[j].orgid;
            data.family = left[j].family;
            data.memberid = left[j].memberid;
            data.orgname = left[j].orgname;
            data.contractid = left[j].contractid;
            data.contractname = left[j].contractname;
            data.contractno = left[j].contractno;
            data.memberid = left[j].memberid;
            data.examstatus = left[j].examstatus;
            memberPackagemx.push(JSON.parse(JSON.stringify(data)));
          }
        }
        this.MK.Request('/Publics/MemberManage/Portal/PortalMemberChoosePackage', 'post', {memberPackagemx})
        .then(res => {
          if(res.code == 0){
            let str = '成功'
            if(type == 0){
              str = '取消成功'
            }else{
              str = '关联成功'
            }
            this.$XModal.message({ message: str, status: 'success' });
            this.reload();
            this.PortalPackage_get();
          }
        })
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
</style>
		