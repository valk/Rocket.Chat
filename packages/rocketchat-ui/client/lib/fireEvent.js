window.fireGlobalEvent = function _fireGlobalEvent(eventName, params) {
	window.dispatchEvent(new CustomEvent(eventName, {detail: params}));

	Tracker.autorun((computation) => {
		const enabled = RocketChat.settings.get('Iframe_Integration_send_enable');
		if (enabled === undefined) {
			return;
		}
		computation.stop();
		if (enabled) {
			parent.postMessage({
				eventName,
				data: params
			}, RocketChat.settings.get('Iframe_Integration_send_target_origin'));
		}
	});
};

window.roomType = function _roomType(key) {
	return key === 'd' ? 'direct_msg' : 'group';
};

window.getPageKey = function _getPageKey() {
	let key = Session.get('sa-page-key');
	if (!Session.get('page-mone-sent')) {
		const user = RocketChat.models.Users.findOne();
		if (user) {
			window.fireMonePageEvent(user);
		}
	}
	if (key) {
		return key;
	}
	key = (Math.floor(new Date().getTime()/1000)*1000+Math.floor(Math.random()*1000)).toString(36);
	Session.set('sa-page-key', key);

	return key;
};

window.fireMoneEvent = function _fireMoneEvent(t, s, a, d) {
	const params = {
		type: t,
		source: s,
		action: a,
		key: window.getPageKey()
	};
	if (d) {
		params['data'] = d;
	}
	$.ajax({
		type: 'POST',
		url: `https://${ location.host.replace('rc.', '') }/mone_event`,
		data: params
	});
};

window.fireMonePageEvent = function _fireMonePageEvent(user) {
	$.getJSON('https://jsonip.com/?callback=?', function(data) {
		const d = [];
		d.push(2);
		d.push('rocketchat');
		d.push(window.getPageKey());
		d.push('');
		d.push('');
		d.push('rc.seekingalpha.com');
		d.push('');
		d.push(data.ip);
		d.push('');
		d.push('');
		d.push('');
		d.push('');
		d.push(user ? user.emails[0].address : '');

		$.ajax({
			type: 'POST',
			url: `https://${ location.host.replace('rc.', '') }/mone`,
			data: {
				mone: d.join(';;;')
			}
		});

	});
	Session.set('page-mone-sent', true);
};
