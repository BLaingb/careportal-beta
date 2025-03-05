import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { env } from "~/env";

// Login request schema based on OpenAPI spec
const loginRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

type LoginRequest = z.infer<typeof loginRequestSchema>;

// Token response schema based on OpenAPI spec
const tokenResponseSchema = z.object({
    access_token: z.string(),
    token_type: z.string().default("bearer"),
    expires_at: z.string().datetime({ local: true }),
    user_id: z.string().uuid(),
});

type TokenResponse = z.infer<typeof tokenResponseSchema>;

export async function POST(request: NextRequest) {
    try {
        // Parse and validate request body
        const body = await request.json() as LoginRequest;
        const validatedData = loginRequestSchema.parse(body);
        
        const response = await fetch(`${env.BACKEND_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(validatedData),
        });

        if (!response.ok) {
            const error = await response.json() as { detail: string };
            return NextResponse.json(error, { status: response.status });
        }

        const data = await response.json() as TokenResponse;
        // Validate response data
        const validatedToken = tokenResponseSchema.parse(data);

        // Calculate expiration time in seconds
        const expiresAt = new Date(validatedToken.expires_at);
        const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000);

        const res = NextResponse.json({
            user_id: validatedToken.user_id,
            expires_at: validatedToken.expires_at
        });
        
        // Store the JWT token in a secure cookie
        res.cookies.set("auth_token", validatedToken.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: maxAge > 0 ? maxAge : 60 * 60 * 24, // Use calculated expiry or default to 24 hours
            path: "/",
            sameSite: "strict"
        });

        return res;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { detail: error.errors },
                { status: 422 }
            );
        }
        
        return NextResponse.json(
            { detail: "Internal server error" },
            { status: 500 }
        );
    }
}