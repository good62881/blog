import '../../css/common.less';
import '../../css/index.less';

//vue相关
import Vue from 'vue';
import Resource from 'vue-resource';
import VueRouter from 'vue-router';

Vue.use(Resource);
Vue.use(VueRouter)

//element-ui的css  重要！开启按需加载时需提前引入与.babelrc配置对应
import 'element-ui/lib/theme-chalk/index.css';

//公共
import CTop from './components/top.vue';
import CRight from './components/right.vue';

//主体
const article = () => import('./components/article.vue')
const code = () => import('./components/code.vue')
const search = () => import('./components/search.vue')
const articleDetail = () => import('./components/articleDetail.vue')
const picture = () => import('./components/picture.vue')


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