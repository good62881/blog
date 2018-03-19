import '../../css/common.less';
import '../../css/page/index.less';

//vue相关
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);

//公共
import CTop from '../../../views/page/top.vue';
import CRight from '../../../views/page/right.vue';

//代码高亮
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'

//解析Params
import params from '../../js/Params.js';

var app = new Vue({
	el: '#app',
	data: {
		pageNo: 1,
		pageSize: 10,
		searchForm:{
			date:params.date?[new Date(params.date),new Date(params.date.split('/')[0],params.date.split('/')[1]-1,params.date.split('/')[2],23,59,59)]:'',
			class:'',
			type: params.type?params.type:'name',
			val: params.val?decodeURIComponent(params.val):'',
		},
		articleList: ''
	},
	components: {
		CTop: CTop,
		CRight: CRight
	},
	directives: {
		cutHtml: function(el, binding) {
			$(el).empty();
			var _img = $(binding.value).find('img').first();
			if (_img[0]) {
				$(el).append($('<div class="article_img"></div>').append(_img))
			}
			var _p = $(binding.value).filter(':not(:has(img))').slice(0, 3)
			$(el).append(_p);

			var _blocks = el.querySelectorAll('pre');
			_blocks.forEach(function(block) {
				hljs.highlightBlock(block)
			});
		}
	},
	created: function() {
		this.search()
	},
	methods: {
		//获取文章列表
		search: function() {
			var that = this;
			var _data = {
				date: this.searchForm.date,
				class: this.searchForm.class,
				type: this.searchForm.type,
				val: this.searchForm.val,
				pageNo: that.pageNo,
				pageSize: that.pageSize,
			};
			$.post("/Api/getArticleList", _data, function(res) {
				if (!res.code) {
					that.articleList = res.data
				} else {
					that.$message.error(res.msg);
				}
			});
		},
		goPage: function(i) {
			this.pageNo = i;
			this.search();
		},
	}
});