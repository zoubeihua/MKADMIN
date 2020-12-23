export default {
	namespaced: true,
	state: {
		// 用户权限
		permissions: []
	},
	actions: {

	},
	mutations: {
		permissionsSet(state, data) {
			state.permissions = data;
		}
	}
}
