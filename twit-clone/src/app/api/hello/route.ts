import { NextResponse, NextRequest } from "next/server";
import {connectToDB} from "@/lib/mongodb";
import {Tweet} from "@/models/tweet";

/**
 * @param {NextRequest} request
 */
export async function POST(request: Request) {
    const body = await request.json();
    console.log('User input: ', body.text);

    return NextResponse.json({message: 'Received: ' + body.text });
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    try {
        await connectToDB()
        const query = userId ? {userId} : {}
        const tweets = await Tweet.find(query).sort({createdAt: -1})
        return NextResponse.json(tweets, {status: 200})
    } catch (error) {
        return NextResponse.json({message: 'Failed to fetch tweets'}, {status: 500})
    }
}