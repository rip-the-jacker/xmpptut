var Hello = {
	connection: null,
	start_time: null,
	log: function (msg) {
		$('#log').append("<p>" + msg + "</p>");
	},
	send_ping: function (to) {
		var ping = $iq({
			to: to,
			type: "get",
			id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
		var ping2 = $iq({
			to: to,
			type: "get",
			id: "ping2"}).c("ping", {xmlns: "urn:xmpp:ping"});
		Hello.log("Sending pings to " + to + ".");
		Hello.start_time = (new Date()).getTime();
		Hello.connection.send(ping2);
		Hello.connection.send(ping);
	},

	handle_pong: function (iq) {
		var elapsed = (new Date()).getTime() - Hello.start_time;
		Hello.log("Received pong from server in " + elapsed + "ms");
		Hello.connection.disconnect();
		return false;
	},

	handle_pong2: function (iq) {
		var elapsed = (new Date()).getTime() - Hello.start_time;
		Hello.log("Received pong2 from server in " + elapsed + "ms");
		return false;
	}
};

$(document).ready(function () {
	$('#jid').focus();
	$('#submitbtn').click(function () {
		$(document).trigger('connect', {
			// jid: $('#jid').val(),
			// password: $('#password').val()
			jid: 'god@aok.kp',
			password: 'kodeplay'
		});
		$('#login_dialog').hide();
	})

	$(document).bind('connect', function (ev, data) {
		var conn = new Strophe.Connection("http://aok.kp/http-bind");
		conn.connect(data.jid, data.password, function (status) {
			if (status === Strophe.Status.CONNECTED) {
				$(document).trigger('connected');
			} else if (status === Strophe.Status.DISCONNECTED) {
				$(document).trigger('disconnected');
			}
		});
		Hello.connection = conn;
	});
	$(document).bind('connected', function () {
		// inform the user
		Hello.log("Connection established.");
		Hello.connection.addHandler(Hello.handle_pong, null, "iq", null, 'ping1');
		Hello.connection.addHandler(Hello.handle_pong2, null, "iq", null, 'ping2');
		var domain = Strophe.getDomainFromJid(Hello.connection.jid);
		Hello.send_ping(domain);
	});
	$(document).bind('disconnected', function () {
		Hello.log("Connection terminated.");
		// remove dead connection object
		Hello.connection = null;
	});
});