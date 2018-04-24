<template>
<div class="con">
	<div v-for="item in codeList.list" class="list">
		<h1 class="title"><router-link :to="{ name: 'articleDetail', params: { id: item._id }}">{{item.name}}</router-link></h1>
		<div class="info">发布于：{{new Date(item.date).toLocaleDateString()}}&nbsp;&nbsp;&nbsp;<template v-if="item.tags[0]">标签：{{item.tags.join(',')}}</template></div>
		<div class="code" v-highlight="item.content">
			
		</div>
	</div>
	<div class="tc">
		<el-pagination background layout="total, prev, pager, next, jumper" :page-size="pageSize" :total="codeList.total" @current-change="goPage"></el-pagination>
	</div>
</div>
</template>

<script>
import Vue from 'vue';
import Pagination from 'element-ui';
Vue.use(Pagination)

//代码高亮
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'


export default {
	data: function () {
		return {
			pageNo: 1,
			pageSize: 10,
			codeList: ''
		}
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
.code /deep/ pre{max-height: 12em; border-radius: 5px; font-family:"Arial";}
</style>