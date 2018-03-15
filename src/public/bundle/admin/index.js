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
		num:{
			articleNum:0,
			codeNum:0
		}
	},
	components: {
		CNav: CNav,
		CTop: CTop
	},
	created: function() {
		//文章统计
		var that=this;
		$.post("/adminApi/getArticleNum", function(res) {
			if (!res.code) {
				that.num=res.data
			} else {
				that.$message.error(res.msg);
			}
		});
	},
});
