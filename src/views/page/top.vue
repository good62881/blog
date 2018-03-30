
<template>
<div class="top fix">
	<div class="nav">
		<ul class="fix">
			<li><a href="/">文章</a></li>
			<li><a href="/code">代码</a></li>
			<li><a href="/picture">图片</a></li>
			<!-- <li><a href="">实例</a></li>
			<li><a href="">留言</a></li> -->
			<li><a href="/articleDetail?id=5abde7b8da4d1b05ccf1c881">关于</a></li>
		</ul>
	</div>
</div>
</template>


<style scoped lang="less" rel="stylesheet/less"> 
.top{background: url("../../public/images/bg.jpg") no-repeat center top; padding-top: 300px;}

.nav{
	background: #1f7fbb;
	ul{ width: 1000px; margin: 0 auto;}
	li{
		float: left; line-height: 40px;
		a{ color: #fff; padding:0 20px;}
	}
}
</style>