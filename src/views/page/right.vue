
<template>
<div class="right">
	<div class="right_avatar">
		<img :src="count.userInfo.avatar" alt="">
	</div>
	<div class="right_num">
		<p>文章<br>{{count.count.article}}</p><p>代码<br>{{count.count.code}}</p><p>图片<br>{{count.count.img}}</p>
	</div>
	<div class="right_search">
		<el-input v-model="search.val" placeholder="请输入搜索内容" @keyup.enter.native="submit" size="mini">
			<el-select v-model="search.type" slot="prepend">
				<el-option label="标题" value="name"></el-option>
				<el-option label="标签" value="tags"></el-option>
			</el-select>
			<i slot="suffix" class="el-input__icon el-icon-search" @click="submit"></i>
		</el-input>
	</div>
	<dl class="right_me">
		<dt>关于我</dt>
		<dd>昵称：{{count.userInfo.name}}</dd>
		<dd>年龄：{{count.userInfo.age?count.userInfo.age:'保密'}}</dd>
		<dd>职业：{{count.userInfo.job}}</dd>
		<dd>邮箱：{{count.userInfo.email}}</dd>
	</dl>
	<c-calendar :dayData="{'2017/12/6':10,'2017/12/3':20}" :monthData="{'2017/12':120,'2017/2':20}" :yearData="{'2016':12,'2014':20}" @cbDate="cbDate"></c-calendar>
	<dl class="right_list right_tag">
		<dt>标签云</dt>
		<dd>
			<router-link v-for="item in count.tags" :to="{ name: 'search', query: { type: 'tags',val: item }}">{{item}}</router-link>
		</dd>
	</dl>
	<dl class="right_list">
		<dt><router-link to="/">更多</router-link>最新文章</dt>
		<dd v-for="item in count.newArticle">
			<span>{{new Date(item.date).getMonth()+1}}-{{new Date(item.date).getDate()}}</span>
			<router-link :to="{ name: 'articleDetail', params: { id: item._id }}">{{item.name}}</router-link>
		</dd>
	</dl>
	<dl class="right_list">
		<dt><router-link to="/code">更多</router-link>最新代码</dt>
		<dd v-for="item in count.newCode">
			<span>{{new Date(item.date).getMonth()+1}}-{{new Date(item.date).getDate()}}</span>
			<router-link :to="{ name: 'articleDetail', params: { id: item._id }}">{{item.name}}</router-link>
		</dd>
	</dl>
</div>
</template>

<script>
import Vue from 'vue';
import Input from 'element-ui';
import Select from 'element-ui';
import Option from 'element-ui';
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);

//日历
import CCalendar from './calendar.vue';

export default {
	data: function () {
		return {
			count:{
				count:'',
				newArticle:'',
				newCode:'',
				userInfo:'',
				tags:''
			},
			search:{
				type: 'name',
				val: '',
			}
		}
	},
	components: {
		CCalendar: CCalendar
	},
	created: function() {
		var that=this;
		//获取个人信息
		that.$http.post("/Api/getInfo").then(function(res){
			if (!res.body.code) {
				that.count=res.body.data
			} else {
				that.$message.error(res.body.msg);
			}
		});
	},
	methods: {
		cbDate:function(d) {
			var _date=d.toString().split('/');
			if(_date.length==3){
				this.$router.push({ name: 'search', query: { date: d }})
			}
			
		},
		submit:function() {
			if (this.search.type && this.search.val) {
				this.$router.push({ name: 'search', query: { type: this.search.type, val: this.search.val}})
			}
		}
	}
}
</script>

<style scoped lang="less" rel="stylesheet/less"> 
.right{
	width:190px; float: right; padding:20px 20px 0 20px; margin-top: -281px; background: #fff; border: 1px solid #d8d6d6; border-radius:115px 115px 0 0;
	&_avatar,&_num,&_search,&_me,&_list{ margin-bottom: 15px;}
	&_avatar{
		text-align: center; height: 140px; overflow: hidden;
		img{ width: 150px; border-radius: 50%}
	}
	&_num{
		height: 50px; overflow: hidden;
		p{
			display: inline-block; text-align: center; width: 33%; border-right: 1px solid #eee; box-sizing: border-box;
			&:last-child{ border-right:none; }
		}
	}
	&_search{
		margin-left: -21px; margin-right: -21px; line-height: 40px; background-color: #1f7fbb;
		.el-select{ width:75px;}
	}
	&_me{
		dt{
			border-left: 3px solid #cf2730; font-size: 16px; line-height: 1; padding-left: 10px; margin-bottom: 10px;
			a{float: right; font-size: 12px;}
		}
	}
	&_list{
		margin-left: -21px; margin-right: -21px;
		dt{
			color: #fff; background-color: #1f7fbb; line-height: 36px; padding: 0 20px 0 30px; margin-bottom: 10px;
			a{float: right; font-size: 12px; color: #fff;}
			&:before{content: ''; position: absolute; width: 0; height:16px; margin: 10px 0 10px -10px; border-left: 3px solid #fff;visibility:visible;}
		}
		dd{
			padding: 0 20px; line-height:30px;overflow:hidden; white-space:nowrap;text-overflow:ellipsis;
			span{float: right; margin-left: 10px; color: #ccc;}
			a{color: #666;}
		}
	}
	&_tag dd a{
		float: left; background-color: #eef1f6;padding: 0 10px; margin: 0 5px 5px 0; line-height: 28px;
		&:hover{ color: #fff; background-color: #2cadff;}
	}
}


.calendar{ margin:0 -21px 20px;}

</style>