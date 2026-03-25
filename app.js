const express = require("express");
const mysql = require("mysql");
const path = require("path");
const session = require("express-session");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// ================= DATABASE =================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "college_leave",
});

db.connect((err) => {
  if (err) {
    console.log("DB Connection Error ❌", err);
  } else {
    console.log("Database Connected ✅");
  }
});

// ================= ROUTES =================

// 🔹 Home → Login page
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM students WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Database Error ❌");
    }

    if (result.length > 0) {
      req.session.user = result[0]; // session save
      res.redirect("/dashboard.html");
    } else {
      res.send("Invalid Email or Password ❌");
    }
  });
});

// ================= PROTECT DASHBOARD =================
app.get("/dashboard.html", (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
  } else {
    res.redirect("/login.html");
  }
});

// ================= APPLY LEAVE =================
app.post("/apply-leave", (req, res) => {
  const { from_date, to_date, reason } = req.body;
  const student_email = req.session.email; // or from login

  const sql = `
    INSERT INTO leaves (student_email, from_date, to_date, reason)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [student_email, from_date, to_date, reason], (err) => {
    if (err) {
      console.log(err);
      res.send(err.message); // temporary
    } else {
      res.send("Successfully Applied");
    }
  });
});

// ================= HISTORY PAGE =================
app.get("/history.html", (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, "public", "history.html"));
  } else {
    res.redirect("/login.html");
  }
});

// ================= LOGOUT =================
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login.html");
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000 🚀");
});