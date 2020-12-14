<template>
  <div v-if="show">
    <el-form label-position="top" size="small">
      <el-form-item label="字段标识">
        <el-input v-model="data.model"></el-input>
      </el-form-item>
      <el-form-item label="是否显示标题" v-if="data.type == 'divider'">
        <el-switch v-model="data.options.labelHidden"></el-switch>
      </el-form-item>
      <el-form-item
        label="标题"
        v-if="
          data.type != 'grid' && data.type != 'tabs' && data.type != 'rowmatrix'
        "
      >
        <el-input v-model="data.name"></el-input>
      </el-form-item>
      <el-form-item label="评分显示设置" v-if="data.type == 'score'">
        <el-select
          v-model="data.options.cognateValue"
          multiple
          placeholder="请选择"
          @change="scoreChange"
        >
          <el-option
            v-for="item in rateOptions"
            :key="item.model"
            :label="item.name"
            :value="item.model"
          ></el-option>
        </el-select>
      </el-form-item>
			<el-form-item label="上传自定义图片" v-if="data.type == 'img'">
				<el-upload ref="upload_img_headerImg" class="avatar-uploader" action="" :show-file-list="false" :http-request="uploadSectionFile">
					<img v-if="data.options.defaultValue" :src="data.options.defaultValue" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
			</el-form-item>
<!-- 			<el-form-item label="图片路径" v-if="data.type == 'img'">
			  <el-input
			    type="textarea"
			    :rows="4"
			    placeholder="支持外链和base64格式"
			    v-model="data.options.defaultValue">
			  </el-input>
			</el-form-item> -->
				<el-form-item label="图片位置" v-if="data.type == 'img'">
							<el-radio-group v-model="data.options.styleObject.align">
								<el-radio-button label="left">左侧</el-radio-button>
								<el-radio-button label="center">居中</el-radio-button>
								<el-radio-button label="right">右侧</el-radio-button>
							</el-radio-group>
						</el-form-item>
      <el-form-item
        label="宽度"
        v-if="Object.keys(data.options).indexOf('width') >= 0"
      >
        <el-input v-model="data.options.width"></el-input>
      </el-form-item>

      <el-form-item
        label="高度"
        v-if="Object.keys(data.options).indexOf('height') >= 0"
      >
        <el-input v-model="data.options.height"></el-input>
      </el-form-item>

      <el-form-item
        label="大小"
        v-if="Object.keys(data.options).indexOf('size') >= 0 && data.type != 'btn'"
      >
        宽度
        <el-input
          style="width: 90px;"
          type="number"
          v-model.number="data.options.size.width"
        ></el-input
        >高度
        <el-input
          style="width: 90px;"
          type="number"
          v-model.number="data.options.size.height"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="data.type == 'checkbox'">
        <el-checkbox v-model="data.options.isMax">是否启用选择条件</el-checkbox>
      </el-form-item>
      <el-form-item v-if="data.options.isMax">
        <el-select v-model="data.options.max" placeholder="请选择">
          <el-option
            v-for="(item, index) in data.options.options.length"
            :key="index"
            :label="`最多选 ${index + 1}项`"
            :value="index + 1"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="标签宽度"
        v-if="
          Object.keys(data.options).indexOf('labelWidth') >= 0 &&
            !data.options.tableColumn
        "
      >
        <el-checkbox
          v-model="data.options.isLabelWidth"
          style="margin-right: 5px;"
          >自定义</el-checkbox
        >
        <el-input-number
          v-model="data.options.labelWidth"
          :disabled="!data.options.isLabelWidth"
          :min="0"
          :max="200"
          :step="10"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="表单栅格">
        <el-slider v-model="data.options.span" :max="24"></el-slider>
      </el-form-item>
      <el-form-item
        label="占位内容"
        v-if="
          Object.keys(data.options).indexOf('placeholder') >= 0 &&
            (data.type != 'time' || data.type != 'date')
        "
      >
        <el-input v-model="data.options.placeholder"></el-input>
      </el-form-item>
      <el-form-item
        label="布局方式"
        v-if="Object.keys(data.options).indexOf('inline') >= 0"
      >
        <el-radio-group v-model="data.options.inline">
          <el-radio-button :label="false">块级</el-radio-button>
          <el-radio-button :label="true">行内</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="文案位置"
        v-if="Object.keys(data.options).indexOf('contentPosition') >= 0"
      >
        <el-radio-group v-model="data.options.contentPosition">
          <el-radio-button label="left">左侧</el-radio-button>
          <el-radio-button label="center">居中</el-radio-button>
          <el-radio-button label="right">右侧</el-radio-button>
        </el-radio-group>
      </el-form-item>
	  <el-form-item
	    label="按钮属性"
	    v-if="data.type== 'btn'"
	  >
		<div>
			<div>
				按钮类型
			</div>
			<div>
				 <el-select v-model="data.options.type" placeholder="请选择">
					<el-option key="default" label="默认按钮" value="default"></el-option>
					<el-option key="primary" label="主要按钮" value="primary"></el-option>
					<el-option key="success" label="成功按钮" value="success"></el-option>
					<el-option key="info" label="信息按钮" value="info"></el-option>
					<el-option key="warning" label="警告按钮" value="warning"></el-option>
					<el-option key="danger" label="危险按钮" value="danger"></el-option>
				 </el-select>
			</div>
			<div>
				是否朴素按钮
				  <el-radio-group v-model="data.options.plain">
				    <el-radio :label="true">是</el-radio>
				    <el-radio :label="false">否</el-radio>
				  </el-radio-group>
			</div>
			<div>
				是否圆角按钮
				  <el-radio-group v-model="data.options.round">
				    <el-radio :label="true">是</el-radio>
				    <el-radio :label="false">否</el-radio>
				  </el-radio-group>
			</div>
			<div>
				<span style="color: red;margin-right: 12px;">按钮事件</span>
				<el-button type="text"  @click="setScript" ><i class="icon iconfont icon-JS-file" style="font-size: 30px;"></i></el-button>
			</div>
		</div>
	  </el-form-item>
      <el-form-item
        label="显示输入框"
        v-if="Object.keys(data.options).indexOf('showInput') >= 0"
      >
        <el-switch v-model="data.options.showInput"></el-switch>
      </el-form-item>
      <el-form-item
        label="最小值"
        v-if="
          Object.keys(data.options).indexOf('min') >= 0 && data.type == 'input'
        "
      >
        <el-input
          v-model="data.options.min"
          @input="data.options.min = data.options.min.replace(/[^\-?\d.]/g, '')"
          placeholder="请输入最小值"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="最大值"
        v-if="
          Object.keys(data.options).indexOf('max') >= 0 &&
            data.type == 'input' &&
            data.type != 'checkbox'
        "
      >
        <el-input
          v-model="data.options.max"
          @input="data.options.max = data.options.max.replace(/[^\-?\d.]/g, '')"
          placeholder="请输入最大值"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="最小值"
        v-if="
          Object.keys(data.options).indexOf('min') >= 0 && data.type != 'input'
        "
      >
        <el-input-number
          v-model="data.options.min"
          :max="data.options.max"
          :step="data.options.steps"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="最大值"
        v-if="
          Object.keys(data.options).indexOf('max') >= 0 &&
            data.type != 'input' &&
            data.type != 'checkbox'
        "
      >
        <el-input-number
          v-model="data.options.max"
          :min="data.options.min"
          :step="data.options.steps"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="步长"
        v-if="Object.keys(data.options).indexOf('step') >= 0"
      >
        <el-input-number
          v-model="data.options.step"
          :min="0"
          :max="100"
          :step="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="范围选择" v-if="data.type == 'slider'">
        <el-switch v-model="data.options.range"></el-switch>
      </el-form-item>
      <el-form-item label="显示间断点" v-if="data.type == 'slider'">
        <el-switch v-model="data.options.isShowStops"></el-switch>
      </el-form-item>
      <el-form-item
        label="是否多选"
        v-if="data.type == 'select' || data.type == 'imgupload'"
      >
        <el-switch
          v-model="data.options.multiple"
          @change="handleSelectMuliple"
        ></el-switch>
      </el-form-item>
      <el-form-item label="是否可搜索" v-if="data.type == 'select'">
        <el-switch v-model="data.options.filterable"></el-switch>
      </el-form-item>
      <el-form-item
        label="允许半选"
        v-if="Object.keys(data.options).indexOf('allowHalf') >= 0"
      >
        <el-switch v-model="data.options.allowHalf"></el-switch>
      </el-form-item>
      <el-form-item
        label="支持透明度选择"
        v-if="Object.keys(data.options).indexOf('showAlpha') >= 0"
      >
        <el-switch v-model="data.options.showAlpha"></el-switch>
      </el-form-item>
      <el-form-item
        label="是否显示标签"
        v-if="Object.keys(data.options).indexOf('showLabel') >= 0"
      >
        <el-switch v-model="data.options.showLabel"></el-switch>
      </el-form-item>
      <el-form-item
        label="是否显示评分"
        v-if="Object.keys(data.options).indexOf('options') >= 0"
      >
        <el-switch v-model="data.options.scoreHidden"></el-switch>
      </el-form-item>
      <el-form-item label="显示/隐藏配置条件">
        <el-button
          type="primary"
          icon="el-icon-setting"
          @click="displayRule"
        ></el-button>
      </el-form-item>
      <el-form-item
        label="禁用/启用配置条件"
        v-if="Object.keys(data.options).indexOf('disabledition') >= 0"
      >
        <el-button
          type="warning"
          icon="el-icon-setting"
          @click="displayDisabled"
        ></el-button>
      </el-form-item>
      <el-form-item
        label="选项/数据源配置"
        v-if="Object.keys(data.options).indexOf('options') >= 0"
      >
        <el-button
          type="success"
          icon="el-icon-setting"
          @click="unitsSeting"
          v-if="data.type == 'units'"
        ></el-button>
        <el-button
          type="success"
          icon="el-icon-setting"
          @click="optionSeting"
          v-else
        ></el-button>

        <!-- <el-radio-group v-model="data.options.remote" size="mini" style="margin-bottom:10px;">
          <el-radio-button :label="false">静态数据</el-radio-button>
          <el-radio-button :label="true">动态数据</el-radio-button>
        </el-radio-group>
        <template v-if="data.options.remote">
          <div>
            <el-radio-group v-model="data.options.remoteType">
              <el-radio label="option">赋值变量</el-radio>
              <el-radio label="func">方法函数</el-radio>
            </el-radio-group>
            <el-input
              size="mini"
              v-if="data.options.remoteType == 'option'"
              v-model="data.options.remoteOption"
              style="margin-bottom: 5px;"
            ></el-input>
            <el-input
              size="mini"
              v-if="data.options.remoteType == 'func'"
              v-model="data.options.remoteFunc"
              style="margin-bottom: 5px;"
            ></el-input>
            <el-input size="mini" v-model="data.options.props.value">
              <div style="width: 30px;" slot="prepend">值</div>
            </el-input>
            <el-input size="mini" v-model="data.options.props.label">
              <div slot="prepend" style="width: 30px;">标签</div>
            </el-input>
          </div>
        </template>
        <template v-else>
          <template v-if="data.type=='radio' || (data.type=='select'&&!data.options.multiple)">
            <el-radio-group v-model="data.options.defaultValue">
              <draggable
                tag="ul"
                :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                handle=".drag-item"
              >
                <li v-for="(item, index) in data.options.options" :key="index">
                  <el-radio :label="item.value" style="margin-right: 5px;">
                    <el-input
                      :style="{'width': data.options.showLabel? '90px': '180px' }"
                      size="mini"
                      v-model="item.value"
                    ></el-input>
                    <el-input
                      style="width:90px;"
                      size="mini"
                      v-if="data.options.showLabel"
                      v-model="item.label"
                    ></el-input>
                    <input v-model="item.value"/>
                  </el-radio>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;">
                    <i class="iconfont icon-icon_bars"></i>
                  </i>
                  <el-button
                    @click="handleOptionsRemove(index)"
                    circle
                    plain
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    style="padding: 4px;margin-left: 5px;"
                  ></el-button>
                </li>
              </draggable>
            </el-radio-group>
          </template>

          <template v-if="data.type=='checkbox' || (data.type=='select' && data.options.multiple)">
            <el-checkbox-group v-model="data.options.defaultValue">
              <draggable
                tag="ul"
                :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                handle=".drag-item"
              >
                <li v-for="(item, index) in data.options.options" :key="index">
                  <el-checkbox :label="item.value" style="margin-right: 5px;">
                    <el-input
                      :style="{'width': data.options.showLabel? '90px': '180px' }"
                      size="mini"
                      v-model="item.value"
                    ></el-input>
                    <el-input
                      style="width:90px;"
                      size="mini"
                      v-if="data.options.showLabel"
                      v-model="item.label"
                    ></el-input>
                  </el-checkbox>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;">
                    <i class="iconfont icon-icon_bars"></i>
                  </i>
                  <el-button
                    @click="handleOptionsRemove(index)"
                    circle
                    plain
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    style="padding: 4px;margin-left: 5px;"
                  ></el-button>
                </li>
              </draggable>
            </el-checkbox-group>
          </template>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddOption">添加选项</el-button>
          </div>
        </template>-->
      </el-form-item>

      <el-form-item label="动态数据" v-if="data.type == 'cascader'">
        <div>
          <el-radio-group v-model="data.options.remoteType">
            <el-radio label="option">赋值变量</el-radio>
            <el-radio label="func">方法函数</el-radio>
          </el-radio-group>
          <el-input
            size="mini"
            v-if="data.options.remoteType == 'option'"
            v-model="data.options.remoteOption"
            style="margin-bottom: 5px;"
          ></el-input>
          <el-input
            size="mini"
            v-if="data.options.remoteType == 'func'"
            v-model="data.options.remoteFunc"
            style="margin-bottom: 5px;"
          ></el-input>
          <el-input size="mini" style v-model="data.options.props.value">
            <template slot="prepend">值</template>
          </el-input>
          <el-input size="mini" style v-model="data.options.props.label">
            <template slot="prepend">标签</template>
          </el-input>
          <el-input size="mini" style v-model="data.options.props.children">
            <template slot="prepend">子选项</template>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item
        label="常量"
        v-if="Object.keys(data.options).indexOf('varid') >= 0"
      >
        <!-- <mk-select
          v-model="data.options.varid"
          url="sysVarInfo_get"
          @change="varidChange"
          label="VARNAME"
          custom="自定义"
          val="VARID"
          :param="param"
          :Auth="{app:'63b1657f3b0747d993d1b8a1a8fed742',mod:'xtcl'}"
        ></mk-select>-->
      </el-form-item>
      <el-form-item
        label="默认值"
        v-if="
          Object.keys(data.options).indexOf('defaultValue') >= 0 &&
            (data.type == 'text' ||
              data.type == 'textarea' ||
              data.type == 'input' ||
              data.type == 'rate' ||
              data.type == 'color' ||
              data.type == 'switch' ||
              data.type == 'html')
        "
      >
        <el-input
          v-if="data.type == 'textarea'"
          :disabled="data.options.disabled"
          type="textarea"
          :rows="5"
          v-model="data.options.defaultValue"
        ></el-input>

        <template v-if="data.type == 'input' || data.type == 'text'">
          <template
            v-if="
              data.options.dataType == 'number' ||
                data.options.dataType == 'integer' ||
                data.options.dataType == 'float'
            "
          >
            <el-input
              :type="data.options.dataType"
              :min="data.options.min"
              :max="data.options.max"
              v-model.number="data.options.defaultValue"
            ></el-input>
          </template>
          <template v-else>
            <el-input
              v-model="data.options.defaultValue"
              :disabled="data.options.disabled"
            ></el-input>
          </template>
        </template>
        <el-rate
          v-if="data.type == 'rate'"
          style="display:inline-block;vertical-align: middle;"
          :max="data.options.max"
          :allow-half="data.options.allowHalf"
          v-model="data.options.defaultValue"
        ></el-rate>
        <el-button
          type="text"
          v-if="data.type == 'rate'"
          style="display:inline-block;vertical-align: middle;margin-left: 10px;"
          @click="data.options.defaultValue = 0"
          >清空</el-button
        >
        <el-color-picker
          v-if="data.type == 'color'"
          v-model="data.options.defaultValue"
          :show-alpha="data.options.showAlpha"
        ></el-color-picker>
        <el-switch
          v-if="data.type == 'switch'"
          v-model="data.options.defaultValue"
        ></el-switch>

        <template v-if="data.type == 'html'">
          <!-- <div id="codeeditor" style="height: 100px; width: 100%;">{{data.options.defaultValue}}</div> -->
          <code-editor
            :key="data.key"
            v-model="data.options.defaultValue"
            height="200px"
          ></code-editor>
        </template>
      </el-form-item>
      <el-form-item label="文本属性" v-if="data.type == 'text'">
        <div
          style="display:flex;align-items: center;justify-content: space-between;"
        >
          <div style="display:flex;align-items: center;">
            <span class="demonstration" style="font-size:12px;margin-right:6px;"
              >文字颜色</span
            >
            <el-color-picker
              v-model="data.options.styleObject.color"
              size="mini"
            ></el-color-picker>
          </div>
          <div style="display:flex;align-items: center;">
            <el-checkbox
              v-model="data.options.styleObject.fontWeight"
              true-label="bold"
              false-label="normal"
              >是否加粗</el-checkbox
            >
          </div>
        </div>
        <div
          style="display:flex;align-items: center;justify-content: space-between;"
        >
          <div style="display:flex;align-items: center;">
            <span style="font-size:12px;margin-right:6px;">文字大小</span>
            <div style="width:100px;">
              <el-input-number
                size="mini"
                v-model="data.options.styleObject.fontSize"
              ></el-input-number>
            </div>
          </div>
        </div>
        <div
          style="display:flex;align-items: center;justify-content: space-between;"
        >
          <div style="display:flex;align-items: center;">
            <span style="font-size:12px;margin-right:6px;">文字修饰</span>
            <div style="width:130px;">
              <el-select
                v-model="data.options.styleObject.textDecoration"
                placeholder="请选择"
                size="mini"
              >
                <el-option key="none" label="无" value="none"></el-option>
                <el-option
                  key="underline"
                  label="下划线"
                  value="underline"
                ></el-option>
                <el-option
                  key="overline"
                  label="上划线"
                  value="overline"
                ></el-option>
                <el-option
                  key="line-through"
                  label="穿过文本"
                  value="line-through"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div
          style="display:flex;align-items: center;justify-content: space-between;"
        >
          <div style="display:flex;align-items: center;">
            <span style="font-size:12px;margin-right:6px;">对齐方式</span>
            <div style="width:130px;">
              <el-select
                v-model="data.options.styleObject.textAlign"
                placeholder="请选择"
                size="mini"
              >
                <el-option key="left" label="左对齐" value="left"></el-option>
                <el-option key="right" label="右对齐" value="right"></el-option>
                <el-option key="center" label="居中" value="center"></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-form-item>
      <template v-if="data.type == 'time' || data.type == 'date'">
        <el-form-item label="显示类型" v-if="data.type == 'date'">
          <el-select v-model="data.options.type">
            <el-option value="year"></el-option>
            <el-option value="month"></el-option>
            <el-option value="date"></el-option>
            <el-option value="dates"></el-option>
            <!-- <el-option value="week"></el-option> -->
            <el-option value="datetime"></el-option>
            <el-option value="datetimerange"></el-option>
            <el-option value="daterange"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否为范围选择" v-if="data.type == 'time'">
          <el-switch v-model="data.options.isRange"></el-switch>
        </el-form-item>
        <el-form-item
          label="日期选择不能大于当前系统的日期"
          v-if="data.type == 'date'"
        >
          <el-switch v-model="data.options.daterange"></el-switch>
        </el-form-item>
        <el-form-item label="否默认当前系统日期" v-if="data.type == 'date'">
          <el-switch v-model="data.options.isnowdate"></el-switch>
        </el-form-item>
        <el-form-item label="是否获取时间戳" v-if="data.type == 'date'">
          <el-switch v-model="data.options.timestamp"></el-switch>
        </el-form-item>
        <el-form-item
          label="占位内容"
          v-if="
            (!data.options.isRange && data.type == 'time') ||
              (data.type != 'time' &&
                data.options.type != 'datetimerange' &&
                data.options.type != 'daterange')
          "
        >
          <el-input v-model="data.options.placeholder"></el-input>
        </el-form-item>
        <el-form-item
          label="开始时间占位内容"
          v-if="
            data.options.isRange ||
              data.options.type == 'datetimerange' ||
              data.options.type == 'daterange'
          "
        >
          <el-input v-model="data.options.startPlaceholder"></el-input>
        </el-form-item>
        <el-form-item
          label="结束时间占位内容"
          v-if="
            data.options.isRange ||
              data.options.type == 'datetimerange' ||
              data.options.type == 'daterange'
          "
        >
          <el-input v-model="data.options.endPlaceholder"></el-input>
        </el-form-item>
        <el-form-item label="格式">
          <el-input v-model="data.options.format"></el-input>
        </el-form-item>
        <el-form-item
          label="默认值"
          v-if="
            data.type == 'time' &&
              Object.keys(data.options).indexOf('isRange') >= 0
          "
        >
          <el-time-picker
            key="1"
            style="width: 100%;"
            v-if="!data.options.isRange"
            v-model="data.options.defaultValue"
            :arrowControl="data.options.arrowControl"
            :value-format="data.options.format"
          ></el-time-picker>
          <el-time-picker
            key="2"
            v-if="data.options.isRange"
            style="width: 100%;"
            v-model="data.options.defaultValue"
            is-range
            :arrowControl="data.options.arrowControl"
            :value-format="data.options.format"
          ></el-time-picker>
        </el-form-item>
      </template>

      <template v-if="data.type == 'imgupload'">
        <el-form-item label="最大上传数">
          <el-input
            type="number"
            v-model.number="data.options.limit"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="使用七牛上传">
          <el-switch v-model="data.options.isQiniu"></el-switch>
        </el-form-item>-->
        <!-- <template v-if="data.options.isQiniu">
          <el-form-item label="Domain" :required="true">
            <el-input v-model="data.options.domain"></el-input>
          </el-form-item>
          <el-form-item label="获取七牛Token方法" :required="true">
            <el-input v-model="data.options.tokenFunc"></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="图片上传地址" :required="true">
            <el-input v-model="data.options.action"></el-input>
          </el-form-item>
        </template>-->
      </template>

      <template v-if="data.type == 'fileupload'">
        <el-form-item label="最大上传数">
          <el-input
            type="number"
            v-model.number="data.options.limit"
          ></el-input>
        </el-form-item>
        <el-form-item label="提示说明文字">
          <el-input v-model="data.options.tip"></el-input>
        </el-form-item>
        <!-- <el-form-item label="上传地址" :required="true">
          <el-input v-model="data.options.action"></el-input>
        </el-form-item>-->
      </template>

      <template v-if="data.type == 'blank'">
        <el-form-item label="绑定数据类型">
          <el-select v-model="data.options.defaultType">
            <el-option value="String" label="字符串"></el-option>
            <el-option value="Object" label="对象"></el-option>
            <el-option value="Array" label="数组"></el-option>
          </el-select>
        </el-form-item>
      </template>

      <template v-if="data.type == 'grid' || data.type == 'rowmatrix'">
        <el-form-item label="栅格间隔">
          <el-input
            type="number"
            v-model.number="data.options.gutter"
          ></el-input>
        </el-form-item>
        <el-form-item label="列配置项">
          <draggable
            tag="ul"
            :list="data.columns"
            v-bind="{
              group: { name: 'options' },
              ghostClass: 'ghost',
              handle: '.drag-item'
            }"
            handle=".drag-item"
          >
            <li v-for="(item, index) in data.columns" :key="index">
              <i
                class="drag-item"
                style="font-size: 16px;margin: 0 5px;cursor: move;"
              >
                <i class="iconfont icon-icon_bars"></i>
              </i>
              <el-input
                placeholder="栅格值"
                size="mini"
                style="width: 100px;"
                type="number"
                v-model.number="item.span"
              ></el-input>

              <el-button
                @click="handleOptionsRemove(index)"
                circle
                plain
                type="danger"
                size="mini"
                icon="el-icon-minus"
                style="padding: 4px;margin-left: 5px;"
              ></el-button>
            </li>
          </draggable>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddColumn">添加列</el-button>
          </div>
        </el-form-item>
        <el-form-item label="水平排列方式">
          <el-select v-model="data.options.justify">
            <el-option value="start" label="左对齐"></el-option>
            <el-option value="end" label="右对齐"></el-option>
            <el-option value="center" label="居中"></el-option>
            <el-option value="space-around" label="两侧间隔相等"></el-option>
            <el-option value="space-between" label="两端对齐"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="垂直排列方式">
          <el-select v-model="data.options.align">
            <el-option value="top" label="顶部对齐"></el-option>
            <el-option value="middle" label="居中"></el-option>
            <el-option value="bottom" label="底部对齐"></el-option>
          </el-select>
        </el-form-item>
      </template>

      <template v-if="data.type == 'tabs'">
        <el-form-item label="风格类型">
          <el-radio-group v-model="data.options.type">
            <el-radio-button label>默认</el-radio-button>
            <el-radio-button label="card">选项卡</el-radio-button>
            <el-radio-button label="border-card">卡片化</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选项卡位置">
          <el-radio-group v-model="data.options.tabPosition">
            <el-radio-button label="top">顶部</el-radio-button>
            <el-radio-button label="left">左侧</el-radio-button>
            <el-radio-button label="right">右侧</el-radio-button>
            <el-radio-button label="bottom">底部</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标签配置项">
          <draggable
            tag="ul"
            :list="data.tabs"
            v-bind="{
              group: { name: 'options' },
              ghostClass: 'ghost',
              handle: '.drag-item'
            }"
            handle=".drag-item"
          >
            <li v-for="(item, index) in data.tabs" :key="index">
              <i
                class="drag-item"
                style="font-size: 16px;margin: 0 5px;cursor: move;"
              >
                <i class="iconfont icon-icon_bars"></i>
              </i>
              <el-input
                placeholder="标签名称"
                size="mini"
                style="width: 200px;"
                v-model="item.label"
              ></el-input>

              <el-button
                @click="handleOptionsRemove(index)"
                circle
                plain
                type="danger"
                size="mini"
                icon="el-icon-minus"
                style="padding: 4px;margin-left: 5px;"
              ></el-button>
            </li>
          </draggable>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddTab">添加标签</el-button>
          </div>
        </el-form-item>
      </template>
      <!-- v-if="Object.keys(data.options).includes('customClass')" -->
      <el-form-item
        label="自定义Class"
        v-if="data.type == 'grid' || data.type == 'rowmatrix'"
      >
        <el-select v-model="data.options.customClass" placeholder="请选择">
          <el-option key label="无" value></el-option>
          <el-option
            key="border-form"
            label="添加描边"
            value="border-form"
          ></el-option>
        </el-select>
        <!-- <el-input v-model="data.options.customClass" clearable></el-input> -->
      </el-form-item>

      <el-form-item label="操作属性">
<!--        <el-checkbox
          v-model="data.options.dataBind"
          v-if="Object.keys(data.options).indexOf('dataBind')>=0 && !data.options.tableColumn"
        >数据绑定</el-checkbox> -->

        <el-checkbox
          v-model="data.options.hidden"
          v-if="
            Object.keys(data.options).indexOf('hidden') >= 0 &&
              !data.options.tableColumn
          "
          >隐藏</el-checkbox
        >
        <el-checkbox
          v-model="data.options.readonly"
          v-if="Object.keys(data.options).indexOf('readonly') >= 0"
          >完全只读</el-checkbox
        >
        <el-checkbox
          v-model="data.options.disabled"
          v-if="
            Object.keys(data.options).indexOf('disabled') >= 0 &&
              data.type != 'score'
          "
          >禁用</el-checkbox
        >
        <el-checkbox
          v-model="data.options.editable"
          v-if="Object.keys(data.options).indexOf('editable') >= 0"
          >文本框可输入</el-checkbox
        >
        <el-checkbox
          v-model="data.options.clearable"
          v-if="Object.keys(data.options).indexOf('clearable') >= 0"
          >显示清除按钮</el-checkbox
        >
        <el-checkbox
          v-model="data.options.arrowControl"
          v-if="Object.keys(data.options).indexOf('arrowControl') >= 0"
          >使用箭头进行时间选择</el-checkbox
        >
        <el-checkbox
          v-model="data.options.isDelete"
          v-if="Object.keys(data.options).indexOf('isDelete') >= 0"
          >删除</el-checkbox
        >
        <el-checkbox
          v-model="data.options.isEdit"
          v-if="Object.keys(data.options).indexOf('isEdit') >= 0"
          >编辑</el-checkbox
        >
        <el-checkbox
          v-model="data.options.showPassword"
          v-if="Object.keys(data.options).indexOf('showPassword') >= 0"
          >显示密码</el-checkbox
        >
        <el-checkbox
          v-model="data.options.showScore"
          v-if="
            Object.keys(data.options).indexOf('showScore') >= 0 &&
              data.type != 'score'
          "
          >显示分数</el-checkbox
        >
      </el-form-item>

      <template v-if="data.type != 'grid' && data.type != 'tabs'">
        <el-form-item label="校验" v-if="!data.options.tableColumn">
          <div v-if="Object.keys(data.options).indexOf('required') >= 0">
            <el-checkbox v-model="data.options.required">必填</el-checkbox>
          </div>
		  <div style="color: #606266;">是否启用数字键盘(仅支持移动端)</div>
          <el-select
            v-if="Object.keys(data.options).indexOf('dataType')>=0"
            v-model="data.options.dataType"
           
          >
            <el-option value="string" label="否"></el-option>
            <el-option value="number" label="是"></el-option>
    <!--        <el-option value="boolean" label="布尔值"></el-option>
            <el-option value="integer" label="整数"></el-option>
            <el-option value="float" label="浮点数"></el-option>
            <el-option value="url" label="URL地址"></el-option>
            <el-option value="email" label="邮箱地址"></el-option>
            <el-option value="hex" label="十六进制"></el-option> -->
          </el-select>
		<div style="color: #606266;">正则表达式</div>
          <div v-if="Object.keys(data.options).indexOf('pattern') >= 0">
            <!-- <el-input
              size="mini"
              v-model.lazy="data.options.pattern"
              style=" width: 240px;"
              placeholder="自定义正则表达式"
            ></el-input>-->
            <!-- <el-select v-if="data.type != 'units'" size="mini" v-model="pattern" @change="changePattern" :disabled="!data.options.required" filterable placeholder="请选择效验规则">
              <el-option
                v-for="item in patternList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>-->
            <!-- :disabled="!data.options.required" -->
            <el-autocomplete
				style="width: 100%;"
              v-if="data.type != 'units'"
              popper-class="my-autocomplete"
              value-key="value"
              v-model="data.options.pattern"
              :fetch-suggestions="querySearch"
              clearable
              select-when-unmatched
              placeholder="可以自定义正则表达式"
              @select="changePattern"
            >
              <i class="el-icon-edit el-input__icon" slot="suffix"></i>
              <template slot-scope="{ item }">
                <div class="name">{{ item.label }}</div>
              </template>
            </el-autocomplete>
            <el-select
              v-else
              size="mini"
              v-model="data.options.validator"
              :disabled="!data.options.required"
              filterable
              placeholder="请选择效验规则"
            >
              <el-option
                v-for="item in patternList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
      </template>
    </el-form>
    <!-- 选项设置 -->
    <vxe-modal
      v-model="Modal"
      width="1000"
      height="640"
      ref="xModal"
      :showFooter="true"
      min-width="400"
      min-height="400"
      resize
    >
      <div slot="header">选项设置</div>
      <el-container>
        <el-header>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="请选择数据源">
              <el-radio-group v-model="SCORETYPE" @change="scopetypeChange">
                <el-radio :label="0">非评分类</el-radio>
                <el-radio :label="1">评分类</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label>
              <el-select
                v-model="SOURCEID"
                filterable
                :filter-method="filterSearch"
                :clearable="true"
                placeholder="请选择数据源"
              >
                <!-- liqian 2020/06/16 大写改成小写sourceid /sourcekey/sourceid-->
                <el-option
                  v-for="item in sourceData"
                  :key="item.sourceid"
                  :label="item.sourcekey"
                  :value="item.sourceid"
                >
                  <div @click="sourceidEvtClick(item)">
                    {{ item.sourcekey }}
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-header>
        <el-main>
          <el-table
            height="380"
            :data="curOptionData.options"
            stripe
            style="width: 100%"
          >
            <el-table-column
              prop
              align="center"
              label="默认值"
              width="80"
              v-if="data.type == 'radio' || data.type == 'select'"
            >
              <template slot-scope="scope">
                <el-radio
                  @click.native.prevent="clickitem(scope.row.value)"
                  :label="scope.row.value"
                  v-model="radioDefaultValue"
                  >&nbsp;</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column
              prop
              align="center"
              label="默认值"
              width="80"
              v-if="data.type == 'checkbox'"
            >
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.checked"
                  @change="checkboxChange($event, scope.row, scope.$index)"
                  >&nbsp;</el-checkbox
                >
              </template>
            </el-table-column>
            <el-table-column prop label="选项值" width="120">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.value"
                  placeholder="请输入值"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop label="选项内容" width>
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.label"
                  placeholder="选项内容"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop align="center" label="补充输入框" width="120">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.inputbox"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop align="center" label="高级设置">
              <el-table-column
                prop
                label="这是积分题"
                align="center"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number
                    style="width:100%;"
                    controls-position="right"
                    :disabled="SCORETYPE == 0 ? true : false"
                    v-model="scope.row.SCORE"
                  ></el-input-number>
                </template>
              </el-table-column>
              <!-- <el-table-column
                    prop=""
                    label="特殊设置"
                    width="120">
              </el-table-column>-->
              <el-table-column prop label align="center" width="100">
                <template slot="header">
                  <el-button type="primary" @click="handleAddOption"
                    >添加</el-button
                  >
                </template>
                <template slot-scope="scope">
                  <el-button
                    @click="handleOptionsRemove(scope.$index)"
                    circle
                    plain
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    style="padding: 4px;margin-left: 5px;"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
      <div slot="footer">
        <el-button type="success" @click="SaveOptions">确认</el-button>
        <el-button type="danger" @click="CloseOption">取消</el-button>
      </div>
    </vxe-modal>

    <!-- 单位设置 -->
    <vxe-modal
      v-model="unitsModal"
      width="736"
      height="600"
      ref="unitsModal"
      :showFooter="true"
      min-width="400"
      min-height="400"
      resize
    >
      <div slot="header">单位设置</div>
      <el-container>
        <el-header>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="请选择数据源">
              <el-select
                v-model="SOURCEID"
                filterable
                :filter-method="filterSearch"
                :clearable="true"
                placeholder="请选择数据源"
              >
                <el-option
                  v-for="item in sourceData"
                  :key="item.sourceid"
                  :label="item.sourcekey"
                  :value="item.sourceid"
                >
                  <div @click="sourceidEvtClick(item)">
                    {{ item.sourcekey }}
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-header>
        <el-main style="padding:0;">
          <el-table
            height="380"
            :data="curUnitsOptionData.options"
            stripe
            style="width: 100%"
          >
            <el-table-column prop align="center" label="默认值" width="80">
              <template slot-scope="scope">
                <el-radio
                  @click.native.prevent="clickitem(scope.row.value)"
                  :label="scope.row.value"
                  v-model="radioDefaultValue"
                  >&nbsp;</el-radio
                >
              </template>
            </el-table-column>
            <!--李倩 2020/6/16 value=>cVALUE -->
            <el-table-column
              prop="cVALUE"
              align="center"
              label="*单位"
              width="200"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.value"
                  @input="scope.row.label = scope.row.value"
                  placeholder="请输入单位"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop align="center" label="值域范围">
              <el-table-column prop align="center" label="起始值" width="160">
                <template slot-scope="scope">
                  <el-input-number
                    style="width:100%;"
                    controls-position="right"
                    v-model="scope.row.BEGINVAL"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop align="center" label="截止值" width="160">
                <template slot-scope="scope">
                  <el-input-number
                    style="width:100%;"
                    controls-position="right"
                    v-model="scope.row.ENDVAL"
                  ></el-input-number>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop label align="center" width="100">
              <template slot="header">
                <el-button type="primary" @click="handleAddOption"
                  >添加</el-button
                >
              </template>
              <template slot-scope="scope">
                <el-button
                  @click="handleOptionsRemove(scope.$index)"
                  circle
                  plain
                  type="danger"
                  size="mini"
                  icon="el-icon-minus"
                  style="padding: 4px;margin-left: 5px;"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
      <div slot="footer">
        <el-button type="success" @click="saveUnitsOption">确认</el-button>
        <el-button type="danger" @click="closeUnitsOption">取消</el-button>
      </div>
    </vxe-modal>
    <!-- 显示条件设置 -->
    <display-rule
      @change="handelDisplayRule"
      :list="list"
      :data="data"
      :visible.sync="displayRuleModal"
      v-if="displayRuleModal"
    ></display-rule>
    <!-- 禁用启用条件设置 -->
    <display-disabled
      @change="handelDisplayDisabled"
      :list="list"
      :data="data"
      :visible.sync="displayDisabledModel"
      v-if="displayDisabledModel"
    ></display-disabled>
	<!-- 脚本设置 -->
	<scriptModal 
	:data="data"
	:visible.sync="scriptModal"
	v-if="scriptModal"
	></scriptModal>
    <!-- 矩阵行设置 -->
    <vxe-modal
      v-model="matrixModal"
      width="660"
      height="600"
      ref="matrixModal"
      :showFooter="true"
      min-width="400"
      min-height="400"
      resize
    >
      <div slot="header">行标签 设置</div>
      <el-container>
        <el-main>
          <el-table
            height="380"
            :data="curMatrixOptionData.rows"
            stripe
            style="width: 100%"
          >
            <el-table-column
              prop="value"
              align="center"
              label="*编号"
              width="100"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.value"
                  placeholder="请输入编号"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop
              align="center"
              label="*行标签内容"
              width="300"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.label"
                  placeholder="请输入行标签内容"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop label align="center" width="100">
              <template slot="header">
                <el-button type="primary" @click="handleAddOption"
                  >添加</el-button
                >
              </template>
              <template slot-scope="scope">
                <el-button
                  @click="handleOptionsRemove(scope.$index)"
                  circle
                  plain
                  type="danger"
                  size="mini"
                  icon="el-icon-minus"
                  style="padding: 4px;margin-left: 5px;"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
      <div slot="footer">
        <el-button type="success" @click="saveMatrixOption">确认</el-button>
        <!-- <el-button type="danger" @click="closeMatrixOption">取消</el-button> -->
      </div>
    </vxe-modal>
  </div>
  <div v-else class="empty">
    <div style="position: relative;;top:-100px;">
      <img
        style="width:120px;height:100px;"
        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE1MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQgMzEuNjcpIj4KICAgICAgPGVsbGlwc2UgZmlsbC1vcGFjaXR5PSIuOCIgZmlsbD0iI0Y1RjVGNyIgY3g9IjY3Ljc5NyIgY3k9IjEwNi44OSIgcng9IjY3Ljc5NyIgcnk9IjEyLjY2OCIvPgogICAgICA8cGF0aCBkPSJNMTIyLjAzNCA2OS42NzRMOTguMTA5IDQwLjIyOWMtMS4xNDgtMS4zODYtMi44MjYtMi4yMjUtNC41OTMtMi4yMjVoLTUxLjQ0Yy0xLjc2NiAwLTMuNDQ0LjgzOS00LjU5MiAyLjIyNUwxMy41NiA2OS42NzR2MTUuMzgzaDEwOC40NzVWNjkuNjc0eiIgZmlsbD0iI0FFQjhDMiIvPgogICAgICA8cGF0aCBkPSJNMTAxLjUzNyA4Ni4yMTRMODAuNjMgNjEuMTAyYy0xLjAwMS0xLjIwNy0yLjUwNy0xLjg2Ny00LjA0OC0xLjg2N0gzMS43MjRjLTEuNTQgMC0zLjA0Ny42Ni00LjA0OCAxLjg2N0w2Ljc2OSA4Ni4yMTR2MTMuNzkyaDk0Ljc2OFY4Ni4yMTR6IiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMy41NikiLz4KICAgICAgPHBhdGggZD0iTTMzLjgzIDBoNjcuOTMzYTQgNCAwIDAgMSA0IDR2OTMuMzQ0YTQgNCAwIDAgMS00IDRIMzMuODNhNCA0IDAgMCAxLTQtNFY0YTQgNCAwIDAgMSA0LTR6IiBmaWxsPSIjRjVGNUY3Ii8+CiAgICAgIDxwYXRoIGQ9Ik00Mi42NzggOS45NTNoNTAuMjM3YTIgMiAwIDAgMSAyIDJWMzYuOTFhMiAyIDAgMCAxLTIgMkg0Mi42NzhhMiAyIDAgMCAxLTItMlYxMS45NTNhMiAyIDAgMCAxIDItMnpNNDIuOTQgNDkuNzY3aDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI0SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjR6TTQyLjk0IDYxLjUzaDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI1SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjV6TTEyMS44MTMgMTA1LjAzMmMtLjc3NSAzLjA3MS0zLjQ5NyA1LjM2LTYuNzM1IDUuMzZIMjAuNTE1Yy0zLjIzOCAwLTUuOTYtMi4yOS02LjczNC01LjM2YTcuMzA5IDcuMzA5IDAgMCAxLS4yMjItMS43OVY2OS42NzVoMjYuMzE4YzIuOTA3IDAgNS4yNSAyLjQ0OCA1LjI1IDUuNDJ2LjA0YzAgMi45NzEgMi4zNyA1LjM3IDUuMjc3IDUuMzdoMzQuNzg1YzIuOTA3IDAgNS4yNzctMi40MjEgNS4yNzctNS4zOTNWNzUuMWMwLTIuOTcyIDIuMzQzLTUuNDI2IDUuMjUtNS40MjZoMjYuMzE4djMzLjU2OWMwIC42MTctLjA3NyAxLjIxNi0uMjIxIDEuNzg5eiIgZmlsbD0iI0RDRTBFNiIvPgogICAgPC9nPgogICAgPHBhdGggZD0iTTE0OS4xMjEgMzMuMjkybC02LjgzIDIuNjVhMSAxIDAgMCAxLTEuMzE3LTEuMjNsMS45MzctNi4yMDdjLTIuNTg5LTIuOTQ0LTQuMTA5LTYuNTM0LTQuMTA5LTEwLjQwOEMxMzguODAyIDguMTAyIDE0OC45MiAwIDE2MS40MDIgMCAxNzMuODgxIDAgMTg0IDguMTAyIDE4NCAxOC4wOTdjMCA5Ljk5NS0xMC4xMTggMTguMDk3LTIyLjU5OSAxOC4wOTctNC41MjggMC04Ljc0NC0xLjA2Ni0xMi4yOC0yLjkwMnoiIGZpbGw9IiNEQ0UwRTYiLz4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0OS42NSAxNS4zODMpIiBmaWxsPSIjRkZGIj4KICAgICAgPGVsbGlwc2UgY3g9IjIwLjY1NCIgY3k9IjMuMTY3IiByeD0iMi44NDkiIHJ5PSIyLjgxNSIvPgogICAgICA8cGF0aCBkPSJNNS42OTggNS42M0gwTDIuODk4LjcwNHpNOS4yNTkuNzA0aDQuOTg1VjUuNjNIOS4yNTl6Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
        alt
      />
      <div>拖拽字段进行配置</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Draggable from "vuedraggable";
import CodeEditor from "../components/CodeEditor";
import displayRule from "./modal/displayrule";
import displayDisabled from "./modal/displaydisabled";
import scriptModal from './modal/script.vue'
import api from "@/api";

export default {
  components: {
    Draggable,
    CodeEditor,
    displayRule,
    displayDisabled,
	scriptModal
  },
  props: ["data", "list"],
  data() {
    return {
      flag: true,
      models: {},
      ScoreOptionsList: [], //储存服务器评分
      patternList: [
        {
          label: "必须一位小数(正)",
          value: "/^(([1-9]{1}\\d*)|(0{1}))(\\.\\d{1})$/"
        },
        {
          label: "必须两位小数(正)",
          value: "/^(([1-9]{1}\\d*)|(0{1}))(\\.\\d{2})$/"
        },
        {
          label: "必须三位小数(正)",
          value: "/^(([1-9]{1}\\d*)|(0{1}))(\\.\\d{3})$/"
        },
        {
          label: "必须四位小数(正)",
          value: "/^(([1-9]{1}\\d*)|(0{1}))(\\.\\d{4})$/"
        },
        {
          label: "最多一位小数(正)",
          value: "/^(([1-9]{1}\\d*)|(0{1}))(\\.\\d{1,1})?$/"
        },
        {
          label: "最多两位小数(正)",
          value: "/^(([1-9]{1}\\d*)|(0{1}))(\\.\\d{1,2})?$/"
        },
        {
          label: "最多三位小数(正)",
          value: "/^(([1-9]{1}\\d*)|(0{1}))(\\.\\d{1,3})?$/"
        },
        {
          label: "最多四位小数(正)",
          value: "/^(([1-9]{1}\\d*)|(0{1}))(\\.\\d{1,4})?$/"
        },
        {
          label: "正整数",
          value: "/^[1-9]\\d*$/"
        },
		{
		  label: "必须一位小数(负)",
		  value: "/^-?\\d+\\.?\\d{1}$/"
		},
		{
		  label: "必须两位小数(负)",
		  value: "/^-?\\d+\\.?\\d{2}$/"
		},
		{
		  label: "必须三位小数(负)",
		  value: "/^-?\\d+\\.?\\d{3}$/"
		},
		{
		  label: "必须四位小数(负)",
		  value: "/^-?\\d+\\.?\\d{4}$/"
		},
		{
		  label: "最多一位小数(负)",
		  value: "/^-?\\d+\\.?\\d{0,1}$/"
		},
		{
		  label: "最多两位小数(负)",
		  value: "/^-?\\d+\\.?\\d{0,2}$/"
		},
		{
		  label: "最多三位小数(负)",
		  value: "/^-?\\d+\\.?\\d{0,3}$/"
		},
		{
		  label: "最多四位小数(负)",
		  value: "/^-?\\d+\\.?\\d{0,4}$/"
		},
        {
          label: "邮箱",
          value: "/^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$/"
        },
        {
          label: "手机号码",
          value:
            "/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8]|18[0|1|2|3|5|6|7|8|9])\\d{8}$/"
        },
        {
          label: "身份证号码",
          value:
            "/^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/"
        }
      ],
      param: {
        count: 0,
        page: 1,
        rows: 10000,
        CONDITION: ""
      }, //常量参数
      key: new Date().getTime(),
      displayRuleModal: false, //显示规则弹窗
      displayDisabledModel: false, //禁用/启用规则弹窗
	  scriptModal:false,//脚本弹窗
      cognateValue: [], //评分控件之间的关联
      cognateScores: [], //只存储radio checkbox select 控件
      btnState: false,
      SOURCEKEY: "", //数据源名称
      radioDefaultValue: "", //单选默认值
      checkboxDefaultValue: [], //多选默认值
      Auth: {
        CRFSource: {
          mod: "crfssy",
          app: "63b1657f3b0747d993d1b8a1a8fed742"
        }
      },
      curOptionData: [], //临时选项载体载体
      curUnitsOptionData: [], //临时单位控件数据载体
      curMatrixOptionData: [], //临时行矩阵数据载体
      sourceData: [],
      sourceList: [], //数据源列表
      SCORETYPE: "", //评分类型//0非评分 1评分 2测量值
      Modal: false, //选项设置弹窗状态
      unitsModal: false, //单位设置弹窗状态
      matrixModal: false, //行矩阵弹窗状态
      SOURCEID: "", //数据源id
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null
      }
    };
  },
  computed: {
    ...mapState("d2admin/ecrf", ["rateOptions", "crfid"]),
    ...mapState("d2admin/user", ["info"]),
    show() {
      if (this.data && Object.keys(this.data).length > 0) {
        return true;
      }
      return false;
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      //根据CRFID获取评分
      this.GetScoreOptions();
      this.$on("onChangeModels", function(val) {

        let scopeList = [];
        let scoreoptionlist = {};
        let obj = {};
        let rateOptionsList= [];
        for (let key in val) {
          scopeList.push(val[key]);
        }
        scoreoptionlist = {...this.ScoreOptionsList, ...scopeList};
        if(scoreoptionlist.length>0){
          rateOptionsList = scoreoptionlist.reduce((cur, next) => {
          obj[next.model] ? "" : (obj[next.model] = true && cur.push(next));
          return cur;
        }, []);
        }

        this.rateOptionsSet(rateOptionsList);
        this.flag = true;
      });
    });
  },
  methods: {
    ...mapActions("d2admin/ecrf", ["rateOptionsSet"]),
		uploadSectionFile: function(params) {
			// 自定义上传方法
			// console.log(params);
			var that = this,
				file = params.file, //获取上传的文件
				fileType = file.type, //获取文件类型
				isImage = fileType.indexOf('image') != -1; // 判断是否是图片类型
		
		
			if (!isImage) { // 文件格式
				alert("请选择图片文件！");
				that.$refs.upload_img_[type].uploadFiles = []; //不符合就清空已选择的图片
				return;
			}
			if (isImage) {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = (async (res) => {
					let Base64 = res.target.result
					let base64Arr = ''
					//压缩
					let dealBase64 = await this.dealImage(Base64, 750)
					if (dealBase64.includes('data:image/png;base64,')) {
						base64Arr = dealBase64.replace('data:image/png;base64,', '')
					} else {
						base64Arr = dealBase64.replace('data:image/jpeg;base64,', '')
					}
					let result = await this.uploadFile(base64Arr);
					if (result.code == 0) {
						let file = result.data[0];
						let url = this.publicUrl + '/CRFBG/' + file;
						this.data.options.defaultValue = url;
					}
				})
		
			}
		},
		uploadFile(base64Arr) {
			return this.MK.Request('/Publics/Common/UpLoadImags', 'post', {
				base64Arr: [base64Arr],
				fileName: 'CRFBG'
			})
		},
		dealImage(base64, w) {
			return new Promise((resolve, reject) => {
				var newImage = new Image();
				var quality = 0.6; //压缩系数0-1之间
				newImage.src = base64;
				newImage.setAttribute("crossOrigin", 'Anonymous'); //url为外域时需要
				var imgWidth, imgHeight;
				newImage.onload = function() {
					imgWidth = this.width;
					imgHeight = this.height;
					var canvas = document.createElement("canvas");
					var ctx = canvas.getContext("2d");
					if (Math.max(imgWidth, imgHeight) > w) {
						if (imgWidth > imgHeight) {
							canvas.width = w;
							canvas.height = w * imgHeight / imgWidth;
						} else {
							canvas.height = w;
							canvas.width = w * imgWidth / imgHeight;
						}
					} else {
						canvas.width = imgWidth;
						canvas.height = imgHeight;
						quality = 0.6;
					}
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
					var base64 = canvas.toDataURL("image/jpeg", quality); //压缩语句
					// 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
					// while (base64.length / 1024 > 150) {
					// 	quality -= 0.01;
					// 	base64 = canvas.toDataURL("image/jpeg", quality);
					// }
					// 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
					// while (base64.length / 1024 < 50) {
					// 	quality += 0.001;
					// 	base64 = canvas.toDataURL("image/jpeg", quality);
					// }
					resolve(base64); //必须通过回调函数返回，否则无法及时拿到该值
				}
			})
		
		},
	//设置脚本
	setScript(){
		this.scriptModal = true;
	},
    //正则更改事件
    querySearch(queryString, cb) {
      var patternList = this.patternList;
      var results = queryString
        ? patternList.filter(this.createFilter(queryString))
        : patternList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return patternList => {
        return (
          patternList.label.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    //常量更改事件回调
    varidChange(val) {
      if (val.VARID != "") {
        this.data.options.disabled = true;
      } else {
        this.data.options.disabled = false;
      }
      console.log(val);
    },
    changePattern(item) {},
    //根据CRFID获取评分
    GetScoreOptions() {
      const crfid = this.crfid;
      api.ScoreOptions_Get({ crfid }).then(res => {
        this.ScoreOptionsList = res.data;
        this.rateOptionsSet(this.ScoreOptionsList);
      });
    },
    //显示条件设置按钮点击事件
    displayRule() {
      this.displayRuleModal = true;
    },
    //禁用/启用设置按钮点击事件
    displayDisabled() {
      this.displayDisabledModel = true;
    },
    //显示规则数据更改回调
    handelDisplayRule(val) {
      this.data.options.condition = JSON.parse(JSON.stringify(val));
    },
    //禁用/启用规则数据更改回调
    handelDisplayDisabled(val) {
      this.data.options.disabledition = JSON.parse(JSON.stringify(val));
    },
    //评分显示设置
    scoreChange(val) {
      let curOptions = val;
      let NewArr = [];
      for (let i = 0; i < curOptions.length; i++) {
        let data = {
          //条件
          action: "show", //显示 隐藏 评分状态show hiden score
          condition: "", //条件关系 or或 and 并且
          result: [
            {
              //关联表单信息
              action: "eq", //eq等于 ne不等于 gt大于 lt小于 ge大于等于 le 小于等于
              crf_id: "", //节点id
              dataset_id: "", //表单id
              interview_id: curOptions[i], //控件id 即控件字段标识
              options: [], //关联控件的最终值
              type: "radio" //关联控件类型
            }
          ]
        };
        NewArr.push(JSON.parse(JSON.stringify(data)));
      }
      this.data.options.condition = NewArr;
      console.log(val);
      console.log(this.data.options);
    },
    //数据源筛选
    filterSearch(val) {
      if (val !== "") {
        this.sourceData = this.sourceList.filter(item => {
          //支持拼音码,名称检索
          return (
            item.filterstr.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
            item.sourcekey.toLowerCase().indexOf(val.toLowerCase()) > -1
          );
        });
      } else {
        this.sourceData = this.sourceList;
      }
    },
    //矩阵行标签设置
    matrixSeting() {
      this.matrixModal = true;
      this.curMatrixOptionData = JSON.parse(JSON.stringify(this.data.options));
      console.log(this.curMatrixOptionData);
    },
    //单位设置
    unitsSeting() {
      this.unitsModal = true; //弹窗
      this.SOURCEKEY = this.data.name;
      this.curUnitsOptionData = JSON.parse(JSON.stringify(this.data.options));
      this.SOURCEID = this.curUnitsOptionData.sourceid; //设置每个控件对应的数据源
      // this.radioDefaultValue = this.curUnitsOptionData.defaultValue.unit;
      this.CRFSourceType_Get(this.data.options.score);
    },
    //行矩阵确认
    saveMatrixOption() {
      let matrixOptionData = this.curMatrixOptionData;
      if (this.isRepeat(matrixOptionData.rows)) {
        this.$message.error("选项值有重复项");
        return;
      }
      this.data.options = matrixOptionData;
      this.$refs.matrixModal.close();
    },
    //行矩阵取消
    closeMatrixOption() {
      this.$refs.matrixModal.close();
    },
    //确认单位
    saveUnitsOption() {
      let UnitsOptionData = this.curUnitsOptionData;
      this.btnState = true;
      console.log(UnitsOptionData);
      if (this.isRepeat(UnitsOptionData.options)) {
        this.$message.error("选项值有重复项");
        return;
      }
      UnitsOptionData.defaultValue.unit = this.radioDefaultValue;
      UnitsOptionData.sourceid = this.SOURCEID; //储存点击数据源id，获取对应的数据
      this.data.name = this.SOURCEKEY;
      this.data.options = UnitsOptionData;
      this.$refs.unitsModal.close();
    },
    //取消单位设置
    closeUnitsOption() {
      this.$refs.unitsModal.close();
    },
    //选项设置
    optionSeting() {
      if (this.show) {
        this.btnState = true;
        this.SOURCEKEY = this.data.name;
        this.checkboxDefaultValue = [];
        if (this.data.type == "radio" || this.data.type == "select") {
          //清空单选和下拉选项设置的默认值
          this.radioDefaultValue = JSON.parse(
            JSON.stringify(this.data.options.defaultValue.value)
          ); //设置选项单选默认值
        }
        if (this.data.type == "checkbox") {
          this.checkboxDefaultValue = JSON.parse(
            JSON.stringify(this.data.options.defaultValue.value)
          );
        }

        this.SCORETYPE = this.data.options.score; //设置评分类型
        this.SOURCEID = this.data.options.sourceid; //设置每个控件对应的数据源
        this.curOptionData = JSON.parse(JSON.stringify(this.data.options)); //临时储存当前选项数据
        console.log(this.curOptionData);
        this.Modal = true; //弹窗
        this.CRFSourceType_Get(this.data.options.score);
      }
    },
    //取消选项设置
    CloseOption() {
      if (this.btnState) {
      } else {
        if (this.data.type == "radio" || this.data.type == "select") {
          //清空单选和下拉选项设置的默认值
          this.data.options.defaultValue.value = "";
        }
        if (this.data.type == "checkbox") {
          this.data.options.defaultValue.value = [];
        }
      }
      this.$refs.xModal.close();
    },
    //选择数据源回调
    changeOptions(val) {},
    //单选默认值更改
    clickitem(val) {
      val === this.radioDefaultValue
        ? (this.radioDefaultValue = "")
        : (this.radioDefaultValue = val);
    },
    //多选默认值更改
    checkboxChange(e, item, index) {
      if (e) {
        this.checkboxDefaultValue.push(item.value);
      } else {
        this.checkboxDefaultValue.splice(
          this.curOptionData.defaultValue.value.findIndex(
            key => key === item.value
          ),
          1
        );
      }
    },
    //切换数据源
    sourceidEvtClick(item) {
      this.SOURCEKEY = item.sourcekey;
      this.getSourceidDataList(item.sourceid);
    },
    //选择评分类型获取数据源
    scopetypeChange(scopetype) {
      // this.curOptionData = [];
      this.SCORETYPE = scopetype;
      this.SOURCEID = ""; //清空当前数据源id 为了避免切换选项导致下拉内容不清空
      this.CRFSourceType_Get(scopetype);
    },
    //获取数据源
    CRFSourceType_Get(scoretype) {
      this.MK.Request("/Publics/CRFSource/CRFSourceType_Get", "get", {
        scoretype: scoretype
      }).then(res => {
        let resData = res.data;
        this.sourceData = resData;
        this.sourceList = resData;
      });
    },
    //判断数据对应的值是否重复
    isRepeat(arr) {
      var hash = {};
      for (var i in arr) {
        if (hash[arr[i].value]) {
          return true;
        }
        // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
        hash[arr[i].value] = true;
      }
      return false;
    },
    //保存选项数据
    SaveOptions() {
      let optionData = this.curOptionData;
      this.btnState = true;
      if (this.isRepeat(optionData.options)) {
        this.$message.error("选项值有重复项");
        return;
      }
      if (this.data.type == "checkbox") {
        this.curOptionData.defaultValue.value = this.checkboxDefaultValue;
      }
      if (this.data.type == "radio" || this.data.type == "select") {
        //清空单选和下拉选项设置的默认值
        this.curOptionData.defaultValue.value = this.radioDefaultValue;
      }
      this.curOptionData.score = this.SCORETYPE;
      this.curOptionData.sourceid = this.SOURCEID; //储存点击数据源id，获取对应的数据
      this.data.options = this.curOptionData;
      this.data.name = this.SOURCEKEY;
      this.$refs.xModal.close();
    },
    //根据数据源ID获取数据列表
    getSourceidDataList(sourceid) {
      let sendData = {
        sourceid: sourceid
      };
      this.MK.Request(
        "/Publics/CRFSource/CRFSourceOptions_Get",
        "get",
        sendData
      ).then(res => {
        let resData = res.data;
        if (this.data.type == "units") {
          this.setUnitsOption(resData);
        } else {
          this.setOption(resData);
        }
      });
    },
    //根据数据源ID获取单位数据列表
    setUnitsOption(resData) {
      resData.forEach(item => {
        this.$set(item, "checked", false);
        // liqian  2020/06/16 KEY=>cKEY VALUE=>cValue
        this.$set(item, "label", item.cKEY);
        this.$set(item, "value", item.cVALUE);
        this.radioDefaultValue = "";
        //清空单选和下拉选项设置的默认值
        this.curUnitsOptionData.defaultValue.value = "";
        this.$nextTick(() => {
          this.curUnitsOptionData.options = resData;
        });
      });
    },
    //根据数据源ID获取选项数据列表
    setOption(resData) {
      resData.forEach(item => {
        this.$set(item, "checked", false);
        this.$set(item, "SCORE", item.SCORE == "-" ? undefined : item.SCORE);
        this.$set(item, "inputbox", false);
        this.$set(item, "label", item.cKEY);
        this.$set(item, "value", item.cVALUE);
        this.$nextTick(() => {
          this.radioDefaultValue = "";
          this.checkboxDefaultValue = [];
          if (this.data.type == "radio" || this.data.type == "select") {
            //清空单选和下拉选项设置的默认值
            this.curOptionData.options.defaultValue = "";
          }
          if (this.data.type == "checkbox") {
            this.curOptionData.defaultValue.value = []; //清空当前多选项的默认值
            this.curOptionData.options.forEach(item => {
              //清空每个选项选中的值
              item.checked = false;
            });
          }
        });
      });
      this.curOptionData.options = resData;
    },
    handleOptionsRemove(index) {
      if (this.data.type === "grid") {
        this.data.columns.splice(index, 1);
      } else if (this.data.type === "tabs") {
        this.data.tabs.splice(index, 1);
      } else if (this.data.type == "units") {
        this.curUnitsOptionData.options.splice(index, 1);
      } else if (this.data.type == "matrix") {
        this.curMatrixOptionData.rows.splice(index, 1);
      } else {
        if (
          !this.data.options.remote &&
          this.data.options.options[index].value
        ) {
          this.data.options.defaultValue =
            typeof this.data.options.defaultValue === "string" ? "" : [];
        }

        this.curOptionData.options.splice(index, 1);
      }
    },
    handleAddOption() {
      if (this.data.type == "units") {
        let length = this.curUnitsOptionData.options.length;
        this.curUnitsOptionData.options.push({
          value: ++length + "",
          label: "",
          checked: false
        });
      } else if (this.data.type == "matrix") {
        let length = this.curMatrixOptionData.rows.length;
        this.curMatrixOptionData.rows.push({
          value: ++length + "",
          label: "",
          checked: false
        });
      } else {
        if (this.data.options.showLabel) {
          let length = this.curOptionData.options.length;
          this.curOptionData.options.push({
            value: ++length + "",
            label: "",
            inputbox: false,
            SCORE: undefined,
            checked: false
          });
        } else {
          this.curOptionData.options.push({
            value: ""
          });
        }
      }
      // if (this.data.options.showLabel) {
      //   this.data.options.options.push({
      //     value: "新选项",
      //     label: "新选项"
      //   });
      // } else {
      //   this.data.options.options.push({
      //     value: "新选项"
      //   });
      // }
    },
    handleAddColumn() {
      this.data.columns.push({
        span: "",
        list: []
      });
    },
    handleAddTab() {
      let length = this.data.tabs.length;

      this.data.tabs.push({
        label: "标签页" + (length + 1),
        name: "tab_" + new Date().getTime(),
        list: []
      });
    },
    generateRule() {
      this.data.rules = [];
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) {
          this.data.rules.push(this.validator[key]);
        }
      });
    },
    handleSelectMuliple(value) {
      if (value) {
        if (this.data.options.defaultValue.value) {
          this.data.options.defaultValue.value = [
            this.data.options.defaultValue
          ];
        } else {
          this.data.options.defaultValue.value = [];
        }
      } else {
        if (this.data.options.defaultValue.length > 0) {
          this.data.options.defaultValue.value = this.data.options.defaultValue[0];
        } else {
          this.data.options.defaultValue.value = "";
        }
      }
    },

    validateRequired(val) {
      if (val) {
        this.validator.required = {
          required: true,
          message: `${this.data.name}必须填写`
        };
      } else {
        this.validator.required = null;
      }

      this.$nextTick(() => {
        this.generateRule();
      });
    },

    validateDataType(val) {
      if (!this.show) {
        return false;
      }

      if (val) {
        this.validator.type = {
          type: val,
          message: this.data.name + "格式不正确"
        };
      } else {
        this.validator.type = null;
      }

      this.generateRule();
    },
    valiatePattern(val) {
      if (!this.show) {
        return false;
      }

      if (val) {
        this.validator.pattern = {
          required: this.data.options.required,
          pattern: val,
          message: this.data.name + "格式不匹配"
        };
      } else {
        this.validator.pattern = null;
      }

      this.generateRule();
    },
    //获取评分字段
    geteModel(genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === "grid" || genList[i].type === "rowmatrix") {
          genList[i].columns.forEach(item => {
            this.geteModel(item.list);
          });
        } else if (genList[i].type === "tabs") {
          genList[i].tabs.forEach(item => {
            this.geteModel(item.list);
          });
        } else {
          if (
            genList[i].type === "select" ||
            genList[i].type === "checkbox" ||
            genList[i].type === "radio"
          ) {
            if (genList[i].options.score != 0) {
              this.models[genList[i].model] = genList[i];
            }
          }
        }
      }
    }
  },
  watch: {
    list: {
      handler(val) {
        this.models = {};
        if (this.flag) {
          this.geteModel(val);
          this.$emit("onChangeModels", this.models);
          console.log("onChangeModels");
        }
      },
      deep: true,
      immediate: true
    },
    "data.options.min": function(val) {
      // if(val > this.data.options.max){
      //   this.data.options.min = parseInt(0);
      // }else{
      //   this.data.options.min = parseInt(val.toString().replace(/[^\d.]/g,''))
      // }
    },
    "data.options.max": function(val) {
      // if(val < this.data.options.min){
      //   this.data.options.max = parseInt(this.data.options.min) + 1;
      // }else{
      //   this.data.options.max = parseInt(val.toString().replace(/[^\d.]/g,''))
      // }
    },
    "data.options.isRange": function(val) {
      if (typeof val !== "undefined") {
        if (val) {
          this.data.options.defaultValue = null;
        } else {
          if (Object.keys(this.data.options).indexOf("defaultValue") >= 0)
            this.data.options.defaultValue = "";
        }
      }
    },
    "data.options.isLabelWidth": function(val) {
      if (this.data.options) {
        if (val) {
          if (this.data.options.labelWidth == 0) {
            this.data.labelHidden = false;
          } else {
            this.data.labelHidden = true;
          }
        } else {
          this.data.labelHidden = true;
        }
      }
    },
    "data.options.labelWidth": function(val) {
      if (this.data.options) {
        if (this.data.options.isLabelWidth) {
          if (val == 0) {
            this.data.labelHidden = false;
          } else {
            this.data.labelHidden = true;
          }
        } else {
          this.data.labelHidden = true;
        }
      }
    },
    "data.options.required": function(val) {
      this.validateRequired(val);
      if (this.data.pattern) {
        this.valiatePattern(this.data.pattern);
      }
      if (!val) {
        // this.data.options.pattern = "";
        // this.data.options.validator = "";
        // this.data.options.dataType = "string";
      }
    },
    "data.options.dataType": function(val) {
      // this.validateDataType(val);
    },
    "data.options.pattern": function(val) {
      this.valiatePattern(val);
    },
    "data.name": function(val) {
      if (this.data.options) {
        this.validateRequired(this.data.options.required);
        // this.validateDataType(this.data.options.dataType);
        this.valiatePattern(this.data.options.pattern);
      }
    },
	"data.type":function(val){
		if(val == 'name'){
			this.data.model = 'membername'
		}
	}
  }
};
</script>
<style scoped>
	::v-deep .avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	::v-deep .avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>

