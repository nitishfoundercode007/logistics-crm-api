const { User_Role } = require('../models'); // apne path ke hisaab se

module.exports = async (req, res, next) => {
    try {
        // user_id body, params ya token se aa sakta hai
        const user_id =
            req.body.user_id ||
            req.params.user_id ||
            req.user?.id;   // JWT use ho raha ho to

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const user = await User_Role.findOne({
            where: {
                user_id: user_id,
                role_id: 2   // ✅ Merchant role
            }
        });

        if (!user) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: Merchant access only'
            });
        }

        // Future use ke liye
        req.merchant = user;

        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Authorization error'
        });
    }
};
