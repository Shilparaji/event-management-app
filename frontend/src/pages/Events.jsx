import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import EventFilters from '../components/EventFilters';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Events = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL params (maintain browsing state)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    location: searchParams.get('location') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    sortBy: searchParams.get('sortBy') || 'date',
    sortOrder: searchParams.get('sortOrder') || 'asc',
    page: parseInt(searchParams.get('page')) || 1
  });

  const [events, setEvents] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      params.append('page', filters.page);
      params.append('limit', 12);

      const response = await API.get(`/events?${params.toString()}`);
      const data = response.data.data;

      setEvents(data.events);
      setUserRegistrations(data.userRegistrations || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Update URL when filters change (maintain browsing state)
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set('search', filters.search);
    if (filters.category && filters.category !== 'All') params.set('category', filters.category);
    if (filters.location) params.set('location', filters.location);
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.sortBy !== 'date') params.set('sortBy', filters.sortBy);
    if (filters.sortOrder !== 'asc') params.set('sortOrder', filters.sortOrder);
    if (filters.page > 1) params.set('page', filters.page);

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Fetch events when filters change
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Handle page change
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Register for event
  const handleRegister = async (eventId) => {
    if (!user) {
      toast.error('Please login to register for events');
      return;
    }

    setActionLoading(eventId);
    try {
      const response = await API.post(`/events/${eventId}/register`);
      toast.success(response.data.message);

      // Update local state
      setUserRegistrations(prev => [...prev, eventId]);
      setEvents(prev =>
        prev.map(event =>
          event._id === eventId
            ? {
                ...event,
                availableSeats: response.data.data.availableSeats,
                registeredCount: event.capacity - response.data.data.availableSeats
              }
            : event
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setActionLoading(null);
    }
  };

  // Cancel registration
  const handleCancel = async (eventId) => {
    setActionLoading(eventId);
    try {
      const response = await API.delete(`/events/${eventId}/register`);
      toast.success(response.data.message);

      // Update local state
      setUserRegistrations(prev => prev.filter(id => id !== eventId));
      setEvents(prev =>
        prev.map(event =>
          event._id === eventId
            ? {
                ...event,
                availableSeats: response.data.data.availableSeats,
                registeredCount: event.capacity - response.data.data.availableSeats
              }
            : event
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="events-page">
      <div className="container">
        <div className="events-header">
          <h1>
            <Calendar size={32} />
            Explore Events
          </h1>
          <p>Discover events that match your interests</p>
        </div>

        <EventFilters filters={filters} onFilterChange={handleFilterChange} />

        {loading ? (
          <LoadingSpinner text="Loading events..." />
        ) : events.length === 0 ? (
          <div className="no-events">
            <Calendar size={48} />
            <h3>No events found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <>
            <div className="events-grid">
              {events.map(event => (
                <EventCard
                  key={event._id}
                  event={event}
                  isRegistered={userRegistrations.includes(event._id)}
                  onRegister={handleRegister}
                  onCancel={handleCancel}
                  loading={actionLoading === event._id}
                />
              ))}
            </div>

            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Events;