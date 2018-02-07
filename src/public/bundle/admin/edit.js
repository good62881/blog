import '../../css/common.less';
import '../../font/iconfont.css';
import '../../css/admin/edit.less';

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


//修改基本信息
var editInfo = Vue.extend({
	props: ['info'],
	template: '#editInfo',
	data: function() {
		return {
			onEdit: false,
			editForm:''
		};
	},
	methods: {
		isEdit: function() {
			this.editForm = JSON.parse(JSON.stringify(this.info));
			this.onEdit = true;
		},
		tabEdit: function() {
			this.onEdit = false;
			this.$refs['editForm'].resetFields();
		},
		// submitForm: function() {
		// 	var that = this;
		// 	that.$refs['editForm'].validate(function(valid) {
		// 		if (valid) {
		// 			that.$http.post('/edit/editInfo', that.editForm).then(function(res) {
		// 				if (!res.body.code) {
		// 					that.$message.error(res.body.msg)
		// 				} else {
		// 					that.$message({
		// 						message: res.body.msg,
		// 						type: 'success',
		// 						duration: 1000,
		// 						onClose: function() {
		// 							location.reload()
		// 						}
		// 					});
		// 				}
		// 			});
		// 		}
		// 	});
		// }
	}
});



//修改密码
var editPass = Vue.extend({
	template: '#editPass',
	data: function() {
		var that = this;
		return {
			editPass: {
				pass: "",
				newPass: "",
				checkPass: ""
			},
			rules: {
				pass: [{
					required: true,
					message: '请输入密码',
				}, {
					max: 20,
					message: '密码不超过 20 个字符',
				}],
				newPass: [{
					validator: function(rule, value, callback) {
						if (value === '') {
							callback(new Error('请输入密码'));
						} else if (value.length > 20) {
							callback(new Error('密码不能超过20位字符'));
						} else if (value == that.editPass.pass) {
							callback(new Error('不能与原密码一样'));
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
		submitForm: function(formName) {
			var that = this;
			that.$refs[formName].validate(function(valid) {
				if (valid) {
					that.$http.post('/edit/editPass', that.editPass).then(function(res) {
						if (!res.body.code) {
							that.$message.error(res.body.msg)
						} else {
							that.$message({
								message: res.body.msg,
								type: 'success',
								duration: 2000,
								onClose: function() {
									location = '/out'
								}
							});
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
		navNow:'editInfo',
		tit: '基本资料',
		imgDialog: false,
	},
	components: {
		CNav: CNav,
		CTop: CTop
	},
	computed: {
		tab: function() {
			return this.$route.name
		}
	},
	created: function() {
		
	},
	methods: {
		tabTit: function(tab) {
			this.tit = tab._props.label;
			location = '/edit#/' + tab._props.name;
		},
		beforeAvatarUpload: function(file) {
			const isJPG = file.type === 'image/jpeg';
			const isLt2M = file.size / 1024 < 100;

			if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG 格式!');
			}
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 100K!');
			}
			return isJPG && isLt2M;
		},
		handleAvatarSuccess: function(res) {
			if (!res.code) {
				this.$message.error(res.msg)
			} else {
				this.imgDialog = false;
				this.$message({
					message: '上传成功！',
					type: 'success',
					duration: 1000,
					onClose: function() {
						location.reload()
					}
				});
			}
		}
	},
	router: new VueRouter({
		routes: [{
			path: '/',
			name: 'editInfo',
			component: editInfo,
			beforeEnter: function(to, from, next) {
				document.title = '基本资料';
				next();
			}
		}, {
			path: '/editPass',
			name: 'editPass',
			component: editPass,
			beforeEnter: function(to, from, next) {
				document.title = '修改密码';
				next();
			}
		}, {
			path: '*',
			redirect: '/'
		}]
	})
});

