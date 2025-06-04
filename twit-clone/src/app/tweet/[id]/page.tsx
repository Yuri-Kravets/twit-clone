
"use client";

import {use, useEffect, useState} from "react";

interface Tweet {
    id: number;
    title: string;
    body: string;
    userId: number;
    tags: string[];
    reactions: {
        likes: number;
        dislikes: number;
    };
}

export default function TweetPage({ params }: { params: Promise<{ id: string }>}) {

    const {id} = use(params);

    const [tweet, setTweet] = useState<Tweet | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://dummyjson.com/posts/${id}`)
            .then((res) => res.json())
            .then((data) => {
                const tweetData = {
                    ...data,
                    reactions: {
                        likes:
                            typeof data.reactions === "number"
                                ? data.reactions
                                : data.reactions.likes,
                        dislikes:
                            typeof data.reactions === "number" ? 0 : data.reactions.dislikes,
                    },
                };
                setTweet(tweetData);
                setLoading(false);
            });
    }, [id]);

    const handleLike = () => {
        if (!tweet) return;
        setTweet({
            ...tweet,
            reactions: {
                ...tweet.reactions,
                likes: tweet.reactions.likes + 1,
            },
        });
    };

    const handleDislike = () => {
        if (!tweet) return;
        setTweet({
            ...tweet,
            reactions: {
                ...tweet.reactions,
                dislikes: tweet.reactions.dislikes + 1,
            },
        });
    };

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
        <main className="border p-4 rounded hover:bg-gray-50  cursor-pointer transition-all">
            <h1 className="font-semibold text-lg sm:text-xl">{tweet.title}</h1>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mt-1">{tweet.body}</p>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex flex-wrap gap-2 items-center">
                <p>User ID: {tweet.userId}</p>|
                <p className="text-green-500">Likes: {tweet.reactions.likes}</p>|
                <p className="text-red-500">Dislikes: {tweet.reactions.dislikes}</p>
            </div>
            <p className="text-xs text-blue-400 mt-1">
                Tags: {tweet.tags.join(", ")}
            </p>
            <div className="flex gap-2 mt-4">
                <button
                    onClick={handleLike}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs sm:text-sm"
                >
                    Like
                </button>
                <button
                    onClick={handleDislike}
                    className="g-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs sm:text-sm"
                >
                    Dislike
                </button>
            </div>
        </main>
    );
}