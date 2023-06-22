const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  picture: {
    filename: String,
    mimetype: String,
    path: String,
  },
  author: {
    type: String,
    required: true,
  },
  liked: {
    type: Boolean,
    default: false,
  },
  thumbsUp: {
    type: Number,
    default: 0,
  },
  disliked: {
    type: Boolean,
    default: false,
  },
  thumbsDown: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      content: String,
      author: String,
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
      },
    },
  ],
  
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
