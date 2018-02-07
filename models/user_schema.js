var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	account:{type:String,required:true,unique:true},
	pass:{type:String,required:true},
	name:{type:String,required:true},
	age:Number,
	job:String,
	email:{type:String,required:true},
	avatar:String,
},{collection:'user'});


mongoose.model('user',userSchema);
