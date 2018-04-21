const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");



var pageArr = [
	'page/index','page/code','page/search','page/articleDetail','page/picture',
	'admin/login','admin/index','admin/edit','admin/article','admin/pictureList','admin/picture',
];   //每个页面的入口文件
var configEntry = {};
pageArr.forEach((page) => {
	configEntry[page] = path.resolve(__dirname,'src/public/bundle/'+page);
});


//插件列表
var pluginsConfig=[
	new ExtractTextPlugin({
		filename:'css/[name].css',
		allChunks: true
	}),
	new webpack.optimize.CommonsChunkPlugin({
		name: 'common',
		filename: 'bundle/[name].js',
		minChunks:7 
	}),
	new HtmlWebpackHarddiskPlugin()
];
pageArr.forEach((page) => {  
	const htmlPlugin = new HtmlWebpackPlugin({
		filename: '../views/'+page+'.html',   
		template: 'src/views/'+page+'.html',   
		chunks: ['common',page],    
		alwaysWriteToDisk: true   
	});
	pluginsConfig.push(htmlPlugin);
});

module.exports = {
	entry:configEntry,
	output: {
		filename: 'bundle/[name].js',  
		path: path.resolve(__dirname, 'out/public'),  
		publicPath: '/'  
	},
	devtool: 'inline-source-map',
	module: {
		rules: [{
			test: /\.(png|jpg|gif)$/,
			loader: "file-loader?name=images/[name].[ext]" 
		}, {
			test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
			loader: "file-loader?name=font/[name].[ext]"
		}, {
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: 'css-loader'
			}),
		}, {
			test: /\.less$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader', 'less-loader'],
			})
		}, {
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {
				loaders: {
					less: ExtractTextPlugin.extract({  
						use: ['css-loader', 'less-loader'],  
						fallback: 'vue-style-loader'
					})
				}
			}
		}, {
			test: /\.html$/,
        	loader: 'html-loader'
		}]
	},
	resolve: {
		alias: {      
			'vue$': 'vue/dist/vue.esm.js'   
		}
	},
	plugins:pluginsConfig,
};


