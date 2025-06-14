import {connectToDB} from "@/lib/mongodb";
import {Tweet} from "@/models/tweet";
import {NextResponse} from "next/server";


export async function GET(req: Request, {params}: {params: {id: string}}){
    try {
        await connectToDB();
        const tweet = await Tweet.findById(params.id)

        if (!tweet) {
            return NextResponse.json({message: 'Tweet not found'}, {status: 404})
        }
        return NextResponse.json(tweet, {status: 200})
    } catch (error) {
        return NextResponse.json({message: 'Failed to fetch tweet'}, {status: 500})
    }
}