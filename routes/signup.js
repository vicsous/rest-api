const express = require('express');
const router = express.Router();
const { postUser } = require('../controllers/userControllers');

router.route('/')
    .post(postUser)

module.exports = router;