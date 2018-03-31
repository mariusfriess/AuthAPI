var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

mongoose.connect('mongodb://localhost:27017/TestDatabase');

var AccountAPI = require('./account.api');

router.post('/account/login', AccountAPI.login);
router.post('/account/username', AccountAPI.checkUsername);

module.exports = router;