import '../../css/common.less';
import '../../css/page/picture.less';

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
import CTop from '../../../views/page/top.vue';
import CRight from '../../../views/page/right.vue';

var app = new Vue({
	el: '#app',
	data: {
		pictureList: '',
		list: '',
		showVisible: false,
		swiperOpt: {
			slidesPerView: 1,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			on: {
				slideChange: function() {  
					app.swiperIndex=this.activeIndex;
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
					app.swiper.slideTo(this.activeIndex)
				},
			},
		},
		swiperIndex: 0,
	},
	components: {
		CTop: CTop,
		CRight: CRight
	},
	computed: {
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
	created: function() {
		//获取相册列表
		var that = this;
		that.$http.post("/Api/getPictureList").then(function(res) {
			if (!res.body.code) {
				that.pictureList = res.body.data;
			} else {
				that.$message.error(res.body.msg);
			}
		});
	},
	methods: {
		//展示图片
		showPicture:function(id) {
			var that = this;
			that.$http.post("/Api/getPicture", {
				id: id
			}).then(function(res) {
				if (!res.body.code) {
					if (res.body.data[0]) {
						that.list = res.body.data;
						that.showVisible=true;
					}else{
						that.$message.error('相册内暂无图片！');
					}
				} else {
					that.$message.error(res.body.msg);
				}
			});
		},
		reSize: function() {
			var that = this;
			that.$nextTick(function() {
				that.swiper.update();
				that.previewSwiper.update();
				that.swiper.slideTo(0)
			});
		},
	}
});