const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aboutMe: { type: String, required: true },
  image: String,
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
