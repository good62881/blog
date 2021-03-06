import '../../css/common.less';
import '../../css/admin/picture.less';

//vue相关
import Vue from 'vue';
import Resource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

Vue.use(Resource);
Vue.use(ElementUI);
Vue.use(VueAwesomeSwiper)

//公共
import CTop from '../../../views/admin/top.vue';
import CNav from '../../../views/admin/nav.vue';

//解析Params
import params from '../../js/Params.js';

//主体
var app = new Vue({
	el: "#app",
	data: {
		userInfo: '',
		navNow: 'pictureList',
		listId: params.id,
		pictureList: '',
		isEdit: false,
		isUpload: false,
		uploadVisible: false,
		list: '',
		editList: [],
		checkAll: false,
		moveVisible: false,
		showVisible: false,
		swiperOpt: {
			slidesPerView: 1,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			on: {
				slideChange: function() {   //奇怪的BUG，swiper的双向控制写在$nextTick中，会造成其他弹窗打开时页面卡死。
					app.swiperIndex=this.activeIndex;
					app.editSwiperTab=false;
					app.previewSwiper.slideTo(this.activeIndex)
				},
			},
		},
		previewSwiperOpt: {
			allowTouchMove:false,
			centeredSlides: true,
			slideToClickedSlide: true,
			slidesPerView: 'auto',
			spaceBetween: 10,
			on: {
				slideChange: function() {
					app.editSwiperTab=false;
					app.swiper.slideTo(this.activeIndex)
				},
			},
		},
		swiperIndex: 0,
		pictureInfoCopy:'',
		editSwiperTab:false,
	},
	components: {
		CNav: CNav,
		CTop: CTop
	},
	created: function() {
		this.getPictureList()
		this.getList();
	},
	computed: {
		pictureListInfo: function() {
			var that = this;
			return that.pictureList ? that.pictureList.filter(function(x) {
				return x.listId == that.listId
			})[0] : '';
		},
		isIndeterminate: function() {
			return this.editList.length > 0 && this.editList.length < this.list.length
		},
		swiper: function() {
			return this.$refs.swiper.swiper
		},
		previewSwiper: function() {
			return this.$refs.previewSwiper.swiper
		},
		pictureInfo:function() {
			return this.list[this.swiperIndex]?this.list[this.swiperIndex]:''
		}
	},
	methods: {
		//获取相册列表
		getPictureList: function() {
			var that = this;
			that.$http.post("/adminApi/getPictureList").then(function(res) {
				if (!res.body.code) {
					that.pictureList = res.body.data;
				} else {
					that.$message.error(res.body.msg);
				}
			});
		},
		//获取图片列表
		getList: function() {
			var that = this;
			that.$http.post("/adminApi/getPicture", {
				id: that.listId
			}).then(function(res) {
				if (!res.body.code) {
					res.body.data.forEach(function(v, i, a) {
						a[i].isCheck = false
					})
					that.list = res.body.data;
				} else {
					that.$message.error(res.body.msg);
				}
			});
		},
		//图片上传
		pictureUpload: function(res) {
			this.isUpload = false;
		},
		pictureUploadProgress: function() {
			this.isUpload = true
		},
		pictureUploadError: function(err) {
			this.isUpload = false
			this.$message.error('上传失败！');
		},
		maxPicture: function() {
			this.$message.error('最多同时上传5张图片');
		},
		finishUpload: function() {
			this.uploadVisible = false;
			this.$refs.upload.clearFiles();
			this.getList();
		},

		//选择or全选
		addEditList: function(o) {
			var _index = this.editList.indexOf(o._id)
			if (_index == -1) {
				this.editList.push(o._id);
				o.isCheck = true
			} else {
				this.editList.splice(_index, 1);
				o.isCheck = false
			};
			this.checkAll = this.editList.length === this.list.length;
		},
		addAllEditList: function(val) {
			this.list.forEach(function(v, i, a) {
				a[i].isCheck = val ? true : false
			});
			var _arr = this.list.filter(function(v) {
				return !v.formId
			}).map(function(v) {
				return v._id
			});
			this.editList = val ? _arr : [];
		},
		clearEditList: function() {
			this.list.forEach(function(v, i, a) {
				a[i].isCheck = false
			});
			this.editList = [];
			this.isEdit = false;
			this.checkAll = false;
		},



		//批量操作
		editListOpt: function(v) {
			var that = this;
			if (!that.editList.length) {
				that.$message.error('请先选择！');
				return
			}
			if (v == 1) {
				that.moveVisible = true
			} else if (v == 2) {
				that.$confirm('确认删除图片？请谨慎操作！', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					callback: function(action) {
						if (action == 'confirm') {
							that.delPicture();
						}
					}
				});
			}
		},

		//图片操作
		selectionOpt: function(o) {
			var that = this;
			if (o.type == 1) {
				that.setPictureListCover(o.id, o.src);
			} else if (o.type == 2) {
				that.editList = [];
				that.editList.push(o.id);
				that.moveVisible = true
			} else if (o.type == 3) {
				that.$confirm('确认删除图片？请谨慎操作！', '提示', {
					dangerouslyUseHTMLString: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					callback: function(action) {
						if (action == 'confirm') {
							that.editList = [];
							that.editList.push(o.id);
							that.delPicture();
						}
					}
				});
			}
		},
		//设置封面
		setPictureListCover: function(id, src) {
			var that = this;
			that.$http.post("/adminApi/setPictureListCover", {
				id: id,
				src: src
			}).then(function(res) {
				if (!res.body.code) {
					that.$message.success('设置成功！');
				} else {
					that.$message.error(res.body.msg);
				}
			});
		},
		//删除图片
		delPicture: function() {
			var that = this;
			that.$http.post("/adminApi/delPicture", {
				id: that.editList
			}).then(function(res) {
				if (!res.body.code) {
					that.getList();
					that.editList = [];
					that.isEdit = false;
					that.checkAll = false;
					that.$message.success('删除成功！');
				} else {
					that.$message.error(res.body.msg);
				}
			});
		},
		//移动图片
		moveTolist: function(listId) {
			var that = this;
			that.$http.post("/adminApi/moveToPicturelist", {
				id: that.editList,
				listId: listId
			}).then(function(res) {
				if (!res.body.code) {
					that.getList();
					that.editList = [];
					that.isEdit = false;
					that.checkAll = false;
					that.moveVisible = false;
					that.$message.success('移动成功！');
				} else {
					that.$message.error(res.body.msg);
				}
			});
		},
		//显示图片滚动
		showPicture: function(i) {
			if (!this.isEdit) {
				this.showVisible = true;
				this.swiperIndex = i
			}
		},
		reSize: function() { //重要！swiper加载时尺寸的计算会有问题，必须用$nextTick在渲染完成后重新计算。同时重新计算需写在弹窗上，因为渲染时swiper属于弹窗的子组件。
			var that = this;
			that.$nextTick(function() {
				that.swiper.update();
				that.previewSwiper.update();
				// that.swiper.controller.control = that.previewSwiper;
				// that.previewSwiper.controller.control = that.swiper;
				that.swiper.slideTo(that.swiperIndex)
			});
		},

		//编辑图片信息
		editPictureInfo:function() {
			this.pictureInfoCopy=JSON.parse(JSON.stringify(this.pictureInfo));
			this.editSwiperTab=true;

		},
		submitPictureInfo:function() {
			var that = this;
			that.$refs['pictureInfoCopy'].validate(function(valid) {
				if (valid) {
					that.$http.post("/adminApi/editPictureInfo",that.pictureInfoCopy).then(function(res){
						if (!res.body.code) {
							that.getList();
							that.editSwiperTab=false;
							that.$message.success('修改成功！');
						} else {
							that.$message.error(res.body.msg);
						}
					});
				}
			});
		}

	}
});