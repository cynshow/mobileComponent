/* 雷达图组件对象 */
var H5ComponentRadar=function(name,cfg){
	
	var component = new H5ComponentBase(name,cfg);
	
	//绘制网格线 —- 背景层
	var w = cfg.width;
	var h = cfg.height;
	
	//加入一个画布（用于做网格线背景）
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);
	
	var r = w/2;
	var step = cfg.data.length;
	
//	//小圆
//	ctx.beginPath();
//	ctx.arc(r,r,5,0,2*Math.PI);
//	ctx.stroke();
//	
//	//大圆
//	ctx.beginPath();
//	ctx.arc(r,r,r,0,2*Math.PI);
//	ctx.stroke();

	//计算一个圆周上的坐标（计算多边形的顶点坐标）
	//已知：圆心坐标（a,b）、半径r；角度deg。
	//rad = (2*Math.PI/360)*(360/step)*i
	//x=a+Math.sin(rad)*r;
	//y=a+Math.cos(rad)*r;
	
	//绘制网格背景（分面绘制，分为10份）
	var isBlue=false;
	for(var s =10;s>0;s--){			//为什么用s？？？？
		ctx.beginPath();
		for( var i=0;i<step;i++){
			var rad = (2*Math.PI/360)*(360/step)*i		//计算弧度
			
			var x=r+Math.sin(rad)*r*(s/10);
			var y=r+Math.cos(rad)*r*(s/10);
			//ctx.arc( x,y,5,0,2*Math.PI);
			ctx.lineTo(x,y)
		}
	ctx.closePath();
	ctx.fillStyle = (isBlue=!isBlue)?'#99c0ff':'#f1f9ff';		//切换2种颜色
	ctx.fill();
	}

//	ctx.beginPath();
//	for( var i=0;i<step;i++){
//		var rad = (2*Math.PI/360)*(360/step)*i
//		
//		var x=r+Math.sin(rad)*r*.5;
//		var y=r+Math.cos(rad)*r*.5;
////		ctx.arc( x,y,5,0,2*Math.PI);
//		ctx.lineTo(x,y)
//	}
//	ctx.fillStyle = '#f00';
//	ctx.closePath();
//	ctx.fill();
//	ctx.stroke();

	//绘制伞骨
	for(var i=0;i<step;i++){
		var rad = (2*Math.PI/360)*(360/step)*i		//计算弧度
			
		var x=r+Math.sin(rad)*r;
		var y=r+Math.cos(rad)*r;
		ctx.moveTo(r,r);
		ctx.lineTo(x,y);
		
		//输出项目文字	（数据动画时项目文字不会变化所以加在伞骨处）
		var text=$('<div class="text">')
		text.text(cfg.data[i][0]);
		text.css('transition','all .5s '+ i*.1 + 's')
  		//text.css('left',x/2);
  		//text.css('top',y/2);
		if(x > w/2){
			text.css('left',x/2+5);
		}else{
			text.css('right',(w-x)/2+5);
		}
		
		if(y > h/2){
			text.css('top',y/2+5);
		}else{
			text.css('bottom',(h-y)/2+5);
		}
		
		if(cfg.data[i][2]){		//如果有自定义样式，将自定义样式加进来
			text.css('color',cfg.data[i][2])
		}
		text.css('opacity',0);

		component.append(text);
	 }
	ctx.strokeStyle = '#e0e0e0';
	ctx.stroke();
	
	//数据层的开发
	//加入一个画布（用于做网格线背景）
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);

	ctx.strokeStyle = '#f00';		//设置样式
	
	var draw = function( per ){			//生长动画函数
		
		if(per >=1){		//文字动画：图片加载完立刻显示文字
			component.find('.text').css('opacity',1);		
		}
		if(per <=1){		//文字动画：退场
			component.find('.text').css('opacity',0);		
		}
		
		ctx.clearRect(0,0,w,h);		//清理矩形区域
		//输出数据的折线
		for(var i=0;i<step;i++){
			var rad = (2*Math.PI/360)*(360/step)*i		//计算弧度
			
			var rate = cfg.data[i][1] * per;
			
			var x = r + Math.sin( rad ) * r * rate;
			var y = r + Math.cos( rad ) * r * rate;
			
			ctx.lineTo(x,y);
			
		}
		
		ctx.closePath();
		ctx.stroke();
		
		//输出数据的点
		ctx.fillStyle = '#ff7676';
		for(var i=0;i<step;i++){
			var rad = (2*Math.PI/360)*(360/step)*i		//计算弧度
			
			var rate = cfg.data[i][1] * per;
			
			var x = r + Math.sin( rad ) * r * rate;
			var y = r + Math.cos( rad ) * r * rate;
			
			ctx.beginPath();
			ctx.arc( x,y,5,0,2*Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	}	
	
	//draw(1);	//测试用
		
	component.on('onLoad',function(){
		//雷达图生长动画
		var s=0;
		for( i=0;i<100;i++){		//此动画分为100步
			setTimeout(function(){				//闭包	是执行一个函数非定义一个函数
				s+=.01;		//因为分为了100份
				draw(s);
			},i*10+500)		//？
		}
	});
	
	component.on('onLeave',function(){
		//雷达图退场动画
		var s=1;
		for( i=0;i<100;i++){		//此动画分为100步
			setTimeout(function(){
				s-=.01;		//因为分为了100份
				draw(s);
			},i*10)
		}
	});
	
	return component;
}
