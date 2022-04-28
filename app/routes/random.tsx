import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/node"
import type { Error, Restaurant } from "~/types"
import { getAllRestaurants } from "~/utils/supabase"

import { getShortestDirectionsInTime } from "~/utils/google"
import { Reastaurant, links as restaurantLinks } from "~/components/Restaurant"
import { logAndReturnError } from "~/utils/log"
import { Page, links as pageLinks } from "~/components/Page"

const MAX_MINUTES_PARAM = "maxminutes"
const MAX_METERS_PARAM = "maxmeters"

interface LoaderData {
  restaurant?: Restaurant
  error?: Error
}

export function links() {
  return [...restaurantLinks(), ...pageLinks()]
}

export const loader: LoaderFunction = async ({ request }) => {
  const { data: restaurants, error } = await getAllRestaurants()

  if (error) {
    return logAndReturnError("Error getting restaurants from Supabase", error)
  }

  if (!restaurants || restaurants.length === 0) {
    return logAndReturnError(
      "No restaurants received from Supabase, hope you brought a lunch box from home"
    )
  }

  const { searchParams } = new URL(request.url)
  const restaurantsToRandomize = getRestaurantsToRandomize(
    restaurants,
    searchParams
  )

  try {
    const restaurant =
      restaurantsToRandomize[
        Math.floor(Math.random() * restaurantsToRandomize.length)
      ]

    if (!restaurant) {
      return logAndReturnError(`Snap, no restaurant found, no lunch for you!`)
    }

    return {
      restaurant,
    }
  } catch (error) {
    return logAndReturnError(error as string)
  }
}

function getRestaurantsToRandomize(
  restaurants: Restaurant[],
  searchParams: URLSearchParams
): Restaurant[] {
  if (
    !searchParams.has(MAX_MINUTES_PARAM) &&
    !searchParams.has(MAX_METERS_PARAM)
  ) {
    return restaurants
  }

  const maxSeconds = searchParams.has(MAX_MINUTES_PARAM)
    ? parseFloat(searchParams.get(MAX_MINUTES_PARAM)!) * 60
    : null
  const maxMeters = searchParams.has(MAX_METERS_PARAM)
    ? parseFloat(searchParams.get(MAX_METERS_PARAM)!)
    : null

  if (
    (searchParams.has(MAX_MINUTES_PARAM) && !maxSeconds) ||
    (searchParams.has(MAX_METERS_PARAM) && !maxMeters)
  ) {
    throw `Please provide better parameters, you want to have lunch do you?`
  }

  return restaurants.filter((restaurant) => {
    const shortestDirections = getShortestDirectionsInTime(restaurant)
    const restaurantSeconds =
      shortestDirections.routes[0].legs[0].duration!.value
    const restaurantMeters =
      shortestDirections.routes[0].legs[0].distance!.value

    if (maxSeconds && restaurantSeconds > maxSeconds) {
      return false
    }

    if (maxMeters && restaurantMeters > maxMeters) {
      return false
    }

    return true
  })
}

export default function Index() {
  const { restaurant, error } = useLoaderData<LoaderData>()

  // Uncomment to update directions for all restaurant.
  // PLEASE NOTE: THIS COSTS MONEY FOR GOOGLE CLOUD
  // useEffect(() => {
  //   getAllRestaurantsWithDirections(OFFICE_RIVER_SIDE)
  // }, [])

  if (!restaurant || error) {
    return <section className="container">{error?.message}</section>
  }

  return (
    <Page
      title={restaurant.name}
      subTitle={<address>{restaurant.address}</address>}
    >
      <Reastaurant restaurant={restaurant} />
    </Page>
  )
}
