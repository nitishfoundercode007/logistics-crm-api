const nodemailer = require('nodemailer');
const crypto = require('crypto');

// =============================================================Node Test SMTP===========================================================
let transporterPromise;

async function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = (async () => {
      const testAccount = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    })();
  }
  return transporterPromise;
}

async function sendTestMail(to) {
  const transporter = await getTransporter();

  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .card {
          max-width: 500px;
          margin: auto;
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 8px;
        }
        .btn {
          display: inline-block;
          padding: 10px 20px;
          background: #4CAF50;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Hello 👋</h2>
        <p>This is a <b>test email</b> sent using Node.js SMTP.</p>
        <a href="https://example.com" class="btn">Verify</a>
        <p style="margin-top:20px;">Thanks,<br/>Team</p>
      </div>
    </body>
  </html>
  `;

  const info = await transporter.sendMail({
    from: '"Test App" <test@example.com>',
    to,
    subject: 'SMTP Test Email',
    html: htmlTemplate
  });

  return info;
}


exports.SendTestMail = async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email is required'
      });
    }

    const info = await sendTestMail(to);

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      preview_url: nodemailer.getTestMessageUrl(info)
    });

  } catch (err) {
    console.error('SMTP Error:', err);
    return res.status(500).json({
      success: false,
      message: `Internal server error ${err}`
    });
  }
};

//========================================================Live Gmail SMTP===============================================================================
// MAIL_MAILER=smtp
// MAIL_HOST=smtp.hostinger.com
// MAIL_PORT=465
// MAIL_USERNAME=support@fctechteam.org
// MAIL_PASSWORD="Support@#$3133"
// MAIL_ENCRYPTION=ssl
// MAIL_FROM_ADDRESS=support@fctechteam.org
// MAIL_FROM_NAME=Apponrent
// console.log('process.env.GMAIL_APP_PASS',process.env.GMAIL_APP_PASS)

const GMAIL_APP_PASS="Support@#$3133"
const GMAIL_USER="support@fctechteam.org"
const transporters = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // true only for 465
  auth: {
    user: GMAIL_USER,      // yourgmail@gmail.com
    pass: GMAIL_APP_PASS   // 16 digit app password
  }
});

exports.sendLiveMail = async (to) => {
    const otp = crypto.randomInt(100000, 1000000);
  const htmlTemplate = `
    <!DOCTYPE html>

<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset OTP</title>
</head>

<body style="margin:0; padding:0; background:#f5f7fa; font-family:'Segoe UI', Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 10px;">
<tr>
<td align="center">

<!-- Main Card -->

<table width="100%" style="max-width:620px; background:#ffffff; border-radius:6px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.06);">

<!-- Header with Logo and Name Centered -->

<tr>
<td style="background:linear-gradient(135deg, #7F7CAF, #E6E5F5); padding:20px 15px; text-align:center; border-bottom:1px solid #e5e7eb;">

<!-- Inline container for logo + name -->

<div style="display:inline-flex; align-items:center; justify-content:center; gap:12px;">
  <!-- Logo -->
  <img 
    src="https://i.ibb.co/fdPBD9bT/logistic-Login-Logo.jpg" 
    alt="Logistics CRM Logo" 
    style="display:block; max-width:50px; height:auto;border-radius:6px"
  />

  <!-- Company Name -->

  <div style="text-align:left;">
    <h1 style="margin:3px; font-size:22px; color:#1f2937;">Logistics CRM</h1>
  </div>
</div>

</td>
</tr>

<!-- Content -->

<tr>
<td style="padding:32px 30px; color:#1f2937;">

<p style="font-size:15px; margin-top:0;">Hello Merchant,</p>

<p style="font-size:14px; line-height:1.6; color:#374151;">
We received a request to reset the password for your
<strong>Merchant Account</strong> on <strong>Logistics CRM</strong>.
</p>

<p style="font-size:14px; line-height:1.6; color:#374151;">
Use the OTP below to verify your identity:
</p>

<!-- OTP Box -->

<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr>
<td align="center">
<div style="
background:#f9fafb;
border:1px solid #e5e7eb;
border-radius:4px;
padding:16px 28px;
display:inline-block;
min-width:200px;
">
<div style="font-size:12px; color:#6b7280; margin-bottom:6px;">
One-Time Password (OTP)
</div>
<div style="
font-size:26px;
font-weight:600;
letter-spacing:5px;
color:#111827;
">
${otp}
</div>
</div>
</td>
</tr>
</table>

<p style="font-size:13px; color:#6b7280; line-height:1.6;">
This OTP is valid for <strong>10 minutes</strong>.  
Please do not share this OTP with anyone.
</p>

<p style="font-size:13px; color:#6b7280; line-height:1.6;">
If you did not request a password reset, you may safely ignore this email.
</p>

<p style="margin-top:28px; font-size:14px;">
Regards,<br>
<strong>Logistics CRM Team</strong><br>
<span style="font-size:12px; color:#6b7280;">Merchant Support</span>
</p>

</td>
</tr>

<!-- Footer -->

<tr>
<td style="background:#f9fafb; padding:16px; text-align:center; border-top:1px solid #e5e7eb;">
<p style="margin:0; font-size:12px; color:#6b7280;">
© 2026 Logistics CRM. All rights reserved.
</p>
<p style="margin:6px 0 0; font-size:12px;">
<a href="mailto:support@logisticscrm.com" style="color:#2563eb; text-decoration:none;">
support@logisticscrm.com
</a>
</p>
</td>
</tr>

</table>
<!-- End Card -->

</td>
</tr>
</table>

</body>
</html>

  `;

  const info = await transporters.sendMail({
    from: `"Test App" ${GMAIL_USER}`,
    to: to,
    subject: 'SMTP Test Email (Gmail)',
    html: htmlTemplate
  });

  return info;
}

exports.SendLiveMail = async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email is required'
      });
    }

    await sendLiveMail(to);

    return res.status(200).json({
      success: true,
      message: 'Mail sent successfully to inbox'
    });

  } catch (err) {
    console.error('SMTP Error:', err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
