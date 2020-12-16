<template>
 <vxe-modal v-model="dialogFormModal" :title="title"  width="800" showFooter  remember min-height="800" resize>
	 <el-container style="height: 100%;">
		 <el-main style="padding: 0;overflow: hidden;">
			 <slot />
			  <!-- <el-scrollbar style="height:100%"> -->
				  <mk-generate-form
				    :data="jsonData" 
				    :value="editData" 
				    :key="key"
				    :edit="isEdit"
				  >
				  </mk-generate-form>
			  <!-- </el-scrollbar> -->
		 </el-main>
	 </el-container>
	<div slot="footer" style="text-align: center;">
		<el-button-group>
		  <el-button type="primary" :size="jsonData.config.size">保存</el-button>
		  <el-button type="warning" :size="jsonData.config.size">关闭</el-button>
		</el-button-group>
	</div>
 </vxe-modal>
	 
</template>

<script>

export default {
  name: "dialog-form",
  inject: ["grid"],
  data () {
    return {
		dialogFormModal:false,
		isEdit:true,
		title:'新增',
		jsonData:{
			list: [],
			config: {
				labelWidth: 100,
				labelPosition: 'right',
				size: 'small',
				customClass: '',
				ui: 'element',
				layout: 'horizontal',
				labelCol: 3,
				width: '100%',
				hideLabel: false,
				hideErrorMessage: false
			}
		},
		editData:{},
		key:new Date().getTime()
    };
  },
  props: {
   
  },
  watch: {
   
  },
  computed: {
   
  },
  
  methods: {
		show(type,value){
			
			switch(type){
				case 'add':
					this.add();
				break;
				case 'edit':
					this.edit(value);
				break;
				case 'look':
					this.look(value);
				break;
			};
			this.dialogFormModal = true;
		},
		//新增
		add(){
			this.title = '新增';
			this.jsonData = this.grid.addForm;
			this.editData = {};
			this.isEdit = true;
			this.$nextTick(() => {
				this.key = new Date().getTime();
			})
		},
		//编辑
		edit(value){
			this.title = '编辑';
			this.jsonData = this.grid.editForm;
			this.editData = value;
			this.isEdit = true;
			this.$nextTick(() => {
				this.key = new Date().getTime();
			})
		},
		//查看
		look(value){
			this.title = '查看';
			this.jsonData = this.grid.editForm;
			this.editData = value;
			this.isEdit = false;
			this.$nextTick(() => {
				this.key = new Date().getTime();
			})
		}
   
  }
};
</script>
<style scoped>
	::v-deep .el-scrollbar__wrap {
		overflow-x: hidden;
	}

</style>
