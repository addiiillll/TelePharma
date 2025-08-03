const mongoose = require('mongoose');
const Doctor = require('./src/models/Doctor');
require('dotenv').config();

const doctors = [
  {
    name: 'John Smith',
    email: 'john@doctor.com',
    password: 'password123',
    specialization: 'General Medicine'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@doctor.com', 
    password: 'password123',
    specialization: 'Pediatrics'
  },
  {
    name: 'Michael Brown',
    email: 'michael@doctor.com',
    password: 'password123', 
    specialization: 'Cardiology'
  }
];

async function seedDoctors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telemedicine');
    
    await Doctor.deleteMany({});
    await Doctor.insertMany(doctors);
    
    console.log('✅ Doctors seeded successfully');
    console.log('Test credentials:');
    doctors.forEach(doc => {
      console.log(`- ${doc.email} / password123`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
    process.exit(1);
  }
}

seedDoctors();