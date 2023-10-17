const crypto = require("crypto");

// Secret needs to be 32 characters long
const secret = crypto.randomBytes(32);

// Buffers are "waiting areas" where data waits to be streamed.
const encrypt = (password) => {
  const iv = Buffer.from(crypto.randomBytes(32));
  const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(secret), iv);

  const encryptedPassword = Buffer.concat([
    cipher.update(password),
    cipher.final(),
  ]);

  return {
    iv: iv.toString("hex"),
    password: encryptedPassword.toString("hex"),
  };
};

const decrypt = (encryption) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(secret),
    Buffer.from(encryption.iv, "hex")
  );

  const decryptedPassword = Buffer.concat([
    decipher.update(Buffer.from(encryption.password, "hex")),
    decipher.final(),
  ]);

  return decryptedPassword.toString();
};

module.exports = { encrypt, decrypt };
