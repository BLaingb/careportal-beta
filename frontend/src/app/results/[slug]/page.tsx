import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import ContactCta from "../contact-cta";

export default async function Results({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // This would normally come from a database or API based on form inputs
  const facility = {
    id: 1,
    name: "Sunrise Senior Living",
    type: "Stationary Care",
    rating: 4.8,
    reviews: 124,
    address: "123 Care Lane, Portland, OR 97201",
    phone: "(503) 555-1234",
    matchScore: 98,
    amenities: ["24/7 Staff", "Private Rooms", "Garden", "Pet Friendly"],
    description:
      "Sunrise Senior Living provides high-quality stationary care services in a comfortable, home-like environment. Our dedicated staff is available 24/7 to provide personalized care tailored to each resident's unique needs.",
    image: "/placeholder.svg?height=600&width=800",
  };

  

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
                  <p className="text-lg text-gray-600">{facility.type}</p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-[#6c5ce7]" />
                      <span>{facility.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#6c5ce7]" />
                      <span>{facility.address}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-[#6c5ce7]">About This Facility</h3>
                    <p className="mt-2 text-gray-600">{facility.description}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-[#6c5ce7]">Key Amenities</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {facility.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline" className="bg-[#f8f7ff]">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact CTA */}
                <ContactCta />
              </div>

              {/* Facility Image - Right Side */}
              <div className="relative h-full">
                <div className="sticky top-6 overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={facility.image || "/placeholder.svg"}
                    alt={facility.name}
                    width={500}
                    height={300}
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

