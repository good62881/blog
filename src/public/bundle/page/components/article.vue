<template>
<div class="con">
	<div v-for="item in articleList.list" class="list">
		<h1 class="title"><router-link :to="{ name: 'articleDetail', params: { id: item._id }}">{{item.name}}</router-link></h1>
		<div class="info">
			发布于：{{new Date(item.date).toLocaleDateString()}}&nbsp;&nbsp;&nbsp;
			<template v-if="item.update">更新于：{{new Date(item.update).toLocaleDateString()}}&nbsp;&nbsp;&nbsp;</template>
			<template v-if="item.tags[0]">标签：{{item.tags.join(',')}}</template>
		</div>
		<div class="article" v-cut-html="item.content">
			
		</div>
	</div>
	<div class="tc">
		<el-pagination background layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="articleList.total" @current-change="goPage"></el-pagination>
	</div>
</div>
</template>

<script>
import Vue from 'vue';
import {Pagination} from 'element-ui';
Vue.use(Pagination)

//代码高亮
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'

export default {
	data: function () {
		return {
			pageNo: 1,
			pageSize: 10,
			articleList: ''
		}
	},
	directives: {
		cutHtml: function(el, binding) {
			el.innerHTML = ''; //先清空
			var _dom = document.createElement('div');
			_dom.innerHTML = binding.value;
			//取第一张图
			var _imgList = _dom.querySelectorAll('img');
			for (let i = 0; i < _imgList.length; i++) {
				if (i == 0) {
					var _img = document.createElement('div');
					_img.setAttribute('class', 'article_img');
					_img.appendChild(_imgList[i])
					el.appendChild(_img)
				} else {
					_imgList[i].parentNode.removeChild(_imgList[i]);
				}
			};

			//取前三个DOM元素
			var _pList = []
			for (let i = 0; i < _dom.childNodes.length; i++) {
				_dom.childNodes[i].textContent && _pList.push(_dom.childNodes[i])
			};
			for (let i = 0; i < 3; i++) {
				let _in = _pList[i];
				_in && el.appendChild(_in.cloneNode(true))
			};

			//代码高亮
			var _blocks = el.querySelectorAll('pre');
			for (let i = 0; i < _blocks.length; i++) {
				hljs.highlightBlock(_blocks[i])
			}
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
	},
}
</script>

<style scoped lang="less" rel="stylesheet/less">
.list{
	border-bottom: 1px solid #eaecec; margin-bottom: 10px; padding-bottom: 10px;
	.title{
		font-size: 24px; font-weight: normal;
		a{color: #666;}
	}
	.info{color: #ccc; margin-bottom: 10px;}
} 
.list /deep/ .article{
	color: #aaa; max-height: 12em; word-break:break-all; overflow:hidden;
	h1{font-size: 20px;}
	h2{ font-size: 16px;}
	p{ text-indent: 2em;}
	li{
		padding-left:1.5em;
		&:before{ margin-left:-1.5em;margin-right:0.3em;text-align:right;display: inline-block; width: 1.2em; content:'\2022';}
	}
	ol li {
		counter-increment: list-0;
		&:before{
			content: counter(list-0, decimal) '. ';
		}
	}
	blockquote{border-left:4px solid #ccc;margin:5px 0; padding-left:16px;}
	pre{ border-radius: 5px; font-family:"Arial";}
	&_img{
		float: right; width: 150px; line-height: 150px; text-align: center; padding: 5px; margin-left: 10px; border: 1px solid #eaecec;
		img{ max-width: 150px; max-height: 150px;}
	}
}
</style>