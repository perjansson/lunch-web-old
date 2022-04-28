import React from "react"
import styles from "~/styles/page.css"

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export const Page: React.FC<{
  title: string
  subTitle: React.ReactNode
}> = ({ title, subTitle, children }) => {
  return (
    <section className="container">
      <header className="header">
        <h1 className="title">{title}</h1>
        {subTitle}
      </header>
      {children}
    </section>
  )
}
