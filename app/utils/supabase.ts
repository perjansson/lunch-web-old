import { createClient } from "@supabase/supabase-js"
import { addDays } from "date-fns"
import type {
  Coordinates,
  Rating,
  RatingValue,
  Recommendation,
  Restaurant,
} from "~/types"
import env from "./environment"
import { getCoordinatesForAddress, getDirections } from "./google"

const supabaseUrl = env.SUPABASE_URL
const supabaseKey = env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    `Missing Supabase config url: ${supabaseUrl} key: ${supabaseKey}`
  )
}

const supabase = createClient(supabaseUrl, supabaseKey)

export function getAllRestaurants() {
  return supabase.from<Restaurant>("Restaurant").select(
    `
    *,
    Recommendation (
      *,
      Restaurant (
        *
      ),
      Rating (
        *
      )
    )
  `
  )
}

export function getRestaurantById(restaurantId: string) {
  return supabase
    .from<Restaurant>("Restaurant")
    .select(
      `
      *,
      Recommendation (
        *,
        Restaurant (
          *
        ),
        Rating (
          *
        )
      )
    `
    )
    .eq("id", restaurantId)
    .single()
}

// NOTE: This costs money in Google Cloud per transaction to do
export async function getAllRestaurantsWithCoordinates() {
  const res = await getAllRestaurants()

  res.data?.forEach((restaurant) => {
    updateCoordsForRestaurant(restaurant)
  })

  return res
}

// NOTE: This costs money in Google Cloud per transaction to do
export async function getAllRestaurantsWithDirections(origin: Coordinates) {
  const delay = (time: number) =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, time)
    })

  const res = await getAllRestaurants()

  for (const r of res.data ?? []) {
    updateDirectionsForRestaurant(origin, r)
    await delay(3000)
  }

  return res
}

async function updateCoordsForRestaurant(restaurant: Restaurant) {
  try {
    const coords = await getCoordinatesForAddress(restaurant.address)

    const { error } = await supabase
      .from<Restaurant>("Restaurant")
      .update({ lat: coords.lat, lng: coords.lng })
      .eq("id", restaurant.id)

    if (error) {
      console.error(
        `Error updating coords to Supabase for ${restaurant.name}: ${error.message}`
      )
    }
  } catch (error: any) {
    console.error(
      `Error getting coords from Google for ${restaurant.name}: ${error.message}`
    )
  }
}

async function updateDirectionsForRestaurant(
  origin: Coordinates,
  restaurant: Restaurant
) {
  try {
    const directions = await getDirections(origin, restaurant)

    const { error } = await supabase
      .from<Restaurant>("Restaurant")
      .update({ directionsAlternative: directions })
      .eq("id", restaurant.id)

    if (error) {
      console.error(
        `Error updating direction to Supabase for ${restaurant.name}: ${error.message}`
      )
    }
  } catch (error: any) {
    console.error(
      `Error getting direction from Google for ${restaurant.name}: ${error.message}`
    )
  }
}

export function getAllRecommendations(options?: {
  notRecommendedLastDays?: number
  restaurantId?: number
}) {
  const { notRecommendedLastDays, restaurantId } = options || {}
  let query = supabase.from<Recommendation>("Recommendation").select(
    `
      *,
      Restaurant (
        *
      ),
      Rating (
        *
      )
    `
  )

  if (notRecommendedLastDays) {
    const date = addDays(new Date(), -notRecommendedLastDays)
    query.gt("when", date.toISOString())
  }

  if (restaurantId) {
    query.eq("restaurantId", restaurantId)
  }

  return query
}

export async function getRecommendationAt(when: Date) {
  const { data: recommendation } = await supabase
    .from<Recommendation>("Recommendation")
    .select(
      `
        *,
        Restaurant (
          *
        ),
        Rating (
          *
        )
      `
    )
    .eq("when", when.toISOString())
    .single()

  return recommendation
}

export async function createRecommendationAt(
  restaurant: Restaurant,
  when: Date
) {
  const { error } = await supabase
    .from<Recommendation>("Recommendation")
    .insert([{ restaurantId: restaurant.id, when: when.toISOString() }])

  if (error) {
    console.error(
      `Error creating recommendation to Supabase for ${
        restaurant.name
      } at ${when.toISOString()}: ${error.message}`
    )
  }
}

export async function saveRating(
  recommendation: Recommendation,
  rating: RatingValue
) {
  const { error } = await supabase
    .from<Rating>("Rating")
    .insert([{ recommendationId: recommendation.id, rating }])

  if (error) {
    console.error(
      `Error creating rating to Supabase for recommendation ${recommendation.id} with rating ${rating}: ${error.message}`
    )
  }
}
