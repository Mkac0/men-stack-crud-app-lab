const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection
db.on('error', (err) => {console.log('ERROR: ', err)});
db.on('connected', () => {console.log(`Connected to MongoDB ${mongoose.connection.name}.`)});
db.on('disconnected', () => {console.log('mongo disconnected')});

const Blog = require('./models/blog.js');

// Route
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/blog/new", (req, res) => {
    res.render("blog/new.ejs");
});

// Listener
app.listen(3000, () => {
  console.log('Listening on port 3000');
});
