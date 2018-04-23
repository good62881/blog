<template>
<div class="con">
	<el-row class="picture" :gutter="20">
		<el-col :span="8" v-for="item in pictureList">
			<el-card :body-style="{ padding: '10px' }">
				<div class="picture_list" @click="showPicture(item.listId)" :style="item.cover?'background-image:url('+item.cover+')':'background-image:url(/images/noCover.png)'"></div>
				<p>{{item.name}}</p>
				<p>{{ new Date(item.date).toLocaleDateString() }}</p>
			</el-card>
		</el-col>
	</el-row>

	
	<el-dialog class="picture_show" :visible.sync="showVisible" @open="reSize" width="70%">
		<div class="picture_show_box">
			<div class="picture_swiper">
				<swiper :options="swiperOpt" ref="swiper">
					<swiper-slide v-for="slide in list">
						<img :src="slide.src" alt="">
					</swiper-slide>
					<div class="swiper-button-prev" slot="button-prev"></div>
					<div class="swiper-button-next" slot="button-next"></div>
				</swiper>
				<div class="picture_info">
					{{pictureInfo.name}}&nbsp;
					<small>{{ new Date(pictureInfo.date).toLocaleDateString() }}</small>&nbsp;
					<template v-if="pictureInfo.formId">源自文章：<router-link :to="{ name: 'articleDetail', params: { id: pictureInfo.formId }}">{{pictureInfo.name}}</router-link></template>
					<template v-else>{{pictureInfo.des}}</template>
				</div>
			</div>
			<div class="picture_previewSwiper">
				<swiper :options="previewSwiperOpt" ref="previewSwiper">
					<swiper-slide v-for="slide in list">
						<img :src="slide.src" alt="">
					</swiper-slide>
				</swiper>
			</div>
			
		</div>
		
	</el-dialog>

</div>
</template>

<script>
import Vue from 'vue';
import { Row,Col,Card,Dialog} from 'element-ui';
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Dialog);

//swiper滚动
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

export default {
	data: function () {
		var that=this;
		return {
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
						that.swiperIndex=this.activeIndex;
						that.previewSwiper.slideTo(this.activeIndex)
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
						that.swiper.slideTo(this.activeIndex)
					},
				},
			},
			swiperIndex: 0,
		}
	},
	components: {
		swiper,
		swiperSlide
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
}
</script>

<style scoped lang="less" rel="stylesheet/less">

.picture{
	&_list{padding: 50%;background-repeat:no-repeat;background-size:contain;background-position:center; background-color: #ccc;margin-bottom: 10px; cursor: pointer;}
	.el-card{
		margin-bottom: 20px;
		p{margin-bottom: 5px; height: 30px; line-height:30px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
	}
	&_show{
		&_box{background-color: #000;margin: -60px -20px -30px;}
		&/deep/ .el-dialog__headerbtn{
			width: 30px; height: 30px; top: -15px; right: -15px; z-index:2;  border: 3px solid #fff; border-radius: 50px; background-color: #aaa;
			.el-dialog__close{color: #fff;}
		}
	}
	&_swiper{
		margin-bottom: 10px; position: relative;
		.swiper-slide{
			line-height: 600px; text-align: center;
			img{ max-width: 100%; max-height: 600px;}
		}
	}
	&_previewSwiper{
		padding: 0 50px 10px;
		.swiper-slide{
			line-height: 50px; width: 50px; text-align: center; background-color: #ccc; cursor: pointer;
			img{ max-width: 50px; max-height: 50px;}
			&:after{ content: ""; position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto; background-color: rgba(0,0,0,.5);}
		}
		.swiper-slide-active:after{ background-color:transparent; border:5px solid #73B4E0}
	}
	&_info{
		position: absolute; bottom: 0; left: 0; right: 0; z-index: 1; padding: 0 50px; line-height: 32px; color: #fff; background-color: rgba(0,0,0,.7);
		small{ color: #aaa;}
	}
}


</style>