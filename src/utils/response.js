exports.success = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

exports.error = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};


// const Crypto = require('./crypto');

// exports.success = (res, data = null, message = 'Success', code = 200) => {
//   const payload = Crypto.encrypt({
//     success: true,
//     message,
//     data
//   });

//   return res.status(code).json(payload);
// };

// exports.error = (res, message = 'Error', code = 500, errors = null) => {
//   const payload = Crypto.encrypt({
//     success: false,
//     message,
//     errors
//   });

//   return res.status(code).json(payload);
// };
