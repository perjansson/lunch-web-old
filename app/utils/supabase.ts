import { createClient } from "@supabase/supabase-js";
import type { Restaurant } from "~/types";
import env from "./environment";
import { getCoordinatesForAddress } from "./google";

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    `Missing Supabase config url: ${supabaseUrl} key: ${supabaseKey}`
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

export function getAllRestaurants() {
  return supabase.from<Restaurant>("Restaurant").select("*");
}

export async function updateCoordsForRestaurant(restaurant: Restaurant) {
  try {
    const coords = await getCoordinatesForAddress(restaurant.address);

    const { error } = await supabase
      .from<Restaurant>("Restaurant")
      .update({ lat: coords.lat, lng: coords.lng })
      .eq("id", restaurant.id);

    if (error) {
      console.error(
        `Error updating coords to Supabase for ${restaurant.name}: ${error.message}`
      );
    }
  } catch (error: any) {
    console.error(
      `Error getting coords from Google for ${restaurant.name}: ${error.message}`
    );
  }
}

export async function getAllRestaurantsWithCoordinates() {
  const res = await getAllRestaurants();

  res.data?.forEach((restaurant) => {
    updateCoordsForRestaurant(restaurant);
  });

  return res;
}
