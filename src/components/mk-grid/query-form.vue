<template>
	<div style="display: flex;position: relative;margin-top:5px;">
		<div style="padding-right: 10px;flex:1;" class="toolForm">
			<mk-generate-form
			  :data="queryForm" 
			  :value="editData" 
			  :key="key"
			   @on-change="onChangeFormShow"
			>
			</mk-generate-form>
		</div>
		<div class="el-dropdown">
			<div class="el-button-group group">
					<el-button type="primary" :size="queryForm.config.size" @click="query">
						查询
					</el-button>
					<el-button :size="queryForm.config.size"  type="primary" @click="clickEvent" ref="DropClick" icon="el-icon-arrow-down" class="el-dropdown__caret-button" ></el-button>
				 
			</div>
		</div>
		<transition name="fade">
			<div class="my-dropdown" ref="myDropdown"  v-show="show">
				<el-container style="height: 100%;">
					<el-main style="overflow:hidden;padding:20px;">
						<mk-generate-form
						  :data="queryForm" 
						  @on-change="onChangeForm"
						  :value="editData" 
						  :key="key"
						  ref="generateForm"
						>
						</mk-generate-form>
					</el-main>
					<el-footer style="display: flex; align-items: center;justify-content: flex-end;">
						<el-button type="primary" size="mini" icon="el-icon-search" @click="query">查询</el-button>
						<el-button type="primary" size="mini" icon="el-icon-refresh-right" @click="reset">重置</el-button>
						<el-button type="primary" size="mini" icon="el-icon-close" @click="close">关闭</el-button>
					</el-footer>
				</el-container>
			</div>
		</transition>
	</div>
</template>
<script>

	export default {
		name:'query-form',
		inject:['grid'],
		data(){
			return {
				show: false,
				queryForm:{},
				editData:{
					
				},
				key:new Date().getTime()
			}
		},
		created() {
			this.queryForm = this.grid.queryForm;
			console.log(this.queryForm)
		},
		mounted(){
			window.onresize = () => {
			   this.watchEl()
			};
		},
		methods:{
			clickEvent (e) {
				this.show = !this.show;
				this.watchEl();
				this.queryForm = this.grid.queryForm;
			},
			//计算
			watchEl(){
				this.$nextTick(() => {
					let parentW = this.grid.$el.querySelectorAll('.vxe-grid')[0].offsetWidth;//grid组件宽度
					let parentL = this.grid.$el.offsetLeft;//grid件距离左边距离
					let DOMRect = this.$refs.DropClick.$el.getBoundingClientRect();//下拉按钮元素属性
					let T = DOMRect.top;
					let H = DOMRect.height;
					this.$refs.myDropdown.style.position = 'absolute';//fixed
					this.$refs.myDropdown.style.width = parentW + 'px';
					// this.$refs.myDropdown.style.left = -((X - parentL ) - coutBtnW) + 'px';
					// this.$refs.myDropdown.style.left = parentL  + 'px';
					this.$refs.myDropdown.style.left = 0;
					// this.$refs.myDropdown.style.top = (T + H) + 'px';
					this.$refs.myDropdown.style.top =  H + 10 +  'px';
				})
			},
			close(){
				this.show = false;
				this.$emit('close')
			},
			query(){
				let $form = this.$refs.generateForm;
				if($form){
					$form.getData().then(data => {
						let form = data;
						this.$emit('query',data)
					})
				}
			},
			hideEvents($event){
				
			},
			onChangeFormShow(field, value){
				this.editData[field] = value;
				console.log('onChangeFormShow',this.editData)
				this.$nextTick(() => {
					this.key = new Date().getTime();
					this.$nextTick(() => {
						this.query();
					})
				})
			},
			onChangeForm(field, value){
				this.editData[field] = value;
				console.log('onChangeForm',this.editData)
				this.$nextTick(() => {
					this.key = new Date().getTime();
					this.$nextTick(() => {
						this.query();
					})
				})
			},
			reset(){
				let $form = this.$refs.generateForm;
				if($form){
					this.editData = {}
					$form.reset();
					this.$nextTick(() => {
						this.key = new Date().getTime();
						console.log($form)
						this.$nextTick(() => {
							this.query();
						})
					})
					
				}
			}
		}
	}
</script>

<style scoped>
   .my-dropdown {
	  background-color: #fff;
	  border: 1px solid #dcdfe6;
	  box-shadow: 0 4px 6px 0px rgba(0, 0, 0, 0.1);
	  /* left: 50%; */
	  z-index: 10;
	  /* transform: translateX(-50%); */
	}
	.el-button-group.group>.el-button:not(:first-child):not(:last-child){
		border-radius: 3px;
	}
.toolForm ::v-deep .fm-form-item .el-form-item{
	    margin-bottom: 5px !important;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
