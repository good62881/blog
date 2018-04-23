import '../../css/common.less';
import '../../css/index.less';

//vue相关
import Vue from 'vue';
import Resource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';

Vue.use(Resource);
Vue.use(ElementUI);
Vue.use(VueRouter)


//公共
import CTop from '../../../views/page/top.vue';
import CRight from '../../../views/page/right.vue';

//主体
import article from '../../../views/page/article.vue';
import code from '../../../views/page/code.vue';
import search from '../../../views/page/search.vue';
import articleDetail from '../../../views/page/articleDetail.vue';
import picture from '../../../views/page/picture.vue';


var app = new Vue({
	el: '#app',
	components: {
		CTop: CTop,
		CRight: CRight
	},
	router: new VueRouter({
		routes: [{
			path: '/article',
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
			path: '/articleDetail',
			name: 'articleDetail',
			component: articleDetail,
			children: [{
				path: ':id',
				component: articleDetail
			}]
		},{
			path: '/picture',
			name: 'picture',
			component: picture,
		},{
			path: '*',
			redirect: '/article'
		}]
	})
});