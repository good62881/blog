

module.exports=function(app){

//用户表控制文件
var page=require('../controllers/page');


//首页
app.get('/',function(req,res){   
	res.render('page/index');
});

//文章列表
app.get('/article',function(req,res){   
	res.render('page/article');
});
app.get('/code',function(req,res){   
	res.render('page/code');
});
app.get('/search',function(req,res){   
	res.render('page/search');
});
app.get('/articleDetail',function(req,res){   
	res.render('page/articleDetail');
});
app.post('/Api/getArticleList',page.getArticleList);
app.post('/Api/getArticleDetail',page.getArticleDetail);

//获取个人信息
app.post('/Api/getInfo',page.getInfo);


//图片列表
app.get('/picture',function(req,res){   
	res.render('page/picture');
});
app.post('/Api/getPictureList',page.getPictureList);
app.post('/Api/getPicture',page.getPicture);












}