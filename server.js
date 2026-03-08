const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const path = require("path");

const app = express();

// 🔥 Body parser FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 Session BEFORE routes
app.use(session({
  secret: "leave-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }   // localhost ki false undali
}));

// 🔥 Static folder AFTER session
app.use(express.static(path.join(__dirname, "public")));

function checkUser(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }
  next();
}

app.get("/dashboard.html", checkUser, (req, res) => {
  res.sendFile(__dirname + "/public/dashboard.html");
});

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

// ================= HOME =================
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// ================= STUDENT LOGIN (Admission No + DOB) =================
app.post("/student-login", (req, res) => {

  const { admission_no } = req.body;

  const sql = "SELECT * FROM students WHERE admission_no = ?";

  db.query(sql, [admission_no], (err, result) => {

    if (err) {
      console.log(err);
      return res.send("Database Error");
    }

    if (result.length > 0) {

      req.session.user = result[0];

      res.redirect("/dashboard.html");

    } else {

      res.redirect("/student-login.html?error=invalid");

    }

  });

});


// ================= STUDENT DASHBOARD =================

app.get("/dashboard.html", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }
  res.sendFile(__dirname + "/public/dashboard.html");
});

// ================= STUDENT DATA FOR DASHBOARD =================
app.get("/student-data", (req, res) => {
  if (!req.session.user) {
    return res.json({ error: "Not logged in" });
  }

  res.json(req.session.user);
});

// ================= APPLY LEAVE =================
app.post("/apply-leave", checkUser, (req, res) => {
  const { from_date, to_date, reason } = req.body;

  const admission_no = req.session.user.admission_no;

  const sql = `
    INSERT INTO leaves 
    (student_email, from_date, to_date, reason, status) 
    VALUES (?, ?, ?, ?, 'Pending')
  `;

  db.query(sql, [admission_no, from_date, to_date, reason], (err) => {
    if (err) {
      console.log(err);
      return res.send("Database Error ❌");
    }

    res.redirect("/history.html");
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

// ================= STUDENT HISTORY DATA =================
app.get("/history-data", checkUser, (req, res) => {
  const sql = "SELECT * FROM leaves WHERE student_email=?";

  db.query(sql, [req.session.user.admission_no], (err, result) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }

    res.json(result);
  });
});


// ================= ADMIN CHECK FUNCTION =================
function checkAdmin(req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/admin-login.html");
  }
}

// ================= ADMIN LOGIN =================
app.post("/admin-login", (req, res) => {

  const { email, password } = req.body;

  const sql = "SELECT * FROM admins WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {

    if (err) {
      console.log(err);
      return res.send("Database Error");
    }

    if (result.length === 0) {
      return res.send("Invalid Credentials");
    }

    // 🔥 SESSION SETTING
    req.session.admin = result[0];

    console.log("Admin Logged In:", req.session.admin);

    res.redirect("/admin-dashboard.html");

  });

});

// ================= ADMIN DASHBOARD =================
app.get("/admin-dashboard.html", checkAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin-dashboard.html"));
});

// ================= ADMIN VIEW LEAVES =================
app.get("/admin-leaves", (req, res) => {

  console.log("Session Check:", req.session.admin);

  if (!req.session.admin) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const sql = `
    SELECT 
      leaves.id,
      students.name,
      students.admission_no,
      students.branch,
      leaves.from_date,
      leaves.to_date,
      leaves.reason,
      leaves.status
    FROM leaves
    JOIN students 
    ON leaves.student_email = students.admission_no
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }

    res.json(result);
  });

});

// ================= APPROVE / REJECT =================
app.post("/update-status", checkAdmin, (req, res) => {
  const { id, status } = req.body;

  const sql = "UPDATE leaves SET status=? WHERE id=?";

  db.query(sql, [status, id], (err) => {
    if (err) return res.send("Error updating ❌");
    res.json({ message: "Status Updated Successfully ✅" });
  });
});

// ================= LOGOUT =================
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login.html");
});

// ================= SERVER =================
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});