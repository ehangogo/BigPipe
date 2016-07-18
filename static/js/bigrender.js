var BigRender=function(){}
BigRender.Pagelets=[];  


BigRender.add=function(elem,callback){
	BigRender.Pagelets.push({elem:elem,callback:callback,isShow:false});
}

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

