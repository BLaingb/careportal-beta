"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup } from "~/components/ui/radio-group";
import { ArrowRight, Check, Bed, Activity, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePostHog } from 'posthog-js/react';
export default function CareMatchForm() {

  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    patientName: "",
    careType: "",
    zipCode: "",
  });
  const posthog = usePostHog();

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    console.log('nextStep', step);
    posthog.capture('care_match_form_step_changed', { step: step + 1, method: 'next' });
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    posthog.capture('care_match_form_step_changed', { step: step - 1, method: 'prev' });
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/results");
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return formData.patientName.trim() !== "";
      case 2:
        return formData.careType !== "";
      case 3:
        return formData.zipCode.trim() !== "";
      default:
        return false;
    }
  };

  const handleCareTypeSelect = (value: string) => {
    updateFormData("careType", value);
  };
  return (
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
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step > i
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
              className={`absolute left-0 right-0 transition-all duration-300 ${step === 1 ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-name">Patient&apos;s Full Name</Label>
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
              className={`absolute left-0 right-0 transition-all duration-300 ${step === 2 ? "opacity-100" : "pointer-events-none opacity-0"
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
                      className={`relative flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${formData.careType === "stationary"
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
                      className={`relative flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${formData.careType === "ambulatory"
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
                      className={`relative flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${formData.careType === "daycare"
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
              className={`absolute left-0 right-0 transition-all duration-300 ${step === 3 ? "opacity-100" : "pointer-events-none opacity-0"
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
  );
}