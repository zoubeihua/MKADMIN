export default {
	name:'select-template',
	render(h){
		return h('div',{attrs:{class:'selectTemplate'},style:{width:'100%',display:'flex',background: '#272822',padding: '6px'}},
			[
				h('div',{style:{marginRight:'10px'}},[
					h('div',{'class':{'active':this.active == 'default'},on:{click:()=>{this.selectHandler('default')}},style:{width:'80px',height:'80px',border: '1px solid #606266',cursor: 'pointer'}},[
						h('div',{attrs:{class:'dashed'},style:{width:'100%',height:'30px',borderBottom:'1px #606266 dashed'}})
					]),
					h('div',{attrs:{class:'text'},domProps:{innerHTML: '默认'},style:{textAlign:'center'}})
				]),
				h('div',{style:{marginRight:'10px'}},[
					h('div',{'class':{'active':this.active == 'mkLR'},on:{click:()=>{this.selectHandler('mkLR')}},style:{width:'80px',height:'80px',border: '1px solid #606266',cursor: 'pointer'}},[
						h('div',{attrs:{class:'dashed'},style:{height:'100%',width:'30px',borderRight:'1px #606266 dashed'}})
					]),
					h('div',{attrs:{class:'text'},domProps:{innerHTML: '左右布局'},style:{textAlign:'center'}})
				]),
				h('div',{style:{marginRight:'10px'}},[
					h('div',{'class':{'active':this.active == 'mkTB'},on:{click:()=>{this.selectHandler('mkTB')}},style:{width:'80px',height:'80px',border: '1px solid #606266',cursor: 'pointer'}},[
						h('div',{attrs:{class:'dashed'},style:{height:'40px',width:'100%',borderBottom:'1px #606266 dashed'}})
					]),
					h('div',{attrs:{class:'text'},domProps:{innerHTML: '上下布局'},style:{textAlign:'center'}})
				])
				
			]
		)
	},
	data(){
		return {
			active:'default'
		}
	},
	methods:{
		selectHandler(type){
			this.active = type;
			this.$emit('change',type);
		}
	}
}