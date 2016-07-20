var express = require('express');
var path = require('path');
var http = require('http');
var ejs = require('ejs');
var fs = require('fs');
 
var app = express();

// 存放所有的Pagelets标识,用于记录Pagelet是否生成完毕
var PageletStatus={}
  


// 服务器监听端口
app.set('port', process.env.PORT || 3000);
// 设置静态目录位置
app.use(express.static(path.join(__dirname, 'static')));
// 设置模板引擎为html
app.engine('.html', ejs.__express);
app.set('view engine', 'html');


// 访问主页
app.get('/index.html', function (req, res) {
  
		  // 设置页面中包含的Pagelet为未构建状态
		  PageletStatus={
		  	'pagelet1':false,
		  	'pagelet21':false,
		  	'pagelet22':false,
		  	'pagelet23':false,
		  	'pagelet24':false,
		  	'pagelet25':false,
		  	'pagelet3':false
		  };
		  
		  // 输出页面结构
		  res.render('BigPipe',{title: "输出页面layout结构布局"}, function (err, str) {
		    res.write(str);
			console.info('输出页面布局layout');
		  });
		  
		  // 启动线程1,查询数据库并输出Pagelet1
		  setTimeout(function(){
		  	writePagelet('pagelet1',res);
		  },1000);

		  // 启动线程2,查询数据库并输出Pagelet2
		  setTimeout(function(){
			writePagelet('pagelet21',res);
		  },2000);
		  setTimeout(function(){
			writePagelet('pagelet22',res);
		  },3000);
		  setTimeout(function(){
			writePagelet('pagelet23',res);
		  },4000);
		  setTimeout(function(){
			writePagelet('pagelet24',res);
		  },5000);
		  setTimeout(function(){
			writePagelet('pagelet25',res);
		  },6000);
		  
		  
		 // 启动线程3,查询数据库并输出Pagelet3
		  setTimeout(function(){
		  	writePagelet('pagelet3',res);
		  },7000);
		 
	
});

http.createServer(app).listen(3001);

console.info('服务器启动成功...');
console.info('访问http://127.0.0.1:3001/index.html查看内容');

function writePagelet(id,res){
	var basePath=path.join(__dirname, 'static/pagelet')
	var filePath=path.join(basePath,id);
	fs.exists(filePath+'/'+id+'.html',function(exists){
		if(exists){
			
			fs.readFile(filePath+'/'+id+'.html',function(err, data){
			  if(err){ 
			  }else{
			    var content=data;
			    var js='/pagelet/'+id+'/'+id+'.js';
			    var css='/pagelet/'+id+'/'+id+'.css';
			    var callback=id+'_callback';
			
			    var html=Pagelet(id,css,js,content,callback);
			    
			    res.write(html);
			    
			    // pagelet输出完毕
				  isEnd(id,res);
				    
			  }
			});
		}
	});
}

 /**
   * 判断是否是最后一个Pagelet如果是最后一个则关闭输入流
   * @param {Object} id
   * @param {Object} res
   */
 function isEnd(id,res) {
	    PageletStatus[id]=true;
	    for (x in PageletStatus) {
	      if(!PageletStatus[x]){
	        return;
	      }
	    }
	    res.end();
	    console.info('页面生成完毕'); 
    return;
}
/**
 * Pagelet 生产Pagelet代码
 * 
 * @param {Object} id:pagelet的ID
 * @param {Object} css:依赖的CSS
 * @param {Object} js:依赖的JS
 * @param {Object} content:HTML片段
 * @param {Object} callback:回调函数
 */
function Pagelet(id,css,js,content,callback) {
	
		console.info('\n\n--------------------------------------------------');
		console.info('构造Pagelet:'+id+'开始');
		console.info('ID:'+id);
		console.info('CSS依赖:'+css);
		console.info('JS依赖:'+js);
		console.info('HTML片段'+content);
		console.info('回调函数'+callback);
		
		PageletStatus[id]=false;
		
		var  pagelet='<code id="'+id+'_container" style="display:none"><!--'+content+'--></code>\n';
		
			 pagelet+='<script>                         \n';
			 pagelet+='BigPipe.onPageletArrive({        \n';
			 pagelet+='	id:"'+id+'",                    \n';
			 pagelet+='	container_id:'+id+'_container,  \n';
			 pagelet+='	css:"'+css+'",                  \n';
			 pagelet+='	js:"'+js+'",                    \n';
			 pagelet+='	callback:"'+callback+'"         \n';
			 pagelet+='});                              \n';
			 pagelet+='</script>                        \n';
		
		console.info('\nPagelet结构');	
		console.info(pagelet);
		console.info('构造Pagelet:'+id+'结束\n--------------------------------------------------');
		
		return pagelet;
			
 }
  