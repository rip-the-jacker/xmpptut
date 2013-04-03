var Arthur = {
	connection: null,
	handle_message: function (message) {
		var body = $(message).find('body').contents();
		console.log('body is ',body);
		var div = $("<div></div>");
		body.each(function () {
			if (document.importNode) {
				$(document.importNode(this, true)).appendTo(div);
			}
			else {
				div.append(this.xml);
			}
		});
		div.prependTo("#stream");
		return true;
	}
};
$(document).ready(function () {
	$('#submitbtn').click(function () {
		$(document).trigger('connect', {
			// jid: $('#jid').val(),
			// password: $('#password').val()
			jid: 'shiva@aok.kp',
			password: 'kodeplay'
		});
		$('#login_dialog').hide();
	})

	$('#input').keyup(function () {
		var left = 140 - $(this).val().length;
		$('#counter .count').text('' + left);
	});

	$('#input').keypress(function (ev) {
		if (ev.which === 13) {
			ev.preventDefault();
			var text = $(this).val();
			$(this).val('');
			var msg = $msg({to: 'ashoka@aok.kp', type: 'chat'})
			.c('body').t(text);
			Arthur.connection.send(msg);
		}
	});
});

$(document).bind('connect', function (ev, data) {
	var conn = new Strophe.Connection(
		'http://aok.kp/http-bind');
	conn.connect(data.jid, data.password, function (status) {
		if (status === Strophe.Status.CONNECTED) {
			$(document).trigger('connected');
		} else if (status === Strophe.Status.DISCONNECTED) {
			$(document).trigger('disconnected');
		}
	});
	Arthur.connection = conn;
});

$(document).bind('connected', function () {
	console.log('connected');
	Arthur.connection.addHandler(Arthur.handle_message,
		null, null, null);
	Arthur.connection.send($pres());
});

$(document).bind('disconnected', function () {
// nothing here yet
});