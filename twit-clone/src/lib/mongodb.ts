// import mongoose from "mongoose";
//
// let isConnected = false;
//
// export const connectToDB = async () => {
//     if (isConnected) return;
//
//     try {
//         await mongoose.connect(process.env.MONGODB_URI!, {
//             dbName: "pizdjuk", // имя твоей БД
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//
//         isConnected = true;
//         console.log("✅ MongoDB connected");
//     } catch (error) {
//         console.error("❌ MongoDB connection error:", error);
//         throw new Error("Failed to connect to MongoDB");
//     }
// };

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = {conn: null, promise: null};
}

export async function connectToDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        console.log('⛳ MONGODB_URI:', process.env.MONGODB_URI);
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: 'pizdjuk',
            bufferCommands: false,
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

// import mongoose from 'mongoose';
//
// export async function connectToDB() {
//     try{
//         if (mongoose.connection.readyState === 1) {
//             return;
//         }
//
//         await mongoose.connect(process.env.MONGODB_URI as string, {
//             dbName: 'Pokabu',                       //todo check db Name
//         });
//         console.log("✅ Connected to MongoDB Atlas");
//     } catch (error) {
//         console.error("❌ MongoDB connection error:", error);
//         throw error;
//     }
// }