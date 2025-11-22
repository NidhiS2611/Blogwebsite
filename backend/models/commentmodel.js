const mongoose = require('mongoose');

const commentschema = new mongoose.Schema({
  comment: {      // <-- yaha comment likh diya
    type: String,
    required: true
  },

  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'blog'
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});
const commentmodel = mongoose.model('comment', commentschema);
module.exports = commentmodel;