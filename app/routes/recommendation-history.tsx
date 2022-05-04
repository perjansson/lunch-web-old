import { Link, useFetcher, useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/node"
import { parseISO } from "date-fns"

import { Page, links as pageLinks } from "~/components/Page"
import styles from "~/styles/recommendation-history.css"
import { getAllRecommendations } from "~/utils/supabase"
import type { Recommendation } from "~/types"
import type { Error } from "~/types"
import { logAndReturnError } from "~/utils/log"
import { AddRating, links as dialogLinks } from "~/components/AddRating"
import { calculateRatingForRecommendation } from "~/utils/ratings"

export function links() {
  return [...pageLinks(), ...dialogLinks(), { rel: "stylesheet", href: styles }]
}

interface LoaderData {
  recommendations?: Recommendation[]
  error?: Error
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const { data: recommendations, error } = await getAllRecommendations()

  if (error) {
    return logAndReturnError("Error getting restaurants from Supabase", error)
  }

  return { recommendations: recommendations.sort(sortByWhen) }
}

export default function DayHistory() {
  const { recommendations: loaderRecommendations, error } =
    useLoaderData<LoaderData>()
  const fetcher = useFetcher<LoaderData>()

  if (error) {
    return <section className="container">{error?.message}</section>
  }

  const recommendations = fetcher.data?.recommendations || loaderRecommendations

  if (!recommendations) {
    return null
  }

  return (
    <Page title="All recommendations">
      <div>
        <div className="recommendation header">
          <div className="date">Date</div>
          <div className="restaurantName">Restaurant</div>
          <div className="rating">Visit rating</div>
          <div>Did you visit?</div>
        </div>
        {recommendations?.map((recommendation) => {
          const { starsComponent, averageRating } =
            calculateRatingForRecommendation(recommendation)

          return (
            <div key={recommendation.id} className="recommendation">
              <div className="date">{recommendation.when}</div>
              <Link
                to={`/restaurant/${recommendation.Restaurant?.id}`}
                className="restaurantName"
              >
                {recommendation.Restaurant!.name}
              </Link>
              <div className="rating">
                <div className="star">{starsComponent}</div>
                <div className="text">{averageRating}</div>
              </div>
              <div>
                <AddRating
                  recommendation={recommendation}
                  triggerText="Add rating"
                  onRatingSaved={() => {
                    fetcher.load("/recommendation-history")
                  }}
                ></AddRating>
              </div>
            </div>
          )
        })}
      </div>
    </Page>
  )
}

function sortByWhen(
  recommendationA: Recommendation,
  recommendationB: Recommendation
): number {
  const a = parseISO(recommendationA.when)
  const b = parseISO(recommendationB.when)

  return b.getTime() - a.getTime()
}
