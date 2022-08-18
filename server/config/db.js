import mongoose from 'mongoose';
import { ServerApiVersion } from 'mongodb';
import log from 'log-beautify';

const connectDB = async (url) => {
  try {
    log.info('MongoDB try to connect....');
    const conn = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
    log.ok(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    log.error(`MongoDB ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
