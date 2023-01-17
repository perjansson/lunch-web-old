import type { ActionFunction } from "@remix-run/node"
import type { Recommendation, Restaurant } from "~/types"
import { getShortestDirectionsInTime } from "~/utils/google"
import { loader as indexLoader } from "../index"

interface LoaderData {
  response_type?: "in_channel"
  text: string
}

let jokeCounter = 0

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

    let restaurant =
      existingRecommendationForToday?.Restaurant ||
      randomRestaurantToRecommendForToday

    if (!restaurant) {
      return {
        text: "Oh no, there was no restaurant randomized. Perhaps you can go to https://lunch-web.fly.dev and randomize one?",
      }
    }

    // TEMPORARY BLANKO & KELLARI JOKE BY SAULI AND PER
    const currentDate = new Date()
    const endJokeDate = new Date("2023-02-01")

    if (currentDate < endJokeDate) {
      const jokeRestaurant =
        jokeCounter % 2 === 1
          ? {
              name: "Kellari",
              address: "Linnankatu 16, 20100 Turku",
              time: "1 min",
              distance: "84m",
            }
          : {
              name: "Blanko",
              address: "Aurakatu 1, 20100 Turku",
              time: "2 min",
              distance: "200m",
            }

      jokeCounter++

      return {
        response_type: "in_channel",
        text: `Today's lunch recommendation is *${jokeRestaurant.name}* on ${jokeRestaurant.address}.\n
It takes ${jokeRestaurant.time} to walk the ${jokeRestaurant.distance} to the restaurant. Check out map directions at https://lunch-web.fly.dev. Bon appetit! :chefs-kiss:`,
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
