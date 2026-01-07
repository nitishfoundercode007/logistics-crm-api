const Crypto = require('../utils/crypto');

module.exports = (req, res, next) => {
  try {
    if (!req.body || !req.body.data || !req.body.iv) {
      return res.status(400).json({
        success: false,
        message: 'Encrypted body required'
      });
    }

    const decrypted = Crypto.decrypt(req.body);
    req.body = decrypted; // 🔥 overwrite body
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid encrypted payload'
    });
  }
};
