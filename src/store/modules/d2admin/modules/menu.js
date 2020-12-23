import {
	uniqueId
} from 'lodash'
// 设置文件
import setting from '@/setting.js'

/**
 * 给菜单数据补充上 path 字段
 * @param {Array} menu 原始的菜单数据
 */
function supplementMenuPath(menu) {
	return menu.map(e => ({
		...e,
		path: e.path || uniqueId('d2-menu-empty-'),
		...e.children ? {
			children: e.children.length &&  e.children.length > 0 ? supplementMenuPath(e.children) : undefined
		} : {}
	}))
}
/**
 * 递归过滤节点，生成新的树结构
 * @param {Node[]} nodes 要过滤的节点
 * @param {node => boolean} predicate 过滤条件，符合条件的节点保留
 * @return 过滤后的节点 && e.target != 'button' 
 */
function deal(nodes, predicate) {
	// 如果已经没有节点了，结束递归
	if (!(nodes && nodes.length)) {
		return [];
	}
	const newChildren = [];
	for (const node of nodes) {
		if (predicate(node)) {
			// 如果节点符合条件，直接加入新的节点集
			if (node.children != undefined) { //过滤父节点没有子节点的情况
				newChildren.push(node);
			} else {
				newChildren.push(node);
			}
			node.children = deal(node.children, predicate).length ? deal(node.children, predicate) : undefined;
		} else {
			// 如果当前节点不符合条件，递归过滤子节点，
			// 把符合条件的子节点提升上来，并入新节点集
			if (node.children.length > 0) {
				newChildren.push(...deal(node.children, predicate));
			}
		}
	}
	return newChildren;
}

function filterAsyncMenu(menu) {
	const menus = menu.filter(item => {
		if (item.target != 'button') {
			if (item.children && item.children.length) {
				item.children = filterAsyncMenu(item.children)
			}
			return true
		}
	})
	return menus
}
export default {
	namespaced: true,
	state: {
		// 顶栏菜单
		header: [],
		// 侧栏菜单
		aside: [],
		// 侧边栏收缩
		asideCollapse: setting.menu.asideCollapse,
		// 侧边栏折叠动画
		asideTransition: setting.menu.asideTransition,
		//当前菜单id
		menuData: {}

	},
	actions: {
		/**
		 * 设置侧边栏展开或者收缩
		 * @param {Object} context
		 * @param {Boolean} collapse is collapse
		 */
		async asideCollapseSet({
			state,
			dispatch
		}, collapse) {
			// store 赋值
			state.asideCollapse = collapse
			// 持久化
			await dispatch('d2admin/db/set', {
				dbName: 'sys',
				path: 'menu.asideCollapse',
				value: state.asideCollapse,
				user: true
			}, {
				root: true
			})
		},
		/**
		 * 切换侧边栏展开和收缩
		 * @param {Object} context
		 */
		async asideCollapseToggle({
			state,
			dispatch
		}) {
			// store 赋值
			state.asideCollapse = !state.asideCollapse
			// 持久化
			await dispatch('d2admin/db/set', {
				dbName: 'sys',
				path: 'menu.asideCollapse',
				value: state.asideCollapse,
				user: true
			}, {
				root: true
			})
		},
		/**
		 * 设置侧边栏折叠动画
		 * @param {Object} context
		 * @param {Boolean} transition is transition
		 */
		async asideTransitionSet({
			state,
			dispatch
		}, transition) {
			// store 赋值
			state.asideTransition = transition
			// 持久化
			await dispatch('d2admin/db/set', {
				dbName: 'sys',
				path: 'menu.asideTransition',
				value: state.asideTransition,
				user: true
			}, {
				root: true
			})
		},
		/**
		 * 切换侧边栏折叠动画
		 * @param {Object} context
		 */
		async asideTransitionToggle({
			state,
			dispatch
		}) {
			// store 赋值
			state.asideTransition = !state.asideTransition
			// 持久化
			await dispatch('d2admin/db/set', {
				dbName: 'sys',
				path: 'menu.asideTransition',
				value: state.asideTransition,
				user: true
			}, {
				root: true
			})
		},
		/**
		 * 持久化数据加载侧边栏设置
		 * @param {Object} context
		 */
		async asideLoad({
			state,
			dispatch
		}) {
			// store 赋值
			const menu = await dispatch('d2admin/db/get', {
				dbName: 'sys',
				path: 'menu',
				defaultValue: setting.menu,
				user: true
			}, {
				root: true
			})
			state.asideCollapse = menu.asideCollapse !== undefined ? menu.asideCollapse : setting.menu.asideCollapse
			state.asideTransition = menu.asideTransition !== undefined ? menu.asideTransition : setting.menu.asideTransition
		},
		/**
		 * @description 用户点击当前菜单数据
		 * @param {Object} context
		 * @param {*} menuData menuData
		 */
		setMenuData({
			state,
			dispatch
		}, menuData) {
			return new Promise(async resolve => {
				// store 赋值
				state.menuData = menuData
				// 持久化
				await dispatch('d2admin/db/set', {
					dbName: 'sys',
					path: 'menu.menuData',
					value: menuData,
					user: true
				}, {
					root: true
				})
				// end
				resolve()
			})
		},
		/**
		 * @description 从数据库取当前页面数据
		 * @param {Object} context
		 */
		loadMenuData({
			state,
			dispatch
		}) {
			return new Promise(async resolve => {
				// store 赋值
				state.menuData = await dispatch('d2admin/db/get', {
					dbName: 'sys',
					path: 'menu.menuData',
					defaultValue: {},
					user: true
				}, {
					root: true
				})
				// end
				resolve()
			})
		}
	},
	mutations: {
		/**
		 * @description 设置顶栏菜单
		 * @param {Object} state state
		 * @param {Array} menu menu setting
		 */
		headerSet(state, menu) {
			// store 赋值
			state.header = supplementMenuPath(menu)
		},
		/**
		 * @description 设置侧边栏菜单
		 * @param {Object} state state
		 * @param {Array} menu menu setting
		 */
		asideSet(state, menu) {
			state.aside = supplementMenuPath(filterAsyncMenu(menu));
		}
	}
}
