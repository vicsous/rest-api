const pjson = require('../package.json');

module.exports = function() {
	console.log(' --- ' + pjson.name + ' v.' + pjson.version + ' --- ');
}