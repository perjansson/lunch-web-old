import type { ActionFunction } from "@remix-run/node"
import { loader as indexLoader } from "../index"

interface LoaderData {
  response_type?: "in_channel"
  text: string
}

export const action: ActionFunction = async (
  dataFunctionArgs
): Promise<LoaderData> => {
  const { reservation } = await indexLoader(dataFunctionArgs)

  if (!reservation) {
    return { text: "Snap, something went wrong!" }
  }

  return {
    response_type: "in_channel",
    text: `Today's recommendation is: ${reservation.Restaurant.name}. Check it out at https://lunch-web.fly.dev. Bon appetit! :chefs-kiss:`,
  }
}
