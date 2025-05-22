"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import AddTweetForm from "@/app/components/AddTweetForm";

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


export default function Home() {

    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://dummyjson.com/posts")
            .then((res) => res.json())
            .then((data) => {
                setTweets(data.posts.map((tweet: any) => {

                    const likes = typeof tweet.reactions === 'number' ? tweet.reactions : tweet.reactions.likes;
                    const dislikes = typeof tweet.reactions === 'number' ? 0 : tweet.reactions.dislikes;

                    return {
                    ...tweet,
                    reactions: {
                        likes,
                        dislikes,
                    }
                }}));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleLike = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        e.preventDefault();
        setTweets(prevTweets =>
            prevTweets.map(tweet => tweet.id === id ? {...tweet, reactions: {...tweet.reactions, likes: tweet.reactions.likes + 1}} : tweet))
    }
    const handleDislike = (e: React.MouseEvent, id: number) =>{
        e.stopPropagation();
        e.preventDefault();
        setTweets((prev) =>
            prev.map((tweet) => tweet.id === id ?
                {...tweet,
                reactions: {
                    ...tweet.reactions,
                    dislikes: tweet.reactions.dislikes + 1,}
                } : tweet))
    }

    const handleAddTweet = (tweet: Omit<Tweet, 'id'>) => {
        const nextId = tweets.length ? Math.max(...tweets.map(t => t.id)) + 1 : 1;
        console.log("nextId", nextId);
        const tweetWithId: Tweet = {
            ...tweet,
            id: nextId,
        };
        setTweets((prev) => [tweetWithId, ...prev]);
    };

    if (loading) return <p className="p-4">Loading tweets...</p>;

    return (
        <main className="p-4 max-w-2xl mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold mb-6">Home page</h1>
            <AddTweetForm onAdd={handleAddTweet}/>
            <div className="space-y-4">
                {tweets.map((tweet) => (
                    <Link key={tweet.id} href={`/tweet/${tweet.id}`}>
                        <div className="border p-4 rounded hover:bg-gray-50 cursor-pointer transition">
                            <h2 className="font-semibold text-lg sm:text-xl">{tweet.title}</h2>
                            <p className="text-gray-700 text-sm sm:text-base">{tweet.body}</p>
                            <div
                                className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
                                <p>User ID: {tweet.userId} | </p>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button onClick={(e) =>
                                        handleLike(e, tweet.id)}
                                            className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                                        Like
                                    </button>
                                    : {tweet.reactions.likes},
                                    <button
                                        onClick={(e) => handleDislike(e, tweet.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Dislike
                                    </button> : {tweet.reactions.dislikes}

                                </div>
                                <p className="text-xs text-blue-400 mt-1 break-words">
                                    Tags: {tweet.tags.join(", ")}
                                </p>
                                </div>
                            </div>
                    </Link>
                    ))}
            </div>
        </main>
);
}
