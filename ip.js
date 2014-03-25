/**
 * Created by rappresent on 3/24/14.
 */

if (xycApp.initial){
	xycApp.initial.session.ipinfodb = {
		target : "ip-country", //[OR] ip-city
		sfnKey : "e5ca32be94b6fa170188be967ffd24aef4be17288e1e30cd3f53dceb4ff80c3d", //Private!
		format : "json",
		request: "http://api.ipinfodb.com/v3/",
		result : "undefined",
		fn     : function (callback) {
			var me = this;
			me.result = $.ajax({
				url : me.request + me.target+'/?key='+me.sfnKey+'&format='+me.format+'&callback=?',
				method     : 'GET',
				cache      : false,
				async      : false,
				cors       : true,
				xhrFields  : {
					withCredentials: true
				},
				crossDomain: true,
				dataType: 'json',
				success : function(response){
					me.result = response;
					return callback(me.result);
				}
			}).fail(function(response) {
				me.result = "undefined";
				return callback(me.result);
			});
		}
	};
}