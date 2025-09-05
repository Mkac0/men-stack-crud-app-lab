const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT

const Blog = require('./models/blog.js');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection
db.on('error', (err) => {console.log('ERROR: ', err)});
db.on('connected', () => {console.log(`Connected to MongoDB ${mongoose.connection.name}.`)});
db.on('disconnected', () => {console.log('mongo disconnected')});

app.use(express.urlencoded({ extended: false }));

// Route
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/blog", async (req, res) => {
  const allBlogs = await Blog.find();
  res.render("blog/index.ejs", { blog: allBlogs});
});

app.get("/blog/new", (req, res) => {
    res.render("blog/new.ejs");
});

app.post("/blog", async (req, res) => {
  console.log(req.body);
  res.redirect("/blog/new");
});

// Listener
app.listen(3000, () => {
  console.log('Listening on port 3000');
});
