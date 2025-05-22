
import Link from 'next/link';

export default function Navbar() {


    return (
       <nav className="p4 bg-gray-100 flex gap-4">
           <Link href='/'>Home</Link>
           <Link href='/about'>About</Link>
           <Link href='/contacts'>Contact us</Link>
       </nav>
    )
}