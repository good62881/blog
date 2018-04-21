import '../../css/common.less';
import '../../css/page/articleDetail.less';

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

//解析Params
import params from '../../js/Params.js';


var app = new Vue({
	el: '#app',
	data: {
		detail: {
			name: '',
			date: '',
			tags: '',
			content: '',
		},
	},
	components: {
		CTop: CTop,
		CRight: CRight
	},
	directives: {
		cutHtml: function(el) {
			var _blocks = el.querySelectorAll('pre');
			_blocks.forEach(function(block) {
				hljs.highlightBlock(block)
			});
		}
	},
	created: function() {
		//获取文章详情
		var that = this;
		if (params.id) {
			that.$http.post("/Api/getArticleDetail", {id:params.id}).then(function(res) {
				if (!res.body.code) {
					that.detail = res.body.data
				} else {
					that.$message.error(res.body.msg);
				}
			});
		}
		
	},
});