const { User } = require('../db/models');
const bcrypt = require('bcrypt');
const logger = require('../functions/logger');

async function createAdmin () {
    const admin = await User.findOne({ roles: process.env.ADMIN_CODE });
    if (admin) return logger.info('ADMIN registred');
    logger.info('Creating admin');
    const password = await bcrypt.hash('admin', 10);
    const newAdmin = { 
		username: 'ADMIN',
		email: 'ADMIN@ADMIN.COM',
		password: password,
		roles: [ process.env.ADMIN_CODE, process.env.MOD_CODE, process.env.USER_CODE ]
	}
    await User.create(newAdmin);
	logger.warn('ADMIN password must be changed');
}

module.exports = { createAdmin }