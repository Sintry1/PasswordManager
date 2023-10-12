const express = require("express");
const app = express();
const mysql = require("mysql");

// Defines the port of our server
const PORT = 3005;

// Allows us to access out environment variables
require("dotenv").config();

const db = mysql.createConnection({
  user: process.env.USER,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

app.post("/addPassword", (req, res) => {
  const { site, password } = req.body;

  db.query("INSERT INTO passwords (site, password) VALUES (?, ?)", [
    site,
    password,
  ], (err, result) => {
    if (err){
      console.log(err);
    } else res.send("Success!")
  }
  );
});

app.listen(PORT, () => {
  console.log("server is running");
});
