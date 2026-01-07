// const router = require('express').Router();
// const authController = require('../controllers/auth.controller');

// router.post('/register', authController.register); // optional for testing
// router.post('/login', authController.login);

// module.exports = router;


const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { registerSchema, loginSchema } = require('../validations/auth.validation');
const validate = require('../middlewares/validate.middleware');
const auth = require('../middlewares/auth.middleware');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/profile', auth, authController.getProfile);
router.post('/changePassword', auth, authController.changePassword);

module.exports = router;
