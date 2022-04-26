import type { Coordinates } from "~/types"
import env from "./environment"

const googleApiKey = env.GOOGLE_API_KEY

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
) {
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
        if (status === window.google.maps.DirectionsStatus.OK) {
          resolve(result)
        } else {
          reject(status)
        }
      }
    )
  })
}
