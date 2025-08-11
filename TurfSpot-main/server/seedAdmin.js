import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Owner from './models/owner.model.js';
import * as argon2 from 'argon2';

dotenv.config();

async function seedAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // Check if admin already exists
        const existingAdmin = await Owner.findOne({ email: 'admin@gmail.com' });
        if (existingAdmin) {
            console.log('Admin already exists!');
            await mongoose.connection.close();
            return;
        }
        
        // Hash the password
        const hashedPassword = await argon2.hash('rijo.com');
        
        // Create admin user
        const admin = new Owner({
            name: 'Admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            phone: '1234567890',
            role: 'admin'
        });
        
        await admin.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@gmail.com');
        console.log('Password: rijo.com');
        
        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error:', error);
        await mongoose.connection.close();
    }
}

seedAdmin();
