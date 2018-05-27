
// 弹框
$.dialog = function(msg, opts) {
	seajs.use(['/assets/js/weebox/weebox.js', 
		'/assets/js/weebox/bgiframe.js', 
		'/themes/default/css/plugins/weebox.css'], function(){
		$.weeboxs.open(msg, opts);
	});
}

// 提示框
$.notice = function(title, msg) {
	$.dialog(msg, {
		title: title,
		type: 'dialog',
		width: 400,
		isFull: false,
		showTitle: title ? 1: 0,
		showButton: false
	});
}

// 会员登录
$.login = function() {
	if ($.getCookie('User')) {
		return true;
	}

	var ref = encodeURIComponent(window.location.href);
	$.dialog('/?module=default&controller=passport&action=fast_login&ref='+ref, {
		contentType: 'ajax',
		type: 'dialog',
		title: '您尚未登录',
		width: 420,
		height: 300,
		showButton: false,
	});

	seajs.use('/assets/js/validator/validator.sea.js', function(validator){
		validator.init('.rn-fast-login', {
			rules: {
				'[name=mobile]': { valid: 'required|mobile', errorText: '请输入手机号码|号码格式不正确' },
				'[name=password]': { valid: 'required', errorText: '请输入密码' }
			}
		});
	});

	return false;
}

// 喜欢
$.follow = function(refType, refId) {
	if ($.login()) {
		$.getJSON('/?module=usercp&controller=follow&action=add', {type:refType, id:refId}, function(json){
			$.notice(0, '<h3 class="text-center text-block" style="padding:30px 0;">'
				+ '<i class="icon-ok icon-large" style="color:#39a30b;"></i> '
				+ json.message +'</h3><div class="text-center" style="padding:10px">'
				+ '<a href="/usercp/follow" class="btn btn-primary">查看我的关注</a></div>');
		});
	}
}

// 添加对比
$.addContrast = function(id) {
	$.get('/?module=default&controller=product&action=contrast&t=add', {id:id}, function(){
		$.refreshContrast();
	});
}

$.delContrast = function(id) {
	$.get('/?module=default&controller=product&action=contrast&t=del', {id:id}, function(){
		$.refreshContrast();
	});
}

$.clearContrast = function() {
	$.get('/?module=default&controller=product&action=contrast&t=clear', function(){
		$.refreshContrast();
	});
}

// 刷新对比
$.refreshContrast = function() {
	$.getJSON('/?module=default&controller=product&action=contrast&t=getJson', {cid: cid}, function(json){
		var items = [];
		$.each(json, function(key, val) {
			items.push('<li id="'+key+'">'
				+'<a href="/?controller=product&action=detail&id='+val.id+'.html">'+val.title+'</a>'
				+'<a href="javascript:;" onclick="$.delContrast('+val.id+')" class="glyphicon glyphicon-remove"></a>'
				+'</li>');
		});

		$('.pro-contrast-simple').remove();
		if (items.length >= 1) {
			$('body').append('<div class="pro-contrast-simple">'
				+'<h3>机型对比</h3>'
				+'<ul>'+items.join('')+'</ul>'
				+'<div class="btns"><a href="/?controller=product&action=contrast&cid='+cid+'" class="btn btn-primary">开始对比</a>'
				+'<a href="javascript:;" onclick="$.clearContrast()" class="pull-right">清空</a></div>'
				+'</div>');
		}
	});
}

$.hideXt = function(flag) {
	if (flag) {
		$('.xt').hide();
	} else {
		$('.xt').show();
	}
}

$.hightLightBt = function(flag) {
	if (flag) {
		$('.bt td').css('color', '#ed1b23');
	} else {
		$('.bt td').css('color', 'auto');
	}
}

// 设置COOKIE
$.setCookie = function (name, value) {
	var Days = 30; //此 cookie 将被保存 30 天	
		var exp	= new Date();		//new Date("December 31, 9998");	
		exp.setTime(exp.getTime() + Days*24*60*60*1000);	
		document.cookie = name + "="+ escape (value) + ";expires=" +exp.toGMTString()+";path=/;"; 
}

// 获取COOKIE
$.getCookie = function(name) {
	var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)")); 
		if(arr != null) return unescape(arr[2]); return null; 
}

// 删除COOKIE
$.delCookie = function(name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval=getCookie(name);
		if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

// BASE64 编码
$.base64Encode = function(input){
	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		while (i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) { enc3 = enc4 = 64; } 
				else if (isNaN(chr3)) { enc4 = 64; }
				output = output +
				keyStr.charAt(enc1) + keyStr.charAt(enc2) +
				keyStr.charAt(enc3) + keyStr.charAt(enc4);
		}
		return output;
}

// BASE64 解码
$.base64Decode = function(input) {
	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
				enc1 = keyStr.indexOf(input.charAt(i++));
				enc2 = keyStr.indexOf(input.charAt(i++));
				enc3 = keyStr.indexOf(input.charAt(i++));
				enc4 = keyStr.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);
				if (enc3 != 64) { output = output + String.fromCharCode(chr2); }
				if (enc4 != 64) { output = output + String.fromCharCode(chr3); }
		}
		return output;
}

// 格式化价格
$.formatMoney = function(number, places, symbol, thousand, decimal) {
	number = number || 0;
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "$";
	thousand = thousand || ",";
	decimal = decimal || ".";
	var negative = number < 0 ? "-" : "",
			i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
			j = (j = i.length) > 3 ? j % 3 : 0;
	return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}

//加载单面
$.fn.loadContent = function(code) {
	$(this).load('/?module=default&controller=page&action=get_content', {code: code});
}