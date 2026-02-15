const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    enum: ['registered', 'cancelled', 'attended'],
    default: 'registered'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  cancelledAt: {
    type: Date
  }
}, {
  timestamps: true
});

registrationSchema.index({ user: 1, event: 1 }, { unique: true });
registrationSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Registration', registrationSchema);