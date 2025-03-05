import type { ReactNode } from "react";
import AuthHeader from "./header";

interface SignupLayoutProps {
    children: ReactNode;
}

export default function SignupLayout({ children }: SignupLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <AuthHeader />
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
} 