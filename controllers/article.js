var mongoose = require('mongoose');
require('../models/article_schema.js');
var Article = mongoose.model('article');

//发布新文章
exports.newArticle = function(req, res) {
	var _newArticle = new Article(req.body); //新建时，对类型要求不严格。在模型中定义好，会自动转化。
	_newArticle.save((err) => {
		var cb = {
			code: 1,
			msg: ''
		};
		if (err) {
			cb.msg = '发布失败！'
		} else {
			cb.code = 0;
		}
		res.send(cb);
	});
};

//获取文章
exports.getArticle = function(req, res) {
	Article.findOne({
		_id: new mongoose.Types.ObjectId(req.body.id)
	}, function(err, data) {
		var cb = {
			code: 1,
			data: '',
			msg: ''
		};
		if (err) {
			cb.msg = '查找文章失败！'
		} else {
			cb.data = data;
			cb.code = 0;
		}
		res.send(cb);
	})
};


//更新文章
exports.updateArticle = function(req, res) {
	Article.findOneAndUpdate({
		_id: new mongoose.Types.ObjectId(req.body._id)
	}, {
		$set: {
			date: new Date(),
			name: req.body.name,
			class: req.body.class,
			tags: req.body.tags ? req.body.tags : [],
			visible: req.body.visible,
			content: req.body.content
		}
	}, function(err, data) {
		var cb = {
			code: 1,
			msg: ''
		};
		if (err) {
			cb.msg = "修改失败！";
			res.send(cb);
			return
		};
		cb.code = 0;
		res.send(cb);
	});
};

//切换文章显示
exports.toggleArticle = function(req, res) {
	Article.findOne({
		_id: new mongoose.Types.ObjectId(req.body.id)
	}, function(err, data) {
		var cb = {
			code: 1,
			msg: ''
		};
		if (err) {
			cb.msg = '查找文章失败！'
			res.send(cb);
			return
		};
		var _visible = !data.visible;
		data.update({
			$set: {
				visible: _visible
			}
		}, function(err) {
			if (err) {
				cb.msg = "修改失败！";
				res.send(cb);
				return
			};
			cb.code = 0;
			res.send(cb);
		})
	})
};

//删除文章
exports.delArticle = function(req, res) {
	Article.remove({
		_id: new mongoose.Types.ObjectId(req.body.id)
	}, function(err) {
		var cb = {
			code: 1,
			msg: ''
		};
		if (err) {
			cb.msg = "删除失败！";
			res.send(cb);
			return
		}
		cb.code = 0;
		res.send(cb);
	});
};

//获取文章列表
exports.getArticleList = function(req, res) {
	var query = { //查询时一定注意类型的转换！
		visible: req.body.visible === 'true' ? true : false
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
	Article.find(query, function(err, data) {
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