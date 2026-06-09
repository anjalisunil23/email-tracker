import mongoose from 'mongoose';

mongoose.set('strictQuery', false);
import { MongoMemoryServer } from 'mongodb-memory-server';
import config from './index';

const connectDB = async () => {
  try {
    let uri = config.mongoURI;

    if (process.env.USE_MEMORY_DB === 'true') {
      const memoryServer = await MongoMemoryServer.create();
      uri = memoryServer.getUri();
      console.log('Using in-memory MongoDB for local development');
    }

    await mongoose.connect(uri!);
    console.log('MongoDB connected');
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
