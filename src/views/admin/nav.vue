<template>
<el-col :span="4" class="nav">
	<el-menu :default-active="now">
		<el-menu-item index="index"><a href="/admin/index"><i class="el-iconadd el-iconadd-shouye"></i>首页</a></el-menu-item>
		<el-submenu index="edit">
			<template slot="title"><i class="el-icon-setting"></i>账户设置</template>
			<el-menu-item index="editInfo"><a href="/admin/edit#">基本资料</a></el-menu-item>
			<el-menu-item index="editPass"><a href="/admin/edit#/editPass">修改密码</a></el-menu-item>
		</el-submenu>
	</el-menu>
</el-col>
</template>

<script>

export default {
	props: ['now'],
	data: function () {
		return {}
	},
	created: function() {
		
	},
	methods: {
		
	}
}
</script>

<style lang="less" rel="stylesheet/less"> 
.nav{
	margin-bottom:-9999px; padding-bottom:9999px; background:#eef1f6;
	a{ display:block; color:#48576a; text-decoration:none;}
	.el-menu-item .el-iconadd{ display: inline-block; margin-right:5px; width: 24px; text-align: center; font-size: 18px;}
	.el-menu-item.is-active a{ color:#20a0ff;}
}

</style>