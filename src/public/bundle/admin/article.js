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
				class: 0,
				Visible: 0,
				type: 'tit',
				val: '',
				sort:1
			},
			tableData: [{
				date: '2016-05-03',
				tit: '王小虎',
				tag: '上海市普陀区金沙江路 1518 弄',
				PV:1,
				class:1
			}, {
				date: '2016-05-02',
				tit: '王小虎',
				tag: '上海市普陀区金沙江路 1518 弄',
				PV:1,
				class:1
			}, {
				date: '2016-05-04',
				tit: '王小虎',
				tag: '上海市普陀区金沙江路 1518 弄',
				PV:1,
				class:1
			}, {
				date: '2016-05-01',
				tit: '王小虎',
				tag: '上海市普陀区金沙江路 1518 弄',
				PV:1,
				class:1
			}, {
				date: '2016-05-08',
				tit: '王小虎',
				tag: '上海市普陀区金沙江路 1518 弄',
				PV:1,
				class:1
			}, {
				date: '2016-05-06',
				tit: '王小虎',
				tag: '上海市普陀区金沙江路 1518 弄',
				PV:1,
				class:1
			}, {
				date: '2016-05-07',
				tit: '王小虎',
				tag: '上海市普陀区金沙江路 1518 弄',
				PV:1,
				class:1
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



//发布新文章
var articleEdit = Vue.extend({
	template: '#articleEdit',
	data: function() {
		var that = this;
		return {
			tit: '发布文章',
			tagVisible:false,
			tagValue:'',
			form: {
				name: '',
				class: '1',
				tags:['html','vue'],
				visible:true
			},
		};
	},
	methods: {
		// isEdit: function() {
		// 	this.editForm = JSON.parse(JSON.stringify(this.info, ['name', 'age', 'job', 'email']));
		// 	this.editTab = true;
		// },
		// tabEdit: function() {
		// 	this.editTab = false;
		// 	this.$refs['editForm'].resetFields();
		// },
		delTag: function(tag) {
			this.form.tags.splice(this.form.tags.indexOf(tag), 1);
		},
		addTag: function() {
			if (this.tagValue) {
				this.form.tags.push(this.tagValue);
			}
			this.tagVisible = false;
			this.tagValue = '';
		},
		showTagInput: function() {
			this.tagVisible = true;
			this.$nextTick(function(){
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
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