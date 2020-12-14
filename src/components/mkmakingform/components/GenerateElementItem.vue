<template>
  <span>
    <template v-if="widget.type == 'blank'">
      <div :style="{width: isTable ? '100%' : widget.options.width}">
        <slot :name="widget.model" :model="dataModels"></slot>
      </div>
    </template>

    <template v-if="widget.type == 'input'">
      <el-input
        v-if="widget.options.dataType == 'number' || widget.options.dataType == 'integer' || widget.options.dataType == 'float'"
        type="number"
        v-model="dataModel"
        :max="widget.options.max"
        :min="widget.options.min"
        :step="widget.options.steps"
        :disabled="!edit || widget.options.disabled"
        :placeholder="widget.options.placeholder"
        :clearable="widget.options.clearable"
        :show-password="widget.options.showPassword"
        :style="{width: isTable ? '100%' : widget.options.width}"
      ></el-input>
      <el-input
        v-else
        :type="widget.options.dataType"
        :max="widget.options.max"
        :min="widget.options.min"
        :step="widget.options.steps"
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :placeholder="widget.options.placeholder"
        :show-password="widget.options.showPassword"
        :clearable="widget.options.clearable"
        :style="{width: isTable ? '100%' : widget.options.width}"
      ></el-input>
    </template>
		
	<template v-if="widget.type == 'name'">
		<mk-name
			v-model="dataModel"
			:disabled="!edit || widget.options.disabled"
			:clearable="widget.options.clearable"
			:style="{width: isTable ? '100%' : widget.options.width}"
		>
		</mk-name>
	</template>
	
	<template v-if="widget.type == 'sex'">
		<mk-sex
			v-model="dataModel"
			:disabled="!edit || widget.options.disabled"
		>
		</mk-sex>
	</template>
	
	<template v-if="widget.type == 'age'">
		<mk-age
			v-model="dataModel"
			:type="widget.options.dataType"
			:max="widget.options.max"
			:min="widget.options.min"
			:placeholder="widget.options.placeholder"
			:disabled="!edit || widget.options.disabled"
			:clearable="widget.options.clearable"
			:style="{width: isTable ? '100%' : widget.options.width}"
		>
		</mk-age>
	</template>
	
	<template v-if="widget.type == 'address'">
		<mk-address
			v-model="dataModel"
			:placeholder="widget.options.placeholder"
			:disabled="!edit || widget.options.disabled"
			:clearable="widget.options.clearable"
			:style="{width: isTable ? '100%' : widget.options.width}"
		>
		</mk-address>
	</template>
		
	<template v-if="widget.type == 'idcard'">
		<mk-idcard
			v-model="dataModel"
			:placeholder="widget.options.placeholder"
			:disabled="!edit || widget.options.disabled"
			:clearable="widget.options.clearable"
			:style="{width: isTable ? '100%' : widget.options.width}"
		>
		</mk-idcard>
	</template>
		
	<template v-if="widget.type == 'tel'">
		<mk-tel
			v-model="dataModel"
			:type="widget.options.dataType"
			:placeholder="widget.options.placeholder"
			:disabled="!edit || widget.options.disabled"
			:clearable="widget.options.clearable"
			:style="{width: isTable ? '100%' : widget.options.width}"
		>
		</mk-tel>
	</template>
    <template v-if="widget.type == 'textarea'">
      <el-input
        type="textarea"
        :rows="5"
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :placeholder="widget.options.placeholder"
        :style="{width: isTable ? '100%' : widget.options.width}"
      ></el-input>
    </template>

    <template v-if="widget.type == 'number'">
      <el-input-number
        v-model="dataModel"
        :min="widget.options.min"
        :max="widget.options.max"
        :style="{width: isTable ? '100%' : widget.options.width}"
        :step="widget.options.step"
        controls-position="right"
        :disabled="!edit || widget.options.disabled"
      ></el-input-number>
    </template>

    <template v-if="widget.type == 'radio'">
      <m-radio :element="widget" v-model="dataModel" :isTable="isTable" :edit="edit"></m-radio>
      <!-- <el-radio-group
        v-model="dataModel"
        :style="{width: isTable ? '100%' : widget.options.width}"
        :disabled="!edit || widget.options.disabled"
      >
        <el-radio
          :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
          :label="item.value"
          v-for="(item, index) in (widget.options.remote ? remoteOptions : widget.options.options)"
          :key="index"
        >
          <template v-if="widget.options.remote">{{item.label}}</template>
          <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
        </el-radio>
      </el-radio-group>-->
    </template>

    <template v-if="widget.type == 'checkbox'">
      <m-checkbox :element="widget" v-model="dataModel" :isTable="isTable" :edit="edit"></m-checkbox>
      <!-- <el-checkbox-group
        v-model="dataModel"
        :style="{width: isTable ? '100%' : widget.options.width}"
        :disabled="!edit || widget.options.disabled"
      >
        <el-checkbox
          :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
          :label="item.value"
          v-for="(item, index) in (widget.options.remote ? remoteOptions : widget.options.options)"
          :key="index"
        >
          <template v-if="widget.options.remote">{{item.label}}</template>
          <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
        </el-checkbox>
      </el-checkbox-group>-->
    </template>
    <template v-if="widget.type == 'units'">
      <unit-input
        v-model="dataModel"
        :list="widget"
        :width="widget.options.width"
        :style="{width: isTable ? '100%' : widget.options.width}"
        :disabled="widget.options.disabled"
      ></unit-input>
    </template>
    <template v-if="widget.type == 'time'">
      <el-time-picker
        v-model="dataModel"
        :is-range="widget.options.isRange"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readonly="widget.options.readonly"
        :disabled="!edit || widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :arrowControl="widget.options.arrowControl"
        :value-format="widget.options.format"
        :format="widget.options.format"
        :style="{width: isTable ? '100%' : widget.options.width}"
      ></el-time-picker>
    </template>

    <template v-if="widget.type=='date'">
      <m-date v-model="dataModel" :widget="widget" :edit="edit" :isTable="isTable"></m-date>
      <!-- <el-date-picker
        v-model="dataModel"
        :type="widget.options.type"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readonly="widget.options.readonly"
        :disabled="!edit || widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format"
        :format="widget.options.format"
        :style="{width: isTable ? '100%' : widget.options.width}"
      ></el-date-picker>-->
    </template>

    <template v-if="widget.type =='rate'">
      <el-rate
        v-model="dataModel"
        :max="widget.options.max"
        :disabled="!edit || widget.options.disabled"
        :allow-half="widget.options.allowHalf"
        :show-score="widget.options.showScore"
      ></el-rate>
    </template>
    <template v-if="widget.type == 'score'">
      <span style="color:#ff9900;">{{dataModel}}</span>
    </template>
    <template v-if="widget.type == 'color'">
      <el-color-picker
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :show-alpha="widget.options.showAlpha"
      ></el-color-picker>
    </template>

    <template v-if="widget.type == 'select'">
      <m-select v-model="dataModel" :element="widget" :isTable="isTable" :edit="edit"></m-select>
      <!-- <el-select
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :multiple="widget.options.multiple"
        :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder"
        :style="{width: isTable ? '100%' : widget.options.width}"
        :filterable="widget.options.filterable"
      >
        <el-option
          v-for="item in (widget.options.remote ? remoteOptions : widget.options.options)"
          :key="item.value"
          :value="item.value"
          :label="widget.options.showLabel || widget.options.remote?item.label:item.value"
        ></el-option>
      </el-select>-->
    </template>

    <template v-if="widget.type=='switch'">
      <el-switch v-model="dataModel" :disabled="!edit || widget.options.disabled"></el-switch>
    </template>

    <template v-if="widget.type=='slider'">
      <el-slider
        v-model="dataModel"
        :min="widget.options.min"
        :max="widget.options.max"
        :disabled="!edit || widget.options.disabled"
        :step="widget.options.step"
        :show-input="widget.options.showInput"
        :range="widget.options.range"
        :show-stops="widget.options.isShowStops"
        :style="{width: isTable ? '100%' : widget.options.width}"
      ></el-slider>
    </template>

    <template v-if="widget.type=='imgupload'">
      <fm-upload
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :readonly="widget.options.readonly"
        :style="{'width': isTable ? '100%' : widget.options.width}"
        :width="widget.options.size.width"
        :height="widget.options.size.height"
        :token="widget.options.token"
        :domain="widget.options.domain"
        :multiple="widget.options.multiple"
        :limit="widget.options.limit"
        :is-qiniu="widget.options.isQiniu"
        :is-delete="widget.options.isDelete"
        :min="widget.options.min"
        :is-edit="widget.options.isEdit"
        :action="widget.options.action"
      ></fm-upload>
    </template>

    <template v-if="widget.type == 'editor'">
      <vue-editor
        v-model="dataModel"
        :style="{width: isTable ? '100%' : widget.options.width, cursor: (!edit || widget.options.disabled) ? 'no-drop' : '', backgroundColor: (!edit || widget.options.disabled) ? '#F5F7FA' : ''}"
        :editor-toolbar="widget.options.customToolbar"
        class="fm-editor"
        :disabled="!edit || widget.options.disabled"
      ></vue-editor>
    </template>

    <template v-if="widget.type == 'cascader'">
      <el-cascader
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder"
        :style="{width: isTable ? '100%' : widget.options.width}"
        :options="remoteOptions"
      ></el-cascader>
    </template>

    <template v-if="widget.type == 'text'">
      <div
        style="width:100%;"
        :style="[widget.options.styleObject,{'fontSize':widget.options.styleObject.fontSize + 'px'}]"
      >{{dataModel}}</div>
      <!-- <span>{{dataModel}}</span> -->
    </template>

    <template v-if="widget.type == 'html'">
      <span v-html="dataModel"></span>
    </template>
		<template v-if="widget.type == 'img'">
		  <mk-img
		  v-model="dataModel"
		  :width="widget.options.size.width"
		  :height="widget.options.size.height"
		  :align="widget.options.styleObject.align"
		  ></mk-img>
		</template>
		<template v-if="widget.type == 'oralcavity'">
		  <oral-cavity
			v-model="dataModel"
		   :disabled="!edit || widget.options.disabled"
		  ></oral-cavity>
		</template>
    <template v-if="widget.type == 'table'">
      <fm-form-table
        v-model="dataModel"
        :columns="widget.tableColumns"
        :models="dataModels"
        :remote="remote"
        :blanks="blanks"
        @rightClickMenu="rightClickMenu"
        :disabled="!edit || widget.options.disabled"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </fm-form-table>
    </template>

    <template v-if="widget.type == 'fileupload'">
      <fm-file-upload
        v-model="dataModel"
        :action="widget.options.action"
        :width="isTable ? '100%' : widget.options.width"
        :disabled="!edit || widget.options.disabled"
        :limit="widget.options.limit"
        :tip="widget.options.tip"
      ></fm-file-upload>
    </template>
	
	 <template v-if="widget.type == 'btn'">
		<mk-btn
			:width="isTable ? '100%' : widget.options.width"
			:type="widget.options.type"
			:position="widget.options.contentPosition"
			:size="widget.options.size"
			:disabled="widget.options.disabled"
			:plain="widget.options.plain"
			:round="widget.options.round"
			:circle="widget.options.circle"
			:script="widget.options.script"
		></mk-btn>
	 </template>
	
  </span>
</template>

<script>
import FmUpload from "./Upload";
import FmFormTable from "./FormTable";
import FmFileUpload from "./Upload/file";
import UnitInput from "./units";
import MRadio from "./radio";
import MCheckbox from "./checkbox";
import MSelect from "./select";
import MkImg from "./img/index";
import MDate from "./date";
import MkName from "./sys/name.vue"
import MkAge from "./sys/age.vue"
import MkAddress from "./sys/address.vue"
import MkIdcard from "./sys/idcard.vue"
import MkSex from "./sys/sex.vue"
import MkTel from "./sys/tel.vue"
import MkBtn from "./sys/btn.vue"
import OralCavity from "./oralcavity"
import { VueEditor } from "vue2-editor";
export default {
  name: "generate-element-item",
  components: {
    FmUpload,
    FmFormTable,
    FmFileUpload,
    UnitInput,
    MRadio,
    MCheckbox,
    MSelect,
    MDate,
	MkImg,
	OralCavity,
    VueEditor,
	MkName,
	MkAge,
	MkAddress,
	MkIdcard,
	MkSex,
	MkTel,
	MkBtn
  },
  props: [
    "widget",
    "value",
    "models",
    "remote",
    "isTable",
    "blanks",
    "disabled",
    "edit",
    "remoteOption"
  ],
  data() {
    return {
      dataModel: this.value,
      dataModels: { ...this.models },
      remoteOptions: []
    };
  },
  created() {
    this.remoteOptions = [];
    if (
      this.widget.options.remote &&
      (Object.keys(this.widget.options).indexOf("remoteType") >= 0
        ? this.widget.options.remoteType == "func"
        : true) &&
      this.remote[this.widget.options.remoteFunc]
    ) {
      this.remote[this.widget.options.remoteFunc](data => {
        this.loadOptions(data);
      });
    }

    if (
      this.widget.options.remote &&
      this.widget.options.remoteType == "option" &&
      this.remoteOption[this.widget.options.remoteOption]
    ) {
      this.loadOptions(this.remoteOption[this.widget.options.remoteOption]);
    }

    if (this.widget.type === "imgupload" && this.widget.options.isQiniu) {
      this.remote[this.widget.options.tokenFunc](data => {
        this.widget.options.token = data;
      });
    }
  },
  methods: {
    rightClickMenu(data, key, index) {
      this.$emit("rightClickMenu", data, key, index);
    },
    loadOptions(data) {
      this.remoteOptions = data.map(item => {
        if (
          this.widget.options.props.children &&
          this.widget.options.props.children.length &&
          Object.keys(item).includes(this.widget.options.props.children)
        ) {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
            children: this.processRemoteProps(
              item[this.widget.options.props.children],
              this.widget.options.props
            )
          };
        } else {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label]
          };
        }
      });
    },
    processRemoteProps(children, props) {
      if (children && children.length) {
        return children.map(item => {
          if (this.processRemoteProps(item[props.children], props).length) {
            return {
              value: item[props.value],
              label: item[props.label],
              children: this.processRemoteProps(item[props.children], props)
            };
          } else {
            return {
              value: item[props.value],
              label: item[props.label]
            };
          }
        });
      } else {
        return [];
      }
    }
  },
  watch: {
    value(val) {
      this.dataModel = val;
    },
    dataModel(val) {
      this.$emit("input", val);
    },

    remoteOption: {
      deep: "true",
      handler: function(val) {
        if (
          Object.keys(this.remoteOption).indexOf(
            this.widget.options.remoteOption
          ) >= 0 &&
          this.widget.options.remote &&
          this.widget.options.remoteType == "option"
        ) {
          this.loadOptions(this.remoteOption[this.widget.options.remoteOption]);
        }
      }
    }
  }
};
</script>
