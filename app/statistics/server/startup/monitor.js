import { Meteor } from 'meteor/meteor';
import { InstanceStatus } from 'meteor/konecty:multiple-instances-status';

import { SAUMonitorClass } from '../lib/SAUMonitor';
import { settings } from '../../../settings/server';

const SAUMonitor = new SAUMonitorClass();

Meteor.startup(() => {
	if (settings.get('Temp_Disable_session')) {
		return SAUMonitor.stop();
	}
	SAUMonitor.start(InstanceStatus.id());
});
