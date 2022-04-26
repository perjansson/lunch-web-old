import type { MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Reaktor Turku Lunch Web",
  viewport: "width=device-width,initial-scale=1",
})

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/modern-css-reset@1.4.0/dist/reset.min.css",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
    },
  ]
}

export const loader = () => {
  return {
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    },
  }
}

export default function App() {
  const { env } = useLoaderData()

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        ></script>
      </body>
    </html>
  )
}
