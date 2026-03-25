const express = require("express");
const mysql = require("mysql");
const path = require("path");

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ================= DB CONNECTION =================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "college_leave",
});

db.connect((err) => {
  if (err) console.log(err);
  else console.log("Database connected ✅");
});

// ================= PAGES =================

// login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// dashboard page
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// apply leave page
app.get("/apply-leave", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "apply-leave.html"));
});

// ================= APPLY LEAVE POST =================
app.post("/apply-leave", (req, res) => {
  const { from_date, to_date, reason } = req.body;

  const sql =
    "INSERT INTO leaves (from_date, to_date, reason) VALUES (?, ?, ?)";

  db.query(sql, [from_date, to_date, reason], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error applying leave");
    } else {
      res.send("Leave Applied Successfully ✅");
    }
  });
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});