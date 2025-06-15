import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const TweetSchema = new mongoose.Schema(
    {
        _id: {
            type: String, // UUID вместо ObjectId
            default: () => uuidv4(), // будет генерироваться при создании
        },
        title: { type: String, required: true },
        body: { type: String, required: true },
        tags: [String],
        userId: Number,
        reactions: {
            likes: { type: Number, default: 0 },
            dislikes: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

export const Tweet = mongoose.models.Tweet || mongoose.model("Tweet", TweetSchema);


// import mongoose, { Schema } from 'mongoose';
//
// const TweetSchema = new Schema({
//     _id: {
//         type: String, // UUID вместо ObjectId
//         required: true,
//     },
//     text: {
//         type: String,
//         required: true,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });
//
// const Tweet = mongoose.models.Tweet || mongoose.model('Tweet', TweetSchema);
//
// export default Tweet;





// import mongoose, { model, models, Schema } from "mongoose";
//
//
// const TweetSchema = new Schema({
//
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