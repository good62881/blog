<template>
<div class="con">
	<div class="list">
		<h2 class="title">{{detail.name}}</h2>
		<div class="info">
			发布于：{{new Date(detail.date).toLocaleDateString()}}&nbsp;&nbsp;&nbsp;
			<template v-if="detail.update">更新于：{{new Date(detail.update).toLocaleDateString()}}&nbsp;&nbsp;&nbsp;</template>
			<template v-if="detail.tags[0]">标签：{{detail.tags.join(',')}}</template>
		</div>
		<div v-html="detail.content" v-cut-html class="article">
			
		</div>
	</div>
</div>
</template>

<script>
//代码高亮
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'


export default {
	data: function () {
		return {
			detail: {
				name: '',
				date: '',
				tags: '',
				content: '',
			},
		}
	},
	directives: {
		cutHtml: function(el) {
			//代码高亮
			var _blocks = el.querySelectorAll('pre');
			for (let i = 0; i < _blocks.length; i++) {
				hljs.highlightBlock(_blocks[i])
			}
		}
	},
	watch: {
		'$route': 'getDetail'
	},
	created: function() {
		this.getDetail()
	},
	methods:{
		//获取文章详情
		getDetail:function() {
			var that = this;
			that.$http.post("/Api/getArticleDetail", {id:that.$route.params.id}).then(function(res) {
				if (!res.body.code) {
					that.detail = res.body.data
				} else {
					that.$message.error(res.body.msg);
				}
			});
		}
	},
}
</script>

<style scoped lang="less" rel="stylesheet/less"> 
.title{
	font-size: 24px; font-weight: normal;
	a{color: #666;}
}
.info{color: #ccc; margin-bottom: 10px;}
.list /deep/ .article{
	word-break:break-all;
	h1{font-size: 20px;}
	h2{ font-size: 16px;}
	p{
		&.ql-align-center{text-align:center;}
		&.ql-align-right{text-align:right;}
		&.ql-align-justify{text-align:justify;}
		img{box-shadow:0px 0px 5px 2px #aaa; margin:20px 0; max-width: 100%;}
	}
	ul,ol,blockquote,pre{margin: 10px 0;}
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
	blockquote{border-left:4px solid #ccc; padding-left:16px;}
	pre{ border-radius: 5px; font-family:"Arial";}
}
</style>