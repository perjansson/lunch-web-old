import type { LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Page, links as pageLinks } from "~/components/Page"
import type { Restaurant as RestaurantType } from "~/types"
import { logAndReturnError } from "~/utils/log"
import { getRestaurantById } from "~/utils/supabase"
import { Restaurant, links as restaurantLinks } from "~/components/Restaurant"

export interface RestaurantLoaderData {
  restaurant?: RestaurantType
  error?: Error
}

export function links() {
  return [...restaurantLinks(), ...pageLinks()]
}

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params
  if (!id) {
    return logAndReturnError("What restaurant is that?")
  }

  const { data: restaurant, error } = await getRestaurantById(id)

  if (error) {
    return logAndReturnError(
      `Error getting restaurant with id ${id} from Supabase`,
      error
    )
  }

  return { restaurant }
}

export default function RestaurantPage() {
  const { restaurant, error } = useLoaderData<RestaurantLoaderData>()

  if (error) {
    return <section className="container">{error?.message}</section>
  }

  if (!restaurant) {
    return null
  }

  return (
    <Page
      title={restaurant.name}
      subTitle={<address>{restaurant.address}</address>}
    >
      <Restaurant restaurant={restaurant} />
    </Page>
  )
}
