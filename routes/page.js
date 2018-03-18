

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
app.post('/Api/getArticleList',page.getArticleList);



//获取个人信息
app.post('/Api/getInfo',page.getInfo);















}