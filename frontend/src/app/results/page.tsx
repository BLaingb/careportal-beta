"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { ArrowLeft, Check, MapPin, Phone, Star } from "lucide-react"
import Link from "next/link"

export default function Results() {
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

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
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send the data to your backend
    console.log("Form submitted:", contactFormData)
    setIsSubmitted(true)
  }

  const isFormValid = () => {
    return (
      contactFormData.name.trim() !== "" && contactFormData.email.trim() !== "" && contactFormData.phone.trim() !== ""
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#6c5ce7]">Your Perfect Care Match</h1>
            <p className="mt-2 text-gray-600">Based on your needs, we've found the ideal care facility for you.</p>
          </div>

          <div className="relative">
            <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#e4dcff] opacity-30"></div>
            <div className="relative mx-auto max-w-6xl">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Facility Information - Left Side */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <Badge className="bg-[#6c5ce7]">{facility.matchScore}% Match</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{facility.rating}</span>
                        <span className="text-sm text-gray-500">({facility.reviews} reviews)</span>
                      </div>
                    </div>

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
                  <div className="mt-8 rounded-lg bg-[#f8f7ff] p-6">
                    {!showContactForm && !isSubmitted && (
                      <div>
                        <h3 className="text-xl font-bold text-[#6c5ce7]">Interested in this facility?</h3>
                        <p className="mt-2 text-gray-600">
                          Leave your contact information and we'll help you schedule a visit or get more information.
                        </p>
                        <Button
                          className="mt-4 bg-[#6c5ce7] hover:bg-[#5b4bc4]"
                          onClick={() => setShowContactForm(true)}
                        >
                          Get Connected
                        </Button>
                      </div>
                    )}

                    {showContactForm && !isSubmitted && (
                      <form onSubmit={handleSubmit}>
                        <h3 className="mb-4 text-xl font-bold text-[#6c5ce7]">Contact Information</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="Enter your full name"
                              value={contactFormData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="Enter your email address"
                              value={contactFormData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder="Enter your phone number"
                              value={contactFormData.phone}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="message">Additional Information (Optional)</Label>
                            <Textarea
                              id="message"
                              name="message"
                              placeholder="Any specific questions or requirements?"
                              value={contactFormData.message}
                              onChange={handleInputChange}
                              rows={3}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowContactForm(false)}>
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="flex-1 bg-[#6c5ce7] hover:bg-[#5b4bc4]"
                              disabled={!isFormValid()}
                            >
                              Submit
                            </Button>
                          </div>
                        </div>
                      </form>
                    )}

                    {isSubmitted && (
                      <div className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                          <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-[#6c5ce7]">Thank You!</h3>
                        <p className="mt-2 text-gray-600">
                          Your information has been submitted. A care advisor will contact you shortly to discuss next
                          steps.
                        </p>
                        <Button className="mt-4 bg-[#6c5ce7] hover:bg-[#5b4bc4]" asChild>
                          <Link href="/">Return to Home</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Facility Image - Right Side */}
                <div className="relative h-full">
                  <div className="sticky top-6 overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={facility.image || "/placeholder.svg"}
                      alt={facility.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
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

