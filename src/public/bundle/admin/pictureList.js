import '../../css/common.less';
import '../../css/admin/pictureList.less';

//vue相关
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router';

Vue.use(ElementUI);
Vue.use(VueRouter)

//公共
import CTop from '../../../views/admin/top.vue';
import CNav from '../../../views/admin/nav.vue';


//相册列表
var pictureList = Vue.extend({
	template: '#pictureList',
	data: function() {
		return {
			tit: '相册列表',
			list:''
		};
	},
	created: function() {
		//获取相册列表
		var that = this;
		$.post("/adminApi/getPictureList",function(res){
			if (!res.code) {
				that.list=res.data;
			} else {
				that.$message.error(res.msg);
			}
		});
	},
	methods: {

	}
});


//相册编辑
var pictureListEdit = Vue.extend({
	template: '#pictureListEdit',
	data: function() {
		var that = this;
		return {
			tit: '相册编辑',
		};
	},
	created: function() {
		
	},
	methods: {
		
	}
});


//主体
var app = new Vue({
	el: "#app",
	data: {
		userInfo: '',
		navNow: 'pictureList'
	},
	components: {
		CNav: CNav,
		CTop: CTop
	},
	created: function() {

	},
	methods: {

	},
	router: new VueRouter({
		routes: [{
			path: '/pictureList',
			name: 'pictureList',
			component: pictureList,
		}, {
			path: '/pictureListEdit',
			name: 'pictureListEdit',
			component: pictureListEdit,
			children: [{
				path: ':id',
				component: pictureListEdit
			}, ]
		}, {
			path: '*',
			redirect: '/pictureList'
		}]
	})
});