import '../css/common.less';
import '../css/msg.less';

//vue相关
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

Vue.use(ElementUI);

//公共
import CTop from '../../views/top.vue';
import CRight from '../../views/right.vue';

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