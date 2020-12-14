<template>
  <el-container>
    <el-header>
      <p class="title pingfang">知情同意书</p>
    </el-header>
    <el-main :style="{height: height + 'px'}">
			<div>尊敬的会员<span class="bold">{{userData.membername}}</span>{{userData.sex == 1 ? "先生" : "女士"}}，您好：</div>
			<div><p class="first_line">首先非常感谢您选择信任我们，成为了<span class="bold">{{projectName}}</span>的会员。希望您喜欢<span class="bold">{{projectName}}</span>，同时您可以享受会员等级下的各种权益活动。</p></div>
		</el-main>
    <el-footer class="footer">
      <div class="pingfang">
        <div style="margin-bottom: 20px;">签名：</div>
        <div>日期：________ 年 ________ 月 ________ 日</div>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: "consentDoc",
  props: {
    userData: {
      type: Object,
      default: () => {}
		},
		height: {
			type: Number
		}
	},
	data() {
		return {
			projectName: process.env.VUE_APP_PROJECTNAME
		}
	}
};
</script>

<style scoped>
.pingfang {
  font-family: "PingFang SC";
}
.bold {
	margin: 0 4px;
	font-size: 16px;
	font-weight: 900;
}
.title {
  width: 100%;
  text-align: center;
  font-size: 24px;
  font-weight: 900;
}
.first_line {
	text-indent: 30px;
}
.footer {
  display: flex;
  justify-content: flex-end;
}
</style>