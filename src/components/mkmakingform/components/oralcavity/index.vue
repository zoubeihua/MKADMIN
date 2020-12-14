<template>
	<div :class="{'is-disabled': disabled}">
		<!-- 上牙齿 -->
		<div style="display: flex; border-top: 1px solid #ccc;border-left: 1px solid #ccc;border-right: 1px solid #ccc;text-align: center;font-weight: bold;">
			<div style="flex: 1;"></div>
			<div style="flex: 2;">上右</div>
			<div style="flex: 2;">上左</div>
		</div>
		<div class="table-oralc">
			<div class="table-body">
				<div class="table-t-l">
					<div class="cell" v-for="(item,index) in cavityData.tProject">{{item}}</div>
				</div>
				<div class="table-t-c">
					<div class="cell-body">
						<div class="cell" :class="[key.value != '' && key.checked == key.value ? 'ybg' : '']" v-for="(key,index) in cavityData.oralT.TR['乳牙']" :key="index" @click="selects(key,index,cavityData.oralT.TR,'乳牙')">
							{{key.value}}
						</div>
					</div>
					<div class="cell-body">
						<div class="cell" :class="[key.value != '' && key.checked == key.value ? 'ybg' : '']"  v-for="(key,index) in cavityData.oralT.TR['恒牙']" :key="index" @click="selects(key,index,cavityData.oralT.TR,'恒牙')">
							{{key.value}}
						</div>
					</div>
					<div class="cell-body">
						<div class="cell" :class="[key.checked == key.label ? 'bodyBg' : '']"  v-for="(key,index) in cavityData.oralT.TR['需窝沟封闭']" :key="index" @click="selects(key,index,cavityData.oralT.TR,'需窝沟封闭')">
							{{key.value}}
						</div>
					</div>
					<div class="cell-body">
						<div class="cell" :class="[key.checked == key.label ? 'bodyBg' : '']"  v-for="(key,index) in cavityData.oralT.TR['龋齿需治疗']" :key="index" @click="selects(key,index,cavityData.oralT.TR,'龋齿需治疗')">
							{{key.value}}
						</div>
					</div>
					<div class="cell-body">
						<div class="cell" :class="[key.checked == key.label ? 'bodyBg' : '']"  v-for="(key,index) in cavityData.oralT.TR['需拔除']" :key="index" @click="selects(key,index,cavityData.oralT.TR,'需拔除')">
							{{key.value}}
						</div>
					</div>
				</div>
				<div class="table-t-r">
					<div class="cell-body">
						<div class="cell"  :class="[key.value != '' && key.checked == key.value ? 'ybg' : '']"  v-for="(key,index) in cavityData.oralT.TL['乳牙']" :key="index" @click="selects(key,index,cavityData.oralT.TL,'乳牙')">
							{{key.value}}
						</div>
					</div>
					<div class="cell-body">
						<div class="cell"  :class="[key.value != '' && key.checked == key.value ? 'ybg' : '']"  v-for="(key,index) in cavityData.oralT.TL['恒牙']" :key="index" @click="selects(key,index,cavityData.oralT.TL,'恒牙')">
							{{key.value}}
						</div>
					</div>
					<div class="cell-body">
						<div class="cell" :class="[key.checked == key.label ? 'bodyBg' : '']"  v-for="(key,index) in cavityData.oralT.TL['需窝沟封闭']" :key="index" @click="selects(key,index,cavityData.oralT.TL,'需窝沟封闭')">
							{{key.value}}
						</div>
					</div>
					<div class="cell-body">
						<div class="cell" :class="[key.checked == key.label ? 'bodyBg' : '']"  v-for="(key,index) in cavityData.oralT.TL['龋齿需治疗']" :key="index" @click="selects(key,index,cavityData.oralT.TL,'龋齿需治疗')">
							{{key.value}}
						</div>
					</div>
					<div class="cell-body">
						<div class="cell" :class="[key.checked == key.label ? 'bodyBg' : '']"  v-for="(key,index) in cavityData.oralT.TL['需拔除']" :key="index" @click="selects(key,index,cavityData.oralT.TL,'需拔除')">
							{{key.value}}
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 下牙齿 -->
		<div style="display: flex;border-left: 1px solid #ccc;border-right: 1px solid #ccc;text-align: center;font-weight: bold;">
			<div style="flex: 1;"></div>
			<div style="flex: 2;">下右</div>
			<div style="flex: 2;">下左</div>
		</div>
		<div class="table-oralc">
			<div class="table-body">
				<div class="table-t-l">
					<div class="cell" v-for="(item,index) in cavityData.bProject">{{item}}</div>
				</div>
				<div class="table-t-c">
					<div class="cell-body">
						<div class="cell" :class="[key.checked == key.label ? 'bodyBg' : '']"  v-for="(key,index) in cavityData.oralB.BR['需拔除']" :key="index" @click="selects(key,index,cavityData.oralB.BR,'需拔除')">
							{{key.value}}
						</div>
					</div>
					
					<div class="cell-body">
						<div class="cell" :class="[key.checked == key.label ? 'bodyBg' : '']"  v-for="(key,index) in cavityData.oralB.BR['龋齿需治疗']" :key="index" @click="selects(key,index,cavityData.oralB.BR,'龋齿需治疗')">
							{{key.value}}
						</div>
					</div>
					<div class="cell-body">
						<div class="cell" :class="[key.checked == key.label ? 'bodyBg' : '']"  v-for="(key,index) in cavityData.oralB.BR['需窝沟封闭']" :key="index" @click="selects(key,index,cavityData.oralB.BR,'需窝沟封闭')">
							{{key.value}}
						</div>
					</div>
					<div class="cell-body">
						<div class="cell" :class="[key.value != '' && key.checked == key.value ? 'ybg' : '']" v-for="(key,index) in cavityData.oralB.BR['恒牙']" :key="index" @click="selects(key,index,cavityData.oralB.BR,'恒牙')">
							{{key.value}}
						</div>
					</div>
					<div class="cell-body">
						<div class="cell" :class="[key.value != '' && key.checked == key.value ? 'ybg' : '']"  v-for="(key,index) in cavityData.oralB.BR['乳牙']" :key="index" @click="selects(key,index,cavityData.oralB.BR,'乳牙')">
							{{key.value}}
						</div>
					</div>
				</div>
				<div class="table-t-r">
					<div class="cell-body">
						<div class="cell" :class="[key.checked == key.label ? 'bodyBg' : '']" v-for="(key,index) in cavityData.oralB.BL['需拔除']" :key="index" @click="selects(key,index,cavityData.oralB.BL,'需拔除')">
							{{key.value}}
						</div>
					</div>
					
					<div class="cell-body">
						<div class="cell" :class="[key.checked == key.label ? 'bodyBg' : '']" v-for="(key,index) in cavityData.oralB.BL['龋齿需治疗']" :key="index" @click="selects(key,index,cavityData.oralB.BL,'龋齿需治疗')">
							{{key.value}}
						</div>
					</div>
					<div class="cell-body">
						<div class="cell" :class="[key.checked == key.label ? 'bodyBg' : '']" v-for="(key,index) in cavityData.oralB.BL['需窝沟封闭']" :key="index" @click="selects(key,index,cavityData.oralB.BL,'需窝沟封闭')">
							{{key.value}}
						</div>
					</div>
					<div class="cell-body">
						<div class="cell"  :class="[key.value != '' && key.checked == key.value ? 'ybg' : '']"  v-for="(key,index) in cavityData.oralB.BL['恒牙']" :key="index" @click="selects(key,index,cavityData.oralB.BL,'恒牙')">
							{{key.value}}
						</div>
					</div>
					<div class="cell-body">
						<div class="cell"  :class="[key.value != '' && key.checked == key.value ? 'ybg' : '']"  v-for="(key,index) in cavityData.oralB.BL['乳牙']" :key="index" @click="selects(key,index,cavityData.oralB.BL,'乳牙')">
							{{key.value}}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
</template>

<script>
	import _ from 'lodash';
	export default {
		name: 'oral-cavity',
		props: {
			value: {
			  type: Object,
			  default: () => {
				  return {}
			  }
			},
			disabled: {
			  type: Boolean,
			  default: false
			}
			
		},
		data() {
			return {
				cavityData: {
					tProject: ['乳牙', '恒牙', '需窝沟封闭', '龋齿需治疗', '需拔除'],
					bProject: ['需拔除', '龋齿需治疗', '需窝沟封闭', '恒牙', '乳牙'],
					oralT: {
						TR: {
							'乳牙': [{
								label: '上右乳牙',
								value: '',
								checked: '',
							}, {
								label: '上右乳牙',
								value: '',
								checked: '',
							}, {
								label: '上右乳牙',
								value: '',
								checked: '',
							}, {
								label: '上右乳牙',
								value: '55',
								checked: '',
							}, {
								label: '上右乳牙',
								value: '54',
								checked: '',
							}, {
								label: '上右乳牙',
								value: '53',
								checked: '',
							}, {
								label: '上右乳牙',
								value: '52',
								checked: '',
							}, {
								label: '上右乳牙',
								value: '51',
								checked: '',
							}, ],
							'恒牙': [{
								label: '上右恒牙',
								value: '18',
								checked: '',
							}, {
								label: '上右恒牙',
								value: '17',
								checked: '',
							}, {
								label: '上右恒牙',
								value: '16',
								checked: '',
							}, {
								label: '上右恒牙',
								value: '15',
								checked: '',
							}, {
								label: '上右恒牙',
								value: '14',
								checked: '',
							}, {
								label: '上右恒牙',
								value: '13',
								checked: '',
							}, {
								label: '上右恒牙',
								value: '12',
								checked: '',
							}, {
								label: '上右恒牙',
								value: '11',
								checked: '',
							}, ],
							'需窝沟封闭': [{
								label: '上右需窝沟封闭',
								checked: '',
							}, {
								label: '上右需窝沟封闭',
								checked: '',
							}, {
								label: '上右需窝沟封闭',
								checked: '',
							}, {
								label: '上右需窝沟封闭',
								checked: '',
							}, {
								label: '上右需窝沟封闭',
								checked: '',
							}, {
								label: '上右需窝沟封闭',
								checked: '',
							}, {
								label: '上右需窝沟封闭',
								checked: '',
							}, {
								label: '上右需窝沟封闭',
								checked: '',
							}, ],
							'龋齿需治疗': [{
								label: '上右龋齿需治疗',
								checked: '',
							}, {
								label: '上右龋齿需治疗',
								checked: '',
							}, {
								label: '上右龋齿需治疗',
								checked: '',
							}, {
								label: '上右龋齿需治疗',
								checked: '',
							}, {
								label: '上右龋齿需治疗',
								checked: '',
							}, {
								label: '上右龋齿需治疗',
								checked: '',
							}, {
								label: '上右龋齿需治疗',
								checked: '',
							}, {
								label: '上右龋齿需治疗',
								checked: '',
							}, ],
							'需拔除': [{
								label: '上右需拔除',
								checked: '',
							}, {
								label: '上右需拔除',
								checked: '',
							}, {
								label: '上右需拔除',
								checked: '',
							}, {
								label: '上右需拔除',
								checked: '',
							}, {
								label: '上右需拔除',
								checked: '',
							}, {
								label: '上右需拔除',
								checked: '',
							}, {
								label: '上右需拔除',
								checked: '',
							}, {
								label: '上右需拔除',
								checked: '',
							}, ]
						},
						TL: {
							'乳牙': [{
								label: '上左乳牙',
								value: '61',
								checked: '',
							}, {
								label: '上左乳牙',
								value: '62',
								checked: '',
							}, {
								label: '上左乳牙',
								value: '63',
								checked: '',
							}, {
								label: '上左乳牙',
								value: '64',
								checked: '',
							}, {
								label: '上左乳牙',
								value: '65',
								checked: '',
							}, {
								label: '上左乳牙',
								value: '',
								checked: '',
							}, {
								label: '上左乳牙',
								value: '',
								checked: '',
							}, {
								label: '上左乳牙',
								value: '',
								checked: '',
							}, ],
							'恒牙': [{
								label: '上左恒牙',
								value: '21',
								checked: '',
							}, {
								label: '上左恒牙',
								value: '22',
								checked: '',
							}, {
								label: '上左恒牙',
								value: '23',
								checked: '',
							}, {
								label: '上左恒牙',
								value: '24',
								checked: '',
							}, {
								label: '上左恒牙',
								value: '25',
								checked: '',
							}, {
								label: '上左恒牙',
								value: '26',
								checked: '',
							}, {
								label: '上左恒牙',
								value: '27',
								checked: '',
							}, {
								label: '上左恒牙',
								value: '28',
								checked: '',
							}, ],
							'需窝沟封闭': [{
								label: '上左需窝沟封闭',
								checked: '',
							}, {
								label: '上左需窝沟封闭',
								checked: '',
							}, {
								label: '上左需窝沟封闭',
								checked: '',
							}, {
								label: '上左需窝沟封闭',
								checked: '',
							}, {
								label: '上左需窝沟封闭',
								checked: '',
							}, {
								label: '上左需窝沟封闭',
								checked: '',
							}, {
								label: '上左需窝沟封闭',
								checked: '',
							}, {
								label: '上左需窝沟封闭',
								checked: '',
							}, ],
							'龋齿需治疗': [{
								label: '上左龋齿需治疗',
								checked: '',
							}, {
								label: '上左龋齿需治疗',
								checked: '',
							}, {
								label: '上左龋齿需治疗',
								checked: '',
							}, {
								label: '上左龋齿需治疗',
								checked: '',
							}, {
								label: '上右龋齿需治疗',
								checked: '',
							}, {
								label: '上左龋齿需治疗',
								checked: '',
							}, {
								label: '上左龋齿需治疗',
								checked: '',
							}, {
								label: '上左龋齿需治疗',
								checked: '',
							}, ],
							'需拔除': [{
								label: '上左需拔除',
								checked: '',
							}, {
								label: '上左需拔除',
								checked: '',
							}, {
								label: '上左需拔除',
								checked: '',
							}, {
								label: '上左需拔除',
								checked: '',
							}, {
								label: '上左需拔除',
								checked: '',
							}, {
								label: '上左需拔除',
								checked: '',
							}, {
								label: '上左需拔除',
								checked: '',
							}, {
								label: '上左需拔除',
								checked: '',
							}, ]
						}
					},
					oralB: {
						BR: {
							'乳牙': [{
								label: '下右乳牙',
								value: '',
								checked: '',
							}, {
								label: '下右乳牙',
								value: '',
								checked: '',
							}, {
								label: '下右乳牙',
								value: '',
								checked: '',
							}, {
								label: '下右乳牙',
								value: '85',
								checked: '',
							}, {
								label: '下右乳牙',
								value: '84',
								checked: '',
							}, {
								label: '下右乳牙',
								value: '83',
								checked: '',
							}, {
								label: '下右乳牙',
								value: '82',
								checked: '',
							}, {
								label: '下右乳牙',
								value: '81',
								checked: '',
							}, ],
							'恒牙': [{
								label: '下右恒牙',
								value: '48',
								checked: '',
							}, {
								label: '下右恒牙',
								value: '47',
								checked: '',
							}, {
								label: '下右恒牙',
								value: '46',
								checked: '',
							}, {
								label: '下右恒牙',
								value: '45',
								checked: '',
							}, {
								label: '下右恒牙',
								value: '44',
								checked: '',
							}, {
								label: '下右恒牙',
								value: '43',
								checked: '',
							}, {
								label: '下右恒牙',
								value: '42',
								checked: '',
							}, {
								label: '下右恒牙',
								value: '41',
								checked: '',
							}, ],
							'需窝沟封闭': [{
								label: '下右需窝沟封闭',
								checked: '',
							}, {
								label: '下右需窝沟封闭',
								checked: '',
							}, {
								label: '下右需窝沟封闭',
								checked: '',
							}, {
								label: '下右需窝沟封闭',
								checked: '',
							}, {
								label: '下右需窝沟封闭',
								checked: '',
							}, {
								label: '下右需窝沟封闭',
								checked: '',
							}, {
								label: '下右需窝沟封闭',
								checked: '',
							}, {
								label: '下右需窝沟封闭',
								checked: '',
							}, ],
							'龋齿需治疗': [{
								label: '下右龋齿需治疗',
								checked: '',
							}, {
								label: '下右龋齿需治疗',
								checked: '',
							}, {
								label: '下右龋齿需治疗',
								checked: '',
							}, {
								label: '下右龋齿需治疗',
								checked: '',
							}, {
								label: '下右龋齿需治疗',
								checked: '',
							}, {
								label: '下右龋齿需治疗',
								checked: '',
							}, {
								label: '下右龋齿需治疗',
								checked: '',
							}, {
								label: '下右龋齿需治疗',
								checked: '',
							}, ],
							'需拔除': [{
								label: '下右需拔除',
								checked: '',
							}, {
								label: '下右需拔除',
								checked: '',
							}, {
								label: '下右需拔除',
								checked: '',
							}, {
								label: '下右需拔除',
								checked: '',
							}, {
								label: '下右需拔除',
								checked: '',
							}, {
								label: '下右需拔除',
								checked: '',
							}, {
								label: '下右需拔除',
								checked: '',
							}, {
								label: '下右需拔除',
								checked: '',
							}, ],
						},
						BL: {
							'乳牙': [{
								label: '下左乳牙',
								value: '71',
								checked: '',
							}, {
								label: '下左乳牙',
								value: '72',
								checked: '',
							}, {
								label: '下左乳牙',
								value: '73',
								checked: '',
							}, {
								label: '下左乳牙',
								value: '74',
								checked: '',
							}, {
								label: '下左乳牙',
								value: '75',
								checked: '',
							}, {
								label: '下左乳牙',
								value: '',
								checked: '',
							}, {
								label: '下左乳牙',
								value: '',
								checked: '',
							}, {
								label: '下左乳牙',
								value: '',
								checked: '',
							}, ],
							'恒牙': [{
								label: '下左恒牙',
								value: '31',
								checked: '',
							}, {
								label: '下左恒牙',
								value: '32',
								checked: '',
							}, {
								label: '下左恒牙',
								value: '33',
								checked: '',
							}, {
								label: '下左恒牙',
								value: '34',
								checked: '',
							}, {
								label: '下左恒牙',
								value: '35',
								checked: '',
							}, {
								label: '下左恒牙',
								value: '36',
								checked: '',
							}, {
								label: '下左恒牙',
								value: '37',
								checked: '',
							}, {
								label: '下左恒牙',
								value: '38',
								checked: '',
							}, ],
							'需窝沟封闭': [{
								label: '下左需窝沟封闭',
								checked: '',
							}, {
								label: '下左需窝沟封闭',
								checked: '',
							}, {
								label: '下左需窝沟封闭',
								checked: '',
							}, {
								label: '下左需窝沟封闭',
								checked: '',
							}, {
								label: '下左需窝沟封闭',
								checked: '',
							}, {
								label: '下左需窝沟封闭',
								checked: '',
							}, {
								label: '下左需窝沟封闭',
								checked: '',
							}, {
								label: '下左需窝沟封闭',
								checked: '',
							}, ],
							'龋齿需治疗': [{
								label: '下左龋齿需治疗',
								checked: '',
							}, {
								label: '下左龋齿需治疗',
								checked: '',
							}, {
								label: '下左龋齿需治疗',
								checked: '',
							}, {
								label: '下左龋齿需治疗',
								checked: '',
							}, {
								label: '下左龋齿需治疗',
								checked: '',
							}, {
								label: '下左龋齿需治疗',
								checked: '',
							}, {
								label: '下左龋齿需治疗',
								checked: '',
							}, {
								label: '下左龋齿需治疗',
								checked: '',
							}, ],
							'需拔除': [{
								label: '下左需拔除',
								checked: '',
							}, {
								label: '下左需拔除',
								checked: '',
							}, {
								label: '下左需拔除',
								checked: '',
							}, {
								label: '下左需拔除',
								checked: '',
							}, {
								label: '下左需拔除',
								checked: '',
							}, {
								label: '下左需拔除',
								checked: '',
							}, {
								label: '下左需拔除',
								checked: '',
							}, {
								label: '下左需拔除',
								checked: '',
							}]

						}
					}
				},
				retData:{},
				models:this.value
			}
		},
		watch:{
			models:{
				handler(val){
					this.$emit('input',val);
				},
				deep:true,
			},
			value:{
				deep:true,
				handler(val){
					this.models = val;
				}
			}
		},
		created() {
			let retDataKeys = Object.keys(this.models);
			if(retDataKeys.length){
				for(let i = 0, l = retDataKeys.length; i < l; i++){
					let key = retDataKeys[i];
					this.retKey(key)
				}
			}
		},
		methods: {
			retKey(key){
				let oralT_TL = this.cavityData.oralT.TL; //上左
				let oralT_TR = this.cavityData.oralT.TR;//上右
				let oralB_BL = this.cavityData.oralB.BL;//下左
				let oralB_BR = this.cavityData.oralB.BR;//下右
				// 上左
				this.setVal(oralT_TL['乳牙'],key,['oralT','TL'],'乳牙');
				this.setVal(oralT_TL['恒牙'],key,['oralT','TL'],'恒牙');
				
				//上右
				this.setVal(oralT_TR['乳牙'],key,['oralT','TR'],'乳牙');
				this.setVal(oralT_TR['恒牙'],key,['oralT','TR'],'恒牙');
				
				
				//下左
				this.setVal(oralB_BL['乳牙'],key,['oralB','BL'],'乳牙');
				this.setVal(oralB_BL['恒牙'],key,['oralB','BL'],'恒牙');
				//下右
				this.setVal(oralB_BR['乳牙'],key,['oralB','BR'],'乳牙');
				this.setVal(oralB_BR['恒牙'],key,['oralB','BR'],'恒牙');
			},
			setVal(arr,key,keys,label){
				
				let tProject = this.cavityData.tProject;//上牙齿项目
				let bProject = this.cavityData.bProject;//下牙齿项目
				for(let i = 0, l = arr.length; i < l; i++ ){
					if(label == '乳牙' || label == '恒牙'){
						if(arr[i].value.includes(key)){
							arr[i].checked = arr[i].value;
							this.setProject(this.cavityData[keys[0]][keys[1]]['需窝沟封闭'],i,key)
							this.setProject(this.cavityData[keys[0]][keys[1]]['龋齿需治疗'],i,key)
							this.setProject(this.cavityData[keys[0]][keys[1]]['需拔除'],i,key)
						}
					}
					
				}
			},
			//设置乳牙和恒牙对应的项目
			setProject(arr,index,key){
				let reqData = this.models[key];//返回的填写数据
				if(reqData.length){
					for(let j = 0; j < reqData.length; j++){
						console.log(arr[index].label == reqData[j])
						if(arr[index].label == reqData[j]){
							arr[index].checked = reqData[j]
						}
					}
				}
			},
			selects(curRow,index,data,label){
				console.log(curRow,index,data,label)
				if(label == '乳牙' || label == '恒牙'){
					if(curRow.value != ''){
						if(label == '乳牙'){
							if(data['恒牙'][index].checked != ''){
								alert('一个牙位不能同时选乳牙和恒牙')
								return;
							};
						}
						if(label == '恒牙'){
							if(data['乳牙'][index].checked != ''){
								alert('一个牙位不能同时选乳牙和恒牙')
								return;
							};
							
						}
						if(curRow.checked == curRow.value){
							curRow.checked = '';
							this.removeProject(data,index)
							delete this.retData[curRow.value]
						}else{
							curRow.checked = curRow.value;
							this.retData[curRow.value] = []
						}
					}
					
				}else{
					if(data['乳牙'][index].checked == '' && data['恒牙'][index].checked == ''){
						alert('请先选择乳牙或者恒牙');
						return;
					}
					if(data['乳牙'][index].checked != ''){
						this.retData[data['乳牙'][index].value].push(data[label][index].label);
						let Arr = this.retData[data['乳牙'][index].value];
						this.retData[data['乳牙'][index].value] = _.uniq(Arr);
						if(data[label][index].checked == data[label][index].label){
							data[label][index].checked = ''
							this.retData[data['乳牙'][index].value] = _.pull(Arr,data[label][index].label)
						}else{
							data[label][index].checked = data[label][index].label;
						}
						
					}
					if(data['恒牙'][index].checked != ''){
						this.retData[data['恒牙'][index].value].push(data[label][index].label);
						let Arr = this.retData[data['恒牙'][index].value];
						this.retData[data['恒牙'][index].value] = _.uniq(Arr);
						if(data[label][index].checked == data[label][index].label){
							data[label][index].checked = ''
							this.retData[data['恒牙'][index].value] = _.pull(Arr,data[label][index].label)
						}else{
							data[label][index].checked = data[label][index].label;
						}
						
					}
					
				}
				this.models = this.retData;
				
			},
			//移除乳牙或恒牙对应的勾选项目
			removeProject(arr,index){
				if(arr.length == 0) return;
				arr['需窝沟封闭'][index].checked = '';
				arr['龋齿需治疗'][index].checked = '';
				arr['需拔除'][index].checked = '';
			}
		}
	}
</script>

<style scoped>
	.is-disabled {
	  background-color: #f5f7fa;
	}
	.is-disabled::after {
	  display: block;
	  content: "";
	  position: absolute;
	  top: 0;
	  right: 0;
	  left: 0;
	  bottom: 0;
	  cursor: no-drop;
	}
	.table-oralc {
		display: flex;
		border: 1px solid #ccc;
		flex-direction: column;
	}

	.table-body {
		display: flex;
	}
	.cell-body{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.cell{
		flex: 1;
		height: 34px;
		padding: 0 10px;
		/*定义项目的放大比例，如果值为1，则所有的项目将等分剩余的空间*/
		/*因为当前是水平方向布局，所以等分的是剩余的width*/
		flex-grow: 1;
		display: flex;
		/*水平居中、垂直居中*/
		justify-content: center;
		align-items: center;
		/*换行*/
		word-break: break-all;
		word-wrap: break-word;
		white-space: normal;
		border: 1px solid #ccc;
	}
	.table-t-l{
		flex: 1;
	}
	.table-t-c,.table-t-r{
		flex: 2;
	}
	.table-t-l .cell,.cell-body .cell{
		border-top: none ;
		border-left: none;
	}
	.table-t-l .cell:last-child{
		border-bottom: none ;
	}
	
	.table-t-r .cell-body .cell:last-child{
		 border-right: none;
	}
	.table-t-c .cell-body:last-child .cell,.table-t-r .cell-body:last-child .cell{
		border-bottom: none ;
	}
	.table-t-c {
		border-right: 1px solid #ccc !important;
	}
	.ybg{
		background: #409EFF;
		color: #fff;
	}
	.bodyBg{
		position: relative;
	}
	.bodyBg::after{
		position: absolute;
		content: '√';
		color:red;
		font-weight: bold;
		font-size: 16px;
	}
</style>
