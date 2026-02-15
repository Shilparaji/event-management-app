const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    maxlength: 150
  },
  organizer: {
    type: String,
    required: [true, 'Organizer is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 2000
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: 1
  },
  registeredCount: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Business', 'Music', 'Sports', 'Art', 'Education', 'Health', 'Food', 'Networking', 'Other']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  imageUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

eventSchema.virtual('availableSeats').get(function() {
  return this.capacity - this.registeredCount;
});

eventSchema.index({
  name: 'text',
  description: 'text',
  organizer: 'text',
  location: 'text',
  tags: 'text'
});

eventSchema.index({ category: 1, date: 1 });
eventSchema.index({ location: 1, date: 1 });
eventSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model('Event', eventSchema);