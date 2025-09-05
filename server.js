const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT

const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");
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
app.use(methodOverride("_method"));
app.use(morgan("dev"));

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
  const foundBlog = await Blog.findById(req.params.blogId, req.body);
  res.render(`/blog/${req.params.blogId}`);
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

app.delete("/blog/:blogId", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.blogId);
  res.redirect("/blog");
});

app.get("/blog/:blogId/edit", async (req, res) => {
  const foundBlog = await Blog.findById(req.params.blogId);
  res.render("blog/edit.ejs", {
    blog: foundBlog,
  });
});

// Listener
app.listen(3000, () => {
  console.log('Listening on port 3000');
});
