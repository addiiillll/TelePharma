const mongoose = require('mongoose');
const Device = require('./src/models/Device');
require('dotenv').config();

const samplePharmacies = [
  {
    deviceId: 'PHARM001',
    pharmacyName: 'Central Pharmacy',
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '123 Main St, New York, NY 10001'
    },
    isActive: true
  },
  {
    deviceId: 'PHARM002',
    pharmacyName: 'Downtown Medical Center',
    location: {
      latitude: 40.7505,
      longitude: -73.9934,
      address: '456 Broadway, New York, NY 10013'
    },
    isActive: true
  },
  {
    deviceId: 'PHARM003',
    pharmacyName: 'Uptown Health Pharmacy',
    location: {
      latitude: 40.7831,
      longitude: -73.9712,
      address: '789 Park Ave, New York, NY 10021'
    },
    isActive: false
  },
  {
    deviceId: 'PHARM004',
    pharmacyName: 'Brooklyn Care Pharmacy',
    location: {
      latitude: 40.6892,
      longitude: -73.9442,
      address: '321 Atlantic Ave, Brooklyn, NY 11201'
    },
    isActive: true
  }
];

async function seedPharmacies() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telemedicine');
    
    // Clear existing devices
    await Device.deleteMany({});
    
    // Insert sample pharmacies
    await Device.insertMany(samplePharmacies);
    
    console.log('Sample pharmacies seeded successfully!');
    console.log(`Added ${samplePharmacies.length} pharmacies with coordinates`);
    
  } catch (error) {
    console.error('Error seeding pharmacies:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedPharmacies();