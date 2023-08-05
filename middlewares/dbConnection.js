const mongoose = require('mongoose');
const logger = require('../functions/logger');

function dbConnect (dbHost) {
    mongoose.connect(dbHost)
        .then(() => logger.info('Connected to MongoDB database'))
        .catch(e => logger.error(e));
}

module.exports = { dbConnect }