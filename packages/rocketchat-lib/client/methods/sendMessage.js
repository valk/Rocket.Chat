Meteor.methods({
	sendMessage(message) {
		if (!Meteor.userId() || _.trim(message.msg) === '') {
			return false;
		}
		const user = Meteor.user();
		message.ts = isNaN(TimeSync.serverOffset()) ? new Date() : new Date(Date.now() + TimeSync.serverOffset());
		message.u = {
			_id: Meteor.userId(),
			username: user.username
		};
		if (RocketChat.settings.get('UI_Use_Real_Name')) {
			message.u.name = user.name;
		}
		message.temp = true;

		message.room = RocketChat.models.Rooms.findOne({_id: message.rid});
		if (message.room.t === 'd') {
			message.recipient = RocketChat.OTR.getInstanceByRoomId(message.rid).peerId;
		}
		window.fireGlobalEvent('sent-message', message);
		message = RocketChat.callbacks.run('beforeSaveMessage', message);
		RocketChat.promises.run('onClientMessageReceived', message).then(function(message) {
			ChatMessage.insert(message);
			return RocketChat.callbacks.run('afterSaveMessage', message);
		});
	}
});
