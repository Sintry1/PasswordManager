const express = require("express");
const app = express();
const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const cookie = require("cookie");
// const crypto = require("crypto");

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

let passwordList = loadPasswords();

// const JWT_SECRET = generateStrongPassword();

// const generateToken = (username) => {
//   const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "10m" });
//   return token;
// };

// const authenticateToken = (req, res, next) => {
//   const cookies = cookie.parse(req.headers.cookie || "");  
//   const token = cookies.token;
//   console.log("Token from cookies:", token);
//   if (!token) {
//     console.log("No token found in cookies");
//     return res.status(401).send("Unauthorized");
//   }

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       console.log("Token verification failed:", err.message);
//       return res.status(403).send("Forbidden");
//     }
//     console.log("Token verified successfully");
//     req.user = user;
//     next();
//   });
// };

app.get("/loadUsers", (req, res) => {
  loadUsers();
  res.send("Users loaded successfully.");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(`Received login request for username: ${username}`);
  const loggedIn = login(username, password);;
  if (loggedIn) {
    console.log(`Login successful for username: ${username}`);
    // const token = generateToken(username);
    // console.log("Token generated:", token);
    // res.setHeader(
    //   "Set-Cookie",
    //   cookie.serialize("token", token, { httpOnly: true })
    // );
    res.status(200).json({loggedIn: loggedIn});
  } else {
    console.log(`Login failed for username: ${username}`);
    res.status(401).send("Login failed. please try again.");
  }
});

app.post("/createUser", (req, res) => {
  const { username, password } = req.body;
  createUser(username, password);
  res.send("User created successfully.");
});

app.get("/loadPasswords/:username", (req, res) => {
  const username = req.params.username;
  console.log("username is:", username); // Add this line to check the received username
  const passwordList = loadPasswords(username)
  res.send(passwordList);
});

app.post("/addPassword", (req, res) => {
  const { site, password } = req.body;
  addPassword(site, password);
  res.send("Password created successfully");
});

app.post("/generateStrongPassword", (req, res) => {
  const strongPassword = generateStrongPassword();
  res.status(200).send(strongPassword);
});

app.post("/decryptPassword", (req, res) => {
  const site = req.body.site;
  const encryptedPassword = passwordList[site].password;
  const decryptedPassword = decryptPassword(encryptedPassword);
  res.status(200).json({decryptedPassword});
});

app.listen(PORT, () => {
  console.log("server is running");
});
