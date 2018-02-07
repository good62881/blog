import '../../css/common.less';
import '../../font/iconfont.css';
import '../../css/admin/index.less';

//vue相关
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);

//公共
import CTop from '../../../views/admin/top.vue';
import CNav from '../../../views/admin/nav.vue';

var app=new Vue({
	el: "#app",
	data:{
		userInfo:'',
		navNow:'index',
	},
	components: {
		CNav: CNav,
		CTop: CTop
	},
});
