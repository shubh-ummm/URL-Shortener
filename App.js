const express = require("express");
const shortid = require("shortid");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine','ejs')

app.get("/", async (req, res, next) => {
  res.render("index");
});

const port = 3000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
