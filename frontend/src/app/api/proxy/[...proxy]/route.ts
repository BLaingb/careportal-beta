import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env.js";

export async function GET(request: NextRequest) {
  return proxyRequest(request);
}

export async function POST(request: NextRequest) {
  return proxyRequest(request);
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request);
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request);
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request);
}

export async function OPTIONS(request: NextRequest) {
  return proxyRequest(request);
}

async function proxyRequest(request: NextRequest) {
  try {
    // Get the path after /api
    let path = request.nextUrl.pathname.replace(/^\/api\/proxy/, "");

    // Backend expects no trailing slashes
    path = path.endsWith("/") ? path.slice(0, -1) : path;
    
    // Get the request body if present
    let body: BodyInit | null = null;
    if (request.body && request.method !== "GET" && request.method !== "HEAD") {
      body = request.body;
    }

    const authToken = request.cookies.get("auth_token")?.value;
    
    const headers = new Headers();
    
    headers.set("Content-Type", request.headers.get("Content-Type") ?? "application/json");
    
    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    } else if (request.headers.get("Authorization")) {
      headers.set("Authorization", request.headers.get("Authorization")!);
    }
    
    // Forward the request to the backend
    const response = await fetch(`${env.BACKEND_URL}${path}`, {
      method: request.method,
      headers,
      ...(body ? { body, duplex: "half" } : {}),
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json() as unknown as Record<string, unknown>;

    const proxyResponse = NextResponse.json(data, {
      status: response.status,
      statusText: response.statusText,
    });

    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        proxyResponse.headers.set(key, value);
      }
    });

    return proxyResponse;
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 