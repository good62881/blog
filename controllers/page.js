var mongoose = require('mongoose');
require('../models/user_schema.js');
var User = mongoose.model('user');
require('../models/article_schema.js');
var Article = mongoose.model('article');
require('../models/picture_schema.js');
var Picture = mongoose.model('picture');

//右侧统计
exports.getInfo = function(req, res) {
	var cb = {
		code: 1,
		data: {},
		msg: ''
	};
	//获取用户信息
	var _userInfo = User.findOne({}, {
		name: 1,
		age: 1,
		job: 1,
		email: 1,
		avatar: 1
	}).exec();
	//获取文章、代码
	var _Article = Article.find({
		class: 1,
		visible: true,
	}, {
		name: 1,
		date: 1
	}, {
		sort: {
			date: -1
		}
	}).exec();
	var _Code = Article.find({
		class: 2,
		visible: true
	}, {
		name: 1,
		date: 1
	}, {
		sort: {
			date: -1
		}
	}).exec();
	//获取图片数量
	var _imgNum = Picture.count({
		visible: true
	}).exec();
	//获取所有tag名称
	var _tags = Article.distinct('tags');

	Promise.all([_userInfo, _Article, _Code, _imgNum, _tags]).then(function(results) {
		cb.data.userInfo = results[0];
		cb.data.count = {
			article: results[1].length,
			code: results[2].length,
			img: results[3]
		};
		cb.data.newArticle = results[1].slice(0, 5);
		cb.data.newCode = results[2].slice(0, 5);
		cb.data.tags = results[4].slice(0, 10);
		cb.code = 0;
		res.send(cb);
	}, function(err) {
		cb.msg = '统计失败！';
		res.send(cb);
	})

};



//获取文章列表
exports.getArticleList = function(req, res) {
	var query = {
		visible: true
	};
	if (req.body.date) {
		query.date = {
			$gte: new Date(req.body.date[0]),
			$lte: new Date(req.body.date[1])
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
	Article.find(query, {
		name: 1,
		date: 1,
		tags: 1,
		content: 1
	}, {
		sort: {
			date: -1
		}
	}, function(err, data) {
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



//获取文章详情
exports.getArticleDetail = function(req, res) {
	if (req.body.id) {
		Article.findOne({
			_id: req.body.id
		}, function(err, data) {
			var cb = {
				code: 1,
				data: {},
				msg: ''
			};
			if (err) {
				cb.msg = "获取文章详情失败！";
				res.send(cb);
				return
			};
			cb.data = {
				name: data.name,
				date: data.date,
				tags: data.tags,
				content: data.content,
			};
			cb.code = 0;
			res.send(cb);
		})
	}
};