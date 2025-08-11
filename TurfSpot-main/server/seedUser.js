import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import * as argon2 from 'argon2';

dotenv.config();

async function seedUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: 'testuser@gmail.com' });
        if (existingUser) {
            console.log('Test user already exists!');
            await mongoose.connection.close();
            return;
        }
        
        // Hash the password
        const hashedPassword = await argon2.hash('testpassword');
        
        // Create test user
        const user = new User({
            name: 'Test User',
            email: 'testuser@gmail.com',
            password: hashedPassword
        });
        
        await user.save();
        console.log('Test user created successfully!');
        console.log('Email: testuser@gmail.com');
        console.log('Password: testpassword');
        
        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error:', error);
        await mongoose.connection.close();
    }
}

seedUser();
