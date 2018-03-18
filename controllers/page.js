var mongoose = require('mongoose');
require('../models/user_schema.js');
var User = mongoose.model('user');
require('../models/article_schema.js');
var Article = mongoose.model('article');


//获取用户信息
exports.getInfo = function(req, res) {
	User.findOne(function(err, user) {
		var cb = {
			code: 1,
			data: '',
			msg: ''
		};
		if (err) {
			cb.msg = "获取用户信息失败！";
			res.send(cb);
			return
		};
		cb.data = {
			name: user.name,
			age: user.age,
			job: user.job,
			email: user.email,
			avatar: user.avatar,
		};
		cb.code = 0;
		res.send(cb);
	})
};





//获取文章列表
exports.getArticleList = function(req, res) {
	var query = {
		visible: true
	};
	if (req.body.startDate && req.body.endDate) {
		query.date = {
			$gte: new Date(req.body.startDate),
			$lte: new Date(req.body.endDate)
		}
	};
	if (Number(req.body.class)) {
		query.class = Number(req.body.class)
	};
	if (req.body.type && req.body.val) {
		if (req.body.type === 'name') {
			query.name = {
				$regex: req.body.val,
				$options: "i"
			};
		} else if (req.body.type === 'tags') {
			var _reg = new RegExp(req.body.val, 'i');
			query.tags = {
				$in: [_reg]
			};
		}
	};
	Article.find(query,{name:1,date:1,tags:1,content:1},{sort:{date:-1}},function(err, data) {
		var cb = {
			code: 1,
			data: {},
			msg: ''
		};
		if (err) {
			cb.msg = '获取文章列表失败！'
		} else {
			cb.code = 0;
			cb.data.total = data.length;
			cb.data.list = data.splice(req.body.pageSize * (req.body.pageNo - 1), req.body.pageSize);
		}
		res.send(cb);
	})
};



