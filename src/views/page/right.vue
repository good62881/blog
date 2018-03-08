
<template>
<div class="right">
	<div class="right_avatar">
		<img :src="userInfo.avatar" alt="">
	</div>
	<div class="right_num">
		<p>文章<br>245</p><p>照片<br>356</p><p>留言<br>6641</p>
	</div>
	<div class="right_search">
		<!-- <el-input placeholder="请输入搜索内容" size="mini">
			<el-select slot="prepend">
				<el-option label="文章" value="1"></el-option>
				<el-option label="实例" value="2"></el-option>
			</el-select>
		</el-input> -->
	</div>
	<dl class="right_me">
		<dt><a href="#">更多</a>关于我</dt>
		<dd>昵称：{{userInfo.name}}</dd>
		<dd>年龄：{{userInfo.age?userInfo.age:'保密'}}</dd>
		<dd>职业：{{userInfo.job}}</dd>
		<dd>邮箱：{{userInfo.email}}</dd>
	</dl>
	<c-calendar :dayData="{'2017/12/6':10,'2017/12/3':20}" :monthData="{'2017/12':120,'2017/2':20}" :yearData="{'2016':12,'2014':20}" @cbDate="cbDate"></c-calendar>
	<dl class="right_list right_tag">
		<dt>标签云</dt>
		<dd>
			<a href="">node</a>
			<a href="">js</a>
			<a href="">css</a>
			<a href="">html</a>
			<a href="">vue</a>
			<a href="">angular</a>
		</dd>
	</dl>
	<dl class="right_list">
		<dt><a href="#">更多</a>最新文章</dt>
		<dd><span>05-20</span><a href="">哈哈哈哈哈哈哈</a></dd>
		<dd><span>05-07</span><a href="">哈哈哈哈</a></dd>
		<dd><span>05-01</span><a href="">哈哈哈哈哈哈哈哈哈哈</a></dd>
		<dd><span>04-13</span><a href="">哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</a></dd>
		<dd><span>03-17</span><a href="">哈哈哈哈哈</a></dd>
	</dl>
	<dl class="right_list">
		<dt><a href="#">更多</a>最新实例</dt>
		<dd><span>05-20</span><a href="">哈哈哈哈哈哈哈</a></dd>
		<dd><span>05-07</span><a href="">哈哈哈哈</a></dd>
		<dd><span>05-01</span><a href="">哈哈哈哈哈哈哈哈哈哈</a></dd>
		<dd><span>04-13</span><a href="">哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</a></dd>
		<dd><span>03-17</span><a href="">哈哈哈哈哈</a></dd>
	</dl>
	<!-- <dl class="right_list">
		<dt><a href="#">更多</a>热门文章</dt>
		<dd><span>120评论</span><a href="">哈哈哈哈哈哈哈</a></dd>
		<dd><span>2评论</span><a href="">哈哈哈哈</a></dd>
		<dd><span>30评论</span><a href="">哈哈哈哈哈哈哈哈哈哈</a></dd>
		<dd><span>11评论</span><a href="">哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</a></dd>
		<dd><span>200评论</span><a href="">哈哈哈哈哈</a></dd>
	</dl> -->
</div>
</template>

<script>
import CCalendar from './calendar.vue';


export default {
	data: function () {
		return {
			userInfo:'',
		}
	},
	components: {
		CCalendar: CCalendar
	},
	created: function() {
		var that=this;
		//获取个人信息
		$.post("/Api/getInfo",function(res){
			if (!res.code) {
				that.userInfo=res.data
			} else {
				that.$message.error(res.msg);
			}
		});
	},
	methods: {
		cbDate:function(d) {
			console.log(d)
		}
	}
}
</script>

<style scoped lang="less" rel="stylesheet/less"> 
.right{
	width:190px; float: right; padding:20px 20px 0 20px; margin-top: -281px; background: #fff; border: 1px solid #d8d6d6; border-radius:115px 115px 0 0;
	&_avatar,&_num,&_search,&_me,&_list{ margin-bottom: 20px;}
	&_avatar{
		text-align: center; height: 130px; overflow: hidden;
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
		.el-select{ width:80px;}
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