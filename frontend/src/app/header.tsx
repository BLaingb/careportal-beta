import { Heart } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-[#6c5ce7]" />
          <div className="flex flex-col">
            <span className="text-xl font-bold">CarePortal</span>
            <span className="text-xs font-extralight indent-12 leading-none text-gray-500">By CareMates</span>
          </div>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="https://caremates.de/" className="text-sm font-medium">
            CareMates
          </Link>
        </nav>
      </div>
    </header>
  )
}