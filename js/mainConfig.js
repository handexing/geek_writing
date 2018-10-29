var $, tab, skyconsWeather;
var ipcRenderer = require('electron').ipcRenderer;
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db/geek.json');
const db = low(adapter);

var isBig = true;

layui.config({
	base: "js/"
}).use(['form', 'element', 'layer', 'jquery'], function() {
	var form = layui.form(),
		layer = layui.layer,
		element = layui.element();
	$ = layui.jquery;

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

	//退出
	$(".signOut").click(function() {
		window.sessionStorage.removeItem("menu");
		menu = [];
		window.sessionStorage.removeItem("curmenu");
	});

	//隐藏左侧导航
	$(".hideMenu").click(function() {
		$(".layui-layout-admin").toggleClass("showMenu");
	});

	function closeMenu() {
		$(".layui-layout-admin").toggleClass("showMenu");
	}

	//锁屏
	function lockPage() {
		layer.open({
			title: false,
			type: 1,
			content: '	<div class="admin-header-lock" id="lock-box">' +
				'<div class="admin-header-lock-img"><img src="images/face.jpg"/></div>' +
				'<div class="admin-header-lock-name" id="lockUserName">handx</div>' +
				'<div class="input_btn">' +
				'<input type="password" class="admin-header-lock-input layui-input" autocomplete="off" placeholder="请输入密码解锁.." name="lockPwd" id="lockPwd" style="background-color:#1EC38B;" />' +
				'<button class="layui-btn" id="unlock" style="background-color:#1EC38B;">解锁</button>' +
				'</div>' +
				/*'<p>请输入“123456”，否则不会解锁成功哦！！！</p>'+*/
				'</div>',
			closeBtn: 0,
			shade: 0.9
		});
		$(".admin-header-lock-input").focus();
	}

	$(".lockcms").on("click", function() {
		window.sessionStorage.setItem("lockcms", true);
		lockPage();
	});

	// 判断是否显示锁屏
	if(window.sessionStorage.getItem("lockcms") == "true") {
		lockPage();
	}

	// 解锁
	$("body").on("click", "#unlock", function() {
		if($(this).siblings(".admin-header-lock-input").val() == '') {
			layer.msg("请输入解锁密码！");
			$(this).siblings(".admin-header-lock-input").focus();
		} else {
			if($(this).siblings(".admin-header-lock-input").val() == "123456") {
				window.sessionStorage.setItem("lockcms", false);
				$(this).siblings(".admin-header-lock-input").val('');
				layer.closeAll("page");
			} else {
				layer.msg("密码错误，请重新输入！");
				$(this).siblings(".admin-header-lock-input").val('').focus();
			}
		}
	});

	$(document).on('keydown', function() {
		if(event.keyCode == 13) {
			$("#unlock").click();
		}
	});

});

function mainConfig() {

	var self = this;

	this.init = function() {
		self.initCategpry();

		//新整类别
		$("#m_category").contextMenu({
			width: 115, // width
			itemHeight: 30, // 菜单项height
			bgColor: "#fff", // 背景颜色
			color: "#333", // 字体颜色
			fontSize: 12, // 字体大小
			hoverBgColor: "#EBF8F8", // hover背景颜色
			target: function(ele) { // 当前元素
				console.log(ele);
			},
			menu: [{
				text: "新增分类",
				icon: "images/create.png",
				callback: function() {
					var flag = false;
					layer.prompt({
						title: '输入分类名称',
						formType: 3
					}, function(val, index) {
						var categoryNameList = db.get('categorys').map('categoryName').value();
						$.each(categoryNameList, function(i, value) {
							if(value == val) {
								layer.msg('分类冲突，请换一个再试试吧！', {
									icon: 7
								});
								return false;
							}
							flag = true;
						});
						if(flag) {
							db.get('categorys').push({
								uuid: Math.uuid(),
								categoryName: val
							}).write();
							layer.msg('添加成功！', {
								icon: 1
							});
							self.initCategpry();
						}
						layer.close(index);
					});
				}
			}, {
				text: "刷新分类",
				icon: "images/refresh.png",
				callback: function() {
					self.initCategpry();
				}
			}]
		});

		//清空垃圾桶
		$("#clear_trash").contextMenu({
			width: 115, // width
			itemHeight: 30, // 菜单项height
			bgColor: "#fff", // 背景颜色
			color: "#333", // 字体颜色
			fontSize: 12, // 字体大小
			hoverBgColor: "#EBF8F8", // hover背景颜色
			target: function(ele) { // 当前元素
				console.log(ele);
			},
			menu: [{
				text: "清空回收站",
				icon: "images/clear_trash.png",
				callback: function() {
					alert("清空回收站");
				}
			}, {
				text: "恢复最近删除",
				icon: "images/recovery.png",
				callback: function() {
					alert("恢复最近删除");
				}
			}]
		});

		$(".category_item").contextMenu({
			width: 115, // width
			itemHeight: 30, // 菜单项height
			bgColor: "#fff", // 背景颜色
			color: "#333", // 字体颜色
			fontSize: 12, // 字体大小
			hoverBgColor: "#EBF8F8", // hover背景颜色
			target: function(ele) { // 当前元素
				uuid = ele.attr("uuid"); //类别uuid
			},
			menu: [{
				text: "新建",
				icon: "images/create.png",
				callback: function() {
					db.get('blogs').push({
						uuid: Math.uuid(),
						categoryUuid: uuid,
						title: '新建笔记（重命名）',
						content: '',
						userUuid: '',
						wordsCnt: 0,
						status: 0, //0:默认  1：发布  2：删除
						createTime: new Date(),
						updateTime: new Date(),
						deleteTime: new Date()
					}).write();
				}
			}, {
				text: "删除",
				icon: "images/clear_trash.png",
				callback: function() {
					alert("删除");
				}
			}, {
				text: "重命名",
				icon: "images/rename.png",
				callback: function() {
					alert("重命名");
				}
			}]
		});

		$("#heardImage").contextMenu({
			width: 115, // width
			itemHeight: 30, // 菜单项height
			bgColor: "#fff", // 背景颜色
			color: "#333", // 字体颜色
			fontSize: 12, // 字体大小
			hoverBgColor: "#EBF8F8", // hover背景颜色
			target: function(ele) { // 当前元素
				console.log(ele);
			},
			menu: [{
				text: "修改密码",
				icon: "images/rename.png",
				callback: function() {
					$("#m_Frame").attr("src", "page/user/changePwd.html");
				}
			}, {
				text: "修改个人信息",
				icon: "images/rename.png",
				callback: function() {
					$("#m_Frame").attr("src", "page/user/userInfo.html");
				}
			}]
		});

		//设置
		$(".setting").click(function() {
			$("#m_Frame").attr("src", "page/setting_page.html");
		});

		//所有笔记
		$("#allNotes").click(function() {
			$(".left_menu_details").text("所有笔记");
		});
		//垃圾桶
		$("#clear_trash").click(function() {
			$(".left_menu_details").text("垃圾桶");
		});
		//收藏
		$("#starred").click(function() {
			$(".left_menu_details").text("收藏");
		});

		//打开笔记
		$(".openNote").click(function() {
			$("#m_Frame").attr("src", "page/note_page.html");
		});

		//左侧菜单点击事件
		$(".navBar .layui-nav-item a").click(function() {
			var tt = $(this).parent().siblings("li").children("a").removeAttr("style");
			$(this).attr("style", "color: #1EC38B;");
		});

		//分类点击事件
		$(".navBar .layui-nav-item").on("click", ".category_item a", function() {
			$(this).parent().siblings("dd").children("a").removeAttr("style");
			$(this).attr("style", "color: #1EC38B;");

			var categoryUuid = $(this).parent().attr("uuid");
			const res = db.get('blogs').find({
				categoryUuid: categoryUuid
			}).value();
			
			const post = db.read().get('blogs')
        .find({ categoryUuid: 1 })
        .value();
			debugger
  console.log(post)
			//			var html = "<ul>";
			//			$.each(res, function(i, val) {
			//				console.log(res.title);
			//				html += "<li class=\"openNote\" data-url='page/note_page.html?blogUuid='" +val.uuid + " uuid=" +val.uuid + ">";
			//				html += "<span class=\"title\"><img src=\"images/note.png\" width=\"20\" height=\"20\"/> <span>"+val.title+"</span></span>";
			//				html += "<p>修改时间："+val.updateTime+"</p><div class=\"m_badge\"><span class=\"tag_rim\">#java</span></div></li>";
			//			});
			//			html += "</ul>";
			//			$(".left_menu_details").html(html);
		});

		$(".navBar .m_tag_content li").click(function() {
			var tt = $(this).siblings("li").removeAttr("style");
			$(this).attr("style", "color: #1EC38B;font-weight: bold;");
			$(".left_menu_details").text($(this).attr("title"));
		});

		//左侧菜单切换
		$(".mytab .my-select-tab i").click(function() {

			var type = $(this).attr("type");

			if(type == "m_menu") {
				$(".m_menu").find("i").attr("style", "color: #1EC38B;");
				$(".m_tag").find("i").attr("style", "color: #fff;");
				$(".m_more").find("i").attr("style", "color: #fff;");
				$(".m_menu_content").attr("style", "display: block;");
				$(".m_tag_content").attr("style", "display: none;");
				$(".m_more_content").attr("style", "display: none;");
			} else if(type == "m_tag") {
				$(".m_tag").find("i").attr("style", "color: #1EC38B;");
				$(".m_menu").find("i").attr("style", "color: #fff;");
				$(".m_more").find("i").attr("style", "color: #fff;");
				$(".m_menu_content").attr("style", "display: none;");
				$(".m_tag_content").attr("style", "display: block;");
				$(".m_more_content").attr("style", "display: none;");
			} else if(type == "m_more") {
				$(".m_more").find("i").attr("style", "color: #1EC38B;");
				$(".m_tag").find("i").attr("style", "color: #fff;");
				$(".m_menu").find("i").attr("style", "color: #fff;");
				$(".m_menu_content").attr("style", "display: none;");
				$(".m_tag_content").attr("style", "display: none;");
				$(".m_more_content").attr("style", "display: block;");
			}
		});

		$(".left_menu_details .openNote").click(function() {
			$(this).siblings('li').removeClass('menu_details_selected');
			$(this).addClass('menu_details_selected');
		});

	}

	this.initCategpry = function() {
		var html = "";
		var res = db.get('categorys').value();
		$.each(res, function(i, val) {
			html += "<dd class=\"category_item\" uuid=" + val.uuid + ">";
			html += "<a href=\"javascript:;\" title='" + val.categoryName + "'>";
			html += "<i class=\"iconfont icon-wenjianjia\" data-icon=\"icon-wenjianjia\"></i>";
			html += "<cite>" + val.categoryName + "</cite></a></dd>";
		});
		$("#categorys").html(html);
	}

	self.init();
}