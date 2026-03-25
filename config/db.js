const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",   // your mysql password
  database: "college_leave"
});

connection.connect((err) => {
  if (err) {
    console.log("DB Error");
  } else {
    console.log("Database Connected ✅");
  }
});

module.exports = connection;