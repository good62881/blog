import '../../css/common.less';
import '../../css/admin/edit.less';

//vue相关
import Vue from 'vue';
import Resource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router';

Vue.use(Resource);
Vue.use(ElementUI);
Vue.use(VueRouter)

//公共
import CTop from '../../../views/admin/top.vue';
import CNav from '../../../views/admin/nav.vue';


//修改基本信息
var editInfo = Vue.extend({
	props: ['info'],
	template: '#editInfo',
	data: function() {
		return {
			editTab: false,
			editForm:{
				name:'',
				age:0,
				job:'',
				email:''
			}
		};
	},
	methods: {
		isEdit: function() {
			this.editForm = JSON.parse(JSON.stringify(this.info,['name','age','job','email']));
			this.editTab = true;
		},
		tabEdit: function() {
			this.editTab = false;
			this.$refs['editForm'].resetFields();
		},
		submitForm: function() {
			var that = this;
			that.$refs['editForm'].validate(function(valid) {
				if (valid) {
					that.$http.post("/adminApi/editInfo",that.editForm).then(function(res){
						if (!res.body.code) {
							app.$refs.CTop.getInfo();
							that.tabEdit();
							that.$message.success('修改成功！');
						} else {
							that.$message.error(res.body.msg);
						}
					});
				}
			});
		}
	}
});



//修改密码
var editPass = Vue.extend({
	template: '#editPass',
	data: function() {
		var that = this;
		return {
			onEdit: false,
			editPass: {
				pass: "",
				newPass: "",
				checkPass: ""
			},
			rules: {
				newPass: [{
					validator: function(rule, value, callback) {
						if (value === '') {
							callback(new Error('请输入密码'));
						} else if (!(/^[A-Za-z0-9]{6,32}$/.test(value))) {
							callback(new Error('请输入6-32位数字或字母'));
						} else {
							if (that.editPass.checkPass !== '') {
								that.$refs.editPass.validateField('checkPass');
							}
							callback();
						}
					},
					required: true
				}],
				checkPass: [{
					validator: function(rule, value, callback) {
						if (value === '') {
							callback(new Error('请再次输入密码'));
						} else if (value !== that.editPass.newPass) {
							callback(new Error('两次输入密码不一致!'));
						} else {
							callback();
						}
					},
					required: true
				}]
			}
		};
	},
	methods: {
		submitForm: function() {
			var that = this;
			that.onEdit=true;
			that.$refs['editPass'].validate(function(valid) {
				if (valid) {
					that.$http.post("/adminApi/editPass",that.editPass).then(function(res){
						if (!res.body.code) {
							that.$message({
								message: '修改成功,请用新密码重新登录！',
								type: 'success',
								duration: 2000,
								onClose: function() {
									location='/admin/out'
								}
							});
						} else {
							that.onEdit=false;
							that.$message.error(res.body.msg);
						}
					});
				}
			});
		}
	}
});



//主体
var app = new Vue({
	el: "#app",
	data: {
		userInfo:'',
	},
	components: {
		CNav: CNav,
		CTop: CTop
	},
	computed:{
		navNow:function() {
			return {tab:this.$route.name,tit:this.$route.name=='editInfo'?'基本资料':'修改密码'};
		}
	},
	created: function() {
		
	},
	methods: {
		tabTit: function(tab) {
			this.navNow.tab= tab;
		},
		avatarUpload:function(res) {
			if (!res.code) {
				this.$refs.CTop.getInfo();
				this.$message.success('上传成功！');
			} else {
				this.$message.error(res.msg);
			}
		}
	},
	router: new VueRouter({
		routes: [{
			path: '/editInfo',
			name:'editInfo',
			component: editInfo,
		}, {
			path: '/editPass',
			name:'editPass',
			component: editPass,
		}, {
			path: '*',
			redirect: '/editInfo'
		}]
	})
});

