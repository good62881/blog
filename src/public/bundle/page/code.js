import '../../css/common.less';
import '../../css/page/code.less';

//vue相关
import Vue from 'vue';
import Resource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Resource);
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
		codeList: ''
	},
	components: {
		CTop: CTop,
		CRight: CRight
	},
	directives: {
		highlight: function(el, binding) {
			el.innerHTML = '';

			var _dom = document.createElement('div');
			_dom.innerHTML = binding.value;
			el.appendChild(_dom.querySelectorAll('pre')[0]);

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
				class: 2,
				pageNo: that.pageNo,
				pageSize: that.pageSize,
			};
			that.$http.post("/Api/getArticleList", _data).then(function(res) {
				if (!res.body.code) {
					that.codeList = res.body.data
				} else {
					that.$message.error(res.body.msg);
				}
			});
		},
		goPage: function(i) {
			this.pageNo = i;
			this.search();
		},
	}
});