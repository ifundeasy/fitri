//xycApp.config.initBase('./application'); //if your folder is application

xycApp.config.initLogged(localStorage.getItem('ca'), function (string, parenttag) {
	var allowed_ip = xycApp.initial.session.allowed_ip;

	xycApp.config.getWithParam('internal_identity', {
		params : xycApp.initial.session.restricted.id_contact
	}, function(arguments1){
		xycApp.initial.session.identity.internal = arguments1;
		xycApp.config.getWithParam('modules', {
			params : arguments1[0].int_group_code
		}, function(arguments2){
			xycApp.initial.session.modules = arguments2;

			window.document.title = "· Scale | Application";
			xycApp.config.initView("nav.html", function (plain) {
				$(plain).appendTo("section.hbox > aside#nav > section.vbox");
			});
			xycApp.config.initView("content.html", function (plain) {
				$(plain).appendTo("section#scale-main-content");
			});
			xycApp.config.initView("livefeed.html", function (plain) {
				$(plain).appendTo("aside#sidebar");
			});
			xycApp.config.initView("north.html", function (plain) {
				$(plain).prependTo("section#scale-parent");
				console.log('north.html', xycApp.initial.session.identity)
			});
		});
	});
});