
import mongoose, { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const TweetSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4, // автоматическая генерация UUID
    },
    title: {
        type: String,
        required: true,
        maxlength: 100,
    },
    body: {
        type: String,
        required: true,
        maxlength: 280,
    },
    userId: {
        type: Number,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    reactions: {
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Tweet = models.Tweet || model('Tweet', TweetSchema);
// const TweetSchema = new Schema({
//     title: {
//         type: String,
//         required: true,
//         maxlength: 100,
//     },
//     body: {
//         type: String,
//         required: true,
//         maxlength: 280,
//     },
//     userId: {
//         type: Number,
//         required: true,
//     },
//     tags: {
//         type: [String],
//         default: [],
//     },
//     reactions: {
//         likes: { type: Number, default: 0 },
//         dislikes: { type: Number, default: 0 },
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });
//
// export const Tweet = models.Tweet || model('Tweet', TweetSchema);

// import mongoose from 'mongoose';
//
// const TweetSchema = new mongoose.Schema({
//     content: {type: String, required: true, maxLength: 280},
//     createdAt: {type: Date, default: Date.now}
// });
//
// export const Tweet = mongoose.models.Tweet || mongoose.model('Tweet', TweetSchema);