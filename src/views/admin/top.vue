
<template>
<el-row class="top fix">
	<el-col :span="4" class="tc"><h1>后台管理</h1></el-col>
	<el-col :span="20">
		<dl>
			<dt>
				<img :src="info.avatar" alt="">
				<p class="txthide">{{info.name}}</p>
				<p class="txthide"><small>管理员</small></p>
			</dt>
			<dd><a class="el-iconadd el-iconadd-tuichu" href="/admin/out"></a></dd>
			<dd><a class="el-icon-setting" href="/edit#"></a></dd>
		</dl>
	</el-col>
</el-row>
</template>

<script>

export default {
	props: ['userInfo'],
	data: function () {
		return {
			info:''
		}
	},
	created: function() {
		var that=this;
		//获取用户信息
		$.post("/adminApi/getInfo",function(res){
			if (res.code != 0) {
				that.$message.error(res.message);
			} else {
				that.info = res.data;
				that.$emit('update:userInfo', res.data)
			}
		});
	},
	methods: {
		
	}
}
</script>

<style scoped lang="less" rel="stylesheet/less"> 
.top{
	background:#6dc3ea; color:#fff; padding:20px 0;
	h1{ line-height:40px; font-weight:bold; font-size:24px;}
	dl{ float:right;}
	dt,dd{ float:right; padding-right:40px;}
	dt{
		width:200px; line-height:1.5;
		img{ width:40px; height:40px; border-radius:50%; float:left; display:inline; margin-right:15px;}
		small{ color:#c3eafc;}
	}
	dd a{ font-size:24px; line-height:40px; color:#fff; text-decoration:none; }
}
</style>