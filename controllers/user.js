var mongoose = require('mongoose');
require('../models/user_schema.js');
var User = mongoose.model('user');

var crypto = require('crypto');

function hashPW(pwd) { //单向加密
	return crypto.createHash('sha256').update(pwd).digest('base64');
};


//登录逻辑
exports.login = function(req, res) {
	User.findOne({
			account: req.body.account
		})
		.exec(function(err, user) {
			var cb = {
				code: 1,
				msg: ""
			};
			if (user && user.pass === hashPW(req.body.pass)) {
				req.session.user = {
					name: user.name,
					age: user.age,
					job: user.job,
					email: user.email,
					avatar: user.avatar,
				};
				cb.code = 0;
			} else {
				cb.msg = '账号或密码错误！';
			};
			res.send(cb);
		});
};


//注册逻辑
// exports.reg=function(req,res){
// 	var newUser= new User({
// 		account:req.body.account,
// 		pass:hashPW(req.body.pass),
// 		name:'豆芽',
// 		email:'good62881@163.com',
// 		avatar:'/images/avatar.jpg'
// 	});
// 	newUser.save((err,user)=>{
// 		var cb={code:1,msg:""};
// 		if (err) {
// 			cb.msg='错误！'
// 		}else{
// 			cb.code=0;
// 		}
// 		res.send(cb);
// 	});
// };



// //获取用户信息
// exports.getInfo=function(req,res){
// 	var cb={code:0,data:"",msg:""};
// 	if(req.session.user){
// 		User.aggregate([
// 			{$match:{_id:new mongoose.Types.ObjectId(req.session.user)}},  //_id自动生成是是ObjectId对象，查询时也需要把字段转换成ObjectId对象
// 			{$project:{_id:0,pass:0,date:0}}
// 		],function(err,data){ 
// 			if (err) {
// 				cb.msg="获取用户信息出错！";
// 				res.send(cb);
// 			}else{
// 				cb.code=1;
// 				cb.data=data[0];
// 				res.send(cb);
// 			}
// 		});
// 	}else{
// 		cb.msg="登录超时！";
// 		res.send(cb);
// 	}
// };