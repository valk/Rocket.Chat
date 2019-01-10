import _ from 'underscore';
import { FileUploadClass } from '../lib/FileUpload';
import '../../ufs/Webdav/server.js';

const get = function(file, req, res) {
	this.store.getReadStream(file._id, file).pipe(res);
};

const copy = function(file, out) {
	this.store.getReadStream(file._id, file).pipe(out);
};

const WebdavUploads = new FileUploadClass({
	name: 'Webdav:Uploads',
	get,
	copy,
	// store setted bellow
});

const WebdavAvatars = new FileUploadClass({
	name: 'Webdav:Avatars',
	get,
	copy,
	// store setted bellow
});

const WebdavUserDataFiles = new FileUploadClass({
	name: 'Webdav:UserDataFiles',
	get,
	copy,
	// store setted bellow
});

const configure = _.debounce(function() {
	const uploadFolderPath = RocketChat.settings.get('FileUpload_Webdav_Upload_Folder_Path');
	const server = RocketChat.settings.get('FileUpload_Webdav_Server_URL');
	const username = RocketChat.settings.get('FileUpload_Webdav_Username');
	const password = RocketChat.settings.get('FileUpload_Webdav_Password');

	if (!server || !username || !password) {
		return;
	}

	const config = {
		connection: {
			credentials: {
				server,
				username,
				password,
			},
		},
		uploadFolderPath,
	};

	WebdavUploads.store = FileUpload.configureUploadsStore('Webdav', WebdavUploads.name, config);
	WebdavAvatars.store = FileUpload.configureUploadsStore('Webdav', WebdavAvatars.name, config);
	WebdavUserDataFiles.store = FileUpload.configureUploadsStore('Webdav', WebdavUserDataFiles.name, config);
}, 500);

RocketChat.settings.get(/^FileUpload_Webdav_/, configure);
