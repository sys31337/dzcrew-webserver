const express = require("express");
const dotenv = require("dotenv");
const port = process.env.PORT || 3000

dotenv.config();

const app = express();

// Parsing express requests objects as JSON objects
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enabling CORS for browser clients
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, PATCH, GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
