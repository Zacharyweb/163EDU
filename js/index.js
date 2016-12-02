//检查cookie信息，确认顶部的通知栏是否显示
function notice() {
	var closeNotice = base.$("#closeNotice");
	var top_bar = base.$("#top_bar");
	if (base.getCookie('closeTopbar')) {
		top_bar.style.display = 'none';
	} else {
		closeNotice.onclick = function() {
			top_bar.style.display = 'none';
			base.setCookie('closeTopbar', true, 10);
		}
	}
}
notice();

//导航栏关注按钮事件
function attention() {
	var login = base.$('#login');
	var labels = login.getElementsByTagName('label');
	var username = base.$('#username');
	var password = base.$('#password');
	var dialog_box = base.$('.dialog-box')[0];
	var close = base.$('#close');
	var attention = base.$('#attention');
	var mask = base.$('#mask');
	var btn_submit = base.$('#btn_submit');
	var followed = base.$('.followed')[0];
	var unfollow = base.$('#unfollow');

	//输入框输入内容时提示文字隐藏，输入框为空时提示文字显示
	function label_display() {
		username.onfocus = function() {
			labels[0].style.display = 'none';
		}
		username.onblur = function() {
			if (this.value === '') {
				labels[0].style.display = 'block';
			}
		}
		password.onfocus = function() {
			labels[1].style.display = 'none';
		}
		password.onblur = function() {
			if (this.value === '') {
				labels[1].style.display = 'block';
			}
		}
	}
	label_display();

	//点击登录框的关闭按钮
	close.onclick = function() {
		dialog_box.style.display = 'none';
		mask.style.display = 'none';
	};
	//通过检查cookie确认用户是否已经登录
	function checkCookie() {
		if (!base.getCookie('loginSuc')) {
			//用户未登录点击关注按钮跳出登录框
			attention.style.display = 'block';
			followed.style.display = 'none';
			attention.onclick = function() {
				dialog_box.style.display = 'block';
				mask.style.display = 'block';
			}
		} else {
			//如果用户已经登录则通过cookie查看用户是否已经关注
			//如果没关注 则点关注进行关注
			if (!base.getCookie('followSuc')) {
				attention.style.display = 'block';
				followed.style.display = 'none';
				attention.onclick = function() {
					base.setCookie('followSuc', '1', 10);
					attention.style.display = 'none';
					followed.style.display = 'block';
				}
			}
			//如已关注 关注按钮消失 已关注按钮出现
			else {
				attention.style.display = 'none';
				followed.style.display = 'block';
			}
		}
	};
	checkCookie();
	//用户点击登录按钮提交表单
	btn_submit.onclick = function() {
		var account = md5(username.value);
		var code = md5(password.value);
		base.get('http://study.163.com/webDev/login.htm', {
			userName: account,
			password: code
		}, function(a) {
			if (a == 1) {
				dialog_box.style.display = 'none';
				mask.style.display = 'none';
				base.setCookie('loginSuc', '1', 10);
				base.get('http://study.163.com/webDev/attention.htm', '', function(b) {
					if (b == 1) {
						base.setCookie('followSuc', '1', 10);
						attention.style.display = 'none';
						followed.style.display = 'block';
					}
				});
			} else {
				alert("账号或密码错误，请重新输入");
			}
		});
	}
	unfollow.onmouseover = function() {
		followed.style.backgroundColor = "#fff";
	}
	unfollow.onmouseleave = function() {
			followed.style.backgroundColor = "#f8f8f8";
		}
		//取消关注
	unfollow.onclick = function() {
		base.removeCookie('followSuc');
		attention.style.display = 'block';
		followed.style.display = 'none';
		attention.onclick = function() {
			base.setCookie('followSuc', '1', 10);
			attention.style.display = 'none';
			followed.style.display = 'block';
		}
	}
}
attention();
//轮播图部分
function autoplayBanner() {
	var banners = base.$('#banners');
	var pictures = banners.children;
	var control = base.$('#banners_control');
	var controls = control.children;
	var timer = null;
	var num = 0;

	//图片自动播放函数
	function autoplay() {
		num++;
		for (var i = 0; i < controls.length; i++) {
			controls[i].className = 'fl cp';
		}
		num = num < 3 ? num : 0;
		controls[num].className = 'active fl cp';
		//改变轮播图的z-index值 保证轮到的图片的z-index最大
		for (var i = 0; i < pictures.length; i++) {
			pictures[i].style.zIndex = 1;
		}
		pictures[num].style.zIndex = 10;
		//z-index最大的图片淡入
		base.fadeIn(pictures[num]);
		//不显示的图片透明度改为0
		setTimeout(function() {
			for (var i = 0; i < pictures.length; i++) {
				if (controls[i].className != 'active fl cp') {
					if (base.getStyle(pictures[0], 'opacity') != null) {
						pictures[i].style.opacity = 0;
					} else {
						pictures[i].style.filter = 'alpha(opacity=0)';
					}
				}
			}
		}, 1000);
	};
	timer = setInterval(autoplay, 5000);

	//点击小圆点跳转到相应轮播图片
	function clickDot() {
		for (var i = 0; i < controls.length; i++) {
			controls[i].index = i;
			controls[i].onclick = function() {
				for (var j = 0; j < controls.length; j++) {
					controls[j].className = 'fl cp';
					pictures[j].style.zIndex = 1;
					if (base.getStyle(pictures[0], "opacity") != null) {
						pictures[j].style.opacity = 0;
					} else {
						pictures[j].style.filter = 'alpha(opacity=0)';
					}
				}
				this.className = 'active fl cp';
				pictures[this.index].style.zIndex = 10;
				base.fadeIn(pictures[this.index]);
				num = this.index;
			}
		}
	};
	clickDot();

	//鼠标移动到图片及小圆点上时自动播放停止
	banners.onmouseover = function() {
		clearInterval(timer);
	}
	banners.onmouseleave = function() {
		timer = setInterval(autoplay, 5000);
	}
	control.onmouseover = function() {
		clearInterval(timer);
	}
	control.onmouseleave = function() {
		timer = setInterval(autoplay, 5000);
	}
}
autoplayBanner();


//产品设计、编程语言具体课题的展示，参数格式{pageNo:页码,psize:每页展示个数,type:类型}，类型10是产品设计，20编程语言
function showCourse(obj) {
	base.get('http://study.163.com/webDev/couresByCategory.htm', obj, function(a) {
		var show_course = base.$('#show_course');
		var data = JSON.parse(a);
		var arr = data.list;
		var str = '';
		for (var i = 0; i < arr.length; i++) {
			arr[i].price = arr[i].price == 0 ? '免费' : '&yen;' + arr[i].price;
			str += '<li>';
			str += '<div class="sketch">';
			str += '<img src="' + arr[i].middlePhotoUrl + '" alt="">';
			str += '<h4 class="title">' + arr[i].name + '</h4>';
			str += '<p class="author">' + arr[i].provider + '</p>';
			str += '<span class="learnerCount"><i></i>' + arr[i].learnerCount + '</span>';
			str += '<p class="price"><em>' + arr[i].price + '</em></p>';
			str += '</div>';
			str += '<div class="details">';
			str += '<div class="top">';
			str += '<a href="javascript:;">';
			str += '<img src="' + arr[i].middlePhotoUrl + '" alt="">';
			str += '<h3>' + arr[i].name + '</h3>';
			str += '<span>' + arr[i].learnerCount + '人在学</span>';
			str += '<p class="classfiry">发布者：' + arr[i].provider + '<br>分类：' + arr[i].categoryName + '</p>';
			str += '</a>';
			str += '</div>';
			str += '<div class="bottom">';
			str += '<a href="javascript:;">';
			str += '<p class="description">' + arr[i].description + '</p>';
			str += '</a>';
			str += '</div>';
			str += '</div>';
			str += '</li>'
		}
		show_course.innerHTML = str;
	});
};
//检测当前窗口宽度确定传入的参数
base.window_width() > 1205 ? showCourse({
	pageNo: 1,
	psize: 20,
	type: 10
}) : showCourse({
	pageNo: 1,
	psize: 15,
	type: 10
});

//页面底端页码的设置，传入参数格式{psizeCode:每页展示的个数,typeCode:类型}
function pageNumber(obj) {
	var page_number = base.$('#page_number');
	//获取对于的课程数据	
	base.get('http://study.163.com/webDev/couresByCategory.htm', {
		pageNo: 1,
		psize: obj.psizeCode,
		type: obj.typeCode
	}, function(a) {
		//根据ajax返回的数据自动更新页码数
		var data = JSON.parse(a);
		var num = data.totalPage;
		if (page_number.children.length != (2 + num)) {
			var init_str = '<li class="prev fl cp usn" id="prev"></li><li class="next fl cp usn" id="next"></li>';
			page_number.innerHTML = init_str;
			var next = base.$('#next');
			for (var i = 0; i < num; i++) {
				var newli = document.createElement('li');
				newli.className = 'fl cp usn';
				newli.innerText = i + 1;
				page_number.insertBefore(newli, next);
				var lis = page_number.children;
				lis[1].className = 'active fl cp usn';
			}
		}
		var lis = page_number.children;
		//点击相应的页面数跳转到相应的页面
		for (var i = 1; i < lis.length - 1; i++) {
			lis[i].index = i;
			lis[i].onclick = function() {
				showCourse({
					pageNo: this.index,
					psize: obj.psizeCode,
					type: obj.typeCode
				});
				for (var j = 1; j < lis.length - 1; j++) {
					lis[j].className = 'fl cp usn';
				}
				lis[this.index].className = 'active fl cp usn';
			}
		}
		//点击上一页跳转页面
		lis[0].onclick = function() {
				for (var i = 1; i < lis.length - 1; i++) {
					if (lis[i].className == 'active fl cp usn') {
						if (i != 1) {
							showCourse({
								pageNo: i - 1,
								psize: obj.psizeCode,
								type: obj.typeCode
							});
							for (var j = 1; j < lis.length - 1; j++) {
								lis[j].className = 'fl cp usn';
							}
							lis[i - 1].className = 'active fl cp usn';
						}
					}
				}

			}
			//点击下一页跳转页面
		lis[lis.length - 1].onclick = function() {
			for (var i = 1; i < lis.length - 1; i++) {
				if (lis[i].className == 'active fl cp usn') {
					if (i != lis.length - 2) {
						showCourse({
							pageNo: i + 1,
							psize: obj.psizeCode,
							type: obj.typeCode
						});
						for (var j = 1; j < lis.length - 1; j++) {
							lis[j].className = 'fl cp usn';
						}
						lis[i + 1].className = 'active fl cp usn';
						return;
					}
				}
			}
		}
	});
}
//初始化时，根据当前屏幕宽度，决定获取产品设计的第一页产品列表数量。
base.window_width() > 1205 ? pageNumber({
	psizeCode: 20,
	typeCode: 10
}) : pageNumber({
	psizeCode: 15,
	typeCode: 10
});

//点击产品设计按钮时触发的效果
function proDesign() {
	var pro_design = base.$('#pro_design');
	var pro_language = base.$('#pro_language');
	var page_number = base.$('#page_number');
	var lis = page_number.children;
	pro_design.onclick = function() {
		for (var i = 1; i < lis.length - 1; i++) {
			lis[i].className = 'fl cp usn';
		}
		lis[1].className = 'active fl cp usn';
		pro_design.className = 'pro-design fl cp active';
		pro_language.className = 'pro-language fl cp';
		if (base.window_width() > 1205) {
			showCourse({
				pageNo: 1,
				psize: 20,
				type: 10
			});
			pageNumber({
				psizeCode: 20,
				typeCode: 10
			});
		} else {
			showCourse({
				pageNo: 1,
				psize: 15,
				type: 10
			});
			pageNumber({
				psizeCode: 15,
				typeCode: 10
			});
		}
	}
}
proDesign();

//点击编程语言时触发的效果
function proLanguage() {
	var pro_design = base.$('#pro_design');
	var pro_language = base.$('#pro_language');
	var page_number = base.$('#page_number');
	var lis = page_number.children;
	pro_language.onclick = function() {
		for (var i = 1; i < lis.length - 1; i++) {
			lis[i].className = 'fl cp usn';
		}
		lis[1].className = 'active fl cp usn';
		pro_design.className = 'pro-design fl cp';
		pro_language.className = 'pro-language fl cp active';
		if (base.window_width() > 1205) {
			showCourse({
				pageNo: 1,
				psize: 20,
				type: 20
			});
			pageNumber({
				psizeCode: 20,
				typeCode: 20
			});
		} else {
			showCourse({
				pageNo: 1,
				psize: 15,
				type: 20
			});
			pageNumber({
				psizeCode: 15,
				typeCode: 20
			});
		}
	}
}
proLanguage();


//当屏幕宽度发生变化时自动变换，切换课程列表数据
function self_adaption() {
	var pro_design = base.$('#pro_design');
	var pro_language = base.$('#pro_language');
	var page_number = base.$('#page_number');
	var lis = page_number.children;
	var a = base.window_width();
	for (var i = 1; i < lis.length - 1; i++) {
		if (lis[i].className == 'active fl cp usn') {
			if (a > 1205) {
				if (pro_design.className == 'pro-design fl cp active') {
					showCourse({
						pageNo: i,
						psize: 20,
						type: 10
					});
					pageNumber({
						psizeCode: 20,
						typeCode: 10
					});
				} else {
					pageNumber({
						psizeCode: 20,
						typeCode: 20
					});
					showCourse({
						pageNo: i,
						psize: 20,
						type: 20
					});
				}
			} else {
				if (pro_design.className == 'pro-design fl cp active') {
					pageNumber({
						psizeCode: 15,
						typeCode: 10
					});
					showCourse({
						pageNo: i,
						psize: 15,
						type: 10
					});
				} else {
					pageNumber({
						psizeCode: 15,
						typeCode: 20
					});
					showCourse({
						pageNo: i,
						psize: 15,
						type: 20
					});
				}
			}
		}
	}
}
window.onresize = self_adaption;

//机构介绍视频
function playVideo() {
	var mask = base.$('#mask');
	var trigger_play = base.$('#trigger_play');
	var video_popup = base.$('#video_popup');
	var close_video = base.$('#close_video');
	var video = base.$('video')[0];
	trigger_play.onclick = function() {
		mask.style.display = 'block';
		video_popup.style.display = 'block';
		video.play();
	}
	close_video.onclick = function() {
			mask.style.display = 'none';
			video_popup.style.display = 'none';
			video.pause();
		}
		//点击背景部分也可以关闭视频
	mask.onclick = function() {
		close_video.onclick();
	}
}
playVideo();

//热门排行
function popular() {
	var hot_course = base.$('#hot_course');
	base.get('http://study.163.com/webDev/hotcouresByCategory.htm', '', function(a) {
		var arr = JSON.parse(a);
		var str = '';
		for (var i = 0; i < arr.length; i++) {
			str += '<li class="f-cb">';
			str += '<div class="pic fl">';
			str += '<a href="javascript:;"><img src="' + arr[i].smallPhotoUrl + '" alt=""></a>';
			str += '</div>';
			str += '<div class="text fl">';
			str += '<a href="javascript:;">' + arr[i].name + '</a>';
			str += '<p class="fansCount"><span></span>' + arr[i].learnerCount + '</p>';
			str += '</div>';
			str += '</li>';
		}
		//1-10号课程再放置10个，以实现右侧热门排行无缝滚动使用
		for (var i = 0; i < 10; i++) {
			str += '<li class="f-cb">';
			str += '<div class="pic fl">';
			str += '<a href="javascript:;"><img src="' + arr[i].smallPhotoUrl + '" alt=""></a>';
			str += '</div>';
			str += '<div class="text fl">';
			str += '<a href="javascript:;">' + arr[i].name + '</a>';
			str += '<p class="fansCount"><span></span>' + arr[i].learnerCount + '</p>';
			str += '</div>';
			str += '</li>';
		}
		hot_course.innerHTML = str;
	});
	//实现每5秒滚动刷新热门排行
	function autoSlide(){
		var target = 19; //起始位置top值
		var speed = -2; //步长
		setInterval(function() {
			target -= 70;
			var timer = null;
			timer = setInterval(function() {
				var result = target - hot_course.offsetTop;
				hot_course.style.top = hot_course.offsetTop + speed + 'px';
				if (Math.abs(result) <= Math.abs(speed)) {
					clearInterval(timer);
					hot_course.style.top = target + 'px';
				}
			}, 10)
			if (target == -1451) {
				target = -51;
				hot_course.style.top = 19 + 'px';
			}
		}, 5000)
	};
	autoSlide();
}
popular();