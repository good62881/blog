

module.exports=function(app){


//首页
app.get('/',function(req,res){   
	res.render('page/index');
});

//文章列表
app.get('/article',function(req,res){   
	res.render('page/article');
});




}