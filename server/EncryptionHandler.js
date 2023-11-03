const crypto = require("crypto");
const bcrypt = require("bcrypt");
const fs = require("fs");
const Password = require("./config");

let users = {};
let currentUser = "";
let passwordList = {};
let key = "";

const loadUsers = () => {
  // Check if the userData file exists and load it if so.
  if (fs.existsSync("userData.json")) {
    try {
      const json = fs.readFileSync("userData.json", "utf-8");
      users = JSON.parse(json);
    } catch (error) {
      console.error("An errored occured whiled parsing the JSON file: ", error);
      users = {};
    }
  } else {
    users = {};
  }
};

const createUser = (username, password) => {
  loadUsers();
  console.log("Existing users: ", users);
  if (!users[username]) {
    const { hashedPassword, salt } = encryptMasterPassword(password);
    users[username] = {
      username: username,
      hashedPassword: hashedPassword,
    };
    saveUsers(users);
    console.log("User created successfully.");
  } else {
    console.log("User Already exists");
  }
};


const saveUsers = (users) => {
  try {
    let existingUsers = {};
    if (fs.existsSync("userData.json")) {
      const json = fs.readFileSync("userData.json", "utf-8");
      existingUsers = JSON.parse(json); 
      Object.assign(existingUsers, users);
      const updatedJson = JSON.stringify(existingUsers, null, 2)
      fs.writeFileSync("userData.json", updatedJson, "utf-8");
      console.log(
        "User data has been saved (This log would not appear for security reasons in a production environment)"
      );
    } else {
      const updatedJson = JSON.stringify(users, null, 2);
      fs.writeFileSync("userData.json", updatedJson, "utf-8");
      console.log(
        "userData file created and user data saved (This log would not appear for security reasons in a production environment)"
      );
    }
   
  } catch (error) {
    console.error(
      "Wee woo wee woo. You got an error writing the JSON data to the file."
    );
  }
};

const encryptMasterPassword = (password) => {
  const saltRounds = 10; // Specify the number of salt rounds
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  return { hashedPassword, salt };
};

// Authenticate
const authenticateLogin = (username, password) => {
  if (users[username]) {
    const hashedPassword = users[username].hashedPassword;
    console.log("Password:", password);
    console.log("Hashed Password:", hashedPassword);
    return bcrypt.compareSync(password, hashedPassword);
  }
  return false;
};

// Loads passwords
const loadPasswords = (key) => {
  const file = `${currentUser}_passwords.json`;
  if (fs.existsSync(file)) {
    try {
      let json = fs.readFileSync(file, "utf8");
      passwordList = JSON.parse(json);
      return passwordList;
    } catch (error) {
      console.error("Error reading or parsing the JSON file: ", error);
      return passwordList;
    }
  } else {
    return passwordList;
  }
};

// Save passwords
const savePasswords = () => {
  let json = JSON.stringify(passwordList);
  fs.writeFileSync(`${currentUser}_passwords.json`, json);
};

const addPassword = (site, password) => {
  const newPassword = new Password(site, password);
  newPassword = encryptPassword(newPassword);
  passwordList[site] = newPassword;
};

const login = (username, password) => {
  if (authenticateLogin(username, password)) {
    let secret = username + password;

    const salt = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(secret, salt, 100000, 32, "sha256");

    this.key = key.toString("base64");
    console.log(key);
  } else {
    console.log("Login failed. Please try again.");
    return null;
  }
};

const generateStrongPassword = (length = 32) => {
  // Define character set character sets to create the full character pool
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|:"<>?-=/\\';

  let password = "";
  for (let i = 0; i < length; i++) {
    // Randomly select a character from the character pool
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars.charAt(randomIndex);
  }

  return password;
};


const encryptPassword = (password) => {
  const iv = Buffer.from(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(key), iv);

  const encryptedPassword = Buffer.concat([
    cipher.update(password),
    cipher.final(),
  ]);

  return {
    iv: iv.toString("hex"),
    password: encryptedPassword.toString("hex"),
  };
};

const decryptPassword = (encryption) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-ctr",
    Buffer.from(key),
    Buffer.from(encryption.iv, "hex")
  );

  const decryptedPassword = Buffer.concat([
    decipher.update(Buffer.from(encryption.password, "hex")),
    decipher.final(),
  ]);

  return decryptedPassword.toString();
};


//createUser("Cami", "Sintry");
//login("Sintry", "Sintry");


// Example: Generate a strong password of length 16
// const strongPassword = generateStrongPassword();
// console.log("StrongPassword: ", strongPassword);

module.exports = {
  loadUsers,
  encryptMasterPassword,
  createUser,
  saveUsers,
  authenticateLogin,
  loadPasswords,
  savePasswords,
  login,
  generateStrongPassword,
  encryptPassword,
  decryptPassword,
};
