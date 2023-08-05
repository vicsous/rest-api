const express = require('express');
const router = express.Router();
const { postUserData } = require('../controllers/userControllers');
const verifyToken = require('../middlewares/verifyToken');

router.route('/')
    .post(verifyToken, postUserData);

module.exports = router;