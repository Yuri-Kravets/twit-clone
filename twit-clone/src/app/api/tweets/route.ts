import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Tweet } from "@/models/tweet";
import { connectToDB } from "@/lib/mongodb";


export async function POST(req: Request) {
    try {
        console.log("🟢 Начинаем подключение к базе данных...");
        await connectToDB();
        console.log("✅ Подключение к базе прошло успешно");

        const body = await req.json();
        console.log("Incoming tweet data:", body);

        console.log("⏳ Пытаемся создать твит в базе...");
        const tweet = await Tweet.create(body);
        console.log("Saved tweet:", tweet);

        return NextResponse.json({ message: "Tweet saved", tweet }, { status: 201 });
    } catch (error) {
        console.error("❌ Failed to save tweet:", error);

        if (error instanceof mongoose.Error.ValidationError) {
            console.error("📛 Validation error details:", error.errors);
        }

        return NextResponse.json(
            {
                message: "Failed to save tweet",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
export async function GET(req: Request) {
    try {
        await connectToDB();

        const tweets = await Tweet.find().sort({ createdAt: -1 });

        const normalizedTweets = tweets.map(tweet => ({
            ...tweet.toObject(),
            id: tweet._id.toString(),
            _id: undefined,
        }));

        return NextResponse.json(normalizedTweets, { status: 200 });
    } catch (error) {
        console.error("❌ Failed to fetch tweets:", error);
        return NextResponse.json({ message: "Failed to fetch tweets" }, { status: 500 });
    }
}
// export async function GET(req: Request) {
//     try {
//         await connectToDB();
//
//         const tweets = await Tweet.find().sort({ createdAt: -1 });
//         return NextResponse.json(tweets, { status: 200 });
//     } catch (error) {
//         console.error("❌ Failed to fetch tweets:", error);
//         return NextResponse.json({ message: "Failed to fetch tweets" }, { status: 500 });
//     }
//}


//
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import { Tweet } from "@/models/tweet";
// import { connectToDB } from "@/lib/mongodb";
//
//
// export async function POST(req: Request) {
//     try {
//         console.log("🟢 Начинаем подключение к базе данных...");
//         await connectToDB(); // подключение к MongoDB
//         console.log("✅ Подключение к базе прошло успешно");
//
//         const body = await req.json();
//         console.log("Incoming tweet data:", body);
//
//
//
//         console.log("⏳ Пытаемся создать твит в базе...");
//         const tweet = await Tweet.create(body);
//         console.log("Saved tweet:", tweet);
//
//         return NextResponse.json({ message: "Tweet saved", tweet }, { status: 201 });
//     } catch (error) {
//         console.error("❌ Failed to save tweet:", error);
//
//         if (error instanceof mongoose.Error.ValidationError) {
//             console.error("📛 Validation error details:", error.errors);
//         }
//
//         return NextResponse.json(
//             { message: "Failed to save tweet", error: error instanceof Error ? error.message : error },
//             { status: 500 }
//         );
//     }
// }
//
// export async function GET(req: Request) {
//     try {
//         await connectToDB();
//
//         const tweets = await Tweet.find().sort({createdAt: -1});
//         return NextResponse.json(tweets, { status: 200 })
//     } catch (error) {
//         return NextResponse.json({message: 'Failed to fetch tweets'}, {status: 500})
//     }
// }


// import {NextResponse} from "next/server";
// import {connectToDB} from "@/lib/mongodb";
// import {Tweet} from '@/models/tweet';
//
// export async function POST(req: Request) {
// try {
//     const tweetData = await req.json();
//     if (!tweetData.title || !tweetData.body) {
//         return NextResponse.json({error: 'Title and body are required'}, {status: 400});
//     }
//
//     await connectToDB();
//     const newTweet = await Tweet.create(tweetData);
//
//     return NextResponse.json({tweet: newTweet}, {status: 201});
// } catch(err) {
//     console.error("Error creating tweet", err);
//     return NextResponse.json({error: 'Server error'}, {status: 500});
//     }
// }


// export async function GET() {
//     const tweets = [
//         { id: 1, user: "JohnDoe", content: "Hello Next.js!", timestamp: "2m ago" },
//         { id: 2, user: "JaneDoe", content: "Loving React & Next.js!", timestamp: "10m ago" },
//         { id: 3, user: "DevGuy", content: "Just deployed my app to Vercel ", timestamp: "15m ago" },
//         { id: 4, user: "CodeQueen", content: "TailwindCSS makes styling easy!", timestamp: "30m ago" },
//         { id: 5, user: "UXMaster", content: "Dark mode is a must!", timestamp: "1h ago" },
//         { id: 6, user: "TypeSafe", content: "TypeScript saved my project again!", timestamp: "2h ago" },
//         { id: 7, user: "NodeNinja", content: "Backend devs unite! ", timestamp: "2h ago" },
//         { id: 8, user: "FullStacker", content: "API routes in Next.js are ", timestamp: "3h ago" },
//         { id: 9, user: "DesignDiva", content: "Minimal UI is the future.", timestamp: "5h ago" },
//         { id: 10, user: "ReactFan", content: "useEffect vs useLayoutEffect?", timestamp: "6h ago" },
//         { id: 11, user: "TestyMcTest", content: "Writing unit tests is satisfying.", timestamp: "7h ago" },
//         { id: 12, user: "HotReload", content: "Hot reload not working... again ", timestamp: "8h ago" },
//         { id: 13, user: "JSWizard", content: "Closures in JavaScript still confuse people.", timestamp: "10h ago" },
//         { id: 14, user: "AsyncAwait", content: "Async/await > .then()", timestamp: "11h ago" },
//         { id: 15, user: "OpenSourceFan", content: "Just contributed to an open source project!", timestamp: "12h ago" },
//         { id: 16, user: "NextLevelDev", content: "App Router is game-changing!", timestamp: "14h ago" },
//         { id: 17, user: "CSSPro", content: "Grid vs Flexbox — depends on the layout!", timestamp: "16h ago" },
//         { id: 18, user: "PromptGuru", content: "AI tools can speed up your workflow!", timestamp: "18h ago" },
//         { id: 19, user: "BuildWeek", content: "Weekend hackathon incoming!", timestamp: "20h ago" },
//         { id: 20, user: "DeployGuy", content: "CI/CD pipelines are essential!", timestamp: "22h ago" },
//     ];
//
//     return new Response(JSON.stringify(tweets), { status: 200 });
// }