<template>
	<el-col :span="widget.options.span" class="colSpan">
		<div>
			<el-form-item v-if="widget.type != 'divider' && display[widget.model]" :prop="widget.model" :class="{
        [widget.options.customClass]: widget.options.customClass?true: false,
        'no-label-form-item': widget.options.isLabelWidth && widget.options.labelWidth == 0,

      }"
			 :label-width="widget.options.isLabelWidth ? widget.options.labelWidth + 'px' : ''" @contextmenu.prevent.native="rightClick($event,widget)">
				<!-- 'is_quesion': widget.options.question == null ? false  : !widget.options.question -->
				<div style="display:flex;margin-right: 6px;">
					<!-- 质疑 -->
					<el-popover placement="left-start" title width="600" trigger="hover">
						<el-table border :data="tableData" height="400" @row-dblclick="rowHandelClick">
							<el-table-column property="QUESTIONNAME" label="质疑人"></el-table-column>
							<el-table-column property="QUESTIONREASON" label="质疑原因"></el-table-column>
							<el-table-column property="QUESTIONTIME" label="质疑时间"></el-table-column>
						</el-table>
						<div slot="reference" v-if="widget.options.question == null ? false  : !widget.options.question">
							<i class="el-icon-question" style="font-size:16px;color:red;margin-right:6px;"></i>
						</div>
					</el-popover>
					<!-- 数据核查 -->
					<el-popover placement="top" title trigger="hover">
						<span style="font-size:16px;color:red;">{{widget.options.tipscontent}}</span>
						<div slot="reference" v-if="widget.options.tips == null ? false : !widget.options.tips">
							<i class="el-icon-info" style="font-size:16px;color:#ff8100;"></i>
						</div>
					</el-popover>
				</div>
				<span slot="label" v-if="widget.labelHidden">{{widget.name}}</span>
				<generate-element-item :blanks="blanks" :is-table="false" :widget="widget" v-model="dataModel" :models.sync="dataModels"
				 :remote="remote" @rightClickMenu="rightClickMenu" :edit="edit" :remote-option="remoteOption">
					<template v-slot:[blank.name]="scope" v-for="blank in blanks">
						<slot :name="blank.name" :model="scope.model"></slot>
					</template>
				</generate-element-item>
			</el-form-item>

			<el-divider v-if="widget.type == 'divider' && display[widget.model]" :content-position="widget.options.contentPosition">
				<span v-if="widget.options.labelHidden">{{widget.name}}</span>
			</el-divider>
		</div>
	</el-col>
</template>

<script>
	import GenerateElementItem from "./GenerateElementItem";
	import MkBtn from "./sys/btn.vue"
	export default {
		components: {
			GenerateElementItem,
			MkBtn
		},
		inject: ['generateForm'],
		props: [
			"widget",
			"models",
			"rules",
			"remote",
			"blanks",
			"display",
			"edit",
			"isrightclick",
			"remoteOption"
		],
		data() {
			return {
				dataModel: this.models[this.widget.model],
				dataModels: this.models,
				tableData: []
			};
		},
		created() {
			this.tableData = [];
			try {
				for (let i = 0; i < this.widget.options.querycontent.length; i++) {
					this.tableData.push({
						...this.widget.options.querycontent[i],
						...this.widget
					});
				}
			} catch (error) {}
		},
		methods: {
			rightClick(event, data) {
				if (data.type == "table") {
					return;
				}
				if (!this.isrightclick) {
					return;
				}
				this.$emit("rightClick", event, data);
			},
			rightClickMenu(data, key, index) {
				this.$emit("rightClickMenu", data, key, index);
			},
			rowHandelClick(row) {
				if (this.$parent.$parent.$parent.rightClickMenu) {
					this.$parent.$parent.$parent.rightClickMenu(row, 3, undefined);
				} else if (this.$parent.$parent.rightClickMenu) {
					this.$parent.$parent.rightClickMenu(row, 3, undefined);
				} else if (this.$parent.rightClickMenu) {
					this.$parent.rightClickMenu(row, 3, undefined);
				} else {
					this.rightClickMenu(row, 3, undefined);
				}
			}
		},
		watch: {
			dataModel: {
				deep: true,
				handler(val) {
					this.models[this.widget.model] = val;
					this.$emit("update:models", {
						...this.models,
						[this.widget.model]: val
					});
					this.$emit("input-change", val, this.widget.model);
				}
			},
			models: {
				deep: true,
				handler(val) {
					this.dataModel = val[this.widget.model];
					this.dataModels = val;
				}
			}
		}
	};
</script>
<style scoped>
	.el-form-item {
		cursor: help;
	}

	>>>.el-form-item__content {
		display: flex;
	}

	>>>.el-form-item__content span {
		flex: 2;
	}

	>>>.el-table__row {
		cursor: pointer !important;
	}
</style>
