const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/merchant', require('./merchant.routes'));
router.use('/', require('./common.routes'));
router.use('/admin', require('./superadmin.routes'));
// router.use('/merchant', require('./merchant.routes'));
// router.use('/hub', require('./hub.routes'));
// router.use('/agent', require('./agent.routes'));

module.exports = router;
