import mongoose from 'mongoose';
import Scheme from './models/scheme.js';
import Application from './models/application.js';

const MONGO_URI = 'mongodb+srv://devanshkrishana5_db_user:p1BwC6InizFDcWpB@cluster0.3oqvdai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function debugApplications() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all schemes with their IDs
    const schemes = await Scheme.find({}, '_id name');
    console.log('📋 Available schemes in database:');
    schemes.forEach(scheme => {
      console.log(`  - ${scheme._id}: ${scheme.name}`);
    });

    // Get all applications with their schemeId references
    const applications = await Application.find({}, 'schemeId userId status');
    console.log(`\n📋 Applications in database (${applications.length}):`);

    for (const app of applications) {
      const scheme = schemes.find(s => s._id.toString() === app.schemeId.toString());
      console.log(`  - App ${app._id}: schemeId=${app.schemeId} (${scheme ? scheme.name : 'NOT FOUND'})`);
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugApplications();
