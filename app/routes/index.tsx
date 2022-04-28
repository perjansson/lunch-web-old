import { Link, useLoaderData } from "@remix-run/react"

import { Restaurant, links as restaurantLinks } from "~/components/Restaurant"
import { Page, links as pageLinks } from "~/components/Page"
import type { RandomRestaurantLoaderData } from "~/loaders/restaurantsLoaders"
import { randomRestaurantLoader } from "~/loaders/restaurantsLoaders"
import styles from "~/styles/index.css"
import type { LoaderFunction } from "@remix-run/node"
import { createReservationAt, getReservationAt } from "~/utils/supabase"
import type { Reservation } from "~/types"

const DEFAULT_NUMBER_OF_DAYS_BEFORE_POSSIBLE_TO_RESERVE_AGAIN = 14

export function links() {
  return [
    ...restaurantLinks(),
    ...pageLinks(),
    { rel: "stylesheet", href: styles },
  ]
}

interface PageType {
  url: string
  title: string
}

interface LoaderData extends RandomRestaurantLoaderData {
  reservation?: Reservation
}

const pages: PageType[] = [
  { url: "/random", title: "Check out another random restaurant?" },
]

export const loader: LoaderFunction = async (
  dataFunctionArgs
): Promise<LoaderData> => {
  const reservation = await getReservationAt(new Date())

  if (reservation?.Restaurant) {
    return {
      reservation,
    }
  }

  const randomRestaurantResponse = await randomRestaurantLoader({
    ...dataFunctionArgs,
    notReservedLastDays:
      DEFAULT_NUMBER_OF_DAYS_BEFORE_POSSIBLE_TO_RESERVE_AGAIN,
  })

  const { restaurant } = randomRestaurantResponse
  if (restaurant) {
    createReservationAt(restaurant, new Date())
  }

  return {
    ...randomRestaurantResponse,
  }
}

export default function Random() {
  const { reservation, restaurant, error } = useLoaderData<LoaderData>()

  // Uncomment to update directions for all restaurant.
  // PLEASE NOTE: THIS COSTS MONEY FOR GOOGLE CLOUD
  // useEffect(() => {
  //   getAllRestaurantsWithDirections(OFFICE_RIVER_SIDE)
  // }, [])

  if (error) {
    return <section className="container">{error?.message}</section>
  }

  const restaurantOfTheDay = reservation?.Restaurant ?? restaurant

  if (!restaurantOfTheDay) {
    return (
      <section className="container">
        <div>
          Hmm, something went wrong.{" "}
          <a href="#" onClick={() => window.location.reload(true)}>
            Try again?
          </a>
        </div>
      </section>
    )
  }

  return (
    <Page
      preTitle={`Restaurant of the day (${new Date().toLocaleDateString()}) is`}
      title={restaurantOfTheDay.name}
      subTitle={
        <>
          <address>{restaurantOfTheDay.address}</address>
          <p className="links">
            Was this not a great choice?{" "}
            {pages.map((page) => (
              <Link key={page.url} to={page.url}>
                {page.title}
              </Link>
            ))}
          </p>
        </>
      }
    >
      <Restaurant restaurant={restaurantOfTheDay} />
    </Page>
  )
}
