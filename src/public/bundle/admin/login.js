import '../../css/common.less';
import '../../css/admin/login.less';

//vue相关
import Vue from 'vue';
import Resource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Resource);
Vue.use(ElementUI);

var app = new Vue({
	el: "#app",
	data:{
		login:{
			account:'',
			pass:''
		}
	},
	methods: {
		submit: function() {
			var that = this;
			that.$refs['login'].validate(function(valid) {
				if (valid) {
					that.$http.post("/adminApi/login",that.login).then(function(res){
						if (!res.body.code) {
							location = '/admin/index'
						} else {
							that.$message.error(res.body.msg);
						}
					});
				}
			});
		}
	}
});