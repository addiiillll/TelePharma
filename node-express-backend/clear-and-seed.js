const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Doctor = require('./src/models/Doctor');
const Device = require('./src/models/Device');
const Session = require('./src/models/Session');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telemedicine');

const clearAndSeed = async () => {
  try {
    console.log('🧹 Clearing database...');

    // Clear all collections
    await Doctor.deleteMany({});
    await Device.deleteMany({});
    await Session.deleteMany({});
    
    console.log('✅ Database cleared');

    console.log('🌱 Seeding fresh data...');

    // Create doctors
    const doctors = [
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@telepharma.com',
        password: await bcrypt.hash('doctor123', 10),
        specialization: 'General Medicine',
        isAvailable: true,
        isOnline: true
      },
      {
        name: 'Dr. Michael Chen',
        email: 'michael.chen@telepharma.com', 
        password: await bcrypt.hash('doctor123', 10),
        specialization: 'Cardiology',
        isAvailable: true,
        isOnline: true
      },
      {
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@telepharma.com',
        password: await bcrypt.hash('doctor123', 10),
        specialization: 'Pediatrics',
        isAvailable: false,
        isOnline: true
      },
      {
        name: 'Dr. James Wilson',
        email: 'james.wilson@telepharma.com',
        password: await bcrypt.hash('doctor123', 10),
        specialization: 'Dermatology',
        isAvailable: true,
        isOnline: false
      }
    ];

    const createdDoctors = await Doctor.insertMany(doctors);
    console.log(`✅ Created ${createdDoctors.length} doctors`);

    console.log('\n🎉 Fresh database ready!');
    console.log('\n👨‍⚕️ Doctor Login Credentials:');
    doctors.forEach(doctor => {
      console.log(`   • ${doctor.email} / doctor123`);
    });
    
    console.log('\n👨‍💼 Admin Login:');
    console.log('   • admin@telepharma.com / admin123');

    console.log('\n📝 Next Steps:');
    console.log('   1. Register pharmacy devices via /pharmacy');
    console.log('   2. Login doctors via /login');
    console.log('   3. Start sessions from device interfaces');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

clearAndSeed();