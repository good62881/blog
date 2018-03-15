var mongoose = require('mongoose');
require('../models/article_schema.js');
var Article = mongoose.model('article');


//发布or更新文章
exports.updateArticle = function(req, res) {
	var _id = req.body._id ? req.body._id : new mongoose.Types.ObjectId()
	Article.update({
		_id: _id
	}, {
		$set: {
			date: new Date(),
			name: req.body.name,
			class: req.body.class,
			tags: req.body.tags ? req.body.tags : [],
			visible: req.body.visible,
			content: req.body.content
		},
		$setOnInsert: {
			PV: 0
		}
	}, {
		upsert: true
	}, function(err) {
		var cb = {
			code: 1,
			msg: ''
		};
		if (err) {
			cb.msg = "操作失败！";
			res.send(cb);
			return
		};
		cb.code = 0;
		res.send(cb);
	});
};



//文章图片上传
var multer = require('multer');
var multerConfig = {
	storage: multer.diskStorage({
		destination: 'out/public/upload/article', //可以直接配置地址，如果地址不存在，会自动创建
		filename: function(req, file, cb) {
			var fileFormat = (file.originalname).split(".");
			cb(null, 'temp_' + Date.now() + '.' + fileFormat[fileFormat.length - 1]);
		}
	}),
	limits: {
		fileSize: 1024* 1024,
		files: 1
	},
	fileFilter: function(req, file, cb) {
		if (file.mimetype.split("/")[0] == 'image') {
			cb(null, true);
		} else {
			cb(new Error(), false);
		}
	}
}
var upload = multer(multerConfig).single('file');
exports.articleImgUpload = function(req, res) {
	var cb = {
		code: 1,
		url:'',
		msg: ''
	};
	upload(req, res, function(err) {
		if (err) {
			cb.msg = "上传失败！";
			res.send(cb);
			return
		}
		var _url = '/upload/article/' + req.file.filename;
		cb.url = _url;
		cb.code = 0;
		res.send(cb);
	})

};

//获取文章
exports.getArticle = function(req, res) {
	Article.findOne({
		_id: req.body.id
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

//切换文章显示
exports.toggleArticle = function(req, res) {
	Article.update({
		_id: {
			$in: req.body.id
		}
	}, {
		$set: {
			visible: req.body.visible
		}
	}, {
		multi: true
	}, function(err) {
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

//删除文章
exports.delArticle = function(req, res) {
	Article.remove({
		_id: {
			$in: req.body.id
		}
	}, function(err) { //删除的时候不用写multi: true，否则会报端口占用错误
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



//统计文章数量
exports.getArticleNum = function(req, res) {
	var cb = {
		code: 1,
		data: {},
		msg: ''
	};

	var _article = Article.count({
		class: 1
	}).exec();
	var _code = Article.count({
		class: 2
	}).exec()

	Promise.all([_article, _code]).then(function(results) {
		cb.data.articleNum=results[0];
		cb.data.codeNum=results[1];
		cb.code = 0;
		res.send(cb);
	}, function(err) {
		cb.msg = '统计失败！';
		res.send(cb);
	})
};