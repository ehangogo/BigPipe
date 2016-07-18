/**
 * 用于动态加载模块
 */
var require=function(url,callback){
	
	var elem, bl,
        isExecuted = false; // 防止在ie9中，callback执行两次
        
	if(url.lastIndexOf(".css")>-1){
		elem = document.createElement('link'),
   		elem.rel = 'stylesheet';
   		elem.href = url;
	}else{
		elem = document.createElement('script');
		elem.src = url;
	}
	if ( typeof callback === 'function' )  {
        bl = true;
    }
	 // for ie
    function handle(){
        var status = elem.readyState;
        if (status === 'loaded' || status === 'complete') {
            if (bl && !isExecuted) {
                callback();
                isExecuted = true;
            }
            elem.onreadystatechange = null;
        }
    }
    elem.onreadystatechange = handle;
    // for 非ie
    if (bl && !isExecuted) {
        elem.onload = callback;
        isExecuted = true;
    }
	
    document.getElementsByTagName('head')[0].appendChild(elem);
}

