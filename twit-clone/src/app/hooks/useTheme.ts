import {useEffect, useState} from "react";


export function useTheme() {
    const [theme, setTheme] = useState<'light'| 'dark'>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const prefersDark = window.matchMedia(`(prefers-color-scheme: dark)`).matches;
        const initialTheme  = savedTheme ?? (prefersDark ? 'dark' : 'light');

        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
        setTheme(initialTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    }

    return {theme, toggleTheme};
}