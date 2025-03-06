import { MapPin } from "lucide-react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import ContactCta from "./contact-cta";
import { getFacilityBySlug } from "~/lib/facilities";
export default async function Results({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // This would normally come from a database or API based on form inputs
  const facility = await getFacilityBySlug(slug);

  return (
    <main className="flex-1 py-12">
      <div className="container">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#6c5ce7]">Your Perfect Care Match</h1>
          <p className="mt-2 text-gray-600">Based on your needs, we&apos;ve found the ideal care facility for you.</p>
        </div>

        <div className="relative">
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#e4dcff] opacity-30"></div>
          <div className="relative mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Facility Information - Left Side */}
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-[#6c5ce7]">{facility.name}</h2>
                  <div className="flex gap-2">
                    {facility.has_stationary_care && (
                      <Badge variant="outline" className="bg-[#f8f7ff]">Stationary Care</Badge>
                    )}
                    {facility.has_ambulatory_care && (
                      <Badge variant="outline" className="bg-[#f8f7ff]">Ambulatory Care</Badge>
                    )}
                    {facility.has_day_care && (
                      <Badge variant="outline" className="bg-[#f8f7ff]">Day Care</Badge>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#6c5ce7]" />
                      <span>{facility.address}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-[#6c5ce7]">Care Services</h3>
                    <div className="mt-2 space-y-2">
                      {facility.has_stationary_care && (
                        <div className="flex items-center gap-2">
                          <div className="mt-0.5 h-2 w-2 rounded-full bg-[#6c5ce7]" />
                          <div>
                            <span className="font-medium">Stationary Care:</span> 
                            <span className="text-gray-600"> 24/7 comprehensive care with accommodation</span>
                          </div>
                        </div>
                      )}
                      {facility.has_ambulatory_care && (
                        <div className="flex items-center gap-2">
                          <div className="mt-0.5 h-2 w-2 rounded-full bg-[#6c5ce7]" />
                          <div>
                            <span className="font-medium">Ambulatory Care:</span> 
                            <span className="text-gray-600"> Professional care services in your home</span>
                          </div>
                        </div>
                      )}
                      {facility.has_day_care && (
                        <div className="flex items-center gap-2">
                          <div className="mt-0.5 h-2 w-2 rounded-full bg-[#6c5ce7]" />
                          <div>
                            <span className="font-medium">Day Care:</span> 
                            <span className="text-gray-600"> Supportive care during daytime hours</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-[#6c5ce7]">Location Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-[#6c5ce7]" />
                        <div>
                          <span className="font-medium">ZIP Code:</span> 
                          <span className="text-gray-600"> {facility.zip_code}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-[#6c5ce7]" />
                        <div>
                          <span className="font-medium">Service Area:</span> 
                          <span className="text-gray-600"> ZIP codes {facility.from_zip_code} to {facility.to_zip_code}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-[#6c5ce7]" />
                        <div>
                          <span className="font-medium">Availability:</span> 
                          <span className="text-gray-600"> {facility.available_capacity ? "Currently accepting new patients" : "Limited availability - contact for details"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact CTA */}
                <ContactCta facility={facility} />
              </div>

              {/* Facility Image - Right Side */}
              <div className="relative h-full">
                <div className="sticky top-6 overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={facility.image_url ?? "/placeholder.svg"}
                    alt={facility.name}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

