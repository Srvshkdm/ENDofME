import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OwnerRequest from './models/ownerRequest.model.js';

dotenv.config();

async function seedOwnerRequests() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // Sample owner requests
        const ownerRequests = [
            {
                name: "John Smith",
                email: "john.smith@gmail.com",
                phone: "9876543210",
                status: "pending"
            },
            {
                name: "Sarah Johnson",
                email: "sarah.j@gmail.com",
                phone: "9876543211",
                status: "pending"
            },
            {
                name: "Mike Wilson",
                email: "mike.wilson@gmail.com",
                phone: "9876543212",
                status: "approved"
            }
        ];
        
        // Check if requests already exist
        for (const request of ownerRequests) {
            const existing = await OwnerRequest.findOne({ email: request.email });
            if (!existing) {
                await OwnerRequest.create(request);
                console.log(`Created owner request for ${request.name} - Status: ${request.status}`);
            } else {
                console.log(`Owner request for ${request.email} already exists`);
            }
        }
        
        // Show all owner requests
        const allRequests = await OwnerRequest.find();
        console.log(`\nTotal owner requests: ${allRequests.length}`);
        
        // Close connection
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    } catch (error) {
        console.error('Error:', error);
        await mongoose.connection.close();
    }
}

seedOwnerRequests();
