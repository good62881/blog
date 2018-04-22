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

var app = new Vue({
	el: '#app',
	data: {
		pageNo: 1,
		pageSize: 10,
		articleList: ''
	},
	components: {
		CTop: CTop,
		CRight: CRight
	},
	directives: {
		cutHtml: function(el, binding) {
			el.innerHTML = '';   //先清空
			var _dom = document.createElement('div');
			_dom.innerHTML = binding.value;
			//取第一张图
			var _imgList = _dom.querySelectorAll('img');
			for (let i = 0; i < _imgList.length; i++) {
				if (i == 0) {
					var _img=document.createElement('div');
					_img.setAttribute('class','article_img'); 
					_img.appendChild(_imgList[i])
					el.appendChild(_img)
				}else{
					_imgList[i].parentNode.removeChild(_imgList[i]);
				}
			};

			//取前三个DOM元素
			var _pList=[]
			for (let i = 0; i < _dom.childNodes.length; i++) {
				_dom.childNodes[i].textContent && _pList.push(_dom.childNodes[i])
			};
			for (let i = 0; i < 3; i++) {
				let _in=_pList[i];
				_in && el.appendChild(_in.cloneNode(true))
			};

			//代码高亮
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
				class: 1,
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