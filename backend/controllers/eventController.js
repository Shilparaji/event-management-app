const Event = require('../models/Event');
const Registration = require('../models/Registration');
const mongoose = require('mongoose');

// @desc    Get all events with pagination, search, and filters
// @route   GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      location,
      dateFrom,
      dateTo,
      sortBy = 'date',
      sortOrder = 'asc',
      status
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    if (status) {
      filter.status = status;
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const total = await Event.countDocuments(filter);

    const events = await Event.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const eventsWithSeats = events.map(event => ({
      ...event,
      availableSeats: event.capacity - event.registeredCount
    }));

    let userRegistrations = [];
    if (req.user) {
      const eventIds = events.map(e => e._id);
      const registrations = await Registration.find({
        user: req.user._id,
        event: { $in: eventIds },
        status: 'registered'
      }).select('event');
      userRegistrations = registrations.map(r => r.event.toString());
    }

    res.json({
      success: true,
      data: {
        events: eventsWithSeats,
        userRegistrations,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalEvents: total,
          hasNextPage: pageNum < Math.ceil(total / limitNum),
          hasPrevPage: pageNum > 1,
          limit: limitNum
        }
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events'
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    const event = await Event.findById(req.params.id).lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.availableSeats = event.capacity - event.registeredCount;

    let isRegistered = false;
    if (req.user) {
      const registration = await Registration.findOne({
        user: req.user._id,
        event: event._id,
        status: 'registered'
      });
      isRegistered = !!registration;
    }

    res.json({
      success: true,
      data: {
        event,
        isRegistered
      }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event'
    });
  }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
exports.registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (new Date(event.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for a past event'
      });
    }

    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is fully booked'
      });
    }

    const existingRegistration = await Registration.findOne({
      user: userId,
      event: eventId
    });

    if (existingRegistration) {
      if (existingRegistration.status === 'registered') {
        return res.status(400).json({
          success: false,
          message: 'Already registered for this event'
        });
      }

      if (existingRegistration.status === 'cancelled') {
        existingRegistration.status = 'registered';
        existingRegistration.registeredAt = new Date();
        existingRegistration.cancelledAt = undefined;
        await existingRegistration.save();

        event.registeredCount += 1;
        await event.save();

        return res.status(201).json({
          success: true,
          message: 'Successfully registered for event',
          data: {
            availableSeats: event.capacity - event.registeredCount
          }
        });
      }
    }

    await Registration.create({
      user: userId,
      event: eventId,
      status: 'registered'
    });

    event.registeredCount += 1;
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Successfully registered for event',
      data: {
        availableSeats: event.capacity - event.registeredCount
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for event'
    });
  }
};

// @desc    Cancel event registration
// @route   DELETE /api/events/:id/register
exports.cancelRegistration = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const registration = await Registration.findOne({
      user: userId,
      event: eventId,
      status: 'registered'
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    registration.status = 'cancelled';
    registration.cancelledAt = new Date();
    await registration.save();

    const event = await Event.findById(eventId);
    if (event && event.registeredCount > 0) {
      event.registeredCount -= 1;
      await event.save();
    }

    res.json({
      success: true,
      message: 'Registration cancelled successfully',
      data: {
        availableSeats: event ? event.capacity - event.registeredCount : null
      }
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling registration'
    });
  }
};

// @desc    Get distinct locations
// @route   GET /api/events/meta/locations
exports.getLocations = async (req, res) => {
  try {
    const locations = await Event.distinct('location');
    res.json({ success: true, data: locations.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching locations' });
  }
};

// @desc    Get distinct categories
// @route   GET /api/events/meta/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Event.distinct('category');
    res.json({ success: true, data: categories.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
};