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
        @operateRowBtnEvent="operateRowBtnEvent"
        @toolbar-button-click="toolbarButtonClick"
        @cell-dbclick="cellDbClick"
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
           placeholder="请选择在职状态"
              v-model="parameter.jobstatus"
              :multiple="true"
              @change="reload"
             :datas="[{statusname:'在职',status:1},{statusname:'离职',status:0}]"
              label="statusname"
              val="status"
              filter="statusname"
          >
        </mk-select>
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
           placeholder="请选择在职状态"
              v-model="parameter.jobstatus"
              :multiple="true"
              @change="reload"
             :datas="[{statusname:'在职',status:1},{statusname:'离职',status:0}]"
              label="statusname"
              val="status"
              filter="statusname"
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
             <el-input-number v-model="parameter.examcount" placeholder="体检次数大于" controls-position="right" @change="reload" :min="0"></el-input-number>
        </el-form-item>
         <el-form-item >
           <el-input v-model="parameter.condition" placeholder="按员工姓名（首拼）、联系电话查询" style="width:300px;"></el-input>
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
              resizable
              :size="value"
              height="auto"
              align="center"
              :autoResize="true"
              :columns="tableColumn"
              :data="tableData">
            </vxe-grid>
      </template>
    </SplitPane>
     <vxe-modal v-model="editModel" title=" 企业员工信息维护" width="1000" >
      <template v-slot>
        <vxe-form  title-align="right" title-width="80">
          <vxe-form-item title="基本信息" span="24" title-align="left" title-width="200px" :title-prefix="{icon: 'fa fa-address-card-o'}"></vxe-form-item>
          <vxe-form-item title="员工姓名" field="name" span="8" >
            <template v-slot>
              <el-input v-model="curClickRow.membername" :readonly="true"/>
            </template>
          </vxe-form-item>
          <vxe-form-item title="员工性别" field="name" span="8" >
            <template v-slot>
              <el-input v-model="curClickRow.sexname" :readonly="true"/>
            </template>
          </vxe-form-item>
           <vxe-form-item title="出生日期" field="name" span="8" >
            <template v-slot>
              <el-input v-model="curClickRow.birthday" :readonly="true"/>
            </template>
          </vxe-form-item>
           <vxe-form-item title="证件类型" field="name" span="8" >
            <template v-slot>
              <el-input v-model="curClickRow.idtypename" :readonly="true"/>
            </template>
          </vxe-form-item>
          <vxe-form-item title="证件编号" field="name" span="8" >
            <template v-slot>
              <el-input v-model="curClickRow.idnumber" :readonly="true"/>
            </template>
          </vxe-form-item>
           <vxe-form-item title="是否家属" field="name" span="8" >
            <template v-slot>
              <el-input v-model="curClickRow.familyname" :readonly="true"/>
            </template>
          </vxe-form-item>
          <vxe-form-item title="其他信息" span="24" title-align="left" title-width="200px" :title-prefix="{icon: 'fa fa-info-circle'}"></vxe-form-item>
          <vxe-form-item title="员工工号" field="name" span="8" >
            <template v-slot>
              <el-input v-model="modifyWidgetForm.jobno" />
            </template>
          </vxe-form-item>
          <vxe-form-item title="员工婚姻" field="name" span="8" >
            <template v-slot>
               <mk-select
               placeholder="请选择婚姻"
              v-model="modifyWidgetForm.marriage"
              url="/Publics/Common/Dic/StandCode"
              :param="{codetype:'婚姻',tag:1}"
              label="bzname"
              val="bzcode"
              filter="bzname"
          >
        </mk-select>
            </template>
          </vxe-form-item>
           <vxe-form-item title="联系电话" field="name" span="8" >
            <template v-slot>
              <el-input v-model="modifyWidgetForm.telno" />
            </template>
          </vxe-form-item>
          <vxe-form-item title="员工部门" field="name" span="8" >
            <template v-slot>
              <el-input v-model="modifyWidgetForm.orgdeptname"  placeholder="请输入员工部门" />
            </template>
          </vxe-form-item>
           <vxe-form-item title="员工职务" field="name" span="8" >
            <template v-slot>
              <el-input v-model="modifyWidgetForm.position"  placeholder="请输入员工职务" />
            </template>
          </vxe-form-item>
           <vxe-form-item title="在职状态" field="name" span="8" >
            <template v-slot>
              <mk-select
            placeholder="请选择在职状态"
              v-model="modifyWidgetForm.status"
             :datas="[{statusname:'在职',status:1},{statusname:'离职',status:0}]"
              label="statusname"
              val="status"
              filter="statusname"
          >
        </mk-select>
            </template>
          </vxe-form-item>
           <vxe-form-item title="电子邮箱" field="name" span="24" >
            <template v-slot>
              <el-input v-model="modifyWidgetForm.email"  placeholder="请输入电子邮箱" />
            </template>
          </vxe-form-item>
           <vxe-form-item title="联系地址" field="name" span="24" >
            <template v-slot>
              <el-input v-model="modifyWidgetForm.addr"  placeholder="请输入联系地址" />
            </template>
          </vxe-form-item>
          <vxe-form-item align="center" span="24">
            <template v-slot>
              <vxe-button  status="primary" @click="submit">提交</vxe-button>
              <vxe-button @click="editModel = false">取消</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>

    </vxe-modal>
  </d2-container>
</template>	
		<script>
    import { mapState } from 'vuex'
    import MGrid from "@/components/mk-grid/grid"
    import QueryForm from "@/components/mk-grid/queryform"
    import { isArray } from 'xe-utils';
export default {
  name: "",
  components:{
    MGrid,
    QueryForm
  },
  provide(){
    return {
      grid:this
    }
  },
  data() {
    return {
      editModel:false,
      test:1,
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
            title: "操作",
            width: null,
            visible: true,
            resizable: null,
            align: "center",
            remoteSort: false,
            is_query: null,
            is_modify: null,
            is_add: null,
            fieldtype: null,
            fixed: "right",
            slots: {"default":"operate"},
            field: "operate_id",
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
          {
            seq: null,
            title: "体检次数",
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
            field: "examcount",
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
          {
            seq: null,
            title: "身份证",
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
            field: "position",
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
        ],
        editRules: {},
        checkboxConfig:{
          highlight:true,
          checkMethod:this.checkMethod,
          
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
        "orgid": "9",//企业id 不可修改
        "memberfilesno": "",//个人档案号 不可修改
        "hispatid": "",//医院id 不可修改
        "memberid": "",//会员id不可修改
        "orgdeptname": "",//员工部门可修改
        "jobno": "",//员工工号可以修改
        "marriage": "",//婚姻状态 可以修改
        "telno": "",//联系电话可修改
        "addr": "",//地址可修改
        "email": "",//邮箱可修改
        "position": "",//职位可修改
        "status": ""//在职状态可修改
      },
      //当前点击row数据
      curClickRow:{},
      //工具栏左侧自定义按钮
      toolButtos: [{
        code:'delAll',
        name:'批量删除'
      }],
      //工具栏右侧自定义按钮目前只有导入 导出
      toolbarRight: { import: "1", export: "1", print: "0" },
      //table 行操作列按钮
      operateBtn: [{
        code:'edit',
        name:'编辑',
        icon:'fa fa-edit',
        circle:true
      },{
        code:'del',
        name:'删除',
        icon:'fa fa-trash',
        circle:true
      },],
      //table数据接口地址 导入 导出接口地址
      Interface: {
        tableInterface: "/Publics/MemberManage/Portal/ExamMemberInfo",
        importInterface: "/Publics/MemberManage/Portal/Import",
        exportInterface: "",
      },
      //附加参数
      parameter: {
        orgid:'',
        contractid:'',
        deptname:[],
        jobstatus:[],
        position:[],
        family:[],
        examcount:0,
        condition:'',
        hospitalid:''
      },
      //导入附加参数
      importParame: {
        orgid:'',
        orgname:''
      },
      tableColumn:[
        { field: '合同编号', title: '合同编号',showOverflow: true,showHeaderOverflow: true },
        { field: '套餐名称', title: '体检套餐',  showOverflow: true,showHeaderOverflow: true },
        { field: '体检日期', title: '体检时间', showOverflow: true,showHeaderOverflow: true },
        { field: '体检状态', title: '体检状态', showOverflow: true,showHeaderOverflow: true }

      ],
      tableData:[],
    };
  },
  computed: {
     ...mapState('d2admin/size', [
				'value'
      ]),
        ...mapState('d2admin/user', [
				'info'
			])
  },
  watch: {},
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {},
  created() {
   this.parameter.orgid = this.info.orgid;
   this.parameter.contractid = this.info.contractid;
   this.importParame.orgid = this.info.orgid;
   this.importParame.orgname = this.info.orgname;
    // this.$refs.mkGrid.reload();
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
        contractid:this.info.contractid,
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
    operateRowBtnEvent({code,row}){
      switch (code) {
        case 'edit':
          this.editRowEvent(row);
          break;
        case 'del':
          this.del(row);
        break;
        default:
          break;
      }
    },
    editRowEvent(row){
      this.curClickRow= row;
      this.modifyWidgetForm.memberid = row.memberid;
      this.modifyWidgetForm.email = row.email;
      this.modifyWidgetForm.addr = row.address;
      this.modifyWidgetForm.memberfilesno = row.memberfilesno;
      this.modifyWidgetForm.marriage = row.marriage.toString();
      this.modifyWidgetForm.hispatid = row.hispatid;
      this.modifyWidgetForm.jobno = row.jobno;
      this.modifyWidgetForm.telno = row.mobiletel;
      this.modifyWidgetForm.orgdeptname = row.deptname;
      this.modifyWidgetForm.position = row.position;
      this.modifyWidgetForm.status = row.status;
      this.editModel = true;
      setTimeout(() => {
        this.test = 'sdfdsfger'
      },3000)
    },
    removeRowEvent(row){
      this.del(row)
    },
    //
    checkMethod({row}){
       return row.examcount == 0;
    },
    //左边table双击事件
    cellDbClick({row}){
      this.ExamMemberExamInfo_get(row);
    },
    //企业Portal获取企业员工所有体检信息
    ExamMemberExamInfo_get({orgid,memberid}){
      this.MK.Request('/Publics/MemberManage/Portal/ExamMemberExamInfo', 'get', {orgid,memberid})
      .then(res => {
        if(res.code == 0){
          this.tableData = res.data;
        }
      })
    },
    toolbarButtonClick(code){
      switch (code) {
        case 'delAll':
            this.delAll();
          break;
        default:
          break;
      }
    },
    //删除
    delAll(){
       let getCheckboxRecords = this.$refs.mkGrid.xGrid().getCheckboxRecords();
       if(getCheckboxRecords.length == 0){
        this.$XModal.message({ message: '请至少选择一条记录！', status: 'warning' });
        return
       }
        this.del(getCheckboxRecords);
    },
    del(row){
       this.$XModal.confirm('您确定要删除吗？').then(type => {
         if(type == 'confirm'){
            let rows = {
              orgid:this.parameter.orgid,
              memberdelmx:[],
          }
          if(isArray(row)){
            rows.memberdelmx = row;
          }else{
            rows.memberdelmx.push(row)
          }
          this.MK.Request('/Publics/MemberManage/Portal/PortalDeleteMember_Post', 'post', rows)
          .then( res => {
            if(res.code == 0){
              this.$XModal.message({ message: '删除成功', status: 'success ' });
              this.reload();
            }
          })
         }
      });
    },
    //企业员工修改
    submit(){
       this.MK.Request('/Publics/MemberManage/Portal/PortalMemberEdit', 'post', this.modifyWidgetForm)
      .then(res => {
        if(res.code == 0){
          this.editModel = false;
          this.reload();
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
		