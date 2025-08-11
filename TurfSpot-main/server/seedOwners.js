import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Owner from './models/owner.model.js';
import * as argon2 from 'argon2';

dotenv.config();

async function seedOwners() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // Sample owners (these would be created after admin approves their requests)
        const owners = [
            {
                name: "Mike Wilson",
                email: "mike.wilson@gmail.com",
                password: "owner123",
                phone: "9876543212",
                role: "owner"
            },
            {
                name: "Alex Turner",
                email: "alex.turner@gmail.com",
                password: "owner123",
                phone: "9876543213",
                role: "owner"
            }
        ];
        
        // Create owners
        for (const ownerData of owners) {
            const existing = await Owner.findOne({ email: ownerData.email });
            if (!existing) {
                const hashedPassword = await argon2.hash(ownerData.password);
                const owner = new Owner({
                    ...ownerData,
                    password: hashedPassword
                });
                await owner.save();
                console.log(`Created owner: ${ownerData.name} (${ownerData.email})`);
                console.log(`  Password: ${ownerData.password}`);
            } else {
                console.log(`Owner ${ownerData.email} already exists`);
            }
        }
        
        // Show all owners
        const allOwners = await Owner.find({}, { password: 0 });
        console.log(`\nTotal owners/admins: ${allOwners.length}`);
        allOwners.forEach(owner => {
            console.log(`- ${owner.name} (${owner.email}) - Role: ${owner.role}`);
        });
        
        // Close connection
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    } catch (error) {
        console.error('Error:', error);
        await mongoose.connection.close();
    }
}

seedOwners();
