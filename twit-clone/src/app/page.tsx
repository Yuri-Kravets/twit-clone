"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AddTweetForm from "@/app/components/AddTweetForm";
import TrendingTopics from "@/app/components/TrendingTopics";
import { v4 as uuidv4 } from 'uuid';

interface Tweet {
    id: string;
    title: string;
    body: string;
    userId: number;
    tags: string[];
    reactions: {
        likes: number;
        dislikes: number;
    };
}

export default function Home() {
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllTweets = async () => {
            try {
                setLoading(true);

                // Получаем твиты из MongoDB
                const dbRes = await fetch("/api/tweets");
                const dbTweets = await dbRes.json();
                console.log("dbTweet sample:", dbTweets[0]);

                // Получаем твиты с внешнего API
                const serverRes = await fetch("https://dummyjson.com/posts");
                const serverData = await serverRes.json();

                // Нормализуем серверные твиты
                const externalTweets = serverData.posts.map((tweet: any) => {
                    const likes =
                        typeof tweet.reactions === "number"
                            ? tweet.reactions
                            : tweet.reactions?.likes ?? 0;
                    const dislikes =
                        typeof tweet.reactions === "number" ? 0 : tweet.reactions?.dislikes ?? 0;

                    return {
                        ...tweet,
                        id: tweet.id.toString(),
                        reactions: {
                            likes,
                            dislikes,
                        },
                    };
                });

                // Объединяем и обновляем стейт
                setTweets([...dbTweets, ...externalTweets]);
                console.log("Все твиты:", tweets.map(t => t.id));
            } catch (error) {
                console.error("Ошибка при загрузке твитов:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllTweets();

    }, []);
    useEffect(() => {
        console.log("Tweet IDs updated:", tweets.map(t => t.id));
    }, [tweets]);

    const handleLike = async (e: React.MouseEvent, id: string | number) => {
        e.preventDefault();
        e.stopPropagation();
        setTweets((prev) =>
            prev.map((tweet) =>
                tweet.id === id
                    ? {
                        ...tweet,
                        reactions: { ...tweet.reactions, likes: tweet.reactions.likes + 1 },
                    }
                    : tweet
            )
        );
        // Отправляем PATCH-запрос на сервер
        try {
            const res = await fetch(`/api/tweets/${id}/reactions`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "like" }),
            });

            if (!res.ok) {
                throw new Error("Failed to update like on server");
            }

            console.log("✅ Like updated on server");
        } catch (err) {
            console.error("❌ Failed to update like on server:", err);
        }
    };

    const handleDislike = async (e: React.MouseEvent, id: string | number) => {
        e.preventDefault();
        e.stopPropagation();
        setTweets((prev) =>
            prev.map((tweet) =>
                tweet.id === id
                    ? {
                        ...tweet,
                        reactions: { ...tweet.reactions, dislikes: tweet.reactions.dislikes + 1 },
                    }
                    : tweet
            )
        );
        try {
            const res = await fetch(`/api/tweets/${id}/reactions`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "dislike" }),
            });

            if (!res.ok) {
                throw new Error("Failed to update dislike on server");
            }

            console.log("✅ Dislike updated on server");
        } catch (err) {
            console.error("❌ Failed to update dislike on server:", err);
        }
    };

    const handleAddTweet = async (tweet: Omit<Tweet, "id">) => {
        try {
            const res = await fetch("/api/tweets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tweet),
            });

            if (!res.ok) {
                throw new Error("Failed to save tweet to server");
            }

            const data = await res.json();
            const tweetWithId: Tweet = {
                ...tweet,
                id: data.tweet._id, // UUID из базы
            };
            //setTweets((prev) => [tweetWithId, ...prev]);
            // const data = await res.json();
            // console.log("✅ Saved tweet:", data.tweet);

            // // Генерируем id для нового твита локально
            // const nextId = tweets.length ? Math.max(...tweets.map((t) => Number(t.id))) + 1 : 1;
            // const tweetWithId: Tweet = { ...tweet, id: nextId };

            setTweets((prev) => [tweetWithId, ...prev]);
        } catch (err) {
            console.error("❌ Failed to save tweet to server", err);
        }
    };

    if (loading) return <p className="p-4">Loading tweets...</p>;

    return (
        <main className="grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] gap-6 max-w-7xl mx-auto p-4">
            <aside className="space-y-4 hidden lg:block">
                <AddTweetForm onAdd={handleAddTweet} />
            </aside>
            <section className="space-y-4">
                <h1 className="text-xl sm:text-2xl font-bold mb-6">Home page</h1>
                <div className="space-y-4">
                    {tweets.map((tweet) => (
                        <Link key={tweet.id} href={`/tweet/${tweet.id}`}>
                            <div className="border p-4 rounded hover:bg-gray-50 cursor-pointer transition">
                                <h2 className="font-semibold text-lg sm:text-xl">{tweet.title}</h2>
                                <p className="text-gray-700 text-sm sm:text-base">{tweet.body}</p>
                                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
                                    <p>User ID: {tweet.userId} | </p>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            onClick={(e) => handleLike(e, tweet.id)}
                                            className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                        >
                                            Like
                                        </button>
                                        : {tweet.reactions.likes}
                                        <button
                                            onClick={(e) => handleDislike(e, tweet.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
                                        >
                                            Dislike
                                        </button>
                                        : {tweet.reactions.dislikes}
                                    </div>
                                    <p className="text-xs text-blue-400 mt-1 break-words">
                                        {/*Tags: {Array.isArray(tweet.tags) && tweet.tags.length > 0 ? tweet.tags.join(", ") : "No tags"}*/}
                                        Tags: {tweet?.tags?.join(", ")}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}

                </div>
            </section>
            <TrendingTopics tags={tweets.flatMap((t) => t.tags)} />
        </main>
    );
}

// "use client";
//
// import {useEffect, useState} from "react";
// import Link from "next/link";
// import AddTweetForm from "@/app/components/AddTweetForm";
// import TrendingTopics from "@/app/components/TrendingTopics";
//
// interface Tweet {
//     id: number | string;
//     title: string;
//     body: string;
//     userId: number;
//     tags: string[];
//     reactions: {
//         likes: number;
//         dislikes: number;
//     };
// }
//
//
// export default function Home() {
//
//     const [tweets, setTweets] = useState<Tweet[]>([]);
//     const [loading, setLoading] = useState(true);
//
//
//     useEffect(() => {
//         const fetchAllTweets = async () => {
//             try {
//                 setLoading(true)
//
//                 // Получаем твиты из MongoDB
//                 const dbRes = await fetch("/api/tweets")
//                 const dbTweets = await dbRes.json()
//
//                 // Получаем твиты с внешнего API
//                 const serverRes = await fetch("https://dummyjson.com/posts")
//                 const serverData = await serverRes.json()
//
//                 // Нормализуем серверные твиты
//                 const externalTweets = serverData.posts.map((tweet: any) => {
//                     const likes = typeof tweet.reactions === "number" ? tweet.reactions : tweet.reactions?.likes ?? 0
//                     const dislikes = typeof tweet.reactions === "number" ? 0 : tweet.reactions?.dislikes ?? 0
//
//                     return {
//                         ...tweet,
//                         reactions: {
//                             likes,
//                             dislikes,
//                         },
//                     }
//                 })
//
//                 // Объединяем всё в один поток
//                 setTweets([...dbTweets, ...externalTweets])
//             } catch (error) {
//                 console.error("Ошибка при загрузке твитов:", error)
//             } finally {
//                 setLoading(false)
//             }
//         }
//
//         fetchAllTweets()
//     }, [])
//     // useEffect(() => {
//     //     fetch("https://dummyjson.com/posts")
//     //         .then((res) => res.json())
//     //         .then((data) => {
//     //             setTweets(data.posts.map((tweet: any) => {
//     //
//     //                 const likes = typeof tweet.reactions === 'number' ? tweet.reactions : tweet.reactions.likes;
//     //                 const dislikes = typeof tweet.reactions === 'number' ? 0 : tweet.reactions.dislikes;
//     //
//     //                 return {
//     //                 ...tweet,
//     //                 reactions: {
//     //                     likes,
//     //                     dislikes,
//     //                 }
//     //             }}));
//     //             setLoading(false);
//     //         })
//     //         .catch(() => setLoading(false));
//     // }, []);
//
//     const handleLike = (e: React.MouseEvent, id:  string | number) => {
//         e.stopPropagation();
//         e.preventDefault();
//         setTweets(prevTweets =>
//             prevTweets.map(tweet => (tweet.id)  === id ? {...tweet, reactions: {...tweet.reactions, likes: tweet.reactions.likes + 1}} : tweet))
//     }
//     const handleDislike = (e: React.MouseEvent, id: string | number) =>{
//         e.stopPropagation();
//         e.preventDefault();
//         setTweets((prev) =>
//             prev.map((tweet) => (tweet.id)=== id ?
//                 {...tweet,
//                 reactions: {
//                     ...tweet.reactions,
//                     dislikes: tweet.reactions.dislikes + 1,}
//                 } : tweet))
//     }
//     const handleAddTweet = async (tweet: Omit<Tweet, 'id'>) => {
//         try {
//             const res = await fetch('/api/tweets', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(tweet),
//
//             });
//
//             console.log("Adding tweet:", tweet);
//             if (!res.ok) {
//                 console.error("❌ Server error response:");
//                 throw new Error('Failed to save tweet to server');
//             }
//
//             const data = await res.json();
//             console.log('✅ Saved tweet:', data.tweet);
//
//             const nextId = tweets.length ? Math.max(...tweets.map(t => t.id)) + 1 : 1;
//             const tweetWithId: Tweet = { ...tweet, id: nextId };
//             setTweets((prev) => [tweetWithId, ...prev]);
//         } catch (err) {
//             console.error('❌ Failed to save tweet to server', err);
//         }
//     };
//
//     if (loading) return <p className="p-4">Loading tweets...</p>;
//
//     return (
//         <main className="grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] gap-6 max-w-7xl mx-auto p-4">
//             <aside className="space-y-4 hidden lg:block">
//                 <AddTweetForm onAdd={handleAddTweet}/>
//             </aside>
//             <section className="space-y-4">
//                 <h1 className="text-xl sm:text-2xl font-bold mb-6">Home page</h1>
//                 <div className="space-y-4">
//                     {tweets.map((tweet) => (
//                         // <Link key={tweet.id} href={`/tweet/${tweet.id}`}>
//                         <Link key={tweet.id} href={`/tweet/${tweet.id}`}>
//                             <div className="border p-4 rounded hover:bg-gray-50 cursor-pointer transition">
//                                 <h2 className="font-semibold text-lg sm:text-xl">{tweet.title}</h2>
//                                 <p className="text-gray-700 text-sm sm:text-base">{tweet.body}</p>
//                                 <div
//                                     className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
//                                     <p>User ID: {tweet.userId} | </p>
//                                     <div className="flex flex-wrap items-center gap-2">
//                                         <button onClick={(e) =>
//                                             handleLike(e, tweet.id)}
//                                                 className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
//                                             Like
//                                         </button>
//                                         : {tweet.reactions.likes},
//                                         <button
//                                             onClick={(e) => handleDislike(e, tweet.id)}
//                                             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                                         >
//                                             Dislike
//                                         </button> : {tweet.reactions.dislikes}
//
//                                     </div>
//                                     <p className="text-xs text-blue-400 mt-1 break-words">
//                                         Tags: {tweet.tags.join(", ")}
//                                     </p>
//                                 </div>
//                             </div>
//                         </Link>
//                     ))}
//                 </div>
//             </section>
//             <TrendingTopics tags={tweets.flatMap(t => t.tags)}/>
//         </main>
// );
// }
