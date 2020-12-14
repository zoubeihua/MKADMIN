<template>
	<div :id="id" class="fm-code-editor" :style="{width: width, height: height}">{{codeValue}}</div>
</template>

<script>
	import {
		loadJs
	} from '../../util'

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
		data() {
			return {
				id: 'code_' + Math.random().toString(36).slice(-8),
				codeValue: this.value
			}
		},
		computed: {
			aceMode() {
				switch (this.mode) {
					case 'xml':
						return 'ace/mode/xml'
					case 'html':
						return 'ace/mode/html'
					case 'javascript':
						return 'ace/mode/javascript'
					case 'json':
						return 'ace/mode/json'
					case 'sql':
						return 'ace/mode/mysql'
					default:
						return 'ace/mode/xml'
				}
			}
		},
		mounted() {
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
			loadEditor() {
				//启用提示菜单
				var langTools = ace.require('ace/ext/language_tools');
				const editor = ace.edit(this.id)
				editor.setTheme("ace/theme/pastel_on_dark"); //主题
				editor.setFontSize(16);
				editor.getSession().setMode(this.aceMode) //语言高亮
				// editor.setReadOnly(false);//设置只读（true时只读，用于展示代码）
				//自动换行,设置为off关闭
				// editor.setOption("wrap", "free");
				//以下部分是设置输入代码提示的

				editor.setOptions({
					//以下三行是设置输入代码提示的配置
					enableBasicAutocompletion: true,
					enableSnippets: true,
					enableLiveAutocompletion: true
				});

				editor.getSession().setUseSoftTabs(true);
				editor.getSession().setUseWrapMode(true); //支持代码折叠
				editor.selection.getCursor(); //获取光标所在行或列
				//editor.gotoLine(lineNumber); //跳转到行
				editor.session.getLength(); //获取总行数

				// editor.renderer.setShowGutter(false);//去不掉行号
				editor.setShowPrintMargin(false); //去掉中间竖线条纹
				editor.getSession().setUseSoftTabs(true);
				editor.on('change', (e) => {
					console.log(editor.getValue())
					editor.execCommand('startAutocomplete');
					this.codeValue = editor.getValue()
				})
				editor.focus();
				editor.session.setUseWrapMode(true);
			}
		},
		watch: {
			value(val) {
				this.codeValue = val
			},
			codeValue(val) {
				this.$emit('input', val)
			}
		}
	}
</script>

<style lang="scss">
	.fm-code-editor {
		border: 1px solid #DCDFE6;
	}
</style>
