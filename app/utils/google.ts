import type { Coordinates } from "~/types"
import env from "./environment"

const googleApiKey = env.GOOGLE_API_KEY

export const GOOGLE_MAP_URL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${googleApiKey}`

export const ORIGIN = { lat: 60.44847, lng: 22.26732 }

export const MAP_SETTINGS = {
  DEFAULT_MAP_OPTIONS: {
    scrollwheel: false,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
  },
  DEFAULT_CENTER: ORIGIN,
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
        origin: new window.google.maps.LatLng(
          parseFloat(origin.lat),
          parseFloat(origin.lng)
        ),
        destination: new window.google.maps.LatLng(
          parseFloat(destination.lat),
          parseFloat(destination.lng)
        ),
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
