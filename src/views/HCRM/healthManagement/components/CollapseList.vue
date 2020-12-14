<template>
  <el-collapse v-model="activeName" accordion>
    <el-collapse-item title name="1" v-for="(item,index) in dataList"  :key="index">
      <template slot="title">
        <div style="padding-left:4px;">{{item.title}}</div>
      </template>
      <div class="dept">
        <div
          class="dept-item"
          :class="[curIndex === indexs ? 'active' : '']"
          v-for="(keys,indexs) in item.list"  :key="indexs"
          @click="setCurIndex(indexs)"
        >
          <div class="icon" :class="[curIndex === indexs ? 'activeIcon' : '']"></div>
          <div class="name">{{keys.crfname}}</div>
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
export default {
  props:['list'],
  data() {
    return {
      activeName: "1",
      curIndex: null,
      dataList: this.list
    };
  },
  methods: {
    setCurIndex(index) {
      let data = {};
      if (this.curIndex === index) {
        this.curIndex = null;
        data = null
      } else {
        this.curIndex = index;
        data = this.dataList[0]['list'][this.curIndex]
      }
      this.$emit('change',data)
    }
  }
};
</script>
<style  scoped>
>>> .el-collapse-item__wrap{
  border-bottom: 0 !important;
}
.content {
  display: flex;
  height: 100%;
}
.content .L {
  flex: 1;
  height: 100%;
  border: 1px solid #eee;
}
.content .R {
  flex: 3;
  height: 100%;
}
.dept {
  border-top: 1px solid #eee;
}
.dept .icon {
  margin-right: 6px;
  width: 12px;
  height: 16px;
  background: #ccc;
}
.active {
  background: #0c4e8b !important;
  color: #fff;
}
.activeIcon {
  background: #4694dd !important;
}
.dept-item {
  cursor: pointer;
  display: flex;
  padding: 0 10px;
  align-items: center;
  height: 30px;
  border-bottom: 1px solid #eee;
}
</style>
