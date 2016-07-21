# NodeJS实现简单BigPipe

通过setTimeout函数，模拟了多线程输出Pagelet的功能。前端实现了BigPipe和BigRender，首屏直接渲染，非首屏则延迟渲染。


---


# 一、安装

```
# 安装依赖
npm install express ejs 
```

```
# 运行服务器,然后访问 
# http://127.0.0.1:3000/index.html访问BigPipe的效果页面
node BigPipe.js 
```

```
# 运行服务器,然后访问 
# http://127.0.0.1:3000/index.html访问BigRender的效果页面
node BigRender.js 
```
![运行截图][1]
# 二、原理
![原理][2]
# 二、代码

## 1、页面结构
``` html

<!--头部-->
<div id="pagelet1" class="header"><div class="loadding">加载头部 loadding....</div></div>
<!--中间-->
<div id="pagelet21" class="main container">
    <div class="loadding">加载内容1 loadding....</div>
</div>
<!--底部-->
<div id="pagelet3" class="footer"><div class="loadding"> 加载底部 loadding....</div></div>

<!--Pagelet1-->
<code id="pagelet1_container" style="dispaly:none"></code>
<script>
   BigPipe.onPageArrive({});
</script>
<!--Pagelet2-->
<!--Pagelet3-->


```

## 2、多线程输出
``` javascript
// 服务器端用setTimout模拟多线程输出
// 输出页面结构
res.render('BigPipe',{title: "输出页面layout结构布局"}, function (err, str) {
res.write(str);
console.info('输出页面布局layout');
});

// 启动线程1,查询数据库并输出Pagelet1
setTimeout(function(){
	writePagelet('pagelet1',res);
},1000);
.........
.........

// 启动线程3,查询数据库并输出Pagelet3
setTimeout(function(){
  writePagelet('pagelet3',res);
},7000);
```

```
// 生成Pagelet
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
```

## 3、前端渲染
```
// 可见部分直接渲染，不可见部分延迟渲染
var isDisplay=$("#"+id).offset().top<($(window).height()+$(window).scrollTop()-10);
if(!isDisplay){
  // 延迟渲染
  BigRender.add($("#"+id)[0],dispaly);
}else{
   // 首屏一开始就渲染
  dispaly();
}

// 从注释中解析HTML并填充到目标DIV中
function dispaly(){
	// 填充内容
	html=$(container).html().replace("<!--","").replace("-->","");
	  $("#"+id).html(html);
	  // 删除注释
	  //$(container).remove();
	  
	  // 执行回到函数
	  var callback=conf.callback;
	  
	  if(callback){
		try{
			eval(callback+"("+id+")");
		}catch(error){};
	  }	
}
```
## 4、延迟渲染
```

/**
 * 监听浏览器滚动
 */
$(window).on("scroll",function(){
	
	for(var i=0;i<BigRender.Pagelets.length;i++){
		var item=BigRender.Pagelets[i];
			
	    var isDisplay=$(item.elem).offset().top>($(window).height()+$(window).scrollTop());
		if(!isDisplay&&item.isShow==false){
				console.info("显示Pagelet："+$(item.elem).attr("id"));
				item.callback();
				item.isShow=true;
			}
		}
    
});



```


# 三、性能

## 1、传统模式
![传统模式][3]

## 2、BigPipe模式
![BigPipe模式][4]


  [1]: https://raw.githubusercontent.com/mircode/BigPipe/master/doc/img/index.png
  [2]: https://raw.githubusercontent.com/mircode/BigPipe/master/doc/img/%E5%9B%BE%E7%89%871.png
  [3]: https://raw.githubusercontent.com/mircode/BigPipe/master/doc/img/11.png
  [4]: https://raw.githubusercontent.com/mircode/BigPipe/master/doc/img/12.png