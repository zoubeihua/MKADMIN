export const basicComponents = [
  {
      type: 'input',
      name: '单行文本',
      icon: 'icon-input',
      labelHidden: true,
      options: {
          width: '100%',
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          defaultValue: '',
          varid:'',//常量id
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          required: false,
          min: 0,
          max: 5,
          steps:1,
          dataType: 'string',
          pattern: '',
          placeholder: '',
          customClass: '',
          disabled: false,
          clearable: true,
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true,
          showPassword: false,
      }
  },
  {
      type: 'name',
      name: '姓名',
      icon: 'icon-xingming',
      labelHidden: true,
      options: {
          width: '100%',
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          defaultValue: '',
          varid:'',//常量id
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          required: false,
          min: 0,
          max: 5,
          steps:1,
          dataType: 'string',
          pattern: '',
          placeholder: '请输入您的姓名',
          customClass: '',
          disabled: false,
          clearable: true,
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true,
          showPassword: false,
      }
  },
  {
      type: 'sex',
      name: '性别',
      icon: 'icon-V',
      labelHidden: true,
      options: {
          inline: false,
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          defaultValue: '1',
          varid:'',//常量id
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          showLabel: true,
          scoreHidden: true,//是否显示评分
          score: 0,//0非评分 1评分
          sourceid: '',//数据源id
          options: [
              {
                  value: '1',
                  label: '男',
              },
              {
                  value: '2',
                  label: '女',
              },
          ],
          required: false,
          width: '',
          remote: false,
          remoteType: 'option',
          remoteOption: '',
          remoteOptions: [],
          props: {
              value: 'value',
              label: 'label'
          },
          remoteFunc: '',
          customClass: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true,
          disabled: false
      }
  },
  {
      type: 'age',
      name: '年龄',
      icon: 'icon-nianlingguangfan-02',
      labelHidden: true,
      options: {
          width: '100%',
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          defaultValue: '',
          varid:'',//常量id
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          required: false,
          min: 0,
          max: 5,
          steps:1,
          dataType: 'string',
          pattern: '/^(?:[1-9][0-9]?|1[01][0-9]|120)$/',
          placeholder: '',
          customClass: '',
          disabled: false,
          clearable: true,
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true,
          showPassword: false,
      }
  },
  {
      type: 'address',
      name: '地址',
      icon: 'icon-dizhi',
      labelHidden: true,
      options: {
          width: '100%',
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          defaultValue: '',
          varid:'',//常量id
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          required: false,
          min: 0,
          max: 5,
          steps:1,
          dataType: 'string',
          pattern: '',
          placeholder: '',
          customClass: '',
          disabled: false,
          clearable: true,
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true,
          showPassword: false,
      }
  },
  {
      type: 'tel',
      name: '手机号码',
      icon: 'icon-shoujihao',
      labelHidden: true,
      options: {
          width: '100%',
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          defaultValue: '',
          varid:'',//常量id
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          required: false,
          min: 0,
          max: 5,
          steps:1,
          dataType: 'string',
          pattern: '/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8]|18[0|1|2|3|5|6|7|8|9])\\d{8}$/',
          placeholder: '',
          customClass: '',
          disabled: false,
          clearable: true,
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true,
          showPassword: false,
      }
  },
  {
      type: 'idcard',
      name: '身份证',
      icon: 'icon-credentials_icon',
      labelHidden: true,
      options: {
          width: '100%',
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          defaultValue: '',
          varid:'',//常量id
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          required: false,
          min: 0,
          max: 5,
          steps:1,
          dataType: 'string',
          pattern: '/^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/',
          placeholder: '',
          customClass: '',
          disabled: false,
          clearable: true,
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true,
          showPassword: false,
      }
  },
  {
      type: 'textarea',
      name: '多行文本',
      icon: 'icon-diy-com-textarea',
      labelHidden: true,
      options: {
          width: '100%',
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          defaultValue: '',
          varid:'',//常量id
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          required: false,
          disabled: false,
          pattern: '',
          placeholder: '',
          customClass: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true
      }
  },
  {
      type: 'number',
      name: '计数器',
      icon: 'icon-number',
      labelHidden: true,
      options: {
          width: '',
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          required: false,
          defaultValue: 0,
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          min: 0,
          max: 0,
          step: 1,
          steps:1,
          disabled: false,
          controlsPosition: '',
          customClass: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true
      }
  },
  {
      type: 'radio',
      name: '单选框组',
      icon: 'icon-radio-active',
      labelHidden: true,
      options: {
          inline: false,
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          defaultValue: {
              value: '',
              score: 0,//统计评分
              remark: '',//备注
          },
          varid:'',//常量id
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          showLabel: true,
          scoreHidden: true,//是否显示评分
          score: 0,//0非评分 1评分
          sourceid: '',//数据源id
          options: [
              {
                  value: 'Option 1',
                  label: 'Option 1',
                  inputbox: false,
                  SCORE: undefined,
                  checked: false,
              },
              {
                  value: 'Option 2',
                  label: 'Option 2',
                  inputbox: false,
                  SCORE: undefined,
                  checked: false,
              },
              {
                  value: 'Option 3',
                  label: 'Option 3',
                  inputbox: false,
                  SCORE: undefined,
                  checked: false,
              }
          ],
          required: false,
          width: '',
          remote: false,
          remoteType: 'option',
          remoteOption: '',
          remoteOptions: [],
          props: {
              value: 'value',
              label: 'label'
          },
          remoteFunc: '',
          customClass: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true,
          disabled: false
      }
  },
  {
      type: 'checkbox',
      name: '多选框组',
      icon: 'icon-check-box',
      labelHidden: true,
      options: {
          isMax:false,
          span:24,
          max:2,
          inline: false,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          defaultValue: {
              value: [],
              score: 0,//统计评分
              remark: {

              },//备注
          },
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          showLabel: true,
          scoreHidden: true,//是否显示评分
          score: 0,//0非评分 1评分
          sourceid: '',//数据源id
          options: [
              {
                  value: 'Option 1',
                  label: 'Option 1',
                  inputbox: false,
                  SCORE: undefined,
                  checked: false,
              },
              {
                  value: 'Option 2',
                  label: 'Option 2',
                  inputbox: false,
                  SCORE: undefined,
                  checked: false,
              },
              {
                  value: 'Option 3',
                  label: 'Option 3',
                  inputbox: false,
                  SCORE: undefined,
                  checked: false,
              }
          ],
          required: false,
          width: '',
          remote: false,
          remoteType: 'option',
          remoteOption: '',
          remoteOptions: [],
          props: {
              value: 'value',
              label: 'label'
          },
          remoteFunc: '',
          customClass: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true,
          disabled: false
      }
  },
  {
      type: 'time',
      name: '时间选择器',
      icon: 'icon-time',
      labelHidden: true,
      options: {
          defaultValue: '',
          span:24,
          varid:'',//常量id
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          readonly: false,
          disabled: false,
          editable: true,
          clearable: true,
          placeholder: '',
          startPlaceholder: '',
          endPlaceholder: '',
          isRange: false,
          arrowControl: true,
          format: 'HH:mm:ss',
          required: false,
          width: '',
          customClass: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true
      }
  },
  {
      type: 'date',
      name: '日期选择器',
      icon: 'icon-date',
      labelHidden: true,
      options: {
          defaultValue: '',
          span:24,
          varid:'',//常量id
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          daterange:true,//日期选择是否不能大于当前服务器的日期
          isnowdate:true,//是否获取当前时间
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          readonly: false,
          disabled: false,
          editable: true,
          clearable: true,
          placeholder: '',
          startPlaceholder: '',
          endPlaceholder: '',
          type: 'date',
          format: 'yyyy-MM-dd',
          timestamp: false,
          required: false,
          width: '',
          customClass: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true
      }
  },
  // {
  //     type: 'score',
  //     name: '评分',
  //     icon: 'icon-pingfen1',
  //     labelHidden: true,
  //     options: {
  //         cognateValue: [],//储存关联的控件
  //         defaultValue: 0,
  //         question: true,//质疑标志
  //         querycontent: [],//质疑内容
  //         tips:true,//数据核查状态
  //         tipscontent:'',//数据核查提示
  //         condition: [{//条件
  //             action: 'show',//显示隐藏状态
  //             condition: 'or',//条件关系 or或 and 并且
  //             result: [{//关联表单信息
  //                 action: 'eq',//eq等于 ne不等于 gt大于 lt小于 ge大于等于 le 小于等于
  //                 crf_id: '',//节点id
  //                 dataset_id: "",//表单id
  //                 interview_id: '123456',//控件id 即控件字段标识
  //                 options: [{ value: "213" }],//关联控件的最终值
  //                 type: 'radio'//关联控件类型

  //             }]
  //         }, {//条件
  //             action: 'show',//显示隐藏状态
  //             condition: 'or',//条件关系 or或 and 并且
  //             result: [{//关联表单信息
  //                 action: 'eq',//eq等于 ne不等于 gt大于 lt小于 ge大于等于 le 小于等于
  //                 crf_id: '',//节点id
  //                 dataset_id: "",//表单id
  //                 interview_id: '1234567',//控件id 即控件字段标识
  //                 options: [{ value: "213" }],//关联控件的最终值
  //                 type: 'radio'//关联控件类型
  //             }]
  //         }],
  //         disabled: true,
  //         required: false,
  //         customClass: '',
  //         labelWidth: 100,
  //         isLabelWidth: false,
  //         hidden: false,
  //         dataBind: true,
  //     }
  // },
   {
    type: 'score',
    name: '评分',
    icon: 'icon-pingfen1',
    labelHidden: true,
    options: {
        cognateValue: [],//储存关联的控件
        span:24,
        defaultValue: 0,
        question: true,//质疑标志
        querycontent: [],//质疑内容
        tips:true,//数据核查状态
        tipscontent:'',//数据核查提示
        condition: [],
        disabled: true,
        required: false,
        customClass: '',
        labelWidth: 100,
        isLabelWidth: false,
        hidden: false,
        dataBind: true,
    }
},{
      type: 'rate',
      name: '评分',
      icon: 'icon-pingfen1',
      labelHidden: true,
      options: {
          defaultValue: null,
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [{//条件
              action: 'show',//显示隐藏状态
              condition: 'or',//条件关系 or或 and 并且
              result: [{//关联表单信息
                  action: 'eq',//eq等于 ne不等于 gt大于 lt小于 ge大于等于 le 小于等于
                  crf_id: '',//节点id
                  dataset_id: "",//表单id
                  interview_id: '123456',//控件id 即控件字段标识
                  options: [{ value: "213" }],//关联控件的最终值
                  type: 'radio'//关联控件类型

              }]
          }, {//条件
              action: 'show',//显示隐藏状态
              condition: 'or',//条件关系 or或 and 并且
              result: [{//关联表单信息
                  action: 'eq',//eq等于 ne不等于 gt大于 lt小于 ge大于等于 le 小于等于
                  crf_id: '',//节点id
                  dataset_id: "",//表单id
                  interview_id: '1234567',//控件id 即控件字段标识
                  options: [{ value: "213" }],//关联控件的最终值
                  type: 'radio'//关联控件类型

              }]
          }],
          disabledition:[],//控件禁用启用关联条件
          max: 5,
          disabled: false,
          allowHalf: false,
          required: false,
          customClass: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true,
          showScore: false
      }
  },
  {
      type: 'color',
      name: '颜色选择器',
      icon: 'icon-color',
      labelHidden: true,
      options: {
          defaultValue: '',
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          disabled: false,
          showAlpha: false,
          required: false,
          customClass: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true
      }
  },
  {
      type: 'select',
      name: '下拉选择框',
      icon: 'icon-select',
      labelHidden: true,
      options: {
          defaultValue: {
              value: '',
              score: 0,//统计评分
              remark: '',//备注
          },
          span:24,
          varid:'',//常量id
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          multiple: false,
          disabled: false,
          clearable: false,
          placeholder: '',
          required: false,
          showLabel: true,
          scoreHidden: true,//是否显示评分
          score: 0,//0非评分 1评分
          sourceid: '',//数据源id
          width: '',
          options: [
              {
                  value: 'Option 1',
                  label: 'Option 1',
                  inputbox: false,
                  SCORE: undefined,
                  checked: false,
              },
              {
                  value: 'Option 2',
                  label: 'Option 2',
                  inputbox: false,
                  SCORE: undefined,
                  checked: false,
              },
              {
                  value: 'Option 3',
                  label: 'Option 3',
                  inputbox: false,
                  SCORE: undefined,
                  checked: false,
              }
          ],
          remote: false,
          remoteType: 'option',
          remoteOption: '',
          filterable: true,
          remoteOptions: [],
          props: {
              value: 'value',
              label: 'label'
          },
          remoteFunc: '',
          customClass: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true
      }
  },
  {
      type: 'units',
      name: '数值',
      labelHidden: true,
      icon: 'icon-shuzhishuru',
      options: {
          width: '100%',
          span:24,
          labelWidth: 100,
          isLabelWidth: false,
          customClass: "",
          defaultValue: {
              value: '',
              unit: 'Option 1'
          },
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          required: false,
          showLabel: true,
          score: 2,//0非评分 1评分 2测量值
          sourceid: '',//数据源id
          validator:'',//数值正则验证
          pattern: '',
          placeholder: '',
          disabled: false,
          hidden: false,
          dataBind: true,
          options: [
              {
                  value: 'Option 1',
                  label: 'Option 1',
                  inputbox: false,
                  SCORE: undefined,
                  checked: false,
              },
              {
                  value: 'Option 2',
                  label: 'Option 2',
                  inputbox: false,
                  SCORE: undefined,
                  checked: false,
              },
              {
                  value: 'Option 3',
                  label: 'Option 3',
                  inputbox: false,
                  SCORE: undefined,
                  checked: false,
              }
          ],
          remote: false,
          filterable: false,
          remoteOptions: [],
          props: {
              value: 'value',
              label: 'label'
          },
          remoteFunc: ''
      }
  },
  {
      type: 'switch',
      name: '开关',
      icon: 'icon-switch',
      labelHidden: true,
      options: {
          defaultValue: false,
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          required: false,
          disabled: false,
          customClass: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true
      }
  },
  {
      type: 'slider',
      name: '滑块',
      icon: 'icon-sliders',
      labelHidden: true,
      options: {
          defaultValue: 0,
          span:24,
          isShowStops:false,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          disabled: false,
          required: false,
          min: 0,
          max: 100,
          step: 1,
          steps:1,
          showInput: false,
          range: false,
          width: '',
          customClass: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true
      }
  },
  {
      type: 'text',
      name: '文字',
      icon: 'icon-wenzishezhi-',
      labelHidden: true,
      options: {
          defaultValue: 'This is a text',
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],//控件显示隐藏关联条件
          customClass: '',
          styleObject: {
              color: '#666',
              fontSize: '14',
              textAlign: 'left',//对齐方式 左对齐left 右对齐right 居中center
              fontWeight: 'normal',//normal 默认不加粗  bold加粗
              textDecoration: 'none' //underline定义文本下的一条线。  overline定义文本上的一条线。line-through定义穿过文本下的一条线
          },
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true
      }
  },
  {
      type: 'html',
      name: 'HTML',
      icon: 'icon-html',
      labelHidden: true,
      options: {
          defaultValue: '<b style="color: red;">This is a HTML5</b>',
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true
      }
  },
  {
    type: 'img',
    name: '自定义图片',
    icon: 'icon-tupian',
    labelHidden: true,
    options: {
      defaultValue: 'http://i0.sinaimg.cn/IT/images/2013-03-20/U74P2T78D24705F3303DT20130320151120.jpg',
      span: 24,
      question: true,//质疑标志
      querycontent: [],//质疑内容
      tips: true,//数据核查状态
      tipscontent: '',//数据核查提示
      condition: [],//控件显示隐藏关联条件
      disabledition: [],//控件禁用启用关联条件
      size: {
        width: 100,
        height: 100,
      },
      styleObject: {
        align: 'center'//对齐方式 左对齐left 右对齐right 居中center
      },
      labelWidth: 0,
      isLabelWidth: true,
      hidden: false,
      dataBind: false
    }
  }
]

export const advanceComponents = [
  {
      type: 'blank',
      name: '自定义区域',
      icon: 'icon-zidingyishuju',
      labelHidden: true,
      options: {
          defaultType: 'String',
          span:24,
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          customClass: '',
          width: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true
      }
  },
  {
      type: 'fileupload',
      name: '文件',
      icon: 'icon-wenjianshangchuan',
      labelHidden: true,
      options: {
          defaultValue: [],
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          width: '',
          tip: '',
          action: 'https://jsonplaceholder.typicode.com/photos/',
          customClass: '',
          disabled: false,
          limit: 9,
          fileList: [],
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true
      }
  },
  {
      type: 'imgupload',
      name: '图片',
      icon: 'icon-tupian',
      labelHidden: true,
      options: {
          defaultValue: [],
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          size: {
              width: 100,
              height: 100,
          },
          width: '',
          tokenFunc: 'funcGetToken',
          token: '',
          domain: 'http://toolcdn.xiaoyaoji.cn/',
          disabled: false,
          readonly: false,
          limit: 8,
          multiple: false,
          isQiniu: false,
          isDelete: false,
          min: 0,
          steps:1,
          isEdit: false,
          action: 'https://jsonplaceholder.typicode.com/photos/',
          customClass: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true,
          required: false,
      }
  },
  {
      type: 'editor',
      name: '编辑器',
      icon: 'icon-fuwenbenkuang',
      labelHidden: true,
      options: {
          defaultValue: '',
          span:24,
          question: true,//质疑标志 true 没有质疑 false 有质疑
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          width: '',
          customClass: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true,
          customToolbar: [
              ['bold', 'italic', 'underline', 'strike',
                  { 'color': [] },
                  { 'background': [] },
                  { 'align': [] },
                  { 'list': 'ordered' },
                  { 'list': 'bullet' },
                  { 'indent': '-1' },
                  { 'indent': '+1' }
              ],
              [{ 'font': [] }, { 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              ['link', 'image', 'blockquote', 'code-block'],
              [{ 'direction': 'rtl' }],
              ['clean']
          ],
          disabled: false
      }
  },
  {
      type: 'cascader',
      name: '级联选择器',
      icon: 'icon-jilianxuanze',
      labelHidden: true,
      options: {
          defaultValue: [],
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          width: '',
          placeholder: '',
          disabled: false,
          clearable: false,
          remote: true,
          remoteType: 'option',
          remoteOption: '',
          remoteOptions: [],
          props: {
              value: 'value',
              label: 'label',
              children: 'children'
          },
          remoteFunc: '',
          customClass: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true
      }
  },
  {
      type: 'table',
      name: '子表单',
      icon: 'icon-table',
      labelHidden: true,
      options: {
          defaultValue: [],
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          customClass: '',
          labelWidth: 100,
          isLabelWidth: false,
          hidden: false,
          dataBind: true,
          disabled: false,
      },
      tableColumns: []
  },
  {
    type: 'rowmatrix',
    name: '栅格矩阵',
    icon: 'icon-shitujuzhen',
    labelHidden: true,
    columns: [
        {
            span: 12,
            list: []
        },
        {
            span: 12,
            list: []
        }
    ],
    options: {
        gutter: 0,
        span:24,
        justify: 'start',
        question: true,//质疑标志
        querycontent: [],//质疑内容
        tips:true,//数据核查状态
        tipscontent:'',//数据核查提示
        condition: [],//控件显示隐藏关联条件
        align: 'top',
        customClass: '',
        hidden: false,
    }
},
{
      type: 'oralcavity',
      name: '口腔',
      icon: 'icon-kouqiang',
      labelHidden: true,
      options: {
          defaultValue: {},
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],//控件显示隐藏关联条件
          disabledition:[],//控件禁用启用关联条件
          width: '',
          placeholder: '',
          disabled: false,
          remoteOption: '',
          remoteOptions: [],
          remoteFunc: '',
          customClass: '',
          labelWidth: 0,
          isLabelWidth: true,
          hidden: false,
          dataBind: true
      }
  },
  {
      type: 'btn',
      name: '提交',
      icon: 'icon-check-box',
      options: {
		  width: '100%',
  		  size:"medium",
  		  type:'primary',
  		  plain:false,
  		  round:false,
  		  circle:false,
          hidden: false,
  		  disabled: false,
		  script:`const crfClass = {
	classid: 100016,
	classname: "营销活动表单",
	subclassid: 100054,
	subclassname: "会员关注采集"
};

const query = vm.$route.params;
const hospitalid = query.hospitalid;
const eventid = query.eventid;
const crfid = query.crfid;
// const hospitalid = 1;
// const eventid = 113;
let memberid = null;

let crfname = null;
let couponid = null;

//生成GUID
const generateUUID = function() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
  });
  return uuid;
}
//注册会员参数
let item = {
    membername:'',
    sex:'1',
    age:'',
    birthday:'',
    idnumber:'',
    mobiletel:'',
    address:'',
    cardno:'',
    sourceid: 3, //来源于活动，固定传参
    sourcenote: '', //活动名称
    idtype: '2', //证件类型 默认为护照
    cardtypeid: '2', //卡类型，默认磁条卡
    operatetype: 'C'
};

//填写表单值
let sendData = {}
async function getData(){
     let [err, res] = await to(vm.generateForm.getData());
     if(err){
         return false;
     }else{
        return res;
     }
     
} 
async function init(){
    let res = await getData();//获取表单数据
    if(res){
        if(!eventid){
    		vm.$message({
    			message: '开发环境，不能操作',
    			type: 'warning'
    		})
    		return;
    	}
        let isValidByeventid = await Isefficacious();//活动是否有效
        if(!isValidByeventid){
            
            return;
        };
        sendData = res.sendData;
        for(let key in item){
            if(Object.keys(sendData).indexOf(key) >= 0){
                item[key] = sendData[key];
            }
        }
        console.log(item)
        let resEventsInfo = await HospitalEventsByeventid();//获取活动信息
         if(resEventsInfo.code != 0){
           return;
        };
        let data = {}
        if(resEventsInfo.data.length){
            data = resEventsInfo.data.find(item => item.crfid == crfid);
        };
        let isdiscoupon = data.discoupon;//是否领取优惠卷 1领取 否则不领取
        couponid = data.couponid;//优惠卷id
        crfname = data.crfname;
        item.sourcenote  = data.eventname;
        item.cardno = generateUUID();
        let resReg = await BasicInfo(item);//会员注册
        if(resReg.code == 0){
            memberid = resReg.result;
            let isCoupon = null;
            if(isdiscoupon == 1){
                let resCoupom = await ReceiveCoupon();//领取优惠卷
                if(resCoupom.code == 0){
                     isCoupon = 0;
                }
               
            };
            let resCrf = await crfSave();//表单保存
            if(resCrf.code == 0){
                if(isCoupon == null){
                    vm.$alert('<strong style="font-size: 16px;font-weight: 700;">恭喜您，报名成功！</strong><span>参加时间请等待工作人员电话通知。</span>', '温馨提示', {
                      dangerouslyUseHTMLString: true,
                       callback: action => {
                         try{
                             WeixinJSBridge.call('closeWindow');
                         }catch(e){
                             console.log(e)
                         }
                      }
                    }); 
                }else{
                    vm.$alert('<strong style="font-size: 16px;font-weight: 700;">恭喜您，领取成功！</strong>', '温馨提示', {
                      dangerouslyUseHTMLString: true,
                       callback: action => {
                         try{
                             WeixinJSBridge.call('closeWindow');
                         }catch(e){
                             console.log(e)
                         }
                      }
                    });  
                }
              
                vm.generateForm.reset();
                item = {
    			    membername:'',
    			    sex:'1',
    			    age:'',
    			    birthday:'',
    			    idnumber:'',
    			    mobiletel:'',
    			    address:'',
    			    cardno:'',
    			    sourceid: 3, //来源于活动，固定传参
    			    sourcenote: '', //活动名称
    			    idtype: '2', //证件类型 默认为护照
    			    cardtypeid: '2', //卡类型，默认磁条卡
    			    operatetype: 'C'
    			}
            }
        } 
    }  
};

//活动是否有效
function Isefficacious(){
	return vm.MK.Request(
		"/Publics/Common/Dic/HospitalEventsIsefficacious",
		"get",
		{
		  eventid: eventid
		})
		.then(res => {
		if(res.code === 0){
			return true;
		}else{
			return false;
		}
	});
};
//获取活动信息
function HospitalEventsByeventid(){
    return vm.MK.Request('/Publics/Common/Dic/HospitalEventsByeventid','get',{eventid:eventid})
};
//会员注册
function BasicInfo(data){
     let curYear = dayjs().year();//当前年份
     let curMonth = dayjs().month() + 1;//当前月
     let curDate = dayjs().date();//当日
     if(data.age){
        data.birthday =  parseInt(curYear) - parseInt(data.age) + '-' + curMonth + '-' + curDate;
     }
     return vm.MK.Request('/Publics/MemberManage/BasicInfo','post',data);
};
//领取优惠卷
function ReceiveCoupon(){
      let opt = {
        operatetype: "C",
        couponid: couponid,
        eventid: eventid,
        memberid: memberid
      };
    return vm.MK.Request("/Publics/CouponManage/ReceiveCoupon", "post", opt)
};
//表单保存
function crfSave(){
    let opt = {
        hospitalid: hospitalid,
        collectionid: 1,
        memberid: memberid,
        classid: crfClass.classid,
        classname: crfClass.classname,
        subclassid: crfClass.subclassid,
        subclassname: crfClass.subclassname,
        crfid: crfid,
        crfname:crfname,
        createid: memberid,
        filljson: sendData
      };
    return vm.MK.Request("/Publics/CRFMaintain/CRFFill_ADD", "post", opt)
};
init();  `,//脚本
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],//控件显示隐藏关联条件
          labelWidth: 0,
          isLabelWidth: true,
		  dataBind: false,
		  contentPosition:'center'
      }
  }
]

export const layoutComponents = [
  {
      type: 'grid',
      name: '栅格布局',
      icon: 'icon-grid',
      labelHidden: true,
      columns: [
          {
              span: 12,
              list: []
          },
          {
              span: 12,
              list: []
          }
      ],
      options: {
          gutter: 0,
          span:24,
          justify: 'start',
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],//控件显示隐藏关联条件
          align: 'top',
          customClass: '',
          hidden: false,
      }
  },
  {
      type: 'tabs',
      name: '标签页',
      icon: 'icon-tabs',
      labelHidden: true,
      tabs: [
          {
              label: 'Tab 1',
              name: 'tab_1',
              list: []
          }
      ],
      options: {
          type: '',
          span:24,
          tabPosition: 'top',
          question: true,//质疑标志
          querycontent: [],//质疑内容
          condition: [],//控件显示隐藏关联条件
          customClass: '',
          hidden: false,
      }
  },
  {
      type: 'divider',
      name: '分割线',
      icon: 'icon-fengexian',
      options: {
          hidden: false,
          span:24,
          question: true,//质疑标志
          querycontent: [],//质疑内容
          tips:true,//数据核查状态
          tipscontent:'',//数据核查提示
          condition: [],//控件显示隐藏关联条件
          labelHidden: false,
          contentPosition: 'left'
      }
  }
 
]
