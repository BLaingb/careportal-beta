"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { ArrowRight, Check, Bed, Activity, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePostHog } from 'posthog-js/react';
import events from "~/lib/analytics/events";
import { getNearestFacility } from "~/lib/facilities";

const careMatchSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  careType: z.enum(["stationary_care", "ambulatory_care", "day_care"], {
    required_error: "Please select a care type",
  }),
  zipCode: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit zip code"),
});

type CareMatchFormData = z.infer<typeof careMatchSchema>;

export default function CareMatchForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const STEP_NAMES = ["Patient Name", "Care Type", "Location"];
  const posthog = usePostHog();

  const form = useForm<CareMatchFormData>({
    resolver: zodResolver(careMatchSchema),
    defaultValues: {
      patientName: "",
      careType: undefined,
      zipCode: "",
    },
  });

  // Watch form values to trigger re-renders
  const { patientName, careType, zipCode } = form.watch();

  const nextStep = () => {
    // Controlled form with only 3 steps, so we can use the step index directly
    const stepName = STEP_NAMES[step]!;
    const event = events.care_match_form_step_completed;
    const value = step === 1 ? patientName : step === 2 ? careType : zipCode;
    posthog.capture(event.name, event.properties({ step: step + 1, stepName, value }));
    // No day care facilities are participating in the beta, so we can skip directly to results
    // No need to check for zip code
    // May remove this if we want to get analytics on zip code interest for day care facilities
    if (step === 2 && careType === "day_care") {
      onSubmit(form.getValues());
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const searchNearestFacility = async (data: CareMatchFormData) => {
    const facility = await getNearestFacility(data.careType, data.zipCode);
    if (facility) {
      router.push(`/results/${facility.slug}?careType=${data.careType}&zipCode=${data.zipCode}&patientName=${data.patientName}`);
    } else {
      router.push(`/results/not-found?careType=${data.careType}&zipCode=${data.zipCode}&patientName=${data.patientName}`);
    }
  };

  const onSubmit = (data: CareMatchFormData) => {
    const event = events.care_match_form_submitted;
    posthog.capture(event.name, event.properties(data));
    searchNearestFacility(data).catch((error) => {
      // TODO: Toast and posthog error event
      console.error(error);
    });
  };

  const isStepComplete = () => {    
    switch (step) {
      case 1:
        return patientName?.trim().length >= 2;
      case 2:
        return !!careType;
      case 3:
        return /^\d{5}$/.test(zipCode || "");
      default:
        return false;
    }
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

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Form content wrapper */}
          <div className="relative">
            {/* Step 1: Name */}
            <div
              className={`transition-all duration-300 ${
                step === 1 ? "block" : "hidden"
              }`}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient&apos;s Full Name</Label>
                  <Input
                    id="patientName"
                    placeholder="Enter patient's name"
                    {...form.register("patientName")}
                  />
                  {form.formState.errors.patientName && (
                    <p className="text-sm text-red-500">{form.formState.errors.patientName.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Care Type */}
            <div
              className={`transition-all duration-300 ${
                step === 2 ? "block" : "hidden"
              }`}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Type of Care</Label>
                  <RadioGroup
                    value={careType}
                    onValueChange={(value) => form.setValue("careType", value as CareMatchFormData["careType"], { shouldValidate: true })}
                    className="space-y-3"
                  >
                    {/* Stationary Care Option */}
                    <label
                      className={`relative flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                        careType === "stationary_care"
                          ? "border-[#6c5ce7] bg-[#f8f7ff]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      htmlFor="stationary_care"
                    >
                      <RadioGroupItem value="stationary_care" id="stationary_care" className="sr-only" />
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f8f7ff]">
                        <Bed className="h-5 w-5 text-[#6c5ce7]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#6c5ce7]">Stationary Care</p>
                        <p className="text-sm text-gray-600">Residential care with 24/7 support</p>
                      </div>
                    </label>

                    {/* Ambulatory Care Option */}
                    <label
                      className={`relative flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                        careType === "ambulatory_care"
                          ? "border-[#6c5ce7] bg-[#f8f7ff]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      htmlFor="ambulatory_care"
                    >
                      <RadioGroupItem value="ambulatory_care" id="ambulatory_care" className="sr-only" />
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f8f7ff]">
                        <Activity className="h-5 w-5 text-[#6c5ce7]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#6c5ce7]">Ambulatory Care</p>
                        <p className="text-sm text-gray-600">Outpatient services without overnight stays</p>
                      </div>
                    </label>

                    {/* Day Care Option */}
                    <label
                      className={`relative flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                        careType === "day_care"
                          ? "border-[#6c5ce7] bg-[#f8f7ff]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      htmlFor="day_care"
                    >
                      <RadioGroupItem value="day_care" id="day_care" className="sr-only" />
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f8f7ff]">
                        <Sun className="h-5 w-5 text-[#6c5ce7]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#6c5ce7]">Day Care</p>
                        <p className="text-sm text-gray-600">Supervised care during daytime hours only</p>
                      </div>
                    </label>
                  </RadioGroup>
                  {form.formState.errors.careType && (
                    <p className="text-sm text-red-500">{form.formState.errors.careType.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Location */}
            <div
              className={`transition-all duration-300 ${
                step === 3 ? "block" : "hidden"
              }`}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="Enter zip code"
                    {...form.register("zipCode")}
                    maxLength={5}
                    inputMode="numeric"
                  />
                  {form.formState.errors.zipCode && (
                    <p className="text-sm text-red-500">{form.formState.errors.zipCode.message}</p>
                  )}
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
              <Button 
                type="submit" 
                className="bg-[#6c5ce7] hover:bg-[#5b4bc4]" 
                disabled={!isStepComplete()}
              >
                Find Matches
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}