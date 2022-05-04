import { useEffect, useState } from "react"
import { Link, useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/node"

import { Page, links as pageLinks } from "~/components/Page"
import styles from "~/styles/list.css"
import { getAllRestaurants } from "~/utils/supabase"
import type { Restaurant, Error } from "~/types"
import { logAndReturnError } from "~/utils/log"
import { getShortestDirectionsInTime } from "~/utils/google"
import { calculateTotalRating } from "~/utils/ratings"

export function links() {
  return [...pageLinks(), { rel: "stylesheet", href: styles }]
}

interface LoaderData {
  restaurants?: Restaurant[]
  error?: Error
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const { data: restaurants, error } = await getAllRestaurants()

  if (error) {
    return logAndReturnError("Error getting restaurants from Supabase", error)
  }

  return { restaurants }
}

type SortType = "name" | "distance" | "duration" | "rating"

const SortFnMap: {
  [key in SortType]: (a: Restaurant, b: Restaurant) => number
} = {
  name: sortByName,
  distance: sortByDistance,
  duration: sortByDuration,
  rating: sortByRating,
}

export default function List() {
  const { restaurants, error } = useLoaderData<LoaderData>()
  const [sortedRestaurants, setSortedRestaurants] = useState<Restaurant[]>()
  const [sortBy, setSortBy] = useState<SortType>("name")

  useEffect(() => {
    setSortedRestaurants([...(restaurants ?? [])].sort(SortFnMap[sortBy]))
  }, [restaurants, sortBy])

  if (error) {
    return <section className="container">{error?.message}</section>
  }

  if (!sortedRestaurants) {
    return null
  }

  return (
    <Page
      title="All restaurants"
      subTitle="Restaurants with a * might not have lunch"
    >
      <div className="restaurantLink header">
        <button onClick={() => setSortBy("name")} className="restaurantName">
          Name
        </button>
        <button onClick={() => setSortBy("distance")}>Distance</button>
        <button onClick={() => setSortBy("duration")}>Walk time</button>
        <button onClick={() => setSortBy("rating")} className="rating">
          Rating
        </button>
      </div>
      {sortedRestaurants?.map((restaurant) => {
        const shortestDirection =
          getShortestDirectionsInTime(restaurant).routes[0].legs[0]

        const { starsComponent, averageRating } =
          calculateTotalRating(restaurant)

        return (
          <div key={restaurant.id} className="restaurantLink">
            <div className="restaurantName">
              <Link to={`/restaurant/${restaurant.id}`}>{restaurant.name}</Link>
              <span> {!restaurant.hasLunch ? "*" : ""}</span>
            </div>
            <div>{shortestDirection.distance?.text}</div>
            <div>{shortestDirection.duration?.text}</div>
            <div className="rating">
              <div className="star">{starsComponent}</div>
              <div className="text">{averageRating}</div>
            </div>
          </div>
        )
      })}
    </Page>
  )
}

function sortByName(a: Restaurant, b: Restaurant): number {
  if (a.name < b.name) {
    return -1
  }

  if (a.name > b.name) {
    return 1
  }

  return 0
}

function sortByDistance(
  restaurantA: Restaurant,
  restaurantB: Restaurant
): number {
  const a =
    getShortestDirectionsInTime(restaurantA).routes[0].legs[0].distance?.value
  const b =
    getShortestDirectionsInTime(restaurantB).routes[0].legs[0].distance?.value

  return a! - b!
}

function sortByDuration(
  restaurantA: Restaurant,
  restaurantB: Restaurant
): number {
  const a =
    getShortestDirectionsInTime(restaurantA).routes[0].legs[0].duration?.value
  const b =
    getShortestDirectionsInTime(restaurantB).routes[0].legs[0].duration?.value

  return a! - b!
}

function sortByRating(
  restaurantA: Restaurant,
  restaurantB: Restaurant
): number {
  const { averageRating: a } = calculateTotalRating(restaurantA)
  const { averageRating: b } = calculateTotalRating(restaurantB)

  if (!a && !b) {
    return 0
  }

  if (!a && b) {
    return 1
  }

  if (a && !b) {
    return -1
  }

  if (a! < b!) {
    return 1
  }

  if (a! > b!) {
    return -1
  }

  return 0
}
