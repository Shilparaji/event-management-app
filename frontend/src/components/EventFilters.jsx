import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import API from '../api/axios';

const EventFilters = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchInput, setSearchInput] = useState(filters.search || '');

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, locRes] = await Promise.all([
          API.get('/events/meta/categories'),
          API.get('/events/meta/locations')
        ]);
        setCategories(catRes.data.data || []);
        setLocations(locRes.data.data || []);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFilterChange({ search: searchInput, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value, page: 1 });
  };

  const handleLocationChange = (e) => {
    onFilterChange({ location: e.target.value, page: 1 });
  };

  const handleDateFromChange = (e) => {
    onFilterChange({ dateFrom: e.target.value, page: 1 });
  };

  const handleDateToChange = (e) => {
    onFilterChange({ dateTo: e.target.value, page: 1 });
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    onFilterChange({ sortBy, sortOrder, page: 1 });
  };

  const clearFilters = () => {
    setSearchInput('');
    onFilterChange({
      search: '',
      category: 'All',
      location: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'date',
      sortOrder: 'asc',
      page: 1
    });
  };

  const hasActiveFilters = filters.search || 
    (filters.category && filters.category !== 'All') || 
    filters.location || 
    filters.dateFrom || 
    filters.dateTo;

  return (
    <div className="filters-container">
      <div className="filters-header">
        <div className="filters-title">
          <Filter size={20} />
          <h3>Find Events</h3>
        </div>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="btn btn-sm btn-secondary">
            <X size={14} />
            Clear Filters
          </button>
        )}
      </div>

      <div className="filters-grid">
        <div className="filter-group search-group">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search events, organizers, locations..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="form-input search-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="form-label">Category</label>
          <select
            value={filters.category || 'All'}
            onChange={handleCategoryChange}
            className="form-input"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Location</label>
          <select
            value={filters.location || ''}
            onChange={handleLocationChange}
            className="form-input"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">From Date</label>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={handleDateFromChange}
            className="form-input"
          />
        </div>

        <div className="filter-group">
          <label className="form-label">To Date</label>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={handleDateToChange}
            className="form-input"
          />
        </div>

        <div className="filter-group">
          <label className="form-label">Sort By</label>
          <select
            value={`${filters.sortBy || 'date'}-${filters.sortOrder || 'asc'}`}
            onChange={handleSortChange}
            className="form-input"
          >
            <option value="date-asc">Date (Earliest)</option>
            <option value="date-desc">Date (Latest)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="capacity-desc">Capacity (High-Low)</option>
            <option value="capacity-asc">Capacity (Low-High)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;