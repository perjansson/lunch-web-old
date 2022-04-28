import type { PostgrestError } from "@supabase/supabase-js"

export interface Coordinates {
  lat: number
  lng: number
}

export interface Restaurant {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  directions: google.maps.DirectionsResult
  directionsAlternative: google.maps.DirectionsResult
}

export interface Reservation {
  id: number
  restaurantId: number
  when: string // ISO date format
  Restaurant?: Restaurant
}

export interface Error {
  message: string
  originalError: PostgrestError | null
}
