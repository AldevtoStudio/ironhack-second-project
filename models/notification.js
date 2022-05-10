const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
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
  comment: {
    type: Boolean,
    required: true
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
