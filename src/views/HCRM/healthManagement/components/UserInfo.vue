<template>
<div>
  <div class="checkPlanBox">
    <div class="checkPlan">
      <div class="name">会员姓名：</div>
      <div>{{userItem.membername}}</div>
    </div>
    <div class="checkPlan">
      <div class="name">会员等级：</div>
      <div>{{userItem.memberlevel_display}}</div>
    </div>
    <div class="checkPlan">
      <div class="name">会员性别：</div>
      <div>{{userItem.sex_dispalay}}</div>
    </div>
    <div class="checkPlan">
      <div class="name">会员年龄：</div>
      <div class>{{userItem.age}}</div>
    </div>
  </div>
  <div class="checkPlan">
    <div class="name">服务信息：</div>
    <div class>
      {{userItem.rightsname}}
      <span
        style="color:#409eff"
      >{{userItem.inrights==1? '(权益内' : '(权益外'}} {{'x'+userItem.reqcount+')'}}</span>
    </div>
  </div>
  <div class="checkPlan">
    <div class="name">要求日期：</div>
    <div class>{{userItem.reqclaimdate}}</div>
  </div>
  <div class="checkPlan" v-if="!!userItem.reqnote">
    <div class="name">要求备注：</div>
    <div class>{{userItem.reqnote}}</div>
  </div>
  </div>
</template>
<script>
export default {
  props: ["userItem"],
  data() {
    return {
    };
  },
   watch: {
    userItem (newV, oldV) { // watch监听props里status的变化，然后执行操作
      console.log(newV, oldV)
      this.userItem = newV
    }
  },
  
};
</script>
<style  scoped lang="scss">
.checkPlanBox {
  display: flex;
  justify-content: space-between;
  width: 90%;
}
.checkPlan {
  line-height: 40px;
  .name {
    color: #909399;
    margin-right: 6px;
  }
  div {
    color: #333;
    display: inline-grid;
  }
}
</style>
