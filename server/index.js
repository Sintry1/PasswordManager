const express = require("express");
const app = express();
const cors = require("cors");

// Defines the port of our server
const PORT = 3005;

// Allows us to access out environment variables
require("dotenv").config();

const {
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
} = require("./EncryptionHandler");

app.use(cors());
app.use(express.json());

// const db = mysql.createConnection({
//   user: process.env.USER,
//   host: process.env.HOST,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
// });

app.get("/getusers", (req, res) => {
  loadUsers();
});

app.post("/createuser", (req, res) => {
  createUser(req.body);
});

app.post("/saveusers", (req, res) => {
  saveUsers(req.body);
});

app.get("/getpasswords", (req, res) => {
  // db.query(
  //   "SELECT * FROM passwords;", (err, result) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //     res.send(result)
  //     }
  //   })
});

app.post("/addpassword", (req, res) => {
  const { site, password } = req.body;

  const hashedPassword = encryptPassword(password);

  // db.query(
  //   "INSERT INTO passwords (site, password, iv) VALUES (?, ?, ?)",
  //   [site, hashedPassword.password, hashedPassword.iv],
  //   (err, result) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.send("Success!");
  //     }
  //   }
  // );
});

app.post("/decryptpassword", (req, res) => {
  res.send(decryptPassword(req.body));
});

app.listen(PORT, () => {
  console.log("server is running");
});
