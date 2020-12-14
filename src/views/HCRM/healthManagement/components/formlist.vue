<template>
  <el-container v-if="toFormModal">
    <vxe-modal v-model="toFormModal" :showFooter="true" title="表单添加" width="1000" height="800">
      <SplitPane :min-percent="20" :default-percent="50" split="vertical">
        <template slot="paneL">
          <el-container>
            <el-header
              style="padding: 0 10px !important;background: #84d2cf;height: 36px !important;justify-content: space-between;"
            >
              <div>未添加</div>
            </el-header>
            <el-table
              stripe
              :data="toFormModalList"
              @row-click="formClick"
              border
              ref="multipleTable"
              height="100%"
              style="width: 100%"
            >
              <el-table-column show-overflow-tooltip prop="crfname" sortable label="表单名称"></el-table-column>
              <el-table-column align="center" label="操作" width="80">
                <template slot="header">
                  <span class="primary">操作</span>
                </template>
                <template slot-scope="scope">
                  <div class="tableBtn">
                    <el-link
                      title="添加"
                      @click.stop="Add(scope.$index)"
                      :underline="false"
                      type="primary"
                      icon="el-icon-plus"
                    ></el-link>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-footer>
              <mk-page :pager="pagertoFormModal" @query="edcclasscrf_Get" />
            </el-footer>
          </el-container>
        </template>
        <template slot="paneR">
          <el-container>
            <el-header
              style="padding: 0 10px !important;background: #84d2cf;height: 36px !important;justify-content: space-between;"
            >
              <div>已添加</div>
            </el-header>
            <el-table :data="AddList" stripe @row-click="AddClick" border ref="multipleTable" height="100%" style="width: 100%">
              <el-table-column show-overflow-tooltip prop="crfname" sortable label="表单名称"></el-table-column>
              <el-table-column align="center" label="操作" width="80">
                <template slot="header">
                  <span class="primary">操作</span>
                </template>
                <template slot-scope="scope">
                  <div class="tableBtn">
                    <el-link
                      title="删除"
                      @click.stop="Del(scope.$index)"
                      :underline="false"
                      type="primary"
                      icon="el-icon-delete"
                    ></el-link>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-footer>
              <mk-page :pager="AddPager" @query="AddList_Get" />
            </el-footer>
          </el-container>
        </template>
      </SplitPane>

      <div slot="footer" style="text-align:center;">
        <el-button-group>
          <el-button type="success" @click="submitData">提交</el-button>
          <el-button type="warning" @click="toFormModal=false">取消</el-button>
        </el-button-group>
      </div>
    </vxe-modal>
  </el-container>
</template>
<script>
export default {
  name: "FormList",
  data() {
    return {
      toFormModal: false,
      toFormModalList: [],
      AddList: [],
      multipleSelection: [],
      pagertoFormModal: {
        count: 0,
        page: 1,
        rows: 20,
        subclassid: "",
        condition: ""
      },
      AddPager: {
        count: 0,
        page: 1,
        rows: 20,
        subclassid: "",
        condition: ""
      }
    };
  },
  mounted() {},
  computed: {
    disabled() {
      return this.multipleSelection.length > 0 ? false : true;
    }
  },
  watch:{
    toFormModalList(val){
      this.pagertoFormModal.count = val.length;
    },
    AddList(val){
      this.AddPager.count = val.length;
    }
  },
  methods: {
    open(data) {
      if (data) {
        console.log(data);
        this.pagertoFormModal.subclassid = data.subclassid;
        this.AddPager.subclassid = data.subclassid;
      }
      this.pagertoFormModal.page = 1;
      this.AddPager.page = 1;
      this.toFormModal = true;
      this.edcclasscrf_Get();
      this.AddList_Get();
    },
    // 根据edc小类id获取对应的表单列表(Subclassid：小类id)
    edcclasscrf_Get() {
      this.MK.Request(
        "/Publics/CRFClassMaintain/edcclasscrf_Get",
        "get",
        this.pagertoFormModal
      ).then(res => {
        if (res.code == 0) {
          // this.pagertoFormModal.count = res.count;
          this.toFormModalList = res.data.filter(
            item => item.checked == "false"
          );
          this.pagertoFormModal.count = this.toFormModalList.length;
          // this.$nextTick(() => {
          //   this.toFormModalList.forEach(item => {
          //     if (item.checked == "true") {
          //       this.$refs.multipleTable.toggleRowSelection(item, true);
          //     } else {
          //       this.$refs.multipleTable.toggleRowSelection(item, false);
          //     }
          //   });
          // });
        }
      });
    },
    //获取已添加
    AddList_Get() {
      this.MK.Request(
        "/Publics/CRFClassMaintain/crfListBySubclassidHavePage_Get",
        "get",
        this.AddPager
      ).then(res => {
        if (res.code == 0) {
          this.AddPager.count = res.count;
          this.AddList = res.data;
        }
      });
    },
    //左边单击
    formClick(row){
      // let index = this.toFormModalList.findIndex(item => item.crfid == row.crfid);
      // this.push(index)
    },
    Add(index) {
      this.push(index)
    },
    push(index){
      this.AddList = [...this.AddList,...this.toFormModalList.splice(index,1)];
    },
    //右边点击
    AddClick(row){
      // let index = this.AddList.findIndex(item => item.crfid == row.crfid);
      // this.delPush(index);
    },
    Del(index) {
      this.delPush(index);
    },
    delPush(index){
      this.toFormModalList = [...this.toFormModalList,...this.AddList.splice(index,1)]
    },
    close() {
      this.toFormModal = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    submitData() {
      this.toFormModal = false;
      this.$emit("change", this.AddList);
    },
    refreshtoFormModal() {}
  }
};
</script>
