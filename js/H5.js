/* 内容管理对象 */

var H5=function(){
	this.id=('h5_'+Math.random()).replace('.','_');
	this.el=$('<div class="h5" id="'+this.id+'">').hide();
	this.page=[];
	$('body').append(this.el);		//body里h5对象为最外层，所以直接添加给body
	
	/**
	 * 新增一个页
	 * @param{string} name 组件的名称，回家到ClassName中
	 * @param{string} text 页内的默认文本
	 * @return {H5}H5对象，可以重复使用H5对象支持的方法
	 */
	this.addPage=function(name,text){  //text非必要，用于描述信息
		var page=$('<div class="h5_page section">');
		
		if(name !=undefined){
			page.addClass('h5_page_'+name);
		}
		if(text != undefined){
			page.text(text);		//用于测试,无实际代码意义
		}
		this.el.append(page);
		this.page.push(page);
		if( typeof this.whenAddPage === 'function' ){
			this.whenAddPage();
		}
		return this;
	}
	
	/*新增一个组件*/
	this.addComponent=function(name,cfg){
		var cfg = cfg || {};		//无参数就为空对象
		cfg=$.extend({		//给jQuery对象添加方法
			type:'base'
		},cfg)				//cfg没传type参数的话默认添加type:'base'
		
		var component;		//定义一个变量，存储 组件元素
		var page=this.page.slice(-1)[0];		//返回最后一个页（运用数组），注意要加[0]
		
		switch(cfg.type){		//选择要执行的多个代码块之一
			case'base':
				component=new H5ComponentBase(name,cfg);
			break;			//使用 break 来阻止代码自动地向下一个 case 运行
			
			case'polyline':
				component=new H5ComponentPolyline(name,cfg);
				break;
			
			case'pie':
				component=new H5ComponentPie(name,cfg);
				break;
			
			case'bar':
				component=new H5ComponentBar(name,cfg);
				break;
			case'bar_v':
				component=new H5ComponentBar_v(name,cfg);
				break;
			
			case'radar':
				component=new H5ComponentRadar(name,cfg);
				break;
				
			case'ring':
				component=new H5ComponentRing(name,cfg);
				break;	
				
			case'point':
				component=new H5ComponentPoint(name,cfg);
				break;
			
			default:

		}
		
		page.append(component);
		return this;
	}
	/* H5对象初始化呈现 */
	this.loader=function( firstPage ){		//所以之前先hide()
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
	this.loader= typeof H5_loading == 'function' ? H5_loading : this.loader;
	return this;		//返回出去，良好编程习惯
}

/* 基本图文组件对象 */


