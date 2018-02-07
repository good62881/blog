

module.exports=function(app){

//用户表控制文件
var user=require('../controllers/user');


//拦截
app.get('/admin/*',function(req,res,next){   
	if(req.session.user){
		next();
	}else{
		res.redirect('/admin')
	}
});

//登录页
app.get('/admin',function(req,res){   
	res.render('admin/login');
});
app.post('/adminApi/login',user.login);
//app.post('/adminApi/reg',user.reg);

//api的拦截写在login后面，排除掉login
app.all('/adminApi/*',function(req,res,next){   
	if(req.session.user){
		next();
	}else{
		res.send({code:1,msg:'登录异常，请重新登录！'});
	}
});

//首页
app.get('/admin/index',function(req,res){
	res.render('admin/index');
});
//获取个人信息
app.post('/adminApi/getInfo',function(req,res){
	res.send({code:0,data:req.session.user,msg:''});
});

//退出登录
app.get('/admin/out',function(req, res){
	req.session.destroy(function(){
		res.redirect('/admin')
	});
});

//账户设置
app.get('/admin/edit',function(req,res){
	res.render('admin/edit');
});


}