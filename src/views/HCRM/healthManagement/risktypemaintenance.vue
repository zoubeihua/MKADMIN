<template>
  <d2-container>
    <SplitPane :min-percent="20" :default-percent="35" split="vertical">
      <template slot="paneL">
        <el-container>
          <el-header>
            <el-form :inline="true">
              <el-form-item>
                <el-input
                  style="width:300px;"
                  v-model="pagerriskCate.condition"
                  placeholder="输入关键字"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button type="primary" icon="el-icon-search" @click="risktypeinfo_Get">查询</el-button>
                  <el-button type="primary" icon="el-icon-circle-plus-outline" @click="risktypeAdd">添加分类</el-button>
                </el-button-group>
              </el-form-item>
            </el-form>
          </el-header>
          <el-table
            :data="riskCateList"
            border
            @row-click="riskRowClick"
            highlight-current-row
            stripe
            height="100%"
            :row-class-name="tableRowClassName"
          >
            <el-table-column
              label="风险分类名称"
              sortable
              show-overflow-tooltip
              align="left"
              prop="riskname"
            ></el-table-column>
            <el-table-column
              align="center"
              sortable
              width="100"
              show-overflow-tooltip
              prop="status"
              label="状态"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="GetOpenAndStoptatusType(scope.row.status)"
                  disable-transitions
                >{{ scope.row.statusdisplay }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip prop label="操作">
              <template slot="header">
                <span class="primary">操作</span>
              </template>
              <template slot-scope="scope">
                <div class="tableBtn">
                  <el-link
                    :title="scope.row.status != 1 ? '启用' : '停用'"
                    @click.stop="Examine(scope.row,'/Hcrm/Risktypeinfo/risktypeinfo_StopAndOpen','停用','启用',risktypeinfo_Get)"
                    :underline="false"
                   :type="scope.row.status != 1 ?'primary':'danger'"
                    :icon="scope.row.status != 1 ? 'mkfont qiyong' : 'mkfont tingyong_line'"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                  ></el-link>
                  <el-link
                    title="编辑"
                    @click.stop="risktypeEdit(scope.row)"
                    :underline="false"
                    type="primary"
                    icon="mkfont bianji1"
                  ></el-link>
                  <!-- <el-link
                    title="删除"
                    @click="Del(scope.row)"
                    :underline="false"
                    type="danger"
                    icon="mkfont trasch"
                  ></el-link>-->
                  <el-link
                    title="上移"
                    @click.stop="MoveUp(scope.$index,scope.row,riskCateList,'riskid','orderno',risktypeinfo_Get,'/Hcrm/Risktypeinfo/risktypeinfo_UpAndDown')"
                    :underline="false"
                    type="primary"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                    icon="mkfont shangyi"
                  ></el-link>
                  <el-link
                    title="下移"
                    @click.stop="MoveDow(scope.$index,scope.row,riskCateList,'riskid','orderno',risktypeinfo_Get,'/Hcrm/Risktypeinfo/risktypeinfo_UpAndDown')"
                    :underline="false"
                    type="primary"
                    :disabled="scope.row.status == 3 || scope.row.status == 99"
                    icon="mkfont xiayi"
                  ></el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-footer>
            <mk-page :pager="pagerriskCate" @query="risktypeinfo_Get" />
          </el-footer>
        </el-container>
      </template>
      <template slot="paneR">
        <el-container>
          <el-header>
            <el-form :inline="true">
              <el-form-item>
                <el-input
                  style="width:300px;"
                  v-model="pagerriskType.condition"
                  :disabled="!curRow.riskid"
                  placeholder="输入关键字"
                ></el-input>
              </el-form-item>
              <el-form-item>

              </el-form-item>
              <el-form-item>
                <el-button-group>
                   <el-button
                  type="primary"
                  icon="el-icon-search"
                  :disabled="!curRow.riskid"
                  @click="risktypeinfo_Get"
                >查询</el-button>
                 <el-button :disabled="!curRow.riskid" icon="el-icon-circle-plus-outline" type="primary" @click="risklevelAdd">添加等级</el-button>
                </el-button-group>
              </el-form-item>
            </el-form>
          </el-header>
          <el-table :data="riskTypeList" stripe border height="100%">
            <el-table-column
              label="风险等级"
              sortable
              show-overflow-tooltip
              align="center"
              prop="levelname"
            />
            <el-table-column
              align="center"
              sortable
              show-overflow-tooltip
              prop="status"
              width="100"
              label="状态"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="GetOpenAndStoptatusType(scope.row.status)"
                  disable-transitions
                >{{ scope.row.statusdisplay }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="风险描述" show-overflow-tooltip align="center" prop="levelnote" />
            <el-table-column align="center" label="操作" width="200">
              <template slot="header" slot-scope="scope">
                <span class="primary">操作</span>
              </template>
              <template slot-scope="scope">
                <div class="tableBtn">
                  <el-link
                    title="删除"
                    @click="Del(scope.row)"
                    :underline="false"
                    type="danger"
                    icon="mkfont trasch"
                  ></el-link>
                  <el-link
                    title="上移"
                    @click="MoveUp(scope.$index,scope.row,riskTypeList,'serialnumber','orderno',risklevel_Get,'/Hcrm/Risktypeinfo/risklevel_UpAndDown')"
                    :underline="false"
                    type="primary"
                    icon="mkfont shangyi"
                  ></el-link>
                  <el-link
                    title="下移"
                    @click="MoveDow(scope.$index,scope.row,riskTypeList,'serialnumber','orderno',risklevel_Get,'/Hcrm/Risktypeinfo/risklevel_UpAndDown')"
                    :underline="false"
                    type="primary"
                    icon="mkfont xiayi"
                  ></el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-footer>
            <mk-page :pager="pagerriskType" @query="risklevel_Get" />
          </el-footer>
        </el-container>
      </template>
    </SplitPane>
    <!-- 类型添加 -->
      <!-- liqian-高度auto -->
    <vxe-modal
      v-model="riskCateAddModal"
      :showFooter="true"
      @close="colseModel"
      title="风险类型维护"
      width="540"
      height="auto"
    >
    
      <el-form :model="riskCateAddForm" :rules="rules" ref="riskCateAddForm" label-width="120px">
        <el-form-item label="风险类型名称" prop="riskname">
          <el-input class="input" v-model="riskCateAddForm.riskname" placeholder="请输入风险类型名称"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            resize="none"
            :rows="2"
            v-model="riskCateAddForm.note"
            placeholder="描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="primary" @click="riskCateSubmit">提交</el-button>
          <el-button type="warning" @click="colseModel">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>

    <!-- 风险等级添加 -->
    <vxe-modal
      v-model="risklevelAddModal"
      @close="colseLevelModel"
      :showFooter="true"
      title="风险等级维护"
      width="540"
      height="auto"
    >
    <!-- liqian-高度auto -->
      <div slot="title">
        风险类型维护- [
        <span class="danger">{{curRow.riskname}}</span>]
      </div>
      <el-form :model="riskTypeAddForm" :rules="rules" ref="riskTypeAddForm" label-width="120px">
        <el-form-item label="风险等级名称" prop="levelname">
          <el-input
            class="input"
            v-model="riskTypeAddForm.levelname"
            placeholder="请输入风险等级名称 例如1级，2级"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            resize="none"
            :rows="2"
            v-model="riskTypeAddForm.levelnote"
            placeholder="描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="primary" @click="riskLevelSubmit">提交</el-button>
          <el-button type="warning" @click="colseLevelModel">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
  </d2-container>
</template>
<<script>
export default {
    data() {
        return {
          riskCateAddModal:false,
          risklevelAddModal:false,
          rules:{
            riskname: [
              { required: true, message: "请输入风险类型名称", trigger: "blur" }
            ],
          },
          riskCateAddForm:{
            riskid: 0,//风险类型ID，唯一主键
            note: "",//风险类型描述
            orderno: 0,//排序号
            riskname: "",//风险类型名称
            status: 0,//风险类型状态 0：停用 1：启用
            operateType: "",
          },
          riskTypeAddForm:{
            serialnumber: 0,  //主键
            levelid: 0,//等级ID
            levelname: "",//等级名称
            levelnote: "",//等级描述
            orderno: 0,//排序号
            risktypeid: 0,//类型ID,来源代码_风险类型信息表(riskid)
            status: 1,
            operateType: "",
          },
         submitType: 0, //提交类型 0新增 1编辑
          pagerriskCate: {
            count: 0,
            page: 1,
            rows: 20,
            condition:'',
            // hospitalid:''
          },
          pagerriskType:{
            count: 0,
            page: 1,
            rows: 20,
            risktypeid:'',
            condition:'',
            // hospitalid:''
          },
          curRow:{},
          riskCateList:[],
          riskTypeList:[
          ]
        }
    },
    created() {
      this.risktypeinfo_Get();
    },
    methods: {
      colseModel(){
        this.riskCateAddModal = false;
        this.submitType = 0;
         this.riskCateAddForm = {
            riskid: 0,//风险类型ID，唯一主键
            note: "",//风险类型描述
            orderno: 0,//排序号
            riskname: "",//风险类型名称
            status: 0,//风险类型状态 0：停用 1：启用
            operateType: "",
          };
      },
      colseLevelModel(){
        this.risklevelAddModal = false;
        this.submitType = 0;
         this.riskTypeAddForm = {
            serialnumber: 0,  //主键
            levelid: 0,//等级ID
            levelname: "",//等级名称
            levelnote: "",//等级描述
            orderno: 0,//排序号
            risktypeid: '',//类型ID,来源代码_风险类型信息表(riskid)
            status: 1,
            operateType: "",
          }
      },
    //添加分类
    risktypeAdd(){
       this.riskCateAddModal = true;
       this.submitType = 0;
    },
    //新增风险类型信息
    risktypeinfo_Add(){
      this.MK.Request(
        "/Hcrm/Risktypeinfo/risktypeinfo_Add",
        "post",
        this.riskCateAddForm
      ).then(res => {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.risktypeinfo_Get();
        this.colseModel();
      });
    },
     //分类行点击事件
    riskRowClick(row){
      this.curRow = JSON.parse(JSON.stringify(row)); //深度复制;
      this.pagerriskType.risktypeid = this.curRow.riskid;
      this.riskTypeAddForm.risktypeid = this.curRow.riskid;
      this.risklevel_Get();
    },
    ///Hcrm/Risktypeinfo/risklevel_Get 根据风险类型id查询风险等级

    //编辑风险类型
    risktypeEdit(row){
      this.submitType = 1;
      this.riskCateAddForm = JSON.parse(JSON.stringify(row));
      this.riskCateAddModal = true;
    },
    //
    risktypeinfo_Edit(){
       this.MK.Request(
        "/Hcrm/Risktypeinfo/risktypeinfo_Edit",
        "post",
        this.riskCateAddForm
      ).then(res => {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.risktypeinfo_Get();
        this.colseModel();
      });
    },
    //风险类型提交
    riskCateSubmit() {
      this.$refs.riskCateAddForm.validate(valid => {
        if (valid) {
          if (this.submitType == 0) {
            this.risktypeinfo_Add();
          } else {
            this.risktypeinfo_Edit();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //查询风险类型信息
    risktypeinfo_Get(){
      this.MK.Request(
        "/Hcrm/Risktypeinfo/risktypeinfo_Get",
        "get",
        this.pagerriskCate
      ).then(res => {
        if (res.code == 0) {
          this.riskCateList = res.data;
          this.pagerriskCate.count = res.count;
          this.curRow = {};

          this.pagerriskType.risktypeid = res.data[0].riskid;
          this.riskTypeAddForm.risktypeid = res.data[0].riskid;
          this.risklevel_Get();

        }
      });
    },
    //根据风险类型id查询风险等级
    risklevel_Get(){
      this.MK.Request(
        "/Hcrm/Risktypeinfo/risklevel_Get",
        "get",
        this.pagerriskType
      ).then(res => {
        if (res.code == 0) {
          this.riskTypeList = res.data.filter(item => item.status != 99);
          this.pagerriskType.count = res.count;
        }
      });
    },
     //添加风险等级信息
    risklevelAdd(){
      this.risklevelAddModal = true;
      this.submitType = 0;
    },
    //Del
    Del(row){
       this.$confirm(`确认要删除, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
         let sendData = {
        "serialnumber": row.serialnumber,
        "levelid": row.levelid,
        "levelname":  row.levelname,
        "levelnote": row.levelnote,
        "orderno": row.orderno,
        "risktypeid": row.risktypeid,
        "status": 99,
      }
       this.MK.Request(
        "/Hcrm/Risktypeinfo/risklevel_StopAndOpen",
        "post",
        sendData
      ).then(res => {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.risklevel_Get();
      });
      })

    },
    operate(){

    },
    risklevel_Add(){
       this.MK.Request(
        "/Hcrm/Risktypeinfo/risklevel_Add",
        "post",
        this.riskTypeAddForm
      ).then(res => {
        this.$message({
          type: "success",
          message: res.msg
        });
        this.risklevel_Get();
        this.colseLevelModel();
        this.riskTypeAddForm.risktypeid = this.curRow.riskid;
      });
    },
    //风险等级信息提交
      riskLevelSubmit(){
        this.$refs.riskTypeAddForm.validate(valid => {
        if (valid) {
            if (this.submitType == 0) {
              this.risklevel_Add();
            } else {
              this.risktypeinfo_Edit();
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
       //行点击样式
    tableRowClassName({row, rowIndex}) {
        if (row.riskid === this.pagerriskType.risktypeid) {
          return 'current-row';
        }
        return '';
      },
  }
}
</script>
<style  scoped>
</style>
