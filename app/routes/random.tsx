import { useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import {
  Marker,
  GoogleMap,
  // InfoWindow,
  withScriptjs,
  withGoogleMap,
  // DirectionsRenderer,
} from "react-google-maps";
import mapStyles from "~/styles/mapStyles.json";

import type { Coordinates, Restaurant } from "~/types";
import { getAllRestaurants } from "~/utils/supabase";

import styles from "~/styles/random.css";
import env from "~/utils/environment";

const GOOGLE_MAP_URL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${env.GOOGLE_API_KEY}`;

const ORIGIN = { lat: 60.44847, lng: 22.26732 };

const MAP_SETTINGS = {
  DEFAULT_MAP_OPTIONS: {
    scrollwheel: false,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
  },
  DEFAULT_CENTER: ORIGIN,
  DEFAULT_ZOOM: 12,
  MARKER_SIZE: 35,
  PIXEL_OFFSET: {
    MARKER: {
      X: 0,
      Y: -35,
    },
  },
  DIRECTIONS_OPTIONS: { suppressMarkers: true, preserveViewport: true },
};

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

interface LoaderData {
  restaurants: Restaurant[] | null;
}

export const loader = async () => {
  const { data: restaurants, error } = await getAllRestaurants();

  if (error) {
    console.error("Error getting restaurants from Supabase", error.message);
  }

  return {
    restaurants,
  };
};

export default function Index() {
  const { restaurants } = useLoaderData<LoaderData>();
  const [randomRestaurant, setRandomRestaurant] = useState<
    Restaurant | undefined
  >();

  useEffect(() => {
    if (randomRestaurant || !restaurants) {
      return;
    }

    setRandomRestaurant(
      restaurants[Math.floor(Math.random() * restaurants.length)]
    );
  }, [randomRestaurant, restaurants]);

  if (!randomRestaurant) {
    return null;
  }

  return (
    <section className="container">
      <header className="header">
        <h1 className="title">{randomRestaurant.name}</h1>
      </header>
      <Map
        origin={ORIGIN}
        destination={randomRestaurant}
        googleMapURL={GOOGLE_MAP_URL}
        loadingElement={<div className="map" />}
        containerElement={<div className="map" />}
        mapElement={<div className="map" />}
      />
      <address>{randomRestaurant.address}</address>
    </section>
  );
}

const Map = withScriptjs(
  withGoogleMap(
    ({
      origin,
      destination,
    }: {
      origin: Coordinates;
      destination: Coordinates;
    }) => {
      const mapRef = useRef(null);

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
          <Marker position={origin} />
          <Marker
            position={{
              lat: parseFloat(destination.lat + ""),
              lng: parseFloat(destination.lng + ""),
            }}
          />
        </GoogleMap>
      );
    }
  )
);
