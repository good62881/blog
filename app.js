var express=require('express');
var app=express();
var http = require('http').Server(app);

//配置静态文件
app.use(express.static('./out/public'));


//配置html后缀以及路径
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');
app.set('views','./out/views');


//引入路由配置文件
require('./routes')(app);


http.listen(3000,function() {
	console.log('服务器正常启动于3000端口！')
});

