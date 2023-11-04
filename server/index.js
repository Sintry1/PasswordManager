const express = require("express");
const app = express();
const cors = require("cors");

// Defines the port of our server
const PORT = 3005;

// Allows us to access out environment variables
require("dotenv").config();

const {
  loadUsers,
  createUser,
  loadPasswords,
  addPassword,
  login,
  generateStrongPassword,
  decryptPassword,
} = require("./EncryptionHandler");

app.use(cors());
app.use(express.json());

app.get("/loadUsers", (req, res) => {
  loadUsers();
  res.send("Users loaded successfully.");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const loggedIn = login(username, password);
  if (loggedIn) {
    res.send("Login successful");
  } else {
    res.status(401).send("Login failed. please try again.");
  }
});

app.post("/createUser", (req, res) => {
  const { username, password } = req.body;
  createUser(username, password);
  res.send("User created successfully.");
});

app.get("/loadPasswords", (req, res) => {
  loadPasswords();
  res.send("Passwords loaded successfully.");
});

app.post("/addPassword", (req, res) => {
  const { site, password } = req.body;
  addPassword(site, password);
  res.send("Password created successfully");
});

app.post("/generateStrongPassword", (req, res) => {
  const strongPassword = generateStrongPassword();
  res.send("Generated strong password: ", strongPassword);
});

app.post("/decryptPassword", (req, res) => {
  const site = req.body.site;
  const encryptedPassword = passwordList[site].password;
  const decryptedPassword = decryptPassword(encryptedPassword);
  res.send("Decrypted Password: ", decryptedPassword);
});

app.listen(PORT, () => {
  console.log("server is running");
});
