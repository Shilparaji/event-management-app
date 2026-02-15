import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, ArrowRight, Star, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover & Join <span className="text-accent">Amazing Events</span>
            </h1>
            <p className="hero-subtitle">
              Browse hundreds of events, register instantly, and never miss out on 
              experiences that matter to you.
            </p>
            <div className="hero-buttons">
              <Link to="/events" className="btn btn-primary btn-lg">
                Explore Events
                <ArrowRight size={20} />
              </Link>
              {!user && (
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Get Started Free
                </Link>
              )}
              {user && (
                <Link to="/dashboard" className="btn btn-secondary btn-lg">
                  My Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <Calendar size={28} className="stat-icon" />
              <h3>100+</h3>
              <p>Events Listed</p>
            </div>
            <div className="stat-card">
              <Users size={28} className="stat-icon" />
              <h3>5000+</h3>
              <p>Registered Users</p>
            </div>
            <div className="stat-card">
              <MapPin size={28} className="stat-icon" />
              <h3>20+</h3>
              <p>Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose EventHub?</h2>
          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Instant Registration</h3>
              <p>Register for any event with just one click. No complicated forms or processes.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">
                <Star size={32} />
              </div>
              <h3>Curated Events</h3>
              <p>Browse through carefully curated events across technology, music, sports, and more.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>Secure & Reliable</h3>
              <p>Your data is safe with us. Manage your registrations with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Explore?</h2>
            <p>Find events that match your interests and start building unforgettable experiences.</p>
            <Link to="/events" className="btn btn-primary btn-lg">
              Browse All Events
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;