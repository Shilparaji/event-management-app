const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Event = require('../models/Event');

const sampleEvents = [
  {
    name: "Tech Conference 2025",
    organizer: "TechCorp",
    location: "San Francisco, CA",
    date: new Date("2025-07-15T09:00:00"),
    description: "Join the biggest tech conference of the year featuring keynotes from industry leaders, hands-on workshops, and networking opportunities.",
    capacity: 500,
    registeredCount: 120,
    category: "Technology",
    tags: ["tech", "conference", "ai", "innovation"],
    status: "upcoming"
  },
  {
    name: "Music Festival",
    organizer: "SoundWave Events",
    location: "Austin, TX",
    date: new Date("2025-08-20T16:00:00"),
    description: "A 3-day music festival featuring top artists from around the world. Food, drinks, and amazing vibes!",
    capacity: 2000,
    registeredCount: 850,
    category: "Music",
    tags: ["music", "festival", "live", "concert"],
    status: "upcoming"
  },
  {
    name: "Startup Pitch Night",
    organizer: "InnoVentures",
    location: "New York, NY",
    date: new Date("2025-07-25T18:00:00"),
    description: "Watch 10 promising startups pitch their ideas to top investors. Network with founders and VCs.",
    capacity: 150,
    registeredCount: 95,
    category: "Business",
    tags: ["startup", "pitch", "investors", "networking"],
    status: "upcoming"
  },
  {
    name: "AI & Machine Learning Workshop",
    organizer: "DataMinds Academy",
    location: "Seattle, WA",
    date: new Date("2025-08-05T10:00:00"),
    description: "Hands-on workshop covering the latest in AI and ML. Build real projects with expert mentors.",
    capacity: 80,
    registeredCount: 45,
    category: "Technology",
    tags: ["ai", "machine-learning", "workshop", "python"],
    status: "upcoming"
  },
  {
    name: "Food & Wine Expo",
    organizer: "Gourmet Events Co.",
    location: "Chicago, IL",
    date: new Date("2025-09-10T11:00:00"),
    description: "Explore cuisines from around the world. Wine tasting, cooking demos, and celebrity chef appearances.",
    capacity: 300,
    registeredCount: 180,
    category: "Food",
    tags: ["food", "wine", "cooking", "gourmet"],
    status: "upcoming"
  },
  {
    name: "Marathon 2025",
    organizer: "City Sports Association",
    location: "Boston, MA",
    date: new Date("2025-10-12T06:00:00"),
    description: "Annual city marathon open to all skill levels. 5K, 10K, and full marathon options available.",
    capacity: 1000,
    registeredCount: 600,
    category: "Sports",
    tags: ["marathon", "running", "fitness", "sports"],
    status: "upcoming"
  },
  {
    name: "Photography Masterclass",
    organizer: "Creative Lens Studio",
    location: "Los Angeles, CA",
    date: new Date("2025-07-30T14:00:00"),
    description: "Learn professional photography techniques from award-winning photographers. Bring your camera!",
    capacity: 50,
    registeredCount: 35,
    category: "Art",
    tags: ["photography", "art", "masterclass", "creative"],
    status: "upcoming"
  },
  {
    name: "Blockchain Summit",
    organizer: "CryptoWorld",
    location: "Miami, FL",
    date: new Date("2025-08-18T09:00:00"),
    description: "Deep dive into blockchain technology, DeFi, and the future of digital currencies.",
    capacity: 200,
    registeredCount: 110,
    category: "Technology",
    tags: ["blockchain", "crypto", "defi", "web3"],
    status: "upcoming"
  },
  {
    name: "Yoga & Wellness Retreat",
    organizer: "Peaceful Minds",
    location: "Denver, CO",
    date: new Date("2025-09-05T07:00:00"),
    description: "A weekend retreat focused on yoga, meditation, and mental wellness. All levels welcome.",
    capacity: 60,
    registeredCount: 40,
    category: "Health",
    tags: ["yoga", "wellness", "meditation", "health"],
    status: "upcoming"
  },
  {
    name: "Comedy Night Live",
    organizer: "LaughTrack Entertainment",
    location: "Las Vegas, NV",
    date: new Date("2025-08-22T20:00:00"),
    description: "An evening of non-stop laughs featuring top stand-up comedians from across the country.",
    capacity: 250,
    registeredCount: 180,
    category: "Other",
    tags: ["comedy", "standup", "entertainment", "live"],
    status: "upcoming"
  },
  {
    name: "Web Development Bootcamp",
    organizer: "CodeCraft Academy",
    location: "Portland, OR",
    date: new Date("2025-09-15T09:00:00"),
    description: "Intensive 2-day bootcamp covering React, Node.js, and MongoDB. Perfect for beginners!",
    capacity: 40,
    registeredCount: 28,
    category: "Education",
    tags: ["webdev", "react", "nodejs", "bootcamp"],
    status: "upcoming"
  },
  {
    name: "Art Exhibition - Modern Visions",
    organizer: "Metropolitan Art Gallery",
    location: "Washington, DC",
    date: new Date("2025-10-01T10:00:00"),
    description: "Featuring contemporary art from emerging artists. Interactive installations and gallery tours.",
    capacity: 400,
    registeredCount: 150,
    category: "Art",
    tags: ["art", "exhibition", "gallery", "modern"],
    status: "upcoming"
  },
  {
    name: "Cybersecurity Conference",
    organizer: "SecureNet Global",
    location: "Dallas, TX",
    date: new Date("2025-08-28T09:00:00"),
    description: "Learn about the latest cybersecurity threats and defense strategies from industry experts.",
    capacity: 180,
    registeredCount: 90,
    category: "Technology",
    tags: ["cybersecurity", "infosec", "hacking", "security"],
    status: "upcoming"
  },
  {
    name: "Networking Mixer - Professionals",
    organizer: "ConnectPro",
    location: "Philadelphia, PA",
    date: new Date("2025-09-20T18:00:00"),
    description: "Meet professionals from various industries. Build connections that matter over drinks and appetizers.",
    capacity: 100,
    registeredCount: 65,
    category: "Networking",
    tags: ["networking", "professionals", "career", "mixer"],
    status: "upcoming"
  },
  {
    name: "E-Sports Tournament",
    organizer: "eSports Arena",
    location: "San Diego, CA",
    date: new Date("2025-10-05T12:00:00"),
    description: "Competitive gaming tournament with cash prizes. Games include Valorant, League of Legends, and more.",
    capacity: 500,
    registeredCount: 320,
    category: "Other",
    tags: ["gaming", "esports", "tournament", "competitive"],
    status: "upcoming"
  },
  {
    name: "Spring Music Concert 2025",
    organizer: "Harmony Productions",
    location: "Nashville, TN",
    date: new Date("2025-04-10T19:00:00"),
    description: "A magical evening of classical and contemporary music performed by world-renowned artists.",
    capacity: 350,
    registeredCount: 350,
    category: "Music",
    tags: ["music", "concert", "classical", "live"],
    status: "completed"
  },
  {
    name: "Business Leadership Summit 2025",
    organizer: "Global Leaders Forum",
    location: "Houston, TX",
    date: new Date("2025-03-15T08:00:00"),
    description: "Annual summit bringing together business leaders to discuss trends and strategies for success.",
    capacity: 200,
    registeredCount: 200,
    category: "Business",
    tags: ["business", "leadership", "summit", "strategy"],
    status: "completed"
  },
  {
    name: "Health & Fitness Expo",
    organizer: "FitLife Events",
    location: "Phoenix, AZ",
    date: new Date("2025-11-08T09:00:00"),
    description: "Discover the latest in health, fitness, and nutrition. Free health screenings and workout demos.",
    capacity: 600,
    registeredCount: 200,
    category: "Health",
    tags: ["health", "fitness", "nutrition", "wellness"],
    status: "upcoming"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Event.deleteMany({});
    console.log('🗑️  Cleared existing events');

    const inserted = await Event.insertMany(sampleEvents);
    console.log(`🎉 Successfully added ${inserted.length} events!`);

    mongoose.connection.close();
    console.log('👋 Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    mongoose.connection.close();
  }
};

seedDatabase();