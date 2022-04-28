const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  card: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  value: {
    type: Number,
    default: 0.3
  }
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
