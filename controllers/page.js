var mongoose = require('mongoose');
require('../models/user_schema.js');
var User = mongoose.model('user');



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