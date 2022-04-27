import type { Coordinates, Restaurant } from "~/types"
import env from "./environment"

const googleApiKey = env.GOOGLE_API_KEY

export const GOOGLE_MAP_URL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${googleApiKey}`

export const OFFICE_INNER_COURTYARD = { lat: 60.44847, lng: 22.26732 }
export const OFFICE_RIVER_SIDE = { lat: 60.44825, lng: 22.26706 }

// 60.44825005805266, 22.267069131121374

export const MAP_SETTINGS = {
  DEFAULT_MAP_OPTIONS: {
    scrollwheel: false,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
  },
  MARKER_SIZE: 35,
  PIXEL_OFFSET: {
    MARKER: {
      X: 0,
      Y: -35,
    },
  },
  DIRECTIONS_OPTIONS: {
    suppressMarkers: true,
    preserveViewport: true,
  },
}

export async function getCoordinatesForAddress(
  address: string
): Promise<Coordinates> {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleApiKey}`
  )

  if (!res.ok) {
    throw new Error(`Error getting coordinates for ${address}`)
  }

  const data = await res.json()
  return data.results[0].geometry.location
}

export async function getDirections(
  origin: Coordinates,
  destination: Coordinates
): Promise<google.maps.DirectionsResult> {
  const DirectionsService = new window.google.maps.DirectionsService()
  return new Promise((resolve, reject) => {
    DirectionsService.route(
      {
        origin: new window.google.maps.LatLng(origin),
        destination: new window.google.maps.LatLng(destination),
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (
          status === window.google.maps.DirectionsStatus.OK &&
          result !== null
        ) {
          resolve(result)
        } else {
          reject(status)
        }
      }
    )
  })
}

export function getShortestDirectionsInTime(
  restaurant: Restaurant
): google.maps.DirectionsResult {
  const directionValue =
    restaurant.directions!.routes[0].legs[0].duration!.value
  const directionAlternativeValue =
    restaurant.directionsAlternative!.routes[0].legs[0].duration!.value

  return directionValue < directionAlternativeValue
    ? restaurant.directions
    : restaurant.directionsAlternative
}
