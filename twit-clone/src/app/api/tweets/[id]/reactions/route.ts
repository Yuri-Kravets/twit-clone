import {connectToDB} from "@/lib/mongodb";
import {NextResponse} from "next/server";
import {Tweet} from "@/models/tweet";


export async function PATCH(req: Request, {params}: {params: {id: string}}) {
    try {
        const {type} = await req.json();
        await connectToDB();

        const update = type === 'like' ? {$inc: {'reactions.likes' : 1}} : {$inc: {'reactions.dislikes' : 1}}

        const tweet = await Tweet.findByIdAndUpdate(params.id, update, {new: true})

        if (!tweet) {
            return NextResponse.json({message: 'Tweet not found'}, {status: 404})
        }
        return NextResponse.json(tweet, { status: 200 })
    } catch (error) {
        return NextResponse.json({message: 'Failed to update reactions' }, {status: 500})
    }

    //return NextResponse.json(tweet, {status: 200})
}