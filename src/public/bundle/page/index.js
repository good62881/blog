import '../../css/common.less';
import '../../css/index.less';

//vue相关
import Vue from 'vue';
import Resource from 'vue-resource';
import VueRouter from 'vue-router';

Vue.use(Resource);
Vue.use(VueRouter)


//公共
import CTop from '../../../views/page/top.vue';
import CRight from '../../../views/page/right.vue';

//主体
const article = () => import('../../../views/page/article.vue')
const code = () => import('../../../views/page/code.vue')
const search = () => import('../../../views/page/search.vue')
const articleDetail = () => import('../../../views/page/articleDetail.vue')
const picture = () => import('../../../views/page/picture.vue')


var app = new Vue({
	el: '#app',
	components: {
		CTop: CTop,
		CRight: CRight
	},
	router: new VueRouter({
		routes: [{
			path: '/',
			name: 'article',
			component: article,
		},{
			path: '/code',
			name: 'code',
			component: code,
		},{
			path: '/search',
			name: 'search',
			component: search,
		},{
			path: '/articleDetail/:id',
			name: 'articleDetail',
			component: articleDetail,
		},{
			path: '/picture',
			name: 'picture',
			component: picture,
		},{
			path: '*',
			redirect: '/'
		}]
	})
});