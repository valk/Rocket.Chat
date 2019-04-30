import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { Layout } from '../../../../ui-utils';

Template.burger.helpers({
	unread() {
		const unread = Session.get('unread');
		window.fireGlobalEvent('unread-messages', { unread_msgs: unread });
		return unread;
	},
	isMenuOpen() {
		if (Session.equals('isMenuOpen', true)) {
			return 'menu-opened';
		}
	},
	embeddedVersion() {
		return Layout.isEmbedded();
	},
});
