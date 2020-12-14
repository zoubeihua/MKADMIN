<template>
	 <transition :name="transitionActive ? 'fade-transverse' : ''">
		<keep-alive :include="keepAlive">
			<router-view></router-view>
		</keep-alive>
	</transition>
</template>
<script>
	import { mapState } from 'vuex'
// 中间件的方式实现嵌套路由
    export default {
		computed:{
			...mapState('d2admin', {
			  keepAlive: state => state.page.keepAlive,
			  transitionActive: state => state.transition.active,
			}),
		}
    }
</script>
