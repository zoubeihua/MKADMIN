<template>
	<div>
		<vxe-modal v-model="display" :zIndex="99999" width="1000" height="600" fullscreen ref="scriptModal" :showFooter="true" min-width="400"
		 min-height="400" resize>
			<div slot="header"><i class="icon iconfont icon-jiaoben"></i> 脚本编辑 <span style="color:red;"> [ {{data.name}} -
					{{data.model}} ] </span></div>
			<el-container>
				<el-main style="padding:0;">
					<code-editor
					  height="100%"
					  mode="javascript"
					  v-model="data.options.script"
					></code-editor>
				</el-main>
			</el-container>
			<div slot="footer">
				<el-button type="success" @click="savedisplayRuleModal">确认</el-button>
				<el-button type="danger" @click="closedisplayRuleModal">取消</el-button>
			</div>
		</vxe-modal>
	</div>
</template>
<script>
	import {
		mapState,
		mapActions
	} from "vuex";
	import CodeEditor from "../CodeEditor";
	export default {
		name: "script-modal",
		props: ["data", "visible"],
		components:{
			CodeEditor
		},
		computed: {
			...mapState("d2admin/user", ["info"])
		},
		data() {
			return {
				//控件列表
				controlList: [],
				display: this.visible,
			};
		},
		created() {

		},
		methods: {
			savedisplayRuleModal() {
				this.$emit("change", this.tableData);
				// this.data =  this.option.options.condition
				this.display = false;
			},
			closedisplayRuleModal() {
				this.display = false;
			}
		},
		watch: {
			visible(val) {
				this.display = val;
			},
			display(val) {
				this.$emit("update:visible", val);
			}
		}
	};
</script>
<style lang="scss" scoped>
</style>
