const { Error } = require('../db/models');
const fs = require('fs');

const logger = {
	error: async (err) => {
		const errObj = { message: err.message, stack: err.stack };
		const newError = await Error.create(errObj);

		const logMessage = `Error: ${err.message} ${new Date(newError.createdAt)}\n`;
		fs.appendFile('errors.log', logMessage, (err) => {
		  if (err) {
			console.error('Failed to write error to file:', err);
		  }
		});
		console.error(logMessage);
	},
	warn: (warn) => {
		console.warn('Warning: ' + warn);
	},
	info: (info) => {
		console.info('Info: ' + info);
	} 
}

module.exports = logger;