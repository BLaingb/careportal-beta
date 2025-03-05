import { Heart } from "lucide-react";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white py-6" id="contact">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-[#6c5ce7]" />
          <span className="text-lg font-bold">CarePortal</span>
        </div>
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} CarePortal. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="text-sm text-gray-500 hover:text-[#6c5ce7]">
            Privacy
          </Link>
          <Link href="#" className="text-sm text-gray-500 hover:text-[#6c5ce7]">
            Terms
          </Link>
          <Link href="#" className="text-sm text-gray-500 hover:text-[#6c5ce7]">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}