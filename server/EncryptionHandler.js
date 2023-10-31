const crypto = require("crypto");
const config = require('./config');
const bcrypt = require("bcrypt");


const encrypt = (password) => {
  const iv = Buffer.from(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(secret), iv);

  const encryptedPassword = Buffer.concat([
    cipher.update(password),
    cipher.final(),
  ]);

  return {
    iv: iv.toString("hex"),
    password: encryptedPassword.toString("hex"),
  };
};


const generateStrongPassword = (length = 32) => {
  // Define character sets for each character type
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digitChars = "0123456789";
  const specialChars = '!@#$%^&*()_+{}[]|:"<>?-=/\\';

  // Combine character sets to create the full character pool
  const allChars = lowercaseChars + uppercaseChars + digitChars + specialChars;

  let password = "";
  for (let i = 0; i < length; i++) {
    // Randomly select a character from the character pool
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars.charAt(randomIndex);
  }

  return password;
};

// Example: Generate a strong password of length 16
// const strongPassword = generateStrongPassword();
// console.log("StrongPassword: ", strongPassword);

const decrypt = (encryption) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-ctr",
    Buffer.from(secret),
    Buffer.from(encryption.iv, "hex")
  );

  const decryptedPassword = Buffer.concat([
    decipher.update(Buffer.from(encryption.password, "hex")),
    decipher.final(),
  ]);

  return decryptedPassword.toString();
};

const hashPassword = (username, password) => {

}


module.exports = { encrypt, decrypt };
