import express from "express";
import pg from "pg";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

//this book will be displayed as an example before user adds anything to database
let books = [
  {
    id: 1,
    isbn: "0385472579",
    title: "nesta",
    description: "nesta",
    rating: 3,
  },
];

//sorted by id by default
let sort = "id";

app.get("/", async (req, res) => {
  try {
    const books = await db.query(`SELECT * FROM books order by ${sort} DESC`);
    const result = books.rows;
    res.render("index.ejs", { books: result });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add", async (req, res) => {
  try {
    await db.query(
      "INSERT INTO books(isbn,title, description,rating) VALUES($1,$2,$3,$4)",
      [req.body.isbn, req.body.title, req.body.description, req.body.rating]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(400).send("You Entered wrong ISBN");
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.book_id;
  console.log(id);
  db.query("DELETE FROM books WHERE id = $1", [id]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const description = req.body.updated_item_description;
  const id = req.body.updated_book_id;
  try {
    await db.query("UPDATE books SET description = $1 WHERE id = $2", [
      description,
      id,
    ]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/sort", async (req, res) => {
  sort = req.body.sort;
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
