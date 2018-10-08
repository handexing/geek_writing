/**
 * 首页配置js -- handx
 */
function indexConfig(){
	
	var self=this;
	
	this.init=function(){
		
		$(".panel a").on("click",function(){
			window.parent.addTab($(this));
		});
	
	}
	
	
	self.init();
	
}

