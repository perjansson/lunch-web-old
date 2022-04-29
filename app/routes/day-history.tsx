import { Link, useLoaderData } from "@remix-run/react"

import { Page, links as pageLinks } from "~/components/Page"
import styles from "~/styles/day-history.css"
import type { LoaderFunction } from "@remix-run/node"
import { getAllRecommendations } from "~/utils/supabase"
import type { Recommendation } from "~/types"
import type { Error } from "~/types"
import { logAndReturnError } from "~/utils/log"
import { parseISO } from "date-fns"

export function links() {
  return [...pageLinks(), { rel: "stylesheet", href: styles }]
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
  const { recommendations, error } = useLoaderData<LoaderData>()

  if (error) {
    return <section className="container">{error?.message}</section>
  }

  if (!recommendations) {
    return null
  }

  return (
    <Page title="All recommendations">
      <div>
        <div className="recommendation header">
          <div>Date</div>
          <div>Restaurant</div>
          <div className="participate">Did you join?</div>
        </div>
        {recommendations?.map((recommendation) => {
          return (
            <div key={recommendation.id} className="recommendation">
              <div>{recommendation.when}</div>
              <Link
                to={`/restaurant/${recommendation.Restaurant?.id}`}
                className="restaurantName"
              >
                {recommendation.Restaurant?.name}
              </Link>
              <div className="participate"></div>
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
