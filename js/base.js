 //封装获取元素函数
 var Base = function() {};
 Base.prototype = {
 	extend: function(tar, source) {
 		for (var i in source) {
 			tar[i] = source[i];
 		}
 		return tar;
 	}
 };

 var base = new Base();

 base.extend(base, {
 	//通过类名获取元素
 	getClass: function(str) {
 		if (document.getElementsByClassName) {
 			return document.getElementsByClassName(str);
 		}
 		var doms = document.getElementsTagName('*');
 		var arr = [];
 		for (var i = 0; i < doms.length; i++) {
 			var txt = dom[i].className.split(' ');
 			for (var j = 0; j < txt.length; j++) {
 				if (txt[j] == str) {
 					arr.push(doms[i]);
 				}
 			}
 		}
 		return arr;
 	},
 	//获取元素
 	$: function(str) {
 		var s = str.charAt(0);
 		var ss = str.substr(1);
 		switch (s) {
 			case '#':
 				return document.getElementById(ss);
 				break;
 			case '.':
 				return this.getClass(ss);
 				break;
 			default:
 				return document.getElementsByTagName(str);
 		}
 	},
 	//设置Cookie
 	setCookie: function(key, value, duration) {
 		var date = new Date();
 		date.setTime(date.getTime() + duration * 24 * 3600 * 1000);
 		document.cookie = key + '=' + value + ';expires=' + date.toGMTString();
 	},
 	//获取Cookie
 	getCookie: function(key) {
 		var strCookie = document.cookie;
 		var newStr = strCookie.replace(/[\s]*/g, '');
 		var arr = newStr.split(';');
 		for (var i = 0; i < arr.length; i++) {
 			newArr = arr[i].split('=');
 			if (newArr[0] === key) {
 				return decodeURI(newArr[1]);
 			}
 		}
 	},
 	//删除Cookie
 	removeCookie: function(key) {
 		this.setCookie(key, '', 0);
 	},
 	//获取元素样式
 	getStyle: function(obj, attr) {
 		if (obj.currentStyle) {
 			return obj.currentStyle[attr];
 		} else {
 			return window.getComputedStyle(obj, null)[attr];
 		}
 	},
 	//500秒淡入效果
 	fadeIn: function(obj) {
 		clearInterval(obj.timer);
 		var num = 0;
 		//支持opacity的浏览器
 		if (this.getStyle(obj, "opacity") != null) {
 			obj.timer = setInterval(function() {
 				num += 20;
 				obj.style.opacity = num / 1000;
 				if (num == 1000) {
 					clearInterval(obj.timer);
 				}
 			}, 10);
 		}
 		//支持filter滤镜的浏览器
 		else {
 			obj.timer = setInterval(function() {
 				num += 2;
 				obj.style.filter = 'alpha(opacity=' + num + ')';
 				if (num == 100) {
 					clearInterval(obj.timer);
 				}
 			}, 10);
 		}
 	},
 	//Ajax get方法
 	get: function(url, data, callback) {
 		var xhr = null;
 		if (window.XMLHttpRequest) {
 			xhr = new XMLHttpRequest();
 		} else {
 			xhr = new ActiveXObject('Microsoft.XMLHTTP');
 		}
 		data = (data == '' && data == ' ') ? ' ' : data;
 		xhr.onreadystatechange = function() {
 			if (xhr.readyState == 4) {
 				if (xhr.status == 200) {
 					callback(xhr.responseText);
 				} else {
 					alert('请求失败：' + xhr.status);
 				}
 			}
 		}
 		if (data == ' ') {
 			url = url + '?';
 		} else {
 			url = url + '?' + this.setData(data);
 		}
 		xhr.open('get', url, true);
 		xhr.send(null);
 	},
 	//设置Ajax方法传输数据格式
 	setData: function(data) {
 		if (!data) {
 			return '';
 		}
 		var arr = [];
 		for (key in data) {
 			if (!data.hasOwnProperty(key)) continue;
 			if (typeof data[key] == 'function') continue;
 			var value = data[key].toString();
 			key = encodeURIComponent(key);
 			value = encodeURIComponent(value);
 			arr.push(key + '=' + value);
 		}
 		return arr.join('&');
 	},
 	//获取屏幕宽度
 	window_width: function() {
 		if (window.innerWidth != null) {
 			return window.innerWidth;
 		} else if (document.compatMode === 'CSS1Compat') {
 			return document.documentElement.clientWidth;
 		}
 		return document.body.clientWidth;
 	}
 });