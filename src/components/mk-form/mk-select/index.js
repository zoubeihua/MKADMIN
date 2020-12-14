//组件
import mkSelect from './mk-select.vue'
/*
 * mk-select
 * @module @src/components/mk-form
 * @desc 下拉组件
 ** @param Boolean [disabled] 是否禁用
 * @param Boolean [multiple] 是否开启多选
 * @param Number [limit] 多选时用户最多可以选择的项目数，为 0 则不限制 默认为0
 * @param Boolean [collapseTags] 多选时是否将选中值按文字的形式展示
 * @param Boolean [clearable] 是否可以清空选项 默认为开启
 * @param String [url] 请求服务器接口
 * @param Object [param] 请求服务器自定义入参datas
 * @param Array [datas] 如果不请求服务器可以自定义本地数据 例如 datas="[{lable:张三,value:1},{lable:李四,value:2}]"
 * @param String/Number [label] 选项的标签，若不设置则默认与 value 相同
 * @param String/Number/Object [val] 选项的值
 * @param String [filter] 检索字段 可以根据lable字段检索
 * @param String [globalFn] 是否使用全局的字典请求，搭配[url]使用 url不为空即可使用
 * @example 调用实例
 *  <mk-select
 *    v-model="newValue"
 *    url="getuserinfo"
 *    :param="{name:张三}"
 *    label="label"
 *    val="val"
 *    filter="label"
 * >

    </mk-select>
*/
export default mkSelect
