export async function GET() {
    const tweets = [
        { id: 1, user: "JohnDoe", content: "Hello Next.js!", timestamp: "2m ago" },
        { id: 2, user: "JaneDoe", content: "Loving React & Next.js!", timestamp: "10m ago" },
        { id: 3, user: "DevGuy", content: "Just deployed my app to Vercel ", timestamp: "15m ago" },
        { id: 4, user: "CodeQueen", content: "TailwindCSS makes styling easy!", timestamp: "30m ago" },
        { id: 5, user: "UXMaster", content: "Dark mode is a must!", timestamp: "1h ago" },
        { id: 6, user: "TypeSafe", content: "TypeScript saved my project again!", timestamp: "2h ago" },
        { id: 7, user: "NodeNinja", content: "Backend devs unite! ", timestamp: "2h ago" },
        { id: 8, user: "FullStacker", content: "API routes in Next.js are ", timestamp: "3h ago" },
        { id: 9, user: "DesignDiva", content: "Minimal UI is the future.", timestamp: "5h ago" },
        { id: 10, user: "ReactFan", content: "useEffect vs useLayoutEffect?", timestamp: "6h ago" },
        { id: 11, user: "TestyMcTest", content: "Writing unit tests is satisfying.", timestamp: "7h ago" },
        { id: 12, user: "HotReload", content: "Hot reload not working... again ", timestamp: "8h ago" },
        { id: 13, user: "JSWizard", content: "Closures in JavaScript still confuse people.", timestamp: "10h ago" },
        { id: 14, user: "AsyncAwait", content: "Async/await > .then()", timestamp: "11h ago" },
        { id: 15, user: "OpenSourceFan", content: "Just contributed to an open source project!", timestamp: "12h ago" },
        { id: 16, user: "NextLevelDev", content: "App Router is game-changing!", timestamp: "14h ago" },
        { id: 17, user: "CSSPro", content: "Grid vs Flexbox — depends on the layout!", timestamp: "16h ago" },
        { id: 18, user: "PromptGuru", content: "AI tools can speed up your workflow!", timestamp: "18h ago" },
        { id: 19, user: "BuildWeek", content: "Weekend hackathon incoming!", timestamp: "20h ago" },
        { id: 20, user: "DeployGuy", content: "CI/CD pipelines are essential!", timestamp: "22h ago" },
    ];

    return new Response(JSON.stringify(tweets), { status: 200 });
}