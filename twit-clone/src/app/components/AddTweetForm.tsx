'use client'


import {useState} from "react";

interface Tweet {
    id: number;
    title: string;
    body: string;
    userId: number;
    tags: string[];
    reactions: {
        likes: number;
        dislikes: number;
    }
}

interface AddTweetFormProps {
    onAdd: (tweet: Omit<Tweet, 'id'>) => void;
}

const predefinedTags = ["fun", "politic",  "tech", "news", "sports", "life", "custom"];


export default function AddTweetForm({onAdd} : AddTweetFormProps) {

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [customTag, setCustomTag] = useState('');

    const handleTagSelect = (tag: string) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags((prev) => [...prev, tag]);
        }
    };

    const handleCustomTag = () => {
        const trimmed = customTag.trim().toLowerCase();
        if (trimmed && !selectedTags.includes(trimmed)) {
            setSelectedTags((prev) => [...prev, trimmed]);
            setCustomTag('');
        }
    };

    const handleTagRemove = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) return;

        const newTweet: Omit<Tweet, 'id'>= {
            title,
            body,
            userId: 1,
            tags: selectedTags.length ? selectedTags : ["custom"],
            reactions: {
                likes: 0,
                dislikes: 0,
            },
        };

        onAdd(newTweet);
        setTitle('');
        setBody('');
        setSelectedTags([]);
        setCustomTag('');
    };

        return (
            <form onSubmit={handleSubmit}
                  className="mb-6 flex flex-col gap-4 bg-white dark:bg-gray-900 p-4 rounded shadow-sm">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Add New Tweet</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border px-3 py-2 rounded w-full text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                />
                {/*<input*/}
                {/*    type="text"*/}
                {/*    placeholder="Body"*/}
                {/*    value={body}*/}
                {/*    onChange={(e) => setBody(e.target.value)}*/}
                {/*    className="border px-3 py-2 rounded w-full sm:w-1/2 text-sm"*/}
                {/*    required*/}
                {/*/>*/}
                <textarea
                    placeholder="Body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full border p-2 rounded text-sm resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    rows={3}
                    required
                />
                <div className="mb-2">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Choose Tags:</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {predefinedTags.map((tag) => (
                            <button
                                type="button"
                                key={tag}
                                onClick={() => handleTagSelect(tag)}
                                className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-white">{tag}
                            </button>
                        ))}
                    </div>
                    {selectedTags.length > 0 && (
                        <div className="text-sm flex flex-wrap gap-2">
                            {selectedTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="flex items-center gap-1 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-blue-700 dark:text-blue-200"
                                >{tag}
                                    <button
                                        type="button"
                                        onClick={() => handleTagRemove(tag)}
                                        className="text-red-500 dark:text-red-300 font-bold ml-1"
                                    >×</button></span>))}</div>)}</div>
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Custom tag"
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        className="border px-3 py-2 rounded w-full sm:w-auto text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                    <button
                        type="button"
                        onClick={handleCustomTag}
                        className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 text-sm"
                    >
                        Add Tag
                    </button>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto text-sm"
                >
                    Add Tweet
                </button>
            </form>
        );
}
