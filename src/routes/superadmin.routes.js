const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const SuperadminController = require('../controllers/superadmin.controller');
const superadminAuth = require('../middlewares/superadminAuth.middleware');
router.use(superadminAuth);

router.post('/get/all_cupon', auth, SuperadminController.get_all_cupons);
router.post('/store/cupon', auth, SuperadminController.store_cupon);
router.post('/action/cupon', auth, SuperadminController.action_cupon);
router.post('/get/settings_data', auth, SuperadminController.get_settings_data);
router.post('/update/general_details', auth, SuperadminController.update_general_settings);
router.post('/enable/gateway', auth, SuperadminController.enable_gateway);
router.post('/get/all_gateway', auth, SuperadminController.get_all_gateway);
router.post('/action/map_key', auth, SuperadminController.action_map_key);
router.post('/update/logistics_support', auth, SuperadminController.update_logistics_support);
router.post('/action/support_question_answer', auth, SuperadminController.action_support_question_answer);

router.post('/cashfree', auth, SuperadminController.check_cashfree);


module.exports = router;
