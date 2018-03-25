import '../../css/common.less';
import '../../css/admin/pictureList.less';

//vue相关
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

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
		editCopy:''
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
					$.post('/adminApi/editPictureList', that.addForm, function(res) {
						if (!res.code) {
							that.$message.success('新建成功！');
							that.isAdd=false;
							that.search();
						} else {
							that.$message.error(res.msg);
						}
						that.isSubmit = false;
					});
				}
			});
		},
		search:function() {
			//获取相册列表
			var that = this;
			$.post("/adminApi/getPictureList",function(res){
				if (!res.code) {
					res.data.forEach(function(v,i,a) {
						a[i].isEdit=false
					})
					that.list=res.data;
				} else {
					that.$message.error(res.msg);
				}
			});
		},
		//相册操作
		selectionOpt: function(o) {
			var that = this;
			if (o.type == 1) {
				that.togglePictureList(o.id,o.visible)
			} else if (o.type == 2) {
				this.list.forEach(function(v,i,a) {
					a[i].isEdit=false
				});
				o.item.isEdit=true;
				this.editCopy=JSON.parse(JSON.stringify(o.item));
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
			$.post("/adminApi/togglePictureList", {
				id: id,
				visible: visible
			}, function(res) {
				if (!res.code) {
					that.search();
					that.$message.success('操作成功！');
				} else {
					that.$message.error(res.msg);
				}
			});
		},
		editPictureList: function() {
			var that = this;
			that.$refs['editCopy'][0].validate(function(valid) {
				if (valid) {
					$.post("/adminApi/editPictureList",that.editCopy, function(res) {
						if (!res.code) {
							that.search();
							that.$message.success('操作成功！');
						} else {
							that.$message.error(res.msg);
						}
					});
				}
			});
		},
		delPictureList: function(id) {
			var that = this;
			$.post("/adminApi/delPictureList",{id:id}, function(res) {
				if (!res.code) {
					that.search();
					that.$message.success('删除成功！');
				} else {
					that.$message.error(res.msg);
				}
			});
		},
		goLink:function(id) {
			location = '/admin/picture?id='+id
		}
	}
});