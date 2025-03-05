import { z } from "zod";
import { env } from "~/env";

type CareType = "stationary" | "ambulatory" | "daycare";

const FacilitySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  address: z.string(),
  zipCode: z.string(),
  careType: z.string(),
  imageUrl: z.string().url(),
});

type Facility = z.infer<typeof FacilitySchema>;

export const getNearestFacility = async (careType: CareType, zipCode?: string): Promise<Facility | null> => {
  const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/api/v1/facilities/nearest?careType=${careType}&zipCode=${zipCode}`);
  if (!response.ok && response.status !== 404) {
    throw new Error("Failed to fetch facilities");
  }
  if (response.status === 404) {
    return null;
  }
  const data = await response.json() as Facility;
  return FacilitySchema.parse(data);
};
