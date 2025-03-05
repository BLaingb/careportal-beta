import type React from "react";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import CareMatchForm from "./care-match-form";
export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative min-h-[600px]">
        <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-[#e4dcff] opacity-50"></div>
        <div className="container relative">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left side - Fixed content */}
            <div className="flex flex-col justify-center space-y-4 py-12 md:top-6 md:h-fit md:py-24">
              <h1 className="text-4xl font-bold tracking-tighter text-[#6c5ce7] sm:text-5xl md:text-6xl">
                Find the perfect care facility for your needs
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                CarePortal matches you with the right care facility based on your unique requirements and preferences.
              </p>
              <div className="hidden flex-col gap-2 sm:flex-row md:flex">
                <Button className="bg-[#6c5ce7] hover:bg-[#5b4bc4]" asChild>
                  <Link href="#how-it-works">
                    {/* TODO: Link to About page */}
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Right side - Form */}
            <div className="py-6 md:py-24">
              <CareMatchForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

