import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, CheckCircle, XCircle,
  MapPin, Users, ArrowRight, BarChart3
} from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);

  const fetchDashboard = async () => {
    try {
      const response = await API.get('/dashboard');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCancel = async (eventId) => {
    setCancelLoading(eventId);
    try {
      await API.delete(`/events/${eventId}/register`);
      toast.success('Registration cancelled');
      fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelLoading(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const { upcoming, past, stats } = dashboardData || {
    upcoming: [],
    past: [],
    stats: { totalRegistered: 0, upcomingCount: 0, pastCount: 0, totalCancelled: 0 }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p>Manage your event registrations</p>
          </div>
          <Link to="/events" className="btn btn-primary">
            Browse Events
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card-dashboard">
            <div className="stat-icon-wrapper blue">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalRegistered}</h3>
              <p>Total Registered</p>
            </div>
          </div>

          <div className="stat-card-dashboard">
            <div className="stat-icon-wrapper green">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <h3>{stats.upcomingCount}</h3>
              <p>Upcoming Events</p>
            </div>
          </div>

          <div className="stat-card-dashboard">
            <div className="stat-icon-wrapper purple">
              <CheckCircle size={24} />
            </div>
            <div className="stat-info">
              <h3>{stats.pastCount}</h3>
              <p>Past Events</p>
            </div>
          </div>

          <div className="stat-card-dashboard">
            <div className="stat-icon-wrapper red">
              <XCircle size={24} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalCancelled}</h3>
              <p>Cancelled</p>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <Clock size={24} />
              Upcoming Events ({upcoming.length})
            </h2>
          </div>

          {upcoming.length === 0 ? (
            <div className="empty-state">
              <Calendar size={48} />
              <h3>No upcoming events</h3>
              <p>Browse and register for events to see them here</p>
              <Link to="/events" className="btn btn-primary">
                Find Events
              </Link>
            </div>
          ) : (
            <div className="dashboard-events-list">
              {upcoming.map((event) => (
                <div key={event._id} className="dashboard-event-card card">
                  <div className="dashboard-event-image">
                    <img
                      src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                      alt={event.name}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
                      }}
                    />
                    <span className="dashboard-category">{event.category}</span>
                  </div>

                  <div className="dashboard-event-info">
                    <Link to={`/events/${event._id}`} className="dashboard-event-title">
                      {event.name}
                    </Link>

                    <div className="dashboard-event-details">
                      <span>
                        <Calendar size={14} />
                        {formatDate(event.date)}
                      </span>
                      <span>
                        <Clock size={14} />
                        {formatTime(event.date)}
                      </span>
                      <span>
                        <MapPin size={14} />
                        {event.location}
                      </span>
                      <span>
                        <Users size={14} />
                        {event.availableSeats} seats left
                      </span>
                    </div>
                  </div>

                  <div className="dashboard-event-actions">
                    <Link to={`/events/${event._id}`} className="btn btn-secondary btn-sm">
                      View
                    </Link>
                    <button
                      onClick={() => handleCancel(event._id)}
                      disabled={cancelLoading === event._id}
                      className="btn btn-danger btn-sm"
                    >
                      {cancelLoading === event._id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Events */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <BarChart3 size={24} />
              Past Events ({past.length})
            </h2>
          </div>

          {past.length === 0 ? (
            <div className="empty-state">
              <CheckCircle size={48} />
              <h3>No past events</h3>
              <p>Events you've attended will appear here</p>
            </div>
          ) : (
            <div className="dashboard-events-list">
              {past.map((event) => (
                <div key={event._id} className="dashboard-event-card card past-event">
                  <div className="dashboard-event-image">
                    <img
                      src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                      alt={event.name}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
                      }}
                    />
                    <span className="dashboard-category past">{event.category}</span>
                  </div>

                  <div className="dashboard-event-info">
                    <Link to={`/events/${event._id}`} className="dashboard-event-title">
                      {event.name}
                    </Link>

                    <div className="dashboard-event-details">
                      <span>
                        <Calendar size={14} />
                        {formatDate(event.date)}
                      </span>
                      <span>
                        <MapPin size={14} />
                        {event.location}
                      </span>
                    </div>
                  </div>

                  <div className="dashboard-event-actions">
                    <Link to={`/events/${event._id}`} className="btn btn-secondary btn-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;