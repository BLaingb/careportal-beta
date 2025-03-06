"use client";

import type React from "react";

import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { usePostHog } from "posthog-js/react";
import events from "~/lib/analytics/events";
import { useSearchParams } from "next/navigation";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[\d\s-()]{10,}$/, "Please enter a valid phone number"),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactCtaProps {
  children: React.ReactNode;
  context: string;
  additionalEventData?: Record<string, string>;
}

export default function ContactCta({ children, context, additionalEventData = {} }: ContactCtaProps) {
  const searchParams = useSearchParams();
  const zipCode = searchParams.get("zipCode");
  const careType = searchParams.get("careType");
  const patientName = searchParams.get("patientName");
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const posthog = usePostHog();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: patientName ?? "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const handleOpenForm = () => {
    setShowContactForm(true);
    posthog.capture(events.contact_form_opened.name, {
      context,
      careType,
      zipCode,
      ...additionalEventData,
    });
  };

  const onSubmit = (_data: ContactFormData) => {
    posthog.capture(events.contact_form_submitted.name, {
      context,
      careType,
      zipCode,
      ...additionalEventData,
    });
    setIsSubmitted(true);
  };

  return (
    <div className="mt-8 rounded-lg bg-[#f8f7ff] p-6">
      {!showContactForm && !isSubmitted && (
        <div>
          {children}
          <Button
            className="mt-4 bg-[#6c5ce7] hover:bg-[#5b4bc4]"
            onClick={() => handleOpenForm()}
          >
            Get Connected
          </Button>
        </div>
      )}

      {showContactForm && !isSubmitted && (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h3 className="mb-4 text-xl font-bold text-[#6c5ce7]">Contact Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Additional Information (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Tell us more about your care needs"
                {...form.register("message")}
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
                disabled={form.formState.isSubmitting}
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
            Your information has been submitted. A care advisor will contact you shortly to discuss
            available care options in your area.
          </p>
          <Button className="mt-4 bg-[#6c5ce7] hover:bg-[#5b4bc4]" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      )}
    </div>
  );
} 