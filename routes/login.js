const express = require('express');
const router = express.Router();
const { postAuth } = require('../controllers/userControllers');

router.route('/')
    .post(postAuth)

module.exports = router;