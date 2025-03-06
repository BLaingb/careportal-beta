"use client";

import ContactCta from "../(components)/contact-cta";
import { Suspense } from 'react';

export default function NotFoundContactCta() {
  const Content = <>
    <h3 className="text-xl font-bold text-[#6c5ce7]">Let Us Help You Find Care</h3>
      <p className="mt-2 text-gray-600">
        Leave your contact information and our care advisors will work with you personally to find
      suitable care options in your area.
    </p>
  </>;
  return (
    <Suspense fallback={<div>{Content}</div>}>
      <ContactCta context="not_found_page">
        {Content}
      </ContactCta>
    </Suspense>
  );
}
