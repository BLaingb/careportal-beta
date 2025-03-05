"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { RadioGroup } from "~/components/ui/radio-group"
import { ArrowRight, Check, Heart, Bed, Activity, Sun } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    patientName: "",
    careType: "",
    zipCode: "",
  })

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/results")
  }

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return formData.patientName.trim() !== ""
      case 2:
        return formData.careType !== ""
      case 3:
        return formData.zipCode.trim() !== ""
      default:
        return false
    }
  }

  const handleCareTypeSelect = (value: string) => {
    updateFormData("careType", value)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-[#6c5ce7]" />
            <span className="text-xl font-bold">CarePortal</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="#" className="text-sm font-medium">
              About
            </Link>
            <Link href="#" className="text-sm font-medium">
              Facilities
            </Link>
            <Link href="#" className="text-sm font-medium">
              Contact
            </Link>
            <Button className="bg-[#6c5ce7] hover:bg-[#5b4bc4]">Login</Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative">
          <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-[#e4dcff] opacity-50"></div>
          <div className="container relative grid gap-6 py-12 md:grid-cols-2 md:py-24">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter text-[#6c5ce7] sm:text-5xl md:text-6xl">
                Find the perfect care facility for your needs
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                CarePortal matches you with the right care facility based on your unique requirements and preferences.
              </p>
              <div className="hidden flex-col gap-2 sm:flex-row md:flex">
                <Button className="bg-[#6c5ce7] hover:bg-[#5b4bc4]" asChild>
                  <Link href="#how-it-works">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#contact">Contact Us</Link>
                </Button>
              </div>
            </div>

            {/* Multi-step form */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-lg">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-[#6c5ce7]">Find Your Care Match</h2>
                  <p className="mt-1 text-sm text-gray-600">Complete this short form to get matched</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-6">
                  <div className="relative flex justify-between">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                            step > i
                              ? "border-[#6c5ce7] bg-[#6c5ce7] text-white"
                              : step === i
                                ? "border-[#6c5ce7] text-[#6c5ce7]"
                                : "border-gray-300 text-gray-300"
                          }`}
                        >
                          {step > i ? <Check className="h-4 w-4" /> : i}
                        </div>
                        <span className={`mt-1 text-xs ${step >= i ? "text-[#6c5ce7]" : "text-gray-400"}`}>
                          {i === 1 ? "Name" : i === 2 ? "Care Type" : "Location"}
                        </span>
                      </div>
                    ))}
                    <div className="absolute left-0 top-4 -z-10 h-0.5 w-full bg-gray-200">
                      <div
                        className="h-full bg-[#6c5ce7] transition-all duration-300"
                        style={{ width: `${(step - 1) * 50}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Form content wrapper with fixed height */}
                  <div className="relative h-[300px]">
                    {/* Step 1: Name */}
                    <div
                      className={`absolute left-0 right-0 transition-all duration-300 ${
                        step === 1 ? "opacity-100" : "pointer-events-none opacity-0"
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="patient-name">Patient's Full Name</Label>
                          <Input
                            id="patient-name"
                            placeholder="Enter patient's name"
                            value={formData.patientName}
                            onChange={(e) => updateFormData("patientName", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Care Type */}
                    <div
                      className={`absolute left-0 right-0 transition-all duration-300 ${
                        step === 2 ? "opacity-100" : "pointer-events-none opacity-0"
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Type of Care</Label>
                          <RadioGroup
                            value={formData.careType}
                            onValueChange={(value) => updateFormData("careType", value)}
                            className="space-y-3"
                          >
                            {/* Stationary Care Option */}
                            <div
                              className={`relative flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                                formData.careType === "stationary"
                                  ? "border-[#6c5ce7] bg-[#f8f7ff]"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => handleCareTypeSelect("stationary")}
                              role="radio"
                              aria-checked={formData.careType === "stationary"}
                              tabIndex={0}
                            >
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f8f7ff]">
                                <Bed className="h-5 w-5 text-[#6c5ce7]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-[#6c5ce7]">Stationary Care</p>
                                <p className="text-sm text-gray-600">Residential care with 24/7 support</p>
                              </div>
                            </div>

                            {/* Ambulatory Care Option */}
                            <div
                              className={`relative flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                                formData.careType === "ambulatory"
                                  ? "border-[#6c5ce7] bg-[#f8f7ff]"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => handleCareTypeSelect("ambulatory")}
                              role="radio"
                              aria-checked={formData.careType === "ambulatory"}
                              tabIndex={0}
                            >
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f8f7ff]">
                                <Activity className="h-5 w-5 text-[#6c5ce7]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-[#6c5ce7]">Ambulatory Care</p>
                                <p className="text-sm text-gray-600">Outpatient services without overnight stays</p>
                              </div>
                            </div>

                            {/* Day Care Option */}
                            <div
                              className={`relative flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                                formData.careType === "daycare"
                                  ? "border-[#6c5ce7] bg-[#f8f7ff]"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => handleCareTypeSelect("daycare")}
                              role="radio"
                              aria-checked={formData.careType === "daycare"}
                              tabIndex={0}
                            >
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f8f7ff]">
                                <Sun className="h-5 w-5 text-[#6c5ce7]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-[#6c5ce7]">Day Care</p>
                                <p className="text-sm text-gray-600">Supervised care during daytime hours only</p>
                              </div>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Location */}
                    <div
                      className={`absolute left-0 right-0 transition-all duration-300 ${
                        step === 3 ? "opacity-100" : "pointer-events-none opacity-0"
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="zip-code">Zip Code</Label>
                          <Input
                            id="zip-code"
                            placeholder="Enter zip code"
                            value={formData.zipCode}
                            onChange={(e) => updateFormData("zipCode", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form footer - fixed position */}
                  <div className="mt-6 flex justify-between">
                    {step > 1 ? (
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back
                      </Button>
                    ) : (
                      <div></div>
                    )}

                    {step < 3 ? (
                      <Button
                        type="button"
                        className="bg-[#6c5ce7] hover:bg-[#5b4bc4]"
                        onClick={nextStep}
                        disabled={!isStepComplete()}
                      >
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="submit" className="bg-[#6c5ce7] hover:bg-[#5b4bc4]" disabled={!isStepComplete()}>
                        Find Matches
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white py-12 md:py-24" id="how-it-works">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter text-[#6c5ce7] sm:text-4xl">How CarePortal Works</h2>
              <p className="mt-4 text-gray-600">
                Our simple process helps you find the perfect care facility in just a few steps.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e4dcff]">
                  <span className="text-2xl font-bold text-[#6c5ce7]">1</span>
                </div>
                <h3 className="mt-4 text-xl font-bold">Complete the Form</h3>
                <p className="mt-2 text-gray-600">Tell us about your needs, preferences, and requirements.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e4dcff]">
                  <span className="text-2xl font-bold text-[#6c5ce7]">2</span>
                </div>
                <h3 className="mt-4 text-xl font-bold">Get Matched</h3>
                <p className="mt-2 text-gray-600">Our algorithm matches you with the most suitable care facilities.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e4dcff]">
                  <span className="text-2xl font-bold text-[#6c5ce7]">3</span>
                </div>
                <h3 className="mt-4 text-xl font-bold">Connect</h3>
                <p className="mt-2 text-gray-600">Schedule visits and connect with your matched facilities.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-[#f8f7ff] py-12 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter text-[#6c5ce7] sm:text-4xl">Why Choose CarePortal</h2>
              <p className="mt-4 text-gray-600">We're dedicated to helping you find the best care possible.</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#6c5ce7]">Personalized Matching</h3>
                <p className="mt-2 text-gray-600">
                  Our algorithm considers over 50 factors to find your perfect match.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#6c5ce7]">Verified Facilities</h3>
                <p className="mt-2 text-gray-600">
                  All care facilities in our network are thoroughly vetted and verified.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#6c5ce7]">Support Team</h3>
                <p className="mt-2 text-gray-600">
                  Our care advisors are available to help you through the entire process.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-white py-6" id="contact">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-[#6c5ce7]" />
            <span className="text-lg font-bold">CarePortal</span>
          </div>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} CarePortal. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-gray-500 hover:text-[#6c5ce7]">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-[#6c5ce7]">
              Terms
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-[#6c5ce7]">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

