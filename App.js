const express = require("express");
const shortId = require("shortid");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const path = require("path");
const { log } = require("console");
const ShortUrl = require("./models/url.model");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect("mongodb://localhost:27017/url-shortener", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((error) => {
    console.log("Error Connecting MongoDB");
  });
app.set("view engine", "ejs");

app.get("/", async (req, res, next) => {
  res.render("index");
});

app.post("/", async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) {
      throw createHttpError.BadRequest("Provide a Valid URL");
    }
    const urlExists = await ShortUrl.findOne({ url });
    if (urlExists) {
      res.render("index", { short_url: `http://localhost:3000/${shortId}` });
      return;
    }
    const shortUrl = new ShortUrl({ url: url, shortId: shortId.generate() });
    const result = await shortUrl.save();
    res.render("index", {
      short_url: `http://localhost:3000/${result.shortId}`,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/:shortId', async(req,res,next)=>{
  try {
    const {shortId} = req.params
    const result = await ShortUrl.findOne({shortId})
    if(!result){
      throw createHttpError.NotFound('Short URL does not exist')
    }
    res.redirect(result.url)
  } catch (error) {
    next(error)
  }
})
app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("index", { error: err.message });
});
const port = 3000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
