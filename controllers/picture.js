var mongoose = require('mongoose');
require('../models/article_schema.js');
var Article = mongoose.model('article');
require('../models/picture_schema.js');
var Picture = mongoose.model('picture');
require('../models/pictureList_schema.js');
var PictureList = mongoose.model('pictureList');


//获取相册列表
exports.getPictureList = function(req, res) {
	PictureList.find({},'-_id -__v',function(err, data) {
		var cb = {
			code: 1,
			data: '',
			msg: ''
		};
		if (err) {
			cb.msg = '获取相册列表失败！'
		} else {
			cb.code = 0;
			cb.data = data;
		}
		res.send(cb);
	})
};
