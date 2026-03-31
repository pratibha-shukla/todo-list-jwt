

const express = require('express');
const router = express.Router();
const userCtrl = require('../controller/userController'); // Ensure this path is correct
const guard = require('../middleware/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/me', guard, userCtrl.getMe);

module.exports = router;

