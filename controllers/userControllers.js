const { User } = require('../db/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const cookie =  require('cookie');

// GET method
const getLogout = async (req, res) => {
    return res.status(200).clearCookie('refreshToken').json({ message: 'Successful logout' });
}

const getRefresh = async (req, res) => {
    var error = false;
    const refreshToken = cookie.parse(req.headers.cookie || '').refreshToken;
    if (!refreshToken) return res.status(200).json()
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, function (err, decoded) {
        if (err) {
            error = true;
        } else {
            user = { _id: decoded._id, roles: decoded.roles}
        }
      })
    if (error) return res.status(200).clearCookie('refreshToken').json();
    const newRefreshToken =  await jwt.sign(user, process.env.REFRESH_SECRET, { expiresIn: '7d' });
    const newAccessToken =  await jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: '5m' });
    return res.status(200)
        .cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
        .json({ newAccessToken })
};

const getUsers = async (req, res) => {
    const users = await User.find({},'-password');
    if (!users) return res.status(200).json({ error: 'No users found' });
    return res.status(200).json(users);
}

// POST method
const postUserData = async (req, res) => {
    const user = await User.findById(res.locals.id);
    const userData = _.pick(user, ['username', 'email', 'id', 'roles'])
    return res.status(200).json({ data: userData, isLogged: true, status: 'succeeded', error: null});
}

const postUser = async (req, res) => {
    req.body.username = req.body.username.toUpperCase();
    req.body.email = req.body.email.toUpperCase();
	const user = await User.findOne({ username: req.body.username });
	if (user) return res.status(200).json({ error: 'Username already in use' });
	const email = await User.findOne({ email: req.body.email });
	if (email) return res.status(200).json({ error: 'Email address already in use' });
    const password = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({ username: req.body.username, email: req.body.email, password: password, roles: [ process.env.USER_CODE ] });
    const refreshToken = await jwt.sign({ _id: newUser.id, roles: newUser.roles }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
    const accessToken = await jwt.sign({ _id: newUser.id, roles: newUser.roles }, process.env.ACCESS_SECRET, { expiresIn: '5m' });
    return res.status(200)
        .cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
        .json({ message: `User '@${ newUser.username.toLowerCase() }' created`, accessToken: accessToken, user: _.pick(newUser,['username', 'email', 'id', 'roles']) });
}

const postAuth = async (req, res) => {
    const user = await User.findOne({ email: req.body.email.toUpperCase()});
    if (!user) return res.status(200).json({ error: 'Email not found' });
    const auth = await bcrypt.compare(req.body.password, user.password);
    if(!auth) return res.status(200).json({ error: 'Wrong password' });
    const refreshToken = await jwt.sign({ _id: user.id, roles: user.roles }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
    const accessToken = await jwt.sign({ _id: user.id, roles: user.roles }, process.env.ACCESS_SECRET, { expiresIn: '5m' });
    return res.status(200)
        .cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
        .json({ message: `User '@${ user.username.toLowerCase() }' logged in`, accessToken: accessToken, user: _.pick(user,['username', 'email', 'id', 'roles']) });
}

// PUT method

// DELETE method

module.exports = { getLogout, postUserData, getUsers, postAuth, getRefresh, postUser };