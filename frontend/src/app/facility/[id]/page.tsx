import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { ArrowLeft, Calendar, Check, Heart, MapPin, Phone, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
export default async function FacilityDetail({ params }: { params: Promise<{ id: string }> }) {
  // This would normally come from a database or API based on the ID
  const { id } = await params;
  const facility = {
    id,
    name: "Sunrise Senior Living",
    type: "Stationary Care",
    rating: 4.8,
    reviews: 124,
    address: "123 Care Lane, Portland, OR 97201",
    phone: "(503) 555-1234",
    matchScore: 98,
    description:
      "Sunrise Senior Living provides high-quality stationary care services in a comfortable, home-like environment. Our dedicated staff is available 24/7 to provide personalized care tailored to each resident's unique needs.",
    amenities: [
      "24/7 Staff",
      "Fitness Center",
      "Garden",
      "Pet Friendly",
      "Restaurant-style Dining",
      "Transportation Services",
      "Housekeeping",
      "Social Activities",
      "Beauty Salon",
      "Library",
    ],
    services: [
      "Medication Management",
      "Personal Care Assistance",
      "Mobility Assistance",
      "Meal Preparation",
      "Wellness Programs",
      "Scheduled Transportation",
      "Laundry Services",
      "Housekeeping",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    pricing: {
      studio: "$3,500 - $4,200",
      oneBedroom: "$4,200 - $5,000",
      twoBedroom: "$5,000 - $6,500",
    },
    testimonials: [
      {
        name: "Jane D.",
        relationship: "Daughter of Resident",
        text: "The staff at Sunrise has been amazing with my mother. She's happier than she's been in years.",
      },
      {
        name: "Robert M.",
        relationship: "Resident",
        text: "Moving to Sunrise was the best decision I've made. The community is wonderful and I've made many new friends.",
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/results" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Results</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="relative h-64 w-full bg-gray-200 md:h-96">
          <Image
            src={facility.images[0] ?? "/placeholder.svg"}
            alt={facility.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <Badge className="mb-2 bg-[#6c5ce7]">{facility.matchScore}% Match</Badge>
            <h1 className="text-3xl font-bold">{facility.name}</h1>
            <p className="text-lg">{facility.type}</p>
            <div className="mt-2 flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{facility.rating}</span>
              <span className="text-gray-200">({facility.reviews} reviews)</span>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities & Services</TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#6c5ce7]">About {facility.name}</h2>
                    <p className="mt-2 text-gray-600">{facility.description}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#6c5ce7]">Location</h3>
                    <div className="mt-2 flex items-start gap-2">
                      <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-500" />
                      <span>{facility.address}</span>
                    </div>
                    <div className="mt-4 h-64 w-full overflow-hidden rounded-lg bg-gray-200">
                      <Image
                        src="/placeholder.svg?height=300&width=600"
                        alt="Map location"
                        width={600}
                        height={300}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="amenities" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#6c5ce7]">Amenities</h2>
                    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
                      {facility.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-[#6c5ce7]" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#6c5ce7]">Services</h2>
                    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
                      {facility.services.map((service) => (
                        <div key={service} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-[#6c5ce7]" />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="photos">
                  <h2 className="mb-4 text-2xl font-bold text-[#6c5ce7]">Photo Gallery</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {facility.images.map((image, index) => (
                      <div key={index} className="overflow-hidden rounded-lg">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${facility.name} - Photo ${index + 1}`}
                          width={600}
                          height={256}
                          className="h-64 w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="pricing">
                  <h2 className="mb-4 text-2xl font-bold text-[#6c5ce7]">Pricing Information</h2>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">Studio Apartment</h3>
                      <p className="mt-1 text-2xl font-bold text-[#6c5ce7]">{facility.pricing.studio}</p>
                      <p className="mt-1 text-sm text-gray-500">per month</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">One Bedroom</h3>
                      <p className="mt-1 text-2xl font-bold text-[#6c5ce7]">{facility.pricing.oneBedroom}</p>
                      <p className="mt-1 text-sm text-gray-500">per month</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">Two Bedroom</h3>
                      <p className="mt-1 text-2xl font-bold text-[#6c5ce7]">{facility.pricing.twoBedroom}</p>
                      <p className="mt-1 text-sm text-gray-500">per month</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    * Pricing may vary based on care needs and apartment availability. Contact for current rates.
                  </p>
                </TabsContent>
                <TabsContent value="reviews">
                  <h2 className="mb-4 text-2xl font-bold text-[#6c5ce7]">Testimonials & Reviews</h2>
                  <div className="space-y-4">
                    {facility.testimonials.map((testimonial, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <p className="italic">&quot;{testimonial.text}&quot;</p>
                        <div className="mt-2">
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-gray-500">{testimonial.relationship}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div>
              <div className="sticky top-6 rounded-lg border p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#6c5ce7]">Contact Information</h2>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-[#6c5ce7]" />
                    <span>{facility.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#6c5ce7]" />
                    <span>{facility.address}</span>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <Button className="w-full bg-[#6c5ce7] hover:bg-[#5b4bc4]">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Facility
                  </Button>
                  <Button className="w-full bg-[#6c5ce7] hover:bg-[#5b4bc4]">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule a Tour
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="mr-2 h-4 w-4" />
                    Save to Favorites
                  </Button>
                </div>
                <div className="mt-6 rounded-lg bg-[#f8f7ff] p-4">
                  <h3 className="font-medium text-[#6c5ce7]">Need Help Deciding?</h3>
                  <p className="mt-1 text-sm text-gray-600">Our care advisors can help you navigate your options.</p>
                  <Button className="mt-3 w-full bg-[#6c5ce7] hover:bg-[#5b4bc4]">Request Consultation</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-white py-6">
        <div className="container text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CarePortal. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

