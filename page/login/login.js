var ipcRenderer = require('electron').ipcRenderer;
var isBig = true;

layui.config({
	base : "js/"
}).use(['form','layer'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		$ = layui.jquery;
	//video背景
	$(window).resize(function(){
		if($(".video-player").width() > $(window).width()){
			$(".video-player").css({"height":$(window).height(),"width":"auto","left":-($(".video-player").width()-$(window).width())/2});
		}else{
			$(".video-player").css({"width":$(window).width(),"height":"auto","left":-($(".video-player").width()-$(window).width())/2});
		}
	}).resize();
	
	//登录按钮事件
	form.on("submit(login)",function(data){
		window.location.href = "../../main.html";
		return false;
	})
	
	//关闭窗口
	$(".close").click(function() {
		ipcRenderer.send('window-all-closed');
	});
	//最大化
	$(".max").click(function() {
		if(isBig) {
			$(this).children().attr('class', 'iconfont icon-zuidahua');
			ipcRenderer.send('show-window');
		} else {
			$(this).children().attr('class', 'iconfont icon-fangxingweixuanzhong');
			ipcRenderer.send('orignal-window');
		}
		isBig = !isBig;
	});
	//最小化
	$(".min").click(function() {
		ipcRenderer.send('hide-window');
	});
})
