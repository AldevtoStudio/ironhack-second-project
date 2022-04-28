const mongoose = require('mongoose');

const schema = new mongoose.Schema({
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
    enum: [-0.3, 0, 0.3]
  }
});

const Feedback = mongoose.model('Feedback', schema);

module.exports = Feedback;
