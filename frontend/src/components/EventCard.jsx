import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, Tag, User } from 'lucide-react';

const EventCard = ({ event, isRegistered, onRegister, onCancel, loading }) => {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const isFull = event.availableSeats <= 0;

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

  const getCategoryColor = (category) => {
    const colors = {
      Technology: '#6c5ce7',
      Business: '#00b894',
      Music: '#e17055',
      Sports: '#74b9ff',
      Art: '#fd79a8',
      Education: '#fdcb6e',
      Health: '#55efc4',
      Food: '#fab1a0',
      Networking: '#a29bfe',
      Other: '#636e72'
    };
    return colors[category] || '#636e72';
  };

  return (
    <div className={`event-card card ${isPast ? 'past-event' : ''}`}>
      <div className="event-card-image">
        <img
          src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
          alt={event.name}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
          }}
        />
        <span
          className="event-category-badge"
          style={{ backgroundColor: getCategoryColor(event.category) }}
        >
          {event.category}
        </span>
        {isPast && <span className="event-past-badge">Past Event</span>}
        {isFull && !isPast && <span className="event-full-badge">Sold Out</span>}
      </div>

      <div className="event-card-content">
        <Link to={`/events/${event._id}`} className="event-card-title">
          {event.name}
        </Link>

        <div className="event-card-details">
          <div className="event-detail">
            <User size={14} />
            <span>{event.organizer}</span>
          </div>
          <div className="event-detail">
            <MapPin size={14} />
            <span>{event.location}</span>
          </div>
          <div className="event-detail">
            <Clock size={14} />
            <span>{formatDate(event.date)} at {formatTime(event.date)}</span>
          </div>
          <div className="event-detail">
            <Users size={14} />
            <span>{event.availableSeats} / {event.capacity} seats available</span>
          </div>
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="event-tags">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="event-tag">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="event-card-actions">
          <Link to={`/events/${event._id}`} className="btn btn-secondary btn-sm">
            View Details
          </Link>

          {!isPast && (
            isRegistered ? (
              <button
                onClick={() => onCancel && onCancel(event._id)}
                disabled={loading}
                className="btn btn-danger btn-sm"
              >
                {loading ? 'Cancelling...' : 'Cancel Registration'}
              </button>
            ) : (
              <button
                onClick={() => onRegister && onRegister(event._id)}
                disabled={loading || isFull}
                className="btn btn-primary btn-sm"
              >
                {loading ? 'Registering...' : isFull ? 'Sold Out' : 'Register'}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;