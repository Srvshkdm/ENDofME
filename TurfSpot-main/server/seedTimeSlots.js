import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TimeSlot from './models/timeSlot.model.js';
import Turf from './models/turf.model.js';
import { addDays, setHours, setMinutes, format } from 'date-fns';

dotenv.config();

async function seedTimeSlots() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // Get all turfs
        const turfs = await Turf.find();
        console.log(`Found ${turfs.length} turfs`);
        
        // Generate time slots for the next 30 days
        const today = new Date();
        const daysToGenerate = 30;
        
        for (const turf of turfs) {
            console.log(`\nGenerating time slots for: ${turf.name}`);
            
            // Parse open and close times
            const [openHour, openMinute] = turf.openTime.split(':').map(Number);
            const [closeHour, closeMinute] = turf.closeTime.split(':').map(Number);
            
            let slotsCreated = 0;
            
            // Generate slots for each day
            for (let dayOffset = 0; dayOffset < daysToGenerate; dayOffset++) {
                const currentDate = addDays(today, dayOffset);
                
                // Generate hourly slots from open to close time
                for (let hour = openHour; hour < closeHour; hour++) {
                    const startTime = setMinutes(setHours(currentDate, hour), 0);
                    const endTime = setMinutes(setHours(currentDate, hour + 1), 0);
                    
                    // Check if slot already exists
                    const existingSlot = await TimeSlot.findOne({
                        turf: turf._id,
                        startTime: startTime,
                        endTime: endTime
                    });
                    
                    if (!existingSlot) {
                        await TimeSlot.create({
                            turf: turf._id,
                            startTime: startTime,
                            endTime: endTime
                        });
                        slotsCreated++;
                    }
                }
            }
            
            console.log(`Created ${slotsCreated} time slots for ${turf.name}`);
        }
        
        // Show total time slots
        const totalSlots = await TimeSlot.countDocuments();
        console.log(`\nTotal time slots in database: ${totalSlots}`);
        
        // Close connection
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    } catch (error) {
        console.error('Error:', error);
        await mongoose.connection.close();
    }
}

seedTimeSlots();
