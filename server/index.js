const express = require("express");
const app = express();
const mysql = require("mysql");
const PORT = 3005;


const db = mysql.createConnection({
  user: process.env.USER,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

app.get("/", (req, res) => {
  res.send(console.log(process.env.PASSWORD));
});

app.listen(PORT, () => {
  console.log("server is running");
});
