import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "~/env";

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token");
    
    // If no auth token exists, redirect to login
    if (!authToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const response = await fetch(`${env.BACKEND_URL}/api/v1/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken.value}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to logout");
        }

        // Clear the auth token cookie
        cookieStore.delete("auth_token");
        cookieStore.set("force-refresh", JSON.stringify(Math.random()));
        
        // Return JSON response with redirect URL
        return new NextResponse(
            JSON.stringify({ redirect: "/login" }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch {
        return new NextResponse(
            JSON.stringify({ error: "Failed to logout" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
} 