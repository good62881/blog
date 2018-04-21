import '../../css/common.less';
import '../../css/admin/index.less';

//vue相关
import Vue from 'vue';
import Resource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Resource);
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
		that.$http.post("/adminApi/getArticleNum").then(function(res) {
			if (!res.body.code) {
				that.num=res.body.data
			} else {
				that.$message.error(res.body.msg);
			}
		});
	},
});
