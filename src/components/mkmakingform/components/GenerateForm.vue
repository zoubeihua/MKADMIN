<template>
  <div>
	  <div style="width: 100%;" v-if="data.config.headerImg"> <img :src="data.config.headerImg" style="height: auto;width: 100%;"></div>
	  <el-container>
	    <el-main style="padding-bottom: 0;">
	      <div class="generateForm">
	        <!--鼠标右键点击出现页面-->
	        <div v-show="menuVisible">
	          <el-menu id="rightClickMenu" class="el-menu-vertical" @select="handleRightSelect">
	            <el-menu-item
	              :index="itemMuen.type"
	              class="menuItem"
	              v-for="(itemMuen,index) in questionMenu"
	              :key="index"
	            >
	              <template slot="title">
	                <i :class="itemMuen.icon"></i>
	                <span>{{itemMuen.name}}</span>
	              </template>
	            </el-menu-item>
	          </el-menu>
	        </div>
	        <el-row :gutter="10">
	        <el-form
	          ref="generateForm"
	          :class="{
	        [data.config.customClass]: data.config.customClass ? true: false,
	        'no-label-form': data.config.labelWidth == 0
	      }"
	          label-suffix=":"
	          :size="data.config.size"
	          :model="models"
	          :rules="rules"
	          :label-position="data.config.labelPosition"
	          :disabled="!edit"
	          :label-width="data.config.labelWidth + 'px'"
	        >
	          <template v-for="item in data.list">
	            <generate-col-item
	              v-if="item.type == 'grid'"
	              :key="item.key"
	              :model.sync="models"
	              :rules="rules"
	              :element="item"
	              :remote="remote"
	              :blanks="blanks"
	              :display="displayFields"
	              @rightClickMenu="rightClickMenu"
	              @input-change="onInputChange"
	              :edit="edit"
	              :isrightclick="isrightclick"
	              :remote-option="remoteOption"
	            >
	              <template v-slot:[blank.name]="scope" v-for="blank in blanks">
	                <slot :name="blank.name" :model="scope.model"></slot>
	              </template>
	            </generate-col-item>
	  
	            <generate-row-matrix-item
	              v-else-if="item.type == 'rowmatrix'"
	              :key="item.key"
	              :model.sync="models"
	              :rules="rules"
	              :element="item"
	              :remote="remote"
	              :blanks="blanks"
	              :display="displayFields"
	              @rightClickMenu="rightClickMenu"
	              @input-change="onInputChange"
	              :edit="edit"
	              :isrightclick="isrightclick"
	              :remote-option="remoteOption"
	            >
	              <template v-slot:[blank.name]="scope" v-for="blank in blanks">
	                <slot :name="blank.name" :model="scope.model"></slot>
	              </template>
	            </generate-row-matrix-item>
	  
	            <generate-tab-item
	              v-else-if="item.type == 'tabs'"
	              :key="item.key"
	              :model.sync="models"
	              :rules="rules"
	              :element="item"
	              :remote="remote"
	              :blanks="blanks"
	              :display="displayFields"
	              @input-change="onInputChange"
	              @rightClickMenu="rightClickMenu"
	              :edit="edit"
	              :isrightclick="isrightclick"
	              :remote-option="remoteOption"
	            >
	              <template v-slot:[blank.name]="scope" v-for="blank in blanks">
	                <slot :name="blank.name" :model="scope.model"></slot>
	              </template>
	            </generate-tab-item>
	  
	            <generate-form-item
	              v-else
	              :key="item.key"
	              :models.sync="models"
	              :rules="rules"
	              :widget="item"
	              :remote="remote"
	              :blanks="blanks"
	              :display="displayFields"
	              @rightClick="rightClick"
	              @rightClickMenu="rightClickMenu"
	              @input-change="onInputChange"
	              :edit="edit"
	              :isrightclick="isrightclick"
	              :remote-option="remoteOption"
	            >
	              <template v-slot:[blank.name]="scope" v-for="blank in blanks">
	                <slot :name="blank.name" :model="scope.model"></slot>
	              </template>
	            </generate-form-item>
	          </template>
	        </el-form>
	        </el-row>
	      </div>
	    </el-main>
	  </el-container>
	  <div style="width: 100%;" v-if="data.config.footerImg"> <img :src="data.config.footerImg" style="height: auto;width: 100%;"></div>
  </div>
 
</template>

<script>
import GenerateFormItem from "./GenerateFormItem";
import GenerateColItem from "./GenerateColItem";
import GenerateTabItem from "./GenerateTabItem";
import GenerateRowMatrixItem from "./GenerateRowMatrixItem";
import { questionMenu } from "./questionMenu.js";
import dayjs from "dayjs";

import { loadJs } from "../util/index.js";
var dataList = [];
export default {
  name: "fm-generate-form",
  components: {
    GenerateFormItem,
    GenerateColItem,
    GenerateTabItem,
    GenerateRowMatrixItem
  },
	provide(){
		return {
			generateForm:this
		}
	},
  props: {
    data: {
      type: Object,
      default: () => ({
        TEMPLATETAG: "0", //模板标记 0 个人模板  1 系统模板
        RESEARCHID: "", //科研ID
        PROCESSID: "", //节点ID
        USERID: "", //登录人ID
        CRFID: "", //CRFID
        CRFNAME: "", //CRF名称
        TESTID: "", //受试者ID
        Header: {
          NAMEPY: "",
          ORGIDNO: "",
          PATAGE: "",
          PATSEX: "",
          RESEARCHNO: "",
          TESTID: "",
          TESTNAME: "",
          TESTNO: ""
        },
        Tail: {
          AUDITID: "",
          AUDITNAME: "",
          AUDITTIME: "",
          INPUTID: "",
          INPUTNAME: "",
          INPUTTIME: "",
          QUESTIONID: "",
          QUESTIONNAME: "",
          QUESTIONTIME: ""
        },
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
          customClass: ""
        }
      })
    },
    remote: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Object,
      default: () => ({})
    },
    edit: {
      type: Boolean,
      default: true
    },
    isrightclick: {
      type: Boolean,
      default: () => false
    },
    remoteOption: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      validatorCustom: (rule, value, callback) => {
         // console.log(rule, value, dataList);
        let field = rule.field; //当前控件字段标识
        let curVal = parseFloat(value); //当前控件值
        let curData = dataList.filter(item => {
          return item.model == field;
        });
        let Min = parseFloat(curData[0].options.min);
        let Max = parseFloat(curData[0].options.max);
		console.log('当前控件值input')
		console.log(curVal,Min,Max,curData[0].options.pattern)
        if (curData[0].options.pattern == "") {
          if (curData[0].options.required) {
            if (
              Min == 0 ||
              Min == "" ||
              (Min == undefined && Max == 0) ||
              Max == undefined ||
              Max == ""
            ) {
              callback();
            } else {
              if (curVal >= Min && curVal <= Max) {
                callback();
              } else {
                callback(
                  new Error("请输入范围值在" + Min + "~" + Max + "之间")
                );
              }
            }
          } else {
            if (curVal) {
              if (curVal >= Min && curVal <= Max) {
                callback();
              } else {
                callback(
                  new Error("请输入范围值在" + Min + "~" + Max + "之间")
                );
              }
            } else {
              callback();
            }
          }
        }else{
			if (
			  Min == 0 ||
			  Min == "" ||
			  (Min == undefined && Max == 0) ||
			  Max == undefined ||
			  Max == ""
			) {
			  callback();
			} else {
			  if (curVal >= Min && curVal <= Max) {
			    callback();
			  } else {
			    callback(
			      new Error("请输入范围值在" + Min + "~" + Max + "之间")
			    );
			  }
			}
			 // callback();
		}
      },
      validatorCheckbox: (rule, value, callback) => {
         let field = rule.field; //当前控件字段标识
        let curData = dataList.filter(item => item.model == field)[0];
        let rules = curData.rules[0];
        if (curData.options.required && curData.options.isMax) {
          if (value.value.length == 0) {
            callback(new Error(rules.message));
          }
          if (value.value.length > curData.options.max) {
            callback(new Error("最多选择" + curData.options.max + "项"));
          } else {
            callback();
          }
        } else {
          if (curData.options.required) {
            if (value.value.length == 0) {
              callback(new Error(rules.message));
            } else {
              callback();
            }
          } else {
            callback();
          }
          if (curData.options.isMax) {
            if (value.value.length > curData.options.max) {
              callback(new Error("最多选择" + curData.options.max + "项"));
            } else {
              callback();
            }
          } else {
            callback();
          }
        }
      },
      validatorRadio: (rule, value, callback) => {
        let field = rule.field; //当前控件字段标识
        let curData = dataList.filter(item => item.model == field)[0];
        let rules = curData.rules[0];
        console.log(curData, value);
        if (curData.options.required) {
          if (value.value == "") {
            callback(new Error(rules.message));
          } else {
            callback();
          }
        }else{
          callback();
        }
      },
      validatorSelect: (rule, value, callback) => {
        let field = rule.field; //当前控件字段标识
        let curData = dataList.filter(item => item.model == field)[0];
        let rules = curData.rules[0];
        console.log(curData, value);
        if (curData.options.required) {
          if (value.value == "") {
            callback(new Error(rules.message));
          } else {
            callback();
          }
        }else{
          callback();
        }
      },
      validatorUnits: (rule, value, callback) => {
        let field = rule.field; //当前控件字段标识
        let curData = dataList.filter(item => item.model == field)[0];
        let rules = curData.rules[0];
        console.log(curData.options.required);
        if (curData.options.required) {
          if (value.value == "") {
            callback(new Error(rules.message));
          } else if (value.unit == "") {
            callback(new Error("请选择单位"));
          } else {
            callback();
          }
        }else{
          callback();
        }
      },
      questionMenu,
      models: {},
      rules: {},
      blanks: [],
      variddata: {
        varidList: [],
        varidJson: {}
      }, //常量数据
      displayFields: {},
      disabledFiedls: {}, //禁用字段
      hideFields: {}, //隐藏的控件字段
      retaCount: 0, //评分统计
      record: {}, //记录每个评分控件的总评分
      toggleState: {}, //记录显示隐藏状态
      control: null, //控件类型
      menuVisible: false, //右键菜单显示状态
      ControlList: [], //扁平化所有控件
      dataBindFields: [],
      generateShow: false
    };
  },
  created() {
    dataList = [];
    //初始化常量数据
    this.variddata = {
      varidList: [],
      varidJson: {}
    };
    this.ControlList = [];

    if (Object.keys(this.data).length) {
      this.generateModel(this.data.list);
    } else {
      this.generateModel([]);
    }

    // console.log("this.ControlList");
    // console.log(this.ControlList);
    // console.log("this.value");
    // console.log(this.value);
    // this.InitFormData();
    // this.initSome();
  },
  mounted() {
    this.$nextTick(() => {
      this.InitFormData();
    });
  },
  methods: {
    //表单中获取系统常量的值
    SysVarValue_Get() {
      this.variddata = {
        varidList: [],
        varidJson: {}
      };
      if (Object.keys(this.data).length) {
        this.generateModel(this.data.list);
      } else {
        this.generateModel([]);
      }
      return new Promise((resolve, reject) => {
        if (this.data.PROCESSID && this.data.TESTID) {
          if (this.variddata.varidList.length > 0) {
            let sendData = {
              RESEARCHID: this.data.RESEARCHID,
              PROCESSID: this.data.PROCESSID,
              CRFID: this.data.CRFID,
              TESTID: this.data.TESTID,
              VARID: this.variddata.varidList
            };

            this.MK.Request("sys_variables", "post", sendData, {
              app: "63b1657f3b0747d993d1b8a1a8fed742",
              mod: "xtcl"
            }).then(res => {
              console.log("SysVarValue_Get");
              console.log(this.variddata);
              let data = res.data;
              if (res.code == 0) {
                let model = {};
                if (data.length > 0) {
                  data.forEach(key => {
                    for (let keys in this.variddata.varidJson) {
                      let opt = {};
                      let obj = {};
                      if (key.VARID == this.variddata.varidJson[keys].varid) {
                        let varid = this.variddata.varidJson[keys].varid;

                        if (this.variddata.varidJson[keys].type == "radio") {
                          obj.value = key.FIELDVALUE;
                          obj.score = 0;
                          obj.remark = "";
                          opt[keys] = obj;
                          model[keys] = obj;
                        } else {
                          opt[keys] = key.FIELDVALUE;
                          model[keys] = key.FIELDVALUE;
                        }
                      }
                    }
                  });
                  resolve({ res: res.code, data: model });
                }
              }
            });
          } else {
            reject("没有常量信息");
          }
        }
      });
    },
    //遍历控件
    someControl(lists) {
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].type === "grid") {
          lists[i].columnns.forEach(item => {
            this.someControl(item.list);
          });
        } else if (lists[i].type === "rowmatrix") {
          lists[i].columnns.forEach(item => {
            this.someControl(item.list);
          });
        } else if (lists[i].type === "tabs") {
          lists[i].tabs.forEach(item => {
            this.someControl(item.list);
          });
        } else {
          if (lists[i].type === "table") {
            lists[i].tableColumns.forEach(item => {
              this.ControlList.push(item);
            });
          } else {
            this.ControlList.push(lists[i]);
          }
        }
      }
    },
    initSome() {
      this.ControlList = [];
      if (Object.keys(this.data).length) {
        this.someControl(this.data.list);
      } else {
        this.someControl([]);
      }
      console.log("this.ControlList");
      console.log(this.ControlList);
    },
    //左键菜单点击事件
    handleRightSelect(key) {
      this.$emit("rightClickMenu", this.rightClickData, key);
    },
    rightClickMenu(data, key, index) {
      this.$emit("rightClickMenu", data, key, index);
    },
    rightClick(event, data) {
      if (!this.isrightclick) {
        return;
      }
      this.rightClickData = data;
      if (this.menuId !== data.model) {
        this.menuId = data.model;
        this.menuVisible = true;
      } else {
        this.menuVisible = !this.menuVisible;
      }
      document.addEventListener("click", e => {
        this.menuVisible = false;
      });
      let menu = document.querySelector("#rightClickMenu");
      /* 菜单定位基于鼠标点击位置 */
      menu.style.left = event.clientX + 20 + "px";
      menu.style.top = event.clientY - 30 + "px";
      menu.style.position = "fixed"; // 为新创建的DIV指定绝对定位
      menu.style.width = 160 + "px";
      menu.style.zIndex = "999999";
    },
    generateModel(genList) {
    	for (let i = 0; i < genList.length; i++) {
    		if (genList[i].type === "grid" || genList[i].type === "rowmatrix") {
    			this.ControlList.push(genList[i]);
    			this.displayFields[genList[i].model] = !genList[i].options.hidden;
    			this.disabledFiedls[genList[i].model] = !genList[i].options.disabled;
    			this.hideFields[genList[i].model] = genList[i].type;
    			genList[i].columns.forEach(item => {
    				this.generateModel(item.list);
    			});
    		} else if (genList[i].type === "tabs") {
    			this.ControlList.push(genList[i]);
    			genList[i].tabs.forEach(item => {
    				this.generateModel(item.list);
    			});
    			this.displayFields[genList[i].model] = !genList[i].options.hidden;
    			this.disabledFiedls[genList[i].model] = !genList[i].options.disabled;
    			this.hideFields[genList[i].model] = genList[i].type;
    		} else {
    			this.ControlList.push(genList[i]);
    			//存储特殊表单验证数据
    			if (
    				genList[i].type == "input" ||
					genList[i].type == "age" ||
    				genList[i].type == "checkbox" ||
    				genList[i].type == "radio" ||
    				genList[i].type == "select" ||
    				genList[i].type == "units"
    			) {
    				dataList.push(genList[i]);
    			}
    			//常量数据处理
    			if (genList[i].options.varid) {
    				if (genList[i].options.varid != "") {
    					this.variddata.varidList.push(genList[i].options.varid);
    					let opt = {
    						varid: genList[i].options.varid,
    						type: genList[i].type
    					};
    					// this.variddata.varidJson[genList[i].model] = genList[i].options.varid;
    					this.variddata.varidJson[genList[i].model] = opt;
    				}
    			}
    
    			if (Object.keys(this.value).indexOf(genList[i].model) >= 0) {
    				// 处理老版本没有dataBind值的情况，默认绑定数据
    				// if (
    				// 	Object.keys(genList[i].options).indexOf("dataBind") < 0 ||
    				// 	genList[i].options.dataBind
    				// ) {
    				// 	this.models[genList[i].model] = this.value[genList[i].model];
    				// 	this.dataBindFields.push(genList[i].model);
    				// }
    				this.models[genList[i].model] = this.value[genList[i].model];
    				this.dataBindFields.push(genList[i].model);
    				this.displayFields[genList[i].model] = !genList[i].options.hidden;
    				if (genList[i].options.disabled && genList[i].options.varid == "") {
    					this.disabledFiedls[genList[i].model] = !genList[i].options
    						.disabled;
    				} else {
    					this.disabledFiedls[genList[i].model] = true;
    				}
    				// this.disabledFiedls[genList[i].model] = !genList[i].options.disabled;
    				this.hideFields[genList[i].model] = genList[i].type;
    				if (genList[i].type === "blank") {
    					this.blanks.push({
    						name: genList[i].model
    					});
    				}
    			} else {
    				if (genList[i].type === "blank") {
    					// bound the default value
    					// if (
    					// 	Object.keys(genList[i].options).indexOf("dataBind") < 0 ||
    					// 	genList[i].options.dataBind
    					// ) {
    					// 	this.models[genList[i].model] =
    					// 		genList[i].options.defaultType === "String" ?
    					// 		"" :
    					// 		genList[i].options.defaultType === "Object" ?
    					// 		{} :
    					// 		[];
    					// 	this.dataBindFields.push(genList[i].model);
    					// }
    					this.models[genList[i].model] =
    						genList[i].options.defaultType === "String" ?
    						"" :
    						genList[i].options.defaultType === "Object" ?
    						{} :
    						[];
    					this.dataBindFields.push(genList[i].model);
    					this.displayFields[genList[i].model] = !genList[i].options.hidden;
    					if (
    						genList[i].options.disabled &&
    						genList[i].options.varid == ""
    					) {
    						this.disabledFiedls[genList[i].model] = !genList[i].options
    							.disabled;
    					} else {
    						this.disabledFiedls[genList[i].model] = true;
    					}
    					// this.disabledFiedls[genList[i].model] = !genList[i].options.disabled;
    					this.hideFields[genList[i].model] = genList[i].type;
    					this.blanks.push({
    						name: genList[i].model
    					});
    				} else {
    					// if (
    					// 	Object.keys(genList[i].options).indexOf("dataBind") < 0 ||
    					// 	genList[i].options.dataBind
    					// ) {
    					// 	this.models[genList[i].model] =
    					// 		genList[i].type == "table" ?
    					// 		[] :
    					// 		genList[i].options.defaultValue;
    					// 	this.dataBindFields.push(genList[i].model);
    					// }
    				
    					this.models[genList[i].model] =
    						genList[i].type == "table" ?
    						[] :
    						genList[i].options.defaultValue;
    					this.dataBindFields.push(genList[i].model);
    					this.displayFields[genList[i].model] = !genList[i].options.hidden;
    					if (
    						genList[i].options.disabled &&
    						genList[i].options.varid == ""
    					) {
    						this.disabledFiedls[genList[i].model] = !genList[i].options
    							.disabled;
    					} else {
    						this.disabledFiedls[genList[i].model] = true;
    					}
    
    					this.hideFields[genList[i].model] = genList[i].type;
    				}
    			}
    
    			genList[i].tableColumns &&
    				genList[i].tableColumns.length &&
    				genList[i].tableColumns.forEach(item => {
    					if (item.type === "blank") {
    						this.blanks.push({
    							name: item.model
    						});
    					}
    				});
    
    			if (this.rules[genList[i].model]) {
    				if (genList[i].options.pattern && genList[i].type == "input" || genList[i].type == "age") {
    					this.rules[genList[i].model] = [
    						...this.rules[genList[i].model],
    						...genList[i].rules.map(item => {
    							if (item.pattern) {
    								return { ...item,
    									pattern: eval(item.pattern)
    								};
    							} else {
    								return { ...item
    								};
    							}
    						}),
    						genList[i].options.pattern && genList[i].type == "input" || genList[i].type == "age" ?
    						{
    							validator: this.validatorCustom,
    							trigger: "change"
    						} :
    						""
    					];
    				} else if (genList[i].type == "checkbox") {
    					this.rules[genList[i].model] = [{
    						validator: this.validatorCheckbox,
    						trigger: "change"
    					}];
    				} else if (genList[i].type == "radio") {
    					this.rules[genList[i].model] = [
    						...genList[i].rules.map(item => {
    							return {
    								...item,
    								validator: this.validatorRadio,
    								trigger: "change"
    							};
    						})
    					];
    				} else if (genList[i].type == "select") {
    					this.rules[genList[i].model] = [
    						...genList[i].rules.map(item => {
    							return {
    								...item,
    								validator: this.validatorSelect,
    								trigger: "change"
    							};
    						})
    					];
    				} else if (genList[i].type == "units") {
    					this.rules[genList[i].model] = [{
    						validator: this.validatorUnits,
    						trigger: "blur"
    					}];
    				} else {
    					this.rules[genList[i].model] = [
    						...this.rules[genList[i].model],
    						...genList[i].rules.map(item => {
    							if (item.pattern) {
    								return { ...item,
    									pattern: eval(item.pattern)
    								};
    							} else {
    								return { ...item
    								};
    							}
    						})
    					];
    				}
    			} else {
    				if (genList[i].options.pattern && genList[i].type == "input" || genList[i].type == "age") {
    					this.rules[genList[i].model] = [
    						...genList[i].rules.map(item => {
    							if (item.pattern) {
    								return { ...item,
    									pattern: eval(item.pattern)
    								};
    							} else {
    								return { ...item
    								};
    							}
    						}),
    						genList[i].options.pattern && genList[i].type == "input" || genList[i].type == "age" ?
    						{
    							validator: this.validatorCustom,
    							trigger: "change"
    						} :
    						""
    					];
    				} else if (genList[i].type == "checkbox") {
    					this.rules[genList[i].model] = [{
    						validator: this.validatorCheckbox,
    						trigger: "change"
    					}];
    				} else if (genList[i].type == "radio") {
    					this.rules[genList[i].model] = [
    						...genList[i].rules.map(item => {
    							return {
    								...item,
    								validator: this.validatorRadio,
    								trigger: "change"
    							};
    						})
    					];
    				} else if (genList[i].type == "select") {
    					this.rules[genList[i].model] = [
    						...genList[i].rules.map(item => {
    							return {
    								...item,
    								validator: this.validatorSelect,
    								trigger: "change"
    							};
    						})
    					];
    				} else if (genList[i].type == "units") {
    					this.rules[genList[i].model] = [{
    						validator: this.validatorUnits,
    						trigger: "blur"
    					}];
    				} else {
    					this.rules[genList[i].model] = [
    						...genList[i].rules.map(item => {
    							if (item.pattern) {
    								return { ...item,
    									pattern: eval(item.pattern)
    								};
    							} else {
    								return { ...item
    								};
    							}
    						})
    					];
    				}
    			}
    		}
    	}
    	// console.log("this.displayFields");
    	// console.log(this.displayFields);
    	// console.log(this.rules);
    	// console.log(this.models);
    },
    _setDisabled(genList, fields, disabled) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === "grid" || genList[i].type === "rowmatrix") {
          genList[i].columns.forEach(item => {
            this._setDisabled(item.list, fields, disabled);
          });
        } else if (genList[i].type === "tabs") {
          genList[i].tabs.forEach(item => {
            this._setDisabled(item.list, fields, disabled);
          });
        } else {
          if (fields.indexOf(genList[i].model) >= 0) {
            this.$set(genList[i].options, "disabled", disabled);
          }
        }
      }
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          if (valid) {
            const resData = {};
            Object.keys(this.models).forEach(key => {
              if (
                this.hideFields[key] != "text" &&
                this.dataBindFields.indexOf(key) >= 0 &&
                this.displayFields[key] &&
                this.disabledFiedls[key]
              ) {
                resData[key] = this.models[key];
              }
            });
            let data = {
              sendData: resData,
              jsonData: this.data
            };
            resolve(JSON.parse(JSON.stringify(data)));
          } else {
            reject(new Error("表单数据校验失败").message);
          }
        });
      });
    },
    reset() {
      this.$refs.generateForm.resetFields();
    },
    // 根据字段标识获取对应的数据
    fieldVal(lists, field) {
      // console.log("lists", lists);
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].type === "grid" || lists[i].type === "rowmatrix") {
          for (let item of lists[i].columns) {
            let fieldData = this.fieldVal(item.list, field);
            if (fieldData) return fieldData;
          }
        } else if (lists[i].type === "tabs") {
          for (let item of lists[i].tabs) {
            let fieldData = this.fieldVal(item.list, field);
            if (fieldData) return fieldData;
          }
        } else {
          if (lists[i].type === "table") {
            for (let j = 0; j < lists[i].tableColumns.length; j++) {
              if (lists[i].tableColumns[j].model)
                return lists[i].tableColumns[j];
            }
          } else {
            if (lists[i].model == field) return lists[i];
          }
        }
      }
      return false;
    },
    //判断数据类型
    getDataType(o) {
      if (typeof o == "object") {
        if (typeof o.length == "number") {
          return "Array";
        } else {
          return "Object";
        }
      } else {
        return "param is txt";
      }
    },
    InitFormData() {
      for (let field in this.models) {
        let res = this.models[field];
        // let getField = this.fieldVal(this.data.list, field)
        if (this.getDataType(res) == "Array") {
        } else if (this.getDataType(this.models[field]) == "Object") {
          if (res.value != "") {
            this.setControlState(field, res.value, this.models);
          }
        } else {
          if (res != "") {
            this.setControlState(field, res, this.models);
          }
        }
      }
    },
    onInputChange(value, field) {
      console.log(field, value, this.models);
      // let fieldVal = this.fieldVal(this.data.list, field);
      // console.log("+++++++++++++");
      // console.log(fieldVal);

      this.setControlState(field, value, this.models);

      this.$emit("on-change", field, value, this.models);
      this.$emit(`on-${field}-change`, value);
    },
    //遍历计算评分
    setRateMap(lists, models) {
      let rateList = {};
      let scoreModel = {};
      for (let i = 0; i < lists.length; i++) {
        if (Object.keys(lists[i].options).indexOf("score") >= 0) {
          //检索评分控件
          for (let key in models) {
            //遍历model字段
            if (lists[i].model == key) {
              //取model里面 包含所有的评分控件
              if (models[key].value != "") {
                //并且只取value值不为空的
                rateList[key] = models[key]; //全部放入评分载体里
              }
            }
          }
        }

        if (lists[i].type == "score") {
          let opt = {};
          Object.keys(rateList).forEach(keys => {
            //把所有评分控件分别放入对应的总评分显示控件载体里
            if (lists[i].options.cognateValue.indexOf(keys) >= 0) {
              //判断评分载体里有没有包含在当前总评分控件里
              opt[keys] = rateList[keys]; //如果有就放入临时载体里
            }
          });
          //最后对号入座 组成格式为
          // let show = {
          //   总评分控件1:{
          //     评分控件:{"value":"2","score":5,"remark":""}
          //   },
          //   总评分控件2:{
          //     评分控件:{"value":"1","score":10,"remark":""}
          //   }
          // }
          scoreModel[lists[i].model] = opt;
          for (let model in scoreModel) {
            let CountS = 0;
            let optsc = {};
            for (let name in scoreModel[model]) {
              if (Object.keys(scoreModel[model][name]).length) {
                CountS += scoreModel[model][name].score;
              }
            }
            optsc[model] = CountS; //查找出评分字段
            this.setData(optsc); //设置渲染赋值总分
            console.log(model + "：" + CountS);
          }
        }
      }
    },
    //遍历设置禁用启用控件
    setDisabledMap(lists, i, field, value, models) {
      try {
        if (lists[i].options.disabledition.length > 0) {
          //判断每个控件的条件字段是否为值
          for (let item of lists[i].options.disabledition) {
            //
            let isItemShow = true;
            if (item.result.length > 0) {
              //判断条件字段里面的
              for (let key of item.result) {
                if (key.interview_id == field) {
                  if (item.condition == "and") {
                    for (let item of lists[i].options.disabledition) {
                      if (item.result[0].type != "checkbox") {
                        for (let modekey in models) {
                          if (modekey == item.result[0].interview_id) {
                            let curVal = "";
                            if (
                              models[item.result[0].interview_id]
                                .constructor === Object
                            ) {
                              //判断选中的值是否为对象
                              curVal =
                                models[item.result[0].interview_id].value;
                            } else {
                              curVal = models[item.result[0].interview_id];
                            }
                            if (item.result[0].options.length > 0) {
                              switch (item.result[0].action) {
                                case "eq": //等于
                                  if (
                                    !(curVal == item.result[0].options[0].value)
                                  ) {
                                    //判断用户选中的值是否与关联条件的值一致
                                    isItemShow = false;
                                  }
                                  break;
                                case "ne": //不等于
                                  if (
                                    !(curVal != item.result[0].options[0].value)
                                  ) {
                                    //判断用户选中的值是否与关联条件的值一致
                                    isItemShow = false;
                                  }
                                  break;
                                case "gt": //大于
                                  if (!(curVal > key.options[0].value)) {
                                    //判断用户选中的值是否与关联条件的值一致
                                    isItemShow = false;
                                  }
                                  break;
                                case "lt": //小于0
                                  if (!(curVal < key.options[0].value)) {
                                    //判断用户选中的值是否与关联条件的值一致
                                    isItemShow = false;
                                  }
                                  break;
                                case "ge": //大于等于
                                  if (!(curVal >= key.options[0].value)) {
                                    //判断用户选中的值是否与关联条件的值一致
                                    isItemShow = false;
                                  }
                                  break;
                                case "le": //小于等于
                                  if (!(curVal <= key.options[0].value)) {
                                    //判断用户选中的值是否与关联条件的值一致
                                    isItemShow = false;
                                  }
                                  break;
                              }
                            }
                            if (!isItemShow) {
                              break;
                            }
                          }
                        }
                      } else {
                        let curVal = models[item.result[0].interview_id].value;
                        let NewArray = [];
                        for (
                          let i = 0;
                          i < item.result[0].options.length;
                          i++
                        ) {
                          NewArray[i] = item.result[0].options[i].value;
                        }
                        if (item.result[0].options.length > 0) {
                          switch (item.result[0].action) {
                            case "eq": //等于
                              if (!this.isSame(curVal, NewArray)) {
                                //判断用户选中的值是否与关联条件的值一致
                                isItemShow = false;
                              }
                              break;
                            case "in": //包含
                              console.log(this.isContained(curVal, NewArray));
                              if (!this.isContained(curVal, NewArray)) {
                                //判断用户选中的值是否与关联条件的值一致
                                isItemShow = false;
                              }
                              break;
                          }
                        }
                        if (curVal == "") {
                          //修复了不等于条件下 空值也会显示元素问题
                          isItemShow = false;
                        }
                        if (!isItemShow) {
                          break;
                        }
                      }
                      if (item.action) {
                        if (!isItemShow) {
                          this.disabled([lists[i].model], false); //启用
                          try {
                            // 设置显示启用后的初始值
                            if (lists[i].type == "date") {
                              if (lists[i].options.isnowdate) {
                                let opt = {};
                                opt[lists[i].model] = dayjs(new Date()).format(
                                  "YYYY-MM-DD"
                                );
                                this.setData(opt);
                              }
                            }
                          } catch (error) {}
                          break;
                        } else {
                          this.disabled([lists[i].model], true); //禁用
                          try {
                            // 设置显示禁用后的初始值
                            if (
                              this.models[lists[i].model].constructor === Object
                            ) {
                              if (lists[i].type == "checkbox") {
                                this.models[lists[i].model].value = [];
                              } else {
                                // this.models[lists[i].model].value = "";
                              }
                            } else if (
                              this.models[lists[i].model].constructor === Array
                            ) {
                              this.models[lists[i].model] = [];
                            } else {
                              this.models[lists[i].model] = "";
                            }
                          } catch (error) {}
                        }
                      } else {
                        if (!isItemShow) {
                          this.disabled([lists[i].model], true); //禁用
                          try {
                            // 设置显示隐藏后的初始值
                            if (
                              this.models[lists[i].model].constructor === Object
                            ) {
                              if (lists[i].type == "checkbox") {
                                if (
                                  lists[i].options.defaultValue.value.length ==
                                  0
                                ) {
                                  //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                  let opt = {};
                                  opt[lists[i].model] = {
                                    value: [],
                                    remark: {},
                                    score: 0
                                  };
                                  this.setData(opt);
                                }
                              } else {
                                if (lists[i].options.defaultValue.value == "") {
                                  //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                  let opt = {};
                                  opt[lists[i].model] = {
                                    value: [],
                                    remark: "",
                                    score: 0
                                  };
                                  this.setData(opt);
                                }
                              }
                            } else if (
                              this.models[lists[i].model].constructor === Array
                            ) {
                              if (lists[i].options.defaultValue.length == 0) {
                                //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                let opt = {};
                                opt[lists[i].model] = [];
                                this.setData(opt);
                              }
                            } else {
                              if (lists[i].options.defaultValue == "") {
                                //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                let opt = {};
                                opt[lists[i].model] = "";
                                this.setData(opt);
                              }
                            }
                          } catch (error) {}
                          break;
                        } else {
                          this.disabled([lists[i].model], false); //启用
                          try {
                            // 设置显示启用后的初始值
                            if (lists[i].type == "date") {
                              if (lists[i].options.isnowdate) {
                                let opt = {};
                                opt[lists[i].model] = dayjs(new Date()).format(
                                  "YYYY-MM-DD"
                                );
                                this.setData(opt);
                              }
                            }
                          } catch (error) {}
                        }
                      }
                    }
                  } else {
                    for (let item of lists[i].options.disabledition) {
                      if (item.result[0].type != "checkbox") {
                        let curVal = "";
                        //当前更改控件的值
                        if (value.constructor === Object) {
                          //判断选中的值是否为对象
                          curVal = value.value;
                        } else {
                          curVal = value;
                        }
                        if (item.result[0].options.length > 0) {
                          switch (item.result[0].action) {
                            case "eq": //等于
                              if (curVal == item.result[0].options[0].value) {
                                //判断用户选中的值是否与关联条件的值一致
                                isItemShow = true;
                              } else {
                                isItemShow = false;
                              }
                              break;
                            case "ne": //不等于
                              if (curVal != item.result[0].options[0].value) {
                                //判断用户选中的值是否与关联条件的值一致
                                isItemShow = true;
                              } else {
                                isItemShow = false;
                              }
                              break;
                            case "gt": //大于
                              if (curVal > key.options[0].value) {
                                //判断用户选中的值是否与关联条件的值一致
                                isItemShow = true;
                              } else {
                                isItemShow = false;
                              }
                              break;
                            case "lt": //小于
                              if (curVal < key.options[0].value) {
                                //判断用户选中的值是否与关联条件的值一致
                                isItemShow = true;
                              } else {
                                isItemShow = false;
                              }
                              break;
                            case "ge": //大于等于
                              if (curVal >= key.options[0].value) {
                                //判断用户选中的值是否与关联条件的值一致
                                isItemShow = true;
                              } else {
                                isItemShow = false;
                              }
                              break;
                            case "le": //小于等于
                              if (curVal <= key.options[0].value) {
                                //判断用户选中的值是否与关联条件的值一致
                                isItemShow = true;
                              } else {
                                isItemShow = false;
                              }
                              break;
                          }
                        }
                      } else {
                        let curVal = value.value;
                        models[item.result[0].interview_id].value;
                        let NewArray = [];
                        for (
                          let i = 0;
                          i < item.result[0].options.length;
                          i++
                        ) {
                          NewArray[i] = item.result[0].options[i].value;
                        }
                        if (item.result[0].options.length > 0) {
                          switch (item.result[0].action) {
                            case "eq": //等于
                              if (this.isSame(curVal, NewArray)) {
                                //判断用户选中的值是否与关联条件的值一致
                                isItemShow = true;
                              } else {
                                isItemShow = false;
                              }
                              break;
                            case "in": //包含
                              if (this.isContained(curVal, NewArray)) {
                                //判断用户选中的值是否与关联条件的值一致
                                isItemShow = true;
                              } else {
                                isItemShow = false;
                              }
                              break;
                          }
                        }
                      }
                      if (item.action) {
                        if (isItemShow) {
                          try {
                            // 设置显示隐藏后的初始值
                            if (
                              this.models[lists[i].model].constructor === Object
                            ) {
                              if (lists[i].type == "checkbox") {
                                if (
                                  lists[i].options.defaultValue.value.length ==
                                  0
                                ) {
                                  //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                  let opt = {};
                                  opt[lists[i].model] = {
                                    value: [],
                                    remark: {},
                                    score: 0
                                  };
                                  this.setData(opt);
                                }
                              } else {
                                if (lists[i].options.defaultValue.value == "") {
                                  //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                  let opt = {};
                                  opt[lists[i].model] = {
                                    value: [],
                                    remark: "",
                                    score: 0
                                  };
                                  this.setData(opt);
                                }
                              }
                            } else if (
                              this.models[lists[i].model].constructor === Array
                            ) {
                              if (lists[i].options.defaultValue.length == 0) {
                                //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                let opt = {};
                                opt[lists[i].model] = [];
                                this.setData(opt);
                              }
                            } else {
                              if (lists[i].options.defaultValue == "") {
                                //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                let opt = {};
                                opt[lists[i].model] = "";
                                this.setData(opt);
                              }
                            }
                          } catch (error) {}
                          this.disabled([lists[i].model], true); //禁用
                          break;
                        } else {
                          this.disabled([lists[i].model], false); //启用
                          // 设置启用的初始值
                          try {
                            // 设置显示启用后的初始值
                            if (lists[i].type == "date") {
                              if (lists[i].options.isnowdate) {
                                let opt = {};
                                opt[lists[i].model] = dayjs(new Date()).format(
                                  "YYYY-MM-DD"
                                );
                                this.setData(opt);
                              }
                            }
                          } catch (error) {}
                        }
                      } else {
                        if (isItemShow) {
                          this.disabled([lists[i].model], false); //启用
                          try {
                            // 设置显示启用后的初始值
                            if (lists[i].type == "date") {
                              if (lists[i].options.isnowdate) {
                                let opt = {};
                                opt[lists[i].model] = dayjs(new Date()).format(
                                  "YYYY-MM-DD"
                                );
                                this.setData(opt);
                              }
                            }
                          } catch (error) {}
                          break;
                        } else {
                          this.disabled([lists[i].model], true); //禁用
                          try {
                            // 设置显示隐藏后的初始值
                            if (
                              this.models[lists[i].model].constructor === Object
                            ) {
                              if (lists[i].type == "checkbox") {
                                if (
                                  lists[i].options.defaultValue.value.length ==
                                  0
                                ) {
                                  //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                  let opt = {};
                                  opt[lists[i].model] = {
                                    value: [],
                                    remark: {},
                                    score: 0
                                  };
                                  this.setData(opt);
                                }
                              } else {
                                if (lists[i].options.defaultValue.value == "") {
                                  //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                  let opt = {};
                                  opt[lists[i].model] = {
                                    value: [],
                                    remark: "",
                                    score: 0
                                  };
                                  this.setData(opt);
                                }
                              }
                            } else if (
                              this.models[lists[i].model].constructor === Array
                            ) {
                              if (lists[i].options.defaultValue.length == 0) {
                                //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                let opt = {};
                                opt[lists[i].model] = [];
                                this.setData(opt);
                              }
                            } else {
                              if (lists[i].options.defaultValue == "") {
                                //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                let opt = {};
                                opt[lists[i].model] = "";
                                this.setData(opt);
                              }
                            }
                          } catch (error) {}
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.log("设置禁用错误信息：" + error);
      }
    },
    //遍历设置显示隐藏
    setToggleMap(lists, i, field, value, models) {
      if (lists[i].options.condition.length > 0) {
        //判断每个控件的条件字段是否为值
        for (let item of lists[i].options.condition) {
          //
          let isItemShow = true;
          if (item.result.length > 0) {
            //判断条件字段里面的
            for (let key of item.result) {
              if (key.interview_id == field) {
                if (item.condition == "and") {
                  for (let item of lists[i].options.condition) {
                    for (let modekey in models) {
                      if (modekey == item.result[0].interview_id) {
                        if (item.result[0].type != "checkbox") {
                          let curVal = "";
                          if (
                            models[item.result[0].interview_id].constructor ===
                            Object
                          ) {
                            //判断选中的值是否为对象
                            curVal = models[item.result[0].interview_id].value;
                          } else {
                            curVal = models[item.result[0].interview_id];
                          }
                          if (item.result[0].options.length > 0) {
                            switch (item.result[0].action) {
                              case "eq": //等于
                                if (
                                  !(curVal == item.result[0].options[0].value)
                                ) {
                                  //判断用户选中的值是否与关联条件的值一致
                                  isItemShow = false;
                                }
                                break;
                              case "ne": //不等于
                                if (
                                  !(curVal != item.result[0].options[0].value)
                                ) {
                                  //判断用户选中的值是否与关联条件的值一致
                                  isItemShow = false;
                                }
                                break;
                              case "gt": //大于
                                if (!(curVal > key.options[0].value)) {
                                  //判断用户选中的值是否与关联条件的值一致
                                  isItemShow = false;
                                }
                                break;
                              case "lt": //小于0
                                if (!(curVal < key.options[0].value)) {
                                  //判断用户选中的值是否与关联条件的值一致
                                  isItemShow = false;
                                }
                                break;
                              case "ge": //大于等于
                                if (!(curVal >= key.options[0].value)) {
                                  //判断用户选中的值是否与关联条件的值一致
                                  isItemShow = false;
                                }
                                break;
                              case "le": //小于等于
                                if (!(curVal <= key.options[0].value)) {
                                  //判断用户选中的值是否与关联条件的值一致
                                  isItemShow = false;
                                }
                                break;
                            }
                          }
                          if (curVal == "") {
                            //修复了不等于条件下 空值也会显示元素问题
                            isItemShow = false;
                          }
                          if (!isItemShow) {
                            break;
                          }
                        } else {
                          let curVal =
                            models[item.result[0].interview_id].value;
                          let NewArray = [];
                          for (
                            let i = 0;
                            i < item.result[0].options.length;
                            i++
                          ) {
                            NewArray[i] = item.result[0].options[i].value;
                          }
                          if (item.result[0].options.length > 0) {
                            switch (item.result[0].action) {
                              case "eq": //等于
                                if (!this.isSame(curVal, NewArray)) {
                                  //判断用户选中的值是否与关联条件的值一致
                                  isItemShow = false;
                                }
                                break;
                              case "in": //包含
                                console.log(this.isContained(curVal, NewArray));
                                if (!this.isContained(curVal, NewArray)) {
                                  //判断用户选中的值是否与关联条件的值一致
                                  isItemShow = false;
                                }
                                break;
                            }
                          }
                          if (curVal == "") {
                            //修复了不等于条件下 空值也会显示元素问题
                            isItemShow = false;
                          }
                          if (!isItemShow) {
                            break;
                          }
                        }
                      }
                    }
                    if (item.action == "show") {
                      if (!isItemShow) {
                        try {
                          // 设置显示隐藏后的初始值
                          if (
                            this.models[lists[i].model].constructor === Object
                          ) {
                            if (lists[i].type == "checkbox") {
                              if (
                                lists[i].options.defaultValue.value.length == 0
                              ) {
                                //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                let opt = {};
                                opt[lists[i].model] = {
                                  value: [],
                                  remark: {},
                                  score: 0
                                };
                                this.setData(opt);
                              }
                            } else {
                              if (lists[i].options.defaultValue.value == "") {
                                //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                let opt = {};
                                opt[lists[i].model] = {
                                  value: [],
                                  remark: "",
                                  score: 0
                                };
                                this.setData(opt);
                              }
                            }
                          } else if (
                            this.models[lists[i].model].constructor === Array
                          ) {
                            if (lists[i].options.defaultValue.length == 0) {
                              //判断系统是否有默认值 没有就直接清空 有就保留默认值
                              let opt = {};
                              opt[lists[i].model] = [];
                              this.setData(opt);
                            }
                          } else {
                            if (lists[i].options.defaultValue == "") {
                              //判断系统是否有默认值 没有就直接清空 有就保留默认值
                              let opt = {};
                              opt[lists[i].model] = "";
                              this.setData(opt);
                            }
                          }
                        } catch (error) {}
                        this.hide([lists[i].model]);
                        break;
                      } else {
                        this.display([lists[i].model]);
                      }
                    } else {
                      if (!isItemShow) {
                        this.display([lists[i].model]);
                        break;
                      } else {
                        try {
                          // 设置显示隐藏后的初始值
                          if (
                            this.models[lists[i].model].constructor === Object
                          ) {
                            if (lists[i].type == "checkbox") {
                              if (
                                lists[i].options.defaultValue.value.length == 0
                              ) {
                                //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                let opt = {};
                                opt[lists[i].model] = {
                                  value: [],
                                  remark: {},
                                  score: 0
                                };
                                this.setData(opt);
                              }
                            } else {
                              if (lists[i].options.defaultValue.value == "") {
                                //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                let opt = {};
                                opt[lists[i].model] = {
                                  value: [],
                                  remark: "",
                                  score: 0
                                };
                                this.setData(opt);
                              }
                            }
                          } else if (
                            this.models[lists[i].model].constructor === Array
                          ) {
                            if (lists[i].options.defaultValue.length == 0) {
                              //判断系统是否有默认值 没有就直接清空 有就保留默认值
                              let opt = {};
                              opt[lists[i].model] = [];
                              this.setData(opt);
                            }
                          } else {
                            if (lists[i].options.defaultValue == "") {
                              //判断系统是否有默认值 没有就直接清空 有就保留默认值
                              let opt = {};
                              opt[lists[i].model] = "";
                              this.setData(opt);
                            }
                          }
                        } catch (error) {}
                        this.hide([lists[i].model]);
                      }
                    }
                  }
                } else {
                  for (let item of lists[i].options.condition) {
                    if (item.result[0].type != "checkbox") {
                      let curVal = "";
                      //当前更改控件的值
                      if (value.constructor === Object) {
                        //判断选中的值是否为对象
                        curVal = value.value;
                      } else {
                        curVal = value;
                      }
                      if (item.result[0].options.length > 0) {
                        switch (item.result[0].action) {
                          case "eq": //等于
                            if (curVal == item.result[0].options[0].value) {
                              //判断用户选中的值是否与关联条件的值一致
                              isItemShow = true;
                            } else {
                              isItemShow = false;
                            }
                            break;
                          case "ne": //不等于
                            if (curVal != item.result[0].options[0].value) {
                              //判断用户选中的值是否与关联条件的值一致
                              isItemShow = true;
                            } else {
                              isItemShow = false;
                            }
                            break;
                          case "gt": //大于
                            if (curVal > key.options[0].value) {
                              //判断用户选中的值是否与关联条件的值一致
                              isItemShow = true;
                            } else {
                              isItemShow = false;
                            }
                            break;
                          case "lt": //小于
                            if (curVal < key.options[0].value) {
                              //判断用户选中的值是否与关联条件的值一致
                              isItemShow = true;
                            } else {
                              isItemShow = false;
                            }
                            break;
                          case "ge": //大于等于
                            if (curVal >= key.options[0].value) {
                              //判断用户选中的值是否与关联条件的值一致
                              isItemShow = true;
                            } else {
                              isItemShow = false;
                            }
                            break;
                          case "le": //小于等于
                            if (curVal <= key.options[0].value) {
                              //判断用户选中的值是否与关联条件的值一致
                              isItemShow = true;
                            } else {
                              isItemShow = false;
                            }
                            break;
                        }
                      }
                      if (curVal == "") {
                        //修复了不等于条件下 空值也会显示元素问题
                        isItemShow = false;
                      }
                      // if (isItemShow) {
                      //   break;
                      // }
                    } else {
                      let curVal = value.value;
                      let NewArray = [];
                      for (let i = 0; i < item.result[0].options.length; i++) {
                        NewArray[i] = item.result[0].options[i].value;
                      }
                      if (item.result[0].options.length > 0) {
                        switch (item.result[0].action) {
                          case "eq": //等于
                            if (this.isSame(curVal, NewArray)) {
                              //判断用户选中的值是否与关联条件的值一致
                              isItemShow = true;
                            } else {
                              isItemShow = false;
                            }
                            break;
                          case "in": //包含
                            if (this.isContained(curVal, NewArray)) {
                              //判断用户选中的值是否与关联条件的值一致
                              isItemShow = true;
                            } else {
                              isItemShow = false;
                            }
                            break;
                        }
                      }
                      if (curVal == "") {
                        //修复了不等于条件下 空值也会显示元素问题
                        isItemShow = false;
                      }
                    }
                    if (item.action == "show") {
                      if (isItemShow) {
                        this.display([lists[i].model]);
                        break;
                      } else {
                        try {
                          // 设置显示隐藏后的初始值
                          if (
                            this.models[lists[i].model].constructor === Object
                          ) {
                            if (lists[i].type == "checkbox") {
                              if (
                                lists[i].options.defaultValue.value.length == 0
                              ) {
                                //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                let opt = {};
                                opt[lists[i].model] = {
                                  value: [],
                                  remark: {},
                                  score: 0
                                };
                                this.setData(opt);
                              }
                            } else {
                              if (lists[i].options.defaultValue.value == "") {
                                //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                let opt = {};
                                opt[lists[i].model] = {
                                  value: [],
                                  remark: "",
                                  score: 0
                                };
                                this.setData(opt);
                              }
                            }
                          } else if (
                            this.models[lists[i].model].constructor === Array
                          ) {
                            if (lists[i].options.defaultValue.length == 0) {
                              //判断系统是否有默认值 没有就直接清空 有就保留默认值
                              let opt = {};
                              opt[lists[i].model] = [];
                              this.setData(opt);
                            }
                          } else {
                            if (lists[i].options.defaultValue == "") {
                              //判断系统是否有默认值 没有就直接清空 有就保留默认值
                              let opt = {};
                              opt[lists[i].model] = "";
                              this.setData(opt);
                            }
                          }
                        } catch (error) {}
                        this.hide([lists[i].model]);
                      }
                    } else {
                      if (isItemShow) {
                        this.display([lists[i].model]);
                        break;
                      } else {
                        try {
                          // 设置显示隐藏后的初始值
                          if (
                            this.models[lists[i].model].constructor === Object
                          ) {
                            if (lists[i].type == "checkbox") {
                              if (
                                lists[i].options.defaultValue.value.length == 0
                              ) {
                                //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                let opt = {};
                                opt[lists[i].model] = {
                                  value: [],
                                  remark: {},
                                  score: 0
                                };
                                this.setData(opt);
                              }
                            } else {
                              if (lists[i].options.defaultValue.value == "") {
                                //判断系统是否有默认值 没有就直接清空 有就保留默认值
                                let opt = {};
                                opt[lists[i].model] = {
                                  value: [],
                                  remark: "",
                                  score: 0
                                };
                                this.setData(opt);
                              }
                            }
                          } else if (
                            this.models[lists[i].model].constructor === Array
                          ) {
                            if (lists[i].options.defaultValue.length == 0) {
                              //判断系统是否有默认值 没有就直接清空 有就保留默认值
                              let opt = {};
                              opt[lists[i].model] = [];
                              this.setData(opt);
                            }
                          } else {
                            if (lists[i].options.defaultValue == "") {
                              //判断系统是否有默认值 没有就直接清空 有就保留默认值
                              let opt = {};
                              opt[lists[i].model] = "";
                              this.setData(opt);
                            }
                          }
                        } catch (error) {}
                        this.hide([lists[i].model]);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    // 判断两个数组包含关系
    isContained(a, b) {
      if (!(a instanceof Array) || !(b instanceof Array)) return false;
      const result =
        a.some(a => b.some(b => a === b)) &&
        b.some(_b => a.some(_a => _a === _b));
      return result;
    },
    //判断两个数组是否相等
    isSame(a, b) {
      if (a.length !== b.length) return false;
      let c = b.slice();
      // 在可以提前退出的情况下不要使用forEach
      for (let i = 0, len = a.length; i < len; i++) {
        let j = c.indexOf(a[i]);
        if (j === -1) return false;
        c.splice(j, 1); // 删除已经匹配的元素，可以缩短下次匹配的时间
      }
      return true;
    },
    //遍历控件
    mapControl(lists, field, value, models) {
      //设置评分
      this.setRateMap(lists, models);
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].type === "grid") {
          //显示隐藏
          this.setToggleMap(lists, i, field, value, models);
          // lists[i].columnns.forEach(item => {
          //   this.mapControl(item.list, field, value, models);
          // })
        } else if (lists[i].type === "rowmatrix") {
          //显示隐藏
          this.setToggleMap(lists, i, field, value, models);
          // lists[i].columnns.forEach(item => {
          //   this.mapControl(item.list, field, value, models);
          // })
        } else if (lists[i].type === "tabs") {
          //显示隐藏
          this.setToggleMap(lists, i, field, value, models);
          // lists[i].tabs.forEach(item => {
          //   this.mapControl(item.list, field, value, models);
          // })
        } else {
          if (lists[i].type === "table") {
            //显示隐藏
            this.setToggleMap(lists, i, field, value, models);
            //设置禁启用
            this.setDisabledMap(lists, i, field, value, models);
            for (let j = 0; j < lists[i].tableColumns.length; j++) {
              //显示隐藏
              this.setToggleMap(lists[i].tableColumns, j, field, value, models);
              // //设置禁启用
              this.setDisabledMap(lists, i, field, value, models);
            }
          } else {
            //显示隐藏
            this.setToggleMap(lists, i, field, value, models);
            //设置禁启用
            this.setDisabledMap(lists, i, field, value, models);
          }
        }
      }
    },
    //设置控件状态
    setControlState(field, value, models) {
      this.mapControl(this.ControlList, field, value, models);
    },
    display(fields) {
      Object.keys(this.displayFields).forEach(key => {
        if (fields.indexOf(key) >= 0) {
          this.$set(this.displayFields, key, true);
        }
      });
      this.displayFields = { ...this.displayFields };
    },
    hide(fields) {
      Object.keys(this.displayFields).forEach(key => {
        if (fields.indexOf(key) >= 0) {
          this.$set(this.displayFields, key, false);
        }
      });

      this.displayFields = { ...this.displayFields };
    },
    disabled(fields, disabled) {
      Object.keys(this.disabledFiedls).forEach(key => {
        if (fields.indexOf(key) >= 0) {
          this.$set(this.disabledFiedls, key, !disabled);
        }
      });
      this._setDisabled(this.data.list, fields, disabled);
      this.disabledFiedls = { ...this.disabledFiedls };
    },
    //设置质疑
    question(fields, value) {
      this._setQuestion(this.data.list, fields, value);
    },
    _setQuestion(genList, fields, value) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === "grid" || genList[i].type === "rowmatrix") {
          genList[i].columns.forEach(item => {
            this._setQuestion(item.list, fields, value);
          });
        } else if (genList[i].type === "tabs") {
          genList[i].tabs.forEach(item => {
            this._setQuestion(item.list, fields, value);
          });
        } else {
          if (genList[i].type === "table") {
            for (let index in genList[i].tableColumns) {
              let tableColumns = genList[i].tableColumns[index];
              if (fields.indexOf(tableColumns.model) >= 0) {
                console.log("table");
                console.log(tableColumns);
                this.$set(tableColumns.options, "question", value.question);
                this.$set(
                  tableColumns.options,
                  "querycontent",
                  value.querycontent
                );
              }
            }
          } else {
            if (fields.indexOf(genList[i].model) >= 0) {
              // for(let j = 0; j < value.length; j++){
              //   if(genList[i].model == value.model){
              // console.log("genList[i].options");
              // console.log(genList[i].options);
              this.$set(genList[i].options, "question", value.question);
              this.$set(genList[i].options, "querycontent", value.querycontent);
              //   }
              // }
            }
          }
        }
      }
    },
    setTips(fields, value) {
      this._setTips(this.data.list, fields, value);
    },
    _setTips(genList, fields, value) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === "grid" || genList[i].type === "rowmatrix") {
          genList[i].columns.forEach(item => {
            this._setTips(item.list, fields, value);
          });
        } else if (genList[i].type === "tabs") {
          genList[i].tabs.forEach(item => {
            this._setTips(item.list, fields, value);
          });
        } else {
          if (genList[i].type === "table") {
            for (let index in genList[i].tableColumns) {
              let tableColumns = genList[i].tableColumns[index];
              if (fields.indexOf(tableColumns.model) >= 0) {
                this.$set(tableColumns.options, "tips", value.tips);
                this.$set(
                  tableColumns.options,
                  "tipscontent",
                  value.tipscontent
                );
              }
            }
          } else {
            if (fields.indexOf(genList[i].model) >= 0) {
              this.$set(genList[i].options, "tips", value.tips);
              this.$set(genList[i].options, "tipscontent", value.tipscontent);
            }
          }
        }
      }
      console.log(genList);
    },
    refresh() {},
    setData(value) {
      this.models = { ...this.models, ...value };
    },
    getModels() {
      return this.models;
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.models = { ...this.models, ...val };
      }
    }
  }
};
</script>
