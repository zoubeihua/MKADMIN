// 组件
import mkIntro from './mk-intro.vue'

export default mkIntro

/* 
 * 信息介绍组件
 * @param Object[introData] 父组件传递的信息 
		*必传字段
			 * category 介绍的类别
			 * name el-drawer标题的内容
			 * introid 类别对应的id 如类别是人员，那么对应的introid则是userid
 * @param String[direction] el-drawer 显示的方式 默认从右到左
 * @param String[placeholder] 富文本占位符
 * 
 * 调用示例
 * <mkIntro :introData.sync=""></mkIntro>
 */