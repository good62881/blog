var mongoose = require('mongoose');
require('../models/article_schema.js');
var Article = mongoose.model('article');

//发布新文章
exports.newArticle=function(req,res){
	var _newArticle= new Article(req.body);  //新建时，对类型要求不严格。在模型中定义好，会自动转化。
	_newArticle.save((err,user)=>{
		var cb={code:1,msg:""};
		if (err) {
			cb.msg='错误！'
		}else{
			cb.code=0;
		}
		res.send(cb);
	});
};


//获取文章列表
exports.getArticleList = function(req, res) {
	
	var match= {    //查询时一定注意类型的转换！
		visible:Boolean(req.body.visible)
	};
	if (req.body.date){match.date={$gte:new Date(req.body.date[0]),$lte:new Date(req.body.date[1])}};
	if (Number(req.body.class)){match.class=Number(req.body.class)};
	//if (req.body.type && req.body.val) {match[req.body.type]=req.body.val;};
	console.log(match)
	Article.find(match, function(err, data) {
		console.log(data)
		var cb={code:1,msg:""};
		if (err) {
			cb.msg='错误！'
		}else{
			cb.code=0;
		}
		res.send(cb);
	})
};
