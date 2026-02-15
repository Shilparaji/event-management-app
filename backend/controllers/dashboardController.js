const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Get user dashboard data
// @route   GET /api/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const registrations = await Registration.find({
      user: userId,
      status: 'registered'
    })
      .populate('event')
      .sort({ registeredAt: -1 })
      .lean();

    const upcoming = [];
    const past = [];

    registrations.forEach(reg => {
      if (reg.event) {
        const eventData = {
          ...reg.event,
          availableSeats: reg.event.capacity - reg.event.registeredCount,
          registrationId: reg._id,
          registeredAt: reg.registeredAt
        };

        if (new Date(reg.event.date) >= now) {
          upcoming.push(eventData);
        } else {
          past.push(eventData);
        }
      }
    });

    upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
    past.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalRegistered = registrations.length;
    const totalCancelled = await Registration.countDocuments({
      user: userId,
      status: 'cancelled'
    });

    res.json({
      success: true,
      data: {
        upcoming,
        past,
        stats: {
          totalRegistered,
          upcomingCount: upcoming.length,
          pastCount: past.length,
          totalCancelled
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
};