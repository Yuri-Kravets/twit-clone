"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Tweet {
    _id?: string;
    title: string;
    body: string;
    userId?: number;
    tags: string[];
    reactions: {
        likes: number;
        dislikes: number;
    };
}

export default function TweetPage() {
    const params = useParams();
    const id = params?.id;

    const [tweet, setTweet] = useState<Tweet | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return; // Если id ещё нет, ничего не делать

        const fetchTweet = async () => {
            try {
                setLoading(true);

                // Пытаемся получить твит из MongoDB через API
                const dbRes = await fetch(`/api/tweets/${id}`);
                if (dbRes.ok) {
                    const dbTweet = await dbRes.json();
                    // setTweet({...dbTweet, id: dbTweet._id,});
                    setTweet(dbTweet);
                } else {
                    // Если в БД не найден — получаем с внешнего API
                    const serverRes = await fetch(`https://dummyjson.com/posts/${id}`);
                    const data = await serverRes.json();
                    setTweet({
                        ...data,
                        reactions: {
                            likes: typeof data.reactions === "number" ? data.reactions : data.reactions?.likes ?? 0,
                            dislikes: typeof data.reactions === "number" ? 0 : data.reactions?.dislikes ?? 0,
                        },
                    });
                }
            } catch (e) {
                console.error("Ошибка загрузки твита:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchTweet();
    }, [id]);

    const handleLike = async () => {
        if (!tweet || !tweet._id) return;

        // Оптимистично обновляем UI
        setTweet({
            ...tweet,
            reactions: {
                ...tweet.reactions,
                likes: tweet.reactions.likes + 1,
            },
        });

        try {
            const res = await fetch(`/api/tweets/${tweet._id}/reactions`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "like" }),
            });

            if (!res.ok) {
                throw new Error("Failed to update like");
            }

            const updatedTweet = await res.json();
            // Обновляем стейт реальными данными из базы
            setTweet(updatedTweet);
        } catch (error) {
            console.error("Ошибка при обновлении лайка на сервере:", error);
            // Можно откатить UI обратно, если хочешь
            setTweet(tweet);
        }
    };

    const handleDislike = async () => {
        if (!tweet || !tweet._id) return;

        setTweet({
            ...tweet,
            reactions: {
                ...tweet.reactions,
                dislikes: tweet.reactions.dislikes + 1,
            },
        });

        try {
            //const res = await fetch(`/api/tweets/${tweet._id}/reactions`, {
            const res = await fetch(`/api/tweets/${tweet._id}/reactions`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "dislike" }),
            });

            if (!res.ok) {
                throw new Error("Failed to update dislike");
            }

            const updatedTweet = await res.json();
            setTweet(updatedTweet);
        } catch (error) {
            console.error("Ошибка при обновлении дизлайка на сервере:", error);
            setTweet(tweet);
        }
    };

    // const handleLike = async () => {
    //     if (!tweet) return;
    //     setTweet({
    //         ...tweet,
    //         reactions: {
    //             ...tweet.reactions,
    //             likes: tweet.reactions.likes + 1,
    //         },
    //     });
    //
    //     if (tweet._id) {
    //         const res = await fetch(`/api/tweets/${tweet._id}/like`, {
    //             method: "PATCH",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ type: "like" }),
    //         });
    //
    //         if (!res.ok) {
    //             console.error("Ошибка при обновлении лайка на сервере");
    //             // При необходимости можно откатить UI назад
    //         }
    //     }
    // };
    //
    // const handleDislike = async () => {
    //     if (!tweet) return;
    //     setTweet({
    //         ...tweet,
    //         reactions: {
    //             ...tweet.reactions,
    //             dislikes: tweet.reactions.dislikes + 1,
    //         },
    //     });
    //
    //     if (tweet._id) {
    //         const res = await fetch(`/api/tweets/${tweet._id}/like`, {
    //             method: "PATCH",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ type: "dislike" }),
    //         });
    //
    //         if (!res.ok) {
    //             console.error("Ошибка при обновлении дизлайка на сервере");
    //         }
    //     }
    // };

    if (loading) {
        return <main className="p-4">Loading...</main>;
    }

    if (!tweet) {
        return (
            <main className="p-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-red-600">Tweet not found</h1>
            </main>
        );
    }

    return (
        <main className="border p-4 rounded hover:bg-gray-50 cursor-pointer transition-all max-w-2xl mx-auto">
            <h1 className="font-semibold text-lg sm:text-xl">{tweet.title}</h1>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mt-1">{tweet.body}</p>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex flex-wrap gap-2 items-center">
                <p>User ID: {tweet.userId}</p>|
                <p className="text-green-500">Likes: {tweet.reactions.likes}</p>|
                <p className="text-red-500">Dislikes: {tweet.reactions.dislikes}</p>
            </div>
            <p className="text-xs text-blue-400 mt-1">Tags: {tweet.tags.join(", ")}</p>
            <div className="flex gap-2 mt-4">
                <button
                    onClick={handleLike}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs sm:text-sm"
                >
                    Like
                </button>
                <button
                    onClick={handleDislike}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs sm:text-sm"
                >
                    Dislike
                </button>
            </div>
        </main>
    );
}








//
// "use client";
//
// import {use, useEffect, useState} from "react";
//
// interface Tweet {
//     id?: number | string;
//     _id?: string;
//     title: string;
//     body: string;
//     userId?: number;
//     tags: string[];
//     reactions: {
//         likes: number;
//         dislikes: number;
//     };
// }
//
// export default function TweetPage({ params }: { params: { id: string }}) {
//
//
//     const id = params.id;
//
//     const [tweet, setTweet] = useState<Tweet | null>(null);
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         const fetchTweet = async () => {
//             try {
//                 setLoading(true)
//
//                 // Пробуем получить из MongoDB
//                 const dbRes = await fetch(`/api/tweets/${id}`)
//                 if (dbRes.ok) {
//                     const dbTweet = await dbRes.json()
//                     setTweet({
//                         ...dbTweet,
//                         id: dbTweet._id,
//                     })
//                 } else {
//                     // Если не найден — пробуем получить с внешнего API
//                     const serverRes = await fetch(`https://dummyjson.com/posts/${id}`)
//                     const data = await serverRes.json()
//                     setTweet({
//                         ...data,
//                         reactions: {
//                             likes: typeof data.reactions === 'number' ? data.reactions : data.reactions?.likes ?? 0,
//                             dislikes: typeof data.reactions === 'number' ? 0 : data.reactions?.dislikes ?? 0,
//                         },
//                     })
//                 }
//             } catch (e) {
//                 console.error('Ошибка загрузки твита:', e)
//             } finally {
//                 setLoading(false)
//             }
//         }
//
//         fetchTweet()
//     }, [id])


//     // useEffect(() => {
//     //     fetch(`https://dummyjson.com/posts/${id}`)
//     //         .then((res) => res.json())
//     //         .then((data) => {
//     //             const tweetData = {
//     //                 ...data,
//     //                 reactions: {
//     //                     likes:
//     //                         typeof data.reactions === "number"
//     //                             ? data.reactions
//     //                             : data.reactions.likes,
//     //                     dislikes:
//     //                         typeof data.reactions === "number" ? 0 : data.reactions.dislikes,
//     //                 },
//     //             };
//     //             setTweet(tweetData);
//     //             setLoading(false);
//     //         });
//     // }, [id]);
//
//     const handleLike = async () => {
//         if (!tweet) return;
//         setTweet({
//             ...tweet,
//             reactions: {
//                 ...tweet.reactions,
//                 likes: tweet.reactions.likes + 1,
//             },
//         });
//         // Отправляем PATCH-запрос на сервер
//         if (tweet._id) {
//             const res = await fetch(`/api/tweets/${tweet._id}/like`, {
//                 method: 'PATCH',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'like' }),
//             });
//
//             if (!res.ok) {
//                 console.error('Ошибка при обновлении лайка на сервере');
//                 // по желанию: откатить UI, если важно
//             }
//         // if (tweet._id) {
//         //     await fetch(`/api/tweets/${tweet._id}/like`, {
//         //         method: 'PATCH',
//         //         headers: {'Content-Type': 'application/json'},
//         //         body: JSON.stringify({type: 'like'}),
//         //     });
//         // }
//     };
//
//     const handleDislike = async () => {
//         if (!tweet) return;
//         setTweet({
//             ...tweet,
//             reactions: {
//                 ...tweet.reactions,
//                 dislikes: tweet.reactions.dislikes + 1,
//             },
//         });
//         if (tweet._id) {
//             const res = await fetch(`/api/tweets/${tweet._id}/like`, {
//                 method: 'PATCH',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ type: 'dislike' }),
//             });
//
//             if (!res.ok) {
//                 console.error('Ошибка при обновлении дизлайка на сервере');
//             }
//         }
//         // if (tweet._id) {
//         //     await fetch(`/api/tweets/${tweet._id}/like`, {
//         //         method: 'PATCH',
//         //         headers: {'Content-Type': 'application/json'},
//         //         body: JSON.stringify({type: 'dislike'}),
//         //     });
//         // }
//     };
//
//     if (loading) {
//         return <main className="p-4">Loading...</main>;
//     }
//
//     if (!tweet) {
//         return (
//             <main className="p-4 max-w-2xl mx-auto">
//                 <h1 className="text-2xl font-bold text-red-600">Tweet not found</h1>
//             </main>
//         );
//     }
//
//     return (
//         <main className="border p-4 rounded hover:bg-gray-50  cursor-pointer transition-all">
//             <h1 className="font-semibold text-lg sm:text-xl">{tweet.title}</h1>
//             <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mt-1">{tweet.body}</p>
//             <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex flex-wrap gap-2 items-center">
//                 <p>User ID: {tweet.userId}</p>|
//                 <p className="text-green-500">Likes: {tweet.reactions.likes}</p>|
//                 <p className="text-red-500">Dislikes: {tweet.reactions.dislikes}</p>
//             </div>
//             <p className="text-xs text-blue-400 mt-1">
//                 Tags: {tweet.tags.join(", ")}
//             </p>
//             <div className="flex gap-2 mt-4">
//                 <button
//                     onClick={handleLike}
//                     className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs sm:text-sm"
//                 >
//                     Like
//                 </button>
//                 <button
//                     onClick={handleDislike}
//                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs sm:text-sm"
//                 >
//                     Dislike
//                 </button>
//             </div>
//         </main>
//     );
// }}