
<template>
<div class="top fix">
	<div class="nav">
		<ul class="fix">
			<li><router-link to="/">文章</router-link></li>
			<li><router-link to="/code">代码</router-link></li>
			<li><router-link to="/picture">图片</router-link></li>
			<li><router-link :to="{ name: 'articleDetail', params: { id: '5abde7b8da4d1b05ccf1c881' }}">关于</router-link></li>
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