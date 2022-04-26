import { useLoaderData } from "@remix-run/react"
import { useEffect, useMemo, useRef, useState } from "react"
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
import {
  getDirections,
  GOOGLE_MAP_URL,
  MAP_SETTINGS,
  ORIGIN,
} from "~/utils/google"
import { isXSmall } from "~/utils/mediaQuery"

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

  // Uncomment to update directions for all restaurant.
  // PLEASE NOTE: THIS COSTS MONEY FOR GOOGLE CLOUD
  // useEffect(() => {
  //   getAllRestaurantsWithDirections(ORIGIN)
  // }, [])

  if (!restaurant) {
    return null
  }

  return (
    <section className="container">
      <header className="header">
        <h1 className="title">{restaurant.name}</h1>
        <address>{restaurant.address}</address>
      </header>
      <div className="mapContainer">
        <Info>
          <div>
            <img
              src="/icons/map-location.png"
              className="icon"
              alt="Distance to location"
            />
            <div>{restaurant.directions?.routes[0].legs[0].distance?.text}</div>
          </div>
          <div>
            <img
              src="/icons/clock.png"
              className="icon"
              alt="Distance to location"
            />
            <div>{restaurant.directions?.routes[0].legs[0].duration?.text}</div>
          </div>{" "}
        </Info>
        <Map
          origin={ORIGIN}
          destination={restaurant}
          fetchFreshDirection={!restaurant.directions}
          googleMapURL={GOOGLE_MAP_URL}
          loadingElement={<div className="map" />}
          containerElement={<div className="map" />}
          mapElement={<div className="map" />}
        />
      </div>
    </section>
  )
}

const Info: React.FC = ({ children }) => <div className="info">{children}</div>

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
      const [directions, setDirections] =
        useState<google.maps.DirectionsResult>(destination.directions)

      useEffect(() => {
        if (!origin || !destination || !fetchFreshDirection) {
          return
        }

        const fetchDirections = async () => {
          try {
            setDirections(await getDirections(origin, destination))
          } catch (error) {
            console.error("Error getting directions from Google Maps", error)
          }
        }

        fetchDirections()
      }, [origin, destination, fetchFreshDirection])

      const center = {
        lat: origin.lat + (destination.lat - origin.lat) / 2,
        lng: origin.lng + (destination.lng - origin.lng) / 2,
      }

      return (
        <GoogleMap
          ref={mapRef}
          defaultZoom={isXSmall() ? 13 : 15}
          defaultCenter={center}
          defaultOptions={{
            ...MAP_SETTINGS.DEFAULT_MAP_OPTIONS,
            styles: mapStyles,
          }}
        >
          <Marker position={origin} />
          <Marker position={destination} />
          <DirectionsRenderer
            directions={directions}
            options={MAP_SETTINGS.DIRECTIONS_OPTIONS}
          />
        </GoogleMap>
      )
    }
  )
)
