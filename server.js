const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Create database
const db = new sqlite3.Database("booking.db");

db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        service TEXT,
        date TEXT
    )
`);


// Home
app.get("/", (req, res) => {
    res.send("Server running");
});


// Booking route
app.post("/book", (req, res) => {

    const { name, phone, service, date } = req.body;

    db.run(
        "INSERT INTO bookings (name, phone, service, date) VALUES (?, ?, ?, ?)",
        [name, phone, service, date]
    );

    res.send("Booking saved in database");
});


app.listen(3000, () => {
    console.log("Server started on port 3000");
});

// Get all bookings
app.get("/bookings", (req, res) => {

    db.all("SELECT * FROM bookings", [], (err, rows) => {

        if (err) {
            res.send(err);
        } else {
            res.json(rows);
        }

    });

});

// delete booking
app.get("/delete/:id", (req, res) => {

    const id = req.params.id;

    db.run(
        "DELETE FROM bookings WHERE id=?",
        [id],
        function (err) {

            if (err) {
                res.send(err);
            } else {
                res.send("Deleted");
            }

        }
    );

});

// get one booking
app.get("/booking/:id", (req, res) => {

    const id = req.params.id;

    db.get(
        "SELECT * FROM bookings WHERE id=?",
        [id],
        (err, row) => {

            if (err) res.send(err);
            else res.json(row);

        }
    );

});


// update booking
app.post("/update", (req, res) => {

    const { id, name, phone, service, date } = req.body;

    db.run(
        "UPDATE bookings SET name=?, phone=?, service=?, date=? WHERE id=?",
        [name, phone, service, date, id],
        function (err) {

            if (err) res.send(err);
            else res.send("Updated");

        }
    );

});

// login
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {

        res.send("ok");

    } else {

        res.send("wrong");

    }

});