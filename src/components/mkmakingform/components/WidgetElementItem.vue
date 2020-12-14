<template>
  <span>
    <template v-if="element.type == 'input'">
      <el-input
        v-model="element.options.defaultValue"
        :style="{width: isTable ? '100%' : element.options.width}"
        :placeholder="element.options.placeholder"
        :clearable="element.options.clearable"
        :disabled="element.options.disabled"
        :show-password="element.options.showPassword"
      ></el-input>
    </template>
	
	<template v-if="element.type == 'name'">
		<mk-name
			v-model="element.options.defaultValue"
			:disabled="element.options.disabled"
			:clearable="element.options.clearable"
			:style="{width: isTable ? '100%' : element.options.width}"
		>
		</mk-name>
	</template>
	
	<template v-if="element.type == 'sex'">
		<mk-sex
			v-model="element.options.defaultValue"
			:disabled="element.options.disabled"
		>
		</mk-sex>
	</template>
	
	<template v-if="element.type == 'age'">
		<mk-age
			v-model="element.options.defaultValue"
			:placeholder="element.options.placeholder"
			:disabled="element.options.disabled"
			:clearable="element.options.clearable"
			:style="{width: isTable ? '100%' : element.options.width}"
		>
		</mk-age>
	</template>
	
	<template v-if="element.type == 'address'">
		<mk-address
			v-model="element.options.defaultValue"
			:placeholder="element.options.placeholder"
			:disabled="element.options.disabled"
			:clearable="element.options.clearable"
			:style="{width: isTable ? '100%' : element.options.width}"
		>
		</mk-address>
	</template>
		
	<template v-if="element.type == 'idcard'">
		<mk-idcard
			v-model="element.options.defaultValue"
			:placeholder="element.options.placeholder"
			:disabled="element.options.disabled"
			:clearable="element.options.clearable"
			:style="{width: isTable ? '100%' : element.options.width}"
		>
		</mk-idcard>
	</template>
		
	<template v-if="element.type == 'tel'">
		<mk-tel
			v-model="element.options.defaultValue"
			:placeholder="element.options.placeholder"
			:disabled="element.options.disabled"
			:clearable="element.options.clearable"
			:style="{width: isTable ? '100%' : element.options.width}"
		>
		</mk-tel>
	</template>
	
    <template v-if="element.type == 'textarea'">
      <el-input
        type="textarea"
        :rows="5"
        v-model="element.options.defaultValue"
        :style="{width: isTable ? '100%' : element.options.width}"
        :disabled="element.options.disabled"
        :placeholder="element.options.placeholder"
      ></el-input>
    </template>

    <template v-if="element.type == 'number'">
      <el-input-number
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :controls-position="element.options.controlsPosition"
        :style="{width: isTable ? '100%' : element.options.width}"
      ></el-input-number>
    </template>

    <template v-if="element.type == 'radio'">
      <m-radio :element="element" v-model="element.options.defaultValue" :isTable="isTable"></m-radio>
      <!-- <el-radio-group
        v-model="element.options.defaultValue"
        :style="{width: isTable ? '100%' : element.options.width}"
        :disabled="element.options.disabled"
      >
        <el-radio
          :style="{display: element.options.inline ? 'inline-block' : 'block'}"
          :label="item.value"
          v-for="(item, index) in element.options.options"
          :key="item.value + index"
        >{{element.options.showLabel ? item.label : item.value}}</el-radio>
      </el-radio-group>-->
    </template>

    <template v-if="element.type == 'checkbox'">
      <m-checkbox :element="element" v-model="element.options.defaultValue" :isTable="isTable"></m-checkbox>
      <!-- <el-checkbox-group
        v-model="element.options.defaultValue"
        :style="{width: isTable ? '100%' : element.options.width}"
        :disabled="element.options.disabled"
      >
        <el-checkbox
          :style="{display: element.options.inline ? 'inline-block' : 'block'}"
          :label="item.value"
          v-for="(item, index) in element.options.options"
          :key="item.value + index"
        >{{element.options.showLabel ? item.label : item.value}}</el-checkbox>
      </el-checkbox-group>-->
    </template>
    <template v-if="element.type == 'units'">
      <unit-input
        v-model="element.options.defaultValue"
        :list="element"
        :width="element.options.width"
        :style="{width: isTable ? '100%' : element.options.width}"
        :disabled="element.options.disabled"
      ></unit-input>
      <!-- <el-input
        placeholder="请输入内容"
        :style="{width: isTable ? '100%' : element.options.width}"
        :disabled="element.options.disabled"
        v-model="element.options.defaultValue"
        class="input-with-select"
      >
        <el-select v-model="element.options.options.defaultValue" :disabled="element.options.disabled" slot="append" placeholder="单位">
          <el-option
            v-for="item in element.options.options.options"
            :key="item.value"
            :value="item.value"
            :label="element.options.options.options.showLabel?item.label:item.value"
          ></el-option>
        </el-select>
      </el-input>-->
    </template>
    <template v-if="element.type == 'time'">
      <el-time-picker
        v-model="element.options.defaultValue"
        :is-range="element.options.isRange"
        :placeholder="element.options.placeholder"
        :start-placeholder="element.options.startPlaceholder"
        :end-placeholder="element.options.endPlaceholder"
        :readonly="element.options.readonly"
        :disabled="element.options.disabled"
        :editable="element.options.editable"
        :clearable="element.options.clearable"
        :arrowControl="element.options.arrowControl"
        :style="{width: isTable ? '100%' : element.options.width}"
      ></el-time-picker>
    </template>

    <template v-if="element.type == 'date'">
      <el-date-picker
        v-model="element.options.defaultValue"
        :type="element.options.type"
        :is-range="element.options.isRange"
        :placeholder="element.options.placeholder"
        :start-placeholder="element.options.startPlaceholder"
        :end-placeholder="element.options.endPlaceholder"
        :readonly="element.options.readonly"
        :disabled="element.options.disabled"
        :editable="element.options.editable"
        :clearable="element.options.clearable"
        :style="{width: isTable ? '100%' : element.options.width}"
      ></el-date-picker>
    </template>

    <template v-if="element.type == 'rate'">
      <el-rate
        v-model="element.options.defaultValue"
        :max="element.options.max"
        :disabled="element.options.disabled"
        :allow-half="element.options.allowHalf"
        :show-score="element.options.showScore"
      ></el-rate>
    </template>
    <template v-if="element.type == 'score'">
      <span style="color:#ff9900;">{{element.options.defaultValue}}</span>
    </template>
    <template v-if="element.type == 'color'">
      <el-color-picker
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :show-alpha="element.options.showAlpha"
      ></el-color-picker>
    </template>

    <template v-if="element.type == 'select'">
      <m-select
        v-model="element.options.defaultValue"
        :element="element"
        :isTable="isTable"
        :edit="true"
      ></m-select>
      <!-- <el-select
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :multiple="element.options.multiple"
        :clearable="element.options.clearable"
        :placeholder="element.options.placeholder"
        :style="{width: isTable ? '100%' : element.options.width}"
      >
        <el-option
          v-for="item in element.options.options"
          :key="item.value"
          :value="item.value"
          :label="element.options.showLabel?item.label:item.value"
        ></el-option>
      </el-select>-->
    </template>

    <template v-if="element.type=='switch'">
      <el-switch v-model="element.options.defaultValue" :disabled="element.options.disabled"></el-switch>
    </template>

    <template v-if="element.type=='slider'">
      <el-slider
        v-model="element.options.defaultValue"
        :min="element.options.min"
        :max="element.options.max"
        :disabled="element.options.disabled"
        :step="element.options.step"
        :show-input="element.options.showInput"
        :range="element.options.range"
        :show-stops="element.options.isShowStops"
        :style="{width: isTable ? '100%' : element.options.width}"
      ></el-slider>
    </template>

    <template v-if="element.type=='imgupload'">
      <fm-upload
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :style="{'width': isTable ? '100%' : element.options.width}"
        :width="element.options.size.width"
        :height="element.options.size.height"
        token="xxx"
        domain="xxx"
      ></fm-upload>
    </template>

    <template v-if="element.type == 'cascader'">
      <el-cascader
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :clearable="element.options.clearable"
        :placeholder="element.options.placeholder"
        :style="{width: isTable ? '100%' : element.options.width}"
        :options="element.options.remoteOptions"
      ></el-cascader>
    </template>

    <template v-if="element.type == 'editor'">
      <vue-editor
        v-model="element.options.defaultValue"
        :style="{width: isTable ? '100%' : element.options.width, cursor: element.options.disabled ? 'no-drop' : '', backgroundColor: element.options.disabled ? '#F5F7FA' : ''}"
        :editor-toolbar="element.options.customToolbar"
        class="fm-editor"
        :disabled="element.options.disabled"
      ></vue-editor>
    </template>

    <template v-if="element.type=='blank'">
      <div
        style="height: 50px;color: #999;background: #eee;line-height:50px;text-align:center;"
      >自定义区域</div>
    </template>

    <template v-if="element.type == 'text'">
      <div
        :style="[element.options.styleObject,{'fontSize':element.options.styleObject.fontSize + 'px'}]"
      >{{element.options.defaultValue}}</div>
      <!-- <span>{{element.options.defaultValue}}</span> -->
    </template>

    <template v-if="element.type == 'html'">
      <span v-html="element.options.defaultValue"></span>
    </template>
		<template v-if="element.type == 'img'">
		  <mk-img
		  v-model="element.options.defaultValue"
		  :width="element.options.size.width"
		  :height="element.options.size.height"
		  :align="element.options.styleObject.align"
		  ></mk-img>
		</template>
	<template v-if="element.type == 'oralcavity'">
	  <oral-cavity></oral-cavity>
	</template>
    <template v-if="element.type == 'fileupload'">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        :style="{width: isTable ? '100%' : element.options.width}"
        :disabled="element.options.disabled"
        :limit="element.options.limit"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div v-if="element.options.tip" class="el-upload__tip" slot="tip">{{element.options.tip}}</div>
      </el-upload>
    </template>
		
	<template v-if="element.type == 'btn'">
		<mk-btn
			:width="element.options.width"
			:type="element.options.type"
			:position="element.options.contentPosition"
			:size="element.options.size"
			:disabled="element.options.disabled"
			:plain="element.options.plain"
			:round="element.options.round"
			:circle="element.options.circle"
			:script="element.options.script"
		></mk-btn>
	</template>
  </span>
</template>

<script>
import FmUpload from "./Upload";
import UnitInput from "./units";
import MRadio from "./radio";
import MSelect from "./select";
import MCheckbox from "./checkbox";
import MkImg from "./img/index"
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
  components: {
    FmUpload,
    UnitInput,
    MRadio,
    MCheckbox,
	MkImg,
    MSelect,
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
  props: ["element", "isTable"]
};
</script>
<style>
.units .el-form-item__label {
  margin-left: 0 !important;
}
</style>
