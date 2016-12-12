/* 饼图组件对象 */
var H5ComponentPie=function(name,cfg){
	
	var component = new H5ComponentBase(name,cfg);
	
	// 绘制网格线 —- 背景层
	var w = cfg.width;
	var h = cfg.height;
	
	// 加入一个画布（用于做网格线背景）
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	$(cns).css('zIndex',1)
	component.append(cns);
	
	var r=w/2;
	// 加入一个底图层
	ctx.beginPath();
	ctx.fillStyle = '#eee';
	ctx.strokeStyle = '#eee';
	ctx.lineWidth = 1;
	ctx.arc(r,r,r,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();
	
	//绘制一个数据层
	var cns = document.createElement('canvas');		//因为底图层用完无用了，所以变量覆盖也没关系
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	$(cns).css('zIndex',2)
	component.append(cns);

	var colors = ['red','green','blue','red','orange'];	//备用颜色
	var sAngel=1.5*Math.PI;		// 设置开始的角度在12点位置
	var eAngel=0;				// 结束角度
	var aAngel=Math.PI*2;		// 100%圆结束的角度	2pi=360
	
	var step = cfg.data.length;
	for(var i=0;i<step;i++){
		var item = cfg.data[i];
		var color = item[2] || ( item[2] = colors.pop() );
		
		eAngel = sAngel + aAngel * item[1];
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		ctx.lineWidth = .1;
		
		ctx.moveTo(r,r)
		ctx.arc(r,r,r,sAngel,eAngel);
		ctx.fill();
		ctx.stroke();
		sAngel = eAngel;
		
		// 加入所有的项目文本以及百分比
		
		var text = $('<div class="text">');
		text.text(cfg.data[i][0]);
		var per = $('<div class="per">');
		per.text(cfg.data[i][1]*100 + '%');
		text.append(per);
		
		var x=r + Math.sin( .5*Math.PI - sAngel) * r;		//需修正
		var y=r + Math.cos( .5*Math.PI - sAngel) * r;
		
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
		
		if(cfg.data[i][2]){
			text.css('color',cfg.data[i][2]);
			text.css('color','#fff');
			text.css('backgroundColor',cfg.data[i][2]);
		}
		text.css('opacity',0);
		component.append(text);
	}

	// 加入一个蒙板层（用于做网格线背景）
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	$(cns).css('zIndex',3)
	component.append(cns);

	ctx.fillStyle = '#eee';
	ctx.strokeStyle = '#eee';
	ctx.lineWidth = 1;

	var draw = function( per ){			//生长动画函数
		
		ctx.clearRect(0,0,w,h);
		
		ctx.beginPath();
		 
		ctx.moveTo(r,r);
		
		if(per <=0){
			ctx.arc(r,r,r,0,2*Math.PI);
			component.find('.text').css('opacity',0);
		}else{
			ctx.arc(r,r,r,sAngel,sAngel+2*Math.PI*per,true);
		}
	
		ctx.fill();
		ctx.stroke();
		
		if( per >=1){
			component.find('.text').css('transition','all 0s');	//重排前需将动画时间设置为0
			H5ComponentPie.reSort(component.find('.text'));
			component.find('.text').css('transition','all 1s');	//重排前需将动画时间设置为0
			component.find('.text').css('opacity',1);
			ctx.clearRect(0,0,w,h);			//去除per为1时显示的图层
		}
	}	
	
	//draw(0);	//测试用
		
	component.on('onLoad',function(){
		//饼图生长动画
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

// 重排项目文本元素
H5ComponentPie.reSort = function( list ){
	
	//	1. 检查相交
	var compare = function(domA,domB){
		
		// 元素的位置，不用left，因为有时候left为auto
		var offsetA=$(domA).offset();
		var offsetB=$(domB).offset();
		
		// domA 的投影
		var shadowA_x=[offsetA.left,$(domA).width() + offsetA.left];
		var shadowA_y=[offsetA.top,$(domA).height() + offsetA.top];
		
		// domB 的投影
		var shadowB_x=[offsetB.left,$(domB).width() + offsetB.left];
		var shadowB_y=[offsetB.top,$(domB).height() + offsetB.top];
		
		// 检测 X
		var intersect_x = (shadowA_x[0] > shadowB_x[0] && shadowA_x[0] < shadowB_x[1] ) || (shadowA_x[1] > shadowB_x[0] && shadowA_x[1] < shadowB_x[1] )
		|| (shadowB_x[0] > shadowA_x[0] && shadowB_x[0] < shadowA_x[1] ) || (shadowB_x[1] > shadowA_x[0] && shadowB_x[1] < shadowA_x[1] );
		
		// 检测 y轴投影是否相交
		var intersect_y = (shadowA_y[0] > shadowB_y[0] && shadowA_y[0] < shadowB_y[1] ) || (shadowA_y[1] > shadowB_y[0] && shadowA_y[1] < shadowB_y[1] ) 
		|| (shadowA_y[0] > shadowB_y[0] && shadowA_y[0] < shadowB_y[1] ) || (shadowA_y[1] > shadowB_y[0] && shadowA_y[1] < shadowB_y[1] );
		
		return intersect_x && intersect_y;
	}
	
	//	2. 错开重排
	var reset = function(domA,domB){
		if( $(domA).css('top') != 'auto' ){
			$(domA).css('top',parseInt($(domA).css('top'))+$(domB).height());
		}
		if( $(domA).css('bottom') != 'auto' ){
			$(domA).css('bottom',parseInt($(domA).css('bottom'))+$(domB).height());
		}
	}
	
	$.each(list,function(i,domTarget){
		if(list[i+1]){
			console.log($(domTarget).text(),$(list[i+1]).text(),'相交',compare(domTarget,list[i+1]))
		}
	})
	
	//定义将要重排的元素
	var willReset = [list[0]];
	
	$.each(list,function(i,domTarget){		//比较所有元素
		if( compare(willReset[willReset.length-1],domTarget)){
			willReset.push(domTarget);		//不会把自身加入到对比
		}
	})
	
	if(willReset.length >1 ){
		$.each(willReset,function(i,domA){
			if(willReset[i+1]){
				reset(domA,willReset[i+1]);
			}
		});
		H5ComponentPie.reSort(willReset);
	}
}








