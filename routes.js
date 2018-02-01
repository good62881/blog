

module.exports=function(app){

// //用户页面控制文件
// var users=require('./controllers/users');

// //用户管理页控制文件
// var uList=require('./controllers/uList');

// //用户信息编辑
// var edit=require('./controllers/edit');

// //私信
// var msg=require('./controllers/msg');



//首页
app.get('/',function(req,res){   
	res.render('index');
});

//文章列表
app.get('/article',function(req,res){   
	res.render('article');
});


//404处理
app.get('*', function(req, res){
    res.redirect('/')
});


}