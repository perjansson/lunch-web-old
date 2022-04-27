import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"

export const loader: LoaderFunction = ({ request }) => {
  const searchParams = new URL(request.url).searchParams.toString()
  return redirect(`random${searchParams ? `?${searchParams}` : ""}`)
}
