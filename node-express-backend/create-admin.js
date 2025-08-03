const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telemedicine');
    
    const adminData = {
      email: 'admin@telemedicine.com',
      password: 'admin123'
    };

    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin already exists with email:', adminData.email);
      return;
    }

    const admin = new Admin(adminData);
    await admin.save();
    
    console.log('Admin created successfully!');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();