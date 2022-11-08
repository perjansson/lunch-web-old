import { Link, useLoaderData } from "@remix-run/react"

import { Restaurant, links as restaurantLinks } from "~/components/Restaurant"
import { Page, links as pageLinks } from "~/components/Page"
import type { RandomRestaurantLoaderData } from "~/loaders/restaurantsLoaders"
import { randomRestaurantLoader } from "~/loaders/restaurantsLoaders"
import styles from "~/styles/index.css"
import type { LoaderFunction } from "@remix-run/node"
import {
  createRecommendationAt,
  getAllRecommendations,
  getRecommendationAt,
} from "~/utils/supabase"
import type { Recommendation } from "~/types"

const NUMBER_OF_DAYS_BEFORE_POSSIBLE_TO_RECOMMEND_AGAIN = 28

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

export interface LoaderData extends RandomRestaurantLoaderData {
  recommendation?: Recommendation
}

const pages: PageType[] = [
  { url: "random", title: "Check out another random restaurant?" },
  { url: "list", title: "List all restaurants available?" },
  { url: "recommendation-history", title: "View the recommendation history?" },
]

export const loader: LoaderFunction = async (
  dataFunctionArgs
): Promise<LoaderData> => {
  const recommendation = await getRecommendationAt(new Date())

  if (recommendation?.Restaurant) {
    const previousRecommendationsForRestaurant = await getAllRecommendations({
      restaurantId: recommendation?.Restaurant.id,
    })

    recommendation.Restaurant.Recommendation =
      previousRecommendationsForRestaurant.data ?? undefined

    return {
      recommendation,
    }
  }

  const randomRestaurantResponse = await randomRestaurantLoader({
    ...dataFunctionArgs,
    sinceWhen: NUMBER_OF_DAYS_BEFORE_POSSIBLE_TO_RECOMMEND_AGAIN,
    hasLunch: true,
  })

  const { restaurant } = randomRestaurantResponse
  if (process.env.NODE_ENV === "production" && restaurant) {
    await createRecommendationAt(restaurant, new Date())
  }

  return {
    ...randomRestaurantResponse,
  }
}

export default function Index() {
  const { recommendation, restaurant, error } = useLoaderData<LoaderData>()

  // Uncomment to update directions for all restaurant.
  // PLEASE NOTE: THIS COSTS MONEY FOR GOOGLE CLOUD
  // useEffect(() => {
  //   getAllRestaurantsWithDirections(OFFICE_RIVER_SIDE)
  // }, [])

  if (error) {
    return <section className="container">{error?.message}</section>
  }

  const restaurantOfTheDay = recommendation?.Restaurant ?? restaurant

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
              <Link key={page.url} to={`/${page.url}`}>
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
