import { connectToDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { Tweet } from "@/models/tweet";

// export async function GET(req: Request, context: { params: { id: string } }) {
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params; // ждем Promise
        const id = params.id;
        //const { id } = context.params;
        console.log("🧩 Параметр id из URL:", id);

        await connectToDB();

        // Ищем твит по _id (ObjectId)
        const tweet = await Tweet.findById(id);

        if (!tweet) {
            return NextResponse.json({ message: "Tweet not found" }, { status: 404 });
        }

        // Преобразуем объект mongoose в простой JS-объект и добавляем поле id
        const normalizedTweet = {
            ...tweet.toObject(),
            id: tweet._id.toString(),
            _id: undefined,
        };

        return NextResponse.json(normalizedTweet);
    } catch (error) {
        console.error("❌ Ошибка сервера:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// import { connectToDB } from "@/lib/mongodb";
// import { NextResponse } from "next/server";
// import { Tweet } from "@/models/tweet";
//
// export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
//     try {
//         const params = await context.params;  // обязательно await!
//         const id = params.id;
//         console.log("🧩 Параметр id из URL:", id);
//
//         await connectToDB();
//
//         const tweet = await Tweet.findOne({ $or: [{ _id: id }, { id }] });
//         //const tweet = await Tweet.findOne({ _id: id });
//         // const tweet = await Tweet.findById(id);
//
//         if (!tweet) {
//             return NextResponse.json({ message: "Tweet not found" }, { status: 404 });
//         }
//
//         return NextResponse.json(tweet);
//     } catch (error) {
//         console.error("❌ Ошибка сервера:", error);
//         return NextResponse.json({ message: "Server error" }, { status: 500 });
//     }
// }




















// import { connectToDB } from "@/lib/mongodb";
// import { Tweet } from "@/models/tweet";
// import { NextResponse } from "next/server";
//
// export async function GET(
//     req: Request,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         const id = params.id;
//
//         await connectToDB();
//
//         // Используем findOne для поддержки UUID (строк)
//         const tweet = await Tweet.findOne({ _id: id });
//
//         if (!tweet) {
//             return NextResponse.json({ message: "Tweet not found" }, { status: 404 });
//         }
//
//         return NextResponse.json(tweet, { status: 200 });
//     } catch (error) {
//         console.error("❌ Failed to fetch tweet:", error);
//         return NextResponse.json({ message: "Failed to fetch tweet" }, { status: 500 });
//     }
// }

// import {connectToDB} from "@/lib/mongodb";
// import {Tweet} from "@/models/tweet";
// import {NextResponse} from "next/server";
// import {use} from "react";
//
//
// export async function GET(req: Request, {params}: {params: {id: string}}){
//
//
//     try {
//         const id  = params.id;
//
//         await connectToDB();
//         const tweet = await Tweet.findById(id);
//
//         if (!tweet) {
//             return NextResponse.json({message: 'Tweet not found'}, {status: 404})
//         }
//         return NextResponse.json(tweet, {status: 200})
//     } catch (error) {
//         console.error("❌ Failed to fetch tweet:", error);
//         return NextResponse.json({message: 'Failed to fetch tweet'}, {status: 500})
//     }
// }