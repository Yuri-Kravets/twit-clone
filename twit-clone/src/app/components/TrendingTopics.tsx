'use client'

import React from "react";

interface TrendingTopicsProps {
    tags: string[]
}

export default function TrendingTopics({tags} : TrendingTopicsProps) {

    const trending = tags.reduce((acc: Record<string, number>, tag) => {
        acc[tag] = (acc[tag] || 0) + 1
        return acc
    }, {})

    const sortedTags = Object.entries(trending).sort((a,b) => b[1] - a[1]).slice(0, 5);

    return (
        <aside className="hidden lg:block p-4 bg-white dark:bg-gray-900 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">🔥 Trending Topics</h2>
            <div className="space-y-3">
                {sortedTags.map(([tag, count]) => (
                    <div
                        key={tag + count}
                        className="bg-gray-100 dark:bg-gray-800 p-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                    >
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">#{tag}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{count} posts</p>
                    </div>
                ))}
            </div>
        </aside>
    )
}