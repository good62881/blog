import '../../css/common.less';
import '../../font/iconfont.css';
import '../../css/admin/article.less';

//vue相关
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router';
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(ElementUI);
Vue.use(VueRouter)
Vue.use(VueQuillEditor)

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
				class: '',
				visible: true,
				type: 'tit',
				val: '',
				sort: 1
			},
			tableData: '',
		};
	},
	created: function() {
		var that = this;
		$.post("/adminApi/getArticleList", that.searchForm, function(res) {
			if (!res.code) {
				that.tableData=res.data.list
			} else {
				that.$message.error(res.msg);
			}
		});
	},
	methods: {
		
	}
});



//发布新文章
var articleEdit = Vue.extend({
	template: '#articleEdit',
	data: function() {
		return {
			tit: '发布文章',
			tagVisible: false,
			tagValue: '',
			isSubmit:false,
			editorOption: {
				placeholder: '请输入内容……',
				modules: {
					toolbar: [
						['bold', 'italic', 'underline', 'strike','blockquote', 'code-block'],
						[{
							'header': 1
						}, {
							'header': 2
						}],
						[{
							'list': 'ordered'
						}, {
							'list': 'bullet'
						}],
						[{
							'script': 'sub'
						}, {
							'script': 'super'
						}],
						[{
							'indent': '-1'
						}, {
							'indent': '+1'
						}],
						[{
							'align': []
						}],
						[{
							'color': []
						}, {
							'background': []
						}],
						['link','image','clean']
					]
				}
			},
			form: {
				name: '',
				class: 1,
				tags: [],
				visible: true,
				content: ''
			},
		};
	},
	methods: {
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
			this.$nextTick(function() {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		submitForm: function() {
			var that = this;
			that.$refs['form'].validate(function(valid) {
				if (valid) {
					that.isSubmit=true
					$.post("/adminApi/newArticle", that.form, function(res) {
						if (!res.code) {
							that.$message({
								message: '发布成功！',
								type: 'success',
								duration: 2000,
								onClose: function() {
									location='/admin/article#/articleList'
								}
							});
						} else {
							that.isSubmit=false;
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
		navNow: 'article'
	},
	components: {
		CNav: CNav,
		CTop: CTop
	},
	created: function() {

	},
	methods: {

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