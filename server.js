const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT

const path = require("path");
const mongoose = require('mongoose');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// database
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection
db.on('error', (err) => {console.log('ERROR: ', err)});
db.on('connected', () => {console.log(`Connected to MongoDB ${mongoose.connection.name}.`)});
db.on('disconnected', () => {console.log('mongo disconnected')});

// Models
const Blog = require('./models/blog.js');

// Middleware
app.use(express.urlencoded({ extended: false }));

// Routes
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

app.get("/blog/:blogId", async (req, res) => {
  const foundBlog = await Blog.findById(req.params.blogId);
  res.render("blog/show.ejs", { blog: foundBlog });
});

app.post("/blog", async (req, res) => {
  try {
    await Blog.create(req.body);
    res.redirect("/blog/new");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to create blog");
  }
  res.redirect("/blog");
});

// Listener
app.listen(3000, () => {
  console.log('Listening on port 3000');
});
