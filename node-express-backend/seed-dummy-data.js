const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Doctor = require('./src/models/Doctor');
const Device = require('./src/models/Device');
const Session = require('./src/models/Session');
const Admin = require('./src/models/Admin');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telemedicine');

const seedDummyData = async () => {
  try {
    console.log('🌱 Seeding dummy data...');

    // Clear existing data
    await Doctor.deleteMany({});
    await Device.deleteMany({});
    await Session.deleteMany({});
    
    // Create dummy doctors
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
      },
      {
        name: 'Dr. Lisa Thompson',
        email: 'lisa.thompson@telepharma.com',
        password: await bcrypt.hash('doctor123', 10),
        specialization: 'Internal Medicine',
        isAvailable: false,
        isOnline: false
      }
    ];

    const createdDoctors = await Doctor.insertMany(doctors);
    console.log(`✅ Created ${createdDoctors.length} doctors`);

    // Create dummy pharmacy devices
    const devices = [
      {
        deviceId: 'PH:A1:B2:C3:D4:E5',
        pharmacyName: 'HealthPlus Pharmacy',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: '123 Main St, New York, NY 10001'
        },
        isActive: true,
        apiKey: require('crypto').randomBytes(32).toString('hex')
      },
      {
        deviceId: 'PH:F6:G7:H8:I9:J0',
        pharmacyName: 'MediCare Central',
        location: {
          latitude: 34.0522,
          longitude: -118.2437,
          address: '456 Oak Ave, Los Angeles, CA 90210'
        },
        isActive: true,
        apiKey: require('crypto').randomBytes(32).toString('hex')
      },
      {
        deviceId: 'PH:K1:L2:M3:N4:O5',
        pharmacyName: 'QuickMeds Pharmacy',
        location: {
          latitude: 41.8781,
          longitude: -87.6298,
          address: '789 Pine St, Chicago, IL 60601'
        },
        isActive: true,
        apiKey: require('crypto').randomBytes(32).toString('hex')
      },
      {
        deviceId: 'PH:P6:Q7:R8:S9:T0',
        pharmacyName: 'Family Drug Store',
        location: {
          latitude: 29.7604,
          longitude: -95.3698,
          address: '321 Elm St, Houston, TX 77001'
        },
        isActive: false,
        apiKey: require('crypto').randomBytes(32).toString('hex')
      },
      {
        deviceId: 'PH:U1:V2:W3:X4:Y5',
        pharmacyName: 'Downtown Pharmacy',
        location: {
          latitude: 39.9526,
          longitude: -75.1652,
          address: '654 Maple Ave, Philadelphia, PA 19101'
        },
        isActive: true,
        apiKey: require('crypto').randomBytes(32).toString('hex')
      }
    ];

    const createdDevices = await Device.insertMany(devices);
    console.log(`✅ Created ${createdDevices.length} pharmacy devices`);

    // Create dummy sessions
    const sessions = [
      {
        sessionId: require('uuid').v4(),
        deviceId: createdDevices[0].deviceId,
        doctorId: createdDoctors[0]._id,
        status: 'active',
        firebaseRoomId: `session_${Date.now()}_1`,
        startTime: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      },
      {
        sessionId: require('uuid').v4(),
        deviceId: createdDevices[1].deviceId,
        doctorId: createdDoctors[1]._id,
        status: 'waiting',
        firebaseRoomId: `session_${Date.now()}_2`,
        startTime: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
      },
      {
        sessionId: require('uuid').v4(),
        deviceId: createdDevices[2].deviceId,
        doctorId: createdDoctors[0]._id,
        status: 'completed',
        firebaseRoomId: `session_${Date.now()}_3`,
        startTime: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        endTime: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
      },
      {
        sessionId: require('uuid').v4(),
        deviceId: createdDevices[0].deviceId,
        doctorId: createdDoctors[2]._id,
        status: 'completed',
        firebaseRoomId: `session_${Date.now()}_4`,
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        endTime: new Date(Date.now() - 90 * 60 * 1000) // 1.5 hours ago
      },
      {
        sessionId: require('uuid').v4(),
        deviceId: createdDevices[1].deviceId,
        doctorId: null,
        status: 'waiting',
        firebaseRoomId: `session_${Date.now()}_5`,
        startTime: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
      }
    ];

    const createdSessions = await Session.insertMany(sessions);
    console.log(`✅ Created ${createdSessions.length} sessions`);

    console.log('\n🎉 Dummy data seeded successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • ${createdDoctors.length} doctors created`);
    console.log(`   • ${createdDevices.length} pharmacy devices created`);
    console.log(`   • ${createdSessions.length} sessions created`);
    
    console.log('\n👨‍⚕️ Doctor Login Credentials:');
    doctors.forEach(doctor => {
      console.log(`   • ${doctor.email} / doctor123`);
    });

    console.log('\n🏥 Pharmacy Device API Keys:');
    createdDevices.forEach(device => {
      console.log(`   • ${device.pharmacyName}: ${device.apiKey}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedDummyData();