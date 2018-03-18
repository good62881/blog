import '../../css/common.less';
import '../../css/page/code.less';

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

var app = new Vue({
	el: '#app',
	data: {
		pageNo: 1,
		pageSize: 10,
		searchForm:{
			startDate: '',
			endDate: '',
			type: '',
			val: '',
		},
		codeList: ''
	},
	components: {
		CTop: CTop,
		CRight: CRight
	},
	directives: {
		highlight: function(el, binding) {
			$(el).empty();
			
			var _p = $(binding.value).filter('pre').first()
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
				startDate: this.searchForm.startDate,
				endDate: this.searchForm.endDate,
				type: this.searchForm.type,
				val: this.searchForm.val,
				class: 2,
				pageNo: that.pageNo,
				pageSize: that.pageSize,
			};
			$.post("/Api/getArticleList", _data, function(res) {
				if (!res.code) {
					that.codeList = res.data
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