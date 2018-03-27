import '../../css/common.less';
import '../../css/admin/picture.less';

//vue相关
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

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
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			on: {
				slideChange: function() {
					app.swiperIndex=this.activeIndex
				},
			},
		},
		previewSwiperOpt: {
			centeredSlides: true,
			slideToClickedSlide: true,
			slidesPerView: 'auto',
			spaceBetween: 20,
		},
		swiperIndex: 0,
		editSwiperInfo:false
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
		swiperInfo:function() {
			return this.list[this.swiperIndex]?this.list[this.swiperIndex]:''
		}
	},
	methods: {
		//获取相册列表
		getPictureList: function() {
			var that = this;
			$.post("/adminApi/getPictureList", function(res) {
				if (!res.code) {
					that.pictureList = res.data;
				} else {
					that.$message.error(res.msg);
				}
			});
		},
		//获取图片列表
		getList: function() {
			var that = this;
			$.post("/adminApi/getPicture", {
				id: that.listId
			}, function(res) {
				if (!res.code) {
					res.data.forEach(function(v, i, a) {
						a[i].isCheck = false
					})
					that.list = res.data;
				} else {
					that.$message.error(res.msg);
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
			$.post("/adminApi/setPictureListCover", {
				id: id,
				src: src
			}, function(res) {
				if (!res.code) {
					that.$message.success('设置成功！');
				} else {
					that.$message.error(res.msg);
				}
			});
		},
		//删除图片
		delPicture: function() {
			var that = this;
			$.post("/adminApi/delPicture", {
				id: that.editList
			}, function(res) {
				if (!res.code) {
					that.getList();
					that.editList = [];
					that.isEdit = false;
					that.checkAll = false;
					that.$message.success('删除成功！');
				} else {
					that.$message.error(res.msg);
				}
			});
		},
		//移动图片
		moveTolist: function(listId) {
			var that = this;
			$.post("/adminApi/moveToPicturelist", {
				id: that.editList,
				listId: listId
			}, function(res) {
				if (!res.code) {
					that.getList();
					that.editList = [];
					that.isEdit = false;
					that.checkAll = false;
					that.moveVisible = false;
					that.$message.success('移动成功！');
				} else {
					that.$message.error(res.msg);
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
				that.swiper.controller.control = that.previewSwiper;
				that.previewSwiper.controller.control = that.swiper;
				that.swiper.slideTo(that.swiperIndex)
			});
		},


	}
});