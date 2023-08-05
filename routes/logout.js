const express = require('express');
const router = express.Router();
const { getLogout } = require('../controllers/userControllers');

router.route('/')
    .post(getLogout)

module.exports = router;