const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const MerchantController = require('../controllers/merchant.controller');
const merchantAuth = require('../middlewares/merchantAuth.middleware');
router.use(merchantAuth);

router.post('/store/details', auth, MerchantController.store_details);
router.post('/add/pickup_address', auth, MerchantController.add_pickup_address);
router.post('/get/pickup_address', auth, MerchantController.get_pickup_address);
router.post('/get/pickup_address_byId', auth, MerchantController.get_pickup_address_byId);
router.post('/update/pickup_address', auth, MerchantController.update_pickup_address);
router.post('/create/order', auth, MerchantController.create_order);
router.post('/recharge/wallet', auth, MerchantController.recharge_wallet);
router.post('/get/merchant_details', auth, MerchantController.get_merchant_details);

module.exports = router;
