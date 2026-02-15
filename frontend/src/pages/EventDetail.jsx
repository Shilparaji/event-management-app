import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, Users, Tag, User, ArrowLeft,
  Calendar, CheckCircle, XCircle, Info
} from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/events/${id}`);
        setEvent(response.data.data.event);
        setIsRegistered(response.data.data.isRegistered);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Event not found');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleRegister = async () => {
    if (!user) {
      toast.error('Please login to register');
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      const response = await API.post(`/events/${id}/register`);
      toast.success(response.data.message);
      setIsRegistered(true);
      setEvent(prev => ({
        ...prev,
        availableSeats: response.data.data.availableSeats,
        registeredCount: prev.capacity - response.data.data.availableSeats
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      const response = await API.delete(`/events/${id}/register`);
      toast.success(response.data.message);
      setIsRegistered(false);
      setEvent(prev => ({
        ...prev,
        availableSeats: response.data.data.availableSeats,
        registeredCount: prev.capacity - response.data.data.availableSeats
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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

  if (loading) return <LoadingSpinner text="Loading event details..." />;
  if (!event) return null;

  const isPast = new Date(event.date) < new Date();
  const isFull = event.availableSeats <= 0;
  const seatsPercentage = ((event.capacity - event.availableSeats) / event.capacity) * 100;

  return (
    <div className="event-detail-page">
      <div className="container">
        <Link to="/events" className="back-link">
          <ArrowLeft size={20} />
          Back to Events
        </Link>

        <div className="event-detail-layout">
          {/* Left Column - Event Info */}
          <div className="event-detail-main">
            <div className="event-detail-image">
              <img
                src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                alt={event.name}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
                }}
              />
              {isPast && <span className="event-status-badge past">Past Event</span>}
              {isFull && !isPast && <span className="event-status-badge full">Sold Out</span>}
            </div>

            <div className="event-detail-content">
              <span className="event-detail-category">{event.category}</span>
              <h1 className="event-detail-title">{event.name}</h1>

              <div className="event-detail-meta">
                <div className="meta-item">
                  <User size={18} />
                  <div>
                    <span className="meta-label">Organized by</span>
                    <span className="meta-value">{event.organizer}</span>
                  </div>
                </div>

                <div className="meta-item">
                  <MapPin size={18} />
                  <div>
                    <span className="meta-label">Location</span>
                    <span className="meta-value">{event.location}</span>
                  </div>
                </div>

                <div className="meta-item">
                  <Calendar size={18} />
                  <div>
                    <span className="meta-label">Date</span>
                    <span className="meta-value">{formatDate(event.date)}</span>
                  </div>
                </div>

                <div className="meta-item">
                  <Clock size={18} />
                  <div>
                    <span className="meta-label">Time</span>
                    <span className="meta-value">{formatTime(event.date)}</span>
                  </div>
                </div>
              </div>

              <div className="event-detail-description">
                <h2>About This Event</h2>
                <p>{event.description}</p>
              </div>

              {event.tags && event.tags.length > 0 && (
                <div className="event-detail-tags">
                  <h3>Tags</h3>
                  <div className="tags-list">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="event-tag">
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Registration */}
          <div className="event-detail-sidebar">
            <div className="registration-card card">
              <h3>Registration</h3>

              {/* Seats Progress */}
              <div className="seats-info">
                <div className="seats-header">
                  <Users size={18} />
                  <span>
                    {event.availableSeats} of {event.capacity} seats available
                  </span>
                </div>
                <div className="seats-bar">
                  <div
                    className="seats-bar-fill"
                    style={{
                      width: `${seatsPercentage}%`,
                      backgroundColor: seatsPercentage > 90 ? 'var(--danger)' :
                        seatsPercentage > 70 ? 'var(--warning)' : 'var(--success)'
                    }}
                  ></div>
                </div>
                <span className="seats-count">
                  {event.capacity - event.availableSeats} registered
                </span>
              </div>

              {/* Status Messages */}
              {isPast && (
                <div className="status-message info">
                  <Info size={18} />
                  <span>This event has already ended</span>
                </div>
              )}

              {isRegistered && !isPast && (
                <div className="status-message success">
                  <CheckCircle size={18} />
                  <span>You are registered for this event!</span>
                </div>
              )}

              {isFull && !isPast && !isRegistered && (
                <div className="status-message warning">
                  <XCircle size={18} />
                  <span>This event is fully booked</span>
                </div>
              )}

              {/* Action Buttons */}
              {!isPast && (
                <div className="registration-actions">
                  {!user ? (
                    <Link to="/login" className="btn btn-primary btn-full">
                      Login to Register
                    </Link>
                  ) : isRegistered ? (
                    <button
                      onClick={handleCancel}
                      disabled={actionLoading}
                      className="btn btn-danger btn-full"
                    >
                      {actionLoading ? 'Cancelling...' : 'Cancel Registration'}
                    </button>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={actionLoading || isFull}
                      className="btn btn-primary btn-full"
                    >
                      {actionLoading ? 'Registering...' : isFull ? 'Sold Out' : 'Register Now'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;