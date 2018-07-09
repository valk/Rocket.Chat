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

window.setPageKey = function _setPageKey(key) {
	Session.set('sa-page-key', key);
};

window.getPageKey = function _getPageKey() {
	let key = Session.get('sa-page-key');
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
		version: 2,
		key: window.getPageKey()
	};
	if (d) {
		params['data'] = JSON.stringify(d);
	}
	$.ajax({
		type: 'POST',
		url: `https://${ location.host }/mone_event`,
		data: params,
		crossDomain: true,
		dataType: 'json'
	});
};

window.getMachineCookie = function _getMachineCookie() {
	if (!localStorage.machineCookie) {
		localStorage.machineCookie = Math.round((new Date()).getTime() + Math.random() * 1000000003366).toString();
	}
	return localStorage.machineCookie;
};

function queueSendMone() {
	// wait for RC back end to catch up with RC client
	let user = RocketChat.models.Users.findOne(Meteor.userId());

	if (!user || !user.customFields) {
		window.setTimeout(queueSendMone);
	} else {
		const d = [];
		d.push(2); //Version
		d.push('rocketchat'); //Mone Type
		d.push(window.getPageKey()); //page_key
		d.push(''); //referrer_key
		d.push(''); //referrer
		d.push('rc.seekingalpha.com'); //url
		d.push(''); //url_params
		d.push(window.getMachineCookie()); //machine_cookie
		d.push(''); //session_cookie
		d.push(RocketChat.models.Users.findOne(Meteor.userId()).customFields.sa_id); //user_id
		d.push(''); //user_nick
		d.push(''); //user_email
		d.push(''); //user_vocation
		d.push(''); //author_slug
		d.push(''); //user_mywebsite_url
		d.push(''); //gigya_notified_login
		d.push(''); //user_gigya_settings
		d.push(''); //user_watchlist_slugs
		d.push(''); //user_non_watchlist_slugs
		d.push(''); //user_watchlist_authors

		$.ajax({
			type: 'POST',
			url: `https://${ location.host }/mone`,
			data: {
				mone: `${ d.join(';;;') } `
			}
		});
	}
}

window.fireMonePageEvent = function _fireMonePageEvent() {
	window.setTimeout(function() {
		Session.set('page-mone-sent', true);
		if (window.top !== window) {
			return;
		}
		queueSendMone();
	});
};
