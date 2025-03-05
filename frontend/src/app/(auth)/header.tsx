"use client"
import { ThemeSwitcher } from "~/components/theme-switcher";
import Link from "next/link";
export default function AuthHeader() {
    return (
        <header className="bg-background p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/">
                    <h1 className="text-primary font-bold text-xl">CarePortal</h1>
                </Link>
                <ThemeSwitcher />
            </div>
        </header>
    )
}