//xycApp.config.initBase('./application'); //if your folder is application

xycApp.config.initLogged(localStorage.getItem('ca'), function (string, parenttag) {
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