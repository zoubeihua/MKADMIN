<template>
  <div :id="id" v-loading="loading" class="" :style="{width: width, height: height}">{{codeValue}}</div>
</template>

<script>
import {loadJs} from '@/components/mkmakingform/util/index'
export default {
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    mode: {
      type: String,
      default: 'xml'
    },
    value: {
      type: [String, Object],
      default: ''
    }
  },
  data () {
    return {
      id: 'code_' + Math.random().toString(36).slice(-8),
      codeValue: this.value,
      loading: true
    }
  },
  computed: {
    aceMode () {
      switch (this.mode) {
        case 'xml':
          return 'ace/mode/xml'
        case 'html':
          return 'ace/mode/html'
        case 'json':
          return 'ace/mode/json'
		case 'sql':
		  return 'ace/mode/mysql'
        default:
          return 'ace/mode/xml'
      }
    }
  },
  mounted () {

    console.log('code editor mounted.')
    
    setTimeout(() => {
      if (window.ace) {
        this.loadEditor()
      } else {
        loadJs(`${this.$baseUrl}lib/ace/ace.js`).then(() => {
          this.loadEditor()
        })
      }
    }, 0)
  },
  methods: {
    loadEditor () {
      this.loading = false
      const editor = ace.edit(this.id)

      const beautify = ace.require("ace/ext/beautify")
	  editor.setTheme("ace/theme/monokai"); //主题
      // editor.setTheme("ace/theme/chaos")
      
      editor.session.setMode(this.aceMode)
      editor.setFontSize(16)
	   editor.getSession().setMode(this.aceMode) //语言高亮
	   // editor.setOptions({
	   //     //以下三行是设置输入代码提示的配置
	   //     enableBasicAutocompletion: true,
	   //     enableSnippets: true,
	   //     enableLiveAutocompletion: true
	   // });
      editor.getSession().setTabSize(2)
      editor.setShowPrintMargin(false)
      // editor.setReadOnly(true)

      editor.on('change', (e) => {
		  editor.execCommand('startAutocomplete');
        this.codeValue = editor.getValue();
		editor.focus();
		editor.session.setUseWrapMode(true);
      })
    }
  },
  watch: {
    value (val) {
      this.codeValue =  val
    },
    codeValue (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss">
.fm-code-editor{
  border: 1px solid #DCDFE6;
}
</style>
