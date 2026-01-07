const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.APP_ENCRYPTION_KEY;

exports.decryptPayload = ({ iv, data }) => {
  try {
    if (!iv || !data) {
      throw new Error('IV or data missing');
    }

    const ivBuffer = Buffer.from(iv, 'hex');
    const encryptedBuffer = Buffer.from(data, 'hex');

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(SECRET_KEY),
      ivBuffer
    );

    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const decryptedText = decrypted.toString('utf8');

    return JSON.parse(decryptedText);

    // return decrypted.toString('utf8'); // RAW decrypted string
  } catch (err) {
    console.error('Decrypt error:', err.message);
    throw new Error('Decryption failed');
  }
};
