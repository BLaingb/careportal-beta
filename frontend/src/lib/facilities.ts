import { z } from "zod";
import { env } from "~/env";

type CareType = "stationary_care" | "ambulatory_care" | "day_care";

const FacilitySearchResponseSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  address: z.string(),
  zip_code: z.number(),
  available_capacity: z.boolean(),
  distance: z.number(),
  image_url: z.string().url().optional(),
});

type FacilitySearchResponse = z.infer<typeof FacilitySearchResponseSchema>;

export const getNearestFacility = async (careType: CareType, zipCode?: string): Promise<FacilitySearchResponse | null> => {
  const params = new URLSearchParams();
  params.set("care_type", careType);
  if (zipCode) {
    params.set("zip_code", zipCode);
  }
  const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/api/v1/care-facilities/nearest?${params.toString()}`);
  if (!response.ok && response.status !== 404) {
    throw new Error("Failed to fetch facilities");
  }
  if (response.status === 404) {
    return null;
  }
  const data = await response.json() as FacilitySearchResponse;
  return FacilitySearchResponseSchema.parse(data);
};

const FacilitySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  address: z.string(),
  zip_code: z.number(),
  available_capacity: z.boolean(),
  image_url: z.string().url().optional(),
  has_stationary_care: z.boolean(),
  has_ambulatory_care: z.boolean(),
  has_day_care: z.boolean(),
  from_zip_code: z.number(),
  to_zip_code: z.number(),
});

export type Facility = z.infer<typeof FacilitySchema>;

export const getFacilityBySlug = async (slug: string): Promise<Facility> => {
  const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/api/v1/care-facilities/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch facility");
  }
  const data = await response.json() as Facility;
  return FacilitySchema.parse(data);
};