var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
	date:{type:Date,default:Date.now},  //文章生成时间
	name:{type:String,required:true},  //文章标题
	class:{type:Number,required:true},  //文章类别  1--文章  2--代码
	tags: [],  //文章标签
	visible:{type:Boolean,default:true},
	content:{type:String,required:true},
	PV:{type:Number,default:0},
},{collection:'article'});


mongoose.model('article',articleSchema);
