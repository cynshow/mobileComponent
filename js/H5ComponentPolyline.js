/* 柱图组件对象 */

var H5ComponentPolyline=function(name,cfg){
	
	var component = new H5ComponentBase(name,cfg);
	
	//component.text('test');
	
	//绘制网格线 —- 背景层
	var w = cfg.width;
	var h = cfg.height;
	
	//加入一个画布（用于做网格线背景）
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);
	
	// 水平网格线	100份，-> 10份	（只是参考线）
	var step = 10;
	ctx.beginPath();
	ctx.lineWidth =1;
	ctx.strokeStyle = "AAAAAA";
	
	window.ctx = ctx;		//可在控制台直接键入作画
	for(var i=0;i<step+1;i++){
		
		var y = (h/step) * i;
		ctx.moveTo(0,y);
		ctx.lineTo(w,y);
	}
	
	// 垂直网格线 （根据项目的个数区分）
	step = cfg.data.length+1;
	
	var text_w=w/step >> 0;
	
	for(var i=0;i<step+1;i++){
		
		var x = (w/step) * i;
		
		ctx.moveTo(x,0);
		ctx.lineTo(x,h);
		
		if(cfg.data[i]){
			var text=$('<div class="text">');		//添加项目名称
			text.text(cfg.data[i][0]);
			text.css('width',text_w/2)
				.css('left',x/2+text_w/4)
			
			component.append(text);
		}	
	}
	
	ctx.stroke();
	
	//加入画布 —— 数据层
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);
	
	/**
	 * 绘制折线以及对应的数据和阴影
	 * @param {floot} per 0到1之间的数据，会根据这个值绘制最终数据对应的中间状态
	 * @return {DOM}	Component元素
	 */
	var draw = function( per ){
		//清空画布
		ctx.clearRect(0,0,w,h);		//清空区域：左上角到右下角
		//绘制折线数据
		ctx.beginPath();
		ctx.lineWidth =3;
		ctx.strokeStyle = "#ff8878";
		
		var x = 0;
		var y = 0;	
		
		var row_w = ( w /(cfg.data.length+1))
		
		//画点
		for( i in cfg.data){			//不建议如此写
			var item=cfg.data[i];		
			x= row_w * i + row_w;
			y= h-(item[1]*h*per);			//原：y= h*(1-item[1]);
			
			ctx.moveTo(x,y);
			ctx.arc(x,y,5,0,2*Math.PI);		//圆心x，圆心y，r，起始弧度，结束弧度
		}
		
		//连线
			//移动画笔到第一个数据的点位置
		  	ctx.moveTo( row_w ,h-(cfg.data[0][1]*h*per) );		//原：h*(1-cfg.data[0][1])
			//ctx.arc(row_w , h*(1-cfg.data[0][1]),10,0,2*Math.PI);
		for(i in cfg.data){
			var item=cfg.data[i];	
			x= row_w * i + row_w;
			y= h-(item[1]*h*per);			//原：y= h*(1-item[1]);
			
			ctx.lineTo(x,y);
		}
		ctx.stroke();
		
		//绘制阴影
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(255,255,255,0)'
		
		ctx.lineTo(x,h);
		ctx.lineTo(row_w,h);
		ctx.fillStyle = 'rgba(255,136,120,0.2)'	//rgba为有透明度的颜色，在chrome控制台可查找
		ctx.fill();
		
		//写数据
		for( i in cfg.data){			//不建议如此写
			var item=cfg.data[i];		
			x= row_w * i + row_w;
			y= h-(item[1]*h*per);		//原：y= h*(1-item[1]);
			
			ctx.fillStyle = item[2]	? item[2] : '#595959';	 //如果这一项数据里有定义它的颜色的话
			
			ctx.fillText(((item[1]*100)>>0 )+'%' , x-10 , y-10 );		// >>：去掉小数;标准的话应该根据文字的宽度修正坐标，margin-left:-元素一半的宽度
		}
		ctx.stroke();
	}	
		
	//draw(.5)
		
	component.on('onLoad',function(){
		//折线图生长动画
		var s=0;
		for( i=0;i<100;i++){		//此动画分为100步
			setTimeout(function(){				//闭包	是执行一个函数非定义一个函数
				s+=.01;		//因为分为了100份
				draw(s);
			},i*10+500)		//？
		}
	});
	
	component.on('onLeave',function(){
		//折线图退场动画
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