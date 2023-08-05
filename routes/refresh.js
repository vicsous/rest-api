const express = require('express');
const router = express.Router();
const { getRefresh } = require('../controllers/userControllers');

router.route('/')
    .post(getRefresh)

module.exports = router;