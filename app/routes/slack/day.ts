import type { ActionFunction } from "@remix-run/node"
import { getShortestDirectionsInTime } from "~/utils/google"
import { loader as indexLoader } from "../index"

interface LoaderData {
  response_type?: "in_channel"
  text: string
}

export const action: ActionFunction = async (
  dataFunctionArgs
): Promise<LoaderData> => {
  const { recommendation } = await indexLoader(dataFunctionArgs)

  if (!recommendation || !recommendation.Restaurant) {
    return { text: "Snap, something went wrong!" }
  }

  const restaurant = recommendation.Restaurant
  const directions = getShortestDirectionsInTime(restaurant)

  return {
    response_type: "in_channel",
    text: `Today's lunch recommendation is *${restaurant.name}* on ${restaurant.address}.\n
It takes ${directions.routes[0].legs[0].duration?.text} to walk the ${directions.routes[0].legs[0].distance?.text} to the restaurant. Check out map directions at https://lunch-web.fly.dev. Bon appetit! :chefs-kiss:`,
  }
}
