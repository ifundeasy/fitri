/**
 * WHAT I USE HERE : global variable is xycApp.config;
 * WHAT I USE HERE : global variable is xycApp.initial;
 * It should be found @ xyc.js
 */

function z () {
	var me = this;
	me.href = 'http://127.0.0.1/scale/';
	me.whereAmI = 'undefined'; //location, gps, ip
}

/**
 *
 * @param string : path directori base aplication
 * @returns {string}
 */
z.prototype.initBase = function (string) {
	var me = this;
	string = string || './app';

	me.base = string;
	me.view = me.base + '/view/';
	me.ctrl = me.base + '/ctrl/';
	me.model = me.base + '/model/';
	me.store = me.base + '/store/';

	return string
};

/**
 *
 * @param fn : your custom function
 * @returns {string} to xycApp.config.whereAmI
 */
z.prototype.initWhereAmI = function (fn) {
	var me = this;
	typeof fn == 'function' ? me.whereAmI = fn() : me.whereAmI = fn;
	return me.whereAmI
};

/**
 *
 * @param url : path directori {yourbase}/view/{path to your file}/file.html
 * @param callback : your custom function {arguments[data, status, xhr]}
 */
z.prototype.initView = function (url, callback) {
	var me = this;
	$.ajax({
		url        : me.view + url,
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
			/**
			 *
			 */
			return callback(data, status, xhr)
		}
	}).fail(function(){
		console.log('fail to load : ', url)
	});
};

/**
 *
 * @param type : string ['model', 'store', 'ctrl']
 * @param url : xycApp.config.base + ['model', 'store', 'ctrl'] + yourfile
 * @param id : your string id
 * @returns {*} : required your parameters => result, its basicly function of $LAB.script('the_src')
 */
z.prototype.initScript = function (type, url, id) {
	var me = this;
	id = type +'-'+ (id || new Date().getTime());

	switch (type) {
		case 'model' :
			return $LAB.script({
				id  : id,
				src : me.model + url,
				type: 'text/javascript'
			});
			break;
		case 'store' :
			return $LAB.script({
				id  : id,
				src : me.store + url,
				type: 'text/javascript'
			});
			break;
		case 'controller' :
			return $LAB.script({
				id  : id,
				src : me.ctrl + url,
				type: 'text/javascript'
			});
			break;
	}
};
/**
 *
 * @param target : string selector [#id, .class, tag] <= for view only
 * @param object : <!Example> xycApp.config.initModule({model : [filename], controller : [filename]})
 * @param namespace : string {your prefix id} <= defaults is (new Date().getTime())
 */
z.prototype.initModule = function (target, object, namespace) {
	var me = this;
	var date = new Date().getTime();
	if (!namespace) namespace = date;
	if ((typeof object == "object") && (Object.isEmpty(object) == false)) {
		Object.each(object, function(keys, value){
			var id = keys.toUpperCase() +'-'+ namespace;
			switch (keys) {
				case 'model' :
					if ((Array.isArray(value) == true) && (value.length > 0))
					Array.each(value, function(arr, idx){
						return $LAB.script({
							id  : id+'-'+idx,
							src : me.model + arr,
							type: 'text/javascript'
						});
					});
					break;
				case 'store' :
					if ((Array.isArray(value) == true) && (value.length > 0))
						Array.each(value, function(arr, idx){
							return $LAB.script({
								id  : id+'-'+idx,
								src : me.store + arr,
								type: 'text/javascript'
							});
						});
					break;
				case 'ctrl' :
					if ((Array.isArray(value) == true) && (value.length > 0))
						Array.each(value, function(arr, idx){
							return $LAB.script({
								id  : id+'-'+idx,
								src : me.ctrl + arr,
								type: 'text/javascript'
							});
						});
					break;
				case 'view' :
					if ((Array.isArray(value) == true) && (value.length > 0))
					Array.each(value, function(arr, idx){
						$.ajax({
							url        : me.view + arr,
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
								$(target).html('');
								$(data).prependTo(target);
							}
						}).fail(function(){
							console.log('fail to load : ', me.view + arr)
						});
					});
					break;
			}
		})
	} else {
		console.log('<!Example> xycApp.config.initModule({model : [filename], controller : [filename]})');
	}
};

/**
 *
 * @param string : sid <= localStorage.getItem('ca')
 * @param callback : your custom function
 */
z.prototype.initSession = function (string, callback) {
	$.ajax({
		url: xycApp.initial.session.url + string,
		method: 'GET',
		cors: true,
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json',
		success: function(response){
			callback(response);
		}
	});

};
/**
 *
 * @param callback : your custom function
 * @returns {*}
 */
z.prototype.initRemoveSession = function (callback) {
	xycApp.initial.session.now = "undefined";

	try {
		delete localStorage.getItem('ca');
	} catch (e) {}
	return callback()
};

/**
 * Force show login when false on checking session [z.prototype.initLogged()]
 * @param callback : your custom function
 */
z.prototype.initShowLogin = function (callback) {
	var me = this;
	me.initRemoveSession(function(){
		$('body').html('');
		me.initView("login.html", function(plain){
			$(plain).appendTo("body");
		});
		window.document.title = "· Scale | Login";
	});
};

/**
 * <body></body> : is empty.. you must fill it with your parent container
 * @param callback
 */
z.prototype.parenttags = function (callback) {
	$('body').html('');
	tags =
		'<section class="vbox" id="scale-parent">' +
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

	$(tags).appendTo('body');
	callback(tags);
};

/**
 * Checking session..
 * @param string : sid session localStorage.getItem('ca')
 * @param callback : your custom function { arguments[ {@param:string}, {tag} ]}
 */
z.prototype.initLogged = function (string, callback) { //init this to error :D
	var me = this;
	if (string) {
		console.log('on checking session.. please wait..'); //loader here...
		me.initSession(string, function (response) {
			console.log(response);
			if (response.success == true) {
				me.parenttags(function (tags) {
					xycApp.initial.session.now = response;
					return callback(string, tags);
				})
			} else {
				me.initShowLogin();
			}
		});
	} else {
		me.initShowLogin();
	}
};

/**
 * initialize all function
 */
z.prototype.init = function () {
	var me = this;
	me.initBase(); //initial first for default base path
};

/**
 * initialize all function to xycApp.config, then launch them!!
 * @type {z}
 */
xycApp.config = new z ();
xycApp.config.init();