"use client";

import Link from "next/link";
import NotFoundContactCta from "./contact-cta";

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-[#6c5ce7]">No Matching Facilities Found</h1>
        <p className="mb-8 text-lg text-gray-600">
          We couldn&apos;t find any care facilities matching your current criteria. However, we&apos;re here to help
          you find the right care solution.
        </p>
      </div>

      <NotFoundContactCta />

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Want to try a different search?{" "}
          <Link href="/" className="text-[#6c5ce7] hover:underline">
            Start over
          </Link>
        </p>
      </div>
    </div>
  );
}
