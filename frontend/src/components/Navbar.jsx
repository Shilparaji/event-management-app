import { Link, useLocation } from 'react-router-dom';
import { Calendar, LogOut, User, LayoutDashboard, Home, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <Calendar size={28} />
          EventHub
        </Link>

        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <Home size={16} />
            Home
          </Link>

          <Link
            to="/events"
            className={`nav-link ${isActive('/events') ? 'active' : ''}`}
          >
            <Search size={16} />
            Events
          </Link>

          {user ? (
            <div className="nav-user">
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>

              <span className="nav-user-name">
                <User size={14} />
                {user.name}
              </span>

              <button onClick={logout} className="nav-logout">
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="nav-link btn-accent"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;