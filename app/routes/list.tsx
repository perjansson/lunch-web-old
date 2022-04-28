import { Link, useLoaderData } from "@remix-run/react"

import { Page, links as pageLinks } from "~/components/Page"
import styles from "~/styles/list.css"
import type { LoaderFunction } from "@remix-run/node"
import { getAllRestaurants } from "~/utils/supabase"
import type { Restaurant } from "~/types"
import type { Error } from "~/types"
import { logAndReturnError } from "~/utils/log"
import { getShortestDirectionsInTime } from "~/utils/google"
import { useEffect, useState } from "react"

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

type SortType = "name" | "distance" | "duration"

const SortFnMap: {
  [key in SortType]: (a: Restaurant, b: Restaurant) => number
} = {
  name: sortByName,
  distance: sortByDistance,
  duration: sortByDuration,
}

export default function List() {
  const { restaurants, error } = useLoaderData<LoaderData>()
  const [sortedRestaurants, setSortedRestaurants] = useState<Restaurant[]>()
  const [sortBy, setSortBy] = useState<SortType>("name")

  useEffect(() => {
    setSortedRestaurants(restaurants?.sort(SortFnMap[sortBy]))
  }, [restaurants, sortBy])

  if (error) {
    return <section className="container">{error?.message}</section>
  }

  if (!sortedRestaurants) {
    return null
  }

  return (
    <Page title="All restaurants">
      <div className="restaurantLink header">
        <a
          href="#"
          onClick={() => setSortBy("name")}
          className={"restaurantName"}
        >
          Name
        </a>
        <a href="#" onClick={() => setSortBy("distance")}>
          Distance
        </a>
        <a href="#" onClick={() => setSortBy("duration")}>
          Walk time
        </a>
      </div>
      {sortedRestaurants?.map((restaurant) => {
        const shortestDirection =
          getShortestDirectionsInTime(restaurant).routes[0].legs[0]

        return (
          <div key={restaurant.id} className="restaurantLink">
            <Link
              to={`/restaurant/${restaurant.id}`}
              className="restaurantName"
            >
              {restaurant.name}
            </Link>
            <div>{shortestDirection.distance?.text}</div>
            <div>{shortestDirection.duration?.text}</div>
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
