<template>
	<div style="display: flex;position: relative;5px;margin-right: 10px;">
		<div style="padding:5px 10px 0 10px;flex:1;" class="toolForm">
			<slot></slot>
		</div>
		<div class="el-dropdown dropdowH">
			<div class="el-button-group group">
					<el-button type="primary"  @click="query">
						查询
					</el-button>
					<el-button   type="primary" @click="clickEvent" ref="DropClick" icon="el-icon-arrow-down" class="el-dropdown__caret-button" ></el-button>
				 
			</div>
		</div>
		<transition name="fade">
			<div class="my-dropdown" ref="myDropdown"  v-show="show">
				<el-container style="height: 100%;">
					<el-main style="overflow:hidden;padding:20px;">
						<slot name="detail"></slot>
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
				show: false
			}
		},
		created() {
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
			},
			//计算
			watchEl(){
				this.$nextTick(() => {
					let parentW = this.grid.$el.querySelectorAll('.vxe-toolbar')[0].offsetWidth;//grid组件宽度
					console.log(this.grid.$el.querySelectorAll('.vxe-toolbar')[0].offsetWidth);
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
					this.$refs.myDropdown.style.top =  H + 5 + 'px';
				})
			},
			close(){
				this.show = false;
				this.$emit('close')
			},
			query(){
				this.$emit('query')
			},
			reset(){
				this.$emit('reset')
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

::v-deep .dropdowH{
	display:flex !important;
	align-items: center !important;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
