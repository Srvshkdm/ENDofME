import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import Owner from './models/owner.model.js';

dotenv.config();

async function checkDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // Check for users
        const userCount = await User.countDocuments();
        console.log(`Total users in database: ${userCount}`);
        
        // List all users (without passwords)
        const users = await User.find({}, { password: 0 });
        console.log('\nUsers in database:');
        users.forEach(user => {
            console.log(`- ${user.name} (${user.email}) - ID: ${user._id}`);
        });
        
        // Check for owners/admins
        const ownerCount = await Owner.countDocuments();
        console.log(`\nTotal owners/admins in database: ${ownerCount}`);
        
        // List all owners/admins (without passwords)
        const owners = await Owner.find({}, { password: 0 });
        console.log('\nOwners/Admins in database:');
        owners.forEach(owner => {
            console.log(`- ${owner.name} (${owner.email}) - Role: ${owner.role} - ID: ${owner._id}`);
        });
        
        // Close connection
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    } catch (error) {
        console.error('Error:', error);
    }
}

checkDatabase();
