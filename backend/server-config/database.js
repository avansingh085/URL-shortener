import mongoose from 'mongoose';

const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/tinylinkdb';

 const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Connected to MongoDB successfully');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export default connectToDatabase;