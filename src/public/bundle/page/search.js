import '../../css/common.less';
import '../../css/page/index.less';

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
			el.innerHTML = '';
			var _dom = document.createElement('div');
			_dom.innerHTML = binding.value;
			
			var _imgList = _dom.querySelectorAll('img');

			for (var i = 0; i < _imgList.length; i++) {
				if (i == 0) {
					var _img=document.createElement('div');
					_img.setAttribute('class','article_img'); 
					_img.appendChild(_imgList[i])
					el.appendChild(_img)
				}else{
					_imgList[i].parentNode.removeChild(_imgList[i]);
				}
			};
			
			for (let i = 0; i < 3; i++) {
				let _in=_dom.querySelectorAll(':not(:empty)')[i];
				_in && el.appendChild(_in.cloneNode(true))
			};
			
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
			that.$http.post("/Api/getArticleList", _data).then(function(res) {
				if (!res.body.code) {
					that.articleList = res.body.data
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