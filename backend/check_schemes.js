import mongoose from 'mongoose';
import Scheme from './models/scheme.js';

const MONGO_URI = 'mongodb+srv://devanshkrishana5_db_user:p1BwC6InizFDcWpB@cluster0.3oqvdai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function checkSchemes() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const count = await Scheme.countDocuments();
    console.log('📊 Total schemes in database:', count);

    if (count > 0) {
      const schemes = await Scheme.find().limit(5);
      console.log('📋 Sample schemes:');
      schemes.forEach(scheme => {
        console.log('  -', scheme._id, ':', scheme.name);
      });
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkSchemes();
