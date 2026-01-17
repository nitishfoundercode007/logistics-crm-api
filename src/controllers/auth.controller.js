const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Mailer = require('../utils/mailer');
const crypto = require('crypto');
const { User,User_Role,Merchant_details,ForgetPasswordRequest } = require('../models');  // ✅ correct relative path

console.log('User',User)

const { JWT_SECRET, JWT_EXPIRES } = process.env;

// ----------------- REGISTER -----------------
exports.register = async (req, res) => {
  try {
    // const { name, email, password, role } = req.body;
    const { name, email, password, role,phone,dob,company_name,website_url } = req.body || {};
      if (!name || !email || !password || !role || !phone || !dob || !company_name) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      dob
    });
    
    const user_id = user.id;
    const user_role = await User_Role.create({
      user_id,
      role_id:role
    });
    
    const merchant_details = await Merchant_details.create({
          user_id,
          company_name,
          website_url
    });
    
    // const User_data = await User.findOne({ where: { id:user_id } });
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
    //   data: User_data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ----------------- LOGIN -----------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    
    const user_role = await User_Role.findOne({
      where: { user_id:  user.dataValues.id }
    });
    
    user.dataValues.role = user_role ? user_role.role_id : null;
    
    console.log('JWT_EXPIRES',JWT_EXPIRES)
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user,
        token,
        Token_Expires:JWT_EXPIRES.toString()
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const id = req.body;
    
    if (!req.body) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }
      
    const userId = req.body.id;
    
    const user = await User.findByPk(userId);
    
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    // const user_role = await UserRole.findOne({{whereuser_id:userId});
    const user_role = await User_Role.findOne({
      where: { user_id: userId }
    });
    
    user.dataValues.role = user_role ? user_role.role_id : null;
    user.dataValues.empId="PA1234567564567567"
    user.dataValues.fullAddress="7/85 Jankipuram BKT"
    user.dataValues.joining_date="1995/01/09"

    return res.json({
      success: true,
      data: user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // JWT se
    console.log('userId',userId)
    const { old_password, new_password, confirm_password } = req.body;

    // 1️⃣ Validation
    if (!old_password || !new_password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'Old password, new password and confirm password are required'
      });
    }

    // 2️⃣ New & Confirm password match
    if (new_password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match'
      });
    }

    // 3️⃣ User fetch
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // 4️⃣ Old password check
    const isOldPasswordCorrect = await bcrypt.compare(
      old_password,
      user.password
    );

    if (!isOldPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Old password is incorrect'
      });
    }

    // 5️⃣ New password same as old?
    const isSamePassword = await bcrypt.compare(
      new_password,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password cannot be same as old password'
      });
    }

    // 6️⃣ Password strength (optional but recommended)
    if (new_password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // 7️⃣ Hash & update
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await user.update({ password: hashedPassword });

    return res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.log('Change Password Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // JWT se
    console.log('userId',userId)
    const { name, phone, dob,about } = req.body;
    const user = await User.findByPk(userId);
    // 7️⃣ Hash & update
    if(name)
    {
        await user.update({ name: name });
    }
    if(phone)
    {
        await user.update({ phone: phone });
    }
    if(dob)
    {
        await user.update({ dob: dob });
    }
    if(about)
    {
        await user.update({ about: about });
    }
    
    return res.json({
      success: true,
      message: 'Profile Update successfully'
    });

  } catch (error) {
    console.log('Profile Update Error:', error);
    return res.status(500).json({
      success: false,
      message: `Something went wrong ${error}`
    });
  }
};

// exports.forgetPassword = async (req, res) => {
//   try {
//       const otp = crypto.randomInt(100000, 1000000);
//     const { email } = req.body;
    
//     if (!email) {
//         return res.status(400).json({ success: false, message: 'Email is Required' });
//     }
    
//     const existingUser = await User.findOne({ where: { email } });
//     if (!existingUser) {
//       return res.status(400).json({ success: false, message: 'Email Not registered Try Right Email' });
//     }
    
//     ForgetPasswordRequest.create({
//         email,otp,status:0
//     })
    
//     await Mailer.sendLiveMail(email,otp);
    
//     return res.json({
//       success: true,
//       message: 'Request Sent On Mail'
//     });

//   } catch (error) {
//     console.log('Profile Update Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: `Something went wrong ${error}`
//     });
//   }
// };

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // 1️⃣ Check user
    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email not registered'
      });
    }

    // 2️⃣ Expire old unused OTPs
    await ForgetPasswordRequest.update(
      { status: 2 }, // expired
      {
        where: {
          email,
          status: 0 // only active OTPs
        }
      }
    );

    // 3️⃣ Generate new OTP
    const otp = crypto.randomInt(100000, 1000000);

    // 4️⃣ Save new OTP
    await ForgetPasswordRequest.create({
      email,
      otp,
      status: 0, // active
      expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // 5️⃣ Send email
    await Mailer.forgetPasswordOTPTemplate(email, otp);

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully`
    });

  } catch (error) {
    console.error('Forget Password Error:', error);
    return res.status(500).json({
      success: false,
      message: `Something went wrong ${error}`
    });
  }
};

exports.VerifyOTPForgetP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1️⃣ Validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // 2️⃣ User check
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email not registered'
      });
    }

    // 3️⃣ OTP check
    const otpRecord = await ForgetPasswordRequest.findOne({
      where: {
        email,
        otp,
        status: 0
      }
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or already used OTP'
      });
    }

    // 4️⃣ Expiry check
    if (new Date() > otpRecord.expires_at) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // 5️⃣ Mark OTP as used
    await otpRecord.update({ status: 1 });

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


exports.generateNewPassword = async (req, res) => {
  try {
    const {email, new_password, confirm_password } = req.body;

    // 1️⃣ Validation
    if (!email || !new_password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'Email, new password and confirm password are required'
      });
    }

    // 2️⃣ New & Confirm password match
    if (new_password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match'
      });
    }

    // 3️⃣ User fetch
    const user = await User.findOne({ where: { email } }); // Sequelize
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email Is Wrong'
      });
    }

    // 6️⃣ Password strength (optional but recommended)
    if (new_password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // 7️⃣ Hash & update
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await user.update({ password: hashedPassword });

    return res.json({
      success: true,
      message: 'Password Generated successfully'
    });

  } catch (error) {
    console.log('Change Password Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};