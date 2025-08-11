import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Turf from './models/turf.model.js';
import Owner from './models/owner.model.js';

dotenv.config();

async function seedTurfs() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // Find owners to assign turfs to
        const owners = await Owner.find({ role: 'owner' });
        const admin = await Owner.findOne({ role: 'admin' });
        
        if (owners.length === 0 && !admin) {
            console.log('No owners found! Please create owners first.');
            await mongoose.connection.close();
            return;
        }
        
        // Sample turfs data
        const sampleTurfs = [
            {
                name: "Champions Arena",
                description: "Premium football turf with FIFA-approved synthetic grass. Features floodlights for night games and changing rooms.",
                location: "Koramangala, Bangalore",
                image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800",
                sportTypes: ["Football", "5-a-side"],
                pricePerHour: 1500,
                openTime: "06:00",
                closeTime: "23:00",
                owner: owners[0]?._id || admin._id
            },
            {
                name: "Sports Hub Complex",
                description: "Multi-sport facility with separate turfs for football, cricket, and badminton. Professional coaching available.",
                location: "Whitefield, Bangalore",
                image: "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800",
                sportTypes: ["Football", "Cricket", "Badminton"],
                pricePerHour: 2000,
                openTime: "05:00",
                closeTime: "22:00",
                owner: owners[0]?._id || admin._id
            },
            {
                name: "Green Field Stadium",
                description: "International standard cricket turf with practice nets. Perfect for tournaments and corporate events.",
                location: "HSR Layout, Bangalore",
                image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
                sportTypes: ["Cricket"],
                pricePerHour: 2500,
                openTime: "06:00",
                closeTime: "21:00",
                owner: owners[1]?._id || admin._id
            },
            {
                name: "Elite Sports Arena",
                description: "State-of-the-art facility with climate control. Ideal for badminton and indoor sports.",
                location: "Indiranagar, Bangalore",
                image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800",
                sportTypes: ["Badminton", "Table Tennis"],
                pricePerHour: 800,
                openTime: "06:00",
                closeTime: "22:00",
                owner: owners[1]?._id || admin._id
            },
            {
                name: "Victory Grounds",
                description: "Spacious football ground with natural grass. Perfect for weekend matches and tournaments.",
                location: "Marathahalli, Bangalore",
                image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800",
                sportTypes: ["Football", "7-a-side"],
                pricePerHour: 1200,
                openTime: "07:00",
                closeTime: "20:00",
                owner: admin._id
            }
        ];
        
        // Check existing turfs
        const existingCount = await Turf.countDocuments();
        console.log(`Found ${existingCount} existing turfs`);
        
        // Insert turfs
        for (const turfData of sampleTurfs) {
            const existing = await Turf.findOne({ name: turfData.name });
            if (!existing) {
                const turf = await Turf.create(turfData);
                const ownerInfo = await Owner.findById(turf.owner, { name: 1, email: 1 });
                console.log(`Created turf: ${turf.name} at ${turf.location}`);
                console.log(`  Owner: ${ownerInfo.name} (${ownerInfo.email})`);
                console.log(`  Sports: ${turf.sportTypes.join(', ')}`);
                console.log(`  Price: ₹${turf.pricePerHour}/hour`);
            } else {
                console.log(`Turf "${turfData.name}" already exists`);
            }
        }
        
        // Show total turfs
        const totalTurfs = await Turf.countDocuments();
        console.log(`\nTotal turfs in database: ${totalTurfs}`);
        
        // Close connection
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    } catch (error) {
        console.error('Error:', error);
        await mongoose.connection.close();
    }
}

seedTurfs();
