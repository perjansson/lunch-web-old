import type { DataFunctionArgs } from "@remix-run/node"
import type { Error, Restaurant } from "~/types"
import { logAndReturnError } from "~/utils/log"
import { getAllRecommendations, getAllRestaurants } from "~/utils/supabase"
import { getShortestDirectionsInTime } from "../utils/google"

const MAX_MINUTES_PARAM = "maxminutes"
const MAX_METERS_PARAM = "maxmeters"

export interface RandomRestaurantLoaderData {
  restaurant?: Restaurant
  error?: Error
}

interface Args extends DataFunctionArgs {
  notRecommendedLastDays?: number
}

export const randomRestaurantLoader: (
  args: Args
) => Promise<RandomRestaurantLoaderData> = async ({
  request,
  notRecommendedLastDays,
}) => {
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
  const restaurantsToRandomize = await getRestaurantsToRandomize(
    restaurants,
    searchParams,
    notRecommendedLastDays
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

async function getRestaurantsToRandomize(
  restaurants: Restaurant[],
  searchParams: URLSearchParams,
  notRecommendedLastDays?: number
): Promise<Restaurant[]> {
  if (
    !searchParams.has(MAX_MINUTES_PARAM) &&
    !searchParams.has(MAX_METERS_PARAM) &&
    !notRecommendedLastDays
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

  const recommendations = notRecommendedLastDays
    ? (await getAllRecommendations(notRecommendedLastDays)).data ?? []
    : []

  return restaurants
    .filter((restaurant) => {
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
    .filter(
      (restaurant) =>
        !recommendations.find(
          ({ restaurantId }) => restaurantId === restaurant.id
        )
    )
}
