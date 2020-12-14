<template>
  <div class="content">
    <!--问卷查看 -->
    <div class="L">
      <collapse-list :list="deptList"></collapse-list>
    </div>
    <div class="R">
      <div style="height:460px;overflow-y: auto;">

      </div>
    </div>
  </div>
</template>
<script>
import CollapseList from './CollapseList'
export default {
  components:{
    CollapseList
  },
  data() {
    return {
      url:'',
      activeName: "1",
      curIndex: null,
      deptList:[
        {
          title: "妇科已婚",
          list: [
            {
              name: "家族史"
            },
            {
              name: "现病史"
            },
            {
              name: "过敏史"
            },
            {
              name: "用药史"
            },
            {
              name: "手术史"
            },
            {
              name: "月经生育史"
            }
          ]
        }
      ]
    };
  },
  methods: {
    setCurIndex(index) {
      if (this.curIndex === index) {
        this.curIndex = null;
      } else {
        this.curIndex = index;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
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
