const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const decrypt = require('../middlewares/decrypt.middleware');
const { get_settings,get_sidebar,decryptTest,get_Weight,get_active_cupons,get_active_gateway,get_support_data } = require('../controllers/common.controller');
const { SendTestMail,SendLiveMail } = require('../controllers/mailer.js');

router.get('/get-settings', get_settings);
router.post('/get-sidebar-data', auth,get_sidebar);
router.post('/get-weight', auth,get_Weight);
router.get('/get-active-cupons', auth,get_active_cupons);
router.get('/get-active-gateway', auth,get_active_gateway);
router.get('/get-support-data', auth,get_support_data);


router.post('/test-mail', SendTestMail);
router.post('/live-mail', SendLiveMail);

router.post('/encrypt', (req, res) => {
  const Crypto = require('../utils/crypto');
  res.json(Crypto.encrypt(req.body));
});
router.post('/decryptTest', decryptTest);

module.exports = router;
