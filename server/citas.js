const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 3001;
const cors = require("cors");
// Create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bitescreadores_booking_information",
  port: 3306,
});
app.use(express.json());
app.use(cors());

// Connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL Connected...");
});

app.get("/api/citas/agendadas", async (req, res) => {
  let query = "SELECT * FROM information";

  db.query(query, (error, results) => {
    if (error) {
      console.log("Error: ", error);
      res.status(500).send("An error occurred while fetching data");
    } else {
      res.json(results);
    }
  });
});

app.post("/api/disponibilidad", (req, res) => {
  const dates = req.body.dates;

  for (let date of dates) {
    let query =
      "INSERT INTO information (name, email, phone, date) VALUES ('', '', '', ?)";

    db.query(query, [date], (error, results) => {
      if (error) {
        console.log("Error: ", error);
        res.status(500).send("An error occurred while saving data");
      }
    });
  }

  res.status(200).send("Data saved successfully");
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
