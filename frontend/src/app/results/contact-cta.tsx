"use client";

import type React from "react";

import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export default function ContactCta() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the data to your backend
    console.log("Form submitted:", contactFormData);
    setIsSubmitted(true);
  };

  const isFormValid = () => {
    return (
      contactFormData.name.trim() !== "" && contactFormData.email.trim() !== "" && contactFormData.phone.trim() !== ""
    );
  };

  return (
    <div className="mt-8 rounded-lg bg-[#f8f7ff] p-6">
      {!showContactForm && !isSubmitted && (
        <div>
          <h3 className="text-xl font-bold text-[#6c5ce7]">Interested in this facility?</h3>
          <p className="mt-2 text-gray-600">
            Leave your contact information and we&apos;ll help you schedule a visit or get more information.
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
  );
}