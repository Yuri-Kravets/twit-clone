
import Link from 'next/link';
import React from "react";
import ModeToggle from "@/app/components/ModeToggle";

export default function Navbar() {


    return (
       <nav className="p4 bg-gray-100 flex gap-4  text-black ">
           <Link href='/'>Home</Link>
           <Link href='/about'>About</Link>
           <ModeToggle/>
       </nav>
    )
}