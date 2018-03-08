import '../../css/common.less';
import '../../font/iconfont.css';
import '../../css/admin/article.less';

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


//文章列表
var articleList = Vue.extend({
	template: '#articleList',
	data: function() {
		return {
			tit: '文章管理',
			pageNo: 1,
			pageSize: 20,
			searchForm: {
				date: '',
				status: 0,
				type: 'tit',
				val: '',
				sort:1
			},
			tableData: [{
				date: '2016-05-03',
				tit: '王小虎',
				tag: '上海市普陀区金沙江路 1518 弄',
				PV:1,
				status:1
			}, {
				date: '2016-05-02',
				tit: '王小虎',
				tag: '上海市普陀区金沙江路 1518 弄',
				PV:1,
				status:1
			}, {
				date: '2016-05-04',
				tit: '王小虎',
				tag: '上海市普陀区金沙江路 1518 弄',
				PV:1,
				status:1
			}, {
				date: '2016-05-01',
				tit: '王小虎',
				tag: '上海市普陀区金沙江路 1518 弄',
				PV:1,
				status:1
			}, {
				date: '2016-05-08',
				tit: '王小虎',
				tag: '上海市普陀区金沙江路 1518 弄',
				PV:1,
				status:1
			}, {
				date: '2016-05-06',
				tit: '王小虎',
				tag: '上海市普陀区金沙江路 1518 弄',
				PV:1,
				status:1
			}, {
				date: '2016-05-07',
				tit: '王小虎',
				tag: '上海市普陀区金沙江路 1518 弄',
				PV:1,
				status:1
			}],
		};
	},
	methods: {
		isEdit: function() {
			this.editForm = JSON.parse(JSON.stringify(this.info, ['name', 'age', 'job', 'email']));
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
					$.post("/adminApi/editInfo", that.editForm, function(res) {
						if (!res.code) {
							app.$refs.CTop.getInfo();
							that.tabEdit();
							that.$message.success('修改成功！');
						} else {
							that.$message.error(res.msg);
						}
					});
				}
			});
		}
	}
});



//修改密码
var articleEdit = Vue.extend({
	template: '#articleEdit',
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
			that.onEdit = true;
			that.$refs['editPass'].validate(function(valid) {
				if (valid) {
					$.post("/adminApi/editPass", that.editPass, function(res) {
						if (!res.code) {
							that.$message({
								message: '修改成功,请用新密码重新登录！',
								type: 'success',
								duration: 2000,
								onClose: function() {
									location = '/admin/out'
								}
							});
						} else {
							that.onEdit = false;
							that.$message.error(res.msg);
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
		userInfo: '',
		navNow: 'article',
	},
	components: {
		CNav: CNav,
		CTop: CTop
	},
	created: function() {

	},
	methods: {
		avatarUpload: function(res) {
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
			path: '/articleList',
			name: 'articleList',
			component: articleList,
		}, {
			path: '/articleEdit',
			name: 'articleEdit',
			component: articleEdit,
		}, {
			path: '*',
			redirect: '/articleList'
		}]
	})
});