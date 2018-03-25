import '../../css/common.less';
import '../../css/admin/picture.less';

//vue相关
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);

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
		listId:params.id,
		isUpload:false,
		uploadVisible:false,
		list: '',
	},
	components: {
		CNav: CNav,
		CTop: CTop
	},
	created: function() {
		this.search();
	},
	methods: {
		//获取图片列表
		search:function() {
			var that = this;
			$.post("/adminApi/getPicture",{id:this.listId},function(res){
				if (!res.code) {
					that.list=res.data;
				} else {
					that.$message.error(res.msg);
				}
			});
		},
		//图片上传
		pictureUpload:function(res) {
			this.isUpload=false;
		},
		pictureUploadProgress:function() {
			this.isUpload=true
		},
		pictureUploadError:function(err) {
			this.isUpload=false
			this.$message.error('上传失败！');
		},
		maxPicture:function() {
			this.$message.error('最多同时上传5张图片');
		},
		finishUpload:function() {
			this.uploadVisible=false;
			this.$refs.upload.clearFiles();
		},
	}
});