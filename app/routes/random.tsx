import { useLoaderData } from "@remix-run/react"

import { Restaurant, links as restaurantLinks } from "~/components/Restaurant"
import { Page, links as pageLinks } from "~/components/Page"
import type { RandomRestaurantLoaderData } from "~/loaders/restaurantsLoaders"
export { randomRestaurantLoader as loader } from "~/loaders/restaurantsLoaders"

export function links() {
  return [...restaurantLinks(), ...pageLinks()]
}

export default function Random() {
  const { restaurant, error } = useLoaderData<RandomRestaurantLoaderData>()

  if (!restaurant || error) {
    return <section className="container">{error?.message}</section>
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
