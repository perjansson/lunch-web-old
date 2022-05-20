import type { ActionFunction } from "@remix-run/node"
import { Recommendation, Restaurant } from "~/types"
import { getShortestDirectionsInTime } from "~/utils/google"
import { loader as indexLoader } from "../index"

interface LoaderData {
  response_type?: "in_channel"
  text: string
}

export const action: ActionFunction = async (
  dataFunctionArgs
): Promise<LoaderData> => {
  try {
    const {
      recommendation: existingRecommendationForToday,
      restaurant: randomRestaurantToRecommendForToday,
    }: { recommendation?: Recommendation; restaurant?: Restaurant } =
      await indexLoader(dataFunctionArgs)

    if (
      !existingRecommendationForToday &&
      !randomRestaurantToRecommendForToday
    ) {
      return {
        text: "Oh no, there is no lunch recommendation yet for today. Perhaps you can go to https://lunch-web.fly.dev and randomize one?",
      }
    }

    const restaurant =
      existingRecommendationForToday?.Restaurant ||
      randomRestaurantToRecommendForToday

    if (!restaurant) {
      return {
        text: "Oh no, there was no restaurant randomized. Perhaps you can go to https://lunch-web.fly.dev and randomize one?",
      }
    }

    const directions = getShortestDirectionsInTime(restaurant)

    return {
      response_type: "in_channel",
      text: `Today's lunch recommendation is *${restaurant.name}* on ${restaurant.address}.\n
It takes ${directions.routes[0].legs[0].duration?.text} to walk the ${directions.routes[0].legs[0].distance?.text} to the restaurant. Check out map directions at https://lunch-web.fly.dev. Bon appetit! :chefs-kiss:`,
    }
  } catch (error) {
    return {
      text: `Something went wrong, full error message: ${getErrorMessage(
        error
      )}`,
    }
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  } else {
    return String(error)
  }
}
