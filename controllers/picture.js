var mongoose = require('mongoose');
require('../models/picture_schema.js');
var Picture = mongoose.model('picture');
require('../models/pictureList_schema.js');
var PictureList = mongoose.model('pictureList');



//新建or更新相册
exports.editPictureList = function(req, res) {
	var cb = {code: 1,msg: ''};
	var _updatePictureList = function(id) {
		PictureList.update({
			listId: id
		}, {
			$set: {
				date: new Date(),
				name:req.body.name,
				visible:req.body.visible,

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
	}else{
		PictureList.find({listId:{$ne:0}},null,{sort:{listId:-1},limit:1},function(err,data) {
			if (err) {
				cb.msg = "操作失败！";
				res.send(cb);
				return
			};
			var maxId;
			maxId=data[0]?data[0].listId+1:1;
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
	PictureList.update({
		listId: req.body.id
	}, {
		$set: {
			visible: req.body.visible
		}
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
			return
		}
		cb.code = 0;
		res.send(cb);
	});
};




//获取图片列表
exports.getPicture = function(req, res) {
	Picture.find({}, '-_id -__v', function(err, data) {
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
