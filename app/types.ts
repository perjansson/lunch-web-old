import type { PostgrestError } from "@supabase/supabase-js"

export interface Coordinates {
  lat: number
  lng: number
}

export interface Restaurant {
  id: number
  name: string
  address: string
  hasLunch: boolean
  lat: number
  lng: number
  directions: google.maps.DirectionsResult
  directionsAlternative: google.maps.DirectionsResult
  Recommendation?: Array<Recommendation>
}

export interface Recommendation {
  id: number
  restaurantId: number
  when: string // ISO date format
  Restaurant?: Restaurant
  Rating?: Array<Rating>
}

export interface Rating {
  id: number
  recommendationId: number
  rating: RatingValue
}

export const maxRatingValue = 5 as const
export type MaxRatingValue = typeof maxRatingValue
/*
 * 5 = Top notch, would go here every day of the week
 * 4 = Great, will come back for sure
 * 3 = Good, may or may not come back again
 * 2 = Not impressed, could maybe consider coming here again if Sauli pays
 * 1 = Really bad, wild horses can't drag me here ever again
 */
export type RatingValue = 1 | 2 | 3 | 4 | MaxRatingValue

export interface Error {
  message: string
  originalError: PostgrestError | null
}
