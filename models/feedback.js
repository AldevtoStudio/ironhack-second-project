const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  card: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Card'
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  value: {
    type: Number,
    enum: [1, 0, 1],
    required: true
  }
});

const Feedback = mongoose.model('Feedback', schema);

module.exports = Feedback;
