"use client";

import type { Facility } from "~/lib/facilities";
import ContactCta from "../(components)/contact-cta";
import { Suspense } from 'react';

export default function FacilityContactCta({ facility }: { facility: Facility }) {
  const Content = <>
    <h3 className="text-xl font-bold text-[#6c5ce7]">Interested in this facility?</h3>
      <p className="mt-2 text-gray-600">
        Leave your contact information and we&apos;ll help you schedule a visit or get more information.
      </p>
  </>;
  return (
    <Suspense fallback={<div>{Content}</div>}>
      <ContactCta 
        context="facility_page"
        additionalEventData={{ facilityName: facility.name }}
      >
      {Content}
      </ContactCta>
    </Suspense>
  );
}