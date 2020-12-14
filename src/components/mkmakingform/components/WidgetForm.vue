<template>
  <div class="widget-form-container">
    <el-row style="height:100%;" :gutter="10">
    <el-form  :size="data.config.size" label-suffix=":" :label-position="data.config.labelPosition" :label-width="data.config.labelWidth + 'px'">
      <!-- <div v-if="data.list.length == 0" class="form-empty">从左侧拖拽或点击来添加字段</div> -->
      <draggable class=""
        v-model="data.list"
        v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"

        @add="handleWidgetAdd"
      >

        <transition-group name="fade" tag="div"  class="widget-form-list" :style="{background:data.list.length == 0 ? 'url(' + base64Img + ') no-repeat 50% center #fff' : ''}">

          <template v-for="(element, index) in data.list" v-if="element && element.key" >
            <widget-table
              v-if="element.type === 'table'"
              :key="element.key"
              :element="element"
              :select.sync="selectWidget"
              :index="index" :data="data"
              @select-change="handleSelectChange"
            >
            </widget-table>

            <widget-tab-item
              v-else-if="element.type === 'tabs'"
              :key="element.key"
              :element="element"
              :select.sync="selectWidget"
              :index="index" :data="data"
              @select-change="handleSelectChange"
            >
            </widget-tab-item>

            <widget-col-item
              v-else-if="element.type == 'grid'"
              :key="element.key"
              :element="element"
              :select.sync="selectWidget"
              :index="index" :data="data"
              @select-change="handleSelectChange"
            >
            </widget-col-item>

            <widget-row-matrix-item
              v-else-if="element.type == 'rowmatrix'"
              :key="element.key"
              :element="element"
              :select.sync="selectWidget"
              :index="index" :data="data"
              @select-change="handleSelectChange"
            >
            </widget-row-matrix-item>

            <widget-form-item
             v-else
              :key="element.key"
              :element="element"
              :select.sync="selectWidget"
              :index="index" :data="data"
              @select-change="handleSelectChange"
            >
            </widget-form-item>




          </template>
        </transition-group>

      </draggable>
    </el-form>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem'
import WidgetColItem from './WidgetColItem'
import WidgetRowMatrixItem from './WidgetRowMatrixItem'
import WidgetTable from './WidgetTable'
import WidgetTabItem from './WidgetTabItem'
import { EventBus } from '../util/event-bus.js'
import MD5 from "@/libs/util.md5.js";
import _ from 'lodash'

export default {
  components: {
    Draggable,
    WidgetFormItem,
    WidgetColItem,
    WidgetRowMatrixItem,
    WidgetTable,
    WidgetTabItem
  },
  props: ['data', 'select'],
	provide(){
		return {
			generateForm:this
		}
	},
  data () {
    return {
      rateOptionList:[],//关联评分控件
      base64Img:
        "data:image/png;base64,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",
      selectWidget: this.select
    }
  },
  mounted () {
    document.body.ondrop = function (event) {
      let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    EventBus.$on('on-field-add', item => {
      console.log('.....')
      console.log(item, this.data, this.select)
      const key = new Date().getTime() + ''
	  let model = key.MD5().toUpperCase();
	  if(item.type == 'name'){
	  		model = 'membername'
	  }else if(item.type == 'sex'){
	  		model = 'sex'
	  }else if(item.type == 'age'){
	  		model = 'age'
	  }else if(item.type == 'address'){
	  		model = 'address'
	  }else if(item.type == 'tel'){
	  		model = 'mobiletel'
	  }else if(item.type == 'idcard'){
	  		model = 'idnumber'
	  }
      let widgetItem = _.cloneDeep({
        ...item,
        options: {
          ...item.options,
          remoteFunc: 'func_' + key.MD5().toUpperCase(),
          remoteOption: 'option_' + key.MD5().toUpperCase()
        },
        key:key.MD5().toUpperCase(),
        model: model,
        rules: []
      })
      this._addWidget(this.data.list, widgetItem)

    })
  },
  computed:{
    ...mapState('d2admin/ecrf',['rateOptions'])
  },
  methods: {
    ...mapActions('d2admin/ecrf', [
      'wgeCRFDataSet','rateOptionsSet'
    ]),
    _addWidget (list, widget) {
      if (this.selectWidget && this.selectWidget.key) {
        const index = list.findIndex(item => item.key == this.selectWidget.key)

        if (index >= 0) {
          list.splice(index + 1, 0, widget)

          this.selectWidget = list[index + 1]
        } else {
          list.forEach(item => {
            if (item.type === 'grid') {
              item.columns.forEach(column => {
                this._addWidget(column.list, widget)
              })
            }
            if (item.type === 'table') {
              this._addWidget(item.tableColumns, widget)
            }
            if (item.type === 'tabs') {
              item.tabs.forEach(tab => {
                this._addWidget(tab.list, widget)
              })
            }
          })
        }
      } else {
        list.push(widget)
        this.selectWidget = list[list.length - 1]
      }
    },

    handleWidgetAdd (evt) {

      console.log('add', evt)
      console.log('end', evt)
      const newIndex = evt.newIndex
      const to = evt.to
      console.log(to)
      //为拖拽到容器的元素添加唯一 key
      const key = new Date().getTime() + ''
			let model = key.MD5().toUpperCase();
			let data = this.data.list[newIndex];
			if(data.type == 'name'){					model = 'membername'			}else if(data.type == 'sex'){					model = 'sex'			}else if(data.type == 'age'){					model = 'age'			}else if(data.type == 'address'){					model = 'address'			}else if(data.type == 'tel'){					model = 'mobiletel'			}else if(data.type == 'idcard'){					model = 'idnumber'			}
      this.$set(this.data.list, newIndex, {
        ...this.data.list[newIndex],
        options: {
          ...this.data.list[newIndex].options,
          remoteFunc: this.data.list[newIndex].options.remoteFunc || 'func_' + key.MD5().toUpperCase(),
          remoteOption: this.data.list[newIndex].options.remoteOption || 'option_' + key.MD5().toUpperCase(),
        },
        key:key.MD5().toUpperCase(),
        // 绑定键值
        model: this.data.list[newIndex].model ? this.data.list[newIndex].model :  model,
        rules: this.data.list[newIndex].rules ? [...this.data.list[newIndex].rules] : []
      })

      this.$set(this.data.list, newIndex, _.cloneDeep(this.data.list[newIndex]))

      this.selectWidget = this.data.list[newIndex]
      // this.wgeCRFDataSet(this.data.list)
      this.$nextTick(() => {

        this.$emit('scrollTop')

      })
    },
    handleWidgetDelete (index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.data.list[index - 1]
        }
      } else {
        this.selectWidget = this.data.list[index + 1]
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1)

      })
    },
    handleSelectChange (index) {
      console.log('select-change', index)
      setTimeout(() => {
        index >=0 ? (this.selectWidget = this.data.list[index]) : (this.selectWidget = {})
      })

    }
  },
  watch: {
    select (val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler (val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
    margin-top: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
