const express = require("express");
const app = express();
const mysql = require("mysql");

let allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};
app.use(allowCrossDomain);
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "86LM57fsd1",
  database: "messenger",
});

connection.connect();

app.post("/register", function (req, res) {
  const insertQuery = "INSERT INTO users (email, password) VALUES (?, ?)";
  const values = [`${req.body.email}`, `${req.body.password}`];
  connection.query(insertQuery, values, function (error) {
    if (!req.body) {
      res.status(500).send("Error");
      throw error;
    }
    res.send(`${req.body.email}`);
  });
  console.log(req.body);
});

app.get("/register", (req, res) => {
  const { email } = req.query;
  const selectQuery = `SELECT id FROM users WHERE email = "${email}"`;
  connection.query(selectQuery, function (error, result) {
    if (error) {
      res.status(500).send("Error");
      throw error;
    }
    res.send(JSON.stringify(result));
  });
});

app.get("/login", (req, res) => {
  const { email, password } = req.query;
  const selectQuery = `SELECT * FROM users WHERE email = "${email}" AND password = "${password}"`;
  connection.query(selectQuery, function (error, result) {
    if (error) {
      res.status(500).send("Error");
      throw error;
    };
    if (!result.length) {
      // console.log(result.length)
      // console.log(result)
      res.status(204).send("No user");  
    } else {
    res.send(JSON.stringify(result));
    }
  });

});

app.post("/update", function (req, res) {
  const { id } = req.query;
  console.log(id);
  console.log(JSON.stringify(req.body));
  let date = new Date(req.body.birthDate).toISOString().slice(0, 19).replace('T', ' ');
  const updateQuery = `UPDATE users SET firstName=?, lastName=?, city=?, birthDate=? WHERE id=${id}`;
  const updateValues = [
    `${req.body.firstName}`,
    `${req.body.lastName}`,
    `${req.body.city}`,
    `${date}`
  ];
  connection.query(updateQuery, updateValues, function (error, result) {
    if (error) {
      res.status(500).send("Error");
      throw error;
    }
    console.log(result);
    res.send(
      `${req.body.firstName}, ${req.body.lastName}, ${req.body.city}, ${req.body.birthDate}`
    );
  });
});

app.listen(4000, () => {
  console.log(`Server is running on port 4000...`);
});
