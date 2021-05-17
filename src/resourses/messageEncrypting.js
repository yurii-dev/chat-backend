require("pidcrypt/seedrandom");
require("pidcrypt/aes_cbc");

const pidCrypt = require("pidcrypt");

const aes = new pidCrypt.AES.CBC();

function encryptText(text, password) {
  const encryptedText = aes.encryptText(
    text,
    `${password}${process.env.MESSAGE_ENCRYPTION_KEY}`
  );
  return encryptedText;
}

function decryptText(text, password) {
  const decryptedText = aes.decryptText(
    text,
    `${password}${process.env.MESSAGE_ENCRYPTION_KEY}`
  );
  return decryptedText;
}

module.exports = {
  encryptText,
  decryptText,
};
