import '../../css/common.less';
import '../../font/iconfont.css';
import '../../css/admin/article.less';

//vue相关
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router';

//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'


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
			pageSize: 10,
			loading: false,
			searchForm: {
				date: '',
				class: '',
				visible: true,
				type: 'name',
				val: '',
				sort: 1
			},
			formCopy: '',
			tableData: '',
			tableSelect: []
		};
	},
	created: function() {
		this.search();
	},
	filters: {
		dateFilter: function(val) {
			return (new Date(val)).toLocaleDateString()
		}
	},
	methods: {
		//获取列表
		getData: function(data) {
			var that = this;
			that.loading = true;
			var _data = {
				date: data.date,
				class: data.class,
				visible: data.visible,
				type: data.type,
				val: data.val,
				sort: data.sort,
				pageNo: that.pageNo,
				pageSize: that.pageSize,
			};
			$.post("/adminApi/getArticleList", _data, function(res) {
				if (!res.code) {
					that.tableData = res.data
				} else {
					that.$message.error(res.msg);
				}
				that.loading = false;
			});
		},
		search: function() {
			if (!this.loading) {
				//保存搜索条件
				this.formCopy = JSON.parse(JSON.stringify(this.searchForm));
				if (this.pageNo == 1) {
					this.getData(this.searchForm);
				} else {
					this.pageNo = 1;
				}
			}
		},
		goPage: function(i) {
			this.pageNo = i;
			this.getData(this.formCopy);
		},
		changeSize: function(i) {
			this.pageSize = i;
			if (this.pageNo == 1) {
				this.getData(this.formCopy);
			} else {
				this.pageNo = 1;
			}
		},
		sortSet: function(v) {
			var that = this;
			for (var p in that.sortDf) {
				if (p == v) {
					that.sortDf[p] = !that.sortDf[p]
				} else {
					delete that.sortDf[p];
					that.$set(that.sortDf, v, 1);
				}
			};
			if (that.formCopy) {
				that.formCopy.pageNo = 1;
				that.getData(that.formCopy);
			}
		},
		//多选
		selection: function(a) {
			this.tableSelect = a;
		},
		//批量操作
		selectionOpt: function(a) {
			var that = this;
			if (a == 1) {
				that.toggleArticle(that.tableSelect, !that.tableSelect[0].visible)
			} else if (a == 2) {
				that.$confirm('批量删除已选文章?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					callback: function(action) {
						if (action == 'confirm') {
							that.delArticle(that.tableSelect)
						}
					}
				});
			}
		},
		//操作
		editArticle: function(id) {
			location = '/admin/article#/articleEdit/' + id
		},
		toggleArticle: function(id, visible) {
			var that = this;
			var _id = (typeof id == 'string') ? [id] : id.map(function(x) {
				return x._id
			});
			$.post("/adminApi/toggleArticle", {
				id: _id,
				visible: visible
			}, function(res) {
				if (!res.code) {
					that.search();
					that.$message.success('操作成功！');
				} else {
					that.$message.error(res.msg);
				}
			});
		},
		delArticle: function(id) {
			var that = this;
			var _id = (typeof id == 'string') ? [id] : id.map(function(x) {
				return x._id
			});
			$.post("/adminApi/delArticle", {
				id: _id
			}, function(res) {
				if (!res.code) {
					that.search();
					that.$message.success('删除成功！');
					document.body.click()
				} else {
					that.$message.error(res.msg);
				}
			});
		},

	}
});



//发布新文章

var articleEdit = Vue.extend({
	template: '#articleEdit',
	data: function() {
		var that = this;
		return {
			tit: '发布文章',
			tagVisible: false,
			tagValue: '',
			uploadVisible: false,
			isSubmit: false,
			editorOption: {
				placeholder: '请输入内容……',
				modules: {
					syntax: {
						highlight(text) {
							const result = hljs.highlightAuto(text)
							return result.value
						}
					},
					toolbar: {
						container: [
							['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
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
							['link', 'image', 'clean']
						], // 工具栏
						handlers: {
							'image': function(value) {
								if (value) {
									that.uploadVisible = true;
								} else {
									this.quill.format('image', false);
								}
							}
						}
					}
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
	created: function() {
		//是否编辑
		var that = this;
		if (that.$route.params.id) {
			$.post("/adminApi/getArticle", {
				id: that.$route.params.id
			}, function(res) {
				if (!res.code) {
					that.form = res.data
				} else {
					that.$message.error(res.msg);
				}
			});
		}
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
		articleImgUpload: function(res) {
			if (!res.code) {
				//插入图片
				var _quill = this.$refs.myTextEditor.quill;
				_quill.focus();  //非常重要！一定先让编辑框获得焦点，否则获取不到getSelection()光标位置
				var _length = _quill.getSelection().index;
				_quill.insertEmbed(_length, 'image', res.url);
				_quill.setSelection(_length + 1);

				this.$refs.upload.clearFiles();
				this.uploadVisible = false;
			} else {
				this.$message.error(res.msg);
				this.$refs.upload.abort();
			}
		},
		submitForm: function() {
			var that = this;
			that.$refs['form'].validate(function(valid) {
				if (valid) {
					that.isSubmit = true
					$.post('/adminApi/updateArticle', that.form, function(res) {
						if (!res.code) {
							that.$message({
								message: '发布成功！',
								type: 'success',
								duration: 2000,
								onClose: function() {
									location = '/admin/article#/articleList'
								}
							});
						} else {
							that.isSubmit = false;
							that.$message.error(res.msg);
						}
					});
				}
			});
		},
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
			children: [{
				path: ':id',
				component: articleEdit
			}, ]
		}, {
			path: '*',
			redirect: '/articleList'
		}]
	})
});