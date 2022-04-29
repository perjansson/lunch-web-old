import { Link, useLoaderData } from "@remix-run/react"

import { Page, links as pageLinks } from "~/components/Page"
import styles from "~/styles/day-history.css"
import type { LoaderFunction } from "@remix-run/node"
import { getAllReservations } from "~/utils/supabase"
import type { Reservation } from "~/types"
import type { Error } from "~/types"
import { logAndReturnError } from "~/utils/log"
import { parseISO } from "date-fns"

export function links() {
  return [...pageLinks(), { rel: "stylesheet", href: styles }]
}

interface LoaderData {
  reservations?: Reservation[]
  error?: Error
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const { data: reservations, error } = await getAllReservations()

  if (error) {
    return logAndReturnError("Error getting restaurants from Supabase", error)
  }

  return { reservations: reservations.sort(sortByWhen) }
}

export default function DayHistory() {
  const { reservations, error } = useLoaderData<LoaderData>()

  if (error) {
    return <section className="container">{error?.message}</section>
  }

  if (!reservations) {
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
        {reservations?.map((reservation) => {
          return (
            <div key={reservation.id} className="recommendation">
              <div>{reservation.when}</div>
              <Link
                to={`/restaurant/${reservation.Restaurant?.id}`}
                className="restaurantName"
              >
                {reservation.Restaurant?.name}
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
  reservationA: Reservation,
  reservationB: Reservation
): number {
  const a = parseISO(reservationA.when)
  const b = parseISO(reservationB.when)

  return b.getTime() - a.getTime()
}
