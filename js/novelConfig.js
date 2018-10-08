/**
 * 小说配置js -- handx
 */
function novelConfig(){
	
	var self=this;
	var element;
	
//	const low = top.require("lowdb");
//	const FileSync = top.require('lowdb/adapters/FileSync')
//	const adapter = new FileSync('data/db.json')
//	const db = low(adapter)

//	var E = top.require('wangeditor');

	this.init=function(){
				
		$("#addNoteBtn").on("click",function(){

			var title = $.trim($("#title").val());
			var wordsCount = $.trim($("#wordsCount").val());
			var desc = $.trim($("#desc").val());
			
			if(title==null || title==""){
				layer.msg('书籍名称不能为空！', {icon: 7});
				return;
			}
			
			if(wordsCount <= 0){
				layer.msg('目标字数不能低于零！', {icon: 7});
				return;
			}
			
			if(desc==null || desc==""){
				layer.msg('书籍简介不能为空！', {icon: 7});
				return;
			}
//			db.get('novels').push({id:1,title: title,wordsCount:wordsCount,desc:desc}).write();
			var index = parent.layer.getFrameIndex(window.name);
			parent.layer.close(index); 
//			console.log("one::"+index);
//			console.log(db.get('novels').find({id:1}).value());
			$("#goWriteNovelPage").find("cite").text(title);
			top.parent.addTab($("#goWriteNovelPage"));
		});
		
		
		$("body").on("click",".layui-nav .layui-nav-item a",function(){
			console.log($(this).text());
		});
	
		var E = window.wangEditor;
		console.log(E);
        var editor = new E('#editor');
        editor.customConfig.menus = [
	        'head',  // 标题
		    'bold',  // 粗体
		    'italic',  // 斜体
		    'underline',  // 下划线
		    'strikeThrough',  // 删除线
		    'foreColor',  // 文字颜色
		    'backColor',  // 背景颜色
		    'link',  // 插入链接
		    //'list',  // 列表
		    'justify',  // 对齐方式
		    'quote',  // 引用
		    //'emoticon',  // 表情
		    //'image',  // 插入图片
		    //'table',  // 表格
		    //'video',  // 插入视频
		    //'code',  // 插入代码
		    'undo',  // 撤销
		    'redo'  // 重复
		];
		//editor.customConfig.onchangeTimeout = 1000; // 用户无任何操作的 1000 毫秒之后被触发 (单位 ms)
		//editor.customConfig.pasteFilterStyle = false;
		editor.customConfig.onchange = function (html) {
        	console.log('onchange', html)
   	 	}
		
		editor.customConfig.onblur = function (html) {
	        console.log('onblur', html)
    	}
        editor.create();
        $(".w-e-text-container").css("height","100%");

	}
	
	self.init();
	
}
