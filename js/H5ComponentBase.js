/* 基本图文组件对象 */

var H5ComponentBase=function(name,cfg){
	var cfg = cfg || {};   //没有参数就空对象
	var id = ('h5_c_'+Math.random()).replace('.','_')	//值为唯一的，id里最好只有数字、字母、下划线，所以将.替换为_
	
	//把当前的组件类型添加到样式中进行标记	
	var cls='h5_component_'+cfg.type;		
	var component = $('<div class="h5_component '+cls+' h5_component_name_'+name+'" id="'+id+'" >');	//一个页面会有多个组件，为每个组件设置不同id
	
	cfg.text   && component.text(cfg.text);		//如果有text显示text
	cfg.width  && component.width(cfg.width/2);	//图片为iphone情况下200%的宽度
	cfg.height && component.height(cfg.height/2);
	
	cfg.css && component.css(cfg.css)		//如果有单独设置css样式，就把样式都附加到component上面
	cfg.bg  && component.css('backgroundImage','url('+cfg.bg+')')		//需后设置，会覆盖之前的设置
	
	if(cfg.center === true){
		component.css({
			marginLeft:(cfg.width/4 * -1) + 'px',
			left:'50%'
		})
	}
	// ... 很多自定义参数
	
	if(typeof cfg.onclick === 'function'){
		component.on('click',cfg.onclick);
	}
	component.on('onLoad',function(){		//component为当前组件
		setTimeout(function(){
			component.addClass(cls+'_load').removeClass(cls+'_leave');	//添加样式进行标记,需去掉另一个样式
			cfg.animateIn && component.animate(cfg.animateIn)	//如果有animateIn就执行
		},cfg.delay || 0);
		return false;
	})
	component.on('onLeave',function(){
		setTimeout(function(){
			component.addClass(cls+'_leave').removeClass(cls+'_load');
			cfg.animateOut && component.animate(cfg.animateOut)
		},cfg.delay || 0);
		return false;
	})
	
	return component;
}
