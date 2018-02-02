import '../../css/common.less';
import '../../css/page/photo.less';

//vue相关
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);

//公共
import CTop from '../../../views/page/top.vue';
import CRight from '../../../views/page/right.vue';

var app = new Vue({
	el: '#app',
	data: {
		topNow: 'business',

	},
	components: {
		CTop: CTop,
		CRight: CRight
	},
});