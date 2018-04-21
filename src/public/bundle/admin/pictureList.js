import '../../css/common.less';
import '../../css/admin/pictureList.less';

//vue相关
import Vue from 'vue';
import Resource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Resource);
Vue.use(ElementUI);

//公共
import CTop from '../../../views/admin/top.vue';
import CNav from '../../../views/admin/nav.vue';

import '../../images/noCover.png';


//主体
var app = new Vue({
	el: "#app",
	data: {
		userInfo: '',
		navNow: 'pictureList',
		isAdd:false,
		addForm:{
			name:'',
			visible:true
		},
		isSubmit:false,
		list: '',
		editCopy:'',
		coverList:'',
		coverDialogVisible:false
	},
	components: {
		CNav: CNav,
		CTop: CTop
	},
	created: function() {
		this.search();
	},
	methods: {
		//新建相册
		addPictureList:function() {
			var that = this;
			that.$refs['addForm'].validate(function(valid) {
				if (valid) {
					that.isSubmit = true
					that.$http.post('/adminApi/editPictureList', that.addForm).then(function(res) {
						if (!res.body.code) {
							that.$message.success('新建成功！');
							that.isAdd=false;
							that.search();
						} else {
							that.$message.error(res.body.msg);
						}
						that.isSubmit = false;
					});
				}
			});
		},
		search:function() {
			//获取相册列表
			var that = this;
			that.$http.post("/adminApi/getPictureList").then(function(res){
				if (!res.body.code) {
					res.body.data.forEach(function(v,i,a) {
						a[i].isEdit=false
					})
					that.list=res.body.data;
				} else {
					that.$message.error(res.body.msg);
				}
			});
		},
		//相册操作
		selectionOpt: function(o) {
			var that = this;
			if (o.type == 1) {
				that.togglePictureList(o.id,o.visible)
			} else if (o.type == 2) {
				that.list.forEach(function(v,i,a) {
					a[i].isEdit=false
				});
				o.item.isEdit=true;
				that.editCopy=JSON.parse(JSON.stringify(o.item));
			} else if (o.type == 3) {
				that.$confirm('确认删除相册？关联图片将全部删除，请谨慎操作！', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					callback: function(action) {
						if (action == 'confirm') {
							that.delPictureList(o.id)
						}
					}
				});
			}
		},
		togglePictureList: function(id, visible) {
			var that = this;
			that.$http.post("/adminApi/togglePictureList", {
				id: id,
				visible: visible
			}).then(function(res) {
				if (!res.body.code) {
					that.search();
					that.$message.success('操作成功！');
				} else {
					that.$message.error(res.body.msg);
				}
			});
		},
		editPictureList: function() {
			var that = this;
			that.$refs['editCopy'][0].validate(function(valid) {
				if (valid) {
					that.$http.post("/adminApi/editPictureList",that.editCopy).then(function(res) {
						if (!res.body.code) {
							that.search();
							that.$message.success('操作成功！');
						} else {
							that.$message.error(res.body.msg);
						}
					});
				}
			});
		},
		delPictureList: function(id) {
			var that = this;
			that.$http.post("/adminApi/delPictureList",{id:id}).then(function(res) {
				if (!res.body.code) {
					that.search();
					that.$message.success('删除成功！');
				} else {
					that.$message.error(res.body.msg);
				}
			});
		},

		//封面操作
		getCoverList:function(id) {
			var that = this;
			that.$http.post("/adminApi/getPicture", {
				id: id
			}).then(function(res) {
				if (!res.body.code) {
					if (res.body.data[0]) {
						that.coverList = res.body.data;
						that.coverDialogVisible=true
					}else{
						that.$message.error('相册内暂无图片！');
					}
				} else {
					that.$message.error(res.body.msg);
				}
			});
		},
		setPictureListCover: function(id, src) {
			var that = this;
			that.$http.post("/adminApi/setPictureListCover", {
				id: id,
				src: src
			}).then(function(res) {
				if (!res.body.code) {
					that.search();
					that.coverDialogVisible=false;
					that.$message.success('设置成功！');
				} else {
					that.$message.error(res.body.msg);
				}
			});
		},


		goLink:function(id) {
			location = '/admin/picture?id='+id
		},
	}
});