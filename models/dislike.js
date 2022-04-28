const mongoose = require('mongoose');

const dislikeSchema = new mongoose.Schema({
  card: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  value: Number,
  default: -0.3
});

const Like = mongoose.model('Dislike', dislikeSchema);

module.exports = Dislike;
