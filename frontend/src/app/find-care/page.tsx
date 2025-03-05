"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { RadioGroup } from "~/components/ui/radio-group"
import { ArrowLeft, ArrowRight, Check, Bed, Activity, Sun } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function FindCare() {
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
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-[#6c5ce7]">Find Your Perfect Care Match</h1>
              <p className="mt-2 text-gray-600">Tell us a bit about your care needs.</p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="relative flex justify-between">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        step > i
                          ? "border-[#6c5ce7] bg-[#6c5ce7] text-white"
                          : step === i
                            ? "border-[#6c5ce7] text-[#6c5ce7]"
                            : "border-gray-300 text-gray-300"
                      }`}
                    >
                      {step > i ? <Check className="h-5 w-5" /> : i}
                    </div>
                    <span className={`mt-2 text-xs ${step >= i ? "text-[#6c5ce7]" : "text-gray-400"}`}>
                      {i === 1 ? "Patient Name" : i === 2 ? "Care Type" : "Location"}
                    </span>
                  </div>
                ))}
                <div className="absolute left-0 top-5 -z-10 h-0.5 w-full bg-gray-200">
                  <div
                    className="h-full bg-[#6c5ce7] transition-all duration-300"
                    style={{ width: `${(step - 1) * 50}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {step === 1 ? "Patient Information" : step === 2 ? "Type of Care Needed" : "Location"}
                </CardTitle>
                <CardDescription>
                  {step === 1
                    ? "Enter the patient's name"
                    : step === 2
                      ? "Select the type of care needed"
                      : "Enter your zip code for local matches"}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent>
                  {step === 1 && (
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
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Type of Care</Label>
                        <RadioGroup
                          value={formData.careType}
                          onValueChange={(value) => updateFormData("careType", value)}
                          className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3"
                        >
                          {/* Stationary Care Card */}
                          <div
                            className={`relative flex cursor-pointer flex-col overflow-hidden rounded-lg border-2 transition-all ${
                              formData.careType === "stationary"
                                ? "border-[#6c5ce7]"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handleCareTypeSelect("stationary")}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault()
                                handleCareTypeSelect("stationary")
                              }
                            }}
                            role="radio"
                            aria-checked={formData.careType === "stationary"}
                            aria-label="Stationary Care"
                          >
                            <div className="relative h-40 overflow-hidden">
                              <img
                                src="/placeholder.svg?height=160&width=300"
                                alt=""
                                className="h-full w-full object-cover"
                                aria-hidden="true"
                              />
                              <div
                                className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent ${
                                  formData.careType === "stationary" ? "opacity-80" : "opacity-60"
                                }`}
                              ></div>
                              <div className="absolute bottom-0 left-0 p-4">
                                <Bed className="h-8 w-8 text-white" aria-hidden="true" />
                              </div>
                              <div className="absolute right-3 top-3">
                                {formData.careType === "stationary" && (
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#6c5ce7]">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div
                              className={`flex flex-1 flex-col p-4 ${
                                formData.careType === "stationary" ? "bg-[#f8f7ff]" : ""
                              }`}
                            >
                              <span className="text-lg font-medium text-[#6c5ce7]">Stationary Care</span>
                              <p className="mt-1 text-sm text-gray-600">
                                Residential care with 24/7 support in a facility
                              </p>
                            </div>
                            <input
                              type="radio"
                              name="careType"
                              id="stationary"
                              value="stationary"
                              checked={formData.careType === "stationary"}
                              onChange={() => {}}
                              className="sr-only"
                              aria-hidden="true"
                            />
                          </div>

                          {/* Ambulatory Care Card */}
                          <div
                            className={`relative flex cursor-pointer flex-col overflow-hidden rounded-lg border-2 transition-all ${
                              formData.careType === "ambulatory"
                                ? "border-[#6c5ce7]"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handleCareTypeSelect("ambulatory")}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault()
                                handleCareTypeSelect("ambulatory")
                              }
                            }}
                            role="radio"
                            aria-checked={formData.careType === "ambulatory"}
                            aria-label="Ambulatory Care"
                          >
                            <div className="relative h-40 overflow-hidden">
                              <img
                                src="/placeholder.svg?height=160&width=300"
                                alt=""
                                className="h-full w-full object-cover"
                                aria-hidden="true"
                              />
                              <div
                                className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent ${
                                  formData.careType === "ambulatory" ? "opacity-80" : "opacity-60"
                                }`}
                              ></div>
                              <div className="absolute bottom-0 left-0 p-4">
                                <Activity className="h-8 w-8 text-white" aria-hidden="true" />
                              </div>
                              <div className="absolute right-3 top-3">
                                {formData.careType === "ambulatory" && (
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#6c5ce7]">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div
                              className={`flex flex-1 flex-col p-4 ${
                                formData.careType === "ambulatory" ? "bg-[#f8f7ff]" : ""
                              }`}
                            >
                              <span className="text-lg font-medium text-[#6c5ce7]">Ambulatory Care</span>
                              <p className="mt-1 text-sm text-gray-600">
                                Outpatient medical services without overnight stays
                              </p>
                            </div>
                            <input
                              type="radio"
                              name="careType"
                              id="ambulatory"
                              value="ambulatory"
                              checked={formData.careType === "ambulatory"}
                              onChange={() => {}}
                              className="sr-only"
                              aria-hidden="true"
                            />
                          </div>

                          {/* Day Care Card */}
                          <div
                            className={`relative flex cursor-pointer flex-col overflow-hidden rounded-lg border-2 transition-all ${
                              formData.careType === "daycare"
                                ? "border-[#6c5ce7]"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handleCareTypeSelect("daycare")}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault()
                                handleCareTypeSelect("daycare")
                              }
                            }}
                            role="radio"
                            aria-checked={formData.careType === "daycare"}
                            aria-label="Day Care"
                          >
                            <div className="relative h-40 overflow-hidden">
                              <img
                                src="/placeholder.svg?height=160&width=300"
                                alt=""
                                className="h-full w-full object-cover"
                                aria-hidden="true"
                              />
                              <div
                                className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent ${
                                  formData.careType === "daycare" ? "opacity-80" : "opacity-60"
                                }`}
                              ></div>
                              <div className="absolute bottom-0 left-0 p-4">
                                <Sun className="h-8 w-8 text-white" aria-hidden="true" />
                              </div>
                              <div className="absolute right-3 top-3">
                                {formData.careType === "daycare" && (
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#6c5ce7]">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div
                              className={`flex flex-1 flex-col p-4 ${
                                formData.careType === "daycare" ? "bg-[#f8f7ff]" : ""
                              }`}
                            >
                              <span className="text-lg font-medium text-[#6c5ce7]">Day Care</span>
                              <p className="mt-1 text-sm text-gray-600">Supervised care during daytime hours only</p>
                            </div>
                            <input
                              type="radio"
                              name="careType"
                              id="daycare"
                              value="daycare"
                              checked={formData.careType === "daycare"}
                              onChange={() => {}}
                              className="sr-only"
                              aria-hidden="true"
                            />
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
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
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
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
                </CardFooter>
              </form>
            </Card>
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

