'use client';

import {useState} from "react";

export default function About() {

const [input, setInput] = useState('');
const [response, setResponse] = useState('');

const handleSubmit = async () => {
    const res = await fetch('/api/hello', {
        method: 'POST',
        headers: {
            'Content-Type' :'application/json',
        },
        body: JSON.stringify({text: input}),
    })
    const data = await res.json();
    setResponse(data.message);
}

    return (
        <main className="p-6 bg-white text-black dark:bg-gray-900 dark:text-white ">
            <h1 className="text-2xl font-bold mb-4">About Page</h1>
            <p>This is a simple Twitter clone built with Next.js.</p>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="border p-2 mr-2"
                placeholder="Type something..."
            />
            <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                Send
            </button>
            {response && <p className="mt-4 text-green-600">{response}</p>}


        </main>
    )
}