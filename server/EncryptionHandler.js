const crypto = require("crypto");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

let users = {};
let currentUser = "";
let passwordList = {};
let key = null;
const keyStorage = {};
const userInfoDir = path.join(__dirname, "User_Information");

// TESTED AND WORKING
const loadUsers = () => {
  const userDataPath = path.join(userInfoDir, "userData.json")
  // Check if the userData file exists and load it if so.
  if (fs.existsSync(userDataPath)) {
    try {
      const json = fs.readFileSync(userDataPath, "utf-8");
      users = JSON.parse(json);
    } catch (error) {
      console.error("An errored occured whiled parsing the JSON file: ", error);
      users = {};
    }
  } else {
    users = {};
  }
};

// TESTED AND WORKING
const createUser = (username, password) => {
  loadUsers();
  if (!users[username]) {
    const { hashedPassword, salt } = hashMasterPassword(password);
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

// TESTED AND WORKING
const saveUsers = (users) => {
  try {
    let existingUsers = {};
    if (!fs.existsSync(userInfoDir)){
      fs.mkdirSync(userInfoDir, {recursive: true})
    }
    const userDataPath = path.join(userInfoDir, "userData.json")
    if (fs.existsSync(userDataPath)) {
      const json = fs.readFileSync(userDataPath, "utf-8");
      existingUsers = JSON.parse(json);
      Object.assign(existingUsers, users);
      const updatedJson = JSON.stringify(existingUsers, null, 2);
      fs.writeFileSync(userDataPath, updatedJson, "utf-8");
      console.log(
        "User data has been saved (This log would not appear for security reasons in a production environment)"
      );
    } else {
      const updatedJson = JSON.stringify(users, null, 2);
      fs.writeFileSync(userDataPath, updatedJson, "utf-8");
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


// TESTED AND WORKING
const hashMasterPassword = (password) => {
  const saltRounds = 10; // Specify the number of salt rounds
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  return { hashedPassword, salt };
};

// TESTED AND WORKING
// Authenticate
const authenticateLogin = (username, password) => {
  if (users[username]) {
    const hashedPassword = users[username].hashedPassword;
    return bcrypt.compareSync(password, hashedPassword);
  }
  return false;
};

// TESTED AND WORKING
const login = (username, password) => {
  loadUsers();
  if (authenticateLogin(username, password)) {
    const userDir = path.join(userInfoDir, "users", username)
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, {recursive: true});
    }

    // Check if the user's key exists in a file
    const keyPath = path.join(userDir, `${username}_key.json`);
    if (fs.existsSync(keyPath)) {
      keyStorage[username] = JSON.parse(fs.readFileSync(keyPath, "utf-8")).key;
    } else {
      // Generate a new key for the user
      const secret = username + password;
      const salt = crypto.randomBytes(16);
      keyStorage[username] = crypto.pbkdf2Sync(secret, salt, 100000, 32, "sha256").toString("base64");

      // Save the user's key to a file
      fs.writeFileSync(keyPath, JSON.stringify({ key: keyStorage[username] }), "utf-8");
    }

    key = keyStorage[username]; // Use the stored key
    currentUser = username;
    console.log("Login Successful.");
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
  console.log("PASSWORD: ", password);
  return password;
};

// TESTED AND WORKING
// Loads passwords
const loadPasswords = (key) => {
  const passwordsPath = path.join(userInfoDir, "users", currentUser, `${currentUser}_passwords.json`);
  if (fs.existsSync(passwordsPath)) {
    try {
      const json = fs.readFileSync(passwordsPath, "utf8");
      passwordList = JSON.parse(json);
    } catch (error) {
      console.error("Error reading or parsing the JSON file: ", error);
      passwordList = {};
    }
  } else {
    passwordList = {};
  }
};

// TESTED AND WORKING
// Save passwords
const savePasswords = (passwordList) => {
  try {
    const passwordsPath = path.join(userInfoDir, "users", currentUser, `${currentUser}_passwords.json`);
    let existingPasswords = {};
    if (fs.existsSync(passwordsPath)) {
      const json = fs.readFileSync(passwordsPath, "utf-8");
      existingPasswords = JSON.parse(json);
      Object.assign(existingPasswords, passwordList);
      const updatedPasswords = JSON.stringify(existingPasswords, null, 2);
      fs.writeFileSync(
        passwordsPath,
        updatedPasswords,
        "utf-8"
      );
    } else {
      const updatedPasswords = JSON.stringify(passwordList, null, 2);
      fs.writeFileSync(
        passwordsPath,
        updatedPasswords,
        "utf-8"
      );
    }
  } catch (error) {
    console.error(
      "Wee woo wee woo. You got an error writing the password to the JSON file."
    );
  }
};

// TESTED AND WORKING
const addPassword = (site, password) => {
  loadPasswords();
  if (passwordList[site]) {
    console.log("A password for this site already exists.");
  } else {
    const encryptedPassword = encryptPassword(password);
    passwordList[site] = {
      site: site,
      password: encryptedPassword,
    };
    savePasswords(passwordList);
    console.log("Password successfully added to the file.");
  }
};


// TESTED AND WORKING
const encryptPassword = (password) => {
  const iv = Buffer.from(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv(
    "aes-256-ctr",
    Buffer.from(key, "base64"),
    iv
  );

  const encryptedPassword = Buffer.concat([
    cipher.update(password, "utf-8"),
    cipher.final(),
  ]);

  return {
    iv: iv.toString("hex"),
    password: encryptedPassword.toString("hex"),
  };
};


// TESTED AND WORKING
const decryptPassword = (encryption) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-ctr",
    Buffer.from(key, "base64"),
    Buffer.from(encryption.iv, "hex")
  );

  const decryptedPassword = Buffer.concat([
    decipher.update(Buffer.from(encryption.password, "hex")),
    decipher.final(),
  ]);

  return decryptedPassword.toString("utf-8");
};

// createUser("Sintry", "Sintry")
login("Sintry", "Sintry");
addPassword("TikTok", generateStrongPassword());
decryptPassword(passwordList["TikTok"].password);


// Example: Generate a strong password of length 16
// const strongPassword = generateStrongPassword();
// console.log("StrongPassword: ", strongPassword);

module.exports = {
  loadUsers,
  hashMasterPassword,
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

