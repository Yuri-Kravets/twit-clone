import {connectToDB} from "@/lib/mongodb";
import {NextResponse} from "next/server";
import {Tweet} from "@/models/tweet";

export async function PATCH(req: Request, {params}: {params: {id: string}}) {
    console.log("🔥 PATCH роут вызван");
    try {
        const body = await req.json();
        const {type} = body;

        console.log("👉 PATCH вызван для твита с ID:", params.id);
        console.log("📦 Тип реакции:", type);

        await connectToDB();
        console.log("✅ Подключение к базе установлено");

        const update = type === 'like'
            ? {$inc: {'reactions.likes': 1}}
            : {$inc: {'reactions.dislikes': 1}};

        console.log("🔧 Обновление, которое будет применено:", update);

        const tweet = await Tweet.findByIdAndUpdate(params.id, update, {new: true});

        if (!tweet) {
            console.log("❌ Твит не найден в базе");
            return NextResponse.json({message: 'Tweet not found'}, {status: 404});
        }

        console.log("✅ Твит успешно обновлён:", tweet);
        return NextResponse.json(tweet, {status: 200});

    } catch (error) {
        console.error("🔥 Ошибка при обновлении твита:", error);
        return NextResponse.json({message: 'Failed to update reactions'}, {status: 500});
    }
}

// import {connectToDB} from "@/lib/mongodb";
// import {NextResponse} from "next/server";
// import {Tweet} from "@/models/tweet";
//
//
// export async function PATCH(req: Request, {params}: {params: {id: string}}) {
//     try {
//         const {type} = await req.json();
//         await connectToDB();
//
//         const update = type === 'like' ? {$inc: {'reactions.likes' : 1}} : {$inc: {'reactions.dislikes' : 1}}
//
//         const tweet = await Tweet.findByIdAndUpdate(params.id, update, {new: true})
//
//         if (!tweet) {
//             return NextResponse.json({message: 'Tweet not found'}, {status: 404})
//         }
//         return NextResponse.json(tweet, { status: 200 })
//     } catch (error) {
//         return NextResponse.json({message: 'Failed to update reactions' }, {status: 500})
//     }
//
//     //return NextResponse.json(tweet, {status: 200})
// }