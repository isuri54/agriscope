const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Officer = require('./models/Officer');
require('dotenv').config();

const seedUsers = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const users = [
    {
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      fullName: 'System Administrator',
      role: 'admin',
    },
    {
      username: 'officer1',
      password: await bcrypt.hash('officer@2025', 10),
      fullName: 'Kamal Perera',
      role: 'officer',
    },
    {
      username: 'officer2',
      password: await bcrypt.hash('officer@2025', 10),
      fullName: 'Nimali Silva',
      role: 'officer',
    },
  ];

  try {
    await Officer.deleteMany({});
    await Officer.insertMany(users);
    console.log('Users seeded successfully!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedUsers();