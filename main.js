const {
	app,
	BrowserWindow,
	globalShortcut,
	ipcMain
} = require('electron');
const path = require('path');
const url = require('url');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db/geek.json');
const db = low(adapter);

// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let win;

function createWindow() {
	// 创建浏览器窗口。
	win = new BrowserWindow({
		width: 1400,
		height: 890,
		minWidth: 1400,
		minHeight: 890,
		frame: false,
		center: true,
		titleBarStyle: 'hidden-inset'
	})
	//frame: false 边框 resizable:false 是否可以最大化

	/*win.setFullScreen(true);*/
	/*globalShortcut.register('ESC', () => {
		win.setFullScreen(false);
	});*/

	/*globalShortcut.register('F11', () => {
		win.setFullScreen(true);
	});

	globalShortcut.register('F11', () => {
		win.setFullScreen(true);
	});*/
	//初始化数据库
	db.defaults({
		user: {},
		blogs: [],
		tags: [],
		categorys: [],
		starred: []
	}).write();

	//	db.get('posts')
	//.push({ id: 1, title: 'lowdb is awesome'})
	//.write()
	//	db.get('posts')
	//.push({ id: 2, title: 'lowdb is awesome'})
	//.write()

	globalShortcut.register('ctrl+shift+alt+e', function() {
		let win = BrowserWindow.getFocusedWindow();
		if(win) {
			win.webContents.openDevTools({
				detach: true
			});
		}
	});

	// 然后加载应用的 index.html。
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'main.html'),
		protocol: 'file:',
		slashes: true
	}));

	//lowdb 初始化数据文件
	//	db.defaults({novels: [] }).write();

	win.setMenu(null);
	//win.show();

	// 当 window 被关闭，这个事件会被触发。
	win.on('closed', () => {
		// 取消引用 window 对象，如果你的应用支持多窗口的话，
		// 通常会把多个 window 对象存放在一个数组里面，
		// 与此同时，你应该删除相应的元素。
		win = null
	});

}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
	// 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
	// 否则绝大部分应用及其菜单栏会保持激活。
	if(process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', () => {
	// 在macOS上，当单击dock图标并且没有其他窗口打开时，
	// 通常在应用程序中重新创建一个窗口。
	if(win === null) {
		createWindow()
	}
});

// 在这文件，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。

//退出
ipcMain.on('window-all-closed', () => {
	app.quit();
});
//小化
ipcMain.on('hide-window', () => {
	win.minimize();
});
//最大化
ipcMain.on('show-window', () => {
	win.maximize();
});
//还原
ipcMain.on('orignal-window', () => {
	win.unmaximize();
});