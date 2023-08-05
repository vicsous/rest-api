const jwt = require('jsonwebtoken');
const { ACCESS_SECRET } = process.env;

async function verifyToken (req, res, next) {
  jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_SECRET, async function(err, decoded) {
    if (err) {
        return res.status(200).json({ error: 'Invalid access token'});
    }
    res.locals.id = decoded._id;
    next()
  });
}

module.exports = verifyToken;