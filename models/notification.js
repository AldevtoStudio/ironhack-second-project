const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  publication: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Publication'
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    required: true
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
