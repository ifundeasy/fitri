//xycApp.config.initBase('./application'); //if your folder is application

if(!localStorage.getItem('ca')){
	xycApp.config.initRemoveSession(function(){
		$('body').html('');
		xycApp.config.initView("login.html", function(plain){
			$(plain).appendTo("body");
		});
		window.document.title = "· Scale | Login";
	})
} else {
	xycApp.config.initDoLogin(localStorage.getItem('ca'), function (param, tag) { //initialize xyc.session = r
		window.document.title = "· Scale | Application";
		xycApp.config.initView("nav.html", function(plain){
			$(plain).appendTo("section.hbox > aside#nav > section.vbox");
		});
		xycApp.config.initView("content.html", function(plain){
			$(plain).appendTo("section#scale-main-content");
		});
		xycApp.config.initView("livefeed.html", function(plain){
			$(plain).appendTo("aside#sidebar");
		});
		xycApp.config.initView("north.html", function(plain){
			$(plain).prependTo("section#scale-parent");
		});
	});
}
