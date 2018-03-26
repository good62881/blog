var mongoose = require('mongoose');
require('../models/picture_schema.js');
var Picture = mongoose.model('picture');
require('../models/pictureList_schema.js');
var PictureList = mongoose.model('pictureList');

var fs = require('fs');


//新建or更新相册
exports.editPictureList = function(req, res) {
	var cb = {
		code: 1,
		msg: ''
	};
	var _updatePictureList = function(id) {
		PictureList.update({
			listId: id
		}, {
			$set: {
				date: new Date(),
				name: req.body.name,
				visible: req.body.visible,
			},
			$setOnInsert: {
				cover: ''
			}
		}, {
			upsert: true
		}, function(err) {
			if (err) {
				cb.msg = "操作失败！";
				res.send(cb);
				return
			};
			cb.code = 0;
			res.send(cb);
		});
	};
	if (req.body.listId) {
		_updatePictureList(req.body.listId);
	} else {
		PictureList.find({
			listId: {
				$ne: 0
			}
		}, null, {
			sort: {
				listId: -1
			},
			limit: 1
		}, function(err, data) {
			if (err) {
				cb.msg = "操作失败！";
				res.send(cb);
				return
			};
			var maxId;
			maxId = data[0] ? data[0].listId + 1 : 1;
			_updatePictureList(maxId);
		});
	};
};



//获取相册列表
exports.getPictureList = function(req, res) {
	PictureList.find({}, '-_id -__v', function(err, data) {
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


//切换相册显示
exports.togglePictureList = function(req, res) {
	var cb = {
		code: 1,
		msg: ''
	};
	var _pictureListVisible = PictureList.update({
		listId: req.body.id
	}, {
		$set: {
			visible: req.body.visible
		}
	});
	var _pictureVisible = Picture.update({
		listId: req.body.id
	}, {
		$set: {
			visible: req.body.visible
		}
	}, {
		multi: true
	});
	Promise.all([_pictureListVisible, _pictureVisible]).then(function(results) {
		cb.code = 0;
		res.send(cb);
	}, function(err) {
		cb.msg = '操作失败！';
		res.send(cb);
	})
};

//删除相册
exports.delPictureList = function(req, res) {
	PictureList.remove({
		listId: req.body.id
	}, function(err) {
		var cb = {
			code: 1,
			msg: ''
		};
		if (err) {
			cb.msg = "删除失败！";
			res.send(cb);
		} else {
			Picture.find({
				listId: req.body.id
			}, function(err, data) {
				if (err) {
					cb.msg = '删除失败！'
					res.send(cb);
				} else {
					Picture.remove({
						listId: req.body.id
					}, function(err) {
						if (err) {
							cb.msg = "删除失败！";
							res.send(cb);
							return
						}
						//删除图片文件
						for (var i = data.length - 1; i >= 0; i--) {
							fs.unlinkSync('out/public' + data[i].src);
						}
						cb.code = 0;
						res.send(cb);
					});
				}

			});
		}

	});
};


//设置相册封面
exports.setPictureListCover = function(req, res) {
	PictureList.update({
		listId: req.body.id
	}, {
		$set: {
			cover: req.body.src
		}
	}, function(err, data) {
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
	})
};



//获取图片列表
exports.getPicture = function(req, res) {
	Picture.find({
		listId: req.body.id
	}, '-__v', function(err, data) {
		var cb = {
			code: 1,
			data: '',
			msg: ''
		};
		if (err) {
			cb.msg = '获取图片列表失败！'
		} else {
			cb.code = 0;
			cb.data = data;
		}
		res.send(cb);
	})
};



//图片上传
var multer = require('multer');
var multerConfig = {
	storage: multer.diskStorage({
		destination: 'out/public/upload/picture', //可以直接配置地址，如果地址不存在，会自动创建
		filename: function(req, file, cb) {
			var fileFormat = (file.originalname).split(".");
			cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1]);
		}
	}),
	limits: {
		fileSize: 1024 * 1024,
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
exports.pictureUpload = function(req, res) {
	var cb = {
		code: 1,
		msg: ''
	};

	upload(req, res, function(err) {
		if (err) {
			cb.msg = "上传失败！";
			res.status(403).send(cb);
		} else {
			Picture.create({
				date: new Date(),
				src: '/upload/picture/' + req.file.filename,
				name: req.file.originalname.split('.')[0],
				des: '暂无描述',
				listId: req.body.listId
			}, function(err) {
				if (err) {
					cb.msg = '上传失败！';
					res.status(403).send(cb);
					return
				};
				cb.code = 0;
				res.send(cb);
			})
		}
	})

};



//删除图片
exports.delPicture = function(req, res) {
	Picture.find({
		_id: {
			$in: req.body.id
		}
	}, function(err, data) {
		var cb = {
			code: 1,
			msg: ''
		};
		if (err) {
			cb.msg = '删除失败！'
			res.send(cb);
		} else {
			Picture.remove({
				_id: {
					$in: req.body.id
				}
			}, function(err) {
				if (err) {
					cb.msg = "删除失败！";
					res.send(cb);
					return
				}
				//删除图片文件
				for (var i = data.length - 1; i >= 0; i--) {
					fs.unlinkSync('out/public' + data[i].src);
				}
				cb.code = 0;
				res.send(cb);
			});
		}

	});
};