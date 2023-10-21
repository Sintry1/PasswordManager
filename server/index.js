const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

// Defines the port of our server
const PORT = 3005;

// Allows us to access out environment variables
require("dotenv").config();

const {encrypt, decrypt} = require("./EncryptionHandler");

app.use(cors());
app.use(express.json());

const passwordsDb = mysql.createConnection({
  user: process.env.PASSWORDS_USER,
  host: process.env.PASSWORDS_HOST,
  password: process.env.PASSWORDS_PASSWORD,
  database: process.env.PASSWORDS_DATABASE,
});

const usersDb = mysql.createConnection({
  user: process.env.USERS_USER,
  host: process.env.USERS_HOST,
  password: process.env.USERS_PASSWORD,
  database: process.env.USERS_DATABASE,
});


app.get('/getpasswords', (req, res) => {
  passwordsDb.query(
    "SELECT * FROM passwords;", (err, result) => {
      if (err) {
        console.log(err);
      } else {
      res.send(result)
      }
    })
})

app.post("/addpassword", (req, res) => {
  const { site, password } = req.body;

  const hashedPassword = encrypt(password);

  passwordsDb.query(
    "INSERT INTO passwords (site, password, iv) VALUES (?, ?, ?)",
    [site, hashedPassword.password, hashedPassword.iv],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Success!");
      }
    }
  );
});

app.post("/decryptpassword", (req, res) => {
  res.send(decrypt(req.body));
});

app.listen(PORT, () => {
  console.log("server is running");
});
