import '../../css/common.less';
import '../../css/admin/login.less';

//vue相关
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

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
					$.post("/adminApi/login",that.login,function(res){
						if (!res.code) {
							location = '/admin/index'
						} else {
							that.$message.error(res.msg);
						}
					});
				}
			});
		}
	}
});