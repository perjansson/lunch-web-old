import { useLoaderData } from "@remix-run/react"
import { useEffect, useRef, useState } from "react"
import {
  Marker,
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  DirectionsRenderer,
} from "react-google-maps"
import mapStyles from "~/styles/mapStyles.json"

import type { Coordinates, Restaurant } from "~/types"
import {
  getAllRestaurants,
  getAllRestaurantsWithDirections,
} from "~/utils/supabase"

import styles from "~/styles/random.css"
import env from "~/utils/environment"
import { getDirections } from "~/utils/google"

const GOOGLE_MAP_URL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${env.GOOGLE_API_KEY}`

const ORIGIN = { lat: 60.44847, lng: 22.26732 }

const MAP_SETTINGS = {
  DEFAULT_MAP_OPTIONS: {
    scrollwheel: false,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
  },
  DEFAULT_CENTER: ORIGIN,
  DEFAULT_ZOOM: 15,
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

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

interface LoaderData {
  restaurants: Restaurant[] | null
}

export const loader = async () => {
  const { data: restaurants, error } = await getAllRestaurants()

  if (error) {
    console.error("Error getting restaurants from Supabase", error.message)
  }

  return {
    restaurants,
  }
}

export default function Index() {
  const { restaurants } = useLoaderData<LoaderData>()
  const [restaurant, setRestaurant] = useState<Restaurant | undefined>()

  useEffect(() => {
    if (restaurant || !restaurants) {
      return
    }

    setRestaurant(restaurants[Math.floor(Math.random() * restaurants.length)])
  }, [restaurant, restaurants])

  if (!restaurant) {
    return null
  }

  return (
    <section className="container">
      <header className="header">
        <h1 className="title">{restaurant.name}</h1>
      </header>
      <Map
        origin={ORIGIN}
        destination={restaurant}
        fetchFreshDirection={!restaurant.direction}
        googleMapURL={GOOGLE_MAP_URL}
        loadingElement={<div className="map" />}
        containerElement={<div className="map" />}
        mapElement={<div className="map" />}
      />
      <address>{restaurant.address}</address>
    </section>
  )
}

const Map = withScriptjs(
  withGoogleMap(
    ({
      origin,
      destination,
      fetchFreshDirection,
    }: {
      origin: Coordinates
      destination: Restaurant
      fetchFreshDirection?: boolean
    }) => {
      const mapRef = useRef(null)
      const [directions, setDirections] = useState<string>(
        destination.direction
      )

      useEffect(() => {
        if (!origin || !destination || !fetchFreshDirection) {
          return
        }

        const fetchDirections = async () => {
          try {
            const directions = await getDirections(origin, destination)
            setDirections(JSON.stringify(directions))
          } catch (error) {
            console.error("### ERROR getting Maps directions", error)
          }
        }

        fetchDirections()
      }, [origin, destination, fetchFreshDirection])

      return (
        <GoogleMap
          ref={mapRef}
          defaultZoom={MAP_SETTINGS.DEFAULT_ZOOM}
          defaultCenter={MAP_SETTINGS.DEFAULT_CENTER}
          defaultOptions={{
            ...MAP_SETTINGS.DEFAULT_MAP_OPTIONS,
            styles: mapStyles,
          }}
        >
          <Marker
            position={{
              lat: parseFloat(origin.lat),
              lng: parseFloat(origin.lng),
            }}
          />
          <Marker
            position={{
              lat: parseFloat(destination.lat),
              lng: parseFloat(destination.lng),
            }}
          />
          <DirectionsRenderer
            directions={JSON.parse(directions)}
            options={MAP_SETTINGS.DIRECTIONS_OPTIONS}
          />
        </GoogleMap>
      )
    }
  )
)
