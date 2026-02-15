const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Event = require('../models/Event');

const sampleEvents = [
  {
    name: 'Tech Conference 2025',
    organizer: 'TechWorld Inc.',
    location: 'San Francisco, CA',
    date: new Date('2026-08-15T09:00:00'),
    description: 'Join the biggest tech conference of the year featuring keynotes from industry leaders, hands-on workshops, and networking opportunities. Topics include AI, cloud computing, and emerging technologies.',
    capacity: 500,
    registeredCount: 120,
    category: 'Technology',
    tags: ['tech', 'ai', 'conference', 'networking'],
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    status: 'upcoming'
  },
  {
    name: 'Startup Pitch Night',
    organizer: 'Founders Hub',
    location: 'New York, NY',
    date: new Date('2026-09-20T18:00:00'),
    description: 'Watch innovative startups pitch their ideas to a panel of investors. Great networking opportunity for entrepreneurs and investors alike.',
    capacity: 200,
    registeredCount: 180,
    category: 'Business',
    tags: ['startup', 'pitch', 'investors', 'entrepreneurship'],
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    status: 'upcoming'
  },
  {
    name: 'Jazz Under the Stars',
    organizer: 'City Arts Council',
    location: 'Chicago, IL',
    date: new Date('2026-10-10T20:00:00'),
    description: 'An enchanting evening of live jazz music under the open sky. Featuring renowned jazz artists and emerging talents.',
    capacity: 300,
    registeredCount: 45,
    category: 'Music',
    tags: ['jazz', 'live music', 'outdoor', 'concert'],
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    status: 'upcoming'
  },
  {
    name: 'Marathon for a Cause',
    organizer: 'FitCity Foundation',
    location: 'Boston, MA',
    date: new Date('2026-11-05T06:00:00'),
    description: 'Run for charity in this annual marathon event. Multiple distance options available: 5K, 10K, half marathon, and full marathon.',
    capacity: 1000,
    registeredCount: 650,
    category: 'Sports',
    tags: ['marathon', 'running', 'charity', 'fitness'],
    imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    status: 'upcoming'
  },
  {
    name: 'Modern Art Exhibition',
    organizer: 'Gallery Moderne',
    location: 'Los Angeles, CA',
    date: new Date('2026-08-01T10:00:00'),
    description: 'Explore contemporary artworks from over 50 international artists. Interactive installations and guided tours available.',
    capacity: 150,
    registeredCount: 80,
    category: 'Art',
    tags: ['art', 'exhibition', 'modern art', 'gallery'],
    imageUrl: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800',
    status: 'upcoming'
  },
  {
    name: 'AI & Machine Learning Workshop',
    organizer: 'DataScience Academy',
    location: 'Seattle, WA',
    date: new Date('2026-08-25T09:00:00'),
    description: 'Hands-on workshop covering the latest in AI and ML. Build real projects with TensorFlow and PyTorch.',
    capacity: 50,
    registeredCount: 48,
    category: 'Education',
    tags: ['ai', 'machine learning', 'workshop', 'python'],
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    status: 'upcoming'
  },
  {
    name: 'Wellness & Mindfulness Retreat',
    organizer: 'ZenLife Studios',
    location: 'Austin, TX',
    date: new Date('2026-09-20T08:00:00'),
    description: 'A full-day retreat focused on mental wellness, yoga, meditation, and healthy living practices. Includes organic lunch.',
    capacity: 80,
    registeredCount: 25,
    category: 'Health',
    tags: ['wellness', 'yoga', 'meditation', 'mindfulness'],
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    status: 'upcoming'
  },
  {
    name: 'International Food Festival',
    organizer: 'Taste Global',
    location: 'Miami, FL',
    date: new Date('2026-10-15T11:00:00'),
    description: 'Savor cuisines from over 30 countries. Live cooking demonstrations, food competitions, and cultural performances.',
    capacity: 2000,
    registeredCount: 800,
    category: 'Food',
    tags: ['food', 'festival', 'international', 'cooking'],
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    status: 'upcoming'
  },
  {
    name: 'Women in Tech Summit',
    organizer: 'TechDiversity Alliance',
    location: 'San Francisco, CA',
    date: new Date('2026-09-08T09:00:00'),
    description: 'Celebrating women in technology with inspiring talks, panel discussions, and mentorship opportunities.',
    capacity: 400,
    registeredCount: 290,
    category: 'Networking',
    tags: ['women in tech', 'diversity', 'networking', 'leadership'],
    imageUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800',
    status: 'upcoming'
  },
  {
    name: 'Blockchain & Web3 Conference',
    organizer: 'CryptoEvents Global',
    location: 'Denver, CO',
    date: new Date('2026-11-15T09:00:00'),
    description: 'Deep dive into blockchain technology, DeFi, NFTs, and the future of Web3.',
    capacity: 350,
    registeredCount: 100,
    category: 'Technology',
    tags: ['blockchain', 'web3', 'crypto', 'defi'],
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    status: 'upcoming'
  },
  {
    name: 'E-Commerce Growth Summit',
    organizer: 'Digital Commerce Academy',
    location: 'New York, NY',
    date: new Date('2026-10-01T09:00:00'),
    description: 'Learn strategies for scaling your e-commerce business. SEO, paid ads, conversion optimization, and more.',
    capacity: 250,
    registeredCount: 175,
    category: 'Business',
    tags: ['ecommerce', 'marketing', 'growth', 'digital'],
    imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800',
    status: 'upcoming'
  },
  {
    name: 'Indie Music Showcase',
    organizer: 'Underground Sounds',
    location: 'Portland, OR',
    date: new Date('2026-08-22T19:00:00'),
    description: 'Discover the best independent music artists. Live performances across multiple stages.',
    capacity: 600,
    registeredCount: 200,
    category: 'Music',
    tags: ['indie', 'live music', 'bands', 'showcase'],
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    status: 'upcoming'
  },
  {
    name: 'Basketball Tournament',
    organizer: 'City Sports League',
    location: 'Chicago, IL',
    date: new Date('2026-12-01T08:00:00'),
    description: 'Annual 3-on-3 basketball tournament. Open to all skill levels. Prizes for top 3 teams.',
    capacity: 120,
    registeredCount: 60,
    category: 'Sports',
    tags: ['basketball', 'tournament', 'sports', 'competition'],
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    status: 'upcoming'
  },
  {
    name: 'Photography Masterclass',
    organizer: 'Lens Academy',
    location: 'Los Angeles, CA',
    date: new Date('2026-09-05T10:00:00'),
    description: 'Learn advanced photography techniques from award-winning photographers.',
    capacity: 30,
    registeredCount: 28,
    category: 'Art',
    tags: ['photography', 'masterclass', 'creative', 'workshop'],
    imageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
    status: 'upcoming'
  },
  {
    name: 'Full-Stack Web Dev Bootcamp',
    organizer: 'CodeCamp Pro',
    location: 'Austin, TX',
    date: new Date('2026-11-10T09:00:00'),
    description: 'Intensive 2-day bootcamp covering React, Node.js, and MongoDB. Build a full project from scratch.',
    capacity: 40,
    registeredCount: 35,
    category: 'Education',
    tags: ['coding', 'bootcamp', 'react', 'nodejs', 'fullstack'],
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    status: 'upcoming'
  },
  {
    name: 'Nutrition & Fitness Expo',
    organizer: 'HealthFirst',
    location: 'Houston, TX',
    date: new Date('2026-08-30T08:00:00'),
    description: 'Everything about healthy living - nutrition talks, fitness demos, and health screenings.',
    capacity: 500,
    registeredCount: 200,
    category: 'Health',
    tags: ['nutrition', 'fitness', 'health', 'expo'],
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    status: 'upcoming'
  },
  {
    name: 'Wine & Cheese Tasting Evening',
    organizer: 'Sommelier Society',
    location: 'Napa Valley, CA',
    date: new Date('2026-10-25T17:00:00'),
    description: 'An elegant evening of wine and artisan cheese pairings.',
    capacity: 100,
    registeredCount: 70,
    category: 'Food',
    tags: ['wine', 'cheese', 'tasting', 'gourmet'],
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
    status: 'upcoming'
  },
  {
    name: 'Founders Meetup & Mixer',
    organizer: 'StartupCircle',
    location: 'Seattle, WA',
    date: new Date('2026-08-28T18:30:00'),
    description: 'Casual networking event for startup founders and aspiring entrepreneurs.',
    capacity: 100,
    registeredCount: 55,
    category: 'Networking',
    tags: ['networking', 'founders', 'startup', 'meetup'],
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
    status: 'upcoming'
  },
  {
    name: 'Cybersecurity Summit',
    organizer: 'SecureNet Forum',
    location: 'Washington, DC',
    date: new Date('2026-11-20T09:00:00'),
    description: 'Stay ahead of cyber threats. Expert talks on cybersecurity and ethical hacking.',
    capacity: 300,
    registeredCount: 150,
    category: 'Technology',
    tags: ['cybersecurity', 'hacking', 'infosec', 'security'],
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    status: 'upcoming'
  },
  {
    name: 'Open Mic Poetry Night',
    organizer: 'Words Alive Collective',
    location: 'Brooklyn, NY',
    date: new Date('2026-09-18T19:00:00'),
    description: 'Express yourself at our monthly open mic poetry night. All forms of spoken word welcome.',
    capacity: 75,
    registeredCount: 30,
    category: 'Art',
    tags: ['poetry', 'open mic', 'spoken word', 'creative'],
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
    status: 'upcoming'
  },
  {
    name: 'New Year Tech Meetup',
    organizer: 'TechWorld Inc.',
    location: 'San Francisco, CA',
    date: new Date('2025-01-10T18:00:00'),
    description: 'Kicked off the new year with tech talks and networking.',
    capacity: 100,
    registeredCount: 95,
    category: 'Technology',
    tags: ['tech', 'meetup', 'networking'],
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    status: 'completed'
  },
  {
    name: 'Winter Music Festival',
    organizer: 'City Arts Council',
    location: 'Denver, CO',
    date: new Date('2025-01-25T16:00:00'),
    description: 'A cozy winter festival featuring acoustic performances and hot beverages.',
    capacity: 200,
    registeredCount: 180,
    category: 'Music',
    tags: ['music', 'winter', 'festival', 'acoustic'],
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
    status: 'completed'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Event.deleteMany({});
    console.log('Cleared existing events');

    const inserted = await Event.insertMany(sampleEvents);
    console.log(`Seeded ${inserted.length} events`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();