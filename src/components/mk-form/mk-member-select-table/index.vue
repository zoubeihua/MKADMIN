<template>
  <vxe-pulldown ref="xDown">
    <template>
      <el-input
        ref="input"
        style="width: 100%;"
        readonly
        @keyup.enter.native="focusEvent"
        @focus="focusEvent"
        @click.stop="focusEvent"
        placeholder="请选择人员"
        v-model="value"
      >
        <i
          slot="suffix"
          @click.stop="suffixClick"
          style="cursor: pointer;"
          class="el-input__icon el-icon-search"
        ></i>
      </el-input>
    </template>
    <template v-slot:dropdown>
      <div class="my-dropdown4">
        <el-container>
          <el-header>
            <el-form :inline="true">
              <el-form-item>
                <el-input
                  style="width:300px"
                  type="text"
                  clearable
                  v-model="form.condition"
                  @keyup.enter.native="refreshList"
                  placeholder="按会员卡号 / 姓名 / 拼音 / 联系电话查询"
                />
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button type="primary" icon="el-icon-search" @click="refreshList">查询</el-button>
                </el-button-group>
              </el-form-item>
            </el-form>
          </el-header>
          <el-table
            :data="tableData"
            border
            style="width:100%"
            height="100%"
            stripe
            highlight-current-row
            @row-click="cellClickEvent"
            ref="tableM"
          >
            <el-table-column
              show-overflow-tooltip
              sortable
              label="会员卡号"
              align="center"
              prop="cardno"
            />
            <el-table-column
              sortable
              show-overflow-tooltip
              label="会员姓名"
              align="center"
              prop="membername"
            >
              <template slot-scope="scope">
                <div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="scope.row.sex_dispalay"
                    placement="left"
                  >
                    <i
                      :class="['mkfont', scope.row.sex == 1 ? 'nan' : scope.row.sex == 2 ? 'nv' : 'weizhi']"
                      :style="{color: scope.row.sex == 1 ? '#6DCEFA' : scope.row.sex == 2 ? '#F37E7D' : '' }"
                    ></i>
                  </el-tooltip>
                  <span style="min-width:60px;display:inline-block;">{{scope.row.membername}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="等级" sortable>
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.memberlevel_display"
                  placement="right"
                >
                  <i
                    :class="['mkfont', scope.row.icon ? scope.row.icon.split(',')[0] : '']"
                    :style="{color: scope.row.icon ? scope.row.icon.split(',')[1] : '', fontSize: 28 + 'px'}"
                  ></i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              sortable
              label="联系电话"
              align="center"
              prop="mobiletel"
            >
              <template slot-scope="scope">{{scope.row.mobiletel | toTel}}</template>
            </el-table-column>
          </el-table>
          <el-footer>
            <mk-page :pager="form" @query="refreshList" />
          </el-footer>
        </el-container>
      </div>
    </template>
  </vxe-pulldown>
</template>

<script>
export default {
  name: "mk-member-select-table",
  props: {
    value: "",
    height: {
      type: String,
      default: "600"
    }
  },
  data() {
    return {
      tableData: [],
      memberLevelSelect: [],
      form: {
        createuserid: "",
        mycustomer: 0,
        expirationdaysmemberfee: 0,
        regdatebegin: "",
        regdatesend: "",
        levelidarr: [],
        condition: "",
        page: 1,
        rows: 20,
        count: 0,
        orderby: ""
      }
    };
  },
  created() {
    // this.Memberlevel_Get();
    this.refreshList();
  },
  methods: {
    // 分页刷新 查询
    refreshList() {
      this.MemberInfo_Get();
    },
    Memberlevel_Get() {
      this.MK.Request("Publics/MemberManage/Memberlevel", "get", {
        condition: "",
        page: 1,
        rows: 10,
        tag: 1
      }).then(res => {
        this.memberLevelSelect = res.data.map(item => {
          item.isCheck = false;
          return item;
        });
      });
    },
    MemberInfo_Get() {
      this.form.createuserid = this.info.userid;
      this.MK.Request("Publics/MemberManage/BasicInfo", "get", this.form).then(
        res => {
          this.tableData = res.data;
          this.form.count = res.count;
        }
      );
    },
    focusEvent() {
      let offsetWidthInput = this.$refs.input.$refs.input.offsetWidth;
      let DOMRect = this.$refs.input.$refs.input.getBoundingClientRect();
      this.$refs.xDown.$refs.panel.style.position = "fixed";
      this.$refs.xDown.$refs.panel.style.minWidth = "auto";
      this.$refs.xDown.$refs.panel.style.width = offsetWidthInput + "px";
      this.$refs.xDown.$refs.panel.style.height = this.height + "px";
      this.$refs.xDown.$refs.panel.style.left = DOMRect.left + "px";
      this.$refs.xDown.showPanel();
    },
    keyupEvent() {
      const { value4 } = this;
      this.loading4 = true;
      setTimeout(() => {
        this.loading4 = false;
        if (value4) {
          this.tableList = this.tableList.filter(
            row => row.name.indexOf(value4) > -1
          );
        } else {
          this.tableList = this.tableList.slice(0);
        }
      }, 100);
    },
    suffixClick() {
      let offsetWidthInput = this.$refs.input.$refs.input.offsetWidth;
      let DOMRect = this.$refs.input.$refs.input.getBoundingClientRect();
      this.$refs.xDown.$refs.panel.style.position = "fixed";
      this.$refs.xDown.$refs.panel.style.minWidth = "auto";
      this.$refs.xDown.$refs.panel.style.width = offsetWidthInput + "px";
      this.$refs.xDown.$refs.panel.style.height = this.height + "px";
      this.$refs.xDown.$refs.panel.style.left = DOMRect.left + "px";
      this.$refs.xDown.togglePanel();
    },
    cellClickEvent(row) {
      this.$emit("input", row.membername);
      this.$emit("change", row);
      this.$refs.xDown.hidePanel();
    }
  }
};
</script>

<style scoped>
.vxe-pulldown {
  width: 100% !important;
}

.my-dropdown4 {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.1);
}
</style>
