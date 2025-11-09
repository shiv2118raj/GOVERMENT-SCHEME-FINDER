import mongoose from 'mongoose';
import Application from './models/application.js';

const MONGO_URI = 'mongodb+srv://devanshkrishana5_db_user:p1BwC6InizFDcWpB@cluster0.3oqvdai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function checkApplications() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const count = await Application.countDocuments();
    console.log('📊 Total applications in database:', count);

    if (count > 0) {
      const apps = await Application.find().limit(5).populate('schemeId', 'name');
      console.log('📋 Recent applications:');
      apps.forEach(app => {
        console.log('  -', app._id, 'for scheme:', app.schemeId?.name || 'Unknown');
      });
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkApplications();
