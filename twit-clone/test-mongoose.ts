import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

require('dotenv').config({ path: '.env.local' });
dotenv.config(); // Загружаем переменные окружения из .env
console.log('MONGODB_URI:', process.env.MONGODB_URI);

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('Connected to DB');
        process.exit(0);
    } catch (e) {
        console.error('Error connecting to DB:', e);
        process.exit(1);
    }
}
console.log('TEST_VAR:', process.env.TEST_VAR);
test();