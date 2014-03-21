/**
 * Created by rappresent on 3/18/14.
 */

function xyc() {
	var me = this;
	me.href = 'http://127.0.0.1/scale';
	me.app = './app/';
}

xyc.prototype.initWeb = function (param) {
	var me = this;
	me.web = param;
};

xyc.prototype.initHTML = function (url, callback) {
	var me = this;
	$.ajax({
		url        : me.app + url,
		method     : 'GET',
		cache      : false,
		//async      : false,
		cors       : true,
		xhrFields  : {
			withCredentials: true
		},
		crossDomain: true,
		dataType: 'html',
		success    : function (data, status, xhr) {
			return callback(data, status, xhr)
		}
	}).fail(function(){
		console.log('fail to load : ', url)
	});
};

xyc.prototype.initWhereIAm = function (param) {
	var me = this;
	me.whereIAm = param
};

xyc.prototype.initDoLogin = function (param, callback) { //init this to error :D
	var me = this;
	var tag = '<section class="vbox" id="scale-parent">' +
		'<section>' +
		'<section class="hbox stretch">' +
		'<aside class="bg-black aside-md hidden-print" id="nav">' +
		'<section class="vbox"></section>' +
		'</aside>' +
		'<section id="content">' +
		'<section class="hbox stretch">' +
		'<section id="scale-main-content"></section>' +
		'<aside class="aside-md bg-black hide" id="sidebar"></aside>' +
		'</section>' +
		'<a href="#" class="hide nav-off-screen-block" data-toggle="class:nav-off-screen" data-target="#nav"></a>' +
		'</section>' +
		'</section>' +
		'</section>' +
		'</section>';
	$('body').html('');
	$(tag).appendTo('body');
	if (localStorage.ca) {
		param = localStorage.ca;
		me.session = localStorage.ca;
		console.log('xyc.prototype.initDoLogin :', param);
		return callback(param, tag);
	}
};

xyc.prototype.init = function () {
	var me = this;
	//me.initWhereIAm('undefined');
	me.initWeb(config);
	me.initHTML('application.html', function () {
		$(arguments[0]).prependTo("body");
	})
};

var xyc = new xyc();
xyc.init();