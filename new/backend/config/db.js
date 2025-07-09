const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb+srv://user:TxHeTiXPMHdmAxBp@cluster0.tmfdszp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    
    if (!mongoURI) {
      console.error('MONGODB_URI is not defined in environment variables');
      return false;
    }

    console.log('Attempting to connect to MongoDB...');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased timeout to 10s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    };

    await mongoose.connect(mongoURI, options);
    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Return true to indicate successful connection
    return true;

  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    
    // Provide helpful error messages
    if (err.code === 'EREFUSED') {
      console.error('💡 Network issue detected. Please check:');
      console.error('   - Internet connection');
      console.error('   - Firewall settings');
      console.error('   - MongoDB Atlas IP whitelist');
    } else if (err.code === 'ENOTFOUND') {
      console.error('💡 DNS resolution failed. Please check:');
      console.error('   - MongoDB URI is correct');
      console.error('   - Network connectivity');
    } else if (err.message.includes('buffering timed out')) {
      console.error('💡 Connection timeout. Please check:');
      console.error('   - MongoDB Atlas cluster status');
      console.error('   - Network latency');
      console.error('   - Firewall blocking port 27017');
    } else if (err.message.includes('Authentication failed')) {
      console.error('💡 Authentication failed. Please check:');
      console.error('   - Username and password in MongoDB URI');
      console.error('   - Database user permissions');
    }
    
    // Return false to indicate failed connection
    return false;
  }
};

module.exports = connectDB; 