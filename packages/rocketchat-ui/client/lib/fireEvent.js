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

window.fireMoneEvent = function _fireMoneEvent(type, source, action, data) {
	const params = {
		type: type,
		source: source,
		action: action
	};
	if (data) {
		params['data'] = data;
	}
	$.ajax({
		type: 'POST',
		url: `https://${ location.host.replace('rc.', '') }/mone_event`,
		data: params
	});
};


