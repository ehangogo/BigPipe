var BigPipe=function(){}
  


BigPipe.onPageletArrive=function(conf){
	
	// 加载CSS依赖
	var css=conf.css;
	// 加载JS依赖
	var js=conf.js;

  // 先加载依赖的样式,再加载依赖的JS
	require(css,function(){
		require(js,function(){
		
		  // 填充内容
	    var content=conf.content;
			var id=conf.id;
		  var container=conf.container_id;
		  var html='';
		  if(container instanceof String){
		  	container=$("#"+container);
		  }
		  
		  
		  var isDisplay=$("#"+id).offset().top<($(window).height()+$(window).scrollTop()-10);
		  if(!isDisplay){
			  // 延迟渲染
			  BigRender.add($("#"+id)[0],dispaly);
		  }else{
		  	// 首屏一开始就渲染
		  	dispaly();
		  }
		  
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
		  
		});
	});
	
}

