import { useEffect, useMemo, useRef, useState } from "react"
import {
  Marker,
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  DirectionsRenderer,
} from "react-google-maps"

import type { Restaurant as RestaurantType } from "~/types"
import type { Coordinates } from "~/types"
import { isXSmall } from "~/utils/mediaQuery"
import {
  getDirections,
  getShortestDirectionsInTime,
  GOOGLE_MAP_URL,
  MAP_SETTINGS,
} from "~/utils/google"
import styles from "~/styles/restaurant.css"

import mapStyles from "~/styles/mapStyles.json"
import { calculateTotalRating } from "~/utils/ratings"

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export const Restaurant: React.FC<{ restaurant: RestaurantType }> = ({
  restaurant,
}) => {
  const shortestDirections = getShortestDirectionsInTime(restaurant)

  return (
    <>
      <Rating restaurant={restaurant} />
      <div className="mapContainer">
        <Info>
          {!restaurant.hasLunch && (
            <div className="warning">
              <img src="/icons/warning.png" className="icon" alt="Warning" />
              This restaurant might not have lunch!
            </div>
          )}
          <div>
            <img
              src="/icons/map-location.png"
              className="icon"
              alt="Distance to location"
            />
            <div>{shortestDirections.routes[0].legs[0].distance?.text}</div>
          </div>
          <div>
            <img
              src="/icons/clock.png"
              className="icon"
              alt="Distance to location"
            />
            <div>{shortestDirections.routes[0].legs[0].duration?.text}</div>
          </div>
        </Info>
        <Map
          origin={shortestDirections.request.origin.location}
          destination={restaurant}
          fetchFreshDirection={!restaurant.directions}
          googleMapURL={GOOGLE_MAP_URL}
          loadingElement={<div className="map" />}
          containerElement={<div className="map" />}
          mapElement={<div className="map" />}
        />
      </div>
    </>
  )
}

const Rating: React.FC<{ restaurant: RestaurantType }> = ({ restaurant }) => {
  const { text, starsComponent } = useMemo(
    () => calculateTotalRating(restaurant),
    [restaurant]
  )

  return (
    <div className="rating">
      <div className="stars">{starsComponent}</div>
      {text}
    </div>
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
      destination: RestaurantType
      fetchFreshDirection?: boolean
    }) => {
      const mapRef = useRef(null)
      const [directions, setDirections] =
        useState<google.maps.DirectionsResult>(
          getShortestDirectionsInTime(destination)
        )

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
