import express from "express";
import pg from "pg";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

/*
const db = new pg.Client({});
db.connect();
*/

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
