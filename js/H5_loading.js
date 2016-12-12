var H5_loading = function (images,firstPage){    //括号里原argument
	
	var id = this.id;
	
	if(this._images === undefined){		//第一次进入
		
		this._images = (images || []).length;		//有几个图片需要加载
		this._loaded = 0 ;				//初始情况下已加载0个资源
		
		window[id] = this;				//把当前对象存储在全局对象 window中，用来进行某个图片加载完成之后的回调    //this是指new出来的h5对象
									
		for(s in images){ 
			var item = images[s];
			var img = new Image;		//创建图片的方法
			img.onload = function(){
				window[id].loader();		//回调为loader
			}
			img.src = item;			//为图片指定一个地址
		}
		
		$('#rate').text('0%');		//初始化
		
		return this;				//为了保持与loader一致
	}else{
		
		this._loaded ++ ;
		$('#rate').text( ( (this._loaded/this._images *100) >> 0)+ '%' );		//>>去除小数
		
		//debugger		//查看加载进度
		if(this._loaded < this._images){
			
			return this;
		}
	}	
	
	window[id]=null;
	
	this.el.fullpage({
		onLeave:function(index,nextIndex,direction){
			$(this).find('.h5_component').trigger('onLeave');		
		},
		afterLoad:function(anchorLink,index){		//锚链接的名称，序号
			$(this).find('.h5_component').trigger('onLoad');
		}
		
	});		//勿忘每个子元素名称里要有section
	this.page[0].find('.h5_component').trigger('onLoad');		//使得加载好页面就触发效果
	this.el.show();
	
	if(firstPage){			//刷新后跳转到制定页面
		$.fn.fullPage.moveTo( firstPage );
	}
}
