import type { Coordinates } from "~/types";
import env from "./environment";

const googleApiKey = env.GOOGLE_API_KEY;

export async function getCoordinatesForAddress(
  address: string
): Promise<Coordinates> {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleApiKey}`
  );

  if (!res.ok) {
    throw new Error(`Error getting coordinates for ${address}`);
  }

  const data = await res.json();
  return data.results[0].geometry.location;
}
